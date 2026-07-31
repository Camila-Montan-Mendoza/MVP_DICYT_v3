# Tasks: Consulta y Monitoreo de la Bitácora de Modificaciones Presupuestarias

**Input**: Design documents from `/specs/017-bitacora-modificaciones/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests Policy**: MVP de validación rápida. Pruebas unitarias bien puntuales únicamente para la función de cálculo de evolución de saldos vigentes por partida modificada.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g. US1, US2, US3)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Inicialización y enlace de navegación lateral en el sistema.

- [x] T001 Inicializar documentación de tareas en `specs/017-bitacora-modificaciones/tasks.md`
- [x] T002 Agregar el enlace de navegación lateral "Historial de modificaciones presupuestarias" con icono `History` en `components/sigefi-shell.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Definiciones de datos y cliente de consulta real a Supabase (con fallback resiliente).

- [x] T003 Crear interfaces TypeScript para la bitácora de modificaciones en `src/features/bitacora-modificaciones/types/index.ts`
- [x] T004 Implementar la función de consulta a Supabase en `src/features/bitacora-modificaciones/api/fetchBitacoraModificaciones.ts`

---

## Phase 3: User Story 1 - Histórico y Línea de Tiempo de Modificaciones (Priority: P1) 🎯 MVP

**Goal**: Permitir consultar la lista de modificaciones aprobadas y abrir un sidebar por la derecha al hacer clic para ver la justificación larga y la evolución de partidas afectadas.

**Independent Test**: Navegar a la vista `/modificaciones-presupuestarias`, hacer clic en cualquier modificación y comprobar la apertura del sidebar lateral con la justificación y tabla de evolución (+/-).

### Implementation for User Story 1

- [x] T005 [US1] Crear el hook `useBitacoraModificaciones.ts` para gestionar datos y selectores en `src/features/bitacora-modificaciones/hooks/useBitacoraModificaciones.ts`
- [x] T006 [US1] Crear el panel lateral deslizable estilo Jira `BitacoraDetailSidebar.tsx` en `src/features/bitacora-modificaciones/components/BitacoraDetailSidebar.tsx`
- [x] T007 [US1] Crear la vista de tabla principal de modificaciones `BitacoraModificacionesList.tsx` en `src/features/bitacora-modificaciones/components/BitacoraModificacionesList.tsx`
- [x] T008 [US1] Crear la página principal en `app/(dashboard)/modificaciones-presupuestarias/page.tsx` integrando `<SigefiShell>`, selectores (Programa, Proyecto, Gestión) y sidebar Jira
- [x] T009 [P] [US1] Crear prueba unitaria puntual para el cálculo de evolución de saldos en `src/features/bitacora-modificaciones/api/fetchBitacoraModificaciones.test.ts`

---

## Phase 4: User Story 2 - Filtro por Gestión Fiscal o Histórico Global (Priority: P2)

**Goal**: Permitir filtrar las modificaciones por gestión anual (2026, 2025) o visualizar el acumulado del Histórico Global.

**Independent Test**: Cambiar el selector de Gestión a "2026" y luego a "Histórico Global" y comprobar la actualización reactiva de la lista.

### Implementation for User Story 2

- [x] T010 [US2] Implementar el filtrado por gestión fiscal en `src/features/bitacora-modificaciones/hooks/useBitacoraModificaciones.ts`

---

## Phase 5: User Story 3 - Ventana Explicativa del Presupuesto Vigente (Priority: P3)

**Goal**: Presentar la fórmula explicativa del presupuesto vigente (`Presupuesto Anterior +/- Impacto = Presupuesto Vigente Resultante`).

**Independent Test**: Consultar una partida modificada en el sidebar y verificar la fórmula explicativa de saldos.

### Implementation for User Story 3

- [x] T011 [US3] Agregar desglose de fórmula de presupuesto resultante en `src/features/bitacora-modificaciones/components/BitacoraDetailSidebar.tsx`

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verificación y compilación final.

- [x] T012 Ejecutar validación de guía rápida en `specs/017-bitacora-modificaciones/quickstart.md`
- [x] T013 Verificar compilación de TypeScript mediante `npx tsc --noEmit`

---

## Dependencies & Execution Order

- **Phase 1 (Setup)** → **Phase 2 (Foundational)** → **Phase 3 (US1 - MVP)** → **Phase 4 (US2)** → **Phase 5 (US3)** → **Phase 6 (Polish)**.
