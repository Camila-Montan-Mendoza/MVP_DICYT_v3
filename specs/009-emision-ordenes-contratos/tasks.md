# Tasks: Generación y Emisión de Órdenes de Compra, Órdenes de Servicio o Contratos

**Input**: Design documents from `/specs/009-emision-ordenes-contratos/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests Policy**: This project is an MVP for fast validation. Tests are strictly OPTIONAL and limited only to essential, targeted unit tests ("pruebas unitarias bien puntuales") for core business logic.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Includes exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 Define TypeScript data interfaces in `types/ordenes.ts`
- [x] T002 [P] Implement Spanish currency literal converter utility in `lib/utils/numero-a-letras.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T003 Implement Supabase data service `services/ordenesService.ts` with `obtenerOrdenesContractualesTramite` and `emitirOrdenContractual` methods
- [x] T004 [P] Create unit tests for deadline calculations and literal text formatting in `tests/unit/ordenesValidation.test.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Emisión Automática por Proveedor (Plazo ≤ 15 días) (Priority: P1) 🎯 MVP

**Goal**: Display pre-filled order accordions for each awarded supplier with items, calculated delivery deadline, and literal bolivianos text.

**Independent Test**: Load Tarea 9 for an awarded tramite with delivery time ≤ 15 days and verify independent supplier cards displaying pre-filled items, totals, and automatic delivery date.

- [x] T005 [P] [US1] Create supplier order card component in `components/tramites/ordenes/TarjetaOrdenProveedor.tsx`
- [x] T006 [US1] Implement active workflow view in `components/workflow/views/paso-2-recepcion/tarea-9-emision-orden-compra-active.tsx` fetching data from `ordenesService.ts` and displaying supplier order cards

**Checkpoint**: User Story 1 is fully functional and testable independently (MVP ready)

---

## Phase 4: User Story 2 - Previsualización e Impresión Oficial UMSS / DICyT (Priority: P2)

**Goal**: Render an official printable modal with UMSS / DICyT layout, N° correlativo, Dia/Mes/Año header, item table, and 3 signature blocks.

**Independent Test**: Click "Imprimir" on any order card and verify the print modal opens showing the exact institutional layout, assigned correlative, and signature boxes.

- [x] T007 [P] [US2] Create official printable modal component in `components/tramites/ordenes/ModalImpresionOrden.tsx`
- [x] T008 [US2] Connect print preview trigger and correlative assignment in `TarjetaOrdenProveedor.tsx` and `tarea-9-emision-orden-compra-active.tsx`

**Checkpoint**: User Stories 1 AND 2 work independently

---

## Phase 5: User Story 3 - Formalización y Adjuntado de Contratos para Plazos Mayores a 15 Días (Priority: P3)

**Goal**: Handle orders with delivery time > 15 days by setting document type to CONTRATO, displaying Asesoría Legal alert, and uploading signed PDF contract.

**Independent Test**: Load Tarea 9 for a supplier with delivery > 15 days, verify CONTRATO classification, Asesoría Legal alert, and upload a PDF contract.

- [x] T009 [P] [US3] Add contract mode (> 15 days) and PDF file uploader in `components/tramites/ordenes/TarjetaOrdenProveedor.tsx`
- [x] T010 [US3] Integrate PDF upload and contract registration in `services/ordenesService.ts` and `tarea-9-emision-orden-compra-active.tsx`

**Checkpoint**: All user stories are independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T011 [P] Implement passive workflow view in `components/workflow/views/paso-2-recepcion/tarea-9-emision-orden-compra-passive.tsx` for viewing emitted orders in read-only mode
- [x] T012 Run TypeScript build verification (`npx tsc --noEmit`) and validate end-to-end workflow

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: Depend on Foundational phase completion
- **Polish (Phase 6)**: Depends on user stories completion

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2)
- **User Story 2 (P2)**: Can start after Foundational (Phase 2)
- **User Story 3 (P3)**: Can start after Foundational (Phase 2)

---

## Parallel Opportunities

- T002 [P] can run in parallel with T001
- T004 [P] can run in parallel with T003
- T005 [P] [US1] can run in parallel with T007 [P] [US2] and T009 [P] [US3]
- T011 [P] can run in parallel with T012
