# Contexto del proyecto

## Clasificación

- Tipo: frontend web / landing comercial + un endpoint serverless (`/api/chat`) que integra un LLM.
- Maneja dinero: no. El endpoint consume crédito de la API de Anthropic (costo por uso), no cobra.
- Maneja datos personales: sí; el visitante puede proporcionar nombre, correo y detalles de su proyecto al iniciar contacto, y lo que escriba en el asistente de chat viaja a Anthropic.
- Multi-tenant: no.
- Exposición: pública mediante Cloudflare y Vercel. `/api/chat` es público sin autenticación.
- Escala esperada: cientos de visitantes.
- Estado: código existente al que hay que adaptarse.

## Contrato aplicable

Aplica el bloque `Frontend web / landing / PWA` de `~/.ai/templates/CONTRATOS.md` porque esta aplicación es una landing React/Vite pública. No es PWA. Debe incluir cabeceras de seguridad y CSP, presupuesto de rendimiento, accesibilidad por teclado/contraste/textos alternativos, consentimiento previo si se incorpora analítica y estados de carga/error veraces.

Desde 2026-09-04 aplica también el bloque `Agente IA / integración LLM` por el asistente de chat (`api/chat.js`): timeout, límite de tokens, comportamiento definido si el proveedor falla, entrada del usuario delimitada, salida tratada como no confiable, registro de costo/latencia/error, y límite de gasto por usuario y global.

Del bloque `Servicio HTTP / API / SaaS` aplica solo lo compatible con una función serverless en Vercel: validación en el borde, timeouts explícitos, logs JSON con `request-id`. NO APLICA `/health`, `/ready`, `/metrics`, apagado ordenado ni réplicas: Vercel gestiona el ciclo de vida del proceso y no hay base de datos, cola ni caché propias. Si el chat pasa a un servicio propio, ese bloque aplica completo.

## Herramientas y servicios

- React y Vite: stack existente; se mantiene para evitar una reescritura sin beneficio comercial.
- Vercel: previews, build y hosting del dominio actual.
- GitHub: fuente de verdad y despliegue automático del repositorio privado.
- WhatsApp y correo bajo `isaelcode.dev`: canales de contacto reales sin introducir un procesador de formularios externo.
- Cloudflare: borde público existente; no se cambia su configuración en este alcance.
- Validación HTML del formulario: el contenido se codifica en el cliente y se entrega a WhatsApp; no se almacena en esta aplicación.
- Anthropic (`@anthropic-ai/sdk`, modelo `claude-opus-5`): genera las respuestas del asistente de chat. Clave en `ANTHROPIC_API_KEY` en Vercel, nunca en el repo. Se eligió por ser el proveedor por defecto del stack y por `fallbacks: "default"`, que evita que un falso positivo del clasificador deje al visitante sin respuesta.
- three.js: fondo neuronal 3D. Se carga en un chunk diferido con `import()` para no romper el presupuesto inicial.

## Decisiones reversibles

- 2026-09-03: centralizar teléfono, correo y URLs en un módulo de configuración para evitar fuentes de verdad duplicadas.
- 2026-09-03: enviar el formulario mediante un enlace de WhatsApp prellenado y ofrecer `mailto:` como alternativa. Evita simular entregas y no ata el sitio a un proveedor hasta que se elija uno explícitamente.
- 2026-09-03: presentar los trabajos como proyectos de demostración/capacidades técnicas; el propietario confirmó que las afirmaciones anteriores de uso real no eran ciertas.
- 2026-09-03: mostrar una introducción tipo terminal Linux de 2.6 segundos en cada carga, con botón para saltarla, por decisión explícita del propietario.
- 2026-09-03: las páginas legales públicas presentan el contenido operativo sin anotaciones internas. Actualización 2026-09-04: por decisión del propietario se retiran las marcas de revisión legal y el archivo `legal/REVISION-LEGAL.md`; los documentos se entregan como definitivos.
- 2026-09-03: mantener la identidad visual oscura, reduciendo efectos que distraen de la propuesta comercial.
- 2026-09-03 (refinamiento premium): retirar código flotante, letras que siguen el mouse,
  typewriter, scanlines, tilt 3D de tarjetas, imágenes de stock de Unsplash y barras de
  habilidades con porcentajes inventados. Acento único cian (+verde de marca en `.dev`,
  checks y gradiente); el púrpura queda solo en el logo del navbar, que replica el logo real.
