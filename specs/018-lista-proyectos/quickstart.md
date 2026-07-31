# Quickstart: Validación de la Lista de Proyectos por Rol

## Prerrequisitos

- Servidor de desarrollo corriendo: `npm run dev`.
- Variables de entorno de Supabase configuradas (`.env`).
- Seed de base de datos aplicado, incluyendo el catálogo `estado_proyecto` actualizado con los 4 estados de memoria de cálculo (ver [data-model.md](data-model.md#2-estadoproyecto-existente-catálogo-estado_proyecto--seed-actualizado)).
- Usuarios de acceso rápido existentes en `lib/auth/auth-service.ts` (`LOGIN_OPTIONS`): `daniel` (Investigador Principal), `alan` (Resp. de Presupuestos), `eva` (Administradora DICyT).

## Escenario 1 — Alcance por rol (CA-1, CA-2)

1. Iniciar sesión como `daniel` (Investigador Principal) y navegar a `/proyectos`.
2. Verificar que solo aparecen los proyectos donde Daniel es investigador principal (según `proyecto_usuario`), cada uno con nombre, investigador principal, presupuesto y estado visibles.
3. Cerrar sesión e iniciar como `eva` (Administradora DICyT) o `alan` (Resp. de Presupuestos).
4. Verificar que ahora aparecen **todos** los proyectos del sistema.

## Escenario 2 — Filtros combinables (CA-3)

1. Como `daniel`, escribir un término en "Buscar" y seleccionar un estado; verificar que la lista se reduce cumpliendo ambos criterios a la vez.
2. Pulsar "Limpiar filtros" y verificar que la lista vuelve al alcance completo de Daniel.
3. Como `eva` o `alan`, repetir el paso 1 agregando además el filtro por Investigador Principal; verificar que los tres filtros se combinan.
4. Verificar que el filtro por Investigador Principal **no** aparece en la vista de `daniel`.

## Escenario 3 — Etiquetas de estado (CA-4)

1. Con datos de seed que cubran los 4 estados, verificar en `/proyectos` que "Pendiente de memoria de cálculo", "En revisión de memoria de cálculo", "Observado" y "Habilitado para ejecutar partidas" usan color e ícono distintos entre sí (ver tabla en [data-model.md](data-model.md)).

## Escenario 4 — Navegación (CA-5)

1. Como `daniel`, hacer clic en un proyecto propio en estado "Pendiente de memoria de cálculo" u "Observado"; verificar que navega directo a la pantalla de completar/corregir memoria de cálculo.
2. Hacer clic en un proyecto en estado "Habilitado para ejecutar partidas"; verificar que navega a la vista de detalle general del proyecto.

## Escenario 5 — Estados vacíos (CA-6)

1. Iniciar sesión con un Investigador Principal sin proyectos asignados; verificar el mensaje de "sin proyectos".
2. Como `eva` o `alan` (con proyectos existentes), aplicar un filtro que no coincida con ningún proyecto; verificar un mensaje distinto que referencie los filtros aplicados.

## Validación del contrato de API

- `GET /api/proyectos` sin sesión → `401`.
- `GET /api/proyectos` con sesión de `daniel` y `investigadorId` de otro usuario en el query string → el parámetro se ignora, la respuesta sigue acotada a los proyectos propios de Daniel (ver [contracts/proyectos-api-contract.md](contracts/proyectos-api-contract.md)).
- Simular una falla de Supabase (ej. credenciales inválidas temporalmente) → la respuesta es `500` o `{ proyectos: [], total: 0 }`, nunca una lista de proyectos inventada.

## Pruebas unitarias (MVP)

- `buildProyectosQueryParams` / lógica de armado de filtros y alcance: casos "Investigador Principal ignora investigadorId", "Administrador combina los 3 filtros".
- `EstadoProyectoBadge`: mapeo de cada uno de los 4 `estadoId` a su color/ícono esperado.