# Quickstart: Validación del Detalle de Proyecto y su Memoria de Cálculo

## Prerrequisitos

- Servidor de desarrollo corriendo: `npm run dev`.
- Seed aplicado incluyendo la columna `partida.nombre` (ver [data-model.md](data-model.md#4-partida-existente-partida--con-columna-nueva-nombre)) y los estados variados de la HU 018.
- Usuarios de acceso rápido: `daniel` (Investigador Principal de los proyectos 1 y 3), `alan` (Resp. de Presupuestos), `eva` (Administradora DICyT).

## Escenario 1 — Información general y memoria de cálculo siempre visibles (CA-1, CA-2)

1. Desde `/proyectos`, con cualquier rol, hacer clic en un proyecto (o navegar directo a `/proyectos/{id}`).
2. Verificar que se muestran nombre, investigador principal, presupuesto total, programa, fuente de financiamiento, fechas de inicio/fin y la etiqueta de estado.
3. Verificar que la tabla de memoria de cálculo (partida, monto) y su total consolidado aparecen sin necesidad de ninguna acción adicional, sin importar el estado del proyecto.

## Escenario 2 — Mensaje y botón "Detallar memoria de cálculo" (CA-3)

1. Iniciar sesión como `daniel` y abrir el proyecto 1 (estado "Pendiente de memoria de cálculo").
2. Verificar que aparece el mensaje y el botón "Detallar memoria de cálculo" sobre la tabla de partidas.
3. Repetir con el proyecto 3 (estado "Observado") y verificar lo mismo.
4. Iniciar sesión como `eva` o `alan` y abrir cualquier proyecto: verificar que el mensaje/botón nunca aparece para estos roles.

## Escenario 3 — Opción de evaluar (CA-4)

1. Iniciar sesión como `alan` (Resp. de Presupuestos) y abrir el proyecto 4 (estado "En revisión de memoria de cálculo").
2. Verificar que se muestra la opción de evaluar (aprobar/observar).
3. Abrir el proyecto 2 (estado "Habilitado para ejecutar partidas") y verificar que la opción de evaluar no aparece.

## Escenario 4 — Solo lectura garantizada (CA-5)

1. Iniciar sesión como `eva` (Administradora DICyT) y abrir cualquier proyecto en cualquier estado: verificar que nunca aparecen botones de edición ni de evaluación.
2. Con cualquier rol, abrir el proyecto 2 (estado "Habilitado para ejecutar partidas"): verificar que no aparece ningún botón de edición ni de evaluación.

## Escenario 5 — Control de acceso (CA-6)

1. Iniciar sesión como `winsor.soliz` (Investigador de Apoyo, no principal, en el proyecto 1) e intentar abrir `/proyectos/1`: verificar que el acceso es denegado.
2. Iniciar sesión como `daniel` (IP de los proyectos 1 y 3) e intentar abrir `/proyectos/2` (donde no es investigador principal): verificar que el acceso es denegado.

## Validación del contrato de API

- `GET /api/proyectos/1` sin sesión → `401`.
- `GET /api/proyectos/1` con sesión de un investigador que no es IP de ese proyecto ni Admin/RP → `403`.
- `GET /api/proyectos/99999` (inexistente) → `404`.
- Simular una falla de Supabase → `500`, nunca un detalle de proyecto inventado.

## Pruebas unitarias (MVP)

- Función pura de banderas de permiso: casos "IP + Pendiente ⇒ puedeDetallarMemoria", "IP + Habilitado ⇒ soloLectura", "RP + En revisión ⇒ puedeEvaluar", "Administrador ⇒ soloLectura siempre".
- Control de acceso del repositorio: "IP de otro proyecto ⇒ denegado", "Admin/RP ⇒ permitido sin importar el proyecto".
