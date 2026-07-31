# Tasks: Revisar Memoria de Cálculo de un Proyecto

**Input**: Design documents from `/specs/021-revisar-memoria-calculo/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests Policy**: Fast MVP validation. Targeted unit tests for core state transitions.

**Organization**: Grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story identifier (US1, US2, US3, US4)

---

## Phase 1: Setup & Data Model Extensions

**Purpose**: Update types and mock service state machine.

- [x] T001 Create evaluation types in `src/features/proyecto-detalle/types/index.ts`
- [x] T002 Update mock state machine `evaluarMemoriaCalculo` in `src/features/proyecto-detalle/services/mockProyectoService.ts` for handling "aprobar" (state 4) and "observar" (state 3 + motivo) transitions

---

## Phase 2: Foundational API Routes

**Purpose**: Core evaluation endpoint.

- [x] T003 Implement POST endpoint in `app/api/proyectos/[id]/evaluar/route.ts` with validation for non-empty `motivoObservacion` when observing

---

## Phase 3: User Story 1 & 2 - Evaluation & Approval View (Priority: P1) 🎯 MVP

**Goal**: Render evaluation action buttons and approval flow for Responsable de Presupuestos.

**Independent Test**: Open `/proyectos/2`, click "Aprobar", confirm approval, verify status updates to "Habilitado para ejecutar partidas" (ID 4) and view freezes to read-only.

- [x] T004 [P] [US1] Create evaluation modal `src/features/proyecto-detalle/components/EvaluacionMemoriaModal.tsx` for approval confirmation and observation reason entry with validation
- [x] T005 [P] [US2] Update banner `src/features/proyecto-detalle/components/MemoriaCalculoActionBanner.tsx` to render "Aprobar" and "Observar" action buttons when `puedeEvaluar` is true
- [x] T006 [US2] Integrate evaluation state and handlers in `src/features/proyecto-detalle/components/ProyectoDetalleContainer.tsx`

---

## Phase 4: User Story 3 & 4 - Observation Motive Display & Re-submission (Priority: P1 & P2)

**Goal**: Display observation reason banner on "Observado" projects and support correction & re-submission by Investigador Principal.

**Independent Test**: Click "Observar" on `/proyectos/2` with reason "Ajustar partida 101", verify status becomes "Observado" (ID 3). Open as PI, verify reason banner, edit partida, click "Enviar a revisión", verify status returns to "En revisión..." (ID 2).

- [x] T007 [P] [US3] Render prominent observation reason banner in `src/features/proyecto-detalle/components/MemoriaCalculoActionBanner.tsx` when project state is "Observado"
- [x] T008 [US4] Verify and wire re-submission flow from "Observado" state to "En revisión de memoria de cálculo" in `src/features/proyecto-detalle/hooks/useMemoriaCalculoEditor.ts`

---

## Phase 6: Polish & Verification

**Purpose**: Verification and TypeScript compliance.

- [x] T009 Run `npx tsc --noEmit` and verify 0 compilation errors
- [x] T010 Run quickstart scenarios in `specs/021-revisar-memoria-calculo/quickstart.md`

---

## Dependencies & Execution Order

1. **Setup & Foundational (Phases 1-2)**: T001 → T002 → T003
2. **User Story 1 & 2 (Phase 3)**: T004, T005 → T006
3. **User Story 3 & 4 (Phase 4)**: T007 → T008
4. **Polish (Phase 5)**: T009 → T010
