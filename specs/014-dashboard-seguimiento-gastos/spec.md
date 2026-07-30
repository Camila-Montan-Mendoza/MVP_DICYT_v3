# Feature Specification: Dashboard Principal Adaptativo de Seguimiento de Gastos según Rol

**Feature Branch**: `014-dashboard-seguimiento-gastos`

**Created**: 2026-07-30

**Status**: Draft

**Input**: User description: "Dashboard Principal Adaptativo de Seguimiento de Gastos según Rol"

## User Scenarios & Testing _(mandatory)_

> **MVP & TESTING NOTE**: This project is an MVP for fast validation. Testing MUST be limited to essential, targeted unit tests ("pruebas unitarias bien puntuales") for key metrics calculation logic and role-based filtering.
> **DESIGN SYSTEM NOTE**: All UI user stories and components MUST strictly adhere to `DESIGN.md` (UMSS Azul `#003770`, Rojo `#BC000C`, minimalist wizard steppers, zero emojis, Lucide SVG icons only).

---

### User Story 1 - Visión Consolidada de Programa para Coordinadores (Priority: P1)

**Yo como** Coordinador General de Programa  
**Quiero** visualizar un Dashboard de seguimiento presupuestario que agregue y consolide automáticamente los fondos de mi Programa principal y Subprogramas asociados  
**Para** consultar de un solo vistazo el estado visual de los recursos, la distribución por partidas y los saldos disponibles en mi estructura programática sin realizar transacciones en esta vista.

**Mockup**: ![Mockup HU1 - Visión Programa](mockups/hu1-vision-programa-coordinador.png)

**Why this priority**: Es la vista de mayor nivel ejecutivo requerida por la DICyT para garantizar el monitoreo sin sobregiros a nivel institucional y de convenios.

**Independent Test**: Puede probarse de forma independiente autenticando como `ivan.fuentes` (Coordinador) y verificando que el Dashboard consolide las 5 tarjetas de resumen con los totales sumados del Programa 1 (PROG-ASDI-FORT) y Subprograma 2 (SUBP-AGRO).

**Acceptance Scenarios**:

1. **Dado** un usuario autenticado con el rol `Coordinador de Programa` en `programa_usuario`, **cuando** ingresa a la sección "Seguimiento de Gastos", **entonces** el sistema presenta por defecto la vista "Visión Programa" mostrando los indicadores consolidados del Programa principal y sus Subprogramas asociados (`id_programa_padre`).
2. **Dado** el Dashboard en Visión Programa, **cuando** el usuario consulta la barra de resumen, **entonces** el sistema calcula y muestra las 5 métricas clave en tarjetas informativas: Presupuesto Vigente Total, Preventivo (Reservado), Comprometido, Gastado/Devengado y Saldo Disponible Global.

---

### User Story 2 - Visión de Proyectos para Investigadores y Tutores (Priority: P2)

**Yo como** Investigador Principal o Tutor  
**Quiero** visualizar el resumen financiero de mis proyectos de investigación asignados en tarjetas de progreso  
**Para** controlar la ejecución presupuestaria de mis partidas concretas y conocer exactamente cuánto saldo me queda para la compra de insumos.

**Mockup**: ![Mockup HU2 - Visión Proyectos](mockups/hu2-vision-mis-proyectos.png)

**Why this priority**: Permite a los investigadores mantener visibilidad de sus presupuestos por proyecto y gestión fiscal activa (2025/2026).

**Independent Test**: Puede probarse autenticando como `daniel.perez` (Investigador Principal) y verificando que el Dashboard muestre sus proyectos activos con barras de progreso de avance financiero en porcentaje.

**Acceptance Scenarios**:

1. **Dado** un usuario autenticado como Investigador Principal (`daniel.perez`), **cuando** accede al Dashboard de Seguimiento de Gastos, **entonces** el sistema despliega las tarjetas informativas de sus Proyectos asignados en `proyecto_usuario`.
2. **Dado** la tarjeta de un Proyecto, **cuando** el usuario observa el indicador visual, **entonces** el sistema grafica una barra de avance financiero con porcentaje de ejecución y el detalle de saldos por partida concreta.

---

### User Story 3 - Conmutador Gráfico de Ámbito para Usuarios Multirrol (Priority: P3)

**Yo como** Usuario Multirrol (Coordinador e Investigador simultáneamente)  
**Quiero** disponer de un conmutador gráfico de ámbito ("Visión Programa" vs. "Mis Proyectos")  
**Para** alternar al instante entre la perspectiva ejecutiva global y la vista detallada de mis proyectos sin recargar la página.

**Mockup**: ![Mockup HU3 - Conmutador Multirrol](mockups/hu3-conmutador-ambito.png)

**Why this priority**: Facilita la experiencia de usuario a académicos que cumplen doble rol (gestión de programa e investigación directa).

**Independent Test**: Puede probarse cambiando el estado del conmutador toggle en la cabecera del Dashboard y verificando el cambio inmediato de la vista de datos sin recargar la página.