- 2026-09-03: proyectos — se retiran MomTalk Platform y Viral Spy; DemoIn pasa a llamarse
  CloudVault; se añade Monitor de Precios (sistema real en operación, `~/projects/prueba-scraper`).
- 2026-09-03: se retiran todos los enlaces a GitHub de la sección de proyectos. Los repos
  originales existen en `babyblack996` pero son privados: un visitante recibe 404 (verificado
  con curl sin autenticación). Condición para reponerlos: que los repos sean públicos, en
  `babyblack996` o migrados a `isaelcode-oss`.
- 2026-09-03: se retiran `WalletConnect` y `USDT TRC20` de la nube de integraciones; no
  respaldan la propuesta empresarial y no hay proyecto visible que los demuestre.
- 2026-09-04: reparto de remotos decidido por el propietario — `isaelcode-oss` es la
  organización PÚBLICA (la cara visible en GitHub); `babyblack996` es la cuenta personal
  donde viven todos los proyectos, la conectada a Vercel y el **remoto PRINCIPAL de este
  repo**: la fuente de verdad es `origin` (babyblack996) y el despliegue sale de
  `origin/master`. `isaelcode` (isaelcode-oss) es el espejo público y se empuja después.
- 2026-09-04: el propietario pidió revertir la dirección del "refinamiento premium": el sitio debe
  envolver al visitante. Se recuperan y amplían los efectos: fondo neuronal 3D (three.js puro,
  reactivo a mouse y scroll), título con parallax por letra, typewriter, código flotante, rayos
  cónicos giratorios, halo que sigue al cursor, luces que se desplazan con el scroll y tilt 3D con
  brillo en las tarjetas. Todo se desactiva con `prefers-reduced-motion` (hook
  `useReducedMotion`), y el 3D baja nodos y densidad de píxeles en móvil.
- 2026-09-04: asistente de chat con IA, elegido por el propietario frente a un asistente guiado
  sin IA. Backend: `api/chat.js` (función Node en Vercel) con SSE. Cliente: `ChatWidget.jsx`
  cargado en chunk diferido. La conversación vive solo en memoria del navegador; no se persiste
  en ningún lado propio. Límites: 24 mensajes, 1500 caracteres por mensaje, 12000 en total,
  500 tokens de salida, timeout 25 s, `effort: low` para latencia de chat.
- 2026-09-04: el espejo `isaelcode-oss/isaelcode-portafolio` se hizo PÚBLICO por decisión del
  propietario. Antes se verificó que el historial completo no contiene `.env`, tokens ni claves.
  Con esto el fetch del espejo funciona con cualquier cuenta; el push sigue exigiendo la cuenta
  `isaelcode-oss` en `gh`.

## Deuda conocida

- 2026-09-03: `~/.ai/templates/ALCANCE.md` no existe en el entorno y no pudo copiarse literalmente. Se creó `ALCANCE.md` con el alcance verificable del proyecto. Condición de salida: cuando exista la plantilla oficial, comparar ambos archivos y migrar cualquier campo obligatorio ausente.
- 2026-09-03: GitHub CLI guarda la credencial en texto plano porque WSL no tiene un keyring disponible. Condición de salida: configurar Git Credential Manager o un keyring compatible y volver a autenticar `gh`.
- 2026-09-03: la CSP mantiene `style-src 'unsafe-inline'` porque el código heredado usa estilos React inline extensivamente. Condición de salida: migrar los estilos inline a clases/hojas CSS y retirar esa fuente de la directiva antes de marcar la CSP como completa.
  Actualización 2026-09-03: el refinamiento premium migró a clases CSS los estilos inline
  estáticos de Hero, Projects, ProjectCard, Skills, About y Contact. PERO `framer-motion`
  anima escribiendo el atributo `style` en runtime, así que `'unsafe-inline'` (o
  `style-src-attr`) no puede retirarse del todo mientras la librería siga en uso.
  CERRADA 2026-09-04: la premisa era falsa. framer-motion y React escriben estilos por
  CSSOM (`element.style`), y la CSP no gobierna CSSOM, solo atributos `style=` en el
  marcado y elementos `<style>`. Se probó el build con la CSP sin `'unsafe-inline'`
  inyectada por Playwright: cero violaciones, con 3D, tilt y chat funcionando. Se retiró
  el token, se quitó `images.unsplash.com` (sin uso) y se añadió `object-src 'none'`.
