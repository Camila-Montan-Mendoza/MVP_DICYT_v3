# Data Model: Verificación Mercado Virtual SIGEP

**Feature**: `006-revision-mercado-virtual`  
**Created**: 2026-07-28

## Entities & Interfaces

### 1. `ProveedorSIGEP`

```typescript
export interface ProveedorSIGEP {
  id?: number;
  nombre: string;
  nit: string;
  unidad?: string;
  cantidadDisponible?: number;
  precioUnitario?: number;
}
```

### 2. `ItemMercadoVirtual`

```typescript
export interface ItemMercadoVirtual {
  id: number;
  descripcion: string;
  especificacion?: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
  mercadoVirtualState: "PENDIENTE" | "ENCONTRADO" | "NO_ENCONTRADO";
  proveedor?: ProveedorSIGEP;
}
```
