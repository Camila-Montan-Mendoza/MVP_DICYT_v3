# Tasks: Bandeja Consolidada y Seguimiento de Trámites con Filtrado

**Feature Branch**: `002-bandeja-consolidada-tramites`  
**Feature Spec**: `specs/002-bandeja-consolidada-tramites/spec.md`  
**Plan**: `specs/002-bandeja-consolidada-tramites/plan.md`

---

## Task Breakdown

### Phase 1: Setup & Foundational Layer
- [x] T001 Define `TramiteConsolidado` interface and service abstraction in `lib/tramites/consolidated-service.ts`
- [x] T002 Update sidebar menu navigation in `components/sigefi-shell.tsx`

### Phase 2: User Story 1 - Visualización Consolidada Unificada de Trámites (P1)
- [x] T003 [P] [US1] Create consolidated table layout and row components in `app/tramites/page.tsx`
- [x] T004 [P] [US1] Create top bar header and `+ Agregar tramite` action button in `app/tramites/page.tsx`

### Phase 3: User Story 2 - Buscador y Filtrado Multi-criterio (P1)
- [x] T005 [P] [US2] Implement `filterTramitesConsolidados` search and dropdown filter logic in `lib/tramites/consolidated-service.ts`
- [x] T006 [US2] Connect search input and dropdown filter controls in `app/tramites/page.tsx`
- [x] T007 [P] [US2] Implement `Limpiar Filtros` reset button in `app/tramites/page.tsx`

### Phase 4: User Story 3 - Indicador Visual de Avance Dinámico y Acción Pendiente (P2)
- [x] T008 [P] [US3] Implement dynamic step progress badge rendering (`Paso X/Y: Nombre`) in `app/tramites/page.tsx`
- [x] T009 [P] [US3] Implement `ATENDER` (primary dark blue) vs `VER DETALLE` (secondary outline) action button resolution in `app/tramites/page.tsx`

### Phase 5: User Story 4 - Paginación y Estado Vacío (P3)
- [x] T010 [P] [US4] Implement table footer counter and page controls (`<` `>`) in `app/tramites/page.tsx`
- [x] T011 [P] [US4] Implement Empty State banner and reset action when 0 records match in `app/tramites/page.tsx`

### Phase 6: Polish & Verification
- [x] T012 Add unit test suite in `tests/unit/consolidated-inbox.test.ts`
- [x] T013 Verify clean Next.js build compilation (`npm run build`)
