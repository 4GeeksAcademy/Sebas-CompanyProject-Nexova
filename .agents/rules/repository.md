# Convenciones del repositorio

**Activación:** siempre activa. **Alcance:** todos los archivos del repositorio.

- Sigue el README de la carpeta afectada; cada aplicación, servicio, agente o pipeline nuevo debe tener documentación propia.
- Contrasta los datos y procesos de negocio con `BRIEFING.md` y sus fuentes; no presentes las necesidades futuras de Nexova como funcionalidades existentes.
- Cuando se creen, ubica el sitio público en `uis/website/`, con página `/`, marca y contenido acordes al briefing; ubica la app interna en `uis/backoffice/`, con layout separado y vista de entrada `/`. Las API y servicios backend van en `services/`.
- Estas rutas no exigen crear aplicaciones en este hito. No crees otro árbol de frontend o API; las aplicaciones existentes permanecen donde están salvo decisión explícita de migración.
- Reutiliza contratos y tipos existentes cuando corresponda. Documenta cambios de contrato y evita introducir dependencias o abstracciones sin necesidad.
- Si cambian las decisiones, el estado técnico o el contexto de negocio, actualiza el archivo correspondiente de `memory-bank/` y sus fuentes.
- No añadas secretos ni datos personales reales a archivos versionados o logs.