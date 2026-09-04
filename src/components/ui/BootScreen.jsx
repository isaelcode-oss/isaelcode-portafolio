import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const BOOT_LINES = [
  { text: '$ boot isaelcode.dev', color: '#00e5ff', at: 100 },
  { text: '[  OK  ] Loading business systems', color: '#a8b3bd', at: 420 },
  { text: '[  OK  ] Connecting automation services', color: '#a8b3bd', at: 760 },
  { text: '[  OK  ] Initializing AI workspace', color: '#a8b3bd', at: 1080 },
  { text: '[  OK  ] Security controls active', color: '#00ff85', at: 1400 },
  { text: '> System ready. Welcome.', color: '#00ff85', at: 1740 },
]

export default function BootScreen({ onComplete }) {
  const [visibleLines, setVisibleLines] = useState(0)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    const timers = BOOT_LINES.map((line, index) => window.setTimeout(() => setVisibleLines(index + 1), line.at))
    timers.push(window.setTimeout(() => setClosing(true), 2200))
    timers.push(window.setTimeout(onComplete, 2600))
    return () => timers.forEach(window.clearTimeout)
  }, [onComplete])

  const skip = () => {
    setClosing(true)
    window.setTimeout(onComplete, 260)
  }

  return (
    <AnimatePresence>
      {!closing && (
        <motion.div className="boot-screen" initial={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-label="Iniciando isaelcode.dev">
          <motion.div className="boot-terminal" initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="boot-titlebar"><span /><span /><span /><strong>isael@dev: ~</strong></div>
            <div className="boot-content" aria-live="polite">
              {BOOT_LINES.slice(0, visibleLines).map((line) => <p key={line.text} style={{ color: line.color }}>{line.text}</p>)}
              <span className="boot-cursor" aria-hidden="true">█</span>
            </div>
            <div className="boot-progress"><motion.span initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 2.2, ease: 'linear' }} /></div>
          </motion.div>
          <button type="button" onClick={skip} className="boot-skip">Saltar introducción</button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
