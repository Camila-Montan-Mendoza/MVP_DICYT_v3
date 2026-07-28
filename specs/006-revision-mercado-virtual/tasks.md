# Tasks: 006-revision-mercado-virtual

## Phase 1: Setup & Data Contracts

- [x] Task 1.1: Verify feature configuration in `.specify/feature.json`.
- [x] Task 1.2: Define contracts and interfaces in `specs/006-revision-mercado-virtual/data-model.md`.

## Phase 2: View Component Implementation (Tarea 6 - Active & Passive)

- [x] Task 2.1: Implement `tarea-6-verificacion-mercado-virtual-active.tsx` following uploaded Figma mockups and `DESIGN.md` (table with item dropdown selectors, provider badge, supplier modal with auto-suggest, proforma download button, bottom "Revisión realizada" action button).
- [x] Task 2.2: Implement `tarea-6-verificacion-mercado-virtual-passive.tsx` for non-Compras roles (read-only view without action buttons).
- [x] Task 2.3: Register Tarea 6 views in `components/workflow/views/view-registry.ts`.

## Phase 3: Verification & Quality Check

- [x] Task 3.1: Run `npm run lint` and verify clean build.
- [x] Task 3.2: Verify real database query integration with zero mock data per Constitution Principle VI.
