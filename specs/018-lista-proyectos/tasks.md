# Tasks: Visualización y Filtrado de la Lista de Proyectos por Rol

**Input**: Design documents from `/specs/018-lista-proyectos/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests Policy**: MVP de validación rápida. Pruebas unitarias bien puntuales únicamente para: (1) la lógica de alcance/combinación de filtros del repositorio, (2) el mapeo de estado a color/ícono del badge, y (3) la función de resolución de destino de navegación. Sin pruebas E2E ni de integración pesadas.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g. US1, US2, US3, US4, US5)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Componentes ShadCN faltantes, catálogo de estados y tipos base.

- [X] T001 [P] Añadir los componentes ShadCN `table`, `select` y `pagination` (escritos a mano, sin CLI ni nuevas dependencias Radix, siguiendo el estilo de `components/ui/button.tsx`/`badge.tsx`), verificando que se crean `components/ui/table.tsx`, `components/ui/select.tsx` y `components/ui/pagination.tsx`
- [X] T002 Actualizar el catálogo `estado_proyecto` en `docs/01_seed_catalogos_base.sql` con los 4 estados de memoria de cálculo ("Pendiente de memoria de cálculo", "En revisión de memoria de cálculo", "Observado", "Habilitado para ejecutar partidas"), reemplazando las filas genéricas de ciclo de vida sin uso actual, según `research.md` §2 (también se varió `id_estado_proyecto` en `docs/03_seed_estructura_financiera.sql` para que los 4 proyectos de seed cubran los 4 estados)
- [X] T003 [P] Crear las interfaces TypeScript `ProyectoListItem`, `EstadoProyectoId`, `ProyectosListFilters` y `ProyectosListResponse` en `src/features/proyectos-lista/types/index.ts`, según `data-model.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Endpoint backend real contra Supabase con alcance por rol resuelto en servidor. Bloquea todas las historias de usuario.

**⚠️ CRITICAL**: Ninguna historia de usuario puede empezar hasta que esta fase esté completa.

- [X] T004 Crear `lib/auth/server-auth-service.ts` que resuelva `{ usuarioId, rolActivo, scope }` en el servidor a partir de la sesión Supabase (reutilizando el patrón de resolución `usuario`/`rol_usuario`/`LOGIN_OPTIONS` ya usado en `app/api/tramites/[id]/transicion/route.ts`)
- [X] T005 Extender `lib/db/proyecto-repository.ts` con `listProyectosParaUsuario(supabase, params)`: consulta real a Supabase uniendo `proyecto`, `estado_proyecto`, `proyecto_usuario` (rol Investigador Principal `id_rol = 1`) y `usuario`, aplicando alcance (`scope`), filtros `q`/`estadoId`/`investigadorId` y paginación con `.range()` + `count: "exact"`, **sin ningún arreglo de respaldo** (depends on T002, T003)
- [X] T006 Implementar `GET /api/proyectos` en `app/api/proyectos/route.ts` usando T004 y T005, devolviendo exactamente las respuestas de `contracts/proyectos-api-contract.md` (`401` sin sesión, `403` rol sin acceso, `200` con `{ proyectos, total, page, pageSize, scope }`, `500` ante error de Supabase sin fallback) (depends on T004, T005)
- [X] T007 [P] Crear el fetcher cliente `fetchProyectos` en `src/features/proyectos-lista/api/fetchProyectos.ts`, construyendo el query-string hacia `/api/proyectos` a partir de `ProyectosListFilters` (depends on T003)

**Checkpoint**: El backend está listo — `/api/proyectos` puede probarse directamente (ej. con `curl` usando una cookie de sesión válida) para cada rol antes de construir cualquier UI.

---

## Phase 3: User Story 1 - Ver la lista de proyectos según mi rol (Priority: P1) 🎯 MVP

**Goal**: Mostrar en `/proyectos` el listado con el alcance correcto por rol (propios para Investigador Principal, todos para Administrador/Resp. de Presupuestos) y las columnas nombre, investigador principal, presupuesto y estado.

**Independent Test**: Ingresar como Investigador Principal y verificar que solo aparecen sus proyectos; ingresar como Administrador o Resp. de Presupuestos y verificar que aparecen todos, con las 4 columnas visibles en cada fila.

### Implementation for User Story 1

- [X] T008 [US1] Crear el hook `useProyectosLista` (fetch inicial, estado de `page`/`pageSize`) en `src/features/proyectos-lista/hooks/useProyectosLista.ts` (depends on T007)
- [X] T009 [P] [US1] Crear `EstadoProyectoBadge` (4 variantes de color/ícono según `data-model.md`, iconos `lucide-react`, tokens de `DESIGN.md`, cero emojis) en `src/features/proyectos-lista/components/EstadoProyectoBadge.tsx`
- [X] T010 [P] [US1] Crear `ProyectosTable` (columnas N°, Proyecto, Presupuesto, Estado con `EstadoProyectoBadge`, Investigador Principal, usando ShadCN `Table`) en `src/features/proyectos-lista/components/ProyectosTable.tsx`
- [X] T011 [US1] Añadir controles de paginación ("Mostrando X-Y de Z" + Anterior/Siguiente, ShadCN `Pagination`) conectados a `page`/`total` del hook, dentro de `src/features/proyectos-lista/components/ProyectosTable.tsx` (depends on T008, T010)
- [X] T012 [US1] Crear `ProyectosListaContainer` que integra hook + tabla + paginación en `src/features/proyectos-lista/components/ProyectosListaContainer.tsx` (depends on T008, T009, T010, T011)
- [X] T013 [US1] Crear `app/(dashboard)/proyectos/page.tsx` montando `<ProyectosListaContainer />` (ruta ya enlazada en el sidebar de `components/sigefi-shell.tsx`) (depends on T012)
- [X] T014 [P] [US1] Prueba unitaria puntual del alcance por rol ("own" vs "all") en `lib/db/proyecto-repository.test.ts` (depends on T005)

