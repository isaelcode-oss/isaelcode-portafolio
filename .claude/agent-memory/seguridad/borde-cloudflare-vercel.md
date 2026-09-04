---
name: borde-cloudflare-vercel
description: isaelcode.dev sirve tras Cloudflare proxeado sobre Vercel; por qué eso invalida cualquier control basado en IP dentro de la función
metadata:
  type: project
---

`isaelcode.dev` resuelve a rangos Cloudflare proxeados (verificado por DNS 2026-09-04:
`2606:4700:3032::6815:5c78` y `2606:4700:3037::ac43:c0fe`, ambos en 2606:4700::/32).
Es decir: Cloudflare delante, Vercel de origen.

**Why:** con dos proxies encadenados, la IP que la función serverless ve en `x-real-ip`
casi con seguridad es la del edge de Cloudflare, no la del visitante. Además el origen
Vercel sigue siendo alcanzable por su URL `*.vercel.app`, saltándose Cloudflare por
completo — en esa ruta cualquier cabecera "de proxy" la pone el atacante.

**How to apply:** ante cualquier control que cuente, identifique o autorice por IP
dentro de `api/`, no lo des por bueno sin ejercitarlo contra el despliegue:

```
curl -s -D- -o /dev/null -X POST https://<deploy>.vercel.app/api/chat \
  -H 'content-type: application/json' -H 'x-real-ip: 203.0.113.7' \
  -d '{"messages":[{"role":"user","content":"hola"}]}'
```

Repetir variando `x-real-ip`: si el 429 nunca llega, la cuota por clave es evadible.
Comparar con la misma petición vía `https://isaelcode.dev` para ver qué valor llega
realmente. El control de verdad para este borde vive en Cloudflare (WAF, rate limiting,
Turnstile) más "solo Cloudflare puede alcanzar el origen", no en código de la función.

Relacionado: [[patrones-fallo-auditoria]].
