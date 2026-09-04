import { motion } from 'framer-motion'
import { DEFAULT_WHATSAPP_URL } from '../../config/site.js'

const ROLES = ['Software empresarial', 'Automatización de procesos', 'IA aplicada a operaciones']

const STACK_TAGS = ['Node.js', 'Python', 'React', 'TypeScript', 'PostgreSQL', 'Docker', 'AWS S3']

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
)

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 hero-aurora pointer-events-none" />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-24">

        {/* Status badge */}
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

        {/* Brand mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="mb-3 flex justify-center"
        >
          <span className="brand-mark text-3xl md:text-4xl font-bold select-none">{'</>'}</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="hero-title mb-6"
        >
          isaelcode<span className="hero-title__dev">.dev</span>
        </motion.h1>

        {/* Roles */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="hero-roles mb-5"
        >
          {ROLES.join('  ·  ')}
        </motion.p>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="text-white/40 text-lg leading-relaxed mb-10 max-w-xl mx-auto"
        >
          Diseño software, automatizaciones y soluciones de IA para empresas que necesitan
          operar mejor, conectar sus sistemas y eliminar trabajo manual.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-12"
        >
          <a href="#contact" className="cta cta--primary">
            AGENDAR DIAGNÓSTICO
          </a>
          <a
            href={DEFAULT_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cta cta--whatsapp"
          >
            <WhatsAppIcon />
            HABLAR POR WHATSAPP
          </a>
          <a href="#projects" className="cta cta--ghost glass">
            VER TRABAJO →
          </a>
        </motion.div>

        {/* Stack tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1 }}
          className="flex flex-wrap gap-2 justify-center"
        >
          {STACK_TAGS.map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + i * 0.06 }}
              className="stack-tag glass rounded-full px-3 py-1.5 text-xs"
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
        transition={{ delay: 1.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
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
