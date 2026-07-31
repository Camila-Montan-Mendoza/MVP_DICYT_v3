# Feature Specification: Traza Detallada de Trámites e Impacto Presupuestario por Partida Concreta

**Feature Branch**: `016-seguimiento-partidas-partida`

**Created**: 2026-07-30

**Status**: Draft

**Input**: User description: "Traza Detallada de Trámites e Impacto Presupuestario por Partida Concreta. Yo como Investigador Principal quiero hacer clic en cualquier Partida Concreta para desplegar el historial visual de los trámites que han afectado dicha partida para consultar y auditar en qué trámites específicos se ha reservado, comprometido o gastado el saldo de esa partida."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Despliegue de Histórico de Trámites por Partida (Priority: P1)

Como Investigador Principal o Coordinador de Programa, quiero hacer clic en una partida presupuestaria para desplegar el historial detallado de trámites que han afectado su saldo a lo largo del tiempo.

**Mockup**: ![User Story 1 Mockup](mockups/hu1-despliegue-historico-tramites.png)

**Why this priority**: Es la funcionalidad central del requerimiento. Permite auditar en tiempo real el origen y destino de cada boliviano gastado o reservado en una partida.

**Independent Test**: Seleccionar cualquier partida en la lista de partidas de un proyecto y verificar que al hacer clic se despliegue un modal o drawer con la lista cronológica de trámites asociados.

**Acceptance Scenarios**:

1. **Given** una partida presupuestaria en la lista de un proyecto, **When** el usuario hace clic en el registro o botón "Ver trámites", **Then** el sistema despliega un panel lateral o modal con la lista de trámites asociados.
2. **Given** la lista de trámites desplegada, **When** se visualiza cada trámite, **Then** se exhiben los campos: Identificador del Trámite, Fecha de Inicio, Nombre del Ítem, Estado del Ítem (Preventivo, Comprometido, Pagado, Revertido), Proveedor e Importe Afectado.

---

### User Story 2 - Identificación Visual de Trámites Revertidos (Priority: P2)

Como Investigador Principal, quiero distinguir fácilmente los trámites que fueron anulados o revertidos mediante un indicador visual específico para saber cuándo el saldo fue restituido a la partida.

**Mockup**: ![User Story 2 Mockup](mockups/hu2-tramites-revertidos.png)

**Why this priority**: Evita confusiones contables al permitir diferenciar compras efectivas de órdenes anuladas que reintegraron fondos al saldo disponible.

**Independent Test**: Inspeccionar en la traza un trámite con estado "Revertido" y verificar que muestre una insignia informativa clara (ej: badge gris/amber "Revertido / Saldo Restituido").

**Acceptance Scenarios**:

1. **Given** un trámite en estado "Revertido", **When** se lista en la traza de la partida, **Then** se muestra con una insignia diferenciada e indicador de reembolso al saldo.
2. **Given** un trámite activo en estado "Pagado" o "Comprometido", **When** se compara con un trámite revertido, **Then** las etiquetas de estado se diferencian claramente por código de color semántico conforme a `DESIGN.md`.

---

### User Story 3 - Filtrado de Trámites por Estado de Gasto (Priority: P3)

Como Investigador Principal, quiero filtrar los trámites de la traza según su estado (Preventivo, Comprometido, Pagado o Revertido) para agilizar la auditoría de saldos.

**Mockup**: ![User Story 3 Mockup](mockups/hu3-filtro-estado-tramites.png)

**Why this priority**: Facilita la revisión rápida cuando una partida tiene un volumen alto de solicitudes registradas.

**Independent Test**: Aplicar el filtro "Preventivo" en la traza y verificar que solo se muestren las solicitudes en reserva previa.

**Acceptance Scenarios**:

1. **Given** el panel de la traza de trámites, **When** el usuario selecciona el filtro "Preventivo", **Then** la lista muestra únicamente los trámites en dicho estado.
2. **Given** la opción "Todos los estados", **When** se selecciona, **Then** la traza muestra la totalidad de registros históricos.

---

### Edge Cases

- **Partida sin trámites registrados**: Se muestra un estado vacío informativo con mensaje "No existen trámites registrados para esta partida presupuestaria".
- **Trámites sin proveedor asignado**: Para solicitudes en estado preventivo inicial, el campo Proveedor muestra "Pendiente de adjudicación".

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: El sistema DEBE permitir interactuar con cualquier partida presupuestaria para desplegar su traza histórica de trámites.
- **FR-002**: El panel de la traza DEBE listar cronológicamente todos los trámites vinculados mostrando: Identificador, Fecha, Ítem, Estado, Proveedor e Importe.
- **FR-003**: El sistema DEBE asignar etiquetas de estado visuales: Preventivo (Reservado), Comprometido, Pagado y Revertido (Anulado).
- **FR-004**: Los trámites en estado Revertido DEBEN incluir una insignia diferenciada que explicite la restitución del saldo a la partida.
- **FR-005**: El sistema DEBE proveer un control de filtrado por estado de afectación dentro de la traza de trámites.
- **FR-006**: La traza de trámites DEBE ser estrictamente de lectura e informativa sin permitir modificaciones de saldos desde esta vista.
- **FR-007**: Todas las interfaces DEBEN cumplir con `DESIGN.md` (sin emojis, iconos SVG Lucide, tipografía Inter/font-mono para identificadores, colores institucional UMSS `#003770` y `#001B47`).

### Key Entities

- **PartidaConcreta**: Partida presupuestaria asignada a un proyecto de investigación o programa.
- **Tramite**: Solicitud de adquisición o contratación iniciada en el sistema.
- **ItemTramite**: Ítem individual dentro de un trámite que afecta el saldo de una partida concreta.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Los usuarios pueden consultar la traza de trámites de cualquier partida en menos de 1 segundo al hacer clic.
- **SC-002**: El 100% de los trámites listados exhiben correctamente su estado de afectación e importe.
- **SC-003**: Cero confusión entre órdenes anuladas y compras efectivas gracias al distintivo visual de reversión.

## Assumptions

- Cada ítem de trámite se encuentra correctamente vinculado a una partida concreta.
- La traza consume datos de lectura de Supabase / Mocks interactivos en cliente.
