# Phase 0: Research - Lista de Proyectos por Rol

## 1. Punto de aplicación del alcance por rol (CA-1)

### Decision

El alcance de datos (proyectos propios vs. todos los proyectos) se calcula **dentro del Route Handler `GET /api/proyectos`**, resolviendo el usuario y su rol activo a partir de la sesión Supabase del request (cookies), nunca a partir de un parámetro `rol` enviado por el cliente.

### Rationale

- Es un control de seguridad, no solo de UX: si el filtrado por rol se hiciera en el cliente (como hace hoy `useTrazaTramites`), cualquier usuario podría alterar la query o inspeccionar la respuesta de red y ver proyectos de otros investigadores.
- Reutiliza el mismo patrón de resolución de usuario que ya existe en `app/api/tramites/[id]/transicion/route.ts` (Supabase Auth → tabla `usuario` → fallback por `LOGIN_OPTIONS`), pero factorizado en un helper reusable (`lib/auth/server-auth-service.ts`) para no duplicar esa lógica en cada endpoint nuevo.

### Alternatives considered

- **Filtrar en el cliente tras traer todos los proyectos**: rechazado por fuga de datos entre roles y porque no escala (viola SC-001 con catálogos grandes).
- **Pasar el rol como query param**: rechazado porque un parámetro controlado por el cliente no es una fuente de verdad válida para RBAC.

---

## 2. Catálogo de estados de la memoria de cálculo (FR-007)

### Decision

Los 4 estados de esta HU ("Pendiente de memoria de cálculo", "En revisión de memoria de cálculo", "Observado", "Habilitado para ejecutar partidas") se modelan como filas del catálogo existente `estado_proyecto` (reutilizando la FK `proyecto.id_estado_proyecto` que ya existe en el esquema), reemplazando las 4 filas genéricas de ciclo de vida (`En Formulación`, `Aprobado y Activo`, `En Cierre`, `Concluido`) que no se usan hoy en ninguna vista ni lógica del código.

### Rationale

- `proyecto.id_estado_proyecto` ya es una FK 1:1 lista para usarse; no requiere cambios de esquema (`ALTER TABLE`), solo un seed actualizado.
- Se verificó que ningún componente de UI ni servicio referencia los nombres actuales del catálogo (`En Formulación`, etc.) fuera de los scripts de seed — el reemplazo es seguro.
- Evita introducir una segunda columna/tabla paralela para lo que, en esta HU, es solo una etiqueta de estado a mostrar (el flujo de aprobación/observación de la memoria de cálculo en sí es HU-B, fuera de alcance).

### Alternatives considered

- **Nueva columna `id_estado_memoria_calculo` en `proyecto`**: rechazada por sobre-ingeniería para una HU que es únicamente de visualización; se puede introducir más adelante si HU-B necesita modelar el flujo completo con `paso_flujo`/`historial_tarea_tramite` sin romper esta HU (la FK seguiría siendo `estado_proyecto`, solo cambiaría cómo se escribe).
- **Tabla `memoria_calculo` dedicada con su propio estado**: rechazada por ser trabajo de HU-B, no de esta especificación.

---

## 3. Prohibición de datos mock / fallback estático

### Decision

Ni el Route Handler ni el repositorio (`lib/db/proyecto-repository.ts`) incluyen arreglos de respaldo. Ante error de Supabase o ausencia de filas, la respuesta es `{ proyectos: [], total: 0 }` (o un error HTTP explícito 5xx si la consulta falla), y la UI distingue "sin proyectos" de "sin coincidencias de filtro" (FR-010/FR-011) en vez de rellenar con datos falsos.

### Rationale

- Instrucción explícita del usuario en esta sesión ("toda la implementación sin datos mockeados") y mandato directo del Principio VI de la constitución ("Fail-Fast Database Renders").
- El proyecto ya tiene un antipatrón existente que **no** debe repetirse: `src/features/seguimiento-partidas/api/fetchTrazaTramites.ts` retorna `FALLBACK_TRAZA_PARTIDAS` (un arreglo mock hardcodeado) cuando la consulta a Supabase falla o está vacía. Esta HU se implementa deliberadamente sin ese patrón.

### Alternatives considered

- **Reutilizar el patrón de fallback de `seguimiento-partidas` para consistencia**: rechazado explícitamente; es el antipatrón que se debe evitar, no imitar.

---

## 4. Componentes ShadCN faltantes

### Decision

Añadir `table`, `select` y `pagination` vía `npx shadcn add table select pagination` antes de construir `ProyectosTable`, `ProyectosFilters` y la paginación. `badge`, `input`, `button`, `card` ya existen en `components/ui/`.

### Rationale

- `DESIGN.md` exige que toda variante de tabla/selección/paginación se herede de ShadCN UI mapeado a `globals.css`, no HTML crudo (`<table>`/`<select>` nativos).
- Ningún componente actual del repo cubre tabla, select o paginación; construirlos a mano duplicaría lo que el CLI de ShadCN ya resuelve con los tokens correctos.

### Alternatives considered

- **HTML nativo estilizado con Tailwind**: rechazado por violar la directriz de uniformidad de componentes ShadCN de `DESIGN.md`.

---

## 5. Paginación de la lista

### Decision

Paginación en el servidor usando `.range()` de Supabase dentro de `listProyectosParaUsuario`, replicando el patrón "Mostrando 1-4 de N" visto en los mockups, con controles Anterior/Siguiente.

### Rationale

- Evita traer catálogos completos al cliente cuando Administrador/Responsable de Presupuestos ven "todos los proyectos del sistema" (potencialmente cientos), cumpliendo SC-001.
- `count: "exact"` de `@supabase/supabase-js` permite obtener el total sin una segunda query manual.

### Alternatives considered

- **Traer todo y paginar en cliente**: rechazado por costo de red/render cuando el alcance es "todos los proyectos" (Administrador/Responsable de Presupuestos).

---

## 6. Investigador Principal mostrado por proyecto

### Decision

Se obtiene mediante `proyecto_usuario` filtrado por `id_rol = 1` (Investigador Principal) unido a `usuario`; si existiera más de una fila para el mismo proyecto, se usa la primera devuelta por la consulta (orden por `id_usuario` ascendente).

### Rationale

- Coincide con la Assumption ya documentada en `spec.md` y con el modelo relacional existente (`proyecto_usuario` es muchos-a-muchos con rol explícito), sin requerir cambios de esquema.

### Alternatives considered

- **Columna denormalizada `proyecto.id_investigador_principal`**: rechazada por duplicar información que ya vive en `proyecto_usuario` y por requerir migración de esquema fuera del alcance de esta HU.
