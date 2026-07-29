# Feature Specification: Expediente Digital de Respaldos y Resumen de Trámite Completado (Paso 4)

**Feature Branch**: `013-expediente-digital-resumen-completado`

**Created**: 2026-07-29

**Status**: Draft

**Input**: User voice description and UI mockup: "En la Tarea 18 implementar la interfaz 'Resumen de archivos' para cargar y archivar los respaldos finales del trámite en Supabase, y en la Tarea 19 mostrar el resumen ejecutivo completo de todo el proceso finalizado."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Carga y Archivación del Expediente Digital Final (Priority: P1)

Como Investigador Principal o Responsable Administrativo, en la Tarea 18 (Paso 4: Evidencia), quiero utilizar la interfaz "Resumen de archivos" para adjuntar todos los documentos de respaldo finales del procedimiento (PDFs, imágenes) mediante un selector/drag-and-drop, visualizar la lista de archivos con su peso, ícono de formato, previsualizador y eliminación, y presionar el botón **"Archivar respaldos"** para almacenar permanentemente el expediente digital en Supabase y avanzar la tarea a completado.

**Mockup**: ![Mockup HU1 - Resumen de Archivos y Expediente Digital](mockups/resumen-archivos.png)

**Why this priority**: Es la acción requerida en la Tarea 18 para consolidar el expediente digital y dar cierre formal al trámite.

**Independent Test**: Cargar la Tarea 18 para un trámite en el Paso 4, subir 2 o más archivos (PDF e imágenes), verificar que se muestran en la lista con icono, tamaño, botón de vista previa (ojo) y botón de eliminar (papelera), y hacer clic en "Archivar respaldos" para guardar en Supabase y avanzar a la Tarea 19.

**Acceptance Scenarios**:

1. **Given** un trámite en el Paso 4 (Tarea 18: Expediente Digital), **When** el usuario ingresa a la vista "Resumen de archivos", **Then** el sistema despliega el contenedor de carga "Adjuntar archivo" con borde punteado e ícono de subir, y la lista de archivos existentes o cargados.
2. **Given** la lista de archivos adjuntos, **When** se muestra cada elemento, **Then** incluye el ícono del formato (rojo PDF / azul imagen), nombre truncado del archivo, peso en MB/KB, botón de vista previa (ojo) y botón de eliminación (papelera roja).
3. **Given** uno o más archivos en la lista, **When** el usuario presiona **"Archivar respaldos"**, **Then** el sistema guarda los registros en Supabase (`expediente_digital`), registra el evento en `historial_estado_tramite` y transiciona el trámite a la Tarea 19 (Trámite Completado).

---

### User Story 2 - Visor Resumen Ejecutivo del Trámite Completado (Priority: P2)

Como Investigador Principal, Director de la DICyT o Auditor, cuando el trámite llega a la Tarea 19 (Trámite Completado), quiero visualizar una ficha de resumen ejecutivo integral que consolida todo el historial del proceso (Paso 1: Solicitud/Adjudicación, Paso 2: Ordenes y Recepción, Paso 3: Pago a Proveedor, Paso 4: Expediente Digital), pre-llenado automáticamente desde Supabase DB con el badge verde `TRÁMITE COMPLETADO Y ARCHIVADO`.

**Mockup**: ![Mockup HU2 - Resumen del Trámite Completado](mockups/resumen-archivos.png)

**Why this priority**: Ofrece la trazabilidad completa y la rendición de cuentas final para consulta histórica o auditorías institucionales.

**Independent Test**: Cargar la Tarea 19 para un trámite completado y verificar que se despliega el resumen ejecutivo con todos los módulos desplegados (Solicitud, Recepción, Pago, Expediente) y los datos reales extraídos de Supabase.

**Acceptance Scenarios**:

