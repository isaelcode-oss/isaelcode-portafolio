import { createHmac, timingSafeEqual } from 'node:crypto'

// El historial de la conversación lo guarda el navegador y lo reenvía en cada
// turno. Sin esto, cualquiera podría inventar turnos del asistente y usarlos
// para saltarse las reglas del prompt o convertir el endpoint en un proxy
// gratuito. Cada turno que el servidor emite va firmado con HMAC y caduca.

export const SIGNATURE_TTL_MS = 24 * 60 * 60 * 1000
export const MAX_SIGNATURE_LENGTH = 120

function digest(secret, issuedAt, content) {
  return createHmac('sha256', secret).update(`${issuedAt}\n${content}`).digest('base64url')
}

export function signAssistantTurn(secret, content, now = Date.now()) {
  if (typeof secret !== 'string' || secret.length < 32) {
    throw new Error('CHAT_SIGNING_SECRET debe tener al menos 32 caracteres')
  }
  return `${now}.${digest(secret, now, content)}`
}

// Devuelve true solo si la firma es válida, corresponde a este contenido y no
// ha caducado. Nunca lanza: una firma rota es entrada del atacante.
export function verifyAssistantTurn(secret, content, signature, now = Date.now()) {
  if (typeof signature !== 'string' || signature.length > MAX_SIGNATURE_LENGTH) return false
  const dot = signature.indexOf('.')
  if (dot <= 0) return false
  const issuedAt = Number(signature.slice(0, dot))
  if (!Number.isSafeInteger(issuedAt) || issuedAt > now + 60_000 || now - issuedAt > SIGNATURE_TTL_MS) return false
  const expected = Buffer.from(digest(secret, issuedAt, content))
  const given = Buffer.from(signature.slice(dot + 1))
  if (expected.length !== given.length) return false
  return timingSafeEqual(expected, given)
}
