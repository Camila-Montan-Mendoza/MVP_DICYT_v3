# Tasks: 007-registro-cotizaciones-proformas

## Phase 1: Setup & Data Contracts

- [x] Task 1.1: Verify feature configuration in `.specify/feature.json`.
- [x] Task 1.2: Define contracts and interfaces in `specs/007-registro-cotizaciones-proformas/data-model.md`.

## Phase 2: View Component Implementation (Tarea 7 - Active & Passive)

- [x] Task 2.1: Implement `tarea-7-carga-cotizaciones-active.tsx` following uploaded Figma mockups and `DESIGN.md` (table of registered proformas, "Plantilla de proforma" PDF download button, "+ Nueva cotizacion" modal launcher, bottom "Cotizacion realizada" transition action).
- [x] Task 2.2: Implement Modal `Nueva Cotización - Proforma` inside `tarea-7-carga-cotizaciones-active.tsx` matching Figma 1:1 (`DATOS DEL PROVEEDOR`, `CONDICIONES DEL PROVEEDOR`, item list with `Con existencia` switch, quantity ceiling validation alert, and automatic total calculation).
- [x] Task 2.3: Implement `tarea-7-carga-cotizaciones-passive.tsx` for non-Investigador roles (read-only view without action buttons).
- [x] Task 2.4: Register Tarea 7 views in `components/workflow/views/view-registry.ts`.

## Phase 3: Database & Logic Integration (Zero Mock Data)

- [x] Task 3.1: Connect proforma creation and loading directly to Supabase PostgreSQL database tables.
- [x] Task 3.2: Implement 4th quotation requirement logic if 2 of 3 initial proformas are marked `Sin existencia`.
- [x] Task 3.3: Run `npm run lint` and verify clean build with zero errors.
