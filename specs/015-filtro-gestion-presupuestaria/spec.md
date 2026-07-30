# Feature Specification: Filtro y Selector de Gestión Presupuestaria para la Consulta de Gastos

**Feature Branch**: `015-filtro-gestion-presupuestaria`

**Created**: 2026-07-30

**Status**: Draft

**Input**: User description: "Filtro y Selector de Gestión Presupuestaria para la Consulta de Gastos. Yo como Coordinador de Programa o Investigador Principal quiero seleccionar la Gestión presupuestaria (Ej: 2026, 2025, o 'Histórico Global del Proyecto/Programa') mediante un selector en el encabezado del módulo para filtrar visualmente los montos ejecutados, saldos y gráficos de un año fiscal específico o el acumulado plurianual del proyecto."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Filtrado por Gestión Anual Específica (Priority: P1)

Como Coordinador de Programa o Investigador Principal, quiero seleccionar un año fiscal específico (ej: 2026 o 2025) en el selector de la cabecera del módulo para consultar únicamente la ejecución presupuestaria, partidas concretas y gráficos del año fiscal elegido.

**Mockup**: ![User Story 1 Mockup](mockups/hu1-filtro-gestion-anual.png)

**Why this priority**: Es la funcionalidad principal requerida para la discriminación de saldos por año fiscal. Permite el control presupuestario de la gestión vigente sin mezclar asignaciones de años anteriores.

**Independent Test**: Seleccionar una gestión específica (ej: 2026) y verificar que el Presupuesto Vigente Total, el gráfico Donut de ejecución, la barra de gasto por partida y el desglose de partidas muestren únicamente cifras del año 2026.

**Acceptance Scenarios**:

1. **Given** un usuario autenticado en el módulo de Seguimiento de Gastos, **When** abre el módulo, **Then** el selector de Gestión carga por defecto la gestión fiscal activa (ej: 2026).
2. **Given** el selector de Gestión con la opción "2026" seleccionada, **When** el usuario cambia la selección a "2025", **Then** todas las tarjetas de resumen, gráficos Donut, barras por partida y listas de partidas se recalculan en tiempo real mostrando los datos correspondientes a 2025.
3. **Given** una selección de gestión activa (ej: 2025), **When** el usuario conmuta de ámbito entre "Programa" y "Proyectos", **Then** el filtro de gestión permanece constante sin reiniciarse.

---

### User Story 2 - Consulta del Histórico Global Plurianual (Priority: P2)

Como Coordinador de Programa o Investigador Principal, quiero seleccionar la opción "Histórico Global" en el selector de Gestión para visualizar la suma acumulada de los fondos asignados y ejecutados a lo largo de toda la vida útil del proyecto o programa.

**Mockup**: ![User Story 2 Mockup](mockups/hu2-historico-global-plurianual.png)

**Why this priority**: Permite evaluar el impacto financiero total plurianual de proyectos de investigación que abarcan múltiples gestiones fiscales.

**Independent Test**: Seleccionar "Histórico Global" en la cabecera y comprobar que los totales presupuestarios equivalgan a la suma consolidada de todas las gestiones registradas en `presupuesto_gestion`.

**Acceptance Scenarios**:

1. **Given** el módulo de Seguimiento de Gastos, **When** el usuario selecciona "Histórico Global", **Then** los montos vigentes y ejecutados de las tarjetas y gráficos consolidan la suma total acumulada de todas las gestiones del proyecto/programa.
2. **Given** la vista en modo "Histórico Global", **When** se consultan las partidas concretas, **Then** los valores de cada partida reflejan el acumulado histórico desde el inicio del proyecto.

---

### User Story 3 - Distinción Visual entre Saldos Acumulables y Saldos Vencidos (Priority: P3)

Como Coordinador de Programa, quiero identificar claramente mediante indicadores visuales cuáles presupuestos de gestiones anteriores corresponden a fondos plurianuales acumulables vs. programas con gestiones cerradas ("saldos vencidos/caducados").

**Mockup**: ![User Story 3 Mockup](mockups/hu3-distincion-saldos-vencidos.png)

**Why this priority**: Evita confusiones administrativas entre partidas de gasto corriente anual vencido y proyectos de investigación con recursos IDH/Convenios plurianuales.

