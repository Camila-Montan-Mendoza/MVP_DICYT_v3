export type ItemCategoria = "MATERIAL" | "ACTIVO_FIJO" | "SERVICIO";

export type EstadoTramite = "BORRADOR" | "ENVIADO" | "CON_ERRORES";

export interface ItemSolicitud {
  id: string;
  nombre: string;
  categoria: ItemCategoria;
  cantidad?: number;
  unidad?: string;
  precioUnitario?: number;
  precioReferencial: number; // Calculado (cantidad * precioUnitario) o directo en Servicio
  detalleServicio?: string;
  partidaPresupuestaria: string; // ej. "34110" o "Pendiente de asignación"
  documentotecnicoPath?: string;
  documentotecnicoNombre?: string;
}

export interface ArchivoRespaldo {
  id: string;
  nombre: string;
  path: string;
}

export interface TramiteSolicitud {
  id: string;
  codigoSeguimiento?: string;
  categoria: ItemCategoria;
  estado: EstadoTramite;
  justificacion: string;
  archivosRespaldo: ArchivoRespaldo[];
  custodioNombre?: string; // Requerido si categoria === 'ACTIVO_FIJO'
  custodioUbicacion?: string; // Requerido si categoria === 'ACTIVO_FIJO'
  items: ItemSolicitud[];
  erroresValidacion?: string[];
  fechaCreacion: string;
  fechaEnvio?: string;
}

export interface EnvioLoteResultado {
  tramitesExitosos: Array<{ id: string; codigoSeguimiento: string; categoria: ItemCategoria }>;
  tramitesFallidos: Array<{ id: string; categoria: ItemCategoria; errores: string[] }>;
}
