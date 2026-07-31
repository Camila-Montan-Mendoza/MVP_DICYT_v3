# Implementation Plan: Revisar Memoria de Cálculo de un Proyecto

**Branch**: `021-revisar-memoria-calculo` | **Spec**: [spec.md](./spec.md)

---

## Technical Context

- **Architecture**: Next.js 16 App Router, React 19 Client/Server components, mock service fallback with localStorage synchronization.
- **Design System**: UMSS Primary (`#003770`), Secondary (`#BC000C`), Navy Text (`#001B47`), shadcn/ui dialogs and buttons, `lucide-react` icons. Zero emojis.
- **Testing**: MVP fast validation with targeted unit tests for `mockProyectoService` state machine logic.

---

## Proposed Changes

### 1. Mock Data Service (`src/features/proyecto-detalle/services/mockProyectoService.ts`)

- Add method `evaluarMemoriaCalculo(proyectoId, decision, motivoObservacion)` handling state transitions:
  - `aprobar`: Estado `4` ("Habilitado para ejecutar partidas"), `soloLectura: true`, `puedeEvaluar: false`.
  - `observar`: Estado `3` ("Observado"), `ultimaObservacion: motivoObservacion`, `puedeDetallarMemoria: true`, `puedeEvaluar: false`.

### 2. API Route (`app/api/proyectos/[id]/evaluar/route.ts`)

- Implement `POST` endpoint calling `mockProyectoService.evaluarMemoriaCalculo`.
- Validate required non-empty `motivoObservacion` when decision is `observar`.

### 3. Evaluation Components (`src/features/proyecto-detalle/components/`)

- Create `EvaluacionMemoriaModal.tsx`: Modal dialog for observation motive entry & approval confirmation.
- Update `MemoriaCalculoActionBanner.tsx`: Show evaluation buttons (**Aprobar**, **Observar**) when `puedeEvaluar` is `true`. Show observation feedback banner when `estado.id === 3`.
- Update `ProyectoDetalleContainer.tsx`: Integrate evaluation actions and refresh project state seamlessly upon decision.

---

## Verification Plan

### Automated Tests

- `npx tsc --noEmit`: 0 TypeScript errors.
- Unit test for state machine transition in `mockProyectoService.test.ts`.

### Manual Verification

- Test scenarios defined in `quickstart.md`.
