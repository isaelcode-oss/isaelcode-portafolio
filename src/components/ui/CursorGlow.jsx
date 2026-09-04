import { useEffect, useRef } from 'react'

// Halo de luz que sigue al cursor. Solo con puntero fino (no en táctil).
export default function CursorGlow() {
  const ref = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return undefined
    const el = ref.current
    if (!el) return undefined

    let raf = 0
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    const onMove = (event) => {
      x = event.clientX
      y = event.clientY
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0
          el.style.transform = `translate3d(${x}px, ${y}px, 0)`
        })
      }
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    el.classList.add('cursor-glow--active')
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return <div ref={ref} className="cursor-glow" aria-hidden="true" />
}
