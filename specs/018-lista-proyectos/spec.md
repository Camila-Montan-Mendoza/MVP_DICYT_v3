# Feature Specification: Visualización y Filtrado de la Lista de Proyectos por Rol

**Feature Branch**: `018-lista-proyectos`

**Created**: 2026-07-31

**Status**: Draft

**Input**: User description: "Visualizar lista de proyectos. Como Investigador Principal, Administrador de la DICYT o Responsable de Presupuestos, quiero ver un listado de proyectos con su información relevante (nombre, investigador principal, presupuesto, estado) y filtros para encontrar rápidamente el que busco, para dar seguimiento a los proyectos según mi rol: los míos si soy Investigador, o todos los del sistema si soy Administrador o Responsable de Presupuestos. Es el mismo componente de lista para los tres roles, con alcance de datos y filtros disponibles controlados por rol. Estados a mostrar: Pendiente de memoria de cálculo, En revisión de memoria de cálculo, Observado, Habilitado para ejecutar partidas. Esta HU es solo de visualización y filtrado; aprobar/observar la memoria de cálculo se cubre en HU-B."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Ver la lista de proyectos según mi rol (Priority: P1)

Como Investigador Principal quiero ver únicamente los proyectos donde soy investigador principal, y como Administrador de la DICyT o Responsable de Presupuestos quiero ver todos los proyectos existentes en el sistema, cada uno mostrando su nombre, investigador principal, presupuesto total y estado actual, para tener una vista de seguimiento acorde a mi responsabilidad.

**Mockups**:
- Administrador: ![Mockup HU1 - Administrador](mockups/hu1-administrador.png)
- Responsable de Presupuestos: ![Mockup HU1 - Presupuestos](mockups/hu1-presupuestos.png)
- Investigador: ![Mockup HU1 - Investigador](mockups/hu1-investigador.png)

**Why this priority**: Es la funcionalidad base de la que dependen todas las demás; sin la lista con el alcance correcto por rol no hay nada que filtrar ni a donde navegar.

**Independent Test**: Ingresar con un usuario Investigador Principal y verificar que solo aparecen proyectos donde figura como investigador principal; ingresar con un usuario Administrador o Responsable de Presupuestos y verificar que aparecen todos los proyectos del sistema, cada fila con nombre, investigador principal, presupuesto y estado visibles.

**Acceptance Scenarios**:

1. **Given** un usuario con rol Investigador Principal autenticado, **When** abre la lista de proyectos, **Then** solo se muestran los proyectos donde dicho usuario es investigador principal.
2. **Given** un usuario con rol Administrador de la DICyT o Responsable de Presupuestos autenticado, **When** abre la lista de proyectos, **Then** se muestran todos los proyectos existentes en el sistema.
3. **Given** cualquier rol autenticado, **When** la lista de proyectos se renderiza, **Then** cada fila muestra nombre del proyecto, investigador principal, presupuesto total y etiqueta de estado.

---

### User Story 2 - Filtrar la lista para encontrar rápidamente un proyecto (Priority: P1)

Como Investigador Principal quiero filtrar por proyecto y por estado, y como Administrador de la DICyT o Responsable de Presupuestos quiero filtrar además por investigador principal, de forma combinable entre sí, para ubicar el proyecto que busco sin recorrer manualmente toda la lista.

**Mockups**:
- Administrador (filtros Buscar / Investigador / Estado): ![Mockup HU2 - Administrador](mockups/hu2-administrador.png)
- Investigador (filtros Buscar / Estado): ![Mockup HU2 - Investigador](mockups/hu2-investigador.png)

**Why this priority**: Con volúmenes crecientes de proyectos, localizar uno específico sin filtros combinables vuelve la lista inutilizable para el seguimiento diario.

**Independent Test**: Aplicar un filtro de búsqueda por nombre de proyecto junto con un filtro de estado (y, para Administrador/Responsable de Presupuestos, también por investigador principal) y verificar que la lista se reduce a los proyectos que cumplen simultáneamente todos los criterios activos.

**Acceptance Scenarios**:

1. **Given** un Investigador Principal en la lista de proyectos, **When** ingresa un término de búsqueda de proyecto y selecciona un estado, **Then** la lista muestra solo los proyectos propios que cumplen ambos criterios a la vez.
2. **Given** un Administrador o Responsable de Presupuestos en la lista de proyectos, **When** selecciona un investigador principal, un estado y un término de búsqueda, **Then** la lista muestra solo los proyectos que cumplen los tres criterios combinados.
3. **Given** uno o más filtros aplicados por cualquier rol, **When** el usuario activa la opción de limpiar filtros, **Then** todos los filtros se reinician y la lista vuelve a mostrar el alcance completo correspondiente a su rol.

---

### User Story 3 - Identificar el estado de un proyecto de un vistazo (Priority: P2)

