export type TipoActaRecepcion = "PROVISIONAL" | "DEFINITIVA";
export type EstadoMaterial = "Excelente" | "Bueno" | "Con Observación";

export interface MaterialRecepcionItem {
  idItemTramite: number;
  nroItem: number;
  detalle: string;
  especificacion?: string;
  cantidad: number;
  unidad: string;
  precioTotal: number;
  estadoMaterial: EstadoMaterial;
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
  tipoActa: "PENDIENTE" | TipoActaRecepcion;
  materiales: MaterialRecepcionItem[];
}

export interface GuardarActaParams {
  tramiteId: number;
  proveedorId: number;
  ordenId?: number;
  tipoActa: TipoActaRecepcion;
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