- 2026-09-04: `src/components/canvas/` (Background3D, TechSphere) borrado con confirmación
  del propietario; era código muerto sin importadores. Actualización 2026-09-04: se reescribió
  como `NeuralBackground.jsx` con three.js puro (sin react-three-fiber, cuya versión actual
  exige React 19).
- 2026-09-04: el rate limiting de `/api/chat` es en memoria, por instancia de la función
  (20 por IP y 300 globales cada 10 minutos). Una ráfaga distribuida entre varias instancias
  o regiones puede superarlo. Mitigación adicional obligatoria: límite de gasto mensual en la
  consola de Anthropic. Condición de salida: mover el contador a un almacén compartido
  (Upstash Redis o Vercel KV) cuando el tráfico o el gasto lo justifiquen, o cuando se
  observe abuso en los logs (`reason: "rate_limit_global"`).
  Actualización 2026-09-04 (auditoría): `isaelcode.dev` pasa por Cloudflare antes de
  Vercel, así que la clave por IP usa `cf-connecting-ip` y cae a `x-real-ip` si falta. El
  origen `*.vercel.app` sigue alcanzable sin pasar por Cloudflare y por esa ruta la cabecera
  es falsificable: el contador por IP NO es un control real hasta que el origen quede
  restringido a Cloudflare (Vercel: "Trusted proxy" / Cloudflare Authenticated Origin Pulls)
  y el rate limiting viva en el WAF de Cloudflare. Condición de salida: ambas cosas hechas
  y verificadas rotando `cf-connecting-ip` contra la URL `*.vercel.app` hasta ver 429.
- 2026-09-04: los turnos del asistente que el navegador reenvía van firmados con HMAC
  (`server/chat/sign.js`, secreto en `CHAT_SIGNING_SECRET`, caducidad 24 h) para que nadie
  pueda inventar historial del asistente y saltarse el prompt o usar el endpoint como proxy.
  Si el secreto se rota, las conversaciones abiertas piden recargar; es el comportamiento
  esperado. Cambiar el secreto es una acción explícita, nunca un efecto de aprovisionar.
- 2026-09-04: `ANTHROPIC_API_KEY` debe configurarse a mano en Vercel (producción y preview).
  Hasta entonces `/api/chat` responde 503 y el widget muestra un error honesto con enlace a
  WhatsApp. Condición de salida: variable configurada y una conversación real verificada en
  el preview.

- 2026-09-04: los previews automáticos de Vercel para los PR fallan con "Git author must have
  access" porque el correo del autor de los commits está vinculado a la cuenta de GitHub
  `isaelcode-oss`, que no es miembro del equipo de Vercel (PR #3 y #4 muestran el check en
  FAILURE; producción sí despliega porque el merge lo firma GitHub). Mientras tanto el preview
  se genera con `vercel deploy` desde la CLI. Condición de salida: invitar a `isaelcode-oss`
  al equipo de Vercel, o firmar los commits con un correo vinculado a `babyblack996`.

## Cierre del contrato

