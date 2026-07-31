# Contract: `GET /api/proyectos/[id]`

Endpoint backend (Next.js Route Handler) que sirve el detalle de un proyecto junto con su memoria de cálculo y las banderas de acción por rol/estado ya resueltas. Consulta Supabase directamente; no hay datos mock ni fallback estático.

## Autenticación y Control de Acceso (CA-6)

- Requiere sesión Supabase activa. Sin sesión válida → `401 Unauthorized`.
- Resuelve `{ usuarioId, rolActivo, scope }` igual que `GET /api/proyectos` (HU 018).
- Acceso permitido solo si:
  - `rolActivo === "Investigador Principal"` **y** el usuario figura en `proyecto_usuario` con `id_rol = 1` para *este* `id_proyecto`, o
  - `rolActivo` ∈ {"Administradora DICyT", "Administrador del Sistema SIGEFI", "Resp. de Presupuestos"} (mismo `scope === "all"` de la HU 018).
- Cualquier otro caso (incluye Investigador Principal de *otro* proyecto, o Investigador de Apoyo) → `403 Forbidden`, sin exponer datos del proyecto.
- Proyecto inexistente → `404 Not Found`.

## Request

```
GET /api/proyectos/{id}
```

| Path param | Tipo | Notas |
| ---------- | ---- | ----- |
| `id` | number | Identificador del proyecto |

## Response `200 OK`

```json
{
  "id": 4,
  "nombre": "Investigación Forestal y Monitoreo de Microclimas Tropicales",
  "presupuestoTotal": 350000,
  "programa": "Programa de Fortalecimiento a la Gestión de Investigación ASDI",
  "fuenteFinanciamiento": "Agencia Sueca de Cooperación Internacional para el Desarrollo",
  "fechaInicio": "2026-02-01",
  "fechaFin": "2026-12-31",
  "estado": { "id": 2, "nombre": "En revisión de memoria de cálculo" },
  "investigadorPrincipal": { "id": 2, "nombre": "winsor.soliz" },
  "memoriaCalculo": [
    { "id": 10, "codigoPartida": 34200, "nombrePartida": "Productos Químicos y Farmacéuticos", "monto": 70000 },
    { "id": 11, "codigoPartida": 43120, "nombrePartida": "Equipo de Computación y Periféricos", "monto": 160000 }
  ],
  "totalMemoriaCalculo": 230000,
  "permisos": {
    "puedeDetallarMemoria": false,
    "puedeEvaluar": true,
    "soloLectura": false
  }
}
```

## Casos de Error / Vacío

| Escenario | Respuesta |
| --------- | --------- |
| Sin sesión | `401 Unauthorized`, `{ "message": "No autenticado" }` |
| Usuario sin acceso a este proyecto (CA-6) | `403 Forbidden`, `{ "message": "No tiene acceso a este proyecto" }` |
| Proyecto inexistente | `404 Not Found`, `{ "message": "Proyecto no encontrado" }` |
| Proyecto sin partidas en su memoria de cálculo | `200 OK` con `"memoriaCalculo": []` y `"totalMemoriaCalculo": 0` — la UI muestra un estado vacío en la tabla, no un error |
| Programa sin convenio/fuente de financiamiento resoluble | `200 OK` con `"fuenteFinanciamiento": null` — la UI muestra "No especificado" |
| Error de Supabase (conexión, query) | `500 Internal Server Error`, `{ "message": "Error al consultar el proyecto" }` — **nunca** datos inventados |

## Hook consumidor: `useProyectoDetalle`

```typescript
export interface UseProyectoDetalleReturn {
  proyecto: ProyectoDetalle | null;
  isLoading: boolean;
  error: string | null;
  notFound: boolean;
  forbidden: boolean;
  refetch: () => Promise<void>;
}
```

El hook no recalcula `permisos`: los consume tal como llegan del servidor (ver `research.md` §3).
