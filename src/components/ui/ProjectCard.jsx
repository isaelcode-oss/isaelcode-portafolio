import { motion } from 'framer-motion'

export default function ProjectCard({ project, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="project-card"
    >
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
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="project-card__link"
        >
          Ver en GitHub →
        </a>
      )}
    </motion.article>
  )
}
