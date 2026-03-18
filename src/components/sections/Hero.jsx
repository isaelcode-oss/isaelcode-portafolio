import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

const ROLES = [
  'Full-Stack Developer',
  'Backend Architect',
  'Platform Builder',
  'Python & Node.js Dev',
]

const STACK_TAGS = ['Node.js', 'Python', 'React', 'TypeScript', 'PostgreSQL', 'Docker', 'AWS S3']

// Floating code snippets that match the logo aesthetic
const CODE_FLOATS = [
  { text: 'class User {',      top: '8%',  left: '3%'  },
  { text: '  def update():',   top: '15%', left: '2%'  },
  { text: '  self = object',   top: '22%', left: '4%'  },
  { text: '</div>',            top: '78%', left: '2%'  },
  { text: '<div>',             top: '85%', left: '5%'  },
  { text: 'return data',       top: '72%', left: '1%'  },
  { text: '<div class="app">', top: '9%',  right: '2%' },
  { text: '  async fetchData()', top: '16%', right: '1%' },
  { text: '  </div>',          top: '23%', right: '3%' },
  { text: 'class User {',      top: '75%', right: '2%' },
  { text: '  setState({})',    top: '82%', right: '3%' },
  { text: '</div>',            top: '88%', right: '5%' },
]

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
)

function TypeWriter({ texts }) {
  const [idx, setIdx]           = useState(0)
  const [text, setText]         = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const full  = texts[idx]
    const delay = deleting ? 45 : 110
    const timer = setTimeout(() => {
      if (!deleting) {
        if (text.length < full.length) setText(full.slice(0, text.length + 1))
        else setTimeout(() => setDeleting(true), 2200)
      } else {
        if (text.length > 0) setText(text.slice(0, -1))
        else { setDeleting(false); setIdx((i) => (i + 1) % texts.length) }
      }
    }, delay)
    return () => clearTimeout(timer)
  }, [text, deleting, idx, texts])

  return (
    <span>
      {text}
      <span className="animate-pulse" style={{ color: '#00E5FF' }}>|</span>
    </span>
  )
}

// A single letter that follows the mouse with a parallax depth
function NeuralLetter({ char, depth, index, mouseX, mouseY, baseColor }) {
  const tx = useTransform(mouseX, [-1, 1], [-depth * 18, depth * 18])
  const ty = useTransform(mouseY, [-1, 1], [-depth * 10, depth * 10])
  const sx = useSpring(tx, { stiffness: 80 - index * 2, damping: 18 })
  const sy = useSpring(ty, { stiffness: 80 - index * 2, damping: 18 })

  const isGreen = baseColor === 'green'
  const hoverColor = isGreen ? '#00FF85' : '#00E5FF'
  const hoverGlow  = isGreen
    ? '0 0 30px rgba(0,255,133,0.9), 0 0 60px rgba(0,255,133,0.4)'
    : '0 0 30px rgba(0,229,255,0.9), 0 0 60px rgba(0,229,255,0.4)'

  return (
    <motion.span
      style={{
        x: sx, y: sy,
        display: 'inline-block',
        color: isGreen ? '#00FF85' : '#ffffff',
        textShadow: isGreen ? '0 0 18px rgba(0,255,133,0.6)' : 'none',
      }}
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.2 + index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="relative cursor-default select-none"
      whileHover={{
        color: hoverColor,
        textShadow: hoverGlow,
        scale: 1.12,
        transition: { duration: 0.15 },
      }}
    >
      {char}
    </motion.span>
  )
}

