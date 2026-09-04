import { motion } from 'framer-motion'

const services = [
  {
    number: '01',
    title: 'Automatización empresarial',
    description: 'Conecto procesos, documentos y equipos para reducir tareas manuales y errores operativos.',
    items: ['n8n y webhooks', 'WhatsApp y OCR', 'Integraciones entre sistemas'],
  },
  {
    number: '02',
    title: 'Software a medida',
    description: 'Construyo plataformas internas, ERPs y portales adaptados a la operación de tu empresa.',
    items: ['Paneles administrativos', 'Flujos y permisos', 'APIs y bases de datos'],
  },
  {
    number: '03',
    title: 'IA aplicada',
    description: 'Uso IA donde aporta valor medible: asistentes, clasificación y extracción de información.',
    items: ['Agentes y asistentes', 'Procesamiento documental', 'Salidas estructuradas'],
  },
]

export default function Services() {
  return (
    <section id="services" className="section-pad relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-3xl mb-14">
          <p className="eyebrow">SERVICIOS</p>
          <h2 className="section-title">Tecnología alineada con una necesidad de negocio.</h2>
          <p className="section-copy">Primero entendemos el proceso y el riesgo. Después elegimos la solución técnica más simple que pueda operar y crecer.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {services.map((service, index) => (
            <motion.article key={service.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="glass service-card">
              <span className="service-number">{service.number}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <ul>{service.items.map((item) => <li key={item}>{item}</li>)}</ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
