# Implementation Plan: Detallar Memoria de Cálculo de un Proyecto

**Branch**: `020-detallar-memoria-calculo` | **Date**: 2026-07-31 | **Spec**: [specs/020-detallar-memoria-calculo/spec.md](file:///c:/Users/winso/OneDrive/Escritorio/TRABAJO/MVP_DICYT_v3/specs/020-detallar-memoria-calculo/spec.md)

**Input**: Feature request for Project Detail + Memoria de Cálculo (View & Edit Modes) with rich mock dataset for seamless execution.

## Summary

Build end-to-end interactive and read-only views for Project Details and Memoria de Cálculo matching the exact UI mocks. Includes mock data store fallback in `mock-proyecto-service.ts` so the page works 100% out-of-the-box with real state mutations (add/remove partida, edit montos, total validation, status change to "En revisión de memoria de cálculo").

## Technical Context

**Language/Version**: TypeScript 5 / Next.js 16 (App Router)
**Primary Dependencies**: React 19, Lucide React icons, TailwindCSS, ShadCN UI primitives
**Storage**: Mock Data Service (`mock-proyecto-service.ts`) with in-memory + localStorage sync fallback, integrated with Supabase API route
**Testing**: Targeted unit tests for calculation totals, budget limit validation, and status state machine
**Target Platform**: Web (Desktop & Tablet responsive)
**Project Type**: Next.js Web Application
**Performance Goals**: Instant UI recalculations (<50ms), page load <500ms with mock fallback
**Constraints**: Strictly follow UMSS `DESIGN.md` tokens (#003770 primary, #BC000C secondary, #001B47 navy text), 0 emojis

## Constitution Check

- MVP Focus: Fast validation via mock data provider.
- Design Tokens: Matched to UMSS institucional layout and image specs.
- Zero breaking changes: Enhances existing `src/features/proyecto-detalle`.

## Project Structure

### Documentation (this feature)

```text
specs/020-detallar-memoria-calculo/
├── plan.md              # Implementation Plan
├── research.md          # Tech decisions & Mock Data strategy
├── data-model.md        # Entities, mock store & state transitions
├── quickstart.md        # Verification and testing scenarios
└── contracts/           # API request/response contracts for Memoria de Cálculo
    └── memoria-calculo-api.json
```

### Source Code

```text
src/features/proyecto-detalle/
├── api/
│   ├── fetchProyectoDetalle.ts
│   └── updateMemoriaCalculo.ts
├── components/
│   ├── ProyectoDetalleContainer.tsx
│   ├── ProyectoHeaderNav.tsx
│   ├── ProyectoInfoCard.tsx
│   ├── MemoriaCalculoReadView.tsx
│   ├── MemoriaCalculoEditView.tsx
│   ├── PartidaSearchModal.tsx
│   └── PresupuestoConsolidadoFooter.tsx
├── hooks/
│   ├── useProyectoDetalle.ts
│   └── useMemoriaCalculoEditor.ts
├── services/
│   └── mockProyectoService.ts
└── types/
    └── index.ts
```

## Implementation Phases

- **Phase 0 (Research & Setup)**: Establish mock store & validation rules.
- **Phase 1 (Design & Contracts)**: Define JSON contracts, data model, and quickstart scenarios.
- **Phase 2 (Components & State)**: Build Edit & Read mode views matching attached images.
- **Phase 3 (Integration & Verification)**: Wire route handler `/api/proyectos/[id]` & `/api/proyectos/[id]/memoria-calculo` with mock fallback.
