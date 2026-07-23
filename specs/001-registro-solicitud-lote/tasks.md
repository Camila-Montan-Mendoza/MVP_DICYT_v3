# Tasks: Registro y Auto-Distribución de Solicitud de Adquisición por Tipo

**Input**: Design documents from `/specs/001-registro-solicitud-lote/`  
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, DESIGN.md, mockups (`.mockups/`)  

---

## Format: `[ID] [P?] [Story?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4, US5)
- Every task MUST include the exact file path in its description.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, types, and core utility dictionaries

- [ ] T001 Create TypeScript interfaces and types for trámites, items, auto-distribution, and files in `types/tramite.ts`
- [ ] T002 [P] Implement automatic item classification dictionary and logic in `lib/services/itemClassifierService.ts`
- [ ] T003 [P] Implement simulated external budget equivalence lookup service in `lib/services/budgetLookupService.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core state hooks and Supabase service methods required before user story UI implementation

- [ ] T004 Implement Supabase server actions and database helpers for creating and submitting trámites in `lib/services/tramiteService.ts`
- [ ] T005 [P] Implement custom hook for automatic item categorization in `lib/hooks/useItemClassification.ts`
- [ ] T006 [P] Implement custom hook for partitioning raw items into homogeneous trámites in `lib/hooks/useSolicitudAutoDistribution.ts`

---

## Phase 3: User Story 1 - Selección Unificada y Clasificación Automática de Ítems (Priority: P1) 🎯 MVP

**Goal**: Allow Investigadores Principales to search, select, and automatically classify items into Materiales, Activos Fijos, and Servicios within a unified modal.

**Independent Test**: Open modal "Buscar Ítems", search for catalog items, select items, and verify that they appear auto-classified into `Activos Fijos`, `Servicios`, or `Materiales` summary cards.

- [ ] T007 [P] [US1] Create modal search bar and live catalog results list component matching mockups in `components/tramites/ItemSearchModal.tsx`
- [ ] T008 [P] [US1] Create auto-classified selected items summary cards (Activos Fijos, Servicios, Materiales) in `components/tramites/ItemSelectionSummaryCards.tsx`
- [ ] T009 [US1] Assemble unified item selection view with "Buscar Ítems" modal in `components/tramites/ItemSelectionView.tsx`

---

## Phase 4: User Story 2 - Auto-Distribución en hasta 3 Trámites Independientes (Priority: P1)

**Goal**: Automatically subdivide selected items into up to 3 non-mixed, 100% homogeneous trámites cards/tabs when "Generar Trámites por Tipo" is clicked.

**Independent Test**: Select items from 2 or 3 categories, click "Generar Trámites por Tipo", and confirm that the view partitions items into independent group cards without mixing categories.

- [ ] T010 [P] [US2] Create grouped trámite accordion container component in `components/tramites/TramiteGroupView.tsx`
- [ ] T011 [US2] Create individual trámite card view (Materiales / Activos / Servicios) in `components/tramites/TramiteCard.tsx`

---

## Phase 5: User Story 3 - Completado de Información Técnico por Ítem (Priority: P1)

**Goal**: Provide detailed technical forms per item (ET for Materiales/Activos vs TDR for Servicios) alongside quantity, unit, and reference price.

**Independent Test**: Expand an item inside a generated trámite card and verify that selecting a Service displays TDR fields while selecting a Material or Activo displays ET fields.

- [ ] T012 [P] [US3] Create Compound Component for technical forms (`FormularioTecnico.Root`, `FormularioTecnico.ET`, `FormularioTecnico.TDR`) in `components/tramites/FormularioTecnico.tsx`
- [ ] T013 [US3] Create right-side Edit Item panel component matching mockups in `components/tramites/ItemEditFormPanel.tsx`

---

## Phase 6: User Story 4 - Justificación del Trámite y Adjuntos PDF/Imágenes por Trámite (Priority: P1)

**Goal**: Allow IP users to enter a dedicated justification text and upload multi-file proformas (PDF or images) at the header level of each generated trámite.

**Independent Test**: Type a justification in the text area of a trámite, upload a PDF/image proforma, and verify it attaches to that specific trámite.

- [ ] T014 [P] [US4] Create dedicated Justificación section component in `components/tramites/JustificacionSection.tsx`
- [ ] T015 [P] [US4] Create multi-file PDF/Image uploader component with preview in `components/tramites/RespaldoUploadSection.tsx`

---

## Phase 7: User Story 5 - Mapeo Presupuestario y Envío a Revisión (Priority: P2)

**Goal**: Trigger non-blocking budget line lookups per item and enable single or joint submission of completed trámites to the review workflow.

**Independent Test**: Click "Consultar Partida" on items, confirm matched code or "Pendiente de asignación", click "Enviar Trámites a Revisión", and verify state transition to "Enviado a Revisión".

- [ ] T016 [P] [US5] Create budget lookup badge and non-blocking trigger component in `components/tramites/PartidaLookupBadge.tsx`
- [ ] T017 [US5] Create main request container managing global state, auto-distribution, and submission in `components/tramites/SolicitudContainer.tsx`
- [ ] T018 [US5] Create Next.js page route for new acquisition request at `app/(dashboard)/proyectos/[id]/nueva-solicitud/page.tsx`
- [ ] T019 [P] [US5] Create Trámites Data Table list view matching mockups with status badges (`Rechazado`, `Aprobado`, `Pendiente`) at `app/(dashboard)/tramites/page.tsx`

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Verification of visual fidelity against DESIGN.md, institutional UMSS tokens, and quickstart scenarios

- [ ] T020 [P] Audit component styling against `DESIGN.md` visual tokens (`--primary`: `#003770`, `--secondary`: `#BC000C`, `--umss-btn-blue`: `#002855`) and responsive layout bounds
- [ ] T021 Execute quickstart validation walkthrough script in `specs/001-registro-solicitud-lote/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user story UI work.
- **User Stories (Phase 3+)**:
  - US1 (Phase 3) -> US2 (Phase 4) -> US3 (Phase 5) -> US4 (Phase 6) -> US5 (Phase 7).
- **Polish (Phase 8)**: Depends on completion of all user story phases.

### Parallel Opportunities

- **Setup Tasks**: T002 and T003 can be built in parallel with T001.
- **Foundational Tasks**: T005 and T006 can run in parallel.
- **US1**: T007 and T008 can be built in parallel.
- **US3 & US4**: Component creation (T012, T014, T015) can run concurrently.
- **US5**: T016 and T019 can be built in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 & 2)

1. Complete Phase 1 (Setup) and Phase 2 (Foundational).
2. Implement Phase 3 (US1 - Item Search & Auto-Classification) and Phase 4 (US2 - Auto-Distribution).
3. Validate item selection modal and 3-part partition cards.

### Incremental Delivery

1. Add Phase 5 (US3 - ET vs TDR Item Edit Panel).
2. Add Phase 6 (US4 - Justification & Proforma Uploader per Trámite).
3. Add Phase 7 (US5 - Budget Lookup & Submit to Review).
4. Perform Phase 8 Polish & Quickstart validation.
