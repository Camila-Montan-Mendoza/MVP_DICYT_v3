# Implementation Plan: Registro y Auto-Distribución de Solicitud de Adquisición por Tipo

**Branch**: `001-registro-solicitud-lote` | **Date**: 2026-07-23 | **Spec**: [spec.md](file:///C:/Users/winso/OneDrive/Escritorio/TRABAJO/MVP_DICYT_v3/specs/001-registro-solicitud-lote/spec.md)

**Input**: Feature specification from `specs/001-registro-solicitud-lote/spec.md`

## Summary

Implement the unified request entry screen with automatic item classification and auto-distribution workflow for acquisition requests by type (Materiales, Activos Fijos, Servicios). The feature enables Investigadores Principales (IP) to input items into a single list with automatic categorization (`MATERIAL`, `ACTIVO`, `SERVICIO`), automatically partition them into up to 3 homogeneous, non-mixed trámites (`Compra menor de material`, `Compra menor de activo fijo`, `Compra menor de servicios`), capture item details and dynamic technical forms (ET vs TDR), enter trámite-level justifications, attach proforma PDFs/images, perform automatic budget line lookups, and submit the generated trámites individually or as a group into the revision workflow.

## Technical Context

**Language/Version**: TypeScript 5+ / Node.js 20+ / React 19

**Primary Dependencies**: Next.js 15+ (App Router), Supabase JS Client (`@supabase/supabase-js`, `@supabase/ssr`), ShadCN UI, Tailwind CSS, Lucide React, React Hook Form, Zod

**Storage**: Supabase PostgreSQL (`tramite`, `tramite_item`, `archivo`, `historial_estado_tramite`), Supabase Storage (`tramite-respaldos` bucket)

**Testing**: React Testing Library / Vitest

**Target Platform**: Web Browsers (Responsive Desktop & Mobile with institutional UMSS styling)

**Project Type**: Full-stack Web Application (Next.js App Router + Supabase)

**Performance Goals**: Automatic item classification in <50ms; auto-distribution of 10+ items in <200ms client-side; ET/TDR form switching in <50ms; instant simulated budget line lookup (<300ms)

**Constraints**: Strict adherence to `DESIGN.md` (UMSS institutional colors `#003770` primary, `#BC000C` secondary); compliance with Constitution React patterns (Container/Presentational, Hooks, Compound Components, HOC); non-blocking missing budget line logic

**Scale/Scope**: MVP for DICyT UMSS supporting 8 core trámites, up to 13 distinct workflow roles

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I: RBAC & Dynamic Views** -> PASSED. Workflow actions and forms strictly scoped to active role (`IP` role for creation & submit; `RC`/`RP` for review monitoring).
- **Principle II: Institutional UX & Prototyping Consistency** -> PASSED. Custom styles mapped via CSS variables in `globals.css` adhering to `DESIGN.md` and `.mockups/`.
- **Principle III: Modular React Architecture & Pattern Discipline** -> PASSED. Employs Container/Presentational (`SolicitudContainer`), Custom Hooks (`useSolicitudAutoDistribution`, `useItemClassification`), and Compound Components (`FormularioTecnico`).
- **Principle IV: Functional Core Scope (MVP First)** -> PASSED. Directly implements `Compra menor` trámites (Materiales, Activos, Servicios) without over-engineering.
- **Principle V: Relational Integrity & Traceability** -> PASSED. FK checks preserved; audit entries created in `historial_estado_tramite`.

## Project Structure

### Documentation (this feature)

```text
specs/001-registro-solicitud-lote/
├── plan.md              # Implementation Plan
├── research.md          # Research findings & architectural decisions
├── data-model.md        # Entities, relationships & state transitions
├── quickstart.md        # Scenario walkthrough & verification steps
├── contracts/           # API and client helper contracts
│   └── tramite-api.md
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (repository root)

```text
app/
├── (dashboard)/
│   └── proyectos/
│       └── [id]/
│           └── nueva-solicitud/
│               └── page.tsx              # Page Entry point
components/
├── tramites/
│   ├── SolicitudContainer.tsx            # Container pattern for request state
│   ├── ItemSelectionView.tsx             # Unified item entry with automatic classification
│   ├── TramiteGroupView.tsx              # Partitioned trámites container
│   ├── TramiteCard.tsx                   # Individual trámite view (Material/Activo/Servicio)
│   ├── FormularioTecnico.tsx             # Compound component for ET / TDR
│   ├── JustificacionSection.tsx          # Dedicated justification input
│   ├── RespaldoUploadSection.tsx         # Multi-file PDF/Image uploader
│   └── PartidaLookupBadge.tsx            # Budget lookup badge & action
lib/
├── hooks/
│   ├── useSolicitudAutoDistribution.ts   # Custom hook for partitioning items
│   ├── useItemClassification.ts         # Custom hook for automatic item categorization
│   └── usePartidaLookup.ts               # Custom hook for budget line lookup
├── services/
│   ├── itemClassifierService.ts          # Automatic item classification helper
│   ├── budgetLookupService.ts            # Simulated budget equivalence service
│   └── tramiteService.ts                 # Supabase server actions / DB methods
└── types/
    └── tramite.ts                        # TypeScript interfaces & types
```

**Structure Decision**: Next.js App Router structure with feature-based component organization under `components/tramites/` and decoupled hooks/services under `lib/`.

## Complexity Tracking

> **No violations of Constitution Check found. All gates passed.**
