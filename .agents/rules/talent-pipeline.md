# Convenciones del tracker de selección

**Activación:** por patrón de archivo. **Alcance:** `uis/talent-pipeline-tracker/**` y cualquier cambio que afecte su contrato de candidaturas.

- Lee `uis/talent-pipeline-tracker/AGENTS.md` y `DOMAIN.es.md` antes de modificar el tracker. Consulta las guías locales de Next.js indicadas por su `AGENTS.md` antes de escribir código.
- Mantén la interfaz en español y los nombres y valores originales de la API. Estado y etapa son independientes; los puestos son texto libre.
- Respeta paginación, campos obligatorios y operaciones documentadas en el dominio. No agregues datos de cliente, vacante, puntuación o notas que la API no entregue.
- No expongas email, teléfono ni CV en logs o vistas públicas. La publicación requiere autenticación y autorización; un portal de candidatos debe restringir el acceso al titular.
- Para cambios en la app, ejecuta desde su directorio la comprobación específica disponible; como mínimo `npm run lint` cuando las dependencias estén instaladas. Indica cualquier bloqueo.