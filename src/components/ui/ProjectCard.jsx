import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function ProjectCard({ project, index }) {
  const cardRef  = useRef(null)
  const [tilt,    setTilt]    = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left) / rect.width  - 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5
    setTilt({ x: y * -12, y: x * 12 })
  }

  const reset = () => { setTilt({ x: 0, y: 0 }); setHovered(false) }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.75, delay: index * 0.13, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={reset}
      style={{
        transform: `perspective(1100px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: hovered ? 'transform 0.06s ease' : 'transform 0.55s ease',
        willChange: 'transform',
      }}
      className="relative rounded-2xl cursor-default group overflow-hidden"
    >
      {/* Glass base */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: 'rgba(10, 18, 35, 0.82)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      />

      {/* Hover glow border */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={hovered ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          boxShadow: `0 0 40px ${project.color}20, inset 0 0 30px ${project.color}06`,
          border: `1px solid ${project.color}30`,
        }}
      />

      {/* ── Project image ──────────────────────────────────── */}
      <div className="relative w-full h-44 overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
          style={{
            filter: hovered
              ? 'brightness(0.75) saturate(1.2)'
              : 'brightness(0.45) saturate(0.7)',
            transition: 'filter 0.4s ease',
          }}
          loading="lazy"
        />

        {/* Gradient overlay from image to card body */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              to bottom,
              transparent 0%,
              transparent 40%,
              rgba(10,18,35,0.6) 70%,
              rgba(10,18,35,0.97) 100%
            )`,
          }}
        />

        {/* Top-left color accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: `linear-gradient(90deg, transparent, ${project.color}88, transparent)` }}
        />

        {/* Category badge — floating over image */}
        <div className="absolute top-3 left-3">
          <motion.span
            animate={hovered ? { scale: 1.05 } : { scale: 1 }}
            className="text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm"
            style={{
              background: `${project.color}18`,
              color: project.color,
              border: `1px solid ${project.color}35`,
            }}
          >
            {project.category}
          </motion.span>
        </div>

        {/* Emoji icon — floating over image */}
        <div className="absolute top-3 right-3 text-2xl select-none">
          {project.icon}
        </div>
      </div>

      {/* ── Card body ──────────────────────────────────────── */}
      <div className="relative p-5">
        {/* Title */}
        <h3
          className="text-xl font-bold mb-2.5 transition-colors duration-300"
          style={{ color: hovered ? project.color : '#ffffff' }}
        >
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-white/48 text-sm leading-relaxed mb-4">
          {project.description}
        </p>

        {/* Features */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-4">
          {project.features.map((f) => (
            <div key={f} className="flex items-center gap-1.5 text-xs text-white/38">
              <span style={{ color: project.color }}>✓</span>
              {f}
            </div>
          ))}
        </div>

        {/* Stack badges */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.stack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="text-xs px-2.5 py-1 rounded-md text-white/42"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              {tech}
            </span>
          ))}
          {project.stack.length > 4 && (
            <span className="text-xs px-2.5 py-1 rounded-md text-white/22 italic">
              +{project.stack.length - 4}
            </span>
          )}
        </div>

        {/* GitHub link */}
        <motion.a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          whileHover={{ x: 5 }}
          className="inline-flex items-center gap-2 text-sm font-semibold"
          style={{ color: project.color }}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          Ver en GitHub →
        </motion.a>
      </div>
    </motion.div>
  )
}
