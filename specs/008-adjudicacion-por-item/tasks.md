# Tasks: Cuadro Comparativo y Adjudicación Flexible por Ítem

**Input**: Design documents from `/specs/008-adjudicacion-por-item/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests Policy**: This project is an MVP for fast validation. Tests are strictly OPTIONAL and limited only to essential, targeted unit tests ("pruebas unitarias bien puntuales") for core business logic. Avoid complex integration/E2E test tasks to maintain maximum development speed.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic file layout

- [x] T001 [P] Verify directory structure and types in `types/adjudicacion.ts`
- [x] T002 [P] Create Supabase service helper functions in `services/adjudicacionService.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Supabase data fetching and state hook required by all user stories

- [x] T003 Create Supabase fetcher in `services/adjudicacionService.ts` to query `tramite`, `item_tramite`, `cotizacion`, `detalle_cotizacion`, `proveedor` and `item_proveedor_tramite`
- [x] T004 Create custom React Hook in `hooks/useAdjudicacionTramite.ts` for managing item selection state, supplier totals, and real-time validation

---

## Phase 3: User Story 1 - Selección Independiente de Proveedor por Ítem (Priority: P1) 🎯 MVP

**Goal**: Permitir al Investigador Principal seleccionar de forma independiente un proveedor diferente para cada ítem en el cuadro comparativo consultando datos reales de Supabase.

**Independent Test**: Abrir la página del trámite `#TR-2026-0089` y verificar que el Ítem 1 pueda adjudicarse al Proveedor A y el Ítem 2 al Proveedor B de forma independiente.

### Implementation for User Story 1

- [x] T005 [P] [US1] Create Item list selection component in `components/tramites/adjudicacion/ItemListaSeleccion.tsx`
- [x] T006 [P] [US1] Create comparative cards component in `components/tramites/adjudicacion/CuadroComparativoMatriz.tsx` with "AHORRO MÁXIMO" badge and selection button
- [x] T007 [US1] Build Adjudication Page container in `app/(dashboard)/tramites/[id]/adjudicacion/page.tsx` displaying the header, stepper, timeline, item list, and supplier comparative card grid

**Checkpoint**: At this point, User Story 1 is fully functional with real Supabase data and independent item selection.

---

## Phase 4: User Story 2 - Adjudicación Dividida por Cantidades en un Ítem (Priority: P1)

**Goal**: Permitir dividir la cantidad solicitada de un ítem entre 2 o más proveedores en caso de stock insuficiente de un solo proveedor.

**Independent Test**: Abrir un ítem de 5 unidades, abrir el modal de división, asignar 2 unidades al Proveedor A y 3 al Proveedor B, y validar que no permita superar 5 unidades.

### Implementation for User Story 2

- [x] T008 [P] [US2] Create split allocation dialog component in `components/tramites/adjudicacion/AdjudicacionDivididaModal.tsx`
- [x] T009 [US2] Integrate split allocation handler in `hooks/useAdjudicacionTramite.ts` to validate $\sum \text{cantidad\_adjudicada} \le \text{cantidad\_solicitada}$
- [x] T010 [US2] Update `CuadroComparativoMatriz.tsx` to display split quantity badges and trigger `AdjudicacionDivididaModal.tsx`

**Checkpoint**: User Story 2 is testable: split quantities are validated and displayed correctly per supplier.

---

## Phase 5: User Story 3 - Restricciones de Selección (Sin Stock y Techo Referencial) (Priority: P2)

**Goal**: Bloquear automáticamente las celdas de cotizaciones "Sin Existencia" o que superen el Precio Referencial Inicial del ítem.

**Independent Test**: Verificar que cualquier oferta con `cantidad_existencias = 0` muestre "Sin Stock" y esté deshabilitada, y que ofertas con precio > referencial muestren "El precio cotizado supera el precio referencial inicial".

### Implementation for User Story 3

- [x] T011 [P] [US3] Targeted unit test for reference price ceiling and zero stock validation in `tests/unit/adjudicacionValidation.test.ts`
- [x] T012 [US3] Implement disabled button states and warning tooltips in `components/tramites/adjudicacion/CuadroComparativoMatriz.tsx` for zero stock and price ceiling exceedance

**Checkpoint**: User Story 3 is complete: invalid offers are strictly blocked from selection.

---

## Phase 6: User Story 4 - Confirmación, Liberación Presupuestaria y Justificación General (Priority: P1)

**Goal**: Exigir Justificación General obligatoria y ejecutar en Supabase la persistencia de adjudicación y desafectación/liberación automática del Preventivo.

**Independent Test**: Intentar confirmar sin justificación (error), luego justificar y confirmar. Verificar en Supabase que `item_proveedor_tramite` tenga los registros y el saldo no adjudicado quede asentado en `historial_estado_tramite`.

### Implementation for User Story 4

- [x] T013 [P] [US4] Create confirmation dialog with mandatory justification textarea in `components/tramites/adjudicacion/ConfirmarAdjudicacionDialog.tsx`
- [x] T014 [US4] Implement persistence service function `confirmarAdjudicacionTramite` in `services/adjudicacionService.ts` to execute Supabase mutations (`tramite.justificacion`, `item_proveedor_tramite` inserts, `historial_estado_tramite` audit)
- [x] T015 [US4] Connect confirmation flow to action buttons in `app/(dashboard)/tramites/[id]/adjudicacion/page.tsx`

**Checkpoint**: Full end-to-end adjudication flow complete with Supabase persistence and automatic preventive release.

---

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: Final UI polish and validation against quickstart scenarios

- [x] T016 Apply responsive mobile adjustments (`pb-16` bottom margin) per `DESIGN.md` in `app/(dashboard)/tramites/[id]/adjudicacion/page.tsx`
- [x] T017 Execute manual validation following `specs/008-adjudicacion-por-item/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) - BLOCKS all User Stories.
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2).
- **User Story 2 (Phase 4)**: Depends on Foundational (Phase 2) and US1 UI components.
- **User Story 3 (Phase 5)**: Depends on US1 UI components.
- **User Story 4 (Phase 6)**: Depends on US1, US2, and US3.
- **Polish (Final Phase)**: Depends on US1 - US4 completion.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 & Phase 2.
2. Complete Phase 3 (US1).
3. Test User Story 1 independently with real Supabase data.

### Full Feature Incremental Delivery

1. Add Phase 4 (US2 - Split allocation).
2. Add Phase 5 (US3 - Stock/Price restrictions).
3. Add Phase 6 (US4 - Confirmation & Supabase persistence).
4. Run quickstart validation.
