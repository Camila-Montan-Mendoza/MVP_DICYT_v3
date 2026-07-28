# Research & Architectural Decisions: Visualización del Flujo de Pasos y Tareas del Trámite (Workflow Stepper)

**Feature Branch**: `003-workflow-stepper-tramite`  
**Date**: 2026-07-27

---

## 1. Domain Modeling Without a Single Global State

- **Decision**: Progress is derived from `PasoWorkflow[]` and `TareaWorkflow[]`.
- **Rationale**: The user requirements explicitly specify: _"Sin Estado Global: El trámite no cuenta con una etiqueta de estado global único; su progreso viene dado por el avance de sus Pasos y Tareas."_
- **Alternatives Considered**: Forcing a single global string enum state (e.g. `ESTADO_PASO_3`). Rejected because different administrative processes have distinct step counts and approval pathways.

---

## 2. Split Layout Design (Stepper + Timeline + Operative Space)

- **Decision**: Build a Split Layout page structure:
  - Top: Header + Horizontal Stepper (Pasos Macro 1..4).
  - Bottom Left: Vertical Timeline (`Tareas de <Paso>`).
  - Bottom Right: Flexible workspace container reserved for dynamic operational forms (e.g., Formulación de Requerimientos, Recepción de Insumos).
- **Rationale**: The user explicitly requested: _"este componente se conectara a varias funcionalidades de los usuarios justamente en el espacio vacio que esta actualmente se ira mostrando las diferentes UI para realizar"_.

---

## 3. Intervention Badge Resolution ("¿Me toca actuar o espero?")

- **Decision**: Evaluate `activeTask.usuarioAsignado` against `currentUser`.
  - If match: Display green alert badge _"Acción requerida por tu parte"_.
  - If different: Display info badge _"En espera de acción por parte de [Nombre / Rol]"_.
- **Rationale**: Prevents confusion for users navigating multi-role approval chains.
