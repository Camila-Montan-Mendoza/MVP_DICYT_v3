# Feature Specification: Consulta y Monitoreo de la Bitácora de Modificaciones Presupuestarias

**Feature Branch**: `017-bitacora-modificaciones`

**Created**: 2026-07-30

**Status**: Draft

**Input**: User description: "Consulta y Monitoreo de la Bitácora de Modificaciones Presupuestarias. Yo como Coordinador de Programa o Investigador Principal quiero consultar la bitácora visual de modificaciones presupuestarias (traspasos e incrementos de fondos) por gestión o histórico para entender visualmente cómo ha evolucionado el Presupuesto Vigente de mis partidas a lo largo del tiempo sin realizar modificaciones desde esta vista."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Histórico y Línea de Tiempo de Modificaciones (Priority: P1)

Como Coordinador de Programa o Investigador Principal, quiero consultar la lista cronológica de modificaciones presupuestarias realizadas en mi proyecto o programa para entender el origen de los cambios en los fondos.

**Mockup**: ![User Story 1 Mockup](mockups/hu1-bitacora-modificaciones.png)

**Why this priority**: Es la funcionalidad central de auditoría requerida por las autoridades y coordinadores de proyectos.

**Independent Test**: Navegar al módulo de bitácora de modificaciones y verificar que se despliegue la lista de registros con su fecha, motivo, tipo de movimiento (Traspaso / Incremento), usuario autorizador e importes modificados.

**Acceptance Scenarios**:

1. **Given** un proyecto o programa seleccionado, **When** el usuario entra a la vista de bitácora, **Then** se despliega la lista histórica de modificaciones presupuestarias aprobadas.
2. **Given** un registro de modificación, **When** el usuario hace clic en el registro, **Then** se despliega el desglose visual de las partidas de origen (-) y destino (+) con sus importes económicos exactos.

---

### User Story 2 - Filtro por Gestión Fiscal o Histórico Global (Priority: P2)

Como Coordinador de Programa, quiero alternar entre la Gestión Fiscal activa (ej. 2026) y el Histórico Global de la vida del proyecto para analizar las modificaciones por período.

**Mockup**: ![User Story 2 Mockup](mockups/hu2-filtro-gestion-bitacora.png)

**Why this priority**: Permite acotar el análisis a la gestión fiscal en curso o revisar la evolución multianual completa.

**Independent Test**: Seleccionar "Gestión 2026" y luego "Histórico Global" en la cabecera de la bitácora y comprobar que los registros se actualicen reactivamente.

**Acceptance Scenarios**:

1. **Given** el selector de gestión en la bitácora, **When** se elige un año fiscal específico, **Then** se listan únicamente los movimientos aprobados en esa gestión.
2. **Given** la opción "Histórico Global", **When** se activa, **Then** se presenta la línea de tiempo completa desde el inicio del proyecto.

---

### User Story 3 - Ventana Explicativa del Presupuesto Vigente (Priority: P3)

Como Investigador Principal, quiero consultar la fórmula explicativa del Presupuesto Vigente en cada partida (Presupuesto Inicial + Total Modificaciones = Presupuesto Vigente Resultante) para justificar los saldos actuales ante las auditorías.

**Mockup**: ![User Story 3 Mockup](mockups/hu3-desglose-presupuesto-vigente.png)

**Why this priority**: Brinda transparencia total sobre el saldo vigente de cada partida individual.

**Independent Test**: Hacer clic en el monto de "Presupuesto Vigente" de cualquier partida y verificar que se abra un tooltip/modal explicativo mostrando el desglose: Inicial + Ajustes = Vigente.

**Acceptance Scenarios**:

1. **Given** la tabla de partidas, **When** el usuario interactúa con el monto de Presupuesto Vigente, **Then** se despliega la ventana explicativa con la suma del presupuesto inicial y el impacto total de traspasos/incrementos.

---

### Edge Cases

- **Partida sin modificaciones registradas**: El desglose explicativo indica "Presupuesto Inicial = Presupuesto Vigente (Sin modificaciones registradas)".
- **Traspasos internos neutros**: Los traspasos entre partidas del mismo proyecto muestran balance neto cero (`Total Origen (-) = Total Destino (+)`).

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: El sistema DEBE proveer una vista de auditoría estrictamente de solo lectura para la bitácora de modificaciones presupuestarias.
- **FR-002**: El sistema DEBE clasificar las modificaciones en dos tipos: Traspaso entre Partidas e Incremento de Fondos.
- **FR-003**: Cada registro DEBE mostrar fecha, correlativo, motivo/justificación, usuario autorizador y la tabla visual de partidas afectadas con importes ajustados (+/-).
- **FR-004**: El sistema DEBE permitir filtrar la bitácora por Gestión Fiscal (ej. 2026, 2025) o por Histórico Global.
- **FR-005**: El sistema DEBE permitir consultar la ventana explicativa del Presupuesto Vigente por partida: `Presupuesto Inicial + Total Modificaciones = Presupuesto Vigente Resultante`.
- **FR-006**: Todas las interfaces DEBEN cumplir con `DESIGN.md` (sin emojis, iconos SVG Lucide, tipografía Inter/font-mono, colores institucional UMSS `#003770` y `#001B47`).

### Key Entities

- **BitacoraModificacionPresupuestaria**: Registro de aprobación de modificación presupuestaria.
- **DetalleModificacionPresupuestaria**: Registro individual de ajuste (+ o -) a una partida concreta dentro de una modificación.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Carga e interacción con la bitácora en menos de 1 segundo.
- **SC-002**: 100% de coherencia matemática entre Presupuesto Inicial, Modificaciones y Presupuesto Vigente.
- **SC-003**: Cero posibilidad de edición o alteración desde la vista de auditoría.

## Assumptions

- Las modificaciones presupuestarias provienen de registros de Supabase / Mocks interactivos en cliente.
