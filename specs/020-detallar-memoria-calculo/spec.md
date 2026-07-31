# Feature Specification: Detallar Memoria de Cálculo de un Proyecto

**Feature Branch**: `020-detallar-memoria-calculo`

**Created**: 2026-07-31

**Status**: Draft

**Input**: User description: "Detallar Memoria de Cálculo de un Proyecto. Como Investigador Principal, deseo detallar la memoria de cálculo de mi proyecto buscando y añadiendo partidas con sus montos hasta completar mi presupuesto, sin excederlo, y enviarla a revisión, para que el Responsable de Presupuestos pueda evaluarla y habilitar la ejecución de mi proyecto. Se accede desde el detalle del proyecto mediante el botón 'Detallar memoria de cálculo', visible solo cuando el proyecto está 'Pendiente de memoria de cálculo' u 'Observado'. Buscador de partidas/ítems para añadirlas. Montos editables por partida. La suma de montos no puede superar el presupuesto total. Al enviar a revisión, el estado del proyecto cambia a 'En revisión de memoria de cálculo' y deja de ser editable hasta la decisión del Responsable de Presupuestos (HU-B)."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Buscar y añadir partidas a la memoria de cálculo (Priority: P1)

Como Investigador Principal, quiero buscar partidas por código, nombre de partida o palabra relacionada a un ítem, y añadirlas a la memoria de cálculo de mi proyecto, para armar el detalle presupuestario sin tener que conocer de memoria los códigos del clasificador.

**Mockup**: ![Mockup HU1 - Buscador y detalle de memoria de cálculo](mockups/hu1-buscador-detallar.png)

**Why this priority**: Es el punto de entrada de todo el flujo; sin poder buscar y añadir partidas no hay nada que editar ni enviar a revisión.

**Independent Test**: Desde el detalle de un proyecto propio "Pendiente de memoria de cálculo", pulsar "Detallar memoria de cálculo", buscar una partida por código y por palabra de ítem, y verificar que al seleccionarla se añade como fila nueva a la memoria de cálculo (si no estaba ya incluida).

**Acceptance Scenarios**:

1. **Given** el Investigador Principal en la pantalla de detallar memoria de cálculo, **When** escribe un código o nombre de partida en el buscador, **Then** el sistema muestra las partidas coincidentes.
2. **Given** el mismo buscador, **When** escribe una palabra relacionada a un ítem (no al código de partida), **Then** el sistema muestra la(s) partida(s) asociada(s) a ese ítem.
3. **Given** un resultado de búsqueda, **When** el investigador lo selecciona, **Then** la partida se añade como fila a la memoria de cálculo, salvo que ya estuviera incluida.

---

### User Story 2 - Editar el monto de cada partida (Priority: P1)

Como Investigador Principal, quiero editar el monto asignado a cada partida de la memoria de cálculo (ya existente o recién añadida), para distribuir mi presupuesto entre las partidas según corresponda.

**Mockup**: ![Mockup HU2 - Montos editables](mockups/hu2-montos-editables.png)

**Why this priority**: Sin montos editables la memoria de cálculo no tiene contenido presupuestario real que enviar a revisión.

**Independent Test**: Modificar el monto de una partida ya existente y el de una recién añadida, y verificar que ambos cambios se reflejan de inmediato en la fila y en el total.

**Acceptance Scenarios**:

1. **Given** una partida incluida en la memoria de cálculo, **When** el investigador edita su monto, **Then** el nuevo valor queda reflejado en esa fila.
2. **Given** el proyecto en estado "Pendiente de memoria de cálculo" u "Observado", **When** el investigador abre la pantalla, **Then** todos los montos de las partidas incluidas están habilitados para edición.

---

### User Story 3 - Validar que la memoria de cálculo no exceda el presupuesto (Priority: P1)

Como Investigador Principal, quiero ver en todo momento cuánto suman las partidas frente a mi presupuesto total, y ser bloqueado si me excedo, para corregir el detalle antes de intentar enviarlo a revisión.

