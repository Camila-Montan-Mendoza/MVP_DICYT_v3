# Phase 1: Data Model - Detalle de Proyecto y Memoria de Cálculo

## Entidades de Base de Datos (Supabase)

### 1. Proyecto (existente, `proyecto`)

Mismos campos relevantes que en la HU 018 (`nombre`, `codigo`, `presupuesto`, `id_estado_proyecto`), más `fecha_inicio`, `fecha_fin` e `id_programa` para esta HU.

### 2. Programa (existente, `programa`)

| Campo         | Tipo      | Uso en esta HU                                  |
| ------------- | --------- | ----------------------------------------------- |
| `id`          | number    | Join desde `proyecto.id_programa`               |
| `nombre`      | string    | Columna "Programa" en CA-1                      |
| `id_convenio` | UUID (FK) | Join hacia `convenio` → `fuente_financiamiento` |

### 3. Convenio → FuenteFinanciamiento (existente)

`programa.id_convenio → convenio.id_fuente_financiamiento → fuente_financiamiento.nombre` da el valor de "Fuente de Financiamiento" en CA-1.

### 4. Partida (existente, `partida` — **con columna nueva `nombre`**)

| Campo    | Tipo               | Uso en esta HU                                 |
| -------- | ------------------ | ---------------------------------------------- |
| `id`     | number             | Join con `partida_concreta.id_partida`         |
| `codigo` | number             | Identificador visible (columna "ID"/"Partida") |
| `nombre` | string (**nuevo**) | Columna "Nombre de Partida" (CA-2)             |

### 5. PartidaConcreta / Memoria de Cálculo (existente, `partida_concreta`)

| Campo         | Tipo        | Uso en esta HU                        |
| ------------- | ----------- | ------------------------------------- |
| `id`          | number      | Identificador de fila                 |
| `id_proyecto` | number (FK) | Filtro por proyecto                   |
| `id_partida`  | number (FK) | Join con `partida` para código/nombre |
| `presupuesto` | decimal     | Columna "Monto (Bs.)"                 |

### 6. ProyectoUsuario (existente, `proyecto_usuario`)

Igual que en la HU 018: `id_rol = 1` identifica al investigador principal de un proyecto; se usa aquí tanto para mostrar el nombre del IP (CA-1) como para el control de acceso puntual por proyecto (CA-6).

---

## Modelos de Aplicación (API / Frontend)

### 7. ProyectoDetalle (respuesta de `GET /api/proyectos/[id]`)

| Campo                   | Tipo                                       | Descripción                                                          |
| ----------------------- | ------------------------------------------ | -------------------------------------------------------------------- |
| `id`                    | number                                     | Identificador del proyecto                                           |
| `nombre`                | string                                     | Nombre del proyecto                                                  |
| `presupuestoTotal`      | number                                     | `proyecto.presupuesto`                                               |
| `programa`              | string                                     | `programa.nombre`                                                    |
| `fuenteFinanciamiento`  | string \| null                             | `fuente_financiamiento.nombre`, `null` si no resoluble (Edge Case)   |
| `fechaInicio`           | string (ISO)                               | `proyecto.fecha_inicio`                                              |
| `fechaFin`              | string (ISO)                               | `proyecto.fecha_fin`                                                 |
| `estado`                | `{ id: EstadoProyectoId; nombre: string }` | Mismo shape que en la HU 018, reutilizable por `EstadoProyectoBadge` |
| `investigadorPrincipal` | `{ id: number; nombre: string } \| null`   | Igual que HU 018                                                     |
| `memoriaCalculo`        | `PartidaMemoriaCalculo[]`                  | Filas de la tabla de partidas                                        |
| `totalMemoriaCalculo`   | number                                     | Suma de `memoriaCalculo[].monto`                                     |
| `permisos`              | `PermisosDetalleProyecto`                  | Banderas de acción ya resueltas en servidor                          |

### 8. PartidaMemoriaCalculo

| Campo           | Tipo   | Descripción                                     |
| --------------- | ------ | ----------------------------------------------- |
| `id`            | number | Identificador de la partida concreta            |
| `codigoPartida` | number | Código del clasificador                         |
| `nombrePartida` | string | Nombre legible (nueva columna `partida.nombre`) |
| `monto`         | number | Monto asignado                                  |

### 9. PermisosDetalleProyecto

| Campo                  | Tipo    | Descripción                                                                                                                                                                                      |
| ---------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `puedeDetallarMemoria` | boolean | `true` solo si `rolActivo === "Investigador Principal"` (de este proyecto) y `estado.id` ∈ {Pendiente, Observado} (CA-3)                                                                         |
| `puedeEvaluar`         | boolean | `true` solo si `rolActivo === "Resp. de Presupuestos"` y `estado.id === En revisión` (CA-4)                                                                                                      |
| `soloLectura`          | boolean | `true` si `rolActivo` es Administrador de la DICyT, o si `estado.id === Habilitado para ejecutar partidas` (CA-5); cuando es `true`, `puedeDetallarMemoria` y `puedeEvaluar` son siempre `false` |

## Reglas de Validación

- Si el usuario autenticado no es investigador principal de _este_ proyecto puntual, ni tiene rol Administrador de la DICyT o Resp. de Presupuestos, `GET /api/proyectos/[id]` responde `403` sin exponer ningún campo del proyecto (CA-6).
- `puedeDetallarMemoria` y `puedeEvaluar` nunca son `true` simultáneamente (son mutuamente excluyentes por rol).
- `soloLectura === true` implica `puedeDetallarMemoria === false` y `puedeEvaluar === false`, sin excepción (CA-5).

## Transiciones de Estado

Esta HU es de solo lectura: no escribe cambios de `estado_proyecto` ni de `partida_concreta`. Las transiciones (detallar memoria de cálculo, aprobar/observar) son responsabilidad de otras HUs; esta pantalla solo expone los puntos de entrada hacia ellas cuando corresponde.
