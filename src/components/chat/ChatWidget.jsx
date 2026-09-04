import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CONTACT, DEFAULT_WHATSAPP_URL } from '../../config/site.js'

const SUGGESTIONS = [
  '¿Qué servicios ofreces?',
  '¿Puedes automatizar mi facturación?',
  '¿Cómo integras IA en una empresa?',
  '¿Cómo empezamos?',
]

const WELCOME = {
  role: 'assistant',
  content: 'Hola, soy el asistente de isaelcode.dev. Cuéntame qué necesita tu empresa y te oriento sobre cómo puede ayudarte Isael.',
}

const MAX_INPUT = 1500

// Lee el stream SSE del servidor y entrega cada delta de texto. Devuelve la
// firma del turno completo; si el stream se corta antes del frame `done`, la
// respuesta parcial no vale y se lanza.
async function readStream(response, onDelta) {
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  for (;;) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    let index
    while ((index = buffer.indexOf('\n\n')) >= 0) {
      const frame = buffer.slice(0, index)
      buffer = buffer.slice(index + 2)
      const line = frame.split('\n').find((l) => l.startsWith('data: '))
      if (!line) continue
      let event
      try {
        event = JSON.parse(line.slice(6))
      } catch {
        throw new Error('El asistente envió una respuesta que no se pudo leer.')
      }
      if (event.type === 'delta') onDelta(event.text)
      else if (event.type === 'error') throw new Error(event.message)
      else if (event.type === 'done') return event.sig
    }
  }
  throw new Error('La respuesta del asistente se cortó antes de terminar.')
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const listRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, busy, open])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const send = async (text) => {
    const content = text.trim()
    if (!content || busy) return
    setError(null)
    setInput('')

    // La conversación que se manda excluye el saludo local: el servidor
    // exige que empiece con un mensaje del usuario.
    const history = messages.filter((m) => m !== WELCOME)
    const outgoing = [...history, { role: 'user', content }]
    setMessages([WELCOME, ...outgoing])
    setBusy(true)

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 45_000)
    let reply = ''
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: outgoing }),
        signal: controller.signal,
      })
      if (!response.ok) {
        const detail = await response.json().catch(() => ({}))
        throw new Error(detail.error || `El asistente no está disponible (HTTP ${response.status}).`)
      }
      const sig = await readStream(response, (delta) => {
        reply += delta
        setMessages([WELCOME, ...outgoing, { role: 'assistant', content: reply }])
      })
      if (!reply) throw new Error('El asistente no devolvió respuesta.')
      // La firma acompaña al turno para que el servidor lo acepte en el siguiente envío.
      setMessages([WELCOME, ...outgoing, { role: 'assistant', content: reply, sig }])
    } catch (err) {
      const message = err.name === 'AbortError'
        ? 'El asistente tardó demasiado en responder.'
        : err.message
      setError(message)
      // Se retira la respuesta parcial para no dejar texto a medias como si fuera completo.
      setMessages([WELCOME, ...outgoing])
    } finally {
      clearTimeout(timer)
      setBusy(false)
    }
  }

  const onSubmit = (event) => {
    event.preventDefault()
    send(input)
  }

  const onKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      send(input)
    }
  }

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            key="launcher"
            type="button"
            className="chat-launcher"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: 1.5, duration: 0.4 } }}
            exit={{ opacity: 0, y: 20, scale: 0.9, transition: { duration: 0.15 } }}
            aria-label="Abrir asistente"
          >
            <span className="chat-launcher__pulse" aria-hidden="true" />
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
              <path d="M21 12a8 8 0 0 1-8 8H7l-4 3V12a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8z" />
              <circle cx="9" cy="12" r="1" fill="currentColor" /><circle cx="13" cy="12" r="1" fill="currentColor" /><circle cx="17" cy="12" r="1" fill="currentColor" />
            </svg>
            ¿Te ayudo?
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.section
            key="panel"
            className="chat-panel"
            role="dialog"
            aria-label="Asistente de isaelcode.dev"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <header className="chat-header">
              <div className="chat-header__avatar" aria-hidden="true">{'</>'}</div>
              <div>
                <div className="chat-header__title">Asistente isaelcode.dev</div>
                <div className="chat-header__status">Responde con IA · en segundos</div>
              </div>
              <button type="button" className="chat-close" onClick={() => setOpen(false)} aria-label="Cerrar asistente">✕</button>
            </header>

            <div className="chat-messages" ref={listRef} aria-live="polite">
              {messages.map((m, i) => (
                <div key={i} className={`chat-bubble chat-bubble--${m.role}`}>{m.content}</div>
              ))}
              {busy && messages[messages.length - 1]?.role === 'user' && (
                <div className="chat-bubble chat-bubble--assistant chat-typing" aria-label="Escribiendo">
                  <span /><span /><span />
                </div>
              )}
              {error && (
                <div className="chat-bubble chat-bubble--error" role="alert">
                  {error} Puedes escribir directo por{' '}
                  <a className="chat-whatsapp" href={DEFAULT_WHATSAPP_URL} target="_blank" rel="noopener noreferrer">WhatsApp</a>.
                </div>
              )}
            </div>

            {messages.length === 1 && (
              <div className="chat-suggestions">
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" className="chat-suggestion" onClick={() => send(s)} disabled={busy}>{s}</button>
                ))}
              </div>
            )}

            <form className="chat-form" onSubmit={onSubmit}>
              <textarea
                ref={inputRef}
                className="chat-input"
                rows={1}
                maxLength={MAX_INPUT}
                placeholder="Escribe tu pregunta…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                disabled={busy}
                aria-label="Mensaje"
              />
              <button type="submit" className="chat-send" disabled={busy || !input.trim()}>Enviar</button>
            </form>
            <p className="chat-footer">
              Asistente automático con IA; puede equivocarse. La conversación se procesa con Anthropic y no se guarda en esta web.
              Para hablar con Isael: <a href={DEFAULT_WHATSAPP_URL} target="_blank" rel="noopener noreferrer">WhatsApp {CONTACT.whatsappDisplay}</a>.
            </p>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  )
}
