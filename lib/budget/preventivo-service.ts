export interface PartidaPresupuestariaCheck {
  codigo: string;
  denominacion: string;
  montoRequerido: number;
  saldoDisponible: number;
  suficiente: boolean;
}

export interface SelloPreventivo {
  correlativo: string;
  fechaEmision: string;
  usuarioAprobador: string;
  estado: "APROBADO" | "OBSERVADO";
  observaciones?: string;
}

// Sample 5-digit partida budget checks
export const MOCK_PARTIDAS_CHECK: PartidaPresupuestariaCheck[] = [
  {
    codigo: "34200",
    denominacion: "Productos Químicos y Farmacéuticos",
    montoRequerido: 1200,
    saldoDisponible: 5000,
    suficiente: true,
  },
  {
    codigo: "43120",
    denominacion: "Equipo de Computación",
    montoRequerido: 4500,
    saldoDisponible: 8000,
    suficiente: true,
  },
  {
    codigo: "25230",
    denominacion: "Auditorías Especiales y Externas",
    montoRequerido: 3000,
    saldoDisponible: 4500,
    suficiente: true,
  },
];

export function generarSelloPreventivo(usuarioAprobador: string = "Alan - Resp. Presupuestos"): SelloPreventivo {
  const randomSeq = Math.floor(100 + Math.random() * 900);
  return {
    correlativo: `PREV-2026-00${randomSeq}`,
    fechaEmision: new Date().toISOString(),
    usuarioAprobador,
    estado: "APROBADO",
  };
}
