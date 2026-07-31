# Phase 0: Research - Detalle de Proyecto y Memoria de Cálculo

## 1. Nombre legible de partida (CA-2)

### Decision
Añadir una columna `nombre VARCHAR(255)` al catálogo `partida` (hoy solo tiene `id`/`codigo`) y poblarla con el nombre real del clasificador presupuestario para los códigos ya sembrados (34200, 39500, 43120, 43400, 31100, 25600, 34110, 43110, 21600), vía `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` + `UPDATE`/seed en `docs/01_seed_catalogos_base.sql`.

### Rationale
- El mockup exige una columna "Nombre de Partida" en la memoria de cálculo; el esquema actual no tiene dónde guardarla.
- Otras features del repo (`bitacora-modificaciones`, `seguimiento-gastos`) resuelven esto hardcodeando `nombrePartida` en arreglos mock en el cliente — exactamente el antipatrón que esta HU y la 018 se comprometieron a no repetir (Principio VI).
- Es un cambio aditivo: no rompe `partida_concreta`, `item`, ni ninguna FK existente.

### Alternatives considered
- **Hardcodear un mapa código→nombre en el frontend**: rechazado por ser el mismo antipatrón ya presente en otras features; además duplicaría la fuente de verdad fuera de la base de datos.
- **Tabla catálogo aparte `partida_nombre`**: rechazada por sobre-ingeniería; una columna adicional en `partida` es suficiente y más simple.

---

## 2. Control de acceso (CA-6)

### Decision
`GET /api/proyectos/[id]` reutiliza `resolveServerAuthContext` (creado en la HU 018) para obtener `{ usuarioId, rolActivo, scope }`, y añade una verificación específica del proyecto: si `rolActivo === "Investigador Principal"`, el usuario debe además figurar en `proyecto_usuario` con `id_rol = 1` para *ese* `id_proyecto` puntual (no solo tener el rol en general). Administrador de la DICyT y Responsable de Presupuestos pasan por tener `scope === "all"`. Cualquier otro caso → `403`.

### Rationale
- Reutilizar el helper de la HU 018 evita duplicar la lógica de resolución de usuario/rol ya probada.
- La verificación adicional por proyecto es necesaria porque el `scope` de la HU 018 (`"own"` vs `"all"`) es una noción de listado; aquí se necesita "¿es investigador principal de *este* proyecto en particular?", que es más estricta.

### Alternatives considered
- **Verificar el acceso en el cliente tras traer el proyecto igual**: rechazado por ser el mismo problema de seguridad ya identificado en la HU 018 (CA-6 exige negar el acceso, no solo ocultar datos en la UI).

---

## 3. Banderas de acción por rol y estado (CA-3, CA-4, CA-5)

### Decision
El servidor calcula y devuelve banderas ya resueltas (`puedeDetallarMemoria`, `puedeEvaluar`, `soloLectura`) como parte de la respuesta de `GET /api/proyectos/[id]`, en vez de que el cliente reconstruya la regla de negocio a partir de `rolActivo` + `estado.id`. El cliente solo decide *qué* renderizar según esas banderas, no *si* el usuario tiene derecho a verlas.

### Rationale
- Evita que la regla "Investigador Principal + Pendiente/Observado" o "Responsable de Presupuestos + En revisión" quede duplicada en cliente y servidor y se desincronice.
- Es consistente con el patrón de "el servidor decide seguridad, el cliente decide presentación" ya usado en la HU 018 para el `scope`.

### Alternatives considered
- **Recalcular las banderas en el cliente a partir de `rolActivo` y `estado.id`**: rechazado porque duplicaría reglas de negocio de acceso en dos lugares; se mantiene solo como función pura reutilizable para pruebas unitarias, pero la fuente de verdad servida al cliente es la del backend.

---

## 4. Rutas de destino para "Detallar memoria de cálculo" y "Evaluar"

### Decision
- "Detallar memoria de cálculo" (CA-3) navega a `/proyectos/{id}/memoria-calculo` — la misma ruta ya calculada por `resolveProyectoNavigationTarget` en la HU 018 para el clic directo desde la lista. Ambas HUs quedan así consistentes entre sí.
- "Evaluar" (CA-4, HU-B) navega a `/proyectos/{id}/evaluar`, una ruta nueva que queda como stub (carpeta sin `page.tsx`) hasta que HU-B la implemente.

### Rationale
- Reutilizar la ruta de la HU 018 evita tener dos convenciones distintas para el mismo destino según si el usuario llegó desde la lista o desde el detalle.

### Alternatives considered
- **Inventar una ruta distinta para el botón de esta HU**: rechazada por generar inconsistencia de navegación con la HU 018.

---

## 5. Reutilización de componentes visuales de la HU 018

### Decision
`EstadoProyectoBadge` (color/ícono por estado) se importa directamente desde `src/features/proyectos-lista/components/EstadoProyectoBadge.tsx` en vez de crear una copia en `proyecto-detalle`. La tarjeta de información general y la tabla de memoria de cálculo se construyen con los mismos primitivos `components/ui/{card,table,badge,button}.tsx` ya usados por la HU 018, en modo claro (sin clases de tema oscuro `bg-background`/`border-border`/`text-muted-foreground`, según la corrección ya aplicada en `ProyectosListaContainer.tsx`).

### Rationale
- Instrucción explícita del usuario de ser fiel a la UI ya construida y de "fijarse en las otras" pantallas del sistema.
- Evita duplicar la lógica de mapeo estado→color/ícono, que ya está probada (`EstadoProyectoBadge.test.tsx`).
