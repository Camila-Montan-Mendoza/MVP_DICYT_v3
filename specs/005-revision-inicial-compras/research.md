# Research & Key Decisions: Revisión Inicial por Compras

**Feature**: `005-revision-inicial-compras`  
**Created**: 2026-07-28

## Key Architectural Decisions

### Decision 1: Consolidated Single-Screen Wizard Layout

- **Context**: Grover (Responsable de Compras) needs to assess technical feasibility and initial reference quotes without switching modules or opening multiple browser tabs.
- **Decision**: Render a 2-column layout (8 columns for request details & items, 4 columns for uploaded reference quote PDFs) inside the active task workspace container.
- **Rationale**: Direct alignment with user-provided Figma mockups and `DESIGN.md` guidelines.

### Decision 2: 1-Click Approval vs Mandatory Modal Observation

- **Context**: Different friction requirements for positive vs negative decision paths.
- **Decision**:
  - **Aprobar**: Executes immediately upon clicking with Toast feedback.
  - **Observar**: Opens a modal dialog with mandatory multi-line text input (minimum 5 characters).
- **Rationale**: Speeds up happy-path processing while ensuring complete audit justification when returning a request.

### Decision 3: Dynamic User ID Resolution & Audit Trail

- **Context**: Ensuring transitions in `historial_estado_tramite` accurately capture `id_usuario_responsable = 4` (Grover).
- **Decision**: Send active `user.id` from `useAuth()` in `POST /api/tramites/[id]/transicion` with server-side `LOGIN_OPTIONS` index fallback.
- **Rationale**: Prevents default fallback to user ID 1 and guarantees accurate audit trail per actor role.
