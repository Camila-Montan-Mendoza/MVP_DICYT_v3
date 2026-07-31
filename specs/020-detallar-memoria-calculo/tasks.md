# Tasks: Detallar Memoria de Cálculo de un Proyecto

**Input**: Design documents from `/specs/020-detallar-memoria-calculo/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests Policy**: MVP focus with fast validation. Targeted unit tests for calculation logic when necessary.

**Organization**: Grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story identifier (US1, US2, US3)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and mock service setup

- [X] T001 Create feature types in `src/features/proyecto-detalle/types/index.ts`
- [X] T002 Implement mock data provider in `src/features/proyecto-detalle/services/mockProyectoService.ts` pre-seeded with project ID 1 ("Implementación de IA en Procesos Agrícolas", IP Dr. Ricardo Villarroel, 100k budget, partidas 101, 205, 301, 405, 512) and localStorage sync

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core API route endpoints and hook infrastructure

- [X] T003 Implement GET `/api/proyectos/[id]` with mock fallback in `app/api/proyectos/[id]/route.ts`
- [X] T004 [P] Implement PUT `/api/proyectos/[id]/memoria-calculo` in `app/api/proyectos/[id]/memoria-calculo/route.ts`
- [X] T005 [P] Implement POST `/api/proyectos/[id]/enviar-revision` in `app/api/proyectos/[id]/enviar-revision/route.ts`
- [X] T006 Implement editor hook `src/features/proyecto-detalle/hooks/useMemoriaCalculoEditor.ts` for managing draft partidas, realtime total computation, excess budget validation, and save/submit handlers

---

## Phase 3: User Story 1 - Ver Detalle del Proyecto y Memoria en Modo Lectura (Priority: P1) 🎯 MVP

**Goal**: Render Header Nav, Info Card, and Read-Only Consolidated Table matching Image 2 mockup.

**Independent Test**: Navigate to `/proyectos/1` and verify title, status badge, project metadata, and read-only table with total consolidated row.

- [X] T007 [P] [US1] Create Header Nav component `src/features/proyecto-detalle/components/ProyectoHeaderNav.tsx` with "Detalles del Proyecto", button "Trámites del Proyecto", and tabs ("Detalle del Proyecto" | "Ejecución Presupuestaria")
- [X] T008 [P] [US1] Create Info Card component `src/features/proyecto-detalle/components/ProyectoInfoCard.tsx` with status badge ("Memoria de cálculo pendiente", "En revisión...", "Habilitado..."), IP, Presupuesto Total, Programa, Fuente, and Dates
- [X] T009 [P] [US1] Create Read-Only Table component `src/features/proyecto-detalle/components/MemoriaCalculoReadView.tsx` with ID, Nombre de Partida, Monto (Bs.), button "Memoria de Cálculo", and Total Consolidado footer row

---

## Phase 4: User Story 2 - Modo Edición e Interactividad de la Memoria de Cálculo (Priority: P1)

**Goal**: Render interactive editor matching Image 1 mockup (search, edit amounts, remove partida, add partida, real-time recalculation).

**Independent Test**: Switch to Edit mode, edit partida amounts, search and add a partida, delete a partida, verify real-time total recalculation.

- [X] T010 [P] [US2] Create Partida Search Modal component `src/features/proyecto-detalle/components/PartidaSearchModal.tsx` for finding and adding catalog partidas by code/name/item
- [X] T011 [US2] Create Interactive Edit View component `src/features/proyecto-detalle/components/MemoriaCalculoEditView.tsx` with banner "Agregue las partidas...", search bar with filter icon, editable amount fields, trash delete action, and real-time validation
- [X] T012 [US2] Create Consolidated Footer Banner `src/features/proyecto-detalle/components/PresupuestoConsolidadoFooter.tsx` with "Presupuesto Consolidado", Total Partidas vs Presupuesto Total metrics, excess warning badge, and buttons ("Cancelar", "Enviar a revisión")

---

## Phase 5: User Story 3 - Integración y Envío a Revisión (Priority: P1)

**Goal**: Integrate container, handle submission, transition status to "En revisión de memoria de cálculo", and freeze editing.

**Independent Test**: Click "Enviar a revisión" when total <= budget, verify status updates to "En revisión de memoria de cálculo" and view switches to read-only.

- [X] T013 [US3] Update main container `src/features/proyecto-detalle/components/ProyectoDetalleContainer.tsx` to integrate `ProyectoHeaderNav`, `ProyectoInfoCard`, `MemoriaCalculoEditView`, and `MemoriaCalculoReadView`
- [X] T014 [US3] Wire "Enviar a revisión" action to call POST endpoint, update state to "En revisión de memoria de cálculo", and auto-toggle read-only view

---

## Phase 6: Polish & Verification

**Purpose**: Verification and TypeScript compliance

- [X] T015 Run `npx tsc --noEmit` and verify 0 compilation errors across all new components and routes
- [X] T016 Run quickstart scenarios in `specs/020-detallar-memoria-calculo/quickstart.md`

---

## Dependencies & Execution Order

1. **Setup & Foundational (Phases 1-2)**: T001 → T002 → T003/T004/T005/T006
2. **User Story 1 (Phase 3)**: T007, T008, T009 (Parallel)
3. **User Story 2 (Phase 4)**: T010 → T011 → T012
4. **User Story 3 (Phase 5)**: T013 → T014
5. **Polish (Phase 6)**: T015 → T016