- HECHO — 2026-09-03: cabeceras `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` y `Permissions-Policy` verificadas en el preview Vercel.
- HECHO — 2026-09-04: `style-src` sin `'unsafe-inline'`, `img-src` sin dominios externos y `object-src 'none'`. Verificado con Playwright inyectando la CSP sobre el build: sin violaciones. HSTS la añaden Cloudflare y Vercel (comprobado con `curl -I`).
- HECHO — 2026-09-03: presupuesto de rendimiento definido como menos de 150 kB gzip de JavaScript inicial; medido en 94.85 kB gzip. Actualización 2026-09-04: bundle inicial 97.22 kB gzip; chunks diferidos aparte: `NeuralBackground` 129.54 kB (three.js, solo sin `prefers-reduced-motion`) y `ChatWidget` 2.23 kB.
- HECHO — 2026-09-03: foco visible, etiquetas de formulario y `prefers-reduced-motion` implementados; contraste y estructura revisados en código.
- HECHO — 2026-09-04: verificación visual responsive con Chromium de Playwright (escritorio 1440px y móvil 390px, con scroll para disparar las animaciones `whileInView`). Nota: los emoji de las tarjetas salen como cuadros solo en el entorno de captura (WSL sin fuente emoji); los navegadores reales los renderizan.
- NO APLICA: banner de cookies; la aplicación no carga analítica ni rastreadores propios.
- HECHO — 2026-09-03: el formulario no simula éxito; abre WhatsApp y declara que la web no almacena los datos.
- HECHO — 2026-09-03: política de privacidad, términos y condiciones y aviso legal publicados.
- HECHO — 2026-09-04 (LLM): timeout 25 s y `maxRetries: 1` en el cliente; `max_tokens` 500; si el proveedor falla el widget muestra el error y ofrece WhatsApp. Verificado con un arnés local que ejercita 405, 400, 413, 429 y 503.
- HECHO — 2026-09-04 (LLM): entrada del usuario solo en `messages`, nunca concatenada al prompt de sistema; el sistema instruye a tratar los mensajes como preguntas. Validación estricta de forma, roles, tamaño y alternancia con tests en `test/chat-validate.test.js`.
- HECHO — 2026-09-04 (LLM): salida tratada como no confiable: solo se reenvían deltas de texto, se comprueba `stop_reason` y una respuesta parcial se descarta en el cliente si el stream falla.
- HECHO — 2026-09-04 (LLM): log JSON por llamada con `requestId`, modelo, tokens de entrada/salida, lectura de caché, latencia y motivo de error; sin el texto de la conversación.
- PARCIAL — 2026-09-04 (LLM): límite por usuario (20/10 min por `cf-connecting-ip`, o `x-real-ip`) y global (300/10 min) por instancia, con tests en `test/chat-rate-limit.test.js`. Es mejor esfuerzo: ver deuda conocida (origen alcanzable sin Cloudflare). El freno duro es el límite de gasto en Anthropic.
- HECHO — 2026-09-04 (auditoría): turnos del asistente firmados con HMAC y verificados en cada petición (tests en `test/chat-sign.test.js`); `Content-Type: application/json` obligatorio y `Sec-Fetch-Site: cross-site` rechazado; `Content-Length` obligatorio y acotado; la generación se aborta si el cliente cierra; `maxRetries: 0` para que el peor caso quepa en `maxDuration`; el widget descarta respuestas sin frame `done`; los logs no incluyen mensajes crudos del proveedor. Verificado con el arnés local (415, 403, 411, 503, 400 firma inválida, 200 firma válida).
- PENDIENTE — 2026-09-04 (LLM): límite de gasto mensual en la consola de Anthropic. Responsable: Isael. Condición: configurarlo antes de dejar el chat activo en producción.
- PENDIENTE — 2026-09-04 (LLM): `ANTHROPIC_API_KEY` en Vercel y una conversación real verificada en el preview. Responsable: Isael (la clave) y desarrollo (la verificación).
- NO APLICA (LLM): temperatura 0 y salida estructurada; el chat es conversacional y no necesita reproducibilidad.
- HECHO — 2026-09-04: privacidad y términos actualizados con el asistente (Vercel y Anthropic como encargados, sin persistencia propia, tratamiento de la IP, descargo de respuestas orientativas).
