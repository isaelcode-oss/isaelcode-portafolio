import { randomUUID } from 'node:crypto'
import Anthropic from '@anthropic-ai/sdk'
import { validateChatBody, ValidationError } from '../server/chat/validate.js'
import { SlidingWindowLimiter, clientKey } from '../server/chat/rateLimit.js'
import { signAssistantTurn, verifyAssistantTurn } from '../server/chat/sign.js'
import { MAX_OUTPUT_TOKENS, MODEL, REQUEST_TIMEOUT_MS, SYSTEM_PROMPT } from '../server/chat/prompt.js'

// Límites por instancia: 20 mensajes por IP y 300 globales cada 10 minutos.
const limiter = new SlidingWindowLimiter({ windowMs: 10 * 60 * 1000, maxPerKey: 20, maxGlobal: 300 })

const MAX_BODY_BYTES = 64 * 1024

let client = null
function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY no está configurada')
  }
  if (!client) {
    // Un solo intento: reintentar un stream de chat duplica el tiempo y el
    // coste, y el visitante puede reenviar. 25 s cabe en maxDuration=30.
    client = new Anthropic({ timeout: REQUEST_TIMEOUT_MS, maxRetries: 0 })
  }
  return client
}

function getSigningSecret() {
  const secret = process.env.CHAT_SIGNING_SECRET
  if (typeof secret !== 'string' || secret.length < 32) {
    throw new Error('CHAT_SIGNING_SECRET no está configurada o es demasiado corta')
  }
  return secret
}

function log(entry) {
  // JSON en una línea, sin contenido de la conversación.
  console.log(JSON.stringify({ service: 'chat', ...entry }))
}

// Resume un error para el log sin volcar mensajes del proveedor, que en
// errores de validación podrían citar texto de la conversación.
function describeError(err) {
  if (err instanceof Anthropic.APIError) {
    return { status: err.status ?? null, type: err.error?.error?.type ?? err.name }
  }
  return { status: null, type: err.name, message: String(err.message).slice(0, 80) }
}

async function readJsonBody(req) {
  // Vercel entrega req.body ya parseado; la rama del stream sirve para
  // cualquier otro runtime Node (y para el arnés local).
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'string') return JSON.parse(req.body)
    return req.body
  }
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > MAX_BODY_BYTES) throw new ValidationError('Cuerpo demasiado grande.')
    chunks.push(chunk)
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

function sendJson(res, status, payload) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(payload))
}

function sseFrame(res, payload) {
  if (res.writableEnded || res.destroyed) return
  res.write(`data: ${JSON.stringify(payload)}\n\n`)
}

