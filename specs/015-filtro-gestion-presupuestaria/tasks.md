# Tasks: Filtro y Selector de Gestión Presupuestaria para la Consulta de Gastos

**Input**: Design documents from `/specs/015-filtro-gestion-presupuestaria/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests Policy**: MVP de validación rápida. Pruebas unitarias bien puntuales únicamente para el cálculo del filtro de gestión en `metrics-calculator.ts`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g. US1, US2, US3)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Inicialización del entorno del filtro de gestión.

- [x] T001 Inicializar documentación de la característica en `specs/015-filtro-gestion-presupuestaria/tasks.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestructura y definiciones de tipo requeridas para las historias de usuario.

- [x] T002 Actualizar las interfaces en `src/features/seguimiento-gastos/types/index.ts` para incluir `selectedGestion` y `availableGestiones`
- [x] T003 Actualizar el calculador de métricas en `src/features/seguimiento-gastos/utils/metrics-calculator.ts` para soportar filtrado por año fiscal y consolidado histórico

---

## Phase 3: User Story 1 - Filtrado por Gestión Anual Específica (Priority: P1) 🎯 MVP

**Goal**: Permitir seleccionar un año fiscal específico (ej: 2026, 2025) y recalcular en tiempo real todas las tarjetas y gráficos del módulo.

**Independent Test**: Seleccionar 2025 en la cabecera y comprobar que los totales del panel de ejecución y desgloses muestren únicamente los fondos de 2025.

### Implementation for User Story 1

- [x] T004 [US1] Añadir estado `selectedGestion` y lógica de filtrado por año fiscal en `src/features/seguimiento-gastos/hooks/useDashboardSeguimiento.ts`
- [x] T005 [US1] Agregar el selector de Gestión compacto con icono `Calendar` en la cabecera de `app/(dashboard)/seguimiento-gastos/page.tsx`
- [x] T006 [P] [US1] Crear prueba unitaria puntual para el cálculo por gestión en `src/features/seguimiento-gastos/utils/metrics-calculator.test.ts`

---

## Phase 4: User Story 2 - Consulta del Histórico Global Plurianual (Priority: P2)

**Goal**: Permitir la selección de "Histórico Global" para acumular el presupuesto consolidado de todas las gestiones del proyecto/programa.

**Independent Test**: Seleccionar "Histórico Global" y verificar que el presupuesto total sea la suma consolidada de todas las gestiones.

### Implementation for User Story 2

- [x] T007 [US2] Implementar la lógica de consolidación plurianual en `src/features/seguimiento-gastos/hooks/useDashboardSeguimiento.ts`
- [x] T008 [US2] Actualizar `src/features/seguimiento-gastos/components/PresupuestoExecutionPanel.tsx` para reflejar totales acumulados al seleccionar el histórico global

---

## Phase 5: User Story 3 - Distinción Visual entre Saldos Acumulables y Saldos Vencidos (Priority: P3)

**Goal**: Desplegar insignias visuales (badges) diferenciando gestiones cerradas ("Saldo Vencido") vs fondos de investigación acumulables.

**Independent Test**: Seleccionar 2025 en un Programa de Apoyo e inspeccionar el distintivo visual "Gestión Cerrada / Saldo Vencido".

### Implementation for User Story 3

- [x] T009 [US3] Agregar insignias de estado de gestión en `src/features/seguimiento-gastos/components/ProgramaViewSection.tsx`
- [x] T010 [US3] Agregar distintivos de saldos históricos acumulables en `src/features/seguimiento-gastos/components/ProyectoViewSection.tsx`

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verificación final y limpieza.

- [x] T011 Ejecutar validación de guía rápida en `specs/015-filtro-gestion-presupuestaria/quickstart.md`
- [x] T012 Verificar compilación de TypeScript mediante `npx tsc --noEmit`

---

## Dependencies & Execution Order

- **Phase 1 (Setup)** → **Phase 2 (Foundational)** → **Phase 3 (US1 - MVP)** → **Phase 4 (US2)** → **Phase 5 (US3)** → **Phase 6 (Polish)**.
