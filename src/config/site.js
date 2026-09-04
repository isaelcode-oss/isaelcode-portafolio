export const CONTACT = Object.freeze({
  email: 'info@isaelcode.dev',
  whatsappNumber: '18495947884',
  whatsappDisplay: '+1 849-594-7884',
})

export function buildWhatsAppUrl(message) {
  return `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(message)}`
}

export const DEFAULT_WHATSAPP_URL = buildWhatsAppUrl(
  'Hola Isael, vi isaelcode.dev y quiero conversar sobre un proyecto para mi empresa.',
)
