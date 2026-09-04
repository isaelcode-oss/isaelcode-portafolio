import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { CONTACT, DEFAULT_WHATSAPP_URL, buildWhatsAppUrl } from '../../config/site.js'

export default function Contact() {
  const [form, setForm]     = useState({ name: '', email: '', message: '' })
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    const message = [
      'Hola Isael, vi isaelcode.dev y quiero conversar sobre un proyecto.',
      `Nombre: ${form.name.trim()}`,
      `Email: ${form.email.trim()}`,
      `Proyecto: ${form.message.trim()}`,
    ].join('\n')
    window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer')
  }

  const inputCls =
    'w-full rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/20 focus:outline-none transition-all duration-300'
  const inputStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.09)',
  }
  return (
    <section id="contact" className="section-pad relative">
      <div className="max-w-xl mx-auto px-6">

        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85 }}
          className="text-center mb-14"
        >
          <p className="eyebrow tracking-[0.3em]">
            CONTACTO
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-5">
            ¿Tienes un{' '}
            <span className="gradient-text">proyecto</span>?
          </h2>
          <p className="text-white/45">
            Hablemos sobre cómo puedo ayudarte a construir tu plataforma.
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.2 }}
          className="glass rounded-2xl p-8 glow-cyan"
          style={{ border: '1px solid rgba(0,245,255,0.12)' }}
        >
            <form onSubmit={submit} className="space-y-5">
              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { key: 'name',  type: 'text',  label: 'NOMBRE',  ph: 'Tu nombre' },
                  { key: 'email', type: 'email', label: 'EMAIL',   ph: 'tu@email.com' },
                ].map(({ key, type, label, ph }) => (
                  <div key={key}>
                    <label htmlFor={`contact-${key}`} className="block text-xs text-white/35 mb-2 tracking-widest">{label}</label>
                    <input
                      id={`contact-${key}`}
                      type={type}
                      required
                      minLength={key === 'name' ? 2 : undefined}
                      maxLength={key === 'name' ? 80 : 254}
                      autoComplete={key}
                      value={form[key]}
                      onChange={update(key)}
                      placeholder={ph}
                      className={inputCls}
                      style={inputStyle}
                    />
                  </div>
                ))}
              </div>

              {/* Message */}
              <div>
                <label htmlFor="contact-message" className="block text-xs text-white/35 mb-2 tracking-widest">MENSAJE</label>
                <textarea
                  id="contact-message"
                  required
                  minLength={20}
                  maxLength={1500}
                  rows={5}
                  value={form.message}
                  onChange={update('message')}
                  placeholder="Cuéntame sobre tu proyecto..."
                  className={`${inputCls} resize-none`}
                  style={inputStyle}
                />
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03, boxShadow: '0 0 35px rgba(0,245,255,0.45)' }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-4 font-bold rounded-xl text-sm tracking-widest transition-all"
                style={{ background: '#00F5FF', color: '#000000' }}
              >
                CONTINUAR EN WHATSAPP →
              </motion.button>
              <p className="text-white/30 text-xs text-center leading-relaxed">
                Al continuar se abrirá WhatsApp con tu mensaje preparado. Nada se almacena en esta web.
              </p>
            </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
            <span className="text-white/25 text-xs">o contáctame en</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
          </div>

          {/* Quick contact buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <motion.a
              href={DEFAULT_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04, boxShadow: '0 0 25px rgba(37,211,102,0.35)' }}
              className="flex items-center justify-center gap-2.5 w-full py-4 rounded-xl text-sm font-bold transition-all"
              style={{ background: '#25D366', color: '#000' }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              WHATSAPP
            </motion.a>

            <motion.a
              href={`mailto:${CONTACT.email}`}
              whileHover={{ scale: 1.04, boxShadow: '0 0 20px rgba(0,229,255,0.2)' }}
              className="flex items-center justify-center gap-2.5 w-full py-4 glass rounded-xl text-sm font-medium text-white/55 hover:text-white transition-all"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              {CONTACT.email}
            </motion.a>
          </div>
        </motion.div>

        {/* Lema + Footer */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mt-14"
        >
          <div
            className="inline-block glass rounded-2xl px-8 py-5 mb-6"
            style={{ border: '1px solid rgba(0,229,255,0.08)' }}
          >
            <div className="text-3xl mb-3">☕</div>
            <p className="text-white/60 text-sm italic leading-relaxed max-w-xs mx-auto">
              "El buen código, como el café, se construye con{' '}
              <span style={{ color: '#00E5FF' }}>paciencia</span>{' '}
              y{' '}
              <span style={{ color: '#00FF85' }}>pasión</span>"
            </p>
            <p className="text-white/25 text-xs mt-2 tracking-widest">— Isael Patiño</p>
          </div>
          <p className="text-white/15 text-xs tracking-[0.2em]">
            © {new Date().getFullYear()} isaelcode.dev · República Dominicana
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs text-white/35">
            <a href="/privacidad.html" className="hover:text-white">Privacidad</a>
            <a href="/terminos.html" className="hover:text-white">Términos</a>
            <a href="/aviso-legal.html" className="hover:text-white">Aviso legal</a>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
