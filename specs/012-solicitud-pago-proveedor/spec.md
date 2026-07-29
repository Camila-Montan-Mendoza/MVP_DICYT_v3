# Feature Specification: Generación y Envió de Solicitud de Pago a Proveedor

**Feature Branch**: `012-solicitud-pago-proveedor`

**Created**: 2026-07-29

**Status**: Draft

**Input**: User description: "Como Investigador Principal, deseo generar y enviar al Responsable de Compras / Contabilidad la solicitud de pago de mis proveedores adjudicados, con los datos ya disponibles en el sistema completados automáticamente (sin digitar manualmente), adjuntando factura y respaldos, para que Compras valide o devuelva con observación."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Generación Automática y Envío de Solicitud de Pago por Proveedor (Priority: P1)

Como Investigador Principal (IP), al llegar al Paso 3 "Pago a Proveedor" (Tarea 13), quiero que el sistema genere automáticamente una nota de solicitud de pago independiente por cada proveedor adjudicado utilizando los datos previamente registrados en Supabase (nombre de proveedor, NIT, ítems adjudicados, monto total y texto literal), permitiéndome revisar la plantilla oficial membretada, verificar los documentos adjuntos (Factura PDF, Nota de Entrega) y enviar la solicitud a revisión sin digitar información desde cero.

**Mockup**: ![Mockup HU1 - Generación y Envío de Solicitud de Pago](mockups/solicitud-pago.png)

**Why this priority**: Es la funcionalidad esencial del Paso 3 que inicia el proceso de desembolso y pago administrativo para cancelar las facturas de los proveedores.

**Independent Test**: Cargar la Tarea 13 para un trámite con recepción de materiales completada y verificar que el sistema arma automáticamente las tarjetas/acordeones por proveedor con estado "SIN ENVIAR", pre-llenando montos, tabla de ítems, visor de la Nota de Solicitud de Pago oficial y botón "ENVIAR SOLICITUD DE PAGO".

**Acceptance Scenarios**:

1. **Given** un trámite en el Paso 3 "Pago a Proveedor" con recepción conforme en la Tarea 11, **When** el Investigador Principal ingresa a la tarea "Emitir Nota Solicitud de Pago", **Then** el sistema despliega un acordeón por proveedor adjudicado con estado "SIN ENVIAR", pre-llenando la Información General (Proyecto/Subprograma, Nro. Orden de Compra), la lista de adjuntos (Factura PDF, Nota de Entrega) y el visor interactivo de la "UMSS - DICyT Nota de Solicitud de Pago" membretada.
2. **Given** la solicitud de pago de un proveedor, **When** el Investigador hace clic en "ENVIAR SOLICITUD DE PAGO", **Then** el sistema valida que exista la Factura adjunta y los datos bancarios básicos registrados, actualiza el estado a `PENDIENTE_REVISION` (badge verde "ENVIADO") y bloquea la edición para el Investigador mientras está en revisión.
3. **Given** un trámite con varios proveedores adjudicados, **When** se cargan las solicitudes, **Then** el sistema genera una nota de solicitud de pago independiente por cada proveedor adjudicado.

---

### User Story 2 - Validación u Observación por Responsable de Compras / Contabilidad (Priority: P2)

Como Responsable de Compras o Analista de Contabilidad DICyT, quiero revisar las solicitudes de pago enviadas, inspeccionar el visor del documento membretado y sus respaldos (Factura, Nota de Entrega), y decidir entre **Validar** (aprobar la solicitud para pasar al Memorándum de Pago / C-31) u **Observar** (registrar un motivo obligatorio y devolver la solicitud al Investigador Principal para corrección).

**Mockup**: ![Mockup HU2 - Validación u Observación de Solicitud](mockups/solicitud-pago.png)

**Why this priority**: Garantiza el control administrativo y la verificación de elegibilidad antes de autorizar la emisión de cheques o transferencias de fondos públicos.

**Independent Test**: Iniciar sesión como Responsable de Compras / Contabilidad, abrir la solicitud en `PENDIENTE_REVISION`, probar el botón "VALIDAR SOLICITUD" (avanza el trámite al siguiente paso) y la opción "OBSERVAR SOLICITUD" (requiere texto de observación y cambia el estado a `OBSERVADA`).

**Acceptance Scenarios**:

1. **Given** una solicitud de pago en estado `PENDIENTE_REVISION`, **When** el usuario de Compras / Contabilidad hace clic en **"VALIDAR SOLICITUD"**, **Then** el sistema actualiza el estado a `VALIDADA`, registra el usuario y fecha de aprobación en Supabase, y ejecuta la transición hacia el siguiente paso (Memorándum de Pago / C-31).
2. **Given** una solicitud con deficiencias en respaldos, **When** el revisor selecciona **"OBSERVAR SOLICITUD"**, **Then** el sistema exige ingresar un texto de observación obligatorio (no vacío), cambia el estado a `OBSERVADA` y devuelve la notificación al Investigador Principal.

