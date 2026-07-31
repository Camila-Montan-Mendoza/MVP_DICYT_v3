# Contract: `GET /api/proyectos`

Endpoint backend (Next.js Route Handler) que sirve la lista de proyectos con alcance y filtros por rol. Consulta Supabase directamente; no hay datos mock ni fallback estático (ver [research.md](../research.md#3-prohibición-de-datos-mock--fallback-estático)).

## Autenticación y Alcance

- Requiere sesión Supabase activa (cookies de `@/utils/supabase/server`). Sin sesión válida → `401 Unauthorized`.
- El `usuarioId` y `rolActivo` se resuelven **en el servidor** a partir de la sesión; el cliente no puede indicar su propio rol.
- Alcance derivado de `rolActivo`:
  - `Investigador Principal` → `scope = "own"`: solo proyectos donde `proyecto_usuario.id_usuario = usuarioId AND proyecto_usuario.id_rol = 1`.
  - `Administradora DICyT`, `Administrador del Sistema SIGEFI`, `Resp. de Presupuestos` → `scope = "all"`: todos los proyectos.
  - Cualquier otro rol → `403 Forbidden` (esta vista no aplica a otros actores del sistema).

## Request

```
GET /api/proyectos?q=&estadoId=&investigadorId=&page=1&pageSize=10
```

| Query param      | Tipo   | Requerido                   | Notas                                                             |
| ---------------- | ------ | --------------------------- | ----------------------------------------------------------------- |
| `q`              | string | No                          | Búsqueda por `nombre` o `codigo` del proyecto (ILIKE)             |
| `estadoId`       | number | No                          | Uno de los 4 IDs de `estado_proyecto` (ver data-model.md)         |
| `investigadorId` | number | No                          | Solo tiene efecto si `scope = "all"`; ignorado si `scope = "own"` |
| `page`           | number | No (default `1`)            | 1-based                                                           |
| `pageSize`       | number | No (default `10`, máx `50`) |                                                                   |

## Response `200 OK`

```json
{
  "proyectos": [
    {
      "id": 4,
      "numero": 1,
      "nombre": "Investigación Forestal y Monitoreo de Microclimas Tropicales",
      "codigo": "SISIN-66291039",
      "presupuesto": 350000,
      "estado": { "id": 2, "nombre": "En revisión de memoria de cálculo" },
      "investigadorPrincipal": { "id": 2, "nombre": "Winsor Soliz" }
    }
  ],
  "total": 24,
  "page": 1,
  "pageSize": 10,
  "scope": "all"
}
```

## Casos de Error / Vacío

| Escenario                                                   | Respuesta                                                                                                                                                                                                                       |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sin sesión                                                  | `401 Unauthorized`, `{ "message": "No autenticado" }`                                                                                                                                                                           |
| Rol activo sin acceso a esta vista                          | `403 Forbidden`, `{ "message": "Rol sin acceso a la lista de proyectos" }`                                                                                                                                                      |
| Sin proyectos en el alcance del rol (sin filtros aplicados) | `200 OK`, `{ "proyectos": [], "total": 0, ... }` — la UI renderiza el mensaje "sin proyectos" (FR-010)                                                                                                                          |
| Filtros sin coincidencias sobre un alcance no vacío         | `200 OK`, `{ "proyectos": [], "total": 0, ... }` — la UI renderiza el mensaje "sin coincidencias de filtro" (FR-011), distinguido en el cliente porque ya conoce (de una carga previa sin filtros) que el alcance no está vacío |
| Error de Supabase (conexión, query)                         | `500 Internal Server Error`, `{ "message": "Error al consultar proyectos" }` — **nunca** un arreglo de respaldo                                                                                                                 |

## Hook consumidor: `useProyectosLista`

```typescript
export interface UseProyectosListaReturn {
  proyectos: ProyectoListItem[];
  total: number;
  page: number;
  pageSize: number;
  isLoading: boolean;
  error: string | null;

  // Filtros (los disponibles dependen del rol activo del usuario autenticado)
  search: string;
  setSearch: (value: string) => void;
  estadoId: number | "all";
  setEstadoId: (value: number | "all") => void;
  investigadorId: number | "all"; // undefined/no renderizado si el rol es Investigador Principal
  setInvestigadorId: (value: number | "all") => void;
  clearFilters: () => void; // CA-3: acción explícita de "limpiar filtros"

  setPage: (page: number) => void;

  onSelectProyecto: (proyecto: ProyectoListItem) => void; // navega a detalle o a memoria de cálculo (FR-008/FR-009)
}
```
