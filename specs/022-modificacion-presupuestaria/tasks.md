# Tasks: Realizar Modificación Presupuestaria de Proyecto

**Input**: Design documents from `/specs/022-modificacion-presupuestaria/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests Policy**: Fast MVP validation. Targeted unit tests for balance validation.

**Organization**: Grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup & Types

**Purpose**: Define TypeScript interfaces and mock service for budget modifications.

- [x] T001 Create modification types in `src/features/tramites/types/modificacion.ts`
- [x] T002 Implement mock data service `src/features/tramites/services/mockModificacionService.ts` with pre-seeded data and localStorage persistence

---

## Phase 2: Foundational API Endpoints

**Purpose**: REST API endpoints for modification requests.

- [x] T003 Implement GET and POST handlers in `app/api/tramites/modificaciones/route.ts`
- [x] T004 Implement GET detail handler in `app/api/tramites/modificaciones/[id]/route.ts`

---

## Phase 3: User Story 1 - Sub-navegación en Trámites y Listado (Priority: P1) 🎯 MVP

**Goal**: Split Trámites section into "Compras y Contrataciones" and "Modificaciones Presupuestarias" with list table.

- [x] T005 Create list table component `src/features/tramites/components/ModificacionesListTable.tsx`
- [x] T006 [US1] Update `app/tramites/page.tsx` to render tabbed sub-navigation between Compras/Contrataciones and Modificaciones Presupuestarias

---

## Phase 4: User Story 2 - Modal de Selección de Partidas (Screenshot 1) (Priority: P1)

**Goal**: Build modal dialog for selecting partidas with deficit alert and quick inputs.

- [x] T007 [US2] Create modal component `src/features/tramites/components/ModificarPresupuestoModal.tsx` matching Screenshot 1 (deficit alert, search, filter, Quitar/Aumentar inputs)

---

## Phase 5: User Story 3 & 4 - Panel de Detalle, Balance y Justificación (Screenshot 2) (Priority: P1)

**Goal**: Side-by-side builder view with live balance validation and auto-generated code justification.

- [x] T008 [US3] Create builder component `src/features/tramites/components/ModificacionDetalleBuilder.tsx` matching Screenshot 2 (Partidas Afectadas vs Partidas Beneficiadas side-by-side tables, balance validation card, trash action)
- [x] T009 [US4] Implement auto-generated code justification prefix and complementary text in `ModificacionDetalleBuilder.tsx`
- [x] T010 Integrate new modification route `app/tramites/modificaciones/nueva/page.tsx` and detail view `app/tramites/modificaciones/[id]/page.tsx`

---

## Phase 6: User Story 5 & 6 - Impresión Oficial & Verificación (Priority: P2)

**Goal**: Official format print modal and TypeScript verification.

- [x] T011 [US6] Create official document print modal `src/features/tramites/components/ModificacionPrintModal.tsx`
- [x] T012 Run `npx tsc --noEmit` and verify 0 compilation errors

---

## Execution Order

1. **Phase 1-2**: T001 → T002 → T003 → T004
2. **Phase 3**: T005 → T006
3. **Phase 4**: T007
4. **Phase 5**: T008 → T009 → T010
5. **Phase 6**: T011 → T012
