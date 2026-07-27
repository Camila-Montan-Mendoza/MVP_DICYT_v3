# Feature Specification: Validación Automática de Saldos y Emisión del Sello Preventivo por Resp. Presupuestos

**Feature Branch**: `004-sello-preventivo-presupuestos`

**Created**: 2026-07-27

**Status**: Draft

**Input**: User description: "Validación automática de saldos y emisión del Sello Preventivo por Resp. Presupuestos (Alan). Evaluación automática de disponibilidad por partida (luz verde/suficiente), emisión de sello preventivo con correlativo automático (PREV-2026-XXXXX), opción de rechazo/observación con justificación obligatoria, e integración de selector de rol (Investigador vs Resp. Presupuestos)."

---

## User Scenarios & Testing *(mandatory)*

<!--
  MVP & TESTING NOTE: This project is an MVP for fast validation.
  Limit testing to essential, targeted unit tests ("pruebas unitarias bien puntuales") for critical core logic.
  DESIGN SYSTEM NOTE: All UI components strictly adhere to DESIGN.md (institutional UMSS colors Azul #002855 / #003770, Rojo #BC000C, indicadores verdes de suficiencia, selector de rol en la barra superior).
-->

### User Story 1 - Cambio de Rol de Usuario y Bandeja de Presupuestos (Priority: P1) 🎯 MVP

Como Responsable de Presupuestos (Alan), quiero cambiar mi rol activo desde la cabecera superior a "Responsable de Presupuestos", para acceder a la bandeja de trámites pendientes de verificación presupuestaria.

**Why this priority**: Permite simular el inicio de sesión y cambio de contexto operativo entre el Investigador y el Responsable de Presupuestos durante las demostraciones.

**Independent Test**: Cambiar el rol en la cabecera superior a "Responsable de Presupuestos (Alan)" y comprobar que se activen las funciones de revisión y sellado de preventivos.

**Acceptance Scenarios**:

1. **Given** la cabecera superior del sistema, **When** el usuario interactúa con el selector de perfil, **Then** puede conmutar entre "Investigador Principal (Marcelino Pérez)" y "Responsable de Presupuestos (Alan)".
2. **Given** el rol "Responsable de Presupuestos (Alan)", **When** se consulta un trámite, **Then** el sistema habilita las herramientas de revisión presupuestaria.

---

### User Story 2 - Verificación Automática de Saldos por Partida (Priority: P1)

Como Responsable de Presupuestos (Alan), al abrir un trámite en revisión, quiero visualizar la tabla de partidas solicitadas indicando el monto requerido, el saldo disponible actual y un indicador de disponibilidad ("Suficiente" en verde).

**Why this priority**: Otorga transparencia sobre el respaldo financiero del proyecto antes de comprometer fondos.

**Independent Test**: Abrir la revisión presupuestaria de un trámite y verificar que se desglose cada partida de 5 dígitos (ej. `34200`, `43120`) con su saldo disponible, monto solicitado e indicador de suficiencia verde.

**Acceptance Scenarios**:

1. **Given** que Alan abre una solicitud de adquisición, **When** carga la vista de revisión, **Then** el sistema calcula y muestra para cada partida: el código de 5 dígitos, el nombre de la partida, el monto requerido, el saldo disponible actual y el indicador de suficiencia ("✓ Suficiente" con badge verde).

---

### User Story 3 - Emisión del Sello Preventivo y Generación de Correlativo (Priority: P1)

Como Responsable de Presupuestos (Alan), cuando todas las partidas cuenten con fondos suficientes, quiero presionar el botón "Aprobar Preventivo", para que el sistema genere un código correlativo único (ej. `PREV-2026-00123`), estampe el sello preventivo y avance el trámite al siguiente paso del flujo.

**Why this priority**: Es el acto administrativo clave que reserva formalmente el presupuesto para la adquisición.

**Independent Test**: Hacer clic en "Aprobar Preventivo" en una solicitud con saldo suficiente y verificar que se genere el correlativo `PREV-2026-XXXXX`, cambiando el paso actual del trámite a "Recepción".

**Acceptance Scenarios**:

1. **Given** una solicitud donde todas las partidas tienen saldo suficiente, **When** Alan presiona "Aprobar Preventivo", **Then** el sistema genera un código correlativo interno único (ej. `PREV-2026-00123`), registra la fecha/hora y usuario aprobador (Alan), y promueve el trámite a la siguiente etapa ("Recepción").

---

### User Story 4 - Rechazo u Observación del Trámite (Priority: P2)

Como Responsable de Presupuestos (Alan), si identifico observaciones administrativas en el trámite, quiero presionar "Rechazar / Observar Trámite" e ingresar una justificación obligatoria, para devolver la solicitud a la bandeja del Investigador con estado "Observado por Presupuestos".

**Why this priority**: Garantiza control administrativo y corrección de observaciones antes de comprometer recursos.

**Independent Test**: Presionar "Rechazar / Observar Trámite", verificar que el formulario exija ingresar una justificación y comprobar que el trámite retorne al Investigador con estado "Observado por Presupuestos".

**Acceptance Scenarios**:

1. **Given** una solicitud en revisión, **When** Alan presiona "Rechazar / Observar Trámite", **Then** el sistema despliega un diálogo exigiendo ingresar una justificación u observación obligatoria.
2. **Given** la observación ingresada por Alan, **When** confirma el rechazo, **Then** el trámite se devuelve a la bandeja del Investigador con el estado "Observado por Presupuestos" y la observación visible.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La cabecera superior DEBE incluir un selector de rol interactivo que permita conmutar entre "Investigador Principal (Marcelino Pérez)" y "Responsable de Presupuestos (Alan)".
- **FR-002**: El panel operativo de revisión presupuestaria DEBE listar cada partida del Objeto del Gasto (código de 5 dígitos) con: Monto Requerido, Saldo Disponible y Estado de Suficiencia ("✓ Suficiente" en verde).
- **FR-003**: Cuando todas las partidas cuenten con saldo suficiente, el sistema DEBE habilitar el botón primario **"Aprobar Preventivo"** en color azul institucional (`#002855`).
- **FR-004**: Al presionar "Aprobar Preventivo", el sistema DEBE:
  - Generar automáticamente un código correlativo interno único con la estructura `PREV-2026-XXXXX`.
  - Registrar la fecha, hora y usuario aprobador ("Alan - Resp. Presupuestos").
  - Estampar el sello digital de reserva presupuestaria en el trámite.
  - Promover automáticamente el paso actual del workflow a "Recepción".
- **FR-005**: El sistema DEBE ofrecer el botón secundario **"Rechazar / Observar Trámite"** en color rojo (`#BC000C`).
- **FR-006**: Al presionar "Rechazar / Observar Trámite", el sistema DEBE exigir la captura obligatoria de la observación en un área de texto y actualizar el estado a "Observado por Presupuestos".

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El cálculo de suficiencia presupuestaria y despliegue del estado por partida es instantáneo (< 100ms).
- **SC-002**: El código correlativo `PREV-2026-XXXXX` se genera sin duplicaciones de forma secuencial.
- **SC-003**: El cambio de rol en la cabecera actualiza dinámicamente los permisos y botones habilitados en pantalla.

---

## Assumptions

- **Alineación con MVP**: Simulación fluida de roles y aprobación presupuestaria para demostración con usuarios.
- **Diseño e Identidad**: Estricto cumplimiento de `DESIGN.md` con estilo institucional minimalista.
