# Feature Specification: Visualización del Detalle de Proyecto y su Memoria de Cálculo

**Feature Branch**: `019-detalle-proyecto`

**Created**: 2026-07-31

**Status**: Draft

**Input**: User description: "Visualizar detalle de proyecto. Como Investigador Principal, Administrador de la DICYT o Responsable de Presupuestos, quiero ver el detalle de un proyecto junto con su memoria de cálculo (tabla de partidas), con las acciones habilitadas según mi rol y el estado del proyecto, para conocer la información completa del proyecto y saber si me corresponde hacer algo en ese momento. El detalle de un proyecto siempre incluye su memoria de cálculo (tabla de partidas); no son pantallas separadas. El Administrador siempre visualiza en modo solo lectura. El Investigador Principal ve, si el estado es 'Pendiente de memoria de cálculo' u 'Observado', un mensaje con un botón 'Detallar memoria de cálculo' que lleva a otra HU. El Responsable de Presupuestos, si el estado es 'En revisión de memoria de cálculo', puede evaluar (aprobar/observar) usando la funcionalidad ya definida en HU-B; si el estado es 'Habilitado para ejecutar partidas', solo visualiza. Esta HU es de visualización: la edición del detalle de partidas y aprobar/observar viven en otras HU."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Ver el detalle general del proyecto y su memoria de cálculo (Priority: P1)

Como Investigador Principal, Administrador de la DICyT o Responsable de Presupuestos, quiero ver en una sola pantalla la información general de un proyecto (nombre, investigador principal, presupuesto total, programa, fuente de financiamiento, fechas y estado) junto con la tabla de partidas de su memoria de cálculo, para conocer de un vistazo toda la información relevante del proyecto sin navegar entre pantallas separadas.

**Mockup**: ![Mockup HU1 - Detalle de proyecto](mockups/hu1-detalle-proyecto.png)

**Why this priority**: Es la funcionalidad base de la que dependen las demás; sin la información general y la memoria de cálculo visibles no hay nada sobre lo que mostrar mensajes o acciones adicionales.

**Independent Test**: Abrir el detalle de un proyecto con cualquiera de los tres roles y verificar que se muestran nombre, investigador principal, presupuesto total, programa, fuente de financiamiento, fechas de inicio/fin, etiqueta de estado, y la tabla de partidas de la memoria de cálculo con su monto asignado y el total consolidado.

**Acceptance Scenarios**:

1. **Given** un usuario autorizado (investigador principal del proyecto, Administrador de la DICyT o Responsable de Presupuestos), **When** abre el detalle de un proyecto, **Then** se muestran nombre del proyecto, investigador principal, presupuesto total, programa, fuente de financiamiento, fecha de inicio, fecha de fin y la etiqueta de estado actual.
2. **Given** cualquier estado del proyecto, **When** se abre su detalle, **Then** se muestra la tabla de partidas de la memoria de cálculo (partida y monto asignado), independientemente del estado.

---

### User Story 2 - Acceder a detallar la memoria de cálculo pendiente u observada (Priority: P2)

Como Investigador Principal, quiero ver un mensaje y un botón "Detallar memoria de cálculo" sobre la tabla de partidas cuando mi proyecto está "Pendiente de memoria de cálculo" u "Observado", para saber que me corresponde actuar y poder ir directo a completarla o corregirla.

**Mockup**: ![Mockup HU2 - Mensaje detallar memoria de cálculo](mockups/hu2-mensaje-detallar.png)

**Why this priority**: Es la señal principal de acción para el rol que más frecuentemente debe intervenir sobre la memoria de cálculo, pero depende de que la vista base (HU1) ya exista.

**Independent Test**: Abrir, como Investigador Principal, el detalle de un proyecto propio en estado "Pendiente de memoria de cálculo" y verificar que aparece el mensaje y el botón "Detallar memoria de cálculo"; repetir con un proyecto en estado "Observado" y verificar lo mismo; verificar que el mensaje y el botón no aparecen para otros roles ni en otros estados.

**Acceptance Scenarios**:

1. **Given** un Investigador Principal viendo el detalle de su proyecto en estado "Pendiente de memoria de cálculo" u "Observado", **When** la pantalla se renderiza, **Then** se muestra sobre la tabla de partidas un mensaje indicando que debe detallar la memoria de cálculo junto con un botón "Detallar memoria de cálculo".
2. **Given** el mismo proyecto, **When** el usuario hace clic en "Detallar memoria de cálculo", **Then** el sistema navega a la pantalla correspondiente para completar/corregir la memoria de cálculo (fuera del alcance de esta HU).
3. **Given** un Administrador de la DICyT, un Responsable de Presupuestos, o un proyecto en cualquier otro estado, **When** se abre el detalle, **Then** el mensaje y el botón "Detallar memoria de cálculo" no se muestran.

