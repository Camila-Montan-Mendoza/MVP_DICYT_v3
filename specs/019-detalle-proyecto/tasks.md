# Tasks: Visualización del Detalle de Proyecto y su Memoria de Cálculo

**Input**: Design documents from `/specs/019-detalle-proyecto/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests Policy**: A pedido explícito del usuario, sin tareas de pruebas unitarias en esta HU (MVP: priorizar velocidad y costo). Verificación final solo por compilación TypeScript (`tsc --noEmit`) y revisión manual de `quickstart.md`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g. US1, US2, US3, US4)

Tareas deliberadamente consolidadas (varios archivos pequeños por tarea) para minimizar el número de pasos.

---

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 Añadir columna `nombre` al catálogo `partida` y poblarla con los nombres reales de los códigos ya sembrados (34200, 39500, 43120, 43400, 31100, 25600, 34110, 43110, 21600) en `docs/01_seed_catalogos_base.sql` (`ALTER TABLE ... ADD COLUMN IF NOT EXISTS "nombre" VARCHAR(255)` + `UPDATE`/seed), según `research.md` §1

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Endpoint backend real con control de acceso y permisos ya resueltos. Bloquea todas las historias de usuario.

- [x] T002 Crear las interfaces TypeScript `ProyectoDetalle`, `PartidaMemoriaCalculo`, `PermisosDetalleProyecto` en `src/features/proyecto-detalle/types/index.ts`, según `data-model.md`
- [x] T003 Extender `lib/db/proyecto-repository.ts` con `getProyectoDetalle(supabase, { proyectoId, usuarioId, rolActivo })`: consulta real uniendo `proyecto`, `estado_proyecto`, `programa`, `convenio`, `fuente_financiamiento`, `proyecto_usuario`+`usuario` (investigador principal) y `partida_concreta`+`partida` (memoria de cálculo); calcula `permisos` (`puedeDetallarMemoria`, `puedeEvaluar`, `soloLectura`) según rol+estado (`data-model.md` §9); retorna `null` si el proyecto no existe o si el usuario no tiene acceso (CA-6, `research.md` §2). Sin arreglos de respaldo.
- [x] T004 Implementar `GET /api/proyectos/[id]` en `app/api/proyectos/[id]/route.ts` reutilizando `resolveServerAuthContext` (de la HU 018) + `getProyectoDetalle`, devolviendo `401`/`403`/`404`/`200`/`500` según `contracts/proyecto-detalle-api-contract.md`
- [x] T005 [P] Crear el fetcher cliente `fetchProyectoDetalle` en `src/features/proyecto-detalle/api/fetchProyectoDetalle.ts` (depends on T002)

**Checkpoint**: `GET /api/proyectos/[id]` listo y probable directamente antes de construir la UI.

---

## Phase 3: User Story 1 - Ver el detalle general y la memoria de cálculo (Priority: P1) 🎯 MVP

**Goal**: Mostrar en `/proyectos/[id]` la información general del proyecto y la tabla de partidas de su memoria de cálculo, siempre juntas.

**Independent Test**: Abrir el detalle de un proyecto con cualquier rol autorizado y verificar que aparecen los datos generales (CA-1) y la tabla de partidas con su total (CA-2).

### Implementation for User Story 1

- [x] T006 [US1] Crear el hook `useProyectoDetalle` (fetch por `proyectoId`, estados `isLoading`/`error`/`notFound`/`forbidden`) en `src/features/proyecto-detalle/hooks/useProyectoDetalle.ts` (depends on T005)
- [x] T007 [US1] Crear `ProyectoInfoCard` (tarjeta con nombre, investigador principal, presupuesto, programa, fuente de financiamiento, fechas y `EstadoProyectoBadge` reutilizado de `src/features/proyectos-lista/components/EstadoProyectoBadge.tsx`) y `MemoriaCalculoTable` (tabla ID/Nombre de Partida/Monto + fila de total, ShadCN `Table` ya existente en `components/ui/table.tsx`) en `src/features/proyecto-detalle/components/ProyectoInfoCard.tsx` y `MemoriaCalculoTable.tsx`
- [x] T008 [US1] Crear `ProyectoDetalleContainer` (orquesta hook + `ProyectoInfoCard` + `MemoriaCalculoTable`, maneja estados de carga/`403`/`404`/error) y `app/(dashboard)/proyectos/[id]/page.tsx` (monta el container con el `id` de la ruta dentro de `SigefiShell`) (depends on T006, T007)

**Checkpoint**: User Story 1 funcional de forma independiente — MVP.

---

## Phase 4: User Story 2 - Mensaje y botón "Detallar memoria de cálculo" (Priority: P2)

**Goal**: Para el Investigador Principal con proyecto Pendiente/Observado, mostrar el mensaje y el botón que navega a `/proyectos/{id}/memoria-calculo`.

**Independent Test**: Como Investigador Principal de un proyecto Pendiente u Observado, ver el mensaje+botón sobre la tabla; verificar que no aparece para otros roles/estados.

### Implementation for User Story 2

- [x] T009 [US2] Crear `MemoriaCalculoActionBanner` en `src/features/proyecto-detalle/components/MemoriaCalculoActionBanner.tsx`: si `permisos.puedeDetallarMemoria`, muestra el mensaje + botón "Detallar memoria de cálculo" (`router.push` a `/proyectos/{id}/memoria-calculo`); si `permisos.soloLectura` o ninguna bandera activa, no renderiza nada. Integrarlo sobre `MemoriaCalculoTable` en `ProyectoDetalleContainer.tsx` (depends on T008)

**Checkpoint**: US1 + US2 funcionan juntas.

---

## Phase 5: User Story 3 - Opción de evaluar (Priority: P2)

**Goal**: Para el Responsable de Presupuestos con proyecto En revisión, mostrar el acceso a evaluar (aprobar/observar).

**Independent Test**: Como Responsable de Presupuestos con proyecto En revisión, ver la opción de evaluar; verificar que no aparece en estado Habilitado.

### Implementation for User Story 3

- [x] T010 [US3] Extender `MemoriaCalculoActionBanner.tsx`: si `permisos.puedeEvaluar`, mostrar la opción "Evaluar Memoria de Cálculo" (botón hacia `/proyectos/{id}/evaluar`, ruta stub de HU-B) en lugar del mensaje de detallar (depends on T009)

**Checkpoint**: US1, US2 y US3 funcionan juntas.

---

## Phase 6: User Story 4 - Solo lectura garantizada (Priority: P3)

**Goal**: Ningún botón de edición/evaluación visible cuando `permisos.soloLectura` es `true` (Administrador siempre; cualquier rol si el estado es Habilitado).

**Independent Test**: Como Administrador, o con cualquier rol sobre un proyecto Habilitado, verificar que `MemoriaCalculoActionBanner` no renderiza ningún botón.

### Implementation for User Story 4

- [x] T011 [US4] Verificar y ajustar en `MemoriaCalculoActionBanner.tsx` que `permisos.soloLectura === true` tiene prioridad sobre cualquier otra bandera y oculta el componente por completo (depends on T010)

**Checkpoint**: Las 4 historias de usuario funcionan de forma independiente.

---

## Phase 7: Polish

- [x] T012 Verificar la compilación de TypeScript con `npx tsc --noEmit` y revisar manualmente los escenarios de `specs/019-detalle-proyecto/quickstart.md`

---

## Dependencies & Execution Order

- **Setup (T001)** → **Foundational (T002-T005)** → **US1 (T006-T008, MVP)** → **US2 (T009)** → **US3 (T010)** → **US4 (T011)** → **Polish (T012)**.
- T005 puede correr en paralelo con el resto de Foundational una vez creado T002.

## Implementation Strategy

1. Setup + Foundational → backend real de detalle listo, sin mocks.
2. US1 → pantalla completa de solo consulta → **MVP**.
3. US2 → botón de detallar para el Investigador Principal.
4. US3 → opción de evaluar para el Responsable de Presupuestos.
5. US4 → verificación final de que el modo solo lectura nunca muestra botones.
6. Polish → compilación + validación manual de `quickstart.md`.