**Acceptance Scenarios**:

1. **Dado** un usuario con registros en ambos roles (`programa_usuario` como Coordinador y `proyecto_usuario` como Investigador), **cuando** el Dashboard carga, **entonces** el sistema habilita el conmutador de ámbito ("Visión Programa" / "Mis Proyectos").
2. **Dado** el conmutador visible, **cuando** el usuario hace clic en "Mis Proyectos", **entonces** el contenido del Dashboard se actualiza dinámicamente mostrando el listado de proyectos sin hacer una recarga completa de la página (*client-side state switch*).

---

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: El sistema MUST ser de **solo lectura** (read-only) en el Dashboard de Seguimiento de Gastos, consumiendo datos directamente de las tablas de Supabase (`programa_usuario`, `proyecto_usuario`, `programa`, `proyecto`, `presupuesto_gestion`, `partida_concreta`, `tramite` e `item_tramite`).
- **FR-002**: El sistema MUST calcular y presentar exactamente las **5 tarjetas de resumen financiero global**:
  1. **Presupuesto Vigente Total** (Monto asignado en la gestión activa).
  2. **Preventivo / Reservado** (Suma de trámites iniciados en etapas iniciales).
  3. **Comprometido** (Suma de ítems con órdenes de compra o contratos emitidos).
  4. **Gastado / Devengado** (Suma de trámites finalizados con comprobantes C31).
  5. **Saldo Disponible Global** (Vigente menos Preventivo, Comprometido y Gastado).
- **FR-003**: El sistema MUST adaptar dinámicamente el contenido del Dashboard según los roles del usuario autenticado:
  - Para Coordinadores de Programa: Agrupa métricas de Programa y Subprogramas.
  - Para Investigadores / Tutores: Muestra tarjetas individuales por Proyecto con barras de progreso.
- **FR-004**: El sistema MUST ofrecer un **conmutador gráfico de ámbito** ("Visión Programa" y "Mis Proyectos") cuando un usuario posea múltiples roles en la base de datos.
- **FR-005**: El sistema MUST desplegar dos gráficos estadísticos minimalistas sin emojis:
  - **Gráfico de Barras**: Distribución de presupuesto y gasto por Partida Concreta (34200, 39500, 43120, etc.).
  - **Gráfico Donut**: Proporción del presupuesto según estado de ejecución (Disponible, Preventivo, Comprometido, Pagado).
- **FR-006**: El sistema MUST incluir un botón de exportación rápida para generar un reporte de resumen financiero ejecutivo en formato PDF o imprimir la vista.
- **FR-007**: El sistema MUST utilizar exclusivamente **iconos vectoriales de `lucide-react`** (`BarChart3`, `PieChart`, `Wallet`, `TrendingUp`, `Building2`, `FolderGit2`, `ArrowRightLeft`, `Download`) y prohibir estrictamente el uso de emojis.
- **FR-008**: El sistema MUST renderizar estados vacíos limpios (*Fail-Fast Database Renders*) con mensajes sobrios cuando el usuario no tenga programas o proyectos asignados en Supabase.

### Key Entities

- **`programa`**: Representa la unidad programática de mayor nivel (ej: ASDI, ARES, IDH) y sus subprogramas vinculados (`id_programa_padre`).
- **`proyecto`**: Representa los proyectos de investigación vinculados a un programa y gestionados por un Investigador Principal.
- **`presupuesto_gestion`**: Registra el presupuesto asignado a un proyecto por gestión anual (ej: 2025, 2026).
- **`partida_concreta`**: Clasificador del gasto asignado a un proyecto por partida presupuestaria (ej: 34200 Reactivos, 43120 Equipos).
- **`tramite`**: Trámites de compra en curso o completados que afectan la reserva (Preventivo) o la ejecución de fondos.

---

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: El Dashboard carga y calcula los 5 indicadores de resumen financiero a partir de Supabase en menos de 1.5 segundos.
- **SC-002**: El conmutador de ámbito ("Visión Programa" vs. "Mis Proyectos") alterna la vista de tarjetas e indicadores en menos de 200 ms sin recargar la página.
- **SC-003**: El 100% de las métricas desplegadas (Vigente, Preventivo, Comprometido, Gastado, Disponible) coinciden exactamente con la suma matemática de los trámites y partidas de Supabase.
- **SC-004**: Cumplimiento del 100% de las directrices visuales de `DESIGN.md` (Azul `#003770`, Rojo `#BC000C`, cero emojis, iconos Lucide).

---

## Assumptions

- Se asume que el usuario autenticado tiene su sesión activa en Supabase Auth y su ID mapeado en la tabla `usuario`.
- Se asume que los montos de Preventivo y Comprometido se derivan del estado actual de las tareas (`tarea_paso_flujo`) de los trámites asociados a cada proyecto.
- Se asume que la exportación PDF genera una captura/impresión limpia optimizada para presentación a autoridades de la DICyT.