---

### User Story 3 - Acceder a evaluar la memoria de cálculo en revisión (Priority: P2)

Como Responsable de Presupuestos, quiero ver la opción de evaluar (aprobar/observar) la memoria de cálculo cuando el proyecto está "En revisión de memoria de cálculo", para saber que me corresponde tomar una decisión sobre ese proyecto en ese momento.

**Mockup**: ![Mockup HU3 - Opción de evaluación](mockups/hu3-opcion-evaluacion.png)

**Why this priority**: Habilita al segundo rol con responsabilidad de acción sobre la memoria de cálculo; depende de la vista base (HU1).

**Independent Test**: Abrir, como Responsable de Presupuestos, el detalle de un proyecto en estado "En revisión de memoria de cálculo" y verificar que se muestra la opción de evaluar; abrir un proyecto en estado "Habilitado para ejecutar partidas" y verificar que dicha opción no aparece.

**Acceptance Scenarios**:

1. **Given** un Responsable de Presupuestos viendo un proyecto en estado "En revisión de memoria de cálculo", **When** la pantalla se renderiza, **Then** se muestra la opción de evaluar (aprobar/observar) sobre la memoria de cálculo.
2. **Given** el mismo rol viendo un proyecto en estado "Habilitado para ejecutar partidas", **When** la pantalla se renderiza, **Then** únicamente se visualiza la memoria de cálculo, sin opción de evaluar.

---

### User Story 4 - Ver el proyecto en modo estrictamente solo lectura cuando no corresponde ninguna acción (Priority: P3)

Como Administrador de la DICyT, o como cualquier rol frente a un proyecto ya "Habilitado para ejecutar partidas", quiero ver el detalle y la memoria de cálculo sin ningún botón de edición o evaluación, para tener claro que en ese momento no hay ninguna acción pendiente de mi parte sobre esa pantalla.

**Mockup**: ![Mockup HU4 - Modo solo lectura](mockups/hu4-modo-solo-lectura.png)

**Why this priority**: Es una garantía de consistencia sobre las historias anteriores más que una funcionalidad nueva; mejora la claridad pero no bloquea el uso principal de la pantalla.

**Independent Test**: Abrir, como Administrador de la DICyT, el detalle de un proyecto en cualquier estado y verificar que no aparece ningún botón de edición ni de evaluación; abrir, con cualquier rol, un proyecto en estado "Habilitado para ejecutar partidas" y verificar lo mismo.

**Acceptance Scenarios**:

1. **Given** un Administrador de la DICyT viendo el detalle de cualquier proyecto, **When** la pantalla se renderiza, **Then** no se muestra ningún botón de edición de la memoria de cálculo ni de evaluación (aprobar/observar).
2. **Given** cualquier rol autorizado viendo un proyecto en estado "Habilitado para ejecutar partidas", **When** la pantalla se renderiza, **Then** no se muestra ningún botón de edición ni de evaluación sobre la memoria de cálculo.

---

### Edge Cases

