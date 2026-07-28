# Implementation Plan: Revisión Inicial del Trámite por Responsable de Compras

**Branch**: `005-revision-inicial-compras`  
**Feature Spec**: `specs/005-revision-inicial-compras/spec.md`  
**Created**: 2026-07-28

---

## Technical Context

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling & UI Design**: Vanilla TailwindCSS with UMSS institutional color palette (`#002855` Azul Primario, `#003770` Azul Secundario, `#BC000C` Rojo, `#f4f6f9` Fondo) following `DESIGN.md`.
- **Icons**: `lucide-react`
- **Data & Workflow Layer**: Dynamic 2D strategy view registry (`components/workflow/views/`), transition service (`lib/workflow/transition-service.ts`) and Supabase RPC timeline (`docs/rpc_obtener_timeline_tramite.sql`).
- **MVP Testing Strategy**: Fast validation focus. Targeted unit tests in `tests/unit/workflow-transition.test.ts`.

---

## Phase 0: Research & Key Decisions (`research.md`)

- **Decision 1**: Consolidated single-page view structure featuring header metadata, collapsible items table with unit/total prices, justification box, and right-hand uploaded attachments card.
- **Decision 2**: 1-Click Approve action executing transition via `POST /api/tramites/[id]/transicion` with Toast feedback.
- **Decision 3**: Modal dialog for "Observar" requiring mandatory observation text (min 5 characters) before returning the request.
- **Decision 4**: Automatic role checking (`isMeAction`) switching between active operational view (`tarea-2-revision-tecnica-active.tsx`) and passive read-only view (`tarea-2-revision-tecnica-passive.tsx`).

---

## Phase 1: Design Artifacts

### 1. Data Model (`data-model.md`)

- `RevisionComprasViewProps`: Extended `TaskViewProps` containing active `tramite` item details, attachments, and transition callback.
- `TransicionPayload`: Entity representing transition request (`idTramite`, `idTransicion`, `observaciones`, `usuarioId`).

### 2. Interface Contracts (`contracts/`)

- `components/workflow/views/paso-1-solicitud/tarea-2-revision-tecnica-active.tsx`: Active operational UI view component for Grover (Resp. Compras).
- `components/workflow/views/paso-1-solicitud/tarea-2-revision-tecnica-passive.tsx`: Passive read-only UI view component for non-Compras roles.

### 3. Quickstart Validation (`quickstart.md`)

- Runnable end-to-end validation scenarios for initial request review, approval execution, observation modal validation, and passive role switching.

---

## Plan Status

- [x] Phase 0: Research & Decisions complete (`research.md`)
- [x] Phase 1: Design Artifacts generated (`data-model.md`, `quickstart.md`, `contracts/`)
- [x] Targeted Unit Testing: `tests/unit/workflow-transition.test.ts`
