export type TipoImpactoPartida = "disminucion" | "incremento";

export interface PartidaAfectadaDetail {
  id: number;
  partidaConcretaId: number;
  codigoPartida: number;
  nombrePartida: string;
  tipoImpacto: TipoImpactoPartida;
  monto: number;
  presupuestoAnterior?: number;
  presupuestoNuevo?: number;
}

export interface ModificacionPresupuestariaSummary {
  id: number;
  codigo: string;
  justificacion: string;
  fechaSolicitud: string;
  fechaAprobacion: string;
  solicitadoPor: string;
  aprobadoPor: string;
  documentoRespaldoUrl?: string;
  gestion: number;
  idProyecto?: number;
  idPrograma?: number;
  nombreProyecto?: string;
  partidasAfectadas: PartidaAfectadaDetail[];
}
