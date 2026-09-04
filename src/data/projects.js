export const projects = [
  {
    id: 1,
    title: 'Courier Manager',
    description:
      'Prototipo de ERP para explorar operaciones de mensajería: facturación, nómina y captura de gastos mediante WhatsApp y OCR.',
    stack: ['Python', 'Flask', 'PostgreSQL', 'Twilio', 'Tesseract OCR', 'Google Drive API'],
    category: 'ERP / Backend',
    icon: '🚚',
    features: ['Flujo de facturación', 'Módulo de nómina', 'WhatsApp Bot OCR', 'Reportes operativos'],
  },
  {
    id: 2,
    title: 'CloudVault',
    description:
      'Prototipo de almacenamiento cloud con carga directa a S3, checksums SHA256, colaboración en tiempo real y permisos por archivo.',
    stack: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'AWS S3 / MinIO', 'Socket.IO', 'JWT'],
    category: 'Cloud Platform',
    icon: '☁️',
    features: ['Upload S3 directo', 'Real-time Socket.IO', 'OAuth Google/Microsoft/Apple', 'Audit Logs completos'],
  },
  {
    id: 3,
    title: 'Monitor de Precios',
    description:
      'Sistema en operación: vigila fichas de producto de tiendas, detecta cambios de precio y disponibilidad, y alerta por Telegram y correo. Un fallo de red no pierde el aviso: se reintenta.',
    stack: ['Node.js 24', 'TypeScript', 'PostgreSQL', 'Docker', 'Zod'],
    category: 'Data Pipeline',
    icon: '📈',
    features: ['Defensa SSRF por salto', 'Respeta robots.txt siempre', 'Precios en enteros exactos', 'Entrega al-menos-una-vez'],
  },
]

export const skills = {
  backend: ['Node.js / TypeScript', 'Python / Flask', 'PostgreSQL / Redis', 'BullMQ / colas asíncronas'],
  frontend: ['React / Next.js', 'Tailwind CSS', 'TypeScript', 'Socket.IO / tiempo real'],
  devops: ['Docker / Compose', 'AWS S3 / MinIO', 'Nginx / proxy inverso', 'Git / CI/CD'],
}

export const techCloud = [
  'Twilio API', 'Socket.IO', 'BullMQ', 'Passport.js',
  'Tesseract OCR', 'MinIO', 'NGINX', 'Selenium',
  'JWT Auth', 'Google Drive API', 'Telegram Bot', 'YouTube Data API',
  'PgBouncer', 'OAuth2',
]
