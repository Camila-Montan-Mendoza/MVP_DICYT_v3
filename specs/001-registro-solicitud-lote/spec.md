# Feature Specification: Registro y Auto-Distribución de Solicitud de Adquisición por Tipo

**Feature Branch**: `001-registro-solicitud-lote`

**Created**: 2026-07-23

**Status**: Draft

**Input**: User description: "Registro y Auto-Distribución de Solicitud de Adquisición por Tipo (Selección unificada con clasificación automática de ítems en 3 categorías: Materiales, Activos Fijos o Servicios; auto-distribución en hasta 3 trámites homogéneos independientes; formularios técnicos ET/TDR por ítem; justificación y respaldos por trámite)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Selección Unificada y Clasificación Automática de Ítems (Priority: P1)

Como Investigador Principal (IP), quiero seleccionar los ítems requeridos en una lista unificada para que el sistema los clasifique automáticamente en "Material", "Activo Fijo" o "Servicio", permitiéndome armar mi lista de compras sin tener que clasificar manualmente cada ítem ni crear múltiples solicitudes desde el inicio.

**Why this priority**: Es la puerta de entrada indispensable para capturar las intenciones de compra del usuario de manera fluida y sin fricción manual.

**Independent Test**: Se prueba agregando o seleccionando ítems en la interfaz unificada (ej. "Reactivos de laboratorio", "Laptop i7", "Mantenimiento de Servidor") y verificando que el sistema les asigne automáticamente la categoría correspondiente ("Material", "Activo Fijo" y "Servicio" respectivamente).

**Acceptance Scenarios**:

1. **Given** que el Investigador Principal está en la pantalla de inicio de solicitud de adquisición, **When** agrega o selecciona ítems en su lista de requerimientos, **Then** el sistema los clasifica automáticamente en una de las tres opciones: "Material", "Activo Fijo" o "Servicio".

---

### User Story 2 - Auto-Distribución en hasta 3 Trámites Independientes (Priority: P1)

Como Investigador Principal (IP), quiero presionar "Generar Trámites por Tipo" para que el sistema analice los tipos de ítems seleccionados y genere automáticamente hasta 3 trámites independientes 100% homogéneos (Trámite A: Materiales, Trámite B: Activos Fijos, Trámite C: Servicios), garantizando que no se mezclen tipos de compra distintos en un mismo trámite.

**Why this priority**: Es la regla de negocio nuclear para evitar trámites mixtos y cumplir la normativa institucional PD-73.

**Independent Test**: Se ingresan ítems de 2 o 3 categorías distintas y se hace clic en "Generar Trámites por Tipo". Se verifica que la aplicación subdivida automáticamente la lista en hasta 3 trámites independientes y les asigna un ID provisional de grupo.

**Acceptance Scenarios**:

1. **Given** que el Investigador ha seleccionado ítems de 2 o 3 categorías distintas, **When** presiona "Generar Trámites por Tipo", **Then** el sistema subdivide la lista automáticamente en hasta 3 trámites independientes sin mezclar categorías (Trámite A: Materiales, Trámite B: Activos Fijos, Trámite C: Servicios).

---

### User Story 3 - Completado de Información Técnica por Ítem (Priority: P1)

Como Investigador Principal (IP), quiero desplegar cada ítem dentro de su trámite generado para completar Cantidad, Precio de Referencia y el formulario técnico correspondiente (ET para Materiales/Activos, TDR para Servicios), para detallar los requerimientos requeridos para el proceso de compras.

**Why this priority**: Garantiza que cada ítem contenga las especificaciones técnicas indispensables para su posterior cotización y adjudicación.

**Independent Test**: Se despliega un ítem dentro de un trámite de Servicios y se verifica que habilite campos TDR (objetivo, entregables); luego se despliega un ítem dentro de un trámite de Activos o Materiales y se verifica que habilite campos ET (especificaciones físicas, marca).

**Acceptance Scenarios**:

1. **Given** que el Investigador revisa un trámite específico generado (ej. Trámite de Activos), **When** despliega cada ítem del trámite, **Then** el sistema le solicita completar Cantidad, Precio de Referencia y el formulario técnico correspondiente: ET (Especificaciones Técnicas) para Materiales y Activos, o TDR (Términos de Referencia) para Servicios.

---

### User Story 4 - Justificación del Trámite y Adjuntos PDF/Imágenes por Trámite (Priority: P1)

Como Investigador Principal (IP), quiero redactar una justificación general y subir archivos de respaldo (PDF o imágenes) para cada trámite generado, para sustentar formalmente la adquisición de dicho grupo específico de ítems.

**Why this priority**: Permite que cada trámite cuente con sus proformas, cotizaciones o notas formales correspondientes sin requerir archivos redundantes 1:1 por ítem.

**Independent Test**: En la cabecera de un trámite de Materiales, se completa la justificación textual (ej. "Justificación: Estamos comprando estos materiales para experimentos de laboratorio") y se suben archivos PDF/imágenes; se comprueba que queden vinculados exclusivamente a ese trámite.

**Acceptance Scenarios**:

1. **Given** que el Investigador está completando la cabecera de un trámite generado, **When** ingresa a las secciones generales del trámite, **Then** puede ingresar la Justificación del Trámite en un campo de texto dedicado y adjuntar uno o varios archivos PDF o imágenes de cotizaciones/proformas a nivel de ese trámite.

---

### User Story 5 - Mapeo Automático de Partida Presupuestaria y Envío (Priority: P2)

