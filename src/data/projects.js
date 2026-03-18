export const projects = [
  {
    id: 1,
    title: 'Courier Manager',
    description:
      'ERP completo para empresas de mensajería en República Dominicana. Facturación NCF automatizada, nómina dominicana con AFP/SFS/INFOTEP, declaraciones DGII y WhatsApp Bot con OCR para registro de gastos por foto.',
    stack: ['Python', 'Flask', 'PostgreSQL', 'Twilio', 'Tesseract OCR', 'Google Drive API'],
    category: 'ERP / Backend',
    github: 'https://github.com/babyblack996/courier-manager',
    color: '#00E5FF',
    icon: '🚚',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=75&fit=crop',
    features: ['Facturación NCF B01/B02', 'Nómina RD (AFP, SFS)', 'WhatsApp Bot OCR', 'DGII IT-1, IR-17, IR-3'],
  },
  {
    id: 2,
    title: 'DemoIn',
    description:
      'Plataforma cloud storage segura tipo Dropbox. Upload directo a S3 con SHA256 checksums, colaboración en tiempo real via Socket.IO, OAuth social login (Google, Microsoft, Apple) y permisos granulares por archivo.',
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
      'Plataforma task-earning de alta concurrencia (10k+ usuarios). Sistema VIP 6 niveles, referidos multinivel con comisiones automáticas, retiros USDT TRC20/ERC20 y procesamiento async con BullMQ.',
    stack: ['Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'BullMQ', 'Next.js', 'Docker'],
    category: 'FinTech Platform',
    github: 'https://github.com/babyblack996/momtalk-platform',
    color: '#00E5FF',
    icon: '💰',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=75&fit=crop',
    features: ['VIP 6 niveles', 'Referidos 12/5/2%', 'Retiros USDT TRC20/ERC20', 'Admin God Mode'],
  },
  {
    id: 4,
    title: 'Viral Spy',
    description:
      'Monitor de contenido viral para creadores en República Dominicana. Scraping de Google Trends, YouTube Shorts y RSS feeds de MX/CO/ES/PR. Motor de scoring propio con localización de ángulos para RD.',
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
