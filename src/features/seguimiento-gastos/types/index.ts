export interface DashboardMetrics {
  presupuestoVigenteTotal: number;
  preventivoReservado: number;
  comprometido: number;
  gastadoDevengado: number;
  saldoDisponibleGlobal: number;
}

export interface PartidaConcretaSummary {
  id: number;
  codigoPartida: number;
  nombrePartida: string;
  presupuestoAsignado: number;
  presupuestoEjecutado: number;
  presupuestoDisponible: number;
  gestion?: number;
}

export interface SubprogramaSummary {
  id: number;
  nombre: string;
  sigla: string;
  codigoClasificador: string;
  presupuestoVigente: number;
  ejecutadoVisual: number;
  saldoDisponible: number;
  gestion?: number;
}

export interface ProgramaSummary {
  id: number;
  nombre: string;
  sigla: string;
  codigoClasificador: string;
  presupuestoVigente: number;
  ejecutadoVisual: number;
  saldoDisponible: number;
  subprogramas: SubprogramaSummary[];
  gestion?: number;
  isCerrada?: boolean;
}

export interface ProyectoSummary {
  id: number;
  id_programa?: number;
  nombre: string;
  codigoSisin: string;
  gestion: number;
  presupuestoVigente: number;
  ejecutado: number;
  saldoDisponible: number;
  porcentajeAvance: number;
  partidas: PartidaConcretaSummary[];
  isPlurianual?: boolean;
}

export interface UserRoleScope {
  isCoordinador: boolean;
  isInvestigadorOrTutor: boolean;
  isMultiRole: boolean;
  activeScope: 'programa' | 'proyectos';
}
