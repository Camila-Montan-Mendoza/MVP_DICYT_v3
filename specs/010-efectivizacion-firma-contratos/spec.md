# Feature Specification: Efectivización, Firma de Documentos Contractuales y Confirmación de Espera de Entrega

**Feature Branch**: `010-efectivizacion-firma-contratos`

**Created**: 2026-07-29

**Status**: Draft

**Input**: User description: "Efectuar, hacer firmar y verificar la formalización del compromiso legal (impresión directa sin tabla detallada de ítems), confirmar la firma de documentos y pasar el trámite a estado de espera de entrega de materiales o ejecución de servicios."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Impresión Directa y Verificación de Firmas por Proveedor (Priority: P1)

Como Responsable de Compras (Grover), quiero disponer de una vista simplificada enfocada directamente en la impresión rápida de los documentos emitidos (Orden de Compra, Orden de Servicio o Contrato) y en la verificación de firmas oficiales (Coordinador, Director DICyT, Proveedor), evitando la saturación con tablas de detalle de ítems.

**Why this priority**: En esta etapa del flujo, las órdenes ya fueron generadas y desglosadas en la Tarea 9; la prioridad es la logística de impresión rápida y constatación de la firma física o digital del contrato.

**Independent Test**: Cargar la Tarea 10 para un trámite con órdenes emitidas y verificar que se despliega una tarjeta directa por proveedor con el botón principal "Imprimir Documento Oficial" y un checklist interactivo de confirmación de firmas.

**Acceptance Scenarios**:

1. **Given** un trámite con órdenes contractuales emitidas en la Tarea 9, **When** Grover ingresa a la Tarea 10 "Efectivización y Firma de Documentos", **Then** el sistema presenta tarjetas simplificadas por proveedor mostrando el tipo de documento, N° correlativo, monto total, un botón directo "Imprimir Documento" y el estado del checklist de firmas.
2. **Given** la tarjeta de un proveedor, **When** Grover presiona "Imprimir Documento", **Then** el sistema abre directamente la plantilla de impresión oficial de la UMSS / DICyT lista para enviar a la impresora física.
3. **Given** el checklist de verificación de firmas, **When** Grover constata las firmas físicas o escaneadas, **Then** puede marcar como completadas las casillas: `[x] Firma Coordinador`, `[x] Firma Director DICyT`, `[x] Firma Proveedor`.

---

### User Story 2 - Confirmación de Efectivización y Transición a Espera (Priority: P2)

Como Responsable de Compras (Grover), quiero confirmar la efectivización formal de las órdenes una vez firmadas por todas las partes, para registrar la fecha de notificación oficial y colocar el trámite en estado "EN ESPERA DE ENTREGA / EJECUCIÓN".

**Why this priority**: Marca el hito legal donde el plazo de entrega empieza a correr de forma vinculante para los proveedores adjudicados.

**Independent Test**: Marcar las firmas como completadas, presionar "CONFIRMAR EFECTIVIZACIÓN Y FIRMAS", y verificar que el trámite cambia de estado y habilita la transición al Paso 2 - Tarea 11.

**Acceptance Scenarios**:

1. **Given** todas las órdenes del trámite con sus firmas confirmadas, **When** Grover presiona el botón "CONFIRMAR EFECTIVIZACIÓN Y REGISTRAR FIRMAS", **Then** el sistema actualiza el estado de las órdenes a `EFECTUADO_Y_FIRMADO`, registra la fecha de notificación oficial y ejecuta la transición de workflow.
2. **Given** una orden donde falten firmas requeridas, **When** el usuario intenta finalizar la tarea, **Then** el sistema alerta que es necesario completar el registro de firmas para efectuar la orden.

---

### User Story 3 - Panel de Seguimiento de Plazos y Cronograma de Entrega (Priority: P3)

Como Unidad Solicitante o Responsable de Compras, quiero visualizar un panel de control con el conteo de días restantes y la fecha límite de entrega calculada para realizar el seguimiento continuo hasta la recepción del material o servicio.

**Why this priority**: Otorga visibilidad a los investigadores y coordinadores sobre cuándo llegará su pedido.

**Independent Test**: Visualizar la tarjeta en estado efectivizado y verificar la presencia del badge con el cronómetro de días restantes y la fecha límite destacada.

**Acceptance Scenarios**:

1. **Given** una orden efectivizada, **When** el usuario consulta el trámite, **Then** el sistema calcula la diferencia entre la fecha actual y la fecha límite de entrega, mostrando un badge de conteo (ej. `"3 DÍAS RESTANTES - Límite: 23/11/2024"`).

---

### Edge Cases

- **¿Qué ocurre si un proveedor no firma el contrato o desiste?**: El Responsable de Compras puede registrar una observación de desistimiento que permite reevaluar la adjudicación en la Tarea 8.
- **¿Qué pasa si los documentos son firmados digitalmente mediante PDF subido?**: El checklist de firmas se marca automáticamente como verificado al detectar la firma digital registrada.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: El sistema DEBE presentar una interfaz simplificada por proveedor enfocada en la impresión directa y la gestión de firmas sin re-renderizar la lista completa de ítems.
- **FR-002**: El sistema DEBE proporcionar un checklist de validación de firmas por cada documento emitido: Firma Coordinador, Firma Director DICyT, Firma Proveedor.
- **FR-003**: El sistema DEBE permitir lanzar la impresión oficial del documento en 1 solo clic a través del componente de previsualización `ModalImpresionOrden`.
- **FR-004**: El sistema DEBE registrar la fecha oficial de efectivización/notificación y actualizar el estado de las órdenes en Supabase a `EFECTUADO_Y_FIRMADO`.
- **FR-005**: El sistema DEBE calcular los días restantes para la entrega a partir de la fecha de efectivización registrada.
- **FR-006**: El sistema DEBE registrar en el historial de auditoría de Supabase la confirmación de firmas y efectivización legal.

### Key Entities

- **OrdenContractual**: Se añaden los campos `fecha_efectivizacion`, `firmado_coordinador`, `firmado_director`, `firmado_proveedor`, `estado` (`'EFECTUADO_Y_FIRMADO'`).

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Reducción del 70% en el tiempo de procesamiento de la Tarea 10 al eliminar pasos innecesarios de revisión de ítems y permitir impresión directa de 1 clic.
- **SC-002**: 100% de trazabilidad en la verificación de las 3 firmas obligatorias antes de poner el trámite en espera de entrega.
- **SC-003**: Visualización clara e ininterrumpida del estado "EN ESPERA DE ENTREGA / EJECUCIÓN" con la fecha de caducidad destacada.

## Assumptions

- Las órdenes de compra/servicio y contratos fueron generadas con sus datos correctos en la Tarea 9 previa.
- La impresión se realiza en papel membretado de la UMSS / DICyT o se descarga como PDF para firma digital.
