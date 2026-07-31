export type EstadoProyectoId = 1 | 2 | 3 | 4;

export interface EstadoProyectoInfo {
  id: EstadoProyectoId;
  nombre: string;
}

export interface InvestigadorPrincipalInfo {
  id: number;
  nombre: string;
}

export interface ProyectoListItem {
  id: number;
  numero: number;
  nombre: string;
  codigo: string;
  presupuesto: number;
  estado: EstadoProyectoInfo;
  investigadorPrincipal: InvestigadorPrincipalInfo | null;
}

export type RolActivoScope = "own" | "all";

export interface ProyectosListFilters {
  q?: string;
  estadoId?: EstadoProyectoId;
  investigadorId?: number;
  page?: number;
  pageSize?: number;
}

export interface ProyectosListResponse {
  proyectos: ProyectoListItem[];
  total: number;
  page: number;
  pageSize: number;
  scope: RolActivoScope;
}

export interface ProyectosApiErrorResponse {
  message: string;
}
