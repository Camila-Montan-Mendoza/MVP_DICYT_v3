# Feature Specification: Visualización del Flujo de Pasos y Tareas del Trámite (Workflow Stepper)

**Feature Branch**: `003-workflow-stepper-tramite`

**Created**: 2026-07-27

**Status**: Draft

**Input**: User description: "Visualización del flujo de pasos y tareas del trámite (Workflow Stepper). Stepper horizontal de Pasos Macro (Solicitud, Recepción, Pago, Completado), línea de tiempo vertical de Tareas Granulares por Paso con fecha/hora de finalización, responsable por rol/usuario, e indicador visual de intervención ('Acción requerida por tu parte' vs 'En espera de acción por parte de [Nombre/Rol]')."

---

## User Scenarios & Testing *(mandatory)*

<!--
  MVP & TESTING NOTE: This project is an MVP for fast validation.
  Limit testing to essential, targeted unit tests ("pruebas unitarias bien puntuales") for critical core logic.
  DESIGN SYSTEM NOTE: All UI components strictly adhere to DESIGN.md and the official mockup (institutional UMSS colors Azul #002855 / #003770, Verde #10b981 / bg-emerald-50, Gris #64748b, stepper horizontal superior y cronología vertical de tareas a la izquierda).
-->

### User Story 1 - Encabezado y Stepper Horizontal de Pasos Macro (Priority: P1) 🎯 MVP

Como usuario del sistema, quiero ingresar a la vista de detalle de un trámite (`/tramites/[id]`) para visualizar el encabezado con el número de trámite, proyecto y solicitante, junto con el Stepper Horizontal de Pasos Macro (ej: 1. Solicitud, 2. Recepción, 3. Pago, 4. Completado) y sus badges de estado.

**Mockup**: ![Mockup Workflow Stepper](mockups/stepper_workflow.png)

**Why this priority**: Proporciona visibilidad macro inmediata de la fase actual del flujo de aprobación.

**Independent Test**: Ingresar a `/tramites/tr-001` y verificar que el encabezado muestre `Trámite Nº TR-2026-001` y que el Stepper Horizontal renderice los 4 pasos marcando el paso 1 como COMPLETADO y el paso 2 como EN_CURSO.

**Acceptance Scenarios**:

1. **Given** que el usuario ingresa al detalle de un trámite `/tramites/[id]`, **When** la página carga, **Then** visualiza el encabezado con `Trámite Nº <Numero>`, `Proyecto: <PROYECTO>` y `Solicitante: <Nombre Solicitante>`.
2. **Given** la barra de progreso horizontal superior, **When** se evalúa el estado del trámite, **Then** cada paso muestra su número en un círculo estilizado, su nombre y su badge de estado (`COMPLETADO`, `EN_CURSO`, `PENDIENTE`).

---

### User Story 2 - Cronología Vertical de Tareas Granulares por Paso (Priority: P1)

Como usuario del sistema, quiero ver el listado vertical de tareas asociadas al paso seleccionado (ej. `Tareas de Recepción`), con el rol, usuario responsable y la fecha/hora exacta de finalización para tareas completadas.

**Mockup**: ![Mockup Tareas por Paso](mockups/stepper_workflow.png)

**Why this priority**: Permite auditar exactamente qué actividades se han ejecutado y cuáles están pendientes dentro de cada fase.

**Independent Test**: Seleccionar un paso en el stepper y verificar que la columna vertical de tareas muestre cada tarea con su ícono de estado, rol asignado, nombre del responsable y marca de tiempo (`11 Ene 2026 - 09:15`).

**Acceptance Scenarios**:

1. **Given** un paso seleccionado en el Stepper, **When** el usuario consulta el bloque "Tareas de <Paso>", **Then** se despliega la cronología vertical de tareas pertenecientes a dicho paso.
2. **Given** una tarea con estado `Completado`, **When** se renderiza en la lista, **Then** muestra el ícono de verificación azul `✓`, el rol, el nombre del usuario y la fecha/hora exacta en que finalizó.

---

### User Story 3 - Indicador de Intervención ("¿Me toca actuar o espero?") (Priority: P2)

Como usuario del sistema, al consultar la tarea activa `En Curso`, quiero visualizar un aviso destacado que indique si me corresponde actuar a mí ("Acción requerida por tu parte") o a quién debo esperar ("En espera de acción por parte de [Nombre / Rol]").

**Mockup**: ![Mockup Indicador de Intervención](mockups/stepper_workflow.png)

**Why this priority**: Elimina la ambigüedad operativa sobre la responsabilidad de avance del trámite.

**Independent Test**: Iniciar sesión como Investigador y consultar una tarea en curso asignada al rol Investigador; verificar que aparezca la tarjeta destacada en verde con el aviso de acción requerida.

**Acceptance Scenarios**:

1. **Given** una tarea en estado `En Curso` asignada al usuario autenticado, **When** el usuario la visualiza en el stepper, **Then** la tarjeta se destaca con fondo verde claro y muestra la etiqueta *"Acción requerida por tu parte"*.
2. **Given** una tarea en estado `En Curso` asignada a otro rol/persona, **When** el usuario la visualiza, **Then** el sistema muestra la etiqueta *"En espera de acción por parte de [Nombre / Rol]"*.

---

### User Story 4 - Contenedor de UI Operativa Integrada (Priority: P2)

Como usuario del sistema, quiero que el área de trabajo contigua a la cronología vertical de tareas sirva como contenedor dinámico donde se desplegarán las vistas funcionales de ejecución para completar las tareas del trámite.

**Why this priority**: Integra el seguimiento informativo con las herramientas operativas en una sola pantalla.

**Independent Test**: Verificar que la pantalla presente una estructura en dos columnas donde el lado izquierdo contiene la cronología de tareas y el lado derecho contiguo aloja la interfaz operativa.

**Acceptance Scenarios**:

1. **Given** la pantalla de detalle del trámite, **When** se renderiza la sección inferior, **Then** el Stepper/Tareas se posicionan en el panel izquierdo y la columna derecha queda disponible como contenedor funcional para la ejecución de actividades.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE ofrecer la ruta de detalle del trámite en `/tramites/[id]` (y alias `/tramites/detalle`).
- **FR-002**: El encabezado DEBE exhibir: `Trámite Nº <Numero>`, `Proyecto: <PROYECTO>` y `Solicitante: <Nombre Solicitante>`.
- **FR-003**: El Stepper Horizontal Macro DEBE renderizar la secuencia de pasos con círculos numerados, líneas conectoras y badges de estado (`COMPLETADO`, `EN_CURSO`, `PENDIENTE`).
- **FR-004**: La estructura de dominio DEBE modelarse sin un estado global único, derivando el avance a partir de Pasos (Nivel Macro) y Tareas (Nivel Granular).
- **FR-005**: Cada Tarea DEBE especificar: Nombre de la Tarea, Rol Responsable, Usuario Asignado y Estado (`Completado`, `En Curso`, `Pendiente`).
- **FR-006**: Para toda Tarea con estado `Completado`, el sistema DEBE exhibir obligatoriamente la fecha y hora exacta de finalización (ej: `11 Ene 2026 - 09:15`).
- **FR-007**: Para la Tarea `En Curso`, si pertenece al usuario autenticado, DEBE destacar el badge de intervención *"Acción requerida por tu parte"*. Si pertenece a otro rol, DEBE mostrar *"En espera de acción por parte de [Nombre / Rol]"*.
- **FR-008**: El componente Stepper DEBE ser de carácter exclusivamente informativo (Read-Only), sin botones de modificación directa en la cronología.
- **FR-009**: La distribución de pantalla DEBE ser un Split Layout donde el panel izquierdo contiene la cronología de tareas y el panel derecho contiguo sirve de espacio libre para la interfaz de ejecución funcional.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El Stepper y la lista de tareas renderizan la trazabilidad del trámite en < 200ms.
- **SC-002**: El 100% de las tareas completadas registran fecha y hora sin omisión.
- **SC-003**: La indicación de responsabilidad de acción ("Acción requerida" vs "En espera") se resuelve con precisión según el usuario autenticado.

---

## Assumptions

- **Alineación con MVP**: Componente visual desacoplado y reutilizable para cualquier tipo de trámite DICYT.
- **Diseño e Identidad**: Ajustado a `DESIGN.md` y al mockup `stepper_workflow.png`.
