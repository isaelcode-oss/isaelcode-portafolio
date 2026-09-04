# Contexto del proyecto

## Clasificación

- Tipo: frontend web / landing comercial.
- Maneja dinero: no.
- Maneja datos personales: sí; el visitante puede proporcionar nombre, correo y detalles de su proyecto al iniciar contacto.
- Multi-tenant: no.
- Exposición: pública mediante Cloudflare y Vercel.
- Escala esperada: cientos de visitantes.
- Estado: código existente al que hay que adaptarse.

## Contrato aplicable

Aplica el bloque `Frontend web / landing / PWA` de `~/.ai/templates/CONTRATOS.md` porque esta aplicación es una landing React/Vite pública. No es PWA. Debe incluir cabeceras de seguridad y CSP, presupuesto de rendimiento, accesibilidad por teclado/contraste/textos alternativos, consentimiento previo si se incorpora analítica y estados de carga/error veraces.

## Herramientas y servicios

- React y Vite: stack existente; se mantiene para evitar una reescritura sin beneficio comercial.
- Vercel: previews, build y hosting del dominio actual.
- GitHub: fuente de verdad y despliegue automático del repositorio privado.
- WhatsApp y correo bajo `isaelcode.dev`: canales de contacto reales sin introducir un procesador de formularios externo.
- Cloudflare: borde público existente; no se cambia su configuración en este alcance.
- Validación HTML del formulario: el contenido se codifica en el cliente y se entrega a WhatsApp; no se almacena en esta aplicación.

## Decisiones reversibles

- 2026-09-03: centralizar teléfono, correo y URLs en un módulo de configuración para evitar fuentes de verdad duplicadas.
- 2026-09-03: enviar el formulario mediante un enlace de WhatsApp prellenado y ofrecer `mailto:` como alternativa. Evita simular entregas y no ata el sitio a un proveedor hasta que se elija uno explícitamente.
- 2026-09-03: presentar los trabajos como proyectos de demostración/capacidades técnicas; el propietario confirmó que las afirmaciones anteriores de uso real no eran ciertas.
- 2026-09-03: mostrar una introducción tipo terminal Linux de 2.6 segundos en cada carga, con botón para saltarla, por decisión explícita del propietario.
- 2026-09-03: mantener las marcas de revisión legal en `legal/REVISION-LEGAL.md`; las páginas públicas presentan el contenido operativo sin anotaciones internas ni afirmaciones de cumplimiento.
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

## Deuda conocida

- 2026-09-03: `~/.ai/templates/ALCANCE.md` no existe en el entorno y no pudo copiarse literalmente. Se creó `ALCANCE.md` con el alcance verificable del proyecto. Condición de salida: cuando exista la plantilla oficial, comparar ambos archivos y migrar cualquier campo obligatorio ausente.
- 2026-09-03: GitHub CLI guarda la credencial en texto plano porque WSL no tiene un keyring disponible. Condición de salida: configurar Git Credential Manager o un keyring compatible y volver a autenticar `gh`.
- 2026-09-03: la CSP mantiene `style-src 'unsafe-inline'` porque el código heredado usa estilos React inline extensivamente. Condición de salida: migrar los estilos inline a clases/hojas CSS y retirar esa fuente de la directiva antes de marcar la CSP como completa.
  Actualización 2026-09-03: el refinamiento premium migró a clases CSS los estilos inline
  estáticos de Hero, Projects, ProjectCard, Skills, About y Contact. PERO `framer-motion`
  anima escribiendo el atributo `style` en runtime, así que `'unsafe-inline'` (o
  `style-src-attr`) no puede retirarse del todo mientras la librería siga en uso. La
  condición de salida real es: sustituir framer-motion por animaciones CSS, o aceptar
  `style-src-attr 'unsafe-inline'` documentado como límite de la librería.
- 2026-09-04: `src/components/canvas/` (Background3D, TechSphere) borrado con confirmación
  del propietario; era código muerto sin importadores.

## Cierre del contrato

- HECHO — 2026-09-03: cabeceras `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` y `Permissions-Policy` verificadas en el preview Vercel.
- PENDIENTE — 2026-09-03: retirar `style-src 'unsafe-inline'` de CSP. Responsable: Isael/desarrollo. Fecha objetivo: próximo refactor visual. Condición: migrar todos los estilos React inline a CSS.
- HECHO — 2026-09-03: presupuesto de rendimiento definido como menos de 150 kB gzip de JavaScript inicial; medido en 94.85 kB gzip.
- HECHO — 2026-09-03: foco visible, etiquetas de formulario y `prefers-reduced-motion` implementados; contraste y estructura revisados en código.
- HECHO — 2026-09-04: verificación visual responsive con Chromium de Playwright (escritorio 1440px y móvil 390px, con scroll para disparar las animaciones `whileInView`). Nota: los emoji de las tarjetas salen como cuadros solo en el entorno de captura (WSL sin fuente emoji); los navegadores reales los renderizan.
- NO APLICA: banner de cookies; la aplicación no carga analítica ni rastreadores propios.
- HECHO — 2026-09-03: el formulario no simula éxito; abre WhatsApp y declara que la web no almacena los datos.
- HECHO — 2026-09-03: documentos legales publicados como BORRADOR con cláusulas sensibles marcadas `[REVISAR CON ABOGADO]`.
