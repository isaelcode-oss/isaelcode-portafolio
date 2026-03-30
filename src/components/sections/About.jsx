import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import TechSphere from '../canvas/TechSphere.jsx'

const STATS = [
  { value: '4+',   label: 'Proyectos\nCompletados' },
  { value: '10k+', label: 'Capacidad\nUsuarios' },
  { value: '85%',  label: 'Backend\nFocus' },
]

const TECH_LABELS = [
  'Node.js', 'TypeScript', 'Python', 'Flask',
  'React', 'Next.js', 'PostgreSQL', 'Redis',
  'Docker', 'BullMQ', 'AWS S3', 'Socket.IO',
]

export default function About() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.25 })

  return (
    <section id="about" className="section-pad relative">
      <div className="max-w-6xl mx-auto px-6">
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: text ── */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-xs font-semibold tracking-[0.3em] mb-4" style={{ color: '#00F5FF' }}>
              SOBRE MÍ
            </p>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Developer de{' '}
              <span className="gradient-text">plataformas</span>
              {' '}que resuelven<br />problemas reales
            </h2>

            <p className="text-white/55 text-lg leading-relaxed mb-5">
              Soy <strong className="text-white/85">Isael Patiño</strong>, Full-Stack Developer
              con enfoque en plataformas de alta concurrencia,
              ERPs personalizados y herramientas de automatización.
              Basado en <strong className="text-white/80">República Dominicana</strong>,
              construyo soluciones para el mercado latinoamericano e internacional.
            </p>

            <p className="text-white/40 leading-relaxed mb-10">
              Especializado en arquitecturas backend escalables, integración de APIs de terceros
              y procesamiento asíncrono con BullMQ y Redis. Todos mis proyectos están
              dockerizados y listos para producción.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-10">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="glass rounded-xl p-4 text-center glow-cyan"
                  style={{ border: '1px solid rgba(0,245,255,0.1)' }}
                >
                  <div className="text-2xl font-bold mb-1" style={{ color: '#00F5FF' }}>
                    {s.value}
                  </div>
                  <div className="text-white/35 text-xs whitespace-pre-line leading-relaxed">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Tech badge cloud */}
            <div className="flex flex-wrap gap-2">
              {TECH_LABELS.map((t, i) => (
                <motion.span
                  key={t}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: i % 2 === 0 ? 'rgba(0,245,255,0.08)' : 'rgba(157,0,255,0.08)',
                    color: i % 2 === 0 ? '#00F5FF' : '#9D00FF',
                    border: `1px solid ${i % 2 === 0 ? 'rgba(0,245,255,0.2)' : 'rgba(157,0,255,0.2)'}`,
                  }}
                >
                  {t}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* ── Right: 3D sphere ── */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="h-[480px] relative"
          >
            {/* Glow behind the canvas */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(0,245,255,0.06) 0%, transparent 70%)',
              }}
            />
            <TechSphere />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
