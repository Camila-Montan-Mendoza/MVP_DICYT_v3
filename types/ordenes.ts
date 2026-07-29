export type TipoDocumentoContractual = "ORDEN_COMPRA" | "ORDEN_SERVICIO" | "CONTRATO";
export type EstadoOrdenContractual = "PENDIENTE_EMISION" | "EMITIDO" | "REGISTRADO";

export interface ItemOrdenContractual {
  idItemTramite: number;
  nroItem: number;
  detalle: string;
  especificacion?: string;
  marcaModelo?: string;
  cantidad: number;
  unidad: string;
  precioUnitario: number;
  subtotal: number;
}

export interface OrdenContractualData {
  id?: number;
  tramiteId: number;
  proveedorId: number;
  proveedorNombre: string;
  proveedorNit: string;
  proveedorTelefono?: string;
  proveedorDireccion?: string;
  proyectoNombre: string;
  proyectoCodigo?: string;
  tipoDocumento: TipoDocumentoContractual;
  numeroCorrelativo?: string;
  fechaEmision: string; // ISO String
  diasEntrega: number;
  fechaLimiteEntrega: string; // Formato DD/MM/YYYY o YYYY-MM-DD
  montoTotal: number;
  montoLiteral: string;
  estado: EstadoOrdenContractual;
  pdfContratoUrl?: string;
  items: ItemOrdenContractual[];
}

export interface EmitirOrdenParams {
  tramiteId: number;
  ordenId?: number;
  proveedorId: number;
  tipoDocumento: TipoDocumentoContractual;
  diasEntrega: number;
  fechaLimiteEntrega: string;
  montoTotal: number;
  montoLiteral: string;
  numeroCorrelativo?: string;
  pdfContratoUrl?: string;
  items: Array<{
    idItemTramite: number;
    cantidad: number;
    unidad: string;
    detalle: string;
    precioUnitario: number;
    subtotal: number;
  }>;
  usuarioId?: number;
}
