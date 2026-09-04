import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

// Los efectos de JavaScript (3D, parallax, typewriter) no se pueden apagar
// solo con CSS; este hook los desactiva cuando el visitante lo pidió al SO.
export function useReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia(QUERY).matches,
  )

  useEffect(() => {
    const media = window.matchMedia(QUERY)
    const onChange = (event) => setReduced(event.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return reduced
}
