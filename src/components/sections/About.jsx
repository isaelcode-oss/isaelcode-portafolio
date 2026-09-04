import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const PRINCIPLES = [
  { value: '01', label: 'Seguridad desde el diseño' },
  { value: '02', label: 'Alcance y riesgos claros' },
  { value: '03', label: 'Entrega verificable' },
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
            <p className="eyebrow tracking-[0.3em]">
              SOBRE MÍ
            </p>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Developer de{' '}
              <span className="gradient-text">plataformas</span>
              {' '}que resuelven<br />problemas reales
            </h2>

            <p className="text-white/55 text-lg leading-relaxed mb-5">
              Soy <strong className="text-white/85">Isael Patiño</strong>, ingeniero de software e IA
              enfocado en plataformas empresariales, ERPs personalizados y automatización.
              Basado en <strong className="text-white/80">República Dominicana</strong>,
              construyo soluciones para el mercado latinoamericano e internacional.
            </p>

            <p className="text-white/40 leading-relaxed mb-10">
              Trabajo desde el proceso de negocio hasta la implementación: arquitectura,
              integraciones, seguridad, despliegue y una ruta clara para operar la solución.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-10">
              {PRINCIPLES.map((s) => (
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
                  className="about-chip"
                >
                  {t}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Proceso visible: reduce incertidumbre para el cliente. */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="glass rounded-2xl p-8" style={{ border: '1px solid rgba(0,229,255,0.14)' }}>
              <p className="eyebrow">CÓMO TRABAJO</p>
              {[
                ['Diagnóstico', 'Objetivo, proceso actual, restricciones y riesgos.'],
                ['Propuesta', 'Alcance, arquitectura, entregables y criterios de aceptación.'],
                ['Construcción', 'Avances demostrables, decisiones documentadas y control de cambios.'],
                ['Entrega', 'Verificación, despliegue y traspaso operativo.'],
              ].map(([title, copy], index) => (
                <div key={title} className="flex gap-4 py-5 border-b border-white/10 last:border-0">
                  <span className="text-[#00E5FF] font-mono text-sm">0{index + 1}</span>
                  <div><h3 className="font-semibold mb-1">{title}</h3><p className="text-white/45 text-sm leading-relaxed">{copy}</p></div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