**Independent Test**: Cambiar la gestión a un año anterior (ej: 2025) en un Programa de Apoyo e inspeccionar que las tarjetas muestren la etiqueta visual de "Gestión Cerrada / Saldo Vencido".

**Acceptance Scenarios**:

1. **Given** un Programa de Apoyo con asignación anual vencida (ej: gestión 2025), **When** el usuario selecciona dicha gestión en el filtro, **Then** el sistema despliega un distintivo visual informativo indicando "Gestión Cerrada / Recursos Vencidos".
2. **Given** un Proyecto de Investigación con fondos acumulables, **When** el usuario selecciona el Histórico Global, **Then** el sistema muestra la insignia de "Fondo Plurianual Acumulado".

---

### Edge Cases

- **Proyectos o Programas sin asignación en la gestión seleccionada**: El sistema muestra un estado informativo limpio en la vista de partidas indicando "Sin asignación presupuestaria registrada para la gestión [Año]".
- **Proyectos de reciente creación**: Si un proyecto solo tiene registros para la gestión 2026, seleccionar gestiones previas muestra los indicadores en cero sin provocar fallos en los gráficos.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: El sistema DEBE proveer un selector desplegable de Gestión Presupuestaria en el encabezado principal del módulo de Seguimiento de Gastos.
- **FR-002**: El selector DEBE listar las gestiones fiscales disponibles en la tabla `presupuesto_gestion` (ej: 2026, 2025) más la opción consolidada "Histórico Global".
- **FR-003**: Por defecto, el sistema DEBE cargar la gestión fiscal actualmente activa (año en curso).
- **FR-004**: Al cambiar el año fiscal seleccionado, el sistema DEBE recalcular dinámicamente en tiempo real los datos presentados en:
  - Panel de Ejecución Presupuestaria (Vigente Total, Preventivo, Comprometido, Gastado, Disponible).
  - Gráfico Donut SVG de ejecución.
  - Gráfico de barras de gasto por partida concreta.
  - Lista de desgloses de partidas de proyectos/programas.
- **FR-005**: Al seleccionar "Histórico Global", el sistema DEBE consolidar la suma acumulada de todas las gestiones fiscales del proyecto o programa.
- **FR-006**: El sistema DEBE mantener la selección del filtro de gestión constante al conmutar entre los ámbitos de "Programa" y "Proyectos".
- **FR-007**: El sistema DEBE incluir indicadores visuales (insignias tipo badge) para diferenciar programas con gestiones cerradas ("Saldo Vencido") de proyectos con recursos acumulables.
- **FR-008**: Todas las intervenciones de interfaz DEBEN cumplir estrictamente con `DESIGN.md` (Minimalist Wizard UI pattern, uso de iconos SVG Lucide, cero emojis, colores institucional UMSS `#003770` y `#001B47`).

### Key Entities

- **PresupuestoGestion**: Representa el presupuesto aprobado para un proyecto en un año fiscal específico.
  - Atributos clave: `id`, `id_proyecto`, `gestion` (ej: 2026), `presupuesto`, `observaciones`.
- **Proyecto**: Entidad del proyecto de investigación que agrupa múltiples gestiones presupuestarias.
  - Atributos clave: `id`, `nombre`, `codigo`, `presupuesto`, `fecha_inicio`, `fecha_fin`.
- **Programa**: Estructura programática institucional que consolida subprogramas y proyectos.
  - Atributos clave: `id`, `nombre`, `sigla`, `presupuesto`.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Los usuarios pueden filtrar y visualizar la ejecución presupuestaria de cualquier gestión fiscal seleccionada en menos de 1 segundo.
- **SC-002**: El 100% de las tarjetas de resumen y gráficos del módulo se actualizan de forma consistente al cambiar el filtro de gestión.
- **SC-003**: Cero inconsistencias contables entre los datos presentados en la vista anual vs. el acumulado en la opción "Histórico Global".
- **SC-004**: El 95% de los coordinadores e investigadores identifican correctamente el estado del saldo (vigente vs. vencido) al consultar gestiones pasadas.

## Assumptions

- La tabla `presupuesto_gestion` contiene los registros históricos por año fiscal para los proyectos del sistema.
- La gestión fiscal actual por defecto corresponde al año 2026.
- El filtrado de gestión se realiza como un refresco de estado en cliente con datos sincronizados desde Supabase.
