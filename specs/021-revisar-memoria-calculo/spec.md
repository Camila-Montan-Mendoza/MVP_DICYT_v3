# Feature Specification: Revisar Memoria de Cálculo de un Proyecto

**Feature Directory**: `specs/021-revisar-memoria-calculo`

**Created**: 2026-07-31

**Status**: Draft

**Input**: User description: "Como Responsable de Presupuestos, deseo revisar la memoria de cálculo detallada por el investigador principal de un proyecto y aprobarla u observarla, para habilitar la ejecución de partidas solo cuando el detalle presupuestario del proyecto es correcto. Aplica a proyectos en estado 'En revisión de memoria de cálculo'. Decisión de dos caminos: aprobar (pasa a 'Habilitado para ejecutar partidas') u observar (pasa a 'Observado' con motivo visible). El investigador puede corregir y reenviar devolviendo a 'En revisión de memoria de cálculo'."

---

## User Scenarios & Testing

### User Story 1 - Acceder al detalle de la memoria de cálculo en revisión (Priority: P1) 🎯 MVP

Como Responsable de Presupuestos, quiero acceder al detalle completo de la memoria de cálculo presentadas por el Investigador Principal para proyectos en estado "En revisión de memoria de cálculo", para evaluar minuciosamente cada partida asignada respecto al presupuesto total antes de tomar una decisión.

**Mockup**: ![Mockup HU1 - Detalle de memoria en revisión](mockups/hu1-memoria-en-revision.png)

**Why this priority**: Es la vista de evaluación indispensable sobre la cual el Responsable de Presupuestos debe analizar la coherencia presupuestaria.

**Independent Test**: Iniciar sesión como Responsable de Presupuestos, abrir un proyecto en estado "En revisión de memoria de cálculo" (ID 2), y verificar que se muestra la tabla de partidas con sus montos, el total consolidado, y las opciones de evaluación habilitadas.

**Acceptance Scenarios**:

1. **Given** un proyecto en estado "En revisión de memoria de cálculo", **When** el Responsable de Presupuestos ingresa a la pantalla de detalle, **Then** el sistema presenta la información general del proyecto, la tabla consolidada de partidas de la memoria de cálculo y las acciones de evaluación ("Aprobar", "Observar").
2. **Given** un proyecto en cualquier otro estado ("Pendiente", "Observado", "Habilitado"), **When** el Responsable de Presupuestos lo visualiza, **Then** las acciones de evaluación de este flujo no están activas o la pantalla se presenta en el modo correspondiente.

---

### User Story 2 - Aprobar la memoria de cálculo (Priority: P1)

Como Responsable de Presupuestos, quiero aprobar formalmente la memoria de cálculo de un proyecto cuando las partidas y montos asignados sean correctos, para habilitar el proyecto al estado "Habilitado para ejecutar partidas".

**Mockup**: ![Mockup HU2 - Aprobar memoria de cálculo](mockups/hu2-aprobar-memoria.png)

**Why this priority**: Permite completar positivamente el flujo de revisión y desbloquear la ejecución presupuestaria del proyecto.

**Independent Test**: Hacer clic en "Aprobar memoria de cálculo" en un proyecto en revisión, confirmar la acción, y verificar que el estado del proyecto se actualiza inmediatamente a "Habilitado para ejecutar partidas", registrando el usuario revisor y la fecha/hora.

**Acceptance Scenarios**:

1. **Given** un proyecto en estado "En revisión de memoria de cálculo", **When** el Responsable de Presupuestos hace clic en "Aprobar", **Then** el sistema cambia el estado del proyecto a "Habilitado para ejecutar partidas" (ID 4), registra el usuario aprobador y la fecha/hora de la acción, y congela la edición de la memoria.
2. **Given** un proyecto cuya memoria fue aprobada, **When** cualquier usuario ingresa a ver la memoria de cálculo, **Then** esta se muestra en modo estrictamente de solo lectura con un indicador visual de aprobación.

---

### User Story 3 - Observar la memoria de cálculo con motivo obligatorio (Priority: P1)

Como Responsable de Presupuestos, quiero registrar observaciones detalladas y rechazar temporalmente una memoria de cálculo incoherente o con montos incorrectos, notificando el motivo al Investigador Principal para que realice las correcciones necesarias.

**Mockup**: ![Mockup HU3 - Observar memoria de cálculo](mockups/hu3-observar-memoria.png)

**Why this priority**: Garantiza el control de calidad presupuestaria impidiendo la habilitación de proyectos con inconsistencias en sus partidas.

**Independent Test**: Intentar enviar una observación vacía y verificar que el sistema lo impide; luego ingresar un motivo explícito ("Ajustar partida 101"), confirmar la observación, y verificar que el estado pasa a "Observado" (ID 3) con el texto registrado.

**Acceptance Scenarios**:

1. **Given** un proyecto en estado "En revisión de memoria de cálculo", **When** el Responsable de Presupuestos selecciona "Observar", **Then** se despliega un formulario/modal solicitando el motivo de la observación.
2. **Given** el formulario de observación abierto, **When** el usuario intenta confirmar sin haber ingresado texto, **Then** el sistema muestra un mensaje de validación indicando que el motivo de observación es obligatorio.
3. **Given** un motivo válido ingresado, **When** se confirma la observación, **Then** el sistema actualiza el estado del proyecto a "Observado" (ID 3), guarda el historial de observaciones y muestra el banner con el motivo explícito.

---

### User Story 4 - Corrección y reenvío por el Investigador Principal (Priority: P2)