**Mockup**: ![Mockup HU3 - Validación de excedente](mockups/hu3-validacion-excedente.png)

**Why this priority**: Es la regla de negocio central de la HU; garantiza que lo que llegue a revisión sea presupuestariamente válido.

**Independent Test**: Añadir/editar montos hasta superar el presupuesto total y verificar que el sistema muestra el excedente claramente y bloquea el envío a revisión; corregir el monto y verificar que el envío vuelve a habilitarse.

**Acceptance Scenarios**:

1. **Given** cualquier cambio en los montos de la memoria de cálculo, **When** la suma de partidas se recalcula, **Then** el sistema muestra en tiempo real el total de partidas frente al presupuesto total del proyecto.
2. **Given** una suma de partidas mayor al presupuesto total, **When** el investigador intenta enviar a revisión, **Then** el sistema muestra el monto excedente y no permite el envío.
3. **Given** una suma de partidas igual o menor al presupuesto total, **When** el investigador revisa la pantalla, **Then** el envío a revisión está disponible.

---

### User Story 4 - Enviar la memoria de cálculo a revisión (Priority: P1)

Como Investigador Principal, quiero enviar mi memoria de cálculo a revisión cuando la considero completa y correcta, para que el Responsable de Presupuestos pueda evaluarla y, de corresponder, habilitar la ejecución de mi proyecto.

**Mockup**: ![Mockup HU4 - Envío a revisión](mockups/hu4-envio-revision.png)

**Why this priority**: Es la acción que cierra el ciclo de esta HU y dispara el siguiente paso del flujo (HU-B); depende de que el resto de la pantalla ya funcione.

**Independent Test**: Con una memoria de cálculo dentro del presupuesto, enviar a revisión y verificar que el estado del proyecto cambia a "En revisión de memoria de cálculo" y que la pantalla deja de permitir ediciones.

**Acceptance Scenarios**:

1. **Given** una memoria de cálculo cuya suma no excede el presupuesto, **When** el investigador confirma el envío a revisión, **Then** el estado del proyecto cambia a "En revisión de memoria de cálculo".
2. **Given** el envío ya confirmado, **When** el investigador vuelve a la pantalla, **Then** las partidas y montos ya no son editables (la decisión pasa al Responsable de Presupuestos, HU-B).

---

### Edge Cases

