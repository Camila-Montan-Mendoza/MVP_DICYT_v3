# Feature Specification: Creación y Envío de Trámites de Adquisición Divididos por Tipo de Compra

**Feature Branch**: `001-segregacion-tramites-lote`

**Created**: 2026-07-27

**Status**: Draft

**Input**: User description: "Como Investigador Principal o Investigador de Apoyo, Quiero seleccionar los ítems requeridos para mi proyecto, auto-clasificarlos por tipo (Materiales, Activos Fijos o Servicios) y generar trámites separados para cada categoría con sus especificaciones técnicas, justificaciones y respaldos, Para cumplir con la normativa que prohíbe mezclar tipos de compra en una misma solicitud y poder enviar mis trámites de forma individual o en lote sin que un error en un trámite bloquee los demás."

---

## User Scenarios & Testing *(mandatory)*

<!--
  MVP & TESTING NOTE: This project is an MVP for fast validation.
  Limit testing to essential, targeted unit tests ("pruebas unitarias bien puntuales") for critical core logic.
  DESIGN SYSTEM NOTE: All UI components and mockups strictly adhere to DESIGN.md (institutional colors UMSS Azul #003770, Rojo #BC000C, componentes de @/shared/ui de shadcn/ui, diseño minimalista y márgenes responsivos).
-->

### User Story 1 - Auto-Clasificación y Segregación de Ítems en Trámites Independientes (Priority: P1)

Como Investigador Principal o Investigador de Apoyo, al agregar múltiples ítems heterogéneos a mi lista inicial de pedido, deseo que el sistema los clasifique automáticamente por tipo (Materiales, Activos Fijos o Servicios) y genere trámites separados 100% homogéneos sin mezclarlos, para cumplir con la normativa administrativa de compras.

**Mockup**: ![Mockup HU1 Auto-Clasificación](mockups/hu1-autoclasificacion.png)

**Why this priority**: La regla de segregación estricta es un requisito normativo bloqueante. Si se mezclan categorías en un mismo número de trámite, la solicitud es rechazada por la administración.

**Independent Test**: Se valida agregando a una lista inicial 3 ítems (1 Material, 1 Activo Fijo y 1 Servicio) y comprobando que el sistema divide la lista automáticamente en 3 borradores de trámites separados y rotulados correctamente sin intervención manual.

**Acceptance Scenarios**:

1. **Given** que el Investigador agrega ítems a su lista inicial de pedido, **When** el sistema procesa los ítems de la lista, **Then** auto-clasifica cada ítem según su naturaleza en "Material", "Activo Fijo" o "Servicio" y genera automáticamente hasta 3 borradores de trámites independientes agrupando únicamente ítems de la misma categoría.
2. **Given** que la lista de pedido inicial del Investigador solo contiene ítems de 1 o 2 categorías (por ejemplo, solo Materiales y Servicios), **When** se ejecuta la auto-clasificación, **Then** el sistema genera únicamente los trámites correspondientes a las categorías presentes sin crear borradores vacíos.

---

### User Story 2 - Registro de Datos Técnicos y Documentos Obligatorios por Ítem (Priority: P1)

Como Investigador, al configurar cada ítem dentro de un trámite generado, quiero ingresar sus valores numéricos/detalles y adjuntar el documento técnico requerido (ET o TDR), así como visualizar la sugerencia de partida presupuestaria externa o su estado pendiente si no se encuentra, para contar con toda la información técnica indispensable.

**Mockup**: ![Mockup HU2 Datos e Ítems](mockups/hu2-datos-item-et-tdr.png)

**Why this priority**: Cada ítem necesita sus especificaciones técnicas y su cotización/estimación de costo para ser evaluado por las instancias de presupuesto y compras.

**Independent Test**: Se ingresa a un trámite de Materiales y se completa Cantidad, Unidad y Precio Unitario verificando el cálculo del Precio de Referencia y la carga obligatoria del documento ET. Adicionalmente en un trámite de Servicios se adjunta el TDR en PDF.

**Acceptance Scenarios**:

1. **Given** un ítem contenido en un trámite de Materiales o Activos Fijos, **When** el Investigador completa los campos del ítem, **Then** el sistema solicita Cantidad, Unidad, Precio Unitario, calcula automáticamente el Precio de Referencia (`Cantidad * Precio Unitario`) y exige adjuntar el documento de Especificaciones Técnicas (ET).
2. **Given** un ítem contenido en un trámite de Servicios, **When** el Investigador edita el ítem, **Then** el sistema solicita el Detalle del servicio, el Precio Referencial y la carga obligatoria del documento de Términos de Referencia (TDR en formato PDF).
3. **Given** que el sistema consulta el servicio externo de partidas presupuestarias para sugerir el código presupuestario de un ítem, **When** el servicio externo no devuelve una partida coincidente, **Then** el ítem se marca como "Pendiente de asignación" sin bloquear la creación o envío de la solicitud, delegando la asignación al Responsable de Presupuestos.

---

### User Story 3 - Configuración de Cabecera, Justificación y Respaldos por Trámite (Priority: P2)

Como Investigador, deseo definir la Justificación y adjuntar los archivos de respaldo (proformas/cotizaciones) de forma independiente para cada trámite, y especificar el Custodio y Ubicación si el trámite es de Activos Fijos, para fundamentar legal y administrativamente cada solicitud.

**Mockup**: ![Mockup HU3 Cabeceras y Custodio](mockups/hu3-cabecera-justificacion-custodio.png)

**Why this priority**: Cada trámite administrativo viaja de forma independiente y requiere sus propias justificaciones y cotizaciones de respaldo antes de ingresar al flujo de firmas.

**Independent Test**: Se accede a la cabecera de un trámite de Activos Fijos y se verifica que no permita guardar hasta ingresar la Justificación, adjuntar al menos una proforma y completar los campos específicos de Nombre del Custodio y Lugar de ubicación.

**Acceptance Scenarios**:

1. **Given** un trámite borrador de cualquier categoría, **When** el Investigador edita los datos generales de dicho trámite, **Then** puede ingresar el texto obligatorio de Justificación del Trámite y adjuntar uno o varios archivos PDF/imágenes de proformas o cotizaciones de respaldo.
2. **Given** un trámite borrador correspondiente exclusivamente a la categoría de Activos Fijos, **When** el Investigador edita su cabecera general, **Then** el sistema solicita de forma obligatoria el Nombre del Custodio y el Lugar / Laboratorio donde estarán ubicados los activos fijos.

---

### User Story 4 - Envío Individual de Trámites (Priority: P2)

Como Investigador, quiero poder enviar un trámite específico que ya he terminado de configurar sin tener que esperar a completar los demás trámites borradores que tenga abiertos en pantalla, para agilizar las compras urgentes.

**Mockup**: ![Mockup HU4 Envío Individual](mockups/hu4-envio-individual.png)

**Why this priority**: Otorga flexibilidad operativa al investigador para priorizar el envío de trámites críticos mientras continúa editando otros trámites secundarios.

**Independent Test**: Con dos trámites borradores en pantalla (uno completo y otro incompleto), se hace clic en "Enviar Trámite" del trámite completo y se verifica que solo ese trámite pase al estado "Enviado / En aprobación" emitiendo su comprobante.

**Acceptance Scenarios**:

1. **Given** un trámite específico con todos sus datos obligatorios y documentos adjuntos completos, **When** el Investigador presiona el botón "Enviar Trámite" de ese formulario particular, **Then** el sistema valida únicamente dicho trámite, lo registra en el flujo de aprobación y emite una confirmación de envío exitoso con su número de seguimiento único.

---

### User Story 5 - Envío en Lote Resiliente Non-Blocking (Priority: P3)

Como Investigador, al tener múltiples trámites listos en pantalla, quiero presionar "Enviar Todos los Trámites" y que el sistema procese cada uno de forma independiente, de modo que si uno falla o carece de datos, los trámites válidos se envíen con éxito y el trámite con error permanezca en borrador indicando claramente qué corregir.

**Mockup**: ![Mockup HU5 Envío en Lote Resiliente](mockups/hu5-envio-lote-resiliente.png)

**Why this priority**: Evita la frustración del usuario al impedir que un error menor en un ítem de un trámite bloquee el envío de otros trámites que ya están 100% correctos.

**Independent Test**: Se preparan 3 trámites (2 completos y 1 sin archivo de proforma). Se hace clic en "Enviar Todos los Trámites". Se comprueba que los 2 válidos se envían emitiendo sus números de seguimiento y que el trámite incompleto permanece en pantalla resaltado en rojo señalando el documento faltante.

**Acceptance Scenarios**:

1. **Given** que el Investigador tiene 2 o más trámites en pantalla y presiona el botón "Enviar Todos los Trámites", **When** el sistema ejecuta la validación y procesamiento de envío en lote, **Then** los trámites válidos se envían exitosamente al flujo de aprobación mostrando sus códigos de seguimiento, mientras que los trámites con errores se mantienen en pantalla en estado borrador con un destacado visual claro del motivo y campo específico a corregir.

---

### Edge Cases

- ¿Qué ocurre si el usuario elimina todos los ítems de una categoría en la pantalla de edición? El borrador de trámite correspondiente a esa categoría se elimina o deshabilita automáticamente para evitar trámites sin ítems.
- ¿Qué sucede si el servicio externo de consulta de partidas presupuestarias se encuentra fuera de línea? El sistema asigna el estado "Pendiente de asignación (Servicio no disponible)" y permite continuar con el flujo normal de edición y envío.
- ¿Qué ocurre si un archivo adjunto (ET, TDR o proforma) excede el tamaño máximo permitido o el formato no es válido? El sistema muestra una alerta inmediata en la tarjeta del ítem o cabecera sin limpiar el resto del formulario.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE auto-clasificar cada ítem ingresado por el usuario en una de las tres categorías permitidas: "Material", "Activo Fijo" o "Servicio".
- **FR-002**: El sistema DEBE generar trámites borradores 100% homogéneos separados por categoría (hasta 3 trámites), garantizando la regla de segregación estricta sin mezclar tipos de compra en una misma solicitud.
- **FR-003**: Para los trámites de Materiales y Activos Fijos, el sistema DEBE solicitar por ítem: Cantidad, Unidad, Precio Unitario, calcular automáticamente el Precio de Referencia (`Cantidad * Precio Unitario`) y exigir la carga del documento técnico ET.
- **FR-004**: Para los trámites de Servicios, el sistema DEBE solicitar por ítem: Detalle, Precio Referencial y la carga obligatoria del documento de Términos de Referencia (TDR) en formato PDF.
- **FR-005**: El sistema DEBE consultar un servicio externo para sugerir la partida presupuestaria de cada ítem. En caso de no encontrar coincidencia o estar indisponible, DEBE marcar el ítem como "Pendiente de asignación" sin bloquear la creación ni el envío del trámite.
- **FR-006**: Cada trámite generado DEBE contar con su propia sección de cabecera independiente que requiera obligatoriamente el texto de Justificación del Trámite y al menos un archivo de respaldo (proforma/cotización).
- **FR-007**: En los trámites de la categoría "Activos Fijos", el sistema DEBE solicitar adicionalmente el Nombre del Custodio y el Lugar de ubicación asignado.
- **FR-008**: El sistema DEBE permitir el envío individual de cualquier trámite cuya información y documentos obligatorios estén completos, registrándolo en el flujo de aprobación de forma independiente.
- **FR-009**: El sistema DEBE ofrecer un botón de envío en lote ("Enviar Todos los Trámites") con lógica resiliente non-blocking: procesar cada trámite de forma independiente, enviar con éxito los válidos emitiendo su número de seguimiento y mantener los trámites fallidos en borrador con retroalimentación explícita de los campos o anexos a corregir.
- **FR-010**: La interfaz de usuario DEBE construirse siguiendo las guías de [DESIGN.md](../../DESIGN.md), utilizando la paleta institucional UMSS (`--primary: #003770`, `--secondary: #BC000C`), componentes estilizados de `shadcn/ui` (@/shared/ui) y diagramación minimalista sin sobrecarga visual.

### Key Entities *(include if feature involves data)*

- **ListaPedido**: Objeto inicial que agrupa todos los ítems seleccionados por el Investigador antes de la auto-clasificación.
- **TramiteSolicitud**: Solicitud de compra homologada por categoría (Materiales, Activos Fijos o Servicios). Contiene código de seguimiento, categoría, justificación, archivos de respaldo, custodio/ubicación (solo para activos) y estado (Borrador, Enviado, Con Errores).
- **ItemSolicitud**: Elemento individual perteneciente a un trámite. Contiene tipo, descripción/detalle, cantidad, unidad, precio unitario, precio referencia, partida presupuestaria (o Pendiente) y documento técnico adjunto (ET o TDR).
- **DocumentoAnexo**: Archivo de respaldo (ET en PDF/imagen, TDR en PDF, o Proformas/Cotizaciones).

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de los trámites enviados a través del sistema son completamente homogéneos (0% de solicitudes con categorías mezcladas).
- **SC-002**: El tiempo promedio que le toma a un Investigador clasificar y estructurar sus pedidos en trámites separados se reduce a menos de 2 minutos gracias a la auto-clasificación automática.
- **SC-003**: En envíos en lote con errores parciales, el 100% de los trámites válidos se procesa y envía correctamente sin ser bloqueados por los trámites incompletos (eficiencia de procesamiento resiliente del 100%).
- **SC-004**: Los investigadores identifican el error de un trámite fallido en menos de 5 segundos gracias a los resaltados visuales y mensajes claros por sección.

---

## Assumptions

- **Alineación con MVP**: Este desarrollo forma parte de un MVP enfocado en validación rápida. Las pruebas se limitarán a pruebas unitarias puntuales para la lógica de auto-clasificación, segregación y procesamiento en lote.
- **Integración del servicio de partidas**: Se asume que el servicio externo de consulta de partidas presupuestarias responde mediante una API REST ligera o retorna un estado no encontrado sin demoras superiores a 1.5 segundos.
- **Almacenamiento de archivos**: Los adjuntos (ET, TDR, proformas) se gestionan temporalmente en el cliente/estado local antes del envío final a la API de almacenamiento.
- **Diseño UI**: Se hereda la estructura de layout global (`AppLayout.tsx`) y los tokens CSS definidos en `DESIGN.md`.