Como usuario de cualquiera de los tres roles quiero que cada proyecto muestre una etiqueta de estado con color e ícono distintivos, para reconocer inmediatamente en qué punto del proceso se encuentra sin tener que leer el detalle.

**Mockups**:
- ![Mockup HU3 - Etiquetas de estado](mockups/hu3-etiquetas-estado.png)

**Why this priority**: Acelera el seguimiento y la priorización de proyectos, pero depende de que la lista (HU1) y sus filtros (HU2) ya existan.

**Independent Test**: Revisar una lista con proyectos en los 4 estados posibles y verificar que cada etiqueta usa una combinación única de color e ícono, distinguible entre sí sin leer el texto.

**Acceptance Scenarios**:

1. **Given** una lista de proyectos con los 4 estados posibles representados, **When** se renderiza la tabla, **Then** cada uno de los estados "Pendiente de memoria de cálculo", "En revisión de memoria de cálculo", "Observado" y "Habilitado para ejecutar partidas" se muestra con un color e ícono distinto a los demás.

---

### User Story 4 - Navegar al detalle del proyecto (Priority: P2)

Como usuario de cualquiera de los tres roles quiero hacer clic en un proyecto de la lista para ir a su vista de detalle, y como Investigador Principal quiero que, si mi proyecto está pendiente u observado, el clic me lleve directo a completar o corregir la memoria de cálculo, para actuar sin pasos intermedios innecesarios.

**Mockups**:
- ![Mockup HU4 - Navegación al detalle](mockups/hu4-navegacion-detalle.png)

**Why this priority**: Es la puerta de entrada a las acciones sobre un proyecto específico, pero solo tiene sentido una vez que la lista, los filtros y los estados visuales ya están disponibles.

**Independent Test**: Hacer clic sobre un proyecto en estado "Habilitado para ejecutar partidas" y verificar que navega a su detalle general; hacer clic, como Investigador Principal, sobre un proyecto propio en estado "Pendiente de memoria de cálculo" u "Observado" y verificar que navega directamente a la pantalla de completar/corregir la memoria de cálculo.

**Acceptance Scenarios**:

1. **Given** cualquier usuario viendo la lista, **When** hace clic en un proyecto que no está pendiente u observado, **Then** el sistema navega a la vista de detalle del proyecto.
2. **Given** un Investigador Principal viendo un proyecto propio en estado "Pendiente de memoria de cálculo" u "Observado", **When** hace clic sobre ese proyecto, **Then** el sistema navega directamente a la pantalla de completar o corregir la memoria de cálculo de ese proyecto.

---

### User Story 5 - Reconocer cuándo no hay proyectos que mostrar (Priority: P3)

Como usuario de cualquiera de los tres roles quiero recibir un mensaje claro cuando no existan proyectos en mi alcance o cuando mis filtros no encuentren coincidencias, para saber si el problema es la falta de datos o los criterios de búsqueda que apliqué.

**Mockups**:
- ![Mockup HU5 - Estado vacío](mockups/hu5-estado-vacio.png)

**Why this priority**: Mejora la claridad de la experiencia pero es el caso menos frecuente y no bloquea el uso principal de la lista.

**Independent Test**: Ingresar con un usuario sin proyectos asociados y verificar el mensaje de "sin proyectos"; luego, con un usuario que sí tiene proyectos, aplicar un filtro que no coincida con ninguno y verificar que el mensaje mostrado es distinto y hace referencia a los filtros aplicados.

**Acceptance Scenarios**:

1. **Given** un usuario cuyo alcance de rol no tiene ningún proyecto registrado, **When** abre la lista de proyectos, **Then** se muestra un mensaje indicando que no existen proyectos para mostrar.
2. **Given** un usuario con proyectos en su alcance, **When** aplica una combinación de filtros que no coincide con ningún proyecto, **Then** se muestra un mensaje indicando que no se encontraron proyectos con los filtros aplicados, distinto del mensaje de "sin proyectos".

---

### Edge Cases

