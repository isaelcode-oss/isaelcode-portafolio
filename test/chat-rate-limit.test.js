import assert from 'node:assert/strict'
import test from 'node:test'

import { SlidingWindowLimiter, clientKey } from '../server/chat/rateLimit.js'

function makeLimiter(overrides = {}) {
  let now = 1_000_000
  const limiter = new SlidingWindowLimiter({ windowMs: 1000, maxPerKey: 3, maxGlobal: 5, now: () => now, ...overrides })
  return { limiter, advance: (ms) => { now += ms } }
}

test('bloquea a una clave al superar su cuota y la libera al vencer la ventana', () => {
  const { limiter, advance } = makeLimiter()
  assert.equal(limiter.check('a').allowed, true)
  assert.equal(limiter.check('a').allowed, true)
  assert.equal(limiter.check('a').allowed, true)
  const blocked = limiter.check('a')
  assert.equal(blocked.allowed, false)
  assert.equal(blocked.reason, 'key')
  assert.ok(blocked.retryAfterMs > 0 && blocked.retryAfterMs <= 1000)

  advance(1001)
  assert.equal(limiter.check('a').allowed, true)
})

test('una clave bloqueada no afecta a otra, pero el tope global sí frena a todas', () => {
  const { limiter } = makeLimiter()
  for (let i = 0; i < 3; i++) limiter.check('a')
  assert.equal(limiter.check('a').allowed, false)
  assert.equal(limiter.check('b').allowed, true)
  assert.equal(limiter.check('b').allowed, true)
  // 5 peticiones aceptadas en total: la siguiente choca con el tope global
  const global = limiter.check('c')
  assert.equal(global.allowed, false)
  assert.equal(global.reason, 'global')
})

test('las peticiones rechazadas no consumen cuota', () => {
  const { limiter, advance } = makeLimiter()
  for (let i = 0; i < 3; i++) limiter.check('a')
  for (let i = 0; i < 10; i++) limiter.check('a')
  advance(1001)
  assert.equal(limiter.check('a').allowed, true)
})

test('la clave de cliente prefiere cf-connecting-ip, luego x-real-ip, y nunca x-forwarded-for', () => {
  assert.deepEqual(clientKey({ 'cf-connecting-ip': '198.51.100.7', 'x-real-ip': '203.0.113.9', 'x-forwarded-for': '1.1.1.1' }), { value: '198.51.100.7', source: 'cloudflare' })
  assert.deepEqual(clientKey({ 'x-real-ip': '203.0.113.9', 'x-forwarded-for': '1.1.1.1' }), { value: '203.0.113.9', source: 'vercel' })
  assert.deepEqual(clientKey({ 'x-forwarded-for': '1.1.1.1' }), { value: 'unknown', source: 'unknown' })
  assert.deepEqual(clientKey({}), { value: 'unknown', source: 'unknown' })
  assert.deepEqual(clientKey({ 'x-real-ip': 'x'.repeat(200) }), { value: 'unknown', source: 'unknown' })
})
