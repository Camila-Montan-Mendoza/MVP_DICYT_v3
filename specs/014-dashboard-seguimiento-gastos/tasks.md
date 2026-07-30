---
description: "Lista de tareas para la implementación del Dashboard Principal Adaptativo de Seguimiento de Gastos"
---

# Tasks: Dashboard Principal Adaptativo de Seguimiento de Gastos según Rol

**Input**: Design documents from `/specs/014-dashboard-seguimiento-gastos/`

**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests Policy**: This project is an MVP for fast validation. Testing is limited ONLY to targeted unit tests (`pruebas unitarias bien puntuales`) for financial metrics calculation logic.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label ([US1], [US2], [US3])
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Base types and folder structure setup

- [x] T001 [P] Create feature folder structure and types in `src/features/seguimiento-gastos/types/index.ts`
- [x] T002 [P] Implement financial metrics calculation utilities in `src/features/seguimiento-gastos/utils/metrics-calculator.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data hook and base UI components required before user stories

- [x] T003 [P] Unit test metrics calculator functions in `src/features/seguimiento-gastos/utils/__tests__/metrics-calculator.test.ts`
- [x] T004 [P] Implement custom hook `useDashboardSeguimiento` for Supabase data fetching and role resolution in `src/features/seguimiento-gastos/hooks/useDashboardSeguimiento.ts`
- [x] T005 [P] Implement 5 global metric cards component in `src/features/seguimiento-gastos/components/GlobalMetricsCards.tsx`
- [x] T006 [P] Implement empty database state indicator component in `src/features/seguimiento-gastos/components/EmptyDashboardState.tsx`

**Checkpoint**: Core data hook and metric cards ready - user story implementation can begin.

---

## Phase 3: User Story 1 - Visión Consolidada de Programa para Coordinadores (Priority: P1) 🎯 MVP

**Goal**: Display consolidated program and subprogram cards (`id_programa_padre`) with SVG charts for Coordinadores (`ivan.fuentes`).

**Independent Test**: Log in as `ivan.fuentes` and verify that the Dashboard displays the consolidated ASDI Program card and subprograms with the 5 global metric cards.

- [x] T007 [US1] Implement `ProgramaViewSection` component for Program & Subprogram cards in `src/features/seguimiento-gastos/components/ProgramaViewSection.tsx`
- [x] T008 [P] [US1] Implement SVG Bar Chart component by Partida Concreta in `src/features/seguimiento-gastos/components/PartidaBarChart.tsx`
- [x] T009 [P] [US1] Implement SVG Donut Chart component for Budget Execution State in `src/features/seguimiento-gastos/components/ExecutionDonutChart.tsx`
- [x] T010 [US1] Implement read-only Next.js page for Seguimiento de Gastos in `src/app/seguimiento-gastos/page.tsx`

**Checkpoint**: User Story 1 (Coordinador View) is fully functional and testable independently.

---

## Phase 4: User Story 2 - Visión de Proyectos para Investigadores y Tutores (Priority: P2)

**Goal**: Display assigned research projects list with financial progress bars for Investigador Principal (`daniel.perez`).

**Independent Test**: Log in as `daniel.perez` and verify that the Dashboard displays his active research projects with financial progress bars and partida breakdown.

- [x] T011 [US2] Implement `ProyectoViewSection` component for assigned projects list and progress bars in `src/features/seguimiento-gastos/components/ProyectoViewSection.tsx`
- [x] T012 [P] [US2] Implement Partida Concreta detail cards component for projects in `src/features/seguimiento-gastos/components/ProyectoPartidasDetail.tsx`
- [x] T013 [US2] Integrate ProyectoViewSection into `/seguimiento-gastos` page view in `src/app/seguimiento-gastos/page.tsx`

**Checkpoint**: User Story 2 (Investigador View) works independently.

---

## Phase 5: User Story 3 - Conmutador Gráfico de Ámbito Multirrol (Priority: P3)

**Goal**: Provide a graphical tab scope switcher ("Visión Programa" vs. "Mis Proyectos") for multi-role users.

**Independent Test**: Click between "Visión Programa" and "Mis Proyectos" tabs and verify instant view switching without full page reloads (< 200 ms).

- [x] T014 [P] [US3] Implement `ScopeSwitcher` tab component using Lucide icons in `src/features/seguimiento-gastos/components/ScopeSwitcher.tsx`
- [x] T015 [US3] Integrate dynamic client-side scope switching into `src/app/seguimiento-gastos/page.tsx`

**Checkpoint**: Multi-role scope switching works seamlessly.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: PDF export print layout, responsive check, and quickstart validation

- [x] T016 [P] Implement executive summary PDF export/print layout in `src/features/seguimiento-gastos/components/PrintExecutiveSummary.tsx`
- [x] T017 Run validation scenarios in `specs/014-dashboard-seguimiento-gastos/quickstart.md` to confirm zero emojis and full `DESIGN.md` compliance

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS user story implementation.
- **User Stories (Phase 3+)**: Depend on Foundational phase completion.
  - US1 (P1) → US2 (P2) → US3 (P3)
- **Polish (Phase 6)**: Depends on completion of user stories.

### Parallel Opportunities

- T001, T002 in Setup can run in parallel.
- T003, T004, T005, T006 in Foundational can run in parallel.
- T008, T009 in US1 can run in parallel.
- T012 in US2 can run in parallel with T011.
- T014 in US3 can run in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Complete Setup (Phase 1) & Foundational (Phase 2).
2. Complete User Story 1 (Phase 3).
3. Validate Visión Programa for Coordinadores on `/seguimiento-gastos`.

### Incremental Delivery
1. Deliver US1 (Visión Programa) → MVP!
2. Deliver US2 (Visión Proyectos para Investigadores).
3. Deliver US3 (Conmutador Multirrol & Exportación PDF).
