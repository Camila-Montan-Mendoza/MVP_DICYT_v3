# Tasks: Registro del Acta de Recepción Provisional o Definitiva de Materiales

**Input**: Design documents from `/specs/011-acta-recepcion-materiales/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests Policy**: This project is an MVP for fast validation. Tests are strictly OPTIONAL and limited only to essential, targeted unit tests ("pruebas unitarias bien puntuales") for core business logic.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Includes exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 Define TypeScript data interfaces in `types/recepcion.ts`
- [x] T002 [P] Delete obsolete Tarea 12 views in `components/workflow/views/paso-2-recepcion/tarea-12-recepcion-definitiva-active.tsx` and `components/workflow/views/paso-2-recepcion/tarea-12-recepcion-definitiva-passive.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T003 Create Supabase data service `services/recepcionService.ts` with `obtenerDatosRecepcionTramite` and `guardarActaRecepcion` methods
- [x] T004 [P] Create unit tests for invoice attachment validation and date checks in `tests/unit/recepcionValidation.test.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Registro de Conformidad de Materiales y Participantes (Priority: P1) 🎯 MVP

**Goal**: Render receipt cards per supplier showing project info, 3 participant inputs (Coordinador, Rep. Empresa, Rep. Bienes), and item state inspection table.

**Independent Test**: Load Tarea 11 for a tramite, verify pre-filled project data, participant inputs, and material item inspection table.

- [x] T005 [P] [US1] Create supplier receipt card form component in `components/tramites/ordenes/TarjetaRecepcionProveedor.tsx`
- [x] T006 [US1] Implement active workflow view in `components/workflow/views/paso-2-recepcion/tarea-11-recepcion-provisional-active.tsx` fetching real data from Supabase DB and rendering receipt card forms

**Checkpoint**: User Story 1 is fully functional and testable independently (MVP ready)

---

## Phase 4: User Story 2 - Previsualización UMSS - DAF y Doble Transición (Provisional vs. Definitiva) (Priority: P2)

**Goal**: Render printable modal "UMSS - DAF ACTA DE RECEPCIÓN" and handle dual transition buttons (Acta Provisional vs. Acta Definitiva).

**Independent Test**: Click "GENERAR ACTA" to view official document preview, test "Emitir Acta Provisional" (stays in task 11) and "Emitir Acta Definitiva" (advances to Paso 3).

- [x] T007 [P] [US2] Create official printable modal component in `components/tramites/ordenes/ModalImpresionActaRecepcion.tsx`
- [x] T008 [US2] Connect dual transition action buttons (**Emitir Acta Provisional** vs **Emitir Acta Definitiva**) in `components/workflow/views/paso-2-recepcion/tarea-11-recepcion-provisional-active.tsx` saving to Supabase and handling workflow routing

**Checkpoint**: User Stories 1 AND 2 work independently

---

## Phase 5: User Story 3 - Carga de Factura del Proveedor y Evidencias Fotográficas (Priority: P3)

**Goal**: Provide invoice PDF and photo file uploader with validation requiring invoice attachment for definitive act emission.

**Independent Test**: Upload invoice PDF and photo files, verify validation blocks definitive act emission if invoice is missing.

- [x] T009 [P] [US3] Add invoice PDF and photo uploader with validation in `components/tramites/ordenes/TarjetaRecepcionProveedor.tsx`

**Checkpoint**: All user stories are independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T010 [P] Implement passive workflow view in `components/workflow/views/paso-2-recepcion/tarea-11-recepcion-provisional-passive.tsx` for viewing registered receipt acts in read-only mode
- [x] T011 Run TypeScript build verification (`npx tsc --noEmit`) and validate end-to-end workflow

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: Depend on Foundational phase completion
- **Polish (Phase 6)**: Depend on user stories completion

---

## Parallel Opportunities

- T002 [P] can run in parallel with T001
- T004 [P] can run in parallel with T003
- T005 [P] [US1] can run in parallel with T007 [P] [US2] and T009 [P] [US3]
- T010 [P] can run in parallel with T011
