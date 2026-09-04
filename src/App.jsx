import Navbar      from './components/ui/Navbar.jsx'
import Hero        from './components/sections/Hero.jsx'
import Services    from './components/sections/Services.jsx'
import About       from './components/sections/About.jsx'
import Projects    from './components/sections/Projects.jsx'
import Skills      from './components/sections/Skills.jsx'
import Contact     from './components/sections/Contact.jsx'

export default function App() {
  return (
    <div className="scanlines">
      <div className="fixed inset-0 grid-bg" aria-hidden="true" />

      {/* Scrollable HTML content */}
      <div className="relative z-10">
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
