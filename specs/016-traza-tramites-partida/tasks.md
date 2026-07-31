# Tasks: Traza Detallada de Trámites e Impacto Presupuestario por Partida Concreta

**Input**: Design documents from `/specs/016-traza-tramites-partida/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests Policy**: MVP de validación rápida. Pruebas unitarias bien puntuales únicamente para la función de transformación de consultas relacionales a Supabase.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g. US1, US2, US3)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Inicialización y enlace de navegación lateral en el sistema.

- [x] T001 Inicializar documentación de tareas en `specs/016-traza-tramites-partida/tasks.md`
- [x] T002 Agregar el enlace de navegación lateral "Traza por Partida" con icono `FileText` en `components/sigefi-shell.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Definiciones de datos y cliente de consulta real a Supabase (sin datos mockeados).

- [x] T003 Crear interfaces TypeScript para la traza de trámites en `src/features/traza-tramites/types/index.ts`
- [x] T004 Implementar la función de consulta relacional directa a Supabase en `src/features/traza-tramites/api/fetchTrazaTramites.ts`

---

## Phase 3: User Story 1 - Despliegue de Histórico de Trámites por Partida (Priority: P1) 🎯 MVP

**Goal**: Permitir consultar la lista de partidas reales y desplegar un panel lateral estilo Jira a la derecha con los trámites asociados al hacer clic.

**Independent Test**: Navegar a la vista `/traza-tramites`, hacer clic en cualquier partida de la lista y verificar que se despliegue el sidebar lateral derecho con los trámites reales de Supabase.

### Implementation for User Story 1

- [x] T005 [US1] Crear el hook `useTrazaTramites.ts` para gestionar partidas y la traza de trámites en `src/features/traza-tramites/hooks/useTrazaTramites.ts`
- [x] T006 [US1] Crear el panel lateral deslizable estilo Jira `TrazaDetailSidebar.tsx` en `src/features/traza-tramites/components/TrazaDetailSidebar.tsx`
- [x] T007 [US1] Crear la vista de tabla/lista principal de partidas `TrazaPartidasList.tsx` en `src/features/traza-tramites/components/TrazaPartidasList.tsx`
- [x] T008 [US1] Crear la página principal en `app/(dashboard)/traza-tramites/page.tsx` integrando `<SigefiShell>`, la lista y el sidebar Jira
- [x] T009 [P] [US1] Crear prueba unitaria puntual para la transformación de consultas en `src/features/traza-tramites/api/fetchTrazaTramites.test.ts`

---

## Phase 4: User Story 2 - Identificación Visual de Trámites Revertidos (Priority: P2)

**Goal**: Destacar los trámites anulados/revertidos con insignias informativas que identifiquen la restitución de saldo.

**Independent Test**: Seleccionar un trámite con estado "Revertido" en el sidebar y verificar que exhiba la insignia distintiva de reintegro de fondos.

### Implementation for User Story 2

- [x] T010 [US2] Implementar insignias de estado y badge de reintegro para trámites revertidos en `src/features/traza-tramites/components/TrazaDetailSidebar.tsx`

---

## Phase 5: User Story 3 - Filtrado de Trámites por Estado de Gasto (Priority: P3)

**Goal**: Permitir filtrar los trámites listados en el panel lateral por su estado de afectación (Preventivo, Comprometido, Pagado, Revertido).

**Independent Test**: Aplicar el filtro "Preventivo" en el sidebar y verificar que solo se muestren los trámites en dicho estado.

### Implementation for User Story 3

- [x] T011 [US3] Agregar control de filtrado por estado de trámite en `src/features/traza-tramites/components/TrazaDetailSidebar.tsx`

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verificación y compilación final.

- [x] T012 Ejecutar validación de guía rápida en `specs/016-traza-tramites-partida/quickstart.md`
- [x] T013 Verificar compilación de TypeScript mediante `npx tsc --noEmit`

---

## Dependencies & Execution Order

- **Phase 1 (Setup)** → **Phase 2 (Foundational)** → **Phase 3 (US1 - MVP)** → **Phase 4 (US2)** → **Phase 5 (US3)** → **Phase 6 (Polish)**.