1. **Given** un trámite en la Tarea 19 (Trámite Completado), **When** cualquier usuario autorizado lo consulta, **Then** el sistema muestra la vista pasiva/resumen con el encabezado "Trámite Completado y Archivados", badge verde de éxito, y los 4 bloques resumiendo el ciclo de vida del trámite.
2. **Given** el bloque de expediente digital en el resumen, **When** el usuario consulta los archivos, **Then** puede ver todos los documentos y respaldos almacenados durante el proceso con enlace de descarga/vista previa.

---

### User Story 3 - Previsualización y Eliminación de Archivos en Borrador (Priority: P3)

Como Investigador Principal, mientras estoy armando el expediente digital en la Tarea 18, quiero poder previsualizar en modal/pestaña cualquier archivo cargado (haciendo clic en el ícono de ojo) y eliminar archivos erróneos (haciendo clic en la papelera roja) antes de confirmar la archivación definitiva.

**Mockup**: ![Mockup HU3 - Previsualización y Eliminación](mockups/resumen-archivos.png)

**Why this priority**: Evita la acumulación de documentos equivocados o corruptos en el expediente oficial.

**Independent Test**: Subir un archivo en la Tarea 18, hacer clic en el ojo para previsualizarlo, hacer clic en la papelera para removerlo y confirmar que la lista se actualiza.

**Acceptance Scenarios**:

1. **Given** un archivo cargado en la lista, **When** el usuario presiona el ícono de ojo, **Then** se abre la previsualización del documento en un modal/visor.
2. **Given** un archivo cargado en la lista, **When** el usuario presiona el ícono de papelera, **Then** se remueve de la lista antes de guardar en Supabase.

---

### Edge Cases

- **¿Qué ocurre si el usuario presiona "Archivar respaldos" sin haber subido archivos?**: El sistema genera un expediente por defecto incorporando automáticamente las Facturas, Actas de Recepción y Notas de Pago generadas previamente en los Pasos 2 y 3.
- **¿Qué sucede si falla la subida de un archivo pesado?**: Se muestra una alerta de error y se permite reintentar la subida sin perder los demás archivos de la lista.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: El sistema DEBE proveer en la Tarea 18 (`Tarea18ExpedienteDigitalActive`) la interfaz "Resumen de archivos" con el cuadro de carga "Adjuntar archivo" (drag-and-drop / selector) y la lista de archivos de respaldo.
- **FR-002**: El sistema DEBE mostrar para cada archivo: ícono del formato (PDF / Imagen), nombre, tamaño en KB/MB, botón de previsualización (ojo) y botón de eliminación (papelera).
- **FR-003**: El sistema DEBE persistir los registros del expediente digital en la tabla `expediente_digital` de Supabase (`id`, `id_tramite`, `nombre_archivo`, `url_archivo`, `tipo_archivo`, `tamano_bytes`, `fecha_carga`).
- **FR-004**: El sistema DEBE permitir avanzar el trámite de la Tarea 18 a la Tarea 19 al presionar el botón **"Archivar respaldos"**.
- **FR-005**: El sistema DEBE proveer en la Tarea 19 (`Tarea19TramiteCompletadoActive` y `Passive`) una vista de Resumen Ejecutivo Integral que consulte y presente todos los hitos del trámite (Solicitud, Recepción, Pago, Expediente).
- **FR-006**: El sistema DEBE mostrar el badge distintivo `TRÁMITE COMPLETADO Y ARCHIVADO` en la Tarea 19.

### Key Entities

- **expediente_digital**: Registro en Supabase (`id`, `id_tramite`, `nombre_archivo`, `url_archivo`, `tipo_archivo`, `tamano_bytes`, `fecha_carga`, `id_usuario`).

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Carga y renderizado de la lista de archivos del expediente digital en < 1 segundo.
- **SC-002**: 100% de la información histórica de los 4 pasos consolidada sin pérdida de datos en la vista final de resumen.
- **SC-003**: Persistencia completa del expediente digital en Supabase tras ejecutar "Archivar respaldos".

## Assumptions

- Los archivos cargados en el expediente digital son imágenes (JPG, PNG) y documentos PDF.
- El resumen final de la Tarea 19 combina la información almacenada de los Pasos 1, 2, 3 y 4.
