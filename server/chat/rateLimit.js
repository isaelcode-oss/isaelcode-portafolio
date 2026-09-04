// Limitador de tasa en memoria (ventana deslizante) por clave y global.
// Vive en la instancia de la función serverless: es una defensa de mejor
// esfuerzo, no una garantía distribuida. Ver "Deuda conocida" en AGENTS.md.

export class SlidingWindowLimiter {
  constructor({ windowMs, maxPerKey, maxGlobal, now = () => Date.now() }) {
    this.windowMs = windowMs
    this.maxPerKey = maxPerKey
    this.maxGlobal = maxGlobal
    this.now = now
    this.buckets = new Map()
    this.globalHits = []
  }

  #prune(list, cutoff) {
    let i = 0
    while (i < list.length && list[i] <= cutoff) i++
    if (i > 0) list.splice(0, i)
  }

  // Devuelve { allowed, retryAfterMs, reason }.
  check(key) {
    const now = this.now()
    const cutoff = now - this.windowMs

    this.#prune(this.globalHits, cutoff)
    if (this.globalHits.length >= this.maxGlobal) {
      return { allowed: false, retryAfterMs: this.globalHits[0] + this.windowMs - now, reason: 'global' }
    }

    let hits = this.buckets.get(key)
    if (!hits) {
      hits = []
      this.buckets.set(key, hits)
    }
    this.#prune(hits, cutoff)
    if (hits.length >= this.maxPerKey) {
      return { allowed: false, retryAfterMs: hits[0] + this.windowMs - now, reason: 'key' }
    }

    hits.push(now)
    this.globalHits.push(now)

    // Evita que el mapa crezca sin límite con claves que ya no vuelven.
    if (this.buckets.size > 5000) {
      for (const [k, list] of this.buckets) {
        this.#prune(list, cutoff)
        if (list.length === 0) this.buckets.delete(k)
      }
    }
    return { allowed: true, retryAfterMs: 0, reason: null }
  }
}

// La cabecera x-real-ip la fija el borde de Vercel, que es el proxy real;
// no se acepta X-Forwarded-For porque el cliente puede inyectarla.
export function clientKey(headers) {
  const real = headers['x-real-ip']
  if (typeof real === 'string' && real.length > 0 && real.length < 64) return real
  return 'unknown'
}
