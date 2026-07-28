# Data Model: Validación Automática de Saldos y Emisión del Sello Preventivo por Resp. Presupuestos

**Feature Branch**: `004-sello-preventivo-presupuestos`  
**Date**: 2026-07-27

---

## Entities

### `PartidaPresupuestariaCheck`

```typescript
export interface PartidaPresupuestariaCheck {
  codigo: string; // 5-digit code e.g. "34200", "43120"
  denominacion: string; // e.g. "Productos Químicos y Farmacéuticos"
  montoRequerido: number;
  saldoDisponible: number;
  suficiente: boolean;
}
```

### `SelloPreventivo`

```typescript
export interface SelloPreventivo {
  correlativo: string; // e.g. "PREV-2026-00123"
  fechaEmision: string; // e.g. "2026-01-11T09:15:00Z"
  usuarioAprobador: string; // e.g. "Alan - Resp. Presupuestos"
  estado: "APROBADO" | "OBSERVADO";
  observaciones?: string;
}
```
