# Tasks: Visualización del Flujo de Pasos y Tareas del Trámite (Workflow Stepper)

**Feature Branch**: `003-workflow-stepper-tramite`  
**Feature Spec**: `specs/003-workflow-stepper-tramite/spec.md`  
**Plan**: `specs/003-workflow-stepper-tramite/plan.md`

---

## Task Breakdown

### Phase 1: Setup & Foundational Layer
- [x] T001 Define `PasoWorkflow`, `TareaWorkflow` and `DetalleTramiteWorkflow` models in `lib/workflow/stepper-service.ts`

### Phase 2: User Story 1 - Encabezado y Stepper Horizontal de Pasos Macro (P1)
- [x] T002 [P] [US1] Build horizontal macro stepper component with step badges in `components/workflow/workflow-stepper.tsx`
- [x] T003 [P] [US1] Create detail page header and layout structure in `app/tramites/[id]/page.tsx`

### Phase 3: User Story 2 - Cronología Vertical de Tareas Granulares por Paso (P1)
- [x] T004 [P] [US2] Build vertical timeline component for tasks with timestamps in `components/workflow/task-timeline.tsx`
- [x] T005 [US2] Connect selected step task filtering in `app/tramites/[id]/page.tsx`

### Phase 4: User Story 3 - Indicador de Intervención ("¿Me toca actuar o espero?") (P2)
- [x] T006 [P] [US3] Implement intervention badge resolution (`"Acción requerida por tu parte"` vs `"En espera"`) in `components/workflow/task-timeline.tsx`

### Phase 5: User Story 4 - Contenedor de UI Operativa Integrada (P2)
- [x] T007 [P] [US4] Integrate split layout container with right-side operational workspace in `app/tramites/[id]/page.tsx`

### Phase 6: Polish & Verification
- [x] T008 Add unit test suite in `tests/unit/workflow-stepper.test.ts`
- [x] T009 Verify clean Next.js build compilation (`npm run build`)
