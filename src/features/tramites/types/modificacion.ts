export interface MovimientoPartidaItem {
  id: string;
  partidaId: number;
  codigo: string;
  descripcion: string;
  saldoActual: number;
  monto: number;
  tipo: "QUITAR" | "AUMENTAR";
}

export type EstadoModificacion = "PENDIENTE" | "APROBADO" | "OBSERVADO";

export interface ModificacionPresupuestaria {
  id: string;
  codigoTramite: string;
  proyectoId: number;
  proyectoNombre: string;
  proyectoCodigo: string;
  solicitanteId: number;
  solicitanteNombre: string;
  fecha: string;
  estado: EstadoModificacion;
  totalQuitado: number;
  totalAumentado: number;
  balance: number;
  partidasAfectadas: MovimientoPartidaItem[];
  partidasBeneficiadas: MovimientoPartidaItem[];
  justificacionCodigos: string;
  justificacionTexto: string;
  fechaAprobacion?: string | null;
}

export interface CrearModificacionPayload {
  proyectoId: number;
  proyectoNombre?: string;
  proyectoCodigo?: string;
  solicitanteNombre?: string;
  partidasAfectadas: MovimientoPartidaItem[];
  partidasBeneficiadas: MovimientoPartidaItem[];
  justificacionTexto: string;
}
