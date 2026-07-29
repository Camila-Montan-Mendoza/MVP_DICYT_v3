# API Contract: Emisión de Órdenes de Compra, Servicio y Contratos

**Feature**: `009-emision-ordenes-contratos`
**Date**: 2026-07-29

## Service Contracts (`services/ordenesService.ts`)

### 1. `obtenerOrdenesContractualesTramite(tramiteId: number)`

Consulta los datos adjudicados desde Supabase para estructurar los borradores u órdenes emitidas del trámite.

**Input**:

- `tramiteId`: `number` (ID del trámite)

**Output**: `Promise<OrdenContractualData[]>`

```typescript
export interface ItemOrdenContractual {
  idItemTramite: number;
  nroItem: number;
  detalle: string;
  especificacion?: string;
  marcaModelo?: string;
  cantidad: number;
  unidad: string;
  precioUnitario: number;
  subtotal: number;
}

export interface OrdenContractualData {
  id?: number;
  tramiteId: number;
  proveedorId: number;
  proveedorNombre: string;
  proveedorNit: string;
  proveedorTelefono?: string;
  proveedorDireccion?: string;
  proyectoNombre: string;
  proyectoCodigo?: string;
  tipoDocumento: "ORDEN_COMPRA" | "ORDEN_SERVICIO" | "CONTRATO";
  numeroCorrelativo?: string;
  fechaEmision: string; // ISO String
  diasEntrega: number;
  fechaLimiteEntrega: string; // ISO String (DD/MM/YYYY)
  montoTotal: number;
  montoLiteral: string;
  estado: "PENDIENTE_EMISION" | "EMITIDO" | "REGISTRADO";
  pdfContratoUrl?: string;
  items: ItemOrdenContractual[];
}
```

---

### 2. `emitirOrdenContractual(params)`

Guarda y emite la orden de compra/servicio o registra el contrato PDF firmado en Supabase.

**Input**:

```typescript
export interface EmitirOrdenParams {
  tramiteId: number;
  ordenId?: number;
  proveedorId: number;
  tipoDocumento: "ORDEN_COMPRA" | "ORDEN_SERVICIO" | "CONTRATO";
  diasEntrega: number;
  fechaLimiteEntrega: string;
  montoTotal: number;
  montoLiteral: string;
  pdfContratoUrl?: string;
  items: Array<{
    idItemTramite: number;
    cantidad: number;
    unidad: string;
    detalle: string;
    precioUnitario: number;
    subtotal: number;
  }>;
  usuarioId?: number;
}
```

**Output**: `Promise<{ success: boolean; numeroCorrelativo?: string; error?: string }>`
