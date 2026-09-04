import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { skills, techCloud } from '../../data/projects.js'

const CAT_META = {
  backend:  { label: 'Backend & Bases de Datos', color: '#00F5FF' },
  frontend: { label: 'Frontend & UI',            color: '#9D00FF' },
  devops:   { label: 'DevOps & Cloud',           color: '#00F5FF' },
}

function SkillBar({ name, level, color, delay }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="mb-5">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-white/65">{name}</span>
        <span className="text-xs font-semibold" style={{ color }}>{level}%</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1.3, delay, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${color}, ${color}77)`,
            boxShadow: `0 0 8px ${color}55`,
          }}
        />
      </div>
    </div>
  )
}

export default function Skills() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })

  return (
    <section id="skills" className="section-pad relative">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold tracking-[0.3em] mb-4" style={{ color: '#00F5FF' }}>
            HABILIDADES
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-5">
            Stack{' '}
            <span className="gradient-text">técnico</span>
          </h2>
          <p className="text-white/45 max-w-xl mx-auto">
            Herramientas que utilizo para diseñar, construir y desplegar soluciones completas.
          </p>
        </motion.div>

        {/* Skill cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {Object.entries(skills).map(([cat, items], ci) => {
            const { label, color } = CAT_META[cat]
            return (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 45 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.75, delay: ci * 0.13 }}
                className="glass rounded-2xl p-7"
                style={{ border: `1px solid ${color}18` }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                  <h3 className="text-xs font-semibold tracking-wider" style={{ color }}>
                    {label}
                  </h3>
                </div>
                {items.map((s, i) => (
                  <SkillBar
                    key={s.name}
                    name={s.name}
                    level={s.level}
                    color={color}
                    delay={0.3 + i * 0.1}
                  />
                ))}
              </motion.div>
            )
          })}
        </div>

        {/* Tech cloud */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-center"
        >
          <p className="text-white/30 text-xs tracking-widest mb-6">INTEGRACIONES & LIBRERÍAS</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {techCloud.map((tech, i) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.08, borderColor: 'rgba(0,245,255,0.35)' }}
                transition={{ delay: 0.3 + i * 0.04 }}
                className="px-4 py-2 glass rounded-full text-sm text-white/45 cursor-default transition-all"
                style={{ border: '1px solid rgba(255,255,255,0.08)' }}
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}
