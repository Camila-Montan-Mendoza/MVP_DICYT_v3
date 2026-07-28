# Feature Specification: Revisión Inicial del Trámite por Responsable de Compras

**Feature Branch**: `005-revision-inicial-compras`  
**Created**: 2026-07-28  
**Status**: Draft

**Input**: User description: "Revisión inicial del trámite por parte del responsable de compras (Ing. Grover Villarroel). Consulta consolidada de datos de la solicitud (código de trámite, proyecto, fecha, ítems solicitados, justificación y cotización referencial adjunta en PDF). Aprobación limpia de 1-clic que avanza el trámite al siguiente paso del flujo registrado en transicion_flujo, u observación obligatoria con textarea en modal de confirmación. Interfaz minimalista tipo Wizard acorde al diseño institucional UMSS."

---

## User Scenarios & Testing _(mandatory)_

<!--
  MVP & TESTING NOTE: This project is an MVP for fast validation.
  Limit testing to essential, targeted unit tests ("pruebas unitarias bien puntuales") for critical core logic.
  DESIGN SYSTEM NOTE: All UI components strictly adhere to DESIGN.md (institutional UMSS colors Azul #002855 / #003770, Rojo #BC000C, indicadores verdes de suficiencia, selector de rol en la barra superior, layout minimalista de 2 columnas).
-->

### User Story 1 - Consulta Consolidada de la Solicitud y Cotización Referencial (Priority: P1) 🎯 MVP

Como Responsable de Compras (Ing. Grover Villarroel), quiero consultar todos los datos de la solicitud (código de trámite, nombre del proyecto, fecha de emisión, solicitante, justificación e ítems solicitados con sus precios referenciales) y el archivo de cotización referencial adjunto en una sola vista operativa, para evaluarla técnicamente antes de tomar una decisión.

**Why this priority**: Permite al Responsable de Compras formarse un criterio técnico completo en una sola pantalla sin necesidad de navegar a otros módulos.

**Independent Test**: Seleccionar la Tarea 2 ("Revisión inicial") con el rol de Responsable de Compras y comprobar que se visualice la cabecera, tabla de ítems con sus precios referenciales y la sección de archivos adjuntos con la cotización referencial.

**Acceptance Scenarios**:

1. **Given** que Grover abre un trámite pendiente en Tarea 2 ("Revisión inicial"), **When** se despliega la pantalla operativa, **Then** el sistema muestra la cabecera completa (número de trámite, proyecto, solicitante y fecha de emisión), la tabla de ítems (con descripción, cantidad, P/U y total) y el panel de justificación.
2. **Given** la sección de archivos cargados de la solicitud, **When** Grover consulta los adjuntos, **Then** el sistema muestra el documento de "cotización inicial / referencial" en PDF con opciones de previsualización y descarga.

**Design Links**:

- 🔗 [Figma - Solicitud de Activos Fijos](https://www.figma.com/design/GVM0XY3qu69N6plfLat4ge/Proyecto_DICYT?node-id=3094-1180)
- 🔗 [Figma - Solicitud de Materiales](https://www.figma.com/design/GVM0XY3qu69N6plfLat4ge/Proyecto_DICYT?node-id=3097-1348)
- 🔗 [Figma - Solicitud de Servicios](https://www.figma.com/design/GVM0XY3qu69N6plfLat4ge/Proyecto_DICYT?node-id=3097-2176)

![Mockup HU1 - Revisión Inicial](mockups/hu1-revision-inicial-compras.png)

---

### User Story 2 - Aprobación Técnica Directa y Avance de Estado (Priority: P1) 🎯 MVP

Como Responsable de Compras (Ing. Grover Villarroel), cuando valide que la solicitud es correcta, quiero presionar el botón de acción "Aprobar", para que el trámite avance automáticamente al siguiente paso del flujo y se registre mi aprobación en la bitácora de auditoría.

**Why this priority**: Es la acción principal del camino feliz que promueve el trámite en el flujo de compras.

**Independent Test**: Presionar "Aprobar" en una solicitud en Tarea 2, verificar la notificación Toast de éxito y comprobar que el estado del trámite avance al siguiente nodo definido en `transicion_flujo`.

**Acceptance Scenarios**:

1. **Given** una solicitud válida en Tarea 2, **When** Grover presiona el botón primario "Aprobar", **Then** el sistema ejecuta la transición al siguiente estado de la base de datos de forma limpia (1-clic), muestra una notificación Toast de éxito y actualiza la cronología del trámite marcando la tarea como `COMPLETADO`.
2. **Given** la aprobación ejecutada, **When** se consulta la bitácora (`historial_estado_tramite`), **Then** queda registrada la fecha/hora exacta y el usuario responsable ("Grover Villarroel - Resp. de Compras").

---

### User Story 3 - Observación del Trámite con Justificación Obligatoria (Priority: P1) 🎯 MVP

Como Responsable de Compras (Ing. Grover Villarroel), si encuentro imprecisiones o inconsistencias en la solicitud, quiero presionar "Observar", para desplegar un modal con justificación obligatoria y devolver la solicitud para su corrección.

**Why this priority**: Permite pausar y devolver solicitudes incorrectas o incompletas con trazabilidad del motivo.

**Independent Test**: Presionar "Observar", verificar que el modal exija un texto no vacío en el motivo de observación y comprobar que al confirmar el trámite retorne al estado de corrección.

**Acceptance Scenarios**:

1. **Given** una solicitud en Tarea 2, **When** Grover presiona el botón secundario "Observar", **Then** el sistema despliega un modal con un área de texto obligatoria para ingresar la observación o motivo de devolución.
2. **Given** el modal de observación, **When** el campo de texto se encuentra vacío o con solo espacios, **Then** el botón "Confirmar Observación" permanece deshabilitado.
3. **Given** la observación ingresada y confirmada, **When** se procesa la devolución, **Then** el trámite transiciona al estado correspondiente y registra el motivo en el historial de auditoría.

---

### User Story 4 - Vista Pasiva de Lectura para Otros Roles (Priority: P2)

Como usuario del sistema con un rol distinto a Compras (ej. Investigador Principal o Responsable de Presupuestos), quiero visualizar el detalle de Tarea 2 en modo pasivo de lectura sin botones de acción, para consultar el estado del trámite sin alterar su flujo.

**Why this priority**: Enforza la segregación de funciones y evita modificaciones no autorizadas.

**Independent Test**: Iniciar sesión como Investigador o Presupuestos, abrir la Tarea 2 y verificar que los botones "Aprobar" y "Observar" permanezcan ocultos o inactivos.

**Acceptance Scenarios**:

1. **Given** un usuario que no tiene el rol de Responsable de Compras, **When** consulta la Tarea 2 del trámite, **Then** el sistema presenta la vista pasiva (`tarea-2-revision-inicial-passive.tsx`) en modo lectura sin controles de edición ni aprobación.

---

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: El área interactiva de Tarea 2 DEBE mostrar el resumen técnico completo de la solicitud: código del trámite, proyecto, solicitante, fecha de emisión, lista de ítems (con cantidad, precio unitario y total) y la justificación.
- **FR-002**: El panel de archivos adjuntos DEBE incluir el enlace/botón para previsualizar y descargar la cotización referencial en formato PDF cargada previamente.
- **FR-003**: El sistema DEBE ofrecer el botón de acción primario **"Aprobar"** en color azul institucional (`#002855` / `#003770`).
- **FR-004**: Al presionar "Aprobar", el sistema DEBE transicionar el trámite al siguiente estado configurado en `transicion_flujo` registrando en `historial_estado_tramite` el ID del usuario activo (Grover Villarroel).
- **FR-005**: El sistema DEBE ofrecer el botón de acción secundario **"Observar"** en estilo outline/secundario.
- **FR-006**: Al presionar "Observar", el sistema DEBE abrir un modal de confirmación con un `textarea` obligatorio para detallar la observación.
- **FR-007**: El sistema DEBE impedir la devolución de una observación si el campo de texto no contiene una justificación válida de al menos 5 caracteres.
- **FR-008**: Si la acción la consulta un rol distinto a Compras, el sistema DEBE desplegar la vista pasiva sin botones operativos.

---

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: La renderización de los datos de la solicitud y sus adjuntos se completa en < 150ms.
- **SC-002**: El 100% de las transiciones (Aprobar / Observar) guardan el usuario responsable real (`id_usuario_responsable = 4` para Grover) en `historial_estado_tramite`.
- **SC-003**: Ninguna observación puede ser registrada con una justificación vacía.
- **SC-004**: El diseño y la disposición de elementos se alinean 1:1 con la interfaz de Wizard minimalista descrita en `DESIGN.md`.
