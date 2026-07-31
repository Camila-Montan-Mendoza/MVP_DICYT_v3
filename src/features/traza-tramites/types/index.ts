export type TipoItemGasto = "material" | "activo_fijo" | "servicio";

export interface ItemGastoPartidaDetail {
  id: number;
  nombreItem: string;
  tipoItem: TipoItemGasto;
  montoTotal: number;
  estadoItem: 1 | 2 | 3 | 4; // 1: Preventivo, 2: Comprometido, 3: Gastado, 4: Revertido (Anulado)

  // Campos para Material y Activo Fijo
  cantidadAdquirida?: number; // Para material y activo_fijo (en caso de reversión es 0)
  fechaRecepcion?: string; // Para material y activo_fijo
  especificacion?: string; // Para material, activo_fijo, servicio
  especificacionTecnica?: string; // Especificación técnica para activo fijo

  // Campos específicos de Activo Fijo
  custodio?: string; // Para activo_fijo
  lugar?: string; // Para activo_fijo

  // Campos específicos de Servicio
  fechaConformidad?: string; // Para servicio
}

export interface PartidaTrazaSummary {
  id: number;
  codigoPartida: number;
  nombrePartida: string;
  presupuestoAsignado: number;
  presupuestoEjecutado: number;
  presupuestoDisponible: number;
  idProyecto?: number;
  idPrograma?: number;
  nombreProyecto?: string;
  codigoSisin?: string;
  items: ItemGastoPartidaDetail[];
}
