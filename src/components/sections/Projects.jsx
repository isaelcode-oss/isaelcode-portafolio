import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { projects } from '../../data/projects.js'
import ProjectCard from '../ui/ProjectCard.jsx'

export default function Projects() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section id="projects" className="section-pad relative">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 45 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold tracking-[0.3em] mb-4" style={{ color: '#9D00FF' }}>
            PROYECTOS
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-5">
            Proyectos{' '}
            <span className="gradient-text">estrella</span>
          </h2>
          <p className="text-white/45 max-w-2xl mx-auto leading-relaxed">
            Plataformas reales, en producción, con código disponible en GitHub.
            De ERPs dominicanos a sistemas fintech con criptomonedas.
          </p>
        </motion.div>

        {/* 2-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {/* GitHub CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-center mt-14"
        >
          <motion.a
            href="https://github.com/babyblack996"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04, boxShadow: '0 0 25px rgba(0,245,255,0.2)' }}
            className="inline-flex items-center gap-3 glass px-8 py-4 rounded-xl transition-all group"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <svg className="w-5 h-5 text-white/40 group-hover:text-white/70 transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span className="text-white/55 group-hover:text-white/80 transition-colors text-sm">
              Ver todos los proyectos en
            </span>
            <span className="font-semibold text-sm" style={{ color: '#00F5FF' }}>
              GitHub →
            </span>
          </motion.a>
        </motion.div>

      </div>
    </section>
  )
}
