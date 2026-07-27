# Feature Specification: Creación y Envío de Trámites de Adquisición Divididos por Tipo de Compra

**Feature Branch**: `001-segregacion-tramites-lote`

**Created**: 2026-07-27

**Status**: Draft

**Input**: User description: "Formulación de Requerimientos con interfaz en español, segregación por categoría (Activos Fijos, Materiales, Servicios). ET es texto simple, TDR es PDF obligatoria para Servicios, proformas/cotizaciones aceptan imagen o PDF, el nombre del ítem es de solo lectura, e incluye modal de Saldo Insuficiente con opción de modificación presupuestaria."

---

## User Scenarios & Testing *(mandatory)*

<!--
  MVP & TESTING NOTE: This project is an MVP for fast validation.
  Limit testing to essential, targeted unit tests ("pruebas unitarias bien puntuales") for critical core logic.
  DESIGN SYSTEM NOTE: All UI components strictly adhere to DESIGN.md and the official mockups (institutional UMSS colors Azul #002855 / #003770, Rojo #BC000C, componentes en español, diseño de barra lateral y cabecera institucional).
-->

### User Story 1 - Formulación de Requerimientos y Clasificación por Categoría (Priority: P1)

Como Investigador (ej. Marcelino Pérez), en la vista "Formulación de Requerimientos" (`/tramites/nuevo`), quiero seleccionar mi proyecto y buscar/agregar ítems, para que se clasifiquen y agrupen automáticamente en secciones colapsables homogéneas por categoría (Activos Fijos, Materiales, Servicios) con sus respectivos contadores.

**Mockup**: ![Mockup Formulación de Requerimientos](mockups/solicitar_tramite_4.png)

**Why this priority**: La segregación de requerimientos por categoría es obligatoria según la normativa universitaria de la UMSS.

**Independent Test**: Seleccionar un proyecto, agregar ítems de diferentes tipos y verificar que aparezcan organizados en los bloques desplegables de Activos Fijos, Materiales y Servicios.

**Acceptance Scenarios**:

1. **Given** que el Investigador está en la pantalla de Formulación de Requerimientos, **When** selecciona un Proyecto y busca/agrega ítems del catálogo o buscador, **Then** los ítems se posicionan automáticamente en su bloque de categoría correspondiente (Activos Fijos, Materiales, Servicios) con el contador actualizado.
2. **Given** las secciones desplegables de categorías, **When** el Investigador activa el interruptor (toggle switch) de una categoría, **Then** se despliega u oculta el listado de ítems pertenecientes a dicha categoría.

---

### User Story 2 - Registro de Información por Ítem (ET Texto para Materiales/Activos vs TDR PDF para Servicios) (Priority: P1)

Como Investigador, al hacer clic sobre un ítem para editar su detalle (ej. "EDITAR SERVICIO"), quiero ingresar la cantidad, precio referencial, justificación/especificaciones y adjuntar el TDR en PDF (solo para Servicios), garantizando que el nombre del ítem sea de solo lectura.

**Mockup**: ![Mockup Editar Servicio y Modal](mockups/OVERLAY & MODAL.png)

**Why this priority**: Las Especificaciones Técnicas (ET) de Bienes y Materiales son en formato texto, mientras que los Servicios requieren Términos de Referencia (TDR) en PDF. El nombre del ítem del catálogo es inalterable.

**Independent Test**: Editar un ítem de Activo Fijo ingresando ET en texto; luego editar un Servicio adjuntando TDR en PDF y comprobar que el nombre del ítem no pueda ser modificado.

**Acceptance Scenarios**:

1. **Given** un ítem de Material o Activo Fijo, **When** el Investigador edita su detalle, **Then** ingresa las Especificaciones Técnicas (ET) en formato de texto.
2. **Given** un ítem de Servicio, **When** el Investigador edita su detalle, **Then** adjunta obligatoriamente el documento de Términos de Referencia (TDR) en archivo PDF.
3. **Given** cualquier ítem en el modal de edición, **When** el usuario interactúa con el campo "Nombre del Ítem", **Then** el campo se muestra deshabilitado/solo lectura para evitar modificaciones.

---

### User Story 3 - Cabecera, Justificación y Cotizaciones/Proformas de Respaldo (Imagen o PDF) (Priority: P2)

Como Investigador, deseo ingresar la Justificación del Trámite y adjuntar proformas/cotizaciones de respaldo en formato PDF o Imagen (PNG, JPG, WEBP), especificando Custodio y Ubicación en trámites de Activos Fijos.

**Mockup**: ![Mockup Configuración y Desglose](mockups/solicitar_tramite_4-1.png)

**Why this priority**: Las cotizaciones de proveedores suelen entregarse tanto en documentos PDF como en capturas/imágenes escaneadas.

**Independent Test**: Adjuntar una imagen JPG y un PDF en la sección de proformas de respaldo y comprobar que ambos formatos sean aceptados correctamente.

**Acceptance Scenarios**:

1. **Given** la sección de archivos de respaldo de un trámite, **When** el Investigador selecciona una imagen (PNG, JPG, WEBP) o un PDF de proforma, **Then** el sistema permite adjuntarlo y listar su nombre correctamente.
2. **Given** un trámite de Activos Fijos, **When** se configura la cabecera, **Then** exige ingresar el Nombre del Custodio y Lugar de ubicación de forma obligatoria.

---

### User Story 4 - Validación Presupuestaria y Modal de Saldo Insuficiente (Priority: P2)

Como Investigador, al enviar un trámite cuya partida presupuestaria no cuente con el saldo disponible requerido, quiero visualizar el modal informativo de "Saldo Insuficiente" con el desglose del déficit y las opciones de "Iniciar Modificación Presupuestaria" o "Volver a Mis Trámites".

**Mockup**: ![Mockup Saldo Insuficiente](mockups/OVERLAY & MODAL.png)

**Why this priority**: Permite gestionar adecuadamente las restricciones presupuestarias sin perder la información del borrador formulado.

**Independent Test**: Simular el envío de un trámite con monto requerido superior al saldo disponible y verificar que aparezca el modal de "Saldo Insuficiente" detallando la partida, monto requerido, saldo disponible y déficit.

**Acceptance Scenarios**:

1. **Given** un trámite formulado con monto superior al saldo disponible de la partida, **When** el usuario presiona "Enviar", **Then** se despliega el modal "Saldo Insuficiente" mostrando el concepto, monto requerido, saldo disponible y déficit, guardando el trámite como "Borrador (Pendiente de Modificación Presupuestaria)".

---

### User Story 5 - Lista de Trámites y Seguimiento de Estados (Priority: P3)

Como Investigador, quiero acceder a la vista "Lista de Trámites" (`/tramites`) para visualizar todos mis trámites registrados con su código de proyecto, tipo de trámite y estado ("Pendiente", "Aprobado", "Rechazado"), y poder buscar o crear nuevos trámites.

**Mockup**: ![Mockup Lista de Trámites](mockups/lista_tramites.png)

**Why this priority**: Proporciona visibilidad completa y seguimiento del estado de las solicitudes.

**Independent Test**: Ingresar a `/tramites` y verificar que se muestre la tabla de trámites con sus respectivos badges de estado (`Aprobado`, `Pendiente`, `Rechazado`) y el botón `+ Crear trámite`.

**Acceptance Scenarios**:

1. **Given** la pantalla "Lista de Trámites" (`/tramites`), **When** el usuario navega a ella, **Then** visualiza la tabla con las columnas PROYECTO, TIPO DE TRÁMITE y ESTADO, el filtro de búsqueda y el botón "+ Crear trámite" que redirige a `/tramites/nuevo`.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE ofrecer una ruta principal limpia en el Home (`/`) que sirva de panel inicial institucional en español para el sistema SIGEFI DICYT UMSS.
- **FR-002**: El sistema DEBE proveer la ruta en español `/tramites` para la pantalla "Lista de Trámites", incluyendo la tabla de solicitudes, búsqueda por proyecto, filtro por tipo y botón "+ Crear trámite".
- **FR-003**: El sistema DEBE proveer la ruta en español `/tramites/nuevo` para la pantalla "Formulación de Requerimientos".
- **FR-004**: La pantalla "Formulación de Requerimientos" DEBE organizar los requerimientos en bloques colapsables por categoría: "Activos Fijos", "Materiales" y "Servicios".
- **FR-005**: El campo "Nombre / Descripción del Ítem" en el modal de edición DEBE ser de SOLO LECTURA (inalterable).
- **FR-006**: Para ítems de "Materiales" y "Activos Fijos", el campo de Especificaciones Técnicas (ET) DEBE ser un campo de texto simple/área de texto, NO un archivo PDF.
- **FR-007**: Para ítems de "Servicios", el documento de Términos de Referencia (TDR) DEBE ser obligatoriamente un archivo adjunto en formato PDF.
- **FR-008**: Los archivos de respaldo (Proformas / Cotizaciones) DEBEN aceptar formatos de Imagen (`.png`, `.jpg`, `.jpeg`, `.webp`) y documentos PDF (`.pdf`).
- **FR-009**: Si la suma de montos de un trámite supera el saldo disponible de su partida, el sistema DEBE mostrar el modal "Saldo Insuficiente" con el desglose de partida, monto requerido, saldo disponible y déficit, ofreciendo los botones "Iniciar Modificación Presupuestaria" y "Volver a Mis Trámites".
- **FR-010**: Las partidas del Objeto del Gasto asignadas a los ítems DEBEN utilizar obligatoriamente el código de 5 dígitos de nivel más profundo según el Clasificador oficial de Bolivia (ej. `34200` Productos Químicos, `43400` Equipo de Laboratorio, `43120` Equipo de Computación, `25230` Auditorías Externas, `39500` Útiles de Escritorio).

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El modal de edición mantiene el nombre del ítem en estado de solo lectura.
- **SC-002**: Los adjuntos de proformas admiten tanto imágenes como PDFs sin errores de carga.
- **SC-003**: El modal de Saldo Insuficiente se muestra con exactitud matemática en el cálculo del déficit cuando el monto requerido excede el saldo.

---

## Assumptions

- **Alineación con MVP**: Desarrollo enfocado en validación rápida de flujos administrativos universitarios.
- **Navegación e Idioma**: Estricto uso del idioma español en todas las pantallas y diálogos del sistema.
