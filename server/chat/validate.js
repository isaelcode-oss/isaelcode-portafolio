// Validación estricta del cuerpo que llega a /api/chat. Todo lo que manda el
// navegador es entrada del atacante: se acota en cantidad, tamaño y forma.

export const LIMITS = Object.freeze({
  maxMessages: 24,
  maxMessageChars: 1500,
  maxTotalChars: 12000,
})

const ROLES = new Set(['user', 'assistant'])
const MAX_SIG_LENGTH = 120
// Caracteres de control salvo salto de línea (\n) y tabulación (\t).
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g

export class ValidationError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ValidationError'
    this.status = 400
  }
}

export function sanitizeText(value) {
  return value.replace(CONTROL_CHARS, '').trim()
}

// Devuelve una copia limpia de los mensajes o lanza ValidationError.
export function validateChatBody(body) {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    throw new ValidationError('El cuerpo debe ser un objeto JSON.')
  }
  const { messages } = body
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new ValidationError('Se requiere una lista de mensajes.')
  }
  if (messages.length > LIMITS.maxMessages) {
    throw new ValidationError(`Máximo ${LIMITS.maxMessages} mensajes por conversación.`)
  }

  let total = 0
  const clean = messages.map((entry, index) => {
    if (entry === null || typeof entry !== 'object' || Array.isArray(entry)) {
      throw new ValidationError(`Mensaje ${index} inválido.`)
    }
    if (!ROLES.has(entry.role)) {
      throw new ValidationError(`Rol inválido en el mensaje ${index}.`)
    }
    if (typeof entry.content !== 'string') {
      throw new ValidationError(`El contenido del mensaje ${index} debe ser texto.`)
    }
    if (entry.content.length > LIMITS.maxMessageChars) {
      throw new ValidationError(`El mensaje ${index} supera ${LIMITS.maxMessageChars} caracteres.`)
    }
    const content = sanitizeText(entry.content)
    if (content.length === 0) {
      throw new ValidationError(`El mensaje ${index} está vacío.`)
    }
    total += content.length
    if (entry.role === 'assistant') {
      // La firma la verifica el handler con el secreto; aquí solo se acota su forma.
      if (typeof entry.sig !== 'string' || entry.sig.length === 0 || entry.sig.length > MAX_SIG_LENGTH) {
        throw new ValidationError(`El mensaje ${index} del asistente no está firmado.`)
      }
      return { role: 'assistant', content, sig: entry.sig }
    }
    return { role: 'user', content }
  })

  if (total > LIMITS.maxTotalChars) {
    throw new ValidationError(`La conversación supera ${LIMITS.maxTotalChars} caracteres.`)
  }
  if (clean[0].role !== 'user') {
    throw new ValidationError('La conversación debe empezar con un mensaje del usuario.')
  }
  if (clean[clean.length - 1].role !== 'user') {
    throw new ValidationError('El último mensaje debe ser del usuario.')
  }
  for (let i = 1; i < clean.length; i++) {
    if (clean[i].role === clean[i - 1].role) {
      throw new ValidationError('Los mensajes deben alternar entre usuario y asistente.')
    }
  }
  return clean
}
