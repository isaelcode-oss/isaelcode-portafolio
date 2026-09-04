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

## Deuda conocida

- 2026-09-03: `~/.ai/templates/ALCANCE.md` no existe en el entorno y no pudo copiarse literalmente. Se creó `ALCANCE.md` con el alcance verificable del proyecto. Condición de salida: cuando exista la plantilla oficial, comparar ambos archivos y migrar cualquier campo obligatorio ausente.
- 2026-09-03: GitHub CLI guarda la credencial en texto plano porque WSL no tiene un keyring disponible. Condición de salida: configurar Git Credential Manager o un keyring compatible y volver a autenticar `gh`.
- 2026-09-03: la CSP mantiene `style-src 'unsafe-inline'` porque el código heredado usa estilos React inline extensivamente. Condición de salida: migrar los estilos inline a clases/hojas CSS y retirar esa fuente de la directiva antes de marcar la CSP como completa.

## Cierre del contrato

- HECHO — 2026-09-03: cabeceras `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` y `Permissions-Policy` verificadas en el preview Vercel.
- PENDIENTE — 2026-09-03: retirar `style-src 'unsafe-inline'` de CSP. Responsable: Isael/desarrollo. Fecha objetivo: próximo refactor visual. Condición: migrar todos los estilos React inline a CSS.
- HECHO — 2026-09-03: presupuesto de rendimiento definido como menos de 150 kB gzip de JavaScript inicial; medido en 94.85 kB gzip.
- HECHO — 2026-09-03: foco visible, etiquetas de formulario y `prefers-reduced-motion` implementados; contraste y estructura revisados en código.
- PENDIENTE — 2026-09-03: verificación visual automatizada responsive. Responsable: Isael/desarrollo. Fecha objetivo: antes de cambios visuales posteriores. Condición: instalar/restaurar `agent-browser` o verificar manualmente el preview en móvil y escritorio.
- NO APLICA: banner de cookies; la aplicación no carga analítica ni rastreadores propios.
- HECHO — 2026-09-03: el formulario no simula éxito; abre WhatsApp y declara que la web no almacena los datos.
- HECHO — 2026-09-03: documentos legales publicados como BORRADOR con cláusulas sensibles marcadas `[REVISAR CON ABOGADO]`.
