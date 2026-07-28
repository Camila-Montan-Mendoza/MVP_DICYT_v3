# Implementation Plan: Bandeja Consolidada y Seguimiento de Trámites con Filtrado

**Branch**: `002-bandeja-consolidada-tramites`  
**Feature Spec**: `specs/002-bandeja-consolidada-tramites/spec.md`  
**Created**: 2026-07-27

---

## Technical Context

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling & UI Design**: Vanilla TailwindCSS with UMSS institutional color palette (`#002855` / `#003770` Azul, `#BC000C` Rojo, `#f4f6f9` Fondo) following `DESIGN.md`.
- **Icons**: `lucide-react`
- **Data Layer**: `lib/tramites/consolidated-service.ts` providing abstract service layer for all trámite types (Materiales, Servicios, Activos Fijos, Fondo Rotatorio, Modificación Presupuestaria).
- **MVP Testing Strategy**: Fast validation focus. Includes lightweight, targeted unit tests (`pruebas unitarias bien puntuales`) in `tests/unit/consolidated-inbox.test.ts`. Avoid heavy E2E pipelines.

---

## Phase 0: Research & Key Decisions (`research.md`)

- **Decision**: Un-hardcoded Service Abstraction (`TramiteConsolidado` interface) to render present and future trámite categories cleanly without coupling UI components to specific types.
- **Decision**: In-memory multi-criteria client-side filtering for zero-latency UI response during interactive demos, with full pagination support (`Mostrando X-Y de Z trámites`).
- **Decision**: Distinct visual badges for step progress (`Paso X/Y: Nombre`) and action buttons (`ATENDER` for required actions vs `VER DETALLE` for view-only).

---

## Phase 1: Design Artifacts

### 1. Data Model (`data-model.md`)

- `TramiteConsolidado`: Entity representing a consolidated requisition entry across projects and categories.
  - `id`: Unique string
  - `nro`: Sequential string (e.g. `01`, `02`)
  - `proyecto`: Associated research project name
  - `tipoTramite`: Category description (e.g., `Solicitud de Materiales`, `Solicitud de Servicio`, `Solicitud de Activo Fijo`, `Fondo Rotatorio`, `Modificación Presupuestaria`)
  - `fecha`: Formatted display date (e.g. `15 Oct 2023`)
  - `pasoActualEtiqueta`: Step display text (e.g. `Paso 1/4: Solicitud`, `Paso 2/4: Recepción de Material`, `Paso 4/4: Completado`)
  - `creador`: User name who initiated the requisition
  - `requiereAccion`: Boolean flag controlling `ATENDER` vs `VER DETALLE` action button

### 2. Interface Contracts (`contracts/`)

- `lib/tramites/consolidated-service.ts`: API service contract function `filterTramitesConsolidados(...)`.

### 3. Quickstart Validation (`quickstart.md`)

- Runnable manual & automated test instructions proving multi-criteria filtering, dynamic step badges, action buttons, pagination, and empty state.

---

## Plan Status

- [x] Phase 0: Research & Decisions complete (`research.md`)
- [x] Phase 1: Design Artifacts generated (`data-model.md`, `quickstart.md`)
- [x] Targeted Unit Testing: `tests/unit/consolidated-inbox.test.ts`
