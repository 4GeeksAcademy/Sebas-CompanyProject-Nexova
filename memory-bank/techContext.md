# Contexto técnico

## Estado actual

- En la raíz hay páginas estáticas (`index.html` y `application.html`) y `validation.js`. `npm run dev` sirve la raíz con `http-server` en el puerto 3000.
- `uis/talent-pipeline-tracker/` es una aplicación Next.js 16, React 19 y TypeScript. Su contrato de candidaturas y privacidad está en `DOMAIN.es.md`; consulta su `AGENTS.md` antes de modificarla.
- El tracker consume una API configurada mediante `NEXT_PUBLIC_API_URL`. El dominio documenta `/records`; no asumir que existe una API implementada en este repositorio.
- `packages/shared/` contiene tipos compartidos. Las demás carpetas organizan servicios, datos, agentes, skills, automatización e infraestructura según sus README.

## Arquitectura y restricciones

`uis/` reúne los proyectos frontend. Cuando se creen, el sitio público vivirá en `uis/website/`, con la página corporativa en la ruta `/` y marca y contenido acordes al [briefing](../BRIEFING.md). La aplicación interna vivirá en `uis/backoffice/`, con layout propio separado del sitio público y vista de entrada en `/`. Las API y servicios backend vivirán en `services/`.

Estas rutas son decisiones para proyectos futuros, no afirmaciones de que ya existan. Lee primero `uis/README.md` o `services/README.md`, según corresponda, y documenta cada proyecto o servicio nuevo. No crees un árbol paralelo ni muevas las aplicaciones existentes sin una decisión explícita.

`.agents/` configura agentes de desarrollo; `agents/` y `skills/` contienen recursos para los agentes y las integraciones de producto de la empresa.

El README raíz describe una plantilla y contiene afirmaciones de estado desactualizadas; contrástalas con los archivos y scripts reales. Las necesidades del briefing no son evidencia de funcionalidades desplegadas.