export type TipoArchivoExpediente = "pdf" | "image" | "doc";

export interface ArchivoExpedienteData {
  id?: number;
  tramiteId: number;
  nombreArchivo: string;
  urlArchivo: string;
  tipoArchivo: TipoArchivoExpediente;
  tamanoFormateado: string;
  categoria?: string;
  fechaCarga?: string;
}

export interface ResumenEjecutivoTramiteData {
  tramiteId: number;
  codigoTramite: string;
  proyectoNombre: string;
  solicitanteNombre: string;
  unidadSolicitante: string;
  montoTotalTramite: number;
  proveedoresAdjudicadosCount: number;
  actasEmitidasCount: number;
  solicitudesPagoCount: number;
  fechaInicio: string;
  fechaCompletado: string;
  expedienteArchivos: ArchivoExpedienteData[];
}

export interface GuardarArchivoExpedienteParams {
  tramiteId: number;
  nombreArchivo: string;
  urlArchivo: string;
  tipoArchivo: TipoArchivoExpediente;
  tamanoBytes: number;
  categoria?: string;
  usuarioId?: number;
}
