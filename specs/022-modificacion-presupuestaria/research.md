# Research: Realizar Modificación Presupuestaria de Proyecto

## Technical Decisions

### 1. Sidebar & Navigation Sub-division

- **Decision**: Update `components/sigefi-shell.tsx` and `app/(dashboard)/tramites/page.tsx` to support tabbed view for Trámites:
  - **Tab 1**: "Compras y Contrataciones" (The existing trámites list)
  - **Tab 2**: "Modificaciones Presupuestarias" (New list of budget modification requests)
- **Rationale**: Keeps Trámites unified in sidebar navigation while providing dedicated sub-views and clean routing.

### 2. Mock Data Service (`mockModificacionService.ts`)

- **Decision**: Create `src/features/tramites/services/mockModificacionService.ts` with `localStorage` persistence (`sigefi_mock_modificaciones`).
- **Pre-seeded Data**:
  - `#TR-2026-0089`: Proyecto PT09FC001, Solicitante: Ing. Iván Méndez Velásquez, Fecha: 15/07/2024, Estado: `PENDIENTE`, Total: 700.00 Bs.
  - `#TR-2026-0042`: Proyecto IDH-2024, Solicitante: Dr. Ricardo Villarroel, Fecha: 10/05/2024, Estado: `APROBADO`, Total: 1.250.00 Bs.
- **Rationale**: Offline-first demo fallback allowing full CRUD and state transition testing without Supabase errors.

### 3. API Endpoints (`app/api/tramites/modificaciones/`)

- **Endpoints**:
  - `GET /api/tramites/modificaciones`: List all modification requests.
  - `POST /api/tramites/modificaciones`: Create a new budget modification request.
  - `GET /api/tramites/modificaciones/[id]`: Get detailed modification request with affected and benefited partidas.
  - `POST /api/tramites/modificaciones/[id]/evaluar`: Approve or observe request.

### 4. UI Component Architecture

- `ModificacionesListTable.tsx`: Table listing modification requests.
- `ModificarPresupuestoModal.tsx`: Screenshot 1 modal for selecting partidas with deficit alert and quick inputs.
- `ModificacionDetalleBuilder.tsx`: Screenshot 2 side-by-side builder view with live balance validation, trash action, and auto-generated justification.
- `ModificacionPrintModal.tsx`: Clean official format printable document modal.

### 5. Testing Strategy

- **MVP Fast Validation**: Focus on targeted unit tests for balance validation ($\sum Quitado === \sum Aumentado$) and automatic justification code assembly.
