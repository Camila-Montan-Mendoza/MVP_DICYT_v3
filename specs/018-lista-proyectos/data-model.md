# Phase 1: Data Model - Lista de Proyectos por Rol

## Entidades de Base de Datos (Supabase)

### 1. Proyecto (existente, `proyecto`)

| Campo | Tipo | Uso en esta HU |
| ----- | ---- | --------------- |
| `id` | number | Identificador, navegación al detalle |
| `nombre` | string | Columna "Proyecto" y filtro de búsqueda |
| `codigo` | string | Filtro de búsqueda (código SISIN) |
| `presupuesto` | decimal | Columna "Presupuesto" |
| `id_estado_proyecto` | number (FK) | Determina la etiqueta de estado (FR-007) |

### 2. EstadoProyecto (existente, catálogo `estado_proyecto` — seed actualizado)

| id | nombre | Color/Ícono UI (FR-007) |
| -- | ------ | ------------------------ |
| 1 | Pendiente de memoria de cálculo | `bg-red-50 text-red-700 border-red-200`, ícono `AlertCircle` |
| 2 | En revisión de memoria de cálculo | `bg-blue-50 text-[#003770] border-blue-200`, ícono `Clock` |
| 3 | Observado | `bg-amber-50 text-amber-800 border-amber-200`, ícono `AlertTriangle` |
| 4 | Habilitado para ejecutar partidas | `bg-emerald-50 text-emerald-700 border-emerald-200`, ícono `CheckCircle2` |

Ver decisión de reemplazo de catálogo en [research.md](research.md#2-catálogo-de-estados-de-la-memoria-de-cálculo-fr-007).

### 3. ProyectoUsuario (existente, `proyecto_usuario`)

| Campo | Tipo | Uso en esta HU |
| ----- | ---- | --------------- |
| `id_proyecto` | number (FK) | Join para alcance (CA-1) e investigador principal (CA-2) |
| `id_usuario` | number (FK) | Usuario autenticado (alcance) / investigador mostrado |
| `id_rol` | number (FK) | `1` = Investigador Principal (filtro de alcance y de columna) |

### 4. Usuario (existente, `usuario`)

| Campo | Tipo | Uso en esta HU |
| ----- | ---- | --------------- |
| `id` | number | Join con `proyecto_usuario` |
| `username` / nombre para mostrar | string | Columna "Investigador Principal" y opciones del filtro por investigador |

---

## Modelos de Aplicación (API / Frontend)

### 5. ProyectoListItem (respuesta de `GET /api/proyectos`)

| Campo | Tipo | Descripción |
| ----- | ---- | ----------- |
| `id` | number | Identificador del proyecto |
| `numero` | number | Número de fila visible (1-based, relativo a la página actual) |
| `nombre` | string | Nombre del proyecto |
| `codigo` | string | Código SISIN |
| `presupuesto` | number | Presupuesto total |
| `estado` | `{ id: number; nombre: string }` | Estado actual (una de las 4 filas de `estado_proyecto`) |
| `investigadorPrincipal` | `{ id: number; nombre: string } \| null` | `null` si no hay IP asignado (Edge Case) |

### 6. ProyectosListFilters (query params de `GET /api/proyectos`)

| Campo | Tipo | Aplica a roles | Descripción |
| ----- | ---- | --------------- | ----------- |
| `q` | string (opcional) | Todos | Búsqueda por nombre/código de proyecto (FR-004/FR-005) |
| `estadoId` | number (opcional) | Todos | Filtro por uno de los 4 estados |
| `investigadorId` | number (opcional) | Solo Administrador/Resp. de Presupuestos (FR-005); ignorado/rechazado si lo envía un Investigador Principal | Filtro adicional por investigador principal |
| `page` | number (default 1) | Todos | Paginación |
| `pageSize` | number (default 10) | Todos | Tamaño de página |

### 7. ProyectosListResponse

| Campo | Tipo | Descripción |
| ----- | ---- | ----------- |
| `proyectos` | `ProyectoListItem[]` | Página actual de resultados |
| `total` | number | Total de proyectos que cumplen los filtros dentro del alcance del rol |
| `page` | number | Página actual |
| `pageSize` | number | Tamaño de página |
| `scope` | `"own" \| "all"` | Alcance aplicado, informativo para depuración/UI (no lo decide el cliente) |

### 8. RolActivoContext (interno del Route Handler, no expuesto en la respuesta)

| Campo | Tipo | Descripción |
| ----- | ---- | ----------- |
| `usuarioId` | number | Resuelto desde la sesión Supabase |
| `rolActivo` | string | Uno de los valores de `rol.nombre` |
| `scope` | `"own" \| "all"` | `"own"` si `rolActivo === "Investigador Principal"`; `"all"` si es `"Administradora DICyT"`, `"Administrador del Sistema SIGEFI"` o `"Resp. de Presupuestos"` |

## Reglas de Validación

- Si `rolActivo` es `Investigador Principal` y llega `investigadorId` en la query, el servidor lo ignora (no debe poder ver proyectos de otro investigador ni usarlo para inferir datos de terceros).
- `pageSize` se acota a un máximo razonable (ej. 50) para evitar exfiltración masiva en una sola respuesta.
- `estadoId` debe pertenecer al conjunto de 4 IDs válidos de `estado_proyecto`; valores fuera de rango se ignoran silenciosamente (no rompen la consulta).

## Transiciones de Estado

Esta HU es de solo lectura: no escribe transiciones de `estado_proyecto`. La transición entre los 4 estados (por ejemplo, de "Observado" a "Habilitado para ejecutar partidas") es responsabilidad de HU-B.