**Checkpoint**: User Story 1 completamente funcional y demostrable de forma independiente — MVP.

---

## Phase 4: User Story 2 - Filtrar la lista para encontrar rápidamente un proyecto (Priority: P1)

**Goal**: Permitir filtrar por proyecto y estado (Investigador Principal) o por proyecto, estado e investigador principal (Administrador/Resp. de Presupuestos), de forma combinable, con una acción explícita de limpiar filtros.

**Independent Test**: Aplicar búsqueda + estado (y, para Administrador/Resp. de Presupuestos, también investigador) y verificar que la lista se reduce cumpliendo todos los criterios a la vez; pulsar "Limpiar filtros" y verificar que la lista vuelve al alcance completo del rol.

### Implementation for User Story 2

- [X] T015 [US2] Añadir estado `search`, `estadoId`, `investigadorId` y `clearFilters()` a `useProyectosLista`, re-consultando `/api/proyectos` con los filtros combinados en `src/features/proyectos-lista/hooks/useProyectosLista.ts` (depends on T008)
- [X] T016 [US2] Crear `ProyectosFilters` (Buscar `Input`, Estado `Select`, Investigador `Select` renderizado solo si `rolActivo !== "Investigador Principal"`, botón "Limpiar filtros") en `src/features/proyectos-lista/components/ProyectosFilters.tsx`
- [X] T017 [US2] Integrar `ProyectosFilters` sobre la tabla en `src/features/proyectos-lista/components/ProyectosListaContainer.tsx` (depends on T015, T016, T012)
- [X] T018 [P] [US2] Prueba unitaria puntual de combinación de filtros y de la regla "el `investigadorId` enviado por un Investigador Principal se ignora" en `lib/db/proyecto-repository.test.ts` (depends on T005)

**Checkpoint**: User Story 1 y 2 funcionan juntas de forma independiente.

---

## Phase 5: User Story 3 - Identificar el estado de un proyecto de un vistazo (Priority: P2)

**Goal**: Confirmar que los 4 estados se distinguen visualmente entre sí por color e ícono, sin necesidad de leer el texto.

**Independent Test**: Con datos de seed cubriendo los 4 estados, verificar que cada etiqueta usa una combinación única de color e ícono.

### Implementation for User Story 3

- [X] T019 [P] [US3] Prueba unitaria puntual que verifique que los 4 valores de `estadoId` producen combinaciones de color/ícono distintas entre sí en `src/features/proyectos-lista/components/EstadoProyectoBadge.test.tsx` (depends on T009)

**Checkpoint**: La distinción visual de estados (ya entregada en US1 vía `EstadoProyectoBadge`) queda formalmente verificada.

---

## Phase 6: User Story 4 - Navegar al detalle del proyecto (Priority: P2)

**Goal**: Al hacer clic en un proyecto, navegar a su detalle; si el usuario es Investigador Principal y su proyecto está "Pendiente de memoria de cálculo" u "Observado", navegar directo a completar/corregir la memoria de cálculo.

**Independent Test**: Clic en un proyecto en estado "Habilitado para ejecutar partidas" navega al detalle general; clic, como Investigador Principal, en un proyecto propio "Pendiente" u "Observado" navega directo a la pantalla de memoria de cálculo. (Las páginas de destino `/proyectos/[id]` y de memoria de cálculo son carpetas de ruta vacías que pertenecen a otras HUs, per `plan.md`; esta historia valida la URL/decisión de navegación, no el contenido de la página destino.)

### Implementation for User Story 4

- [X] T020 [US4] Extraer la función pura `resolveProyectoNavigationTarget(proyecto, rolActivo)` (retorna `/proyectos/{id}` o la ruta de memoria de cálculo cuando `rolActivo === "Investigador Principal"` y el estado es "Pendiente de memoria de cálculo" u "Observado") en `src/features/proyectos-lista/hooks/useProyectosLista.ts`
- [X] T021 [US4] Conectar el `onClick` de fila en `src/features/proyectos-lista/components/ProyectosTable.tsx` para invocar `onSelectProyecto` → `router.push(resolveProyectoNavigationTarget(...))` (el `onClick` de fila ya invocaba `onSelectProyecto` desde T010; el handler real con `useRouter` + `resolveProyectoNavigationTarget` se conectó en `ProyectosListaContainer.tsx`, que es quien tiene acceso al rol del usuario vía `useAuth`, y se lo pasa a `ProyectosTable` como prop)
- [X] T022 [P] [US4] Prueba unitaria puntual de `resolveProyectoNavigationTarget` cubriendo ambas ramas en `src/features/proyectos-lista/hooks/useProyectosLista.test.ts` (depends on T020)

