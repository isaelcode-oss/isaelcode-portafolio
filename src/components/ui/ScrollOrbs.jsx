import { motion, useScroll, useTransform } from 'framer-motion'

// Tres luces de color que se desplazan con el scroll para que cada sección
// tenga una atmósfera distinta sin recargar el DOM.
export default function ScrollOrbs() {
  const { scrollYProgress } = useScroll()
  const cyanY   = useTransform(scrollYProgress, [0, 1], ['-10%', '70%'])
  const greenY  = useTransform(scrollYProgress, [0, 1], ['60%', '-20%'])
  const purpleX = useTransform(scrollYProgress, [0, 1], ['-20%', '55%'])
  const purpleY = useTransform(scrollYProgress, [0, 1], ['30%', '80%'])

  return (
    <div className="scroll-orbs" aria-hidden="true">
      <motion.div className="scroll-orb scroll-orb--cyan"   style={{ y: cyanY }} />
      <motion.div className="scroll-orb scroll-orb--green"  style={{ y: greenY }} />
      <motion.div className="scroll-orb scroll-orb--purple" style={{ x: purpleX, y: purpleY }} />
    </div>
  )
}
