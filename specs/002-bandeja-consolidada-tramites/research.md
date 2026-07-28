# Research & Architectural Decisions: Bandeja Consolidada y Seguimiento de Trámites con Filtrado

**Feature Branch**: `002-bandeja-consolidada-tramites`  
**Date**: 2026-07-27

---

## 1. Architectural Abstraction of Trámites

- **Decision**: Define a single, un-hardcoded interface `TramiteConsolidado` in `lib/tramites/consolidated-service.ts`.
- **Rationale**: The user requirements explicitly specify: _"Abstracción de Trámites: El sistema no hardcodea tipos de trámites específicos en la narrativa; la bandeja consume un servicio unificado capaz de renderizar cualquier tipo de trámite (compras, fondos, servicios, etc.) presente o futuro."_
- **Alternatives Considered**: Creating separate database tables and UI components for each requisition category. Rejected because it fragments the inbox and requires code changes whenever a new administrative process type is introduced.

---

## 2. Dynamic Step Resolution (`Paso X/Y`)

- **Decision**: Store step progress as `pasoActualEtiqueta` (e.g. `Paso 1/4: Solicitud`, `Paso 2/4: Recepción de Material`, `Paso 4/4: Completado`) alongside `pasoNumero` and `pasoTotal`.
- **Rationale**: Each administrative process has a custom approval workflow. Storing stage labels dynamically allows the UI to render chromatic progress badges without hardcoding step names per type.
- **Alternatives Considered**: Fixed 4-step state machine across all processes. Rejected because background processes like "Fondo Rotatorio" or "Modificación Presupuestaria" use 3-step approval workflows.

---

## 3. Multi-Criteria Client-Side Filtering

- **Decision**: Pure functional filtering with `filterTramitesConsolidados()` evaluating search text, category dropdown, project dropdown, and step dropdown.
- **Rationale**: Delivers instant < 50ms filtering responses during live user demonstrations without server latency.
- **Alternatives Considered**: Full server-side query parameters on every keystroke. Rejected for MVP demo fluidity.

---

## 4. Contextual Action Buttons (`ATENDER` vs `VER DETALLE`)

- **Decision**: Evaluate `requiereAccion: boolean` flag on each item.
  - If `true`: Render primary UMSS dark blue button **`ATENDER`** (`#002855`).
  - If `false`: Render secondary outline button **`VER DETALLE`**.
- **Rationale**: Provides immediate visual priority for items requiring action from the principal investigator.