export default async function handler(req, res) {
  const requestId = randomUUID()
  const startedAt = Date.now()
  res.setHeader('X-Request-Id', requestId)
  const done = (status, reason, extra = {}) => log({ requestId, status, reason, ms: Date.now() - startedAt, ...extra })

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return sendJson(res, 405, { error: 'Método no permitido.' })
  }

  // Un POST con JSON obliga a preflight CORS desde otros orígenes, y como el
  // endpoint no responde CORS, el navegador lo bloquea. Sec-Fetch-Site lo pone
  // el navegador y refuerza eso; no es autorización (un cliente no navegador
  // lo omite) y por eso no sustituye al rate limiting.
  const contentType = String(req.headers['content-type'] || '').toLowerCase()
  if (!contentType.startsWith('application/json')) {
    done(415, 'content_type')
    return sendJson(res, 415, { error: 'Se requiere application/json.' })
  }
  const fetchSite = req.headers['sec-fetch-site']
  if (fetchSite === 'cross-site') {
    done(403, 'cross_site')
    return sendJson(res, 403, { error: 'Origen no permitido.' })
  }

  const contentLength = req.headers['content-length']
  if (contentLength === undefined) {
    done(411, 'no_content_length')
    return sendJson(res, 411, { error: 'Se requiere Content-Length.' })
  }
  if (Number(contentLength) > MAX_BODY_BYTES) {
    done(413, 'body_too_large')
    return sendJson(res, 413, { error: 'Cuerpo demasiado grande.' })
  }

  const key = clientKey(req.headers)
  const verdict = limiter.check(key.value)
  if (!verdict.allowed) {
    res.setHeader('Retry-After', String(Math.ceil(verdict.retryAfterMs / 1000)))
    done(429, `rate_limit_${verdict.reason}`, { keySource: key.source })
    return sendJson(res, 429, { error: 'Demasiadas consultas seguidas. Espera un momento o escribe por WhatsApp.' })
  }

  let secret
  let anthropic
  try {
    secret = getSigningSecret()
    anthropic = getClient()
  } catch (err) {
    done(503, 'not_configured', describeError(err))
    return sendJson(res, 503, { error: 'El asistente no está configurado todavía.' })
  }

  let messages
  try {
    messages = validateChatBody(await readJsonBody(req))
  } catch (err) {
    const status = err instanceof ValidationError ? err.status : 400
    done(status, 'invalid_body')
    return sendJson(res, status, { error: err instanceof ValidationError ? err.message : 'JSON inválido.' })
  }

  // Cada turno del asistente debe traer la firma que este servidor emitió.
  for (const turn of messages) {
    if (turn.role === 'assistant' && !verifyAssistantTurn(secret, turn.content, turn.sig)) {
      done(400, 'bad_signature')
      return sendJson(res, 400, { error: 'La conversación no es válida. Recarga la página para empezar de nuevo.' })
    }
  }
  const history = messages.map(({ role, content }) => ({ role, content }))

  res.statusCode = 200
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('X-Accel-Buffering', 'no')
  res.flushHeaders?.()

  let stream = null
  let clientGone = false
  // Si el visitante cierra, se corta la generación para no pagar tokens que
  // nadie va a leer.
  req.on('close', () => { clientGone = true; stream?.abort() })

  let reply = ''
  try {
    // Haiku 4.5 no admite output_config.effort ni el parámetro fallbacks, así
    // que la petición se mantiene mínima. La salida sigue siendo entrada no
    // confiable: solo se reenvían deltas de texto y se comprueba stop_reason.
    stream = anthropic.messages.stream({
      model: MODEL,
      max_tokens: MAX_OUTPUT_TOKENS,
      system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
      messages: history,
    })

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        reply += event.delta.text
        sseFrame(res, { type: 'delta', text: event.delta.text })
      }
    }

    const final = await stream.finalMessage()
    if (final.stop_reason === 'refusal') {
      sseFrame(res, { type: 'error', message: 'No puedo ayudarte con eso. Escríbele a Isael por WhatsApp.' })
    } else {
      sseFrame(res, { type: 'done', sig: signAssistantTurn(secret, reply) })
    }
    done(200, 'ok', {
      model: final.model, stop: final.stop_reason,
      inputTokens: final.usage.input_tokens, outputTokens: final.usage.output_tokens,
      cacheRead: final.usage.cache_read_input_tokens ?? 0, outputChars: reply.length, keySource: key.source,
    })
  } catch (err) {
    if (clientGone) {
      done(499, 'client_closed', { outputChars: reply.length })
    } else {
      let message = 'El asistente no está disponible ahora mismo.'
      let reason = 'provider_error'
      if (err instanceof Anthropic.RateLimitError) {
        message = 'El asistente está saturado. Intenta en un minuto.'
        reason = 'provider_rate_limit'
      } else if (err instanceof Anthropic.APIConnectionTimeoutError) {
        reason = 'provider_timeout'
      } else if (err instanceof Anthropic.AuthenticationError) {
        reason = 'provider_auth'
      } else if (err instanceof Anthropic.APIError) {
        reason = `provider_${err.status}`
      }
      done(502, reason, describeError(err))
      sseFrame(res, { type: 'error', message })
    }
  } finally {
    if (!res.writableEnded) res.end()
  }
}