- **Usuario sin autorización**: Si un usuario intenta acceder al detalle de un proyecto donde no es investigador principal, ni tiene rol Administrador de la DICyT o Responsable de Presupuestos, el sistema deniega el acceso con un mensaje claro, sin revelar información del proyecto.
- **Investigador de Apoyo u otro rol secundario en el proyecto**: Un usuario asociado al proyecto con un rol distinto a investigador principal (por ejemplo, Investigador de Apoyo) no tiene acceso a esta pantalla para ese proyecto.
- **Proyecto sin partidas registradas en su memoria de cálculo**: Se muestra un estado vacío claro en la sección de memoria de cálculo en lugar de una tabla en blanco.
- **Proyecto sin fuente de financiamiento o programa asociado completamente cargado**: Los campos correspondientes muestran un indicador de "No especificado" en vez de romper el renderizado de la pantalla.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: El sistema DEBE mostrar en el detalle del proyecto: nombre del proyecto, investigador principal, presupuesto total, programa, fuente de financiamiento, fecha de inicio, fecha de fin y una etiqueta visual del estado actual.
- **FR-002**: El sistema DEBE mostrar siempre, en la misma pantalla de detalle, la tabla de partidas de la memoria de cálculo (partida, monto asignado) y su total consolidado, independientemente del estado del proyecto.
- **FR-003**: El sistema DEBE mostrar, únicamente cuando el usuario es el Investigador Principal del proyecto y el estado es "Pendiente de memoria de cálculo" u "Observado", un mensaje indicando que debe detallar la memoria de cálculo junto con un botón "Detallar memoria de cálculo" que navega a la funcionalidad de edición (fuera de esta HU).
- **FR-004**: El sistema NO DEBE mostrar el mensaje ni el botón "Detallar memoria de cálculo" a otros roles ni en otros estados del proyecto.
- **FR-005**: El sistema DEBE mostrar, únicamente cuando el usuario es Responsable de Presupuestos y el estado es "En revisión de memoria de cálculo", la opción de evaluar (aprobar/observar) la memoria de cálculo, reutilizando la funcionalidad ya definida en HU-B.
- **FR-006**: El sistema DEBE presentar la pantalla en modo estrictamente de solo lectura (sin botones de edición ni de evaluación sobre la memoria de cálculo) cuando el usuario es Administrador de la DICyT, independientemente del estado del proyecto.
- **FR-007**: El sistema DEBE presentar la pantalla en modo estrictamente de solo lectura para cualquier rol cuando el estado del proyecto es "Habilitado para ejecutar partidas".
- **FR-008**: El sistema DEBE restringir el acceso a esta pantalla exclusivamente al investigador principal del proyecto, al Administrador de la DICyT y al Responsable de Presupuestos, denegando el acceso a cualquier otro usuario.
- **FR-009**: Esta funcionalidad es exclusivamente de visualización y navegación; el sistema NO DEBE incluir en esta HU la edición del detalle de partidas ni la acción de aprobar/observar (cubiertas en otras HU).
- **FR-010**: Todas las vistas de esta funcionalidad DEBEN cumplir estrictamente con `DESIGN.md` (paleta institucional UMSS, componentes ShadCN UI reales del proyecto ya existentes, íconos SVG `lucide-react`, cero emojis).

### Key Entities

- **Proyecto**: Proyecto de investigación sujeto a seguimiento. Atributos clave para esta HU: `nombre`, `presupuesto` (total), `fecha_inicio`, `fecha_fin`, `estado`, `programa`, `investigador principal`.
- **Programa**: Estructura programática a la que pertenece el proyecto, asociada a una fuente de financiamiento a través de su convenio.
- **FuenteFinanciamiento**: Origen de los recursos del programa/proyecto (por ejemplo, Recursos Propios IDH, ASDI, ARES).
- **PartidaConcreta (Memoria de Cálculo)**: Cada fila de la memoria de cálculo del proyecto; representa una partida presupuestaria concreta con su monto asignado.
- **ProyectoUsuario**: Relación entre el proyecto y sus usuarios asociados con su rol (usada para determinar quién es el investigador principal y el control de acceso de esta HU).

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Los usuarios encuentran toda la información general y la memoria de cálculo de un proyecto en una sola pantalla, sin necesidad de navegar a otra vista.
- **SC-002**: El 100% de los usuarios sin autorización sobre un proyecto son bloqueados al intentar acceder a su detalle.
- **SC-003**: El 100% de los Investigadores Principales con un proyecto Pendiente u Observado ven el mensaje y el botón para detallar su memoria de cálculo en menos de 2 segundos tras abrir la pantalla.
- **SC-004**: Cero botones de edición o evaluación visibles en pantallas que deben ser estrictamente de solo lectura (Administrador en cualquier estado; cualquier rol cuando el proyecto está Habilitado para ejecutar partidas).

## Assumptions

- El acceso a esta pantalla se realiza desde la Lista de Proyectos (HU de visualización de proyectos), donde ya existe la navegación al detalle de un proyecto específico.
- La funcionalidad de "Detallar memoria de cálculo" (edición de partidas) y la de "Evaluar" (aprobar/observar, HU-B) son HUs ya definidas o a definir por separado; esta especificación solo cubre el punto de entrada visual hacia ellas, no su implementación.
- Un proyecto tiene un único investigador principal reconocido para efectos de control de acceso, consistente con la HU de Lista de Proyectos.
- La fuente de financiamiento mostrada es la asociada al convenio del programa del proyecto.
