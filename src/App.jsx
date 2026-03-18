import Background3D from './components/canvas/Background3D.jsx'
import Navbar      from './components/ui/Navbar.jsx'
import Hero        from './components/sections/Hero.jsx'
import About       from './components/sections/About.jsx'
import Projects    from './components/sections/Projects.jsx'
import Skills      from './components/sections/Skills.jsx'
import Contact     from './components/sections/Contact.jsx'

export default function App() {
  return (
    <div className="scanlines">
      {/* Fixed 3D deep-space background — always behind everything */}
      <Background3D />

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
