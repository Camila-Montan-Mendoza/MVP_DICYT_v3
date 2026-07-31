# Phase 1: Data Model - Traza de Trámites por Partida

## Entidades de la Base de Datos Supabase

### 1. PartidaConcreta
Representa la asignación presupuestaria vinculada a un proyecto.

| Campo | Tipo | Descripción |
| ----- | ---- | ----------- |
| `id` | number | Identificador primario de la partida concreta |
| `id_proyecto` | number | Referencia al proyecto |
| `id_partida` | number | Referencia al catálogo de partidas |
| `presupuesto` | number | Monto asignado |

### 2. ItemTramite
Representa la afectación individual de un trámite a una partida concreta.

| Campo | Tipo | Descripción |
| ----- | ---- | ----------- |
| `id` | number | ID del ítem |
| `id_tramite` | number | Referencia al trámite de compra/contratación |
| `id_partida_concreta` | number | Referencia a la partida afectada |
| `monto_total` | number | Importe económico afectado |
| `estado_item` | number | 1: Preventivo, 2: Comprometido, 3: Pagado, 4: Revertido |

### 3. Tramite
Representa la solicitud administrativa de adquisición o pago.

| Campo | Tipo | Descripción |
| ----- | ---- | ----------- |
| `id` | number | ID del trámite |
| `codigo` | string | Correlativo del trámite (ej: TRM-2026-0042) |
| `justificacion` | string | Motivo o justificación del trámite |
| `fecha_creacion` | string | Fecha de inicio |
