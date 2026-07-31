# Contract: Componente e Interfaz de la Traza de Trámites

## Props del Panel Lateral Estilo Jira (`TrazaDetailSidebar.tsx`)

```typescript
export interface TramiteItemDetail {
  id: number;
  tramiteId: number;
  codigoTramite: string;
  justificacion: string;
  fechaCreacion: string;
  estadoItem: 1 | 2 | 3 | 4; // 1: Preventivo, 2: Comprometido, 3: Pagado, 4: Revertido
  montoTotal: number;
  proveedor?: string;
}

export interface PartidaTrazaSummary {
  id: number;
  codigoPartida: number;
  nombrePartida: string;
  presupuestoAsignado: number;
  presupuestoEjecutado: number;
  presupuestoDisponible: number;
  tramites: TramiteItemDetail[];
}

export interface TrazaDetailSidebarProps {
  selectedPartida: PartidaTrazaSummary | null;
  onClose: () => void;
}
```
