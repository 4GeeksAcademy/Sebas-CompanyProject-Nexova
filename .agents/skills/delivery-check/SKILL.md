---
name: delivery-check
description: "Usar antes de un commit o entrega para revisar cambios y verificaciones de Nexova."
---

# Preparar una entrega

## Objetivo

Comprobar que los cambios están listos para una entrega revisable.

## Entradas

Solicitud, alcance acordado, `BRIEFING.md` y sus fuentes, estado de Git y archivos modificados, incluidos los nuevos.

## Salida

Resumen de cambios, comandos ejecutados y resultados, validaciones omitidas y riesgos pendientes.

## Procedimiento

1. Lee `AGENTS.md`, la memoria y las reglas aplicables. Ejecuta `git status --short --branch` y revisa `git diff` y `git diff --cached`; examina también los archivos nuevos relevantes. Identifica cambios ajenos y no los incluyas.
2. Contrasta los cambios con el briefing de Nexova, la solicitud, los README y contratos afectados. Verifica que no se presenten las necesidades futuras de selección, marketing o soporte como funciones existentes y que no se hayan incorporado datos personales o secretos.
3. Si la entrega incluye una app nueva, verifica que el sitio público esté en `uis/website/`, tenga entrada `/` y contenido acorde al briefing; que el backoffice esté en `uis/backoffice/`, con entrada `/` y layout independiente; y que las API estén en `services/`. No crees estas apps solo para pasar la comprobación.
4. Ejecuta la comprobación más específica disponible para cada área afectada. Para el tracker, usa `npm run lint` desde `uis/talent-pipeline-tracker/` si están instaladas sus dependencias. Para cambios solo de documentación, comprueba los enlaces y rutas modificados y ejecuta `git diff --check`; revisa también los archivos sin seguimiento, que ese comando no incluye.
5. Resume qué cambió, qué comandos se ejecutaron y sus resultados, y cualquier riesgo o validación omitida. Corrige los problemas dentro del alcance antes de solicitar autorización para el commit.

## Criterios de aceptación

- El estado y el diff revisados corresponden al alcance, sin cambios ajenos ni secretos incluidos.
- Cada ruta y enlace local añadido apunta a un destino existente, o se identifica expresamente como una ubicación futura.
- Las comprobaciones pertinentes pasan; si alguna no puede ejecutarse, se informa el motivo y no se presenta la entrega como verificada.
- La memoria y la documentación afectadas reflejan los cambios reales, distinguiendo lo existente de lo planificado.
- Los datos y procesos mencionados coinciden con el briefing de Nexova y cualquier nueva app cumple las rutas y condiciones del paso 3.
- El resumen incluye resultados concretos y riesgos pendientes. Solo se crea el commit o PR con autorización.