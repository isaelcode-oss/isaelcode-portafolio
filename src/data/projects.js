export const projects = [
  {
    id: 1,
    title: 'Courier Manager',
    description:
      'Prototipo de ERP para explorar operaciones de mensajería: facturación, nómina y captura de gastos mediante WhatsApp y OCR.',
    stack: ['Python', 'Flask', 'PostgreSQL', 'Twilio', 'Tesseract OCR', 'Google Drive API'],
    category: 'ERP / Backend',
    github: 'https://github.com/babyblack996/courier-manager',
    color: '#00E5FF',
    icon: '🚚',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=75&fit=crop',
    features: ['Flujo de facturación', 'Módulo de nómina', 'WhatsApp Bot OCR', 'Reportes operativos'],
  },
  {
    id: 2,
    title: 'DemoIn',
    description:
      'Prototipo de almacenamiento cloud con carga directa a S3, checksums SHA256, colaboración en tiempo real y permisos por archivo.',
    stack: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'AWS S3 / MinIO', 'Socket.IO', 'JWT'],
    category: 'Cloud Platform',
    github: 'https://github.com/babyblack996/demoin',
    color: '#9D00FF',
    icon: '☁️',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=75&fit=crop',
    features: ['Upload S3 directo', 'Real-time Socket.IO', 'OAuth Google/Microsoft/Apple', 'Audit Logs completos'],
  },
  {
    id: 3,
    title: 'MomTalk Platform',
    description:
      'Prototipo técnico para estudiar colas, procesamiento asíncrono y flujos transaccionales en una plataforma de tareas.',
    stack: ['Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'BullMQ', 'Next.js', 'Docker'],
    category: 'FinTech Platform',
    github: 'https://github.com/babyblack996/momtalk-platform',
    color: '#00E5FF',
    icon: '💰',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=75&fit=crop',
    features: ['Niveles configurables', 'Flujos de referidos', 'Procesamiento con colas', 'Panel administrativo'],
  },
  {
    id: 4,
    title: 'Viral Spy',
    description:
      'Prototipo de monitoreo de tendencias que combina fuentes públicas y genera alertas para explorar oportunidades de contenido.',
    stack: ['Python 3.11', 'Telegram Bot API', 'YouTube Data API v3', 'Google Trends', 'SQLite'],
    category: 'Automation Tool',
    github: 'https://github.com/babyblack996/viral-spy',
    color: '#9D00FF',
    icon: '🕵️',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=75&fit=crop',
    features: ['Scoring viral propio', 'Multi-país MX/CO/ES/PR', 'Alertas Telegram diarias', 'Localización RD'],
  },
]

export const skills = {
  backend: [
    { name: 'Node.js / TypeScript', level: 92 },
    { name: 'Python / Flask', level: 88 },
    { name: 'PostgreSQL / Redis', level: 85 },
    { name: 'BullMQ / Async', level: 82 },
  ],
  frontend: [
    { name: 'React / Next.js', level: 88 },
    { name: 'Tailwind CSS', level: 90 },
    { name: 'TypeScript', level: 85 },
    { name: 'Socket.IO / Real-time', level: 83 },
  ],
  devops: [
    { name: 'Docker / Compose', level: 86 },
    { name: 'AWS S3 / MinIO', level: 81 },
    { name: 'Nginx / Proxy', level: 78 },
    { name: 'Git / CI/CD', level: 88 },
  ],
}

export const techCloud = [
  'Twilio API', 'Socket.IO', 'BullMQ', 'Passport.js',
  'Tesseract OCR', 'MinIO', 'NGINX', 'Selenium',
  'JWT Auth', 'Google Drive API', 'Telegram Bot', 'YouTube Data API',
  'PgBouncer', 'WalletConnect', 'USDT TRC20', 'OAuth2',
]
