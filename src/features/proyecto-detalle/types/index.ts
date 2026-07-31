import { EstadoProyectoInfo, InvestigadorPrincipalInfo } from "@/src/features/proyectos-lista/types";

export interface PartidaMemoriaCalculo {
  id: number;
  codigoPartida: number;
  nombrePartida: string;
  monto: number;
}

export interface PermisosDetalleProyecto {
  puedeDetallarMemoria: boolean;
  puedeEvaluar: boolean;
  soloLectura: boolean;
}

export interface ProyectoDetalle {
  id: number;
  nombre: string;
  presupuestoTotal: number;
  programa: string;
  fuenteFinanciamiento: string | null;
  fechaInicio: string;
  fechaFin: string;
  estado: EstadoProyectoInfo;
  investigadorPrincipal: InvestigadorPrincipalInfo | null;
  memoriaCalculo: PartidaMemoriaCalculo[];
  totalMemoriaCalculo: number;
  permisos: PermisosDetalleProyecto;
}

export interface ProyectoDetalleApiErrorResponse {
  message: string;
}
