# Tasks: Generación y Envío de Solicitud de Pago a Proveedor

**Input**: Design documents from `/specs/012-solicitud-pago-proveedor/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests Policy**: This project is an MVP for fast validation. Tests are strictly OPTIONAL and limited only to essential, targeted unit tests ("pruebas unitarias bien puntuales") for core business logic.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Includes exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 Define TypeScript data interfaces in `types/solicitudPago.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T002 Create Supabase data service `services/solicitudPagoService.ts` with `obtenerSolicitudesPagoTramite`, `enviarSolicitudPago`, `validarSolicitudPago`, and `observarSolicitudPago` methods
- [x] T003 [P] Create unit tests for observation reason validation in `tests/unit/solicitudPagoValidation.test.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Generación Automática y Envío de Solicitud de Pago por Proveedor (Priority: P1) 🎯 MVP

**Goal**: Render payment request cards per awarded supplier with general info, attached documents (Factura PDF, Nota de Entrega), invoice preview box, and floating send button.

**Independent Test**: Load Tarea 13 for a tramite with completed reception, verify auto-generated payment cards per supplier with pre-filled amounts and floating send button.

- [x] T004 [P] [US1] Create supplier payment request card component in `components/tramites/pago/TarjetaSolicitudPagoProveedor.tsx`
- [x] T005 [US1] Implement active workflow view in `components/workflow/views/paso-3-pago/tarea-13-solicitud-pago-active.tsx` fetching real data from Supabase DB and rendering payment request cards

**Checkpoint**: User Story 1 is fully functional and testable independently (MVP ready)

---

## Phase 4: User Story 2 - Visor Membretado UMSS - DICyT y Validación u Observación por Compras / Contabilidad (Priority: P2)

**Goal**: Render printable modal "UMSS • DICyT Nota de Solicitud de Pago" and handle validation and observation actions by Compras/Contabilidad.

**Independent Test**: Open document modal, test "Validar Solicitud" (advances to Paso 3 Tarea 14) and "Observar Solicitud" (exiges observation text and sets status to OBSERVADA).

- [x] T006 [P] [US2] Create official printable modal component in `components/tramites/pago/ModalImpresionNotaPago.tsx`
- [x] T007 [US2] Connect validation and observation actions in `components/workflow/views/paso-3-pago/tarea-13-solicitud-pago-active.tsx` saving to Supabase and handling workflow routing

**Checkpoint**: User Stories 1 AND 2 work independently

---

## Phase 5: User Story 3 - Subsanación y Reenvío de Solicitudes Observadas (Priority: P3)

**Goal**: Render observation alert banner with reason text and resubmission controls when status is OBSERVADA.

**Independent Test**: Load an observed payment request, verify red alert banner with reason, edit attachments, and resubmit.

- [x] T008 [P] [US3] Add observation alert banner and resubmission controls in `components/tramites/pago/TarjetaSolicitudPagoProveedor.tsx`

**Checkpoint**: All user stories are independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T009 [P] Implement passive workflow view in `components/workflow/views/paso-3-pago/tarea-13-solicitud-pago-passive.tsx` for viewing registered payment requests in read-only mode
- [x] T010 Run TypeScript build verification (`npx tsc --noEmit`) and validate end-to-end workflow

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: Depend on Foundational phase completion
- **Polish (Phase 6)**: Depend on user stories completion

---

## Parallel Opportunities

- T003 [P] can run in parallel with T002
- T004 [P] [US1] can run in parallel with T006 [P] [US2] and T008 [P] [US3]
- T009 [P] can run in parallel with T010
