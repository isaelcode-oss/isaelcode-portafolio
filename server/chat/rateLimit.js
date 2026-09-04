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

// isaelcode.dev pasa por Cloudflare antes de llegar a Vercel, así que la IP
// del visitante viene en cf-connecting-ip; x-real-ip la fija Vercel y, detrás
// de Cloudflare, suele ser la IP del propio borde. Nunca se lee
// X-Forwarded-For: el cliente puede inyectarla. Quien llegue directo al origen
// *.vercel.app puede fabricar cf-connecting-ip; eso lo cierra restringir el
// origen a Cloudflare, no este código (ver AGENTS.md). Se devuelve el origen
// de la clave para que los logs muestren qué cabecera se usó.
function plausibleIp(value) {
  return typeof value === 'string' && value.length > 0 && value.length < 64
}

export function clientKey(headers) {
  if (plausibleIp(headers['cf-connecting-ip'])) return { value: headers['cf-connecting-ip'], source: 'cloudflare' }
  if (plausibleIp(headers['x-real-ip'])) return { value: headers['x-real-ip'], source: 'vercel' }
  // Todo el tráfico sin cabecera comparte una cuota: falla cerrado y queda visible en los logs.
  return { value: 'unknown', source: 'unknown' }
}
