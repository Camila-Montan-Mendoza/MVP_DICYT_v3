# Implementation Plan: Visualización del Flujo de Pasos y Tareas del Trámite (Workflow Stepper)

**Branch**: `003-workflow-stepper-tramite`  
**Feature Spec**: `specs/003-workflow-stepper-tramite/spec.md`  
**Created**: 2026-07-27

---

## Technical Context

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling & UI Design**: Vanilla TailwindCSS with UMSS institutional color palette (`#002855` / `#003770` Azul, `#BC000C` Rojo, `#f4f6f9` Fondo) following `DESIGN.md`.
- **Icons**: `lucide-react`
- **Data Layer**: `lib/workflow/stepper-service.ts` providing step & task state models for trámites.
- **MVP Testing Strategy**: Fast validation focus. Includes lightweight, targeted unit tests (`pruebas unitarias bien puntuales`) in `tests/unit/workflow-stepper.test.ts`.

---

## Phase 0: Research & Key Decisions (`research.md`)

- **Decision**: No global single state; progress is derived from `PasoWorkflow[]` and `TareaWorkflow[]`.
- **Decision**: Stepper Horizontal Component at top of page, vertical timeline of tasks on the left column, and open workspace container on the right column for operational forms.
- **Decision**: Read-only informative Stepper component displaying completion timestamp, assigned role/user, and intervention badge (*"Acción requerida por tu parte"* vs *"En espera de acción por parte de [Nombre / Rol]"*).

---

## Phase 1: Design Artifacts

### 1. Data Model (`data-model.md`)
- `PasoWorkflow`: Macro step entity (id, numero, nombre, estado: `COMPLETADO` | `EN_CURSO` | `PENDIENTE`).
- `TareaWorkflow`: Granular task entity (id, pasoId, nombre, rolResponsable, usuarioAsignado, estado: `COMPLETADO` | `EN_CURSO` | `PENDIENTE`, fechaCompletado?: string).

### 2. Interface Contracts (`contracts/`)
- `components/workflow/workflow-stepper.tsx`: Reusable Stepper Horizontal component.
- `components/workflow/task-timeline.tsx`: Vertical timeline component for granular tasks.

### 3. Quickstart Validation (`quickstart.md`)
- Runnable manual & automated test instructions proving step progress rendering, task timestamps, and user intervention badge resolution.

---

## Plan Status
- [x] Phase 0: Research & Decisions complete (`research.md`)
- [x] Phase 1: Design Artifacts generated (`data-model.md`, `quickstart.md`)
- [x] Targeted Unit Testing: `tests/unit/workflow-stepper.test.ts`
