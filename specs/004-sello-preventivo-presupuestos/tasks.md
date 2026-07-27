# Tasks: Validación Automática de Saldos y Emisión del Sello Preventivo por Resp. Presupuestos

**Feature Branch**: `004-sello-preventivo-presupuestos`  
**Feature Spec**: `specs/004-sello-preventivo-presupuestos/spec.md`  
**Plan**: `specs/004-sello-preventivo-presupuestos/plan.md`

---

## Task Breakdown

### Phase 1: Setup & Foundational Layer
- [x] T001 Create `PartidaPresupuestariaCheck` & `SelloPreventivo` service in `lib/budget/preventivo-service.ts`
- [x] T002 Add interactive topbar role switcher context in `components/sigefi-shell.tsx`

### Phase 2: User Story 1 & 2 - Verificación Automática de Saldos por Partida (P1)
- [x] T003 [P] [US2] Create budget line verification card in `components/budget/revision-preventiva-card.tsx`

### Phase 3: User Story 3 - Emisión del Sello Preventivo y Generación de Correlativo (P1)
- [x] T004 [P] [US3] Implement `Aprobar Preventivo` action and `PREV-2026-XXXXX` correlative stamping in `components/budget/revision-preventiva-card.tsx`
- [x] T005 [US3] Integrate operational card into workflow detail workspace in `app/tramites/[id]/page.tsx`

### Phase 4: User Story 4 - Rechazo u Observación del Trámite (P2)
- [x] T006 [P] [US4] Implement `Rechazar / Observar Trámite` dialog with mandatory observation text in `components/budget/revision-preventiva-card.tsx`

### Phase 5: Polish & Verification
- [x] T007 Add unit test suite in `tests/unit/preventivo.test.ts`
- [x] T008 Verify clean Next.js build compilation (`npm run build`)