Como Investigador Principal, quiero ver el motivo de observación registrado en mi proyecto, corregir las partidas o montos señalados, y reenviar la memoria a revisión, para devolver el proyecto al estado "En revisión de memoria de cálculo".

**Mockup**: ![Mockup HU4 - Corrección y reenvío de memoria](mockups/hu4-corregir-reenviar.png)

**Why this priority**: Cierra el ciclo de retroalimentación permitiendo al Investigador subsanar las observaciones para una segunda evaluación.

**Independent Test**: Como Investigador Principal, abrir un proyecto en estado "Observado", modificar los montos o partidas de acuerdo con las observaciones, hacer clic en "Enviar a revisión", y verificar que el estado retorna a "En revisión de memoria de cálculo".

**Acceptance Scenarios**:

1. **Given** un proyecto en estado "Observado", **When** el Investigador Principal accede a la memoria de cálculo, **Then** visualiza un banner explicativo con la última observación registrada y la tabla habilitada en modo edición.
2. **Given** el proyecto corregido, **When** el Investigador Principal presiona "Enviar a revisión", **Then** el sistema valida que el presupuesto total no tenga excedentes y cambia el estado a "En revisión de memoria de cálculo" (ID 2).

---

### User Story 5 - Manejo de errores y atomicidad en la revisión (Priority: P3)

Como usuario del sistema, quiero que cualquier fallo en la comunicación con el servidor al aprobar u observar una memoria sea notificado sin alterar parcialmente los datos del proyecto.

**Why this priority**: Evita inconsistencias de datos o estados indeterminados en el sistema en caso de desconexión o fallos de base de datos.

**Acceptance Scenarios**:

1. **Given** una falla de red o error de servidor al procesar la aprobación u observación, **When** la petición falla, **Then** el sistema muestra una alerta de error clara ("Error al procesar la revisión. Intente nuevamente") y mantiene el proyecto en su estado original sin cambios parciales.

---

## Requirements

### Functional Requirements

- **FR-001**: El sistema DEBE permitir al Responsable de Presupuestos visualizar el detalle completo de la memoria de cálculo de un proyecto en estado "En revisión de memoria de cálculo".
- **FR-002**: El sistema DEBE ofrecer una acción de "Aprobar memoria de cálculo" disponible únicamente cuando el proyecto está en estado "En revisión de memoria de cálculo".
- **FR-003**: Al aprobar la memoria, el sistema DEBE actualizar de manera atómica el estado del proyecto a "Habilitado para ejecutar partidas" (ID 4) y registrar el usuario y fecha/hora de aprobación.
- **FR-004**: El sistema DEBE ofrecer una acción de "Observar memoria de cálculo" disponible únicamente cuando el proyecto está en estado "En revisión de memoria de cálculo".
- **FR-005**: Al seleccionar "Observar", el sistema DEBE exigir un texto descriptivo del motivo de observación (no vacío ni compuesto solo por espacios).
- **FR-006**: Al confirmar la observación, el sistema DEBE cambiar el estado del proyecto a "Observado" (ID 3), asociando el motivo de observación al historial del proyecto.
- **FR-007**: El sistema DEBE mostrar de forma prominente el motivo de observación cuando el Investigador Principal ingresa a un proyecto en estado "Observado".
- **FR-008**: El sistema DEBE permitir al Investigador Principal editar las partidas y montos de un proyecto en estado "Observado" y reenviarlo a revisión, cambiando el estado de retorno a "En revisión de memoria de cálculo" (ID 2).
- **FR-009**: El sistema DEBE revertir de forma limpia cualquier operación en caso de fallo técnico, notificando al usuario mediante una alerta visible sin alterar el estado previo del proyecto.
- **FR-010**: Todas las vistas del módulo DEBEN adherirse estrictamente a `DESIGN.md` (colores institucionales UMSS `#003770`, `#BC000C`, componentes shadcn/ui, íconos SVG de `lucide-react`, cero emojis).

### Key Entities

- **Proyecto**: Entidad principal. Atributos relevantes: `id`, `nombre`, `presupuestoTotal`, `estado` (`id`, `nombre`), `investigadorPrincipalId`.
- **MemoriaCalculo**: Lista de partidas asignadas al proyecto. Atributos: `id`, `codigoPartida`, `nombrePartida`, `monto`.
- **EvaluacionMemoriaCalculo**: Registro del dictamen realizado por el Responsable de Presupuestos. Atributos: `id`, `proyectoId`, `decision` (`APROBADO` | `OBSERVADO`), `motivoObservacion`, `usuarioId`, `fechaHora`.

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: El Responsable de Presupuestos puede revisar y emitir su decisión (aprobar u observar) sobre la memoria de cálculo en un flujo de menos de 3 clics desde el detalle del proyecto.
- **SC-002**: El 100% de las observaciones registradas obligan al ingreso de un motivo no vacío antes de cambiar el estado del proyecto.
- **SC-003**: Tras aprobar la memoria de cálculo, el 100% de los usuarios ven el proyecto en estado "Habilitado para ejecutar partidas" en modo solo lectura de inmediato.
- **SC-004**: Cero inconsistencias o estados parciales registrados en la base de datos tras errores simulados en la revisión.

---

## Assumptions

- La autenticación y resolución de roles (Responsable de Presupuestos e Investigador Principal) están gestionadas centralizadamente por el servicio de autenticación (`AuthProvider` / `proxy.ts`).
- La estructura de partidas presupuestarias proviene del catálogo de partidas de la DICYT.
- Un proyecto en estado "Habilitado para ejecutar partidas" es inmutable respecto a la edición inicial de su memoria de cálculo.