Como Investigador Principal (IP), quiero que el sistema consulte un servicio externo de partidas presupuestarias para sugerir/asociar automáticamente el código a cada ítem (o marcarlo como "Pendiente de asignación" de forma no bloqueante), y permita enviar los trámites hacia el flujo de revisión.

**Why this priority**: Agiliza la imputación contable inicial manteniendo la resiliencia en la derivación formal hacia el Responsable de Presupuestos.

**Independent Test**: Se realiza la consulta de partida; si el servicio devuelve un código se vincula al ítem, y si no encuentra coincidencia se asigna "Pendiente de asignación". Luego se presiona enviar trámites y se confirma el cambio de estado a "Enviado a Revisión".

**Acceptance Scenarios**:

1. **Given** que se ha completado el detalle técnico, justificación y proformas de un trámite, **When** el Investigador consulta el servicio externo de partidas, **Then** el sistema asocia la partida retornada por ítem o marca "Pendiente de asignación" si no existe mapeo.
2. **Given** uno o más trámites completos, **When** el Investigador activa la opción de envío, **Then** el sistema permite enviar individualmente o en conjunto los trámites generados hacia el flujo de revisión.

---

### Edge Cases

- **Selección de una sola categoría de ítems**: Si los ítems agregados pertenecen a una sola categoría (ej. solo Materiales), el sistema genera automáticamente 1 solo trámite sin fallar.
- **Lista de selección vacía**: El botón "Generar Trámites por Tipo" permanece deshabilitado hasta que haya al menos 1 ítem en la lista.
- **Servicio de partidas sin coincidencia**: El ítem se registra con la etiqueta "Pendiente de asignación" sin bloquear la navegación ni la consolidación del trámite.
- **Formato de respaldos**: Se aceptan archivos PDF e imágenes (PNG, JPG, JPEG) con validación de tamaño máximo (10 MB).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE ofrecer una pantalla de selección unificada donde el Investigador Principal (IP) agregue ítems, clasificándolos automáticamente en una de tres categorías: "Material", "Activo Fijo" o "Servicio".
- **FR-002**: El sistema DEBE analizar los ítems seleccionados y subdividirlos automáticamente al presionar "Generar Trámites por Tipo" en hasta 3 trámites independientes 100% homogéneos (Trámite A: Materiales, Trámite B: Activos Fijos, Trámite C: Servicios), asignando un ID provisional de grupo.
- **FR-003**: Dentro de cada trámite generado, el sistema DEBE solicitar por cada ítem: Cantidad, Unidad de Medida, Precio de Referencia y el formulario técnico dinámico correspondiente (Especificaciones Técnicas ET para Materiales y Activos Fijos, Términos de Referencia TDR para Servicios).
- **FR-004**: El sistema DEBE proporcionar un campo de texto dedicado a nivel de cada trámite para registrar la Justificación del Trámite de forma independiente.
- **FR-005**: El sistema DEBE permitir la carga de uno o múltiples archivos PDF o imágenes (cotizaciones, proformas o notas formales) a nivel de cada trámite específico.
- **FR-006**: El sistema DEBE consultar un servicio externo de equivalencias para asociar automáticamente la partida presupuestaria por ítem, asignando "Pendiente de asignación" de forma permisiva y no bloqueante si no existe coincidencia.
- **FR-007**: El sistema DEBE permitir enviar los trámites generados (de forma individual o en conjunto) hacia el flujo de revisión, actualizando su estado a "Enviado a Revisión" e insertando el registro correspondiente en el historial.

### Key Entities

- **Grupo_Solicitud**: Contenedor provisional de la sesión (`id`, `id_proyecto`, `id_usuario_ip`, `fecha_creacion`).
- **Trámite**: Instancia de trámite independiente homogéneo (`id`, `id_grupo`, `id_proyecto`, `id_tipo_tramite` [Compra menor material, activo fijo, servicios], `justificacion`, `id_estado_tramite`, `rechazado`).
- **Trámite_Item**: Ítem de adquisición asociado a un trámite (`id`, `id_tramite`, `nombre`, `categoria` [Material / Activo Fijo / Servicio], `cantidad`, `unidad_medida`, `precio_referencia`, `especificacion_tecnica` [JSON con ET o TDR], `codigo_partida`, `estado_partida`).
- **Archivo**: Documentos o imágenes de respaldo (`id` UUID, `nombre_original`, `mime_type`, `url`, `fecha_subida`).
- **Historial_Estado_Tramite**: Auditoría de transiciones de estado del trámite.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: La clasificación automática de cada ítem al agregarse a la lista se realiza instantáneamente en <50ms.
- **SC-002**: La auto-distribución de la lista en hasta 3 trámites homogéneos se ejecuta en menos de 200ms al presionar "Generar Trámites por Tipo".
- **SC-003**: 100% de los trámites resultantes son estrictamente homogéneos (0% de mezcla de categorías en un mismo trámite).
- **SC-004**: 100% de los ítems despliegan el formulario técnico correcto (ET para Materiales/Activos, TDR para Servicios) al interactuar con ellos.

## Assumptions

- El usuario activo posee el rol de Investigador Principal (IP) en el proyecto actual.
- La clasificación automática de ítems se basa en un catálogo o diccionario de coincidencia por tipo de ítem en la vista de selección.
- El servicio externo de partidas se simula mediante una función cliente/servidor con diccionario de correspondencias.
- Los formatos de archivo permitidos para respaldos son PDF, PNG, JPG y JPEG con un tamaño máximo de 10 MB por archivo.
