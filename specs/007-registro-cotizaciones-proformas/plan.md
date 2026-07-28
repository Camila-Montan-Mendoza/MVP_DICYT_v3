# Implementation Plan: Descarga de Plantilla y Transcripción de Proformas/Cotizaciones por el Investigador

**Branch**: `007-registro-cotizaciones-proformas`  
**Feature Spec**: `specs/007-registro-cotizaciones-proformas/spec.md`  
**Created**: 2026-07-28

---

## Technical Context

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling & UI Design**: Vanilla TailwindCSS with UMSS institutional color palette (`#002855` Azul Primario, `#001B47` Azul Oscuro, `#BC000C` Rojo, `#f4f6f9` Fondo) following `DESIGN.md`.
- **Database & Data Layer**: Supabase PostgreSQL database tables (`cotizacion`, `item_cotizacion`, `proveedor`, `item_tramite`). **Zero mock data policy per Constitution Principle VI**.
- **Icons**: `lucide-react`
- **MVP Testing Strategy**: Fast validation focus. Includes targeted unit tests in `tests/unit/cotizaciones.test.ts`.

---

## Phase 0: Research & Key Decisions (`research.md`)

- **Decision 1**: Database persistence layer using Supabase PostgreSQL tables `cotizacion` and `item_cotizacion`.
- **Decision 2**: Quantity ceiling validation (`cantidad_cotizada <= cantidad_solicitada`) before accepting an item line.
- **Decision 3**: Existence rule evaluation (4th quotation requirement if 2 of initial 3 quotations have items marked as `Sin existencia`).
- **Decision 4**: Official proforma PDF download generator trigger via `Plantilla de proforma` button.

---

## Phase 1: Design Artifacts

### 1. Data Model (`data-model.md`)

- `CotizacionFormState`: Interface for new proforma modal input fields.
- `ItemCotizacionState`: Interface for item lines transcribed within a proforma.

### 2. Quickstart Validation (`quickstart.md`)

- Runnable manual & automated test instructions proving proforma creation, quantity ceiling blocking, arithmetic total calculation, and 4th proforma requirement validation.

---

## Plan Status

- [x] Phase 0: Research & Decisions complete (`research.md`)
- [x] Phase 1: Design Artifacts generated (`data-model.md`, `quickstart.md`)
- [x] Targeted Unit Testing: `tests/unit/cotizaciones.test.ts`
