import Navbar      from './components/ui/Navbar.jsx'
import Hero        from './components/sections/Hero.jsx'
import About       from './components/sections/About.jsx'
import Projects    from './components/sections/Projects.jsx'
import Skills      from './components/sections/Skills.jsx'
import Contact     from './components/sections/Contact.jsx'

export default function App() {
  return (
    <div className="scanlines">
      {/* Static background — deep navy with circuit grid */}
      <div
        className="fixed inset-0 grid-bg"
        style={{ zIndex: 0, background: '#050d18' }}
      />
      {/* Soft radial glows */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background: `
            radial-gradient(ellipse 70% 50% at 15% 20%, rgba(157,0,255,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 85% 75%, rgba(0,229,255,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 50% 50%, rgba(0,255,133,0.04) 0%, transparent 55%)
          `,
        }}
      />

      {/* Scrollable HTML content */}
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Projects />
          <Skills />
          <Contact />
        </main>
      </div>
    </div>
  )
}