- ¿Qué ocurre si un proyecto no tiene ningún investigador principal asignado en `proyecto_usuario`? El campo "Investigador Principal" se muestra vacío o con un indicador "Sin asignar", sin romper el renderizado de la fila.
- ¿Qué ocurre si un proyecto tiene más de un usuario con rol Investigador Principal? Se muestra el primero registrado como investigador principal visible en la fila (ver Assumptions).
- ¿Qué ocurre si el Investigador Principal intenta acceder al filtro por investigador principal (reservado a Administrador/Responsable de Presupuestos)? El control no se renderiza para su rol.
- ¿Qué ocurre con la paginación cuando los filtros reducen el total de resultados a menos de una página? Los controles de paginación se deshabilitan o se ocultan según corresponda.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: El sistema DEBE mostrar, para un usuario con rol Investigador Principal, únicamente los proyectos donde dicho usuario está asociado como investigador principal.
- **FR-002**: El sistema DEBE mostrar, para un usuario con rol Administrador de la DICyT o Responsable de Presupuestos, todos los proyectos existentes en el sistema.
- **FR-003**: Cada fila de la lista DEBE mostrar nombre del proyecto, investigador principal, presupuesto total y etiqueta de estado.
- **FR-004**: El sistema DEBE permitir al Investigador Principal filtrar la lista por proyecto (nombre/código) y por estado, de forma combinable entre ambos.
- **FR-005**: El sistema DEBE permitir al Administrador de la DICyT y al Responsable de Presupuestos filtrar la lista por proyecto, por estado y adicionalmente por investigador principal, de forma combinable entre los tres.
- **FR-006**: El sistema DEBE proveer, para todos los roles, una acción explícita de "limpiar filtros" que restablece la lista al alcance completo correspondiente a su rol.
- **FR-007**: El sistema DEBE representar cada uno de los 4 estados de proyecto ("Pendiente de memoria de cálculo", "En revisión de memoria de cálculo", "Observado", "Habilitado para ejecutar partidas") con una etiqueta visual de color e ícono distintos entre sí.
- **FR-008**: El sistema DEBE permitir navegar al detalle de un proyecto al hacer clic sobre su fila en la lista.
- **FR-009**: Para el Investigador Principal, si el proyecto sobre el que hace clic está en estado "Pendiente de memoria de cálculo" u "Observado", el sistema DEBE navegar directamente a la pantalla de completar o corregir la memoria de cálculo de ese proyecto en lugar de la vista de detalle genérica.
- **FR-010**: El sistema DEBE mostrar un mensaje distintivo cuando el alcance de rol del usuario no tiene ningún proyecto registrado.
- **FR-011**: El sistema DEBE mostrar un mensaje distintivo, diferente del anterior, cuando los filtros aplicados no arrojan coincidencias sobre un alcance que sí contiene proyectos.
- **FR-012**: Esta funcionalidad es exclusivamente de visualización y filtrado; el sistema NO DEBE incluir en esta HU acciones de aprobación u observación de la memoria de cálculo (cubiertas en HU-B).
- **FR-013**: Todas las vistas de esta funcionalidad DEBEN cumplir estrictamente con `DESIGN.md` (paleta institucional UMSS, componentes ShadCN UI, íconos SVG `lucide-react`, cero emojis).

### Key Entities

- **Proyecto**: Proyecto de investigación o programa de gasto corriente sujeto a seguimiento. Atributos clave: `nombre`, `codigo`, `presupuesto` (total), `estado`.
- **EstadoProyecto**: Estado del ciclo de vida de la memoria de cálculo de un proyecto. Valores relevantes a esta HU: Pendiente de memoria de cálculo, En revisión de memoria de cálculo, Observado, Habilitado para ejecutar partidas.
- **ProyectoUsuario**: Relación entre un proyecto y los usuarios asociados a él junto con su rol en dicho proyecto (por ejemplo, Investigador Principal), usada para determinar el alcance de datos del Investigador y el dato mostrado en la columna "Investigador Principal".
- **Usuario**: Persona con una cuenta en el sistema, incluyendo Investigadores Principales, Administradores de la DICyT y Responsables de Presupuestos, cuyo rol activo determina el alcance y los filtros disponibles en la lista.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Un usuario puede localizar un proyecto específico dentro de un listado de 20 o más registros usando los filtros disponibles en menos de 15 segundos.
- **SC-002**: El 100% de los proyectos mostrados a un usuario corresponden al alcance correcto de su rol (solo propios para Investigador Principal; todos para Administrador y Responsable de Presupuestos).
- **SC-003**: El 90% de los usuarios distinguen correctamente el estado de un proyecto observando únicamente el color/ícono de su etiqueta, sin necesidad de leer el texto completo.
- **SC-004**: El 100% de los clics sobre un proyecto en estado pendiente u observado, realizados por su Investigador Principal, llevan directamente a la pantalla de completar/corregir memoria de cálculo.
- **SC-005**: Aplicar la acción de limpiar filtros restaura la lista completa del alcance del rol en menos de 1 segundo.

## Assumptions

- Cada proyecto tiene un único investigador principal mostrado en la columna correspondiente; si `proyecto_usuario` registrara más de un usuario con ese rol para el mismo proyecto, se muestra el primero registrado.
- Los 4 estados de proyecto de esta HU corresponden a registros ya existentes o a crear en el catálogo `estado_proyecto`.
- La paginación de la lista sigue el patrón visto en los mockups (bloques de registros con indicador "Mostrando X-Y de Z" y navegación anterior/siguiente).
- El botón de creación de proyecto ("Cargar Proyecto") visible en el mockup de Administrador pertenece a una funcionalidad distinta y queda fuera del alcance de esta HU.
- La aprobación u observación de la memoria de cálculo, así como las acciones "Corregir"/"Adjuntar" visibles en los mockups, se cubren en HU-B y no forman parte de esta especificación.
