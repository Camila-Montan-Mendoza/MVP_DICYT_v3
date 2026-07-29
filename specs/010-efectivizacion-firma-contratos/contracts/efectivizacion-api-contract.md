# API Contract: Efectivización y Registro de Firmas Contractuales

**Feature**: `010-efectivizacion-firma-contratos`
**Date**: 2026-07-29

## Service Contract (`services/ordenesService.ts`)

### `confirmarEfectivizacionYFirmas(params)`

Persiste el estado de las firmas (Coordinador, Director, Proveedor) y la efectivización del compromiso legal en Supabase.

```typescript
export interface ConfirmarFirmasParams {
  tramiteId: number;
  ordenesFirmas: Array<{
    ordenId?: number;
    proveedorId: number;
    firmadoCoordinador: boolean;
    firmadoDirector: boolean;
    firmadoProveedor: boolean;
  }>;
  usuarioId?: number;
}

export async function confirmarEfectivizacionYFirmas(
  params: ConfirmarFirmasParams
): Promise<{ success: boolean; error?: string }>;
```
