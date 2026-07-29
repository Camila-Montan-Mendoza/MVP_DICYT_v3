# Tasks: Efectivización, Firma de Documentos Contractuales y Espera de Entrega

**Input**: Design documents from `/specs/010-efectivizacion-firma-contratos/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests Policy**: This project is an MVP for fast validation. Tests are strictly OPTIONAL and limited only to essential, targeted unit tests ("pruebas unitarias bien puntuales") for core business logic.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Includes exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 Extend TypeScript interfaces for signature checklist and efectivización in `types/ordenes.ts`
- [x] T002 [P] Implement pure utility function for calculating remaining delivery days in `lib/utils/dias-restantes.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T003 Extend `services/ordenesService.ts` with `confirmarEfectivizacionYFirmas` to query and save signature status and audit trail in Supabase
- [x] T004 [P] Create unit tests for signature checklist validation and remaining days calculations in `tests/unit/efectivizacionValidation.test.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Impresión Directa y Verificación de Firmas por Proveedor (Priority: P1) 🎯 MVP

**Goal**: Render simplified cards per supplier with 1-click direct print button and interactive signature checklist.

**Independent Test**: Load Tarea 10 for a tramite with emitted orders, verify simplified cards, 1-click print modal launcher, and signature checklist.

- [x] T005 [P] [US1] Create direct print and signature card component in `components/tramites/ordenes/TarjetaEfectivizacionProveedor.tsx`
- [x] T006 [US1] Implement active workflow view in `components/workflow/views/paso-2-recepcion/tarea-10-firma-formalizacion-active.tsx` querying Supabase real data and rendering supplier signature cards

**Checkpoint**: User Story 1 is fully functional and testable independently (MVP ready)

---

## Phase 4: User Story 2 - Confirmación de Efectivización y Transición a Espera (Priority: P2)

**Goal**: Persist verified signatures and notification date in Supabase and trigger workflow transition.

**Independent Test**: Mark signatures complete, click "CONFIRMAR EFECTIVIZACIÓN", verify Supabase persistence and workflow transition.

- [x] T007 [US2] Connect `confirmarEfectivizacionYFirmas` action in `components/workflow/views/paso-2-recepcion/tarea-10-firma-formalizacion-active.tsx` to save in Supabase and execute task transition

**Checkpoint**: User Stories 1 AND 2 work independently

---

## Phase 5: User Story 3 - Panel de Seguimiento de Plazos y Cronograma de Entrega (Priority: P3)

**Goal**: Display remaining days countdown badge and delivery deadline status per supplier order.

**Independent Test**: Check an efectivized order card and verify the remaining delivery days countdown indicator.

- [x] T008 [P] [US3] Add remaining days badge and delivery countdown indicator in `components/tramites/ordenes/TarjetaEfectivizacionProveedor.tsx`

**Checkpoint**: All user stories are independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T009 [P] Implement passive workflow view in `components/workflow/views/paso-2-recepcion/tarea-10-firma-formalizacion-passive.tsx` for viewing efectivized orders in read-only mode
- [x] T010 Run TypeScript build verification (`npx tsc --noEmit`) and validate end-to-end workflow

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: Depend on Foundational phase completion
- **Polish (Phase 6)**: Depends on user stories completion

---

## Parallel Opportunities

- T002 [P] can run in parallel with T001
- T004 [P] can run in parallel with T003
- T005 [P] [US1] can run in parallel with T008 [P] [US3]
- T009 [P] can run in parallel with T010
