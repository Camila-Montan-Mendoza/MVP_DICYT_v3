# Research: Revisar Memoria de Cálculo de un Proyecto

## Technical Decisions

### 1. Mock Data Provider & LocalStorage Persistence

- **Decision**: Extend `mockProyectoService` in `src/features/proyecto-detalle/services/mockProyectoService.ts` to support evaluating (approving or observing) project memoria de cálculo and persisting state changes in `localStorage`.
- **Rationale**: Enables seamless offline/demo testing without requiring live Supabase credentials or database migrations. State transitions automatically toggle permissions (`puedeDetallarMemoria`, `puedeEvaluar`, `soloLectura`).
- **Alternatives Considered**: Direct Supabase mutations only (rejected due to offline fallback requirement).

### 2. API Endpoints & State Machine

- **Decision**: Implement API route `POST /api/proyectos/[id]/evaluar` accepting `{ decision: "aprobar" | "observar", motivoObservacion?: string }`.
  - If `decision === "aprobar"`:
    - Estado transition: `2` ("En revisión de memoria de cálculo") → `4` ("Habilitado para ejecutar partidas").
    - Permissions update: `soloLectura: true`, `puedeEvaluar: false`, `puedeDetallarMemoria: false`.
  - If `decision === "observar"`:
    - Estado transition: `2` ("En revisión de memoria de cálculo") → `3` ("Observado").
    - Requires non-empty `motivoObservacion`.
    - Permissions update: `puedeDetallarMemoria: true`, `puedeEvaluar: false`, `soloLectura: false`.
- **Rationale**: Enforces clean state machine transitions matching spec requirements.

### 3. Evaluation UI & Observation Modal

- **Decision**: Create `EvaluacionMemoriaModal.tsx` and integrate evaluation actions inside `MemoriaCalculoActionBanner.tsx` and `ProyectoDetalleContainer.tsx`.
- **Rationale**: Follows UMSS institutional palette (`#003770` navy primary, `#BC000C` secondary red warning, amber for observation alerts) and shadcn/ui modal dialog standards.

### 4. MVP Testing Strategy

- **Decision**: Fast validation with targeted unit test suite for state transition logic in `mockProyectoService.test.ts` and `evaluar-route.test.ts`.
