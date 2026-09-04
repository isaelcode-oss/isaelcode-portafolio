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

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 45 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85 }}
          className="text-center mb-16"
        >
          <p className="eyebrow tracking-[0.3em]">TRABAJO SELECCIONADO</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-5">
            Ingeniería que se puede{' '}
            <span className="gradient-text">inspeccionar</span>
          </h2>
          <p className="text-white/45 max-w-2xl mx-auto leading-relaxed">
            Prototipos técnicos y sistemas en operación, construidos para explorar flujos
            empresariales, integraciones y decisiones de arquitectura.
            No se presentan como casos de clientes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}
