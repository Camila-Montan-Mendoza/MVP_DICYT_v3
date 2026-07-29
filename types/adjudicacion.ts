export interface Proveedor {
  id: number;
  nombre: string;
  nit?: string | null;
  telefono?: string | null;
  direccion?: string | null;
}

export interface DetalleCotizacion {
  id: number;
  id_cotizacion: number;
  id_tramite_item: number;
  cantidad_existencias: number; // 0 = Sin Existencia
  precio: number; // Precio unitario cotizado
  especificacion: string;
}

export interface Cotizacion {
  id: number;
  id_tramite: number;
  id_proveedor: number;
  tiempo_entrega_dias: number;
  validez_oferta_dias?: number | null;
  proveedor?: Proveedor | null;
  detalle_cotizacion: DetalleCotizacion[];
}

export interface ItemCatalogo {
  id: number;
  nombre: string;
}

export interface ItemTramite {
  id: number;
  id_item: number;
  id_tramite: number;
  cantidad_solicitada: number;
  precio: number; // Precio Referencial Inicial
  especificacion: string;
  item?: ItemCatalogo | null;
}

export interface ItemProveedorTramite {
  id: number;
  id_item_tramite: number;
  id_proveedor: number;
  cantidad_proveida: number;
  precio: number;
}

export interface TramiteAdjudicacion {
  id: number;
  id_proyecto: number;
  id_tipo_tramite: number;
  id_estado_tramite: number;
  justificacion?: string | null;
  proyecto?: {
    id: number;
    nombre: string;
  } | null;
  usuario?: {
    id: number;
    nombre?: string;
  } | null;
  item_tramite: ItemTramite[];
  cotizacion: Cotizacion[];
  item_proveedor_tramite: ItemProveedorTramite[];
}

export interface AsignacionProveedorItem {
  idProveedor: number;
  nombreProveedor: string;
  cantidadAdjudicada: number;
  precioUnitario: number;
}

export interface EstadoAdjudicacionItem {
  idItemTramite: number;
  cantidadSolicitada: number;
  precioReferencial: number;
  asignaciones: AsignacionProveedorItem[]; // Para adjudicación dividida o simple
}
