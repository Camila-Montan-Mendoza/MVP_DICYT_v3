# Data Model: Revisión Inicial por Compras

**Feature**: `005-revision-inicial-compras`  
**Created**: 2026-07-28

## Entities & Interfaces

### 1. `TramiteSolicitudDetalle`

Represents the request data rendered in Tarea 2.

```typescript
export interface TramiteSolicitudDetalle {
  id: number;
  nro: string;
  codigoSeguimiento: string;
  proyecto: string;
  tipoTramite: string;
  categoria: "ACTIVO_FIJO" | "MATERIAL" | "SERVICIO" | "OTROS";
  fecha: string;
  creador: string;
  justificacion: string;
  custodioNombre?: string;
  custodioUbicacion?: string;
  items: Array<{
    id: number;
    descripcion: string;
    especificacion?: string;
    cantidad: number;
    precioUnitario: number;
    total: number;
  }>;
}
```

### 2. `TransicionEjecucionPayload`

Payload submitted when Grover executes an approval or observation.

```typescript
export interface TransicionEjecucionPayload {
  idTramite: number;
  idTransicion: number;
  observaciones?: string;
  usuarioId: number;
}
```
