# Implementation Plan: Realizar Modificación Presupuestaria de Proyecto

**Branch**: `022-modificacion-presupuestaria` | **Spec**: [spec.md](./spec.md)

---

## Technical Context

- **Framework**: Next.js 16 App Router, React 19, TypeScript.
- **Navigation Architecture**: Update `components/sigefi-shell.tsx` and `app/(dashboard)/tramites/page.tsx` with tabs: **"Compras / Contrataciones"** vs **"Modificaciones Presupuestarias"**.
- **Design System**: Alignment with `DESIGN.md` and screenshots (UMSS colors `#003770` primary, `#BC000C` secondary red, `#001B47` navy text, `#f0f5fc` light blue cards, `lucide-react` icons).
- **Mock Service**: `src/features/tramites/services/mockModificacionService.ts` with `localStorage` persistence (`sigefi_mock_modificaciones`).

---

## Proposed Changes

### 1. Navigation & Trámites Sub-division (`app/(dashboard)/tramites/`)

- Modify `app/(dashboard)/tramites/page.tsx`: Add tab state switching between Compras/Contrataciones list and Modificaciones Presupuestarias list.
- Create `src/features/tramites/components/ModificacionesListTable.tsx`: Table listing modification requests.

### 2. Mock Data Service (`src/features/tramites/services/mockModificacionService.ts`)

- Implement full mock service handling GET list, GET by ID, POST create, and POST evaluate (approve/observe).

### 3. API Endpoints (`app/api/tramites/modificaciones/`)

- `app/api/tramites/modificaciones/route.ts`: List & Create.
- `app/api/tramites/modificaciones/[id]/route.ts`: Get detail.
- `app/api/tramites/modificaciones/[id]/evaluar/route.ts`: Approve/Observe.

### 4. UI Components (`src/features/tramites/components/`)

- `ModificarPresupuestoModal.tsx`: Screenshot 1 modal for selecting partidas, searching, and quick amounts entry with deficit alert.
- `ModificacionDetalleBuilder.tsx`: Screenshot 2 side-by-side builder view with live balance validation, trash row removal, and auto-generated code justification.
- `ModificacionPrintModal.tsx`: Printable official document modal matching paper format.

---

## Verification Plan

### Automated Tests

- `npx tsc --noEmit`: 0 TypeScript compilation errors.
- Unit test for balance validation logic.

### Manual Verification

- Test all scenarios in `quickstart.md`.
