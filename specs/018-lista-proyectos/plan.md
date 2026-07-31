# Implementation Plan: Visualización y Filtrado de la Lista de Proyectos por Rol

**Branch**: `018-lista-proyectos` | **Date**: 2026-07-31 | **Spec**: [specs/018-lista-proyectos/spec.md](spec.md)

**Input**: Feature specification from `/specs/018-lista-proyectos/spec.md`

## Summary

Construir la página `/proyectos` (`app/(dashboard)/proyectos/page.tsx`, ya enlazada en el sidebar de `components/sigefi-shell.tsx`) como una lista de proyectos con alcance y filtros controlados por rol. La lista se sirve desde un endpoint backend nuevo (`GET /api/proyectos`) que consulta directamente Supabase (`proyecto`, `estado_proyecto`, `proyecto_usuario`, `usuario`) y resuelve el rol activo del usuario **en el servidor** a partir de la sesión autenticada, para no confiar nunca en un rol enviado por el cliente. No se usan arreglos mock ni fallback estático: si la consulta falla o no hay datos, la interfaz muestra un estado vacío explícito (FR-010/FR-011), no una lista de relleno.

## Technical Context

**Language/Version**: TypeScript 5.x / Next.js (App Router) / React 19

**Primary Dependencies**: `@supabase/ssr` (cliente servidor vía `@/utils/supabase/server`), ShadCN UI (`Table`, `Select`, `Badge`, `Input`, `Pagination` — los tres primeros ya usados en el proyecto, `Select`/`Table`/`Pagination` deben añadirse con `npx shadcn add`), `lucide-react`

**Storage**: Supabase Postgres — tablas `proyecto`, `estado_proyecto`, `proyecto_usuario`, `usuario`, `rol` (consulta de solo lectura, sin escrituras en esta HU)

**Testing**: Estrategia MVP: pruebas unitarias bien puntuales (Vitest) solo para la función pura de armado de filtros/alcance de la query (`buildProyectosQueryParams` o equivalente) y para el mapeo de estado → color/ícono de `EstadoProyectoBadge`. Sin pruebas E2E ni de integración pesadas.

**Target Platform**: Web responsive (sidebar de escritorio `w-16`→`w-64`, barra inferior móvil `h-16` con `pb-16`, según `DESIGN.md`)

**Project Type**: Aplicación Next.js App Router existente — página + Route Handler (backend) + repositorio, sin separación frontend/backend en proyectos distintos

**Performance Goals**: Respuesta del endpoint `/api/proyectos` en <500ms para catálogos de cientos de proyectos; percepción de filtrado/limpieza de filtros en <1s (SC-001, SC-005)

**Constraints**: Cero arreglos mock o fallback estático (Principio VI de la constitución); el alcance por rol (CA-1) se determina exclusivamente en el servidor a partir de la sesión Supabase, nunca de un parámetro de rol enviado por el cliente; cumplimiento estricto de `DESIGN.md` (paleta UMSS, ShadCN UI, íconos `lucide-react`, cero emojis)

**Scale/Scope**: Ruta `/proyectos` (listado). La navegación a `/proyectos/[id]` (detalle) y a la pantalla de memoria de cálculo (FR-009) son destinos de navegación existentes como carpetas vacías; su contenido pertenece a otras HUs y no se implementa aquí.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- **I. RBAC Workflow-Driven**: El alcance (CA-1) y los filtros disponibles (CA-3) se derivan del rol activo resuelto en `GET /api/proyectos` a partir de `usuario`/`rol_usuario` en el servidor. PASS, condicionado a que ningún componente cliente decida el alcance de datos por sí mismo (solo decide qué controles de filtro *renderizar*).
- **II. Minimalist Wizard UI & Zero Emojis**: Lista tabular (no wizard, es una vista de consulta/monitoreo, no un proceso multi-paso) con badges de estado usando íconos `lucide-react` y tokens de `DESIGN.md`. PASS.
- **III. Modular React Architecture**: Separación Container (`useProyectosLista` hook) / Presentacional (`ProyectosTable`, `ProyectosFilters`, `EstadoProyectoBadge`, `ProyectosEmptyState`); acceso a datos aislado en `lib/db/proyecto-repository.ts`. PASS.
- **IV. Functional Core Scope (MVP First)**: Esta HU implementa exactamente el nodo `Lista de Proyectos` de la navegación mandatada por este principio. PASS.
- **V. Relational Integrity & Traceability**: HU de solo lectura, sin nuevas escrituras ni relaciones; la única alteración de esquema es aditiva (nuevas filas de catálogo en `estado_proyecto`, ver `data-model.md`). PASS.
- **VI. Prohibición de Mock Data**: El endpoint y el repositorio consultan Supabase directamente; ante error o ausencia de datos se renderiza un estado vacío explícito, replicando el patrón correcto (no el fallback estático usado hoy en `src/features/traza-tramites/api/fetchTrazaTramites.ts`, que esta HU **no** debe imitar). PASS, gate explícito por instrucción directa del usuario en esta sesión.