- **Acceso fuera de estado permitido (CA-5)**: Si el proyecto no está en estado "Pendiente de memoria de cálculo" u "Observado" (por ejemplo, ya está "En revisión" o "Habilitado para ejecutar partidas"), el sistema no permite editar partidas ni montos desde esta pantalla.
- **Usuario no autorizado**: Solo el investigador principal del proyecto puede acceder a esta pantalla para ese proyecto puntual (mismo control de acceso que el detalle del proyecto).
- **Falla al guardar o enviar a revisión (CA-6)**: Si el guardado de una partida/monto o el envío a revisión falla por error de red o de base de datos, se muestra un mensaje de error claro y los cambios ya ingresados en pantalla no se pierden (el investigador puede reintentar sin volver a escribir todo).
- **Partida buscada ya incluida**: Si el investigador busca y selecciona una partida que ya está en la memoria de cálculo, el sistema no crea una fila duplicada.
- **Búsqueda sin resultados**: Si ningún código, nombre de partida o ítem coincide con el término buscado, se muestra un mensaje claro de "sin resultados".
- **Memoria de cálculo vacía al intentar enviar**: Si no se ha añadido ninguna partida, el envío a revisión no está disponible.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: El sistema DEBE mostrar, desde el detalle del proyecto, el botón "Detallar memoria de cálculo" únicamente cuando el usuario es el investigador principal del proyecto y el estado es "Pendiente de memoria de cálculo" u "Observado".
- **FR-002**: El sistema DEBE proveer un buscador que encuentre partidas por código, por nombre de partida, o por palabra relacionada al nombre de un ítem asociado a una partida.
- **FR-003**: El sistema DEBE permitir añadir una partida encontrada a la memoria de cálculo del proyecto, evitando filas duplicadas para una misma partida.
- **FR-004**: El sistema DEBE permitir editar el monto de cualquier partida incluida en la memoria de cálculo (existente o recién añadida) mientras el proyecto esté en estado "Pendiente de memoria de cálculo" u "Observado".
- **FR-005**: El sistema DEBE calcular y mostrar en tiempo real la suma de los montos de todas las partidas frente al presupuesto total del proyecto.
- **FR-006**: El sistema DEBE impedir el envío a revisión mientras la suma de montos supere el presupuesto total, mostrando claramente el monto excedente.
- **FR-007**: El sistema DEBE permitir el envío a revisión únicamente cuando la memoria de cálculo tiene al menos una partida y su suma no excede el presupuesto total.
- **FR-008**: Al confirmarse el envío a revisión, el sistema DEBE cambiar el estado del proyecto a "En revisión de memoria de cálculo" y bloquear la edición de partidas y montos para el investigador principal.
- **FR-009**: El sistema NO DEBE permitir editar partidas ni montos desde esta pantalla cuando el proyecto no está en estado "Pendiente de memoria de cálculo" u "Observado".
- **FR-010**: Ante un error de red o de base de datos al guardar una partida/monto o al enviar a revisión, el sistema DEBE mostrar un mensaje de error y conservar en pantalla los cambios ya ingresados por el investigador.
- **FR-011**: Esta funcionalidad es exclusivamente de detalle y envío a revisión; el sistema NO DEBE incluir en esta HU la evaluación (aprobar/observar), que vive en HU-B.
- **FR-012**: Todas las vistas de esta funcionalidad DEBEN cumplir estrictamente con `DESIGN.md` (paleta institucional UMSS, componentes ShadCN UI reales del proyecto, íconos SVG `lucide-react`, cero emojis).

### Key Entities

- **Proyecto**: Ver especificaciones previas de Lista/Detalle de Proyecto. Relevante aquí: `presupuesto` (total) y `estado`, que cambia a "En revisión de memoria de cálculo" al enviar.
- **PartidaConcreta (Memoria de Cálculo)**: Fila de la memoria de cálculo de un proyecto; par partida-monto. Se crea al añadir una partida encontrada; su monto es editable mientras el proyecto esté en estado editable.
- **Partida / Ítem**: Catálogo presupuestario buscable (código, nombre de partida) y sus ítems asociados (palabras de búsqueda relacionadas), usados para poblar los resultados del buscador.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Un investigador puede encontrar y añadir una partida a la memoria de cálculo en menos de 15 segundos usando el buscador.
- **SC-002**: El 100% de los intentos de envío a revisión con la suma de partidas excedida son bloqueados, mostrando el excedente exacto.
- **SC-003**: El 100% de los envíos a revisión exitosos actualizan el estado del proyecto a "En revisión de memoria de cálculo" de forma inmediata y visible.
- **SC-004**: Cero pérdidas de datos ingresados en pantalla ante un error de guardado o envío (los valores permanecen visibles para reintentar).

## Assumptions

- El acceso a esta pantalla se realiza desde el botón "Detallar memoria de cálculo" del Detalle de Proyecto (ya definido en una HU previa), que ya resuelve el control de acceso por investigador principal y por estado.
- Las partidas y sus ítems asociados usados para la búsqueda corresponden al catálogo presupuestario ya existente en el sistema (partida/ítem), sin necesidad de crear nuevas partidas desde esta HU.
- Quitar una partida ya añadida (antes de enviar a revisión) se considera parte natural de la edición habilitada por esta HU, aunque el Card no lo detalla explícitamente.
- La evaluación de la memoria de cálculo (aprobar/observar) y el paso a "Habilitado para ejecutar partidas" son responsabilidad de HU-B, fuera de este alcance.
