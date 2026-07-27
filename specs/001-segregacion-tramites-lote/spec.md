# Feature Specification: Creación y Envío de Trámites de Adquisición Divididos por Tipo de Compra

**Feature Branch**: `001-segregacion-tramites-lote`

**Created**: 2026-07-27

**Status**: Draft

**Input**: User description: "Creación y envío de trámites de adquisición divididos por tipo de compra. Formulación de Requerimientos con interfaz en español, lista de trámites, segregación por categoría (Activos Fijos, Materiales, Servicios), modal de detalles/ET/TDR, y navegación en español con Home limpio en la raíz."

---

## User Scenarios & Testing *(mandatory)*

<!--
  MVP & TESTING NOTE: This project is an MVP for fast validation.
  Limit testing to essential, targeted unit tests ("pruebas unitarias bien puntuales") for critical core logic.
  DESIGN SYSTEM NOTE: All UI components strictly adhere to DESIGN.md and the official mockups (institutional UMSS colors Azul #002855 / #003770, Rojo #BC000C, componentes en español, diseño de barra lateral y cabecera institucional).
-->

### User Story 1 - Formulación de Requerimientos y Auto-Clasificación por Categoría (Priority: P1)

Como Investigador (ej. Marcelino Pérez), en la vista "Formulación de Requerimientos" (`/tramites/nuevo`), quiero seleccionar mi proyecto y buscar/agregar ítems, para que se clasifiquen y agrupen automáticamente en secciones colapsables homogéneas por categoría (Activos Fijos, Materiales, Servicios) con sus respectivos contadores.

**Mockup**: ![Mockup Formulación de Requerimientos](mockups/solicitar_tramite_4.png)

**Why this priority**: La segregación de requerimientos por categoría es obligatoria según la normativa universitaria de la UMSS.

**Independent Test**: Seleccionar un proyecto, agregar ítems de diferentes tipos y verificar que aparezcan organizados en los bloques desplegables de Activos Fijos, Materiales y Servicios.

**Acceptance Scenarios**:

1. **Given** que el Investigador está en la pantalla de Formulación de Requerimientos, **When** selecciona un Proyecto y busca/agrega ítems, **Then** los ítems se posicionan automáticamente en su bloque de categoría correspondiente con el contador actualizado.
2. **Given** las secciones desplegables de categorías (Activos Fijos, Materiales, Servicios), **When** el Investigador activa el interruptor (toggle switch) de una categoría, **Then** se despliega el listado de ítems pertenecientes a dicha categoría.

---

### User Story 2 - Registro de Información por Ítem y Carga de Documento Técnico (Priority: P1)

Como Investigador, al hacer clic sobre un ítem o expandir su detalle (ej. "SERVICIO 1 | SERVICIO DE AUDITORÍA EXTERNA"), quiero ver el modal u overlay con los campos requeridos (Cantidad, Precio, Detalle) y adjuntar el documento obligatorio (ET o TDR en PDF).

**Mockup**: ![Mockup Detalle de Ítem y Modal](mockups/OVERLAY & MODAL.png)

**Why this priority**: Cada ítem requiere su especificación técnica (ET) o términos de referencia (TDR) antes de ser procesado por presupuestos y compras.

**Independent Test**: Abrir la tarjeta de un ítem, ingresar cantidad y adjuntar el PDF de ET/TDR, comprobando que se muestre el estado completado y el cálculo referencial.

**Acceptance Scenarios**:

1. **Given** un ítem en la lista de requerimientos, **When** el Investigador edita su detalle, **Then** puede ingresar la cantidad, precio unitario o detalle de servicio y adjuntar el archivo ET (para Materiales/Activos Fijos) o TDR (para Servicios).
2. **Given** la consulta de partida presupuestaria, **When** el servicio externo no devuelve coincidencia, **Then** se marca como "Pendiente de asignación" sin bloquear la formulación.

---

### User Story 3 - Configuración de Cabeceras, Justificación y Datos de Custodio (Priority: P2)

Como Investigador, deseo completar la Justificación del Trámite y adjuntar proformas/cotizaciones de respaldo, especificando además el Custodio y Ubicación en caso de Activos Fijos.

**Mockup**: ![Mockup Configuración y Desglose](mockups/solicitar_tramite_4-1.png)

**Why this priority**: Es necesario contar con los respaldos y la justificación justificada para la aprobación del trámite.

**Independent Test**: Rellenar la justificación y adjuntar la proforma en la cabecera del trámite de Activos Fijos verificando que requiera Custodio y Ubicación.

**Acceptance Scenarios**:

1. **Given** la sección de datos generales de un trámite, **When** se ingresan la Justificación y las proformas de respaldo, **Then** el trámite queda habilitado para el envío.
2. **Given** un trámite de Activos Fijos, **When** se configura la cabecera, **Then** exige ingresar el Nombre del Custodio y Lugar de ubicación.

---

### User Story 4 - Envío de Trámites (Priority: P2)

Como Investigador, al presionar el botón "Enviar", quiero que el sistema procese y envíe los trámites formulados, emitiendo su confirmación y número de seguimiento en el flujo de aprobación.

**Mockup**: ![Mockup Envío de Trámites](mockups/solicitar_tramite_4-4.png)

**Why this priority**: Permite oficializar el trámite para que ingrese al circuito administrativo de la DICYT.

**Independent Test**: Hacer clic en el botón principal "Enviar" y verificar que se muestre la confirmación del trámite enviado y se redirija a la lista de trámites.

**Acceptance Scenarios**:

1. **Given** los trámites formulados en pantalla, **When** el Investigador presiona "Enviar", **Then** el sistema procesa el envío, registra el estado "Pendiente / En aprobación" y notifica el éxito del trámite.

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
- **FR-004**: La pantalla "Formulación de Requerimientos" DEBE permitir seleccionar el Proyecto, buscar ítems y desplegar los bloques colapsables por categoría: "Activos Fijos", "Materiales" y "Servicios".
- **FR-005**: Cada bloque de categoría DEBE incluir su ícono temático, un interruptor de activación/despliegue (toggle switch) y un badge con el contador de ítems.
- **FR-006**: Los ítems dentro de cada categoría DEBEN mostrar su código/nombre, badge de tipo, cantidad, opción de eliminar y permitir abrir el modal de detalles para adjuntar ET (para Materiales/Activos Fijos) o TDR (para Servicios).
- **FR-007**: El botón principal de envío ("Enviar") DEBE destacar en color azul institucional (`#002855` / `#003770`) y procesar la solicitud para registrarla en la lista de trámites.
- **FR-008**: Toda la interfaz de usuario DEBE incluir la barra lateral fija (Sidebar) con el logo "SIGEFI DICYT SAN SIMON", las opciones de menú "Proyectos", "Trámites" (activa) y "Cerrar Sesión", así como la barra superior con el encabezado "UNIVERSIDAD MAYOR DE SAN SIMON" y el perfil del investigador ("Investigador Marcelino Perez").

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de las rutas públicas y de usuario final están en español (`/`, `/tramites`, `/tramites/nuevo`).
- **SC-002**: La interfaz coincide al 100% con la estructura y diseño visual de los mockups oficiales (`lista_tramites.png`, `solicitar_tramite_4.png`, `OVERLAY & MODAL.png`).
- **SC-003**: La navegación entre la Lista de Trámites y la Formulación de Requerimientos se realiza en menos de 1 segundo.

---

## Assumptions

- **Alineación con MVP**: Desarrollo enfocado en validación rápida. Lógica de estado local enriquecida con persistencia Supabase.
- **Navegación e Idioma**: Estricto uso del idioma español en todas las URLs y textos de la interfaz de usuario.
