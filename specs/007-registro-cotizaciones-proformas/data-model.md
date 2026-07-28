# Data Model: Transcripción de Proformas / Cotizaciones

**Feature**: `007-registro-cotizaciones-proformas`  
**Created**: 2026-07-28

## Entities & Interfaces

### 1. `ItemProforma`

```typescript
export interface ItemProforma {
  idItem: number;
  unidad: string;
  cantidad: number;
  cantidadMaxSolicitada: number;
  detalle: string;
  precioUnitario: number;
  total: number;
  conExistencia: boolean;
  marca?: string;
  modelo?: string;
}
```

### 2. `Proforma`

```typescript
export interface Proforma {
  id?: number;
  idTramite: number;
  nit: string;
  telefono: string;
  direccion: string;
  preparadaPor: string;
  tiempoEntregaDias: number;
  tiempoGarantiaAnios: number;
  validezOfertaDias: number;
  proveedorNombre: string;
  totalBs: number;
  items: ItemProforma[];
  fechaCreacion?: string;
}
```
