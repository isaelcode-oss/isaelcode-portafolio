import { Suspense, lazy, useCallback, useState } from 'react'
import Navbar      from './components/ui/Navbar.jsx'
import BootScreen  from './components/ui/BootScreen.jsx'
import CursorGlow  from './components/ui/CursorGlow.jsx'
import ScrollOrbs  from './components/ui/ScrollOrbs.jsx'
import Hero        from './components/sections/Hero.jsx'
import Services    from './components/sections/Services.jsx'
import About       from './components/sections/About.jsx'
import Projects    from './components/sections/Projects.jsx'
import Skills      from './components/sections/Skills.jsx'
import Contact     from './components/sections/Contact.jsx'
import { useReducedMotion } from './hooks/useReducedMotion.js'

// El fondo 3D y el chat se cargan en chunks aparte para que el bundle inicial
// se mantenga dentro del presupuesto de rendimiento.
const NeuralBackground = lazy(() => import('./components/canvas/NeuralBackground.jsx'))
const ChatWidget       = lazy(() => import('./components/chat/ChatWidget.jsx'))

export default function App() {
  const [booting, setBooting] = useState(true)
  const finishBoot = useCallback(() => setBooting(false), [])
  const reduced = useReducedMotion()

  return (
    <div>
      {booting && <BootScreen onComplete={finishBoot} />}
      <div className="fixed inset-0 grid-bg" aria-hidden="true" />
      {!reduced && !booting && (
        <Suspense fallback={null}>
          <NeuralBackground />
        </Suspense>
      )}
      <ScrollOrbs />
      <CursorGlow />

      <div className={`relative z-10 site-shell ${booting ? 'site-shell--booting' : ''}`} aria-hidden={booting}>
        <Navbar />
        <main>
          <Hero />
          <Services />
          <About />
          <Projects />
          <Skills />
          <Contact />
        </main>
      </div>

      {!booting && (
        <Suspense fallback={null}>
          <ChatWidget />
        </Suspense>
      )}
    </div>
  )
}
