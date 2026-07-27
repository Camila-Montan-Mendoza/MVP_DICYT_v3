# Implementation Plan: Validación Automática de Saldos y Emisión del Sello Preventivo por Resp. Presupuestos

**Branch**: `004-sello-preventivo-presupuestos`  
**Feature Spec**: `specs/004-sello-preventivo-presupuestos/spec.md`  
**Created**: 2026-07-27

---

## Technical Context

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling & UI Design**: Vanilla TailwindCSS with UMSS institutional color palette (`#002855` / `#003770` Azul, `#BC000C` Rojo, `#f4f6f9` Fondo) following `DESIGN.md`.
- **Icons**: `lucide-react`
- **Data Layer**: `lib/budget/preventivo-service.ts` providing budget line availability calculation and preventive seal generation.
- **MVP Testing Strategy**: Fast validation focus. Includes lightweight, targeted unit tests (`pruebas unitarias bien puntuales`) in `tests/unit/preventivo.test.ts`.

---

## Phase 0: Research & Key Decisions (`research.md`)

- **Decision**: Topbar user role switcher context (`Investigador Principal` vs `Resp. Presupuestos (Alan)`).
- **Decision**: Automatic budget check per 5-digit partida with green status badge (`✓ Suficiente`).
- **Decision**: Generates unique correlative `PREV-2026-XXXXX` and advances workflow step to "Recepción".
- **Decision**: Modal/dialog for "Rechazar / Observar Trámite" requiring mandatory observation text.

---

## Phase 1: Design Artifacts

### 1. Data Model (`data-model.md`)
- `PartidaPresupuestariaCheck`: Entity representing budget availability (codigoPartida, denominacion, montoRequerido, saldoDisponible, suficiente: boolean).
- `SelloPreventivo`: Entity representing the preventive seal (correlativo, fechaEmision, usuarioAprobador, observaciones?: string).

### 2. Interface Contracts (`contracts/`)
- `lib/budget/preventivo-service.ts`: API service for checking partida budget availability and issuing preventive seals.
- `components/budget/revision-preventiva-card.tsx`: Operational UI card component for budget verification and stamping.

### 3. Quickstart Validation (`quickstart.md`)
- Runnable manual & automated test instructions proving budget availability checks, preventive seal generation, and observation workflow.

---

## Plan Status
- [x] Phase 0: Research & Decisions complete (`research.md`)
- [x] Phase 1: Design Artifacts generated (`data-model.md`, `quickstart.md`)
- [x] Targeted Unit Testing: `tests/unit/preventivo.test.ts`
