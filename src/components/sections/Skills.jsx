import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { skills, techCloud } from '../../data/projects.js'

const CAT_META = {
  backend:  'Backend & Bases de Datos',
  frontend: 'Frontend & UI',
  devops:   'DevOps & Cloud',
}

export default function Skills() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })

  return (
    <section id="skills" className="section-pad relative">
      <div className="max-w-6xl mx-auto px-6">

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85 }}
          className="text-center mb-16"
        >
          <p className="eyebrow tracking-[0.3em]">HABILIDADES</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-5">
            Stack <span className="gradient-text">técnico</span>
          </h2>
          <p className="text-white/45 max-w-xl mx-auto">
            Herramientas que utilizo para diseñar, construir y desplegar soluciones completas.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {Object.entries(skills).map(([cat, items], ci) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 45 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.75, delay: ci * 0.13 }}
              className="skill-card glass rounded-2xl p-7"
            >
              <h3 className="skill-card__label">{CAT_META[cat]}</h3>
              <ul className="skill-card__list">
                {items.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

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
                transition={{ delay: 0.2 + i * 0.03 }}
                className="tech-chip glass rounded-full"
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
