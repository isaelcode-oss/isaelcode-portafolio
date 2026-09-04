import { randomUUID } from 'node:crypto'
import Anthropic from '@anthropic-ai/sdk'
import { validateChatBody, ValidationError } from '../server/chat/validate.js'
import { SlidingWindowLimiter, clientKey } from '../server/chat/rateLimit.js'
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
    client = new Anthropic({ timeout: REQUEST_TIMEOUT_MS, maxRetries: 1 })
  }
  return client
}

function log(entry) {
  // JSON en una línea, sin contenido de la conversación.
  console.log(JSON.stringify({ service: 'chat', ...entry }))
}

async function readJsonBody(req) {
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
  res.write(`data: ${JSON.stringify(payload)}\n\n`)
}

export default async function handler(req, res) {
  const requestId = randomUUID()
  const startedAt = Date.now()
  res.setHeader('X-Request-Id', requestId)

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return sendJson(res, 405, { error: 'Método no permitido.' })
  }

  const contentLength = Number(req.headers['content-length'] || 0)
  if (contentLength > MAX_BODY_BYTES) {
    return sendJson(res, 413, { error: 'Cuerpo demasiado grande.' })
  }

  const key = clientKey(req.headers)
  const verdict = limiter.check(key)
  if (!verdict.allowed) {
    res.setHeader('Retry-After', String(Math.ceil(verdict.retryAfterMs / 1000)))
    log({ requestId, status: 429, reason: verdict.reason, ms: Date.now() - startedAt })
    return sendJson(res, 429, { error: 'Demasiadas consultas seguidas. Espera un momento o escribe por WhatsApp.' })
  }

  let messages
  try {
    messages = validateChatBody(await readJsonBody(req))
  } catch (err) {
    const status = err instanceof ValidationError ? err.status : 400
    log({ requestId, status, reason: 'invalid_body', ms: Date.now() - startedAt })
    return sendJson(res, status, { error: err instanceof ValidationError ? err.message : 'JSON inválido.' })
  }

  let anthropic
  try {
    anthropic = getClient()
  } catch (err) {
    log({ requestId, status: 503, reason: 'missing_api_key', ms: Date.now() - startedAt })
    return sendJson(res, 503, { error: 'El asistente no está configurado todavía.' })
  }

  res.statusCode = 200
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('X-Accel-Buffering', 'no')
  res.flushHeaders?.()

  let outputChars = 0
  try {
    // fallbacks: "default" reintenta en otro modelo si el clasificador de
    // seguridad rechaza una consulta legítima, sin lógica en el cliente.
    const stream = anthropic.beta.messages.stream({
      model: MODEL,
      max_tokens: MAX_OUTPUT_TOKENS,
      system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
      messages,
      output_config: { effort: 'low' },
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
    })

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        outputChars += event.delta.text.length
        sseFrame(res, { type: 'delta', text: event.delta.text })
      }
    }

    const final = await stream.finalMessage()
    if (final.stop_reason === 'refusal') {
      sseFrame(res, { type: 'error', message: 'No puedo ayudarte con eso. Escríbele a Isael por WhatsApp.' })
    } else {
      sseFrame(res, { type: 'done' })
    }
    log({
      requestId, status: 200, model: final.model, stop: final.stop_reason,
      inputTokens: final.usage.input_tokens, outputTokens: final.usage.output_tokens,
      cacheRead: final.usage.cache_read_input_tokens ?? 0, outputChars,
      ms: Date.now() - startedAt,
    })
  } catch (err) {
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
    log({ requestId, status: 502, reason, error: err.message, ms: Date.now() - startedAt })
    sseFrame(res, { type: 'error', message })
  } finally {
    res.end()
  }
}