---

### User Story 3 - Subsanación y Reenvío de Solicitudes Observadas (Priority: P3)

Como Investigador Principal, cuando una de mis solicitudes de pago sea observada, quiero visualizar el motivo exacto registrado por la autoridad, corregir los documentos o adjuntar los faltantes, y re-enviar la solicitud a revisión.

**Mockup**: ![Mockup HU3 - Subsanación de Observaciones](mockups/solicitud-pago.png)

**Why this priority**: Permite corregir errores sin perder el historial del trámite ni tener que reiniciar el flujo completo desde cero.

**Independent Test**: Cargar una solicitud en estado `OBSERVADA`, verificar la alerta roja con el motivo de observación, adjuntar el documento corregido y hacer clic en "RE-ENVIAR SOLICITUD A REVISIÓN".

**Acceptance Scenarios**:

1. **Given** una solicitud en estado `OBSERVADA`, **When** el Investigador la consulta, **Then** el sistema muestra un banner destacado en rojo con el motivo exacto de la observación y rehabilita los controles de carga de archivos y edición.
2. **Given** la observación corregida, **When** el Investigador presiona **"RE-ENVIAR SOLICITUD A REVISIÓN"**, **Then** el sistema cambia el estado nuevamente a `PENDIENTE_REVISION` y notifica a la bandeja del revisor.

---

### Edge Cases

- **¿Qué ocurre si un proveedor no tiene registrados sus datos bancarios o NIT?**: El sistema muestra una alerta en amarillo y restringe el botón de envío hasta que los datos sean registrados en el perfil del proveedor.
- **¿Qué sucede si falla la conexión a Supabase al enviar o validar?**: Se muestra una alerta de error sin cambiar parcialmente el estado de la solicitud en la base de datos (operación atómica).

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: El sistema DEBE generar automáticamente un registro de solicitud de pago por cada proveedor adjudicado al llegar al Paso 3 (Tarea 13), sin que el usuario digite información manualmente.
- **FR-002**: El sistema DEBE pre-llenar la solicitud con el nombre del proveedor, NIT, proyecto/subprograma, tabla de ítems adjudicados, monto total en bolivianos y su expresión literal.
- **FR-003**: El sistema DEBE incluir automáticamente los respaldos adjuntos en la recepción previa (Factura PDF y Nota de Entrega) y permitir adjuntar evidencias adicionales.
- **FR-004**: El sistema DEBE renderizar en tiempo real el visor oficial del documento membretado "UMSS - DICyT Nota de Solicitud de Pago" con opciones de descarga e impresión.
- **FR-005**: El sistema DEBE administrar los estados en `solicitud_pago`:
  - `SIN_ENVIAR`: Borrador editable por el Investigador.
  - `PENDIENTE_REVISION`: Enviada al Responsable de Compras / Contabilidad (bloqueada para el IP).
  - `VALIDADA`: Aprobada por Compras / Contabilidad; habilita transición al siguiente paso.
  - `OBSERVADA`: Devuelta al IP con motivo de observación obligatorio.
- **FR-006**: El sistema DEBE requerir un texto no vacío al registrar una observación en la solicitud de pago.
- **FR-007**: El sistema DEBE registrar en `historial_estado_tramite` cada cambio de estado (envío, validación, observación, reenvío) con usuario y fecha.

### Key Entities

- **solicitud_pago**: Registro en Supabase (`id`, `id_tramite`, `id_orden_contractual`, `id_proveedor`, `numero_solicitud`, `fecha_solicitud`, `monto_total`, `monto_literal`, `factura_url`, `nota_entrega_url`, `evidencia_extra_url`, `estado` ['SIN_ENVIAR' | 'PENDIENTE_REVISION' | 'VALIDADA' | 'OBSERVADA'], `motivo_observacion`, `id_usuario_validador`, `fecha_validacion`).

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Reducción a 0 del tiempo de digitación manual de datos de solicitudes de pago al auto-completar 100% de la información relevante desde Supabase.
- **SC-002**: Previsualización instantánea de la Nota de Solicitud de Pago membretada en < 1 segundo.
- **SC-003**: 100% de cumplimiento en el registro de observaciones obligatorias para solicitudes devueltas.

## Assumptions

- Las solicitudes de pago corresponden a bienes/materiales previamente recepcionados en la Tarea 11.
- El usuario responsable de la revisión es el Responsable de Compras o Analista de Contabilidad DICyT.
