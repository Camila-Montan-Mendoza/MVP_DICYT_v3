# Contract: Componente e Interfaz del Historial de Modificaciones

## Interfaces TypeScript (`types/index.ts`)

```typescript
export type TipoModificacion = 'traspaso' | 'incremento';
export type TipoImpactoPartida = 'disminucion' | 'incremento';

export interface PartidaAfectadaDetail {
  id: number;
  partidaConcretaId: number;
  codigoPartida: number;
  nombrePartida: string;
  tipoImpacto: TipoImpactoPartida;
  montoModificado: number;
  presupuestoAnterior: number;
  presupuestoNuevo: number;
}

export interface ModificacionPresupuestariaSummary {
  id: number;
  codigo: string;
  justificacion: string;
  tipoModificacion: TipoModificacion;
  fechaAprobacion: string;
  usuarioAutorizador: string;
  documentoRespaldoUrl?: string;
  montoTotalMovimiento: number;
  gestion: number;
  idProyecto?: number;
  idPrograma?: number;
  nombreProyecto?: string;
  partidasAfectadas: PartidaAfectadaDetail[];
}

export interface BitacoraDetailSidebarProps {
  modificacion: ModificacionPresupuestariaSummary | null;
  onClose: () => void;
}
```