**Checkpoint**: User Stories 1 a 4 funcionan de forma independiente.

---

## Phase 7: User Story 5 - Reconocer cuándo no hay proyectos que mostrar (Priority: P3)

**Goal**: Distinguir con un mensaje claro entre "no hay proyectos en mi alcance" y "mis filtros no encontraron coincidencias".

**Independent Test**: Usuario sin proyectos ve el mensaje de "sin proyectos"; usuario con proyectos que aplica un filtro sin coincidencias ve un mensaje distinto referido a los filtros.

### Implementation for User Story 5

- [X] T023 [US5] Crear `ProyectosEmptyState` con dos variantes ("Sin proyectos registrados" / "Sin coincidencias para los filtros aplicados", ícono `lucide-react`, sin emojis) en `src/features/proyectos-lista/components/ProyectosEmptyState.tsx`
- [X] T024 [US5] Renderizar `ProyectosEmptyState` en `src/features/proyectos-lista/components/ProyectosListaContainer.tsx` cuando `total === 0`, eligiendo la variante según si hay algún filtro activo (depends on T023, T012)

**Checkpoint**: Las 5 historias de usuario funcionan de forma independiente.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Verificación final end-to-end.

- [~] T025 (Omitida a pedido del usuario) Ejecutar los escenarios de validación manual de `specs/018-lista-proyectos/quickstart.md` con los tres roles (`daniel`, `alan`, `eva`) — pendiente de validación manual por el usuario
- [X] T026 Verificar la compilación de TypeScript con `npx tsc --noEmit`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias, puede iniciar de inmediato.
- **Foundational (Phase 2)**: depende de Setup — bloquea todas las historias de usuario.
- **User Stories (Phase 3-7)**: todas dependen de Foundational. US1 es el MVP; US2-US5 se apoyan en los componentes creados en US1 (`ProyectosListaContainer`, `ProyectosTable`, `EstadoProyectoBadge`) pero cada una agrega una capa independientemente verificable.
- **Polish (Phase 8)**: depende de que las historias que se quieran entregar estén completas.

### User Story Dependencies

- **US1 (P1)**: depende solo de Foundational.
- **US2 (P1)**: depende de Foundational + de los componentes de US1 (extiende el hook y agrega `ProyectosFilters` sobre la tabla ya existente).
- **US3 (P2)**: depende de `EstadoProyectoBadge` (creado en US1); es una verificación, no agrega UI nueva.
- **US4 (P2)**: depende de `ProyectosTable` (US1); agrega el manejador de clic.
- **US5 (P3)**: depende de `ProyectosListaContainer` (US1) y del filtrado (US2) para distinguir ambos casos de vacío.

### Parallel Opportunities

- T001 y T003 (Setup) en paralelo.
- T007 (Foundational) en paralelo una vez cerrado T003.
- Dentro de US1: T009 y T010 en paralelo; T014 en paralelo con el resto de US1 una vez T005 esté listo.
- T018 (US2), T019 (US3) y T022 (US4) son pruebas unitarias independientes entre sí, paralelizables una vez sus dependencias respectivas estén listas.

---

## Parallel Example: Foundational + User Story 1

```bash
# Setup en paralelo:
Task: "Añadir componentes ShadCN table/select/pagination"
Task: "Crear tipos TypeScript en src/features/proyectos-lista/types/index.ts"

# Dentro de User Story 1, en paralelo tras el hook base:
Task: "Crear EstadoProyectoBadge en src/features/proyectos-lista/components/EstadoProyectoBadge.tsx"
Task: "Crear ProyectosTable en src/features/proyectos-lista/components/ProyectosTable.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1 (Setup) y Phase 2 (Foundational — bloqueante).
2. Completar Phase 3 (US1).
3. Validar de forma independiente: entrar como Investigador Principal y como Administrador/Resp. de Presupuestos y confirmar el alcance y las columnas.
4. Desplegar/demostrar el MVP.

### Incremental Delivery

1. Setup + Foundational → backend real listo (`/api/proyectos` sin mocks).
2. US1 → lista con alcance por rol → **MVP**.
3. US2 → filtros combinables + limpiar filtros.
4. US3 → verificación de distinción visual de estados.
5. US4 → navegación al detalle / memoria de cálculo.
6. US5 → estados vacíos diferenciados.
7. Polish → validación de quickstart + `tsc --noEmit`.

---

## Notes

- [P] = archivos distintos, sin dependencias entre sí.
- Cero arreglos mock o fallback estático en ninguna tarea de Foundational o de las historias de usuario (Principio VI de la constitución + instrucción explícita del usuario).
- Cada historia de usuario debe quedar completable y verificable de forma independiente antes de pasar a la siguiente.
- Confirmar que las pruebas unitarias fallan antes de implementar la lógica correspondiente.