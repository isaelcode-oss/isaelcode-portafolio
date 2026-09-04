import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { DEFAULT_WHATSAPP_URL } from '../../config/site.js'
import { useReducedMotion } from '../../hooks/useReducedMotion.js'

const ROLES = [
  'Software empresarial que opera de verdad',
  'Automatización que elimina trabajo manual',
  'IA aplicada con resultados medibles',
  'Integraciones entre tus sistemas',
]

const STACK_TAGS = ['Node.js', 'Python', 'React', 'TypeScript', 'PostgreSQL', 'Docker', 'AWS S3']

// Fragmentos de código flotando en los bordes, como en el logo.
const CODE_FLOATS = [
  { text: 'class Empresa {',        top: '10%', left: '3%',  delay: 0 },
  { text: '  automatizar(proceso)', top: '17%', left: '2%',  delay: 0.4 },
  { text: '  return resultado',     top: '24%', left: '4%',  delay: 0.8 },
  { text: 'await integrar(erp)',    top: '74%', left: '2%',  delay: 1.2 },
  { text: '</div>',                 top: '82%', left: '5%',  delay: 1.6 },
  { text: 'const ia = new Agente()', top: '11%', right: '2%', delay: 0.2 },
  { text: '  ia.clasificar(docs)',  top: '18%', right: '1%', delay: 0.6 },
  { text: '  ia.responder()',       top: '25%', right: '3%', delay: 1.0 },
  { text: 'queue.process(job)',     top: '76%', right: '2%', delay: 1.4 },
  { text: 'deploy --prod',          top: '84%', right: '4%', delay: 1.8 },
]

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
)

function TypeWriter({ texts, enabled }) {
  const [idx, setIdx] = useState(0)
  const [text, setText] = useState(enabled ? '' : texts[0])
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!enabled) return undefined
    const full = texts[idx]
    let timer
    if (!deleting) {
      if (text.length < full.length) {
        timer = setTimeout(() => setText(full.slice(0, text.length + 1)), 55)
      } else {
        timer = setTimeout(() => setDeleting(true), 2400)
      }
    } else if (text.length > 0) {
      timer = setTimeout(() => setText(text.slice(0, -1)), 28)
    } else {
      setDeleting(false)
      setIdx((i) => (i + 1) % texts.length)
    }
    return () => clearTimeout(timer)
  }, [text, deleting, idx, texts, enabled])

  return (
    <span className="typewriter" aria-live="polite">
      {text}
      {enabled && <span className="typewriter__cursor" aria-hidden="true">|</span>}
    </span>
  )
}

// Una letra que se desplaza con el mouse según su profundidad
function NeuralLetter({ char, depth, index, mouseX, mouseY, green }) {
  const tx = useTransform(mouseX, [-1, 1], [-depth * 20, depth * 20])
  const ty = useTransform(mouseY, [-1, 1], [-depth * 12, depth * 12])
  const sx = useSpring(tx, { stiffness: 90 - index * 2, damping: 18 })
  const sy = useSpring(ty, { stiffness: 90 - index * 2, damping: 18 })

  return (
    <motion.span
      style={{ x: sx, y: sy }}
      className={`neural-letter ${green ? 'neural-letter--green' : ''}`}
      initial={{ opacity: 0, y: 60, rotateX: -40 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.9, delay: 0.25 + index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.15, transition: { duration: 0.15 } }}
    >
      {char}
    </motion.span>
  )
}

function NeuralTitle({ text, interactive }) {
  const ref = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouse = (event) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set(((event.clientX - rect.left) / rect.width - 0.5) * 2)
    mouseY.set(((event.clientY - rect.top) / rect.height - 0.5) * 2)
  }
  const handleLeave = () => { mouseX.set(0); mouseY.set(0) }

  if (!interactive) {
    return (
      <h1 className="hero-title">
        isaelcode<span className="hero-title__dev">.dev</span>
      </h1>
    )
  }

  const chars = text.split('')
  const devStart = text.length - 4
  return (
    <h1
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      className="hero-title hero-title--neural"
      aria-label={text}
    >
      {chars.map((char, i) => (
        <NeuralLetter
          key={i}
          char={char}
          depth={0.4 + (i % 3) * 0.32}
          index={i}
          mouseX={mouseX}
          mouseY={mouseY}
          green={i >= devStart}
        />
      ))}
    </h1>
  )
}

export default function Hero() {
  const reduced = useReducedMotion()

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 hero-aurora pointer-events-none" />
      <div className="absolute inset-0 hero-rays pointer-events-none" aria-hidden="true" />

      {!reduced && CODE_FLOATS.map((c) => (
        <motion.div
          key={c.text + c.top}
          className="code-float hidden md:block"
          style={{ top: c.top, left: c.left, right: c.right }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0, 1, 1, 0.55, 1], y: [10, 0, -6, 0, -4] }}
          transition={{ delay: 1.6 + c.delay, duration: 9, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
          aria-hidden="true"
        >
          {c.text}
        </motion.div>
      ))}

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-24">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-badge glass rounded-full inline-flex items-center gap-2.5 px-5 py-2 mb-8"
        >
          <span className="hero-badge__dot" />
          <span className="text-sm text-white/55">Disponible para proyectos</span>
          <span className="text-white/20">•</span>
          <span className="hero-badge__location text-sm">🇩🇴 República Dominicana</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.9, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="mb-3 flex justify-center"
        >
          <span className="brand-mark brand-mark--glow text-3xl md:text-4xl font-bold select-none">{'</>'}</span>
        </motion.div>

        <div className="mb-5">
          <NeuralTitle text="isaelcode.dev" interactive={!reduced} />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="hero-roles mb-5"
        >
          <TypeWriter texts={ROLES} enabled={!reduced} />
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="text-white/45 text-lg leading-relaxed mb-10 max-w-xl mx-auto"
        >
          Diseño software, automatizaciones y soluciones de IA para empresas que necesitan
          operar mejor, conectar sus sistemas y eliminar trabajo manual.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-12"
        >
          <motion.a href="#contact" className="cta cta--primary cta--shine" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            AGENDAR DIAGNÓSTICO
          </motion.a>
          <motion.a
            href={DEFAULT_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cta cta--whatsapp"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <WhatsAppIcon />
            HABLAR POR WHATSAPP
          </motion.a>
          <motion.a href="#projects" className="cta cta--ghost glass" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            VER TRABAJO →
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.4 }}
          className="flex flex-wrap gap-2 justify-center"
        >
          {STACK_TAGS.map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4 + i * 0.06 }}
              whileHover={{ scale: 1.08, color: '#00e5ff', borderColor: 'rgba(0,229,255,0.5)' }}
              className="stack-tag glass rounded-full px-3 py-1.5 text-xs"
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2"
      >
        <span className="text-white/20 text-xs tracking-[0.3em]">SCROLL</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="scroll-cue-line w-px h-10"
        />
      </motion.div>
    </section>
  )
}
