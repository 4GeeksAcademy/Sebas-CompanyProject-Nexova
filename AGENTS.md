# Operación de agentes

Estas instrucciones aplican a todo el repositorio.

## Inicio de sesión

Lee `memory-bank/projectbrief.md`, `memory-bank/techContext.md`, `memory-bank/progress.md` y `memory-bank/project-rules.md` al inicio de cada sesión y antes de modificar archivos. Lee también el README de la carpeta afectada, las reglas aplicables en `.agents/rules/` y cualquier `AGENTS.md` más específico. Si vas a crear una carpeta, revisa primero los README del monorepo disponibles.

Comprueba el estado de Git y conserva los cambios existentes. Define el alcance y las comprobaciones pertinentes antes de editar. Actualiza la memoria cuando cambien hechos o decisiones del proyecto.

## Antes de cada commit

1. Revisa la solicitud, el estado de Git y los cambios, incluidos archivos nuevos; separa los cambios ajenos.
2. Ejecuta `.agents/skills/delivery-check/SKILL.md` y verifica contratos, rutas, datos personales y secretos.
3. Ejecuta las comprobaciones pertinentes y comunica sus resultados y cualquier bloqueo o riesgo.
4. Revisa el diff final y prepara únicamente los archivos autorizados y relacionados con la tarea.
5. Solicita confirmación para el commit si no está autorizado explícitamente; realiza push o PR solo cuando estén autorizados.

## Cambios que requieren confirmación explícita

- Mover o eliminar aplicaciones existentes, cambiar sus rutas o modificar contratos públicos de API y datos.
- Modificar infraestructura de despliegue, configuración de CI, permisos, credenciales o archivos de entorno.
- Modificar archivos ajenos a la tarea o generados por otra persona, incluidos archivos de bloqueo preexistentes.
- Cambiar estas instrucciones, las reglas de agentes o la memoria fuera de una solicitud que autorice esos cambios.

No incluyas cambios ajenos ni secretos en una entrega. Ante instrucciones contradictorias, solicita aclaración antes de alterar contratos, mover aplicaciones o asumir datos de negocio. No afirmes que una comprobación pasó si no se ejecutó.