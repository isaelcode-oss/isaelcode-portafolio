import { useCallback, useState } from 'react'
import Navbar      from './components/ui/Navbar.jsx'
import BootScreen  from './components/ui/BootScreen.jsx'
import Hero        from './components/sections/Hero.jsx'
import Services    from './components/sections/Services.jsx'
import About       from './components/sections/About.jsx'
import Projects    from './components/sections/Projects.jsx'
import Skills      from './components/sections/Skills.jsx'
import Contact     from './components/sections/Contact.jsx'

export default function App() {
  const [booting, setBooting] = useState(true)
  const finishBoot = useCallback(() => setBooting(false), [])

  return (
    <div>
      {booting && <BootScreen onComplete={finishBoot} />}
      <div className="fixed inset-0 grid-bg" aria-hidden="true" />

      {/* Scrollable HTML content */}
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
    </div>
  )
}
