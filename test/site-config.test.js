import assert from 'node:assert/strict'
import test from 'node:test'

import { CONTACT, buildWhatsAppUrl } from '../src/config/site.js'

test('buildWhatsAppUrl encodes untrusted contact text without changing the destination', () => {
  const payload = 'Hola & proyecto?\n<script>alert(1)</script>'
  const url = new URL(buildWhatsAppUrl(payload))

  assert.equal(url.origin, 'https://wa.me')
  assert.equal(url.pathname, `/${CONTACT.whatsappNumber}`)
  assert.equal(url.searchParams.get('text'), payload)
})
