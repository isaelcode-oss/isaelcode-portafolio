import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useReducedMotion.js'

export default function ProjectCard({ project, index }) {
  const cardRef = useRef(null)
  const reduced = useReducedMotion()
  const [tilt, setTilt] = useState({ x: 0, y: 0, gx: 50, gy: 50 })
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = (event) => {
    if (reduced) return
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    setTilt({ x: (py - 0.5) * -14, y: (px - 0.5) * 14, gx: px * 100, gy: py * 100 })
  }
  const reset = () => { setTilt({ x: 0, y: 0, gx: 50, gy: 50 }); setHovered(false) }

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.75, delay: index * 0.13, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={reset}
      className={`project-card project-card--tilt ${hovered ? 'is-hovered' : ''}`}
      style={{
        '--tilt-x': `${tilt.x}deg`,
        '--tilt-y': `${tilt.y}deg`,
        '--glow-x': `${tilt.gx}%`,
        '--glow-y': `${tilt.gy}%`,
        '--card-color': project.color,
      }}
    >
      <div className="project-card__shine" aria-hidden="true" />

      <header className="project-card__header">
        <span className="project-card__icon" aria-hidden="true">{project.icon}</span>
        <span className="project-card__category">{project.category}</span>
      </header>

      <h3 className="project-card__title">{project.title}</h3>
      <p className="project-card__description">{project.description}</p>

      <ul className="project-card__features">
        {project.features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>

      <div className="project-card__stack">
        {project.stack.map((tech) => (
          <span key={tech}>{tech}</span>
        ))}
      </div>

      {project.github && (
        <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-card__link">
          Ver en GitHub →
        </a>
      )}
    </motion.article>
  )
}