// Neural interactive title — letters move with mouse, .dev letters are green
function NeuralTitle({ text }) {
  const ref    = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouse = (e) => {
    const rect  = ref.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set(((e.clientX - rect.left) / rect.width  - 0.5) * 2)
    mouseY.set(((e.clientY - rect.top)  / rect.height - 0.5) * 2)
  }

  const handleLeave = () => { mouseX.set(0); mouseY.set(0) }

  const chars  = text.split('')
  // find where ".dev" starts — last 4 chars
  const devStart = text.length - 4  // ".dev" = 4 chars
  const depths = chars.map((_, i) => 0.4 + (i % 3) * 0.32)

  return (
    <div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ fontSize: 'clamp(3.4rem, 11vw, 9rem)', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em' }}
    >
      {chars.map((char, i) => (
        <NeuralLetter
          key={i}
          char={char}
          depth={depths[i]}
          index={i}
          mouseX={mouseX}
          mouseY={mouseY}
          baseColor={i >= devStart ? 'green' : 'white'}
        />
      ))}
    </div>
  )
}

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero glow — centred aurora */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 55% at 50% 45%, rgba(0,229,255,0.06) 0%, transparent 65%),
            radial-gradient(ellipse 50% 35% at 30% 60%, rgba(157,0,255,0.07) 0%, transparent 55%),
            radial-gradient(ellipse 40% 30% at 70% 35%, rgba(0,255,133,0.05) 0%, transparent 50%)
          `,
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-24">

        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2.5 glass rounded-full px-5 py-2 mb-8"
          style={{ border: '1px solid rgba(0,245,255,0.18)' }}
        >
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00E5FF' }} />
          <span className="text-sm text-white/55">Disponible para proyectos</span>
          <span className="text-white/20">•</span>
          <span className="text-sm" style={{ color: '#00E5FF' }}>🇩🇴 República Dominicana</span>
        </motion.div>

        {/* </>  bracket mark — from the logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="mb-3 flex justify-center"
        >
          <span
            className="text-3xl md:text-4xl font-bold select-none"
            style={{
              background: 'linear-gradient(135deg, #9D00FF, #00E5FF, #00FF85)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 12px rgba(0,229,255,0.5))',
              letterSpacing: '0.05em',
            }}
          >
            {'</>'}
          </span>
        </motion.div>

        {/* Neural interactive title — "isaelcode" blanco + ".dev" verde neón */}
        <div className="mb-5 text-white">
          <NeuralTitle text="isaelcode.dev" />
        </div>

        {/* Typewriter */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-xl md:text-2xl font-medium mb-4 h-9"
          style={{ color: '#00E5FF' }}
        >
          <TypeWriter texts={ROLES} />
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="text-white/40 text-lg leading-relaxed mb-10 max-w-xl mx-auto"
        >
          Construyo plataformas que escalan — desde ERPs dominicanos hasta sistemas fintech.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-12"
        >
          <motion.a
            href="#projects"
            whileHover={{ scale: 1.06, boxShadow: '0 0 35px rgba(0,229,255,0.5)' }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3.5 font-bold rounded-xl text-sm tracking-widest"
            style={{ background: 'linear-gradient(135deg, #00E5FF, #00FF85)', color: '#000' }}
          >
            VER PROYECTOS →
          </motion.a>

          <motion.a
            href="https://wa.me/18091234567"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.06, boxShadow: '0 0 25px rgba(37,211,102,0.45)' }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-8 py-3.5 font-bold rounded-xl text-sm tracking-widest"
            style={{ background: '#25D366', color: '#000' }}
          >
            <WhatsAppIcon />
            WHATSAPP
          </motion.a>

          <motion.a
            href="https://github.com/babyblack996"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-8 py-3.5 glass rounded-xl text-sm tracking-widest text-white/55 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GITHUB
          </motion.a>
        </motion.div>

        {/* Floating tags */}
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
              transition={{ delay: 1.4 + i * 0.07 }}
              className="px-3 py-1.5 glass rounded-full text-xs text-white/30"
              style={{ border: '1px solid rgba(255,255,255,0.06)' }}
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/20 text-xs tracking-[0.3em]">SCROLL</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-10"
          style={{ background: 'linear-gradient(to bottom, #00E5FF55, transparent)' }}
        />
      </motion.div>
    </section>
  )
}
