# Phase 1: Data Model - Filtro de Gestión Presupuestaria

## Entidades Principales

### 1. PresupuestoGestion
Representa la asignación presupuestaria aprobada para un proyecto en una gestión fiscal específica.

| Campo | Tipo | Descripción |
| ----- | ---- | ----------- |
| `id` | number | Identificador primario de la gestión |
| `id_proyecto` | number | Referencia al proyecto |
| `gestion` | number | Año fiscal (ej: 2026, 2025) |
| `presupuesto` | number | Presupuesto total de la gestión |
| `observaciones` | string | Detalle de la aprobación de la gestión |

### 2. Estado de Filtrado por Gestión (Frontend State)
Representa la selección activa en el hook `useDashboardSeguimiento`.

| Campo | Tipo | Opciones |
| ----- | ---- | -------- |
| `selectedGestion` | number \| 'global' | `2026`, `2025`, `'global'` |
| `availableGestiones` | number[] | `[2026, 2025]` |

### 3. Modelo de Partida Concreta por Gestión
Partidas presupuestarias asociadas a la gestión seleccionada.

| Campo | Tipo | Descripción |
| ----- | ---- | ----------- |
| `id` | number | ID de la partida concreta |
| `gestion` | number | Año fiscal de la partida |
| `codigoPartida` | number | Código numérico clasificador (ej: 34200) |
| `nombrePartida` | string | Nombre descriptivo |
| `presupuestoAsignado` | number | Monto asignado en la gestión |
| `presupuestoDisponible` | number | Monto disponible en la gestión |
