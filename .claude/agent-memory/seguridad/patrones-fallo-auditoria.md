---
name: patrones-fallo-auditoria
description: Patrones de fallo recurrentes detectados auditando este repo (landing + /api/chat con LLM); qué mirar primero en la próxima revisión
metadata:
  type: project
---

Patrones de fallo que este repo repite. Detectados en la auditoría de la rama
`impacto-visual-y-chatbot` (2026-09-04).

**Why:** el repo tiene documentación de seguridad muy buena (AGENTS.md, ALCANCE.md,
CUMPLIMIENTO) y controles reales bien escritos, así que el riesgo NO está en lo obvio
(secretos, XSS, CSP, señales silenciadas: todo limpio). Está en el borde entre lo que
el documento declara y lo que el código verifica.

**How to apply:** en la próxima auditoría, empieza por estos cuatro, no por el checklist genérico.

1. **Confianza en estado enviado por el cliente.** El historial de chat (incluidos los
   turnos `assistant`) llega del navegador y se pasa al modelo sin autenticar. La
   validación cubre forma, tamaño, roles y alternancia — nunca procedencia. Regla:
   cuando veas validación de *forma* muy pulida, pregunta por la *procedencia*.
2. **Controles que dependen de una cabecera de red no verificada** (`x-real-ip`,
   `content-length`). Se dan por buenos sin haberlos ejercitado contra el despliegue
   real. Ver [[borde-cloudflare-vercel]].
3. **Código defensivo que queda muerto en la plataforma real.** El contador de bytes
   por streaming de `readJsonBody` no se ejecuta en Vercel porque `req.body` ya viene
   parseado; solo corre en el arnés local. Comprobar siempre qué rama del código
   ejecuta *la plataforma*, no el test.
4. **Coherencia entre los documentos legales y lo que el código hace.** La política de
   privacidad promete registros "sin el texto" pero el log incluye `err.message` del
   proveedor sin acotar, y no declara el tratamiento de la IP que usa el rate limiter.

Anti-patrón a NO buscar aquí (ya verificado limpio, no gastes tiempo salvo que cambie
la superficie): secretos en árbol o historial, XSS en el widget (React escapa, no hay
`dangerouslySetInnerHTML` en ningún sitio), inyección en frames SSE (`JSON.stringify`),
prototype pollution, `@ts-ignore`/`|| true`/tests en skip (cero ocurrencias).
