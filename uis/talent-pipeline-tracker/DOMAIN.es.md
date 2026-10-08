# Dominio de candidaturas de Nexova

## Contexto de negocio

Nexova Solutions es una consultora de RR. HH. con Operaciones de Selección como negocio principal. El equipo de Javier Almeida cuenta con 40 consultores que gestionan procesos para clientes de tecnología, retail y servicios financieros. Esta app es una vista interna para seguir candidaturas y reducir consultas manuales sobre su avance; no sustituye al ATS ni al futuro portal privado de candidatos.

## Fuente y entidad

La fuente de verdad de esta versión es `GET /records` y `GET /records/:id`, bajo `NEXT_PUBLIC_API_URL`. La entidad del API se llama `Candidate` en TypeScript y conserva los nombres `snake_case` recibidos:

| Campo | Tipo y restricción |
| --- | --- |
| `id` | Identificador UUID no vacío. |
| `full_name` | Nombre completo no vacío. |
| `email` | Correo válido; dato personal, mostrar solo en contexto interno autorizado. |
| `phone` | Cadena no vacía; campo obligatorio y dato personal. No asumir un formato telefónico concreto. |
| `position` | Puesto de texto libre no vacío; no convertirlo en enum. |
| `linkedin_url` | URL HTTPS o `null`. |
| `cv_url` | URL HTTPS o `null`; tratar el CV como documento confidencial. |
| `status` | Uno de los estados definidos abajo. |
| `stage` | Una de las etapas definidas abajo. Es independiente de `status`. |
| `experience_years` | Número no negativo; campo obligatorio. |
| `notes_count` | Entero no negativo. La respuesta no incluye el contenido de las notas. |
| `applied_at` | Fecha/hora ISO 8601 válida. |
| `updated_at` | Fecha/hora ISO 8601 válida. |

El listado está paginado. La implementación debe reunir todas las páginas usando `total` y `limit`; no asumir que la primera respuesta contiene todos los registros.

`POST /records` y `PUT /records/:id` requieren `full_name`, `email`, `phone`, `position` y `experience_years`. `linkedin_url` y `cv_url` aceptan URL o `null`. El servidor administra `id`, estado, etapa, fechas y contador de notas; no enviarlos en estos formularios. Los cambios de estado/etapa se guardan por `PATCH`.

`GET /records/:id/notes` devuelve `{ data, meta: { total } }`. Cada nota contiene `id`, `record_id`, `content` y `created_at`; `POST` recibe `{ content }` no vacío y `DELETE` identifica la nota mediante `note_id`.

## Valores de dominio

Estados (`status`):

| Valor API | Etiqueta de interfaz | Significado |
| --- | --- | --- |
| `received` | Recibida | Candidatura recibida, pendiente de avance. |
| `in_progress` | En proceso | Proceso de selección activo. |
| `selected` | Seleccionada | Perfil seleccionado para continuar o cubrir el puesto. |
| `discarded` | Descartada | Perfil que no continúa en este proceso. |

Etapas (`stage`):

| Valor API | Etiqueta de interfaz |
| --- | --- |
| `pending` | Pendiente |
| `review` | Revisión de perfil |
| `technical_interview` | Entrevista técnica |
| `personal_interview` | Entrevista personal |
| `offer_presented` | Oferta presentada |

Los valores y etiquetas viven en `app/lib/records.ts`. Los puestos son texto libre porque Nexova cubre perfiles diversos; no añadir valores de estado o etapa implícitos a partir del nombre del puesto.

## Límites y privacidad

- No inventar campos para cliente, vacante, consultor asignado, fuente, skills, puntuación IA, salario o contenido de notas: no están en la respuesta actual. Añadirlos solo cuando exista contrato de API.
- El contexto de Nexova plantea scoring, matching y seguimiento automatizado como necesidades futuras; esta vista no debe presentar puntuaciones ni recomendaciones como datos reales.
- Email, teléfono y CV son datos personales. No registrar sus valores en logs ni publicar esta vista sin autenticación y autorización por rol.
- Un futuro portal de candidatos debe limitar cada sesión a los datos de su propio titular; no reutilizar el listado interno como vista pública.
- Mantener la interfaz en español y conservar los valores API originales al consultar o actualizar registros; las etiquetas traducidas son solo de presentación.