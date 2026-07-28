# Tasks: 005-revision-inicial-compras

## Phase 1: Setup & Data Contracts

- [x] Task 1.1: Verify feature configuration in `.specify/feature.json`.
- [x] Task 1.2: Verify contract definitions in `specs/005-revision-inicial-compras/data-model.md`.

## Phase 2: Active Component Implementation (Grover - Resp. Compras)

- [x] Task 2.1: Implement active operational view `tarea-2-revision-tecnica-active.tsx` following 2-column layout (8-col request details & collapsible items table, 4-col attachments card with reference quote PDF).
- [x] Task 2.2: Implement 1-click Approve action with Toast notification and transition execution.
- [x] Task 2.3: Implement Observe modal dialog with required textarea validation (min 5 chars).

## Phase 3: Passive Read-Only View (Non-Compras Roles)

- [x] Task 3.1: Implement passive view `tarea-2-revision-tecnica-passive.tsx` for read-only inspection.

## Phase 4: Integration & Quality Check

- [x] Task 4.1: Run `npm run lint` and verify clean build.
- [x] Task 4.2: Execute workflow unit tests (`tests/unit/workflow-transition.test.ts`).