## Project Structure

### Documentation (this feature)

```text
specs/018-lista-proyectos/
├── plan.md              # Este archivo
├── research.md          # Decisiones técnicas (alcance por rol, catálogo de estados, sin mocks, paginación)
├── data-model.md        # Entidades ProyectoListItem, EstadoProyecto, filtros, respuesta paginada
├── quickstart.md        # Guía de validación manual por rol
└── contracts/
    └── proyectos-api-contract.md   # Contrato de GET /api/proyectos
```

### Source Code (repository root)

```text
app/api/proyectos/
└── route.ts                       # GET: resuelve usuario+rol de la sesión, aplica alcance/filtros/paginación

app/(dashboard)/proyectos/
└── page.tsx                       # Contenedor de la página, monta <ProyectosListaContainer />

src/features/proyectos-lista/
├── api/
│   └── fetchProyectos.ts          # fetch cliente hacia /api/proyectos con querystring de filtros
├── components/
│   ├── ProyectosListaContainer.tsx # Orquesta hook + tabla + filtros + paginación + empty states
│   ├── ProyectosFilters.tsx       # Buscar (proyecto/código) + Select Estado + Select Investigador (condicional por rol)
│   ├── ProyectosTable.tsx         # Tabla ShadCN: N°, Proyecto, Presupuesto, Estado, Investigador Principal, Acción
│   ├── EstadoProyectoBadge.tsx    # Badge color/ícono por estado (FR-007)
│   └── ProyectosEmptyState.tsx    # Distingue "sin proyectos" vs "sin coincidencias" (FR-010/FR-011)
├── hooks/
│   └── useProyectosLista.ts       # Estado de filtros/paginación, fetch, navegación al hacer clic en una fila
└── types/
    └── index.ts                   # ProyectoListItem, ProyectosListFilters, ProyectosListResponse, EstadoProyectoId

lib/db/
└── proyecto-repository.ts         # + listProyectosParaUsuario(supabase, { rolActivo, usuarioId, filtros, paginacion })

lib/auth/
└── server-auth-service.ts         # NUEVO: resolver { usuarioId, rolActivo } desde la sesión en Route Handlers (reutilizable por otros endpoints de `app/api/`)

components/ui/
├── table.tsx                      # `npx shadcn add table` (no existe aún)
├── select.tsx                     # `npx shadcn add select` (no existe aún)
└── pagination.tsx                 # `npx shadcn add pagination` (no existe aún)
```

**Structure Decision**: Se reutiliza el monolito Next.js App Router existente (sin separar frontend/backend en proyectos distintos): el "backend" pedido son Route Handlers de Next.js bajo `app/api/`, siguiendo el mismo patrón ya usado por `app/api/tramites/[id]/transicion/route.ts` y `app/api/items/route.ts`. La UI sigue el patrón `src/features/<feature>/{api,components,hooks,types}` ya establecido por `traza-tramites` y `bitacora-modificaciones`, y el acceso a datos se centraliza en `lib/db/proyecto-repository.ts` (ya existente, hoy limitado a un `SELECT id, nombre` de cliente).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| Ninguna | N/A | N/A |
