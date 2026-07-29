# API Contract: Registro de Acta de Recepción de Materiales

**Feature**: `011-acta-recepcion-materiales`
**Date**: 2026-07-29

## Service Contract (`services/recepcionService.ts`)

### 1. `obtenerDatosRecepcionTramite(tramiteId: number)`

Consulta los datos del trámite, proyecto, orden de compra y lista de materiales adjudicados desde Supabase.

```typescript
export interface MaterialRecepcionItem {
  idItemTramite: number;
  nroItem: number;
  detalle: string;
  especificacion?: string;
  cantidad: number;
  unidad: string;
  precioTotal: number;
  estadoMaterial: "Excelente" | "Bueno" | "Con Observación";
}

export interface RecepcionProveedorData {
  ordenId?: number;
  tramiteId: number;
  proveedorId: number;
  proveedorNombre: string;
  proveedorNit: string;
  numeroOrdenCompra: string;
  proyectoNombre: string;
  unidadSolicitante: string;
  nombreCoordinador: string;
  nombreRepProveedor: string;
  nombreRepBienes: string;
  facturaUrl?: string;
  evidenciaUrl?: string;
  observaciones?: string;
  tipoActa: "PENDIENTE" | "PROVISIONAL" | "DEFINITIVA";
  materiales: MaterialRecepcionItem[];
}
```

---

### 2. `guardarActaRecepcion(params)`

Guarda el acta provisional o definitiva en Supabase y registra la auditoría.

```typescript
export interface GuardarActaParams {
  tramiteId: number;
  proveedorId: number;
  ordenId?: number;
  tipoActa: "PROVISIONAL" | "DEFINITIVA";
  nombreCoordinador: string;
  nombreRepProveedor: string;
  nombreRepBienes: string;
  facturaUrl?: string;
  evidenciaUrl?: string;
  observaciones?: string;
  materiales: Array<{
    idItemTramite: number;
    cantidadRecibida: number;
    estadoMaterial: string;
  }>;
  usuarioId?: number;
}

export async function guardarActaRecepcion(
  params: GuardarActaParams
): Promise<{ success: boolean; idActa?: number; error?: string }>;
```
