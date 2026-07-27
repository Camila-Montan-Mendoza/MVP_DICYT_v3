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

export function obtenerCertificacionPartidas(items?: Array<{ partidaPresupuestaria?: string; partidaNombre?: string; precioReferencial?: number; cantidad?: number }>): PartidaPresupuestariaCheck[] {
  if (!items || items.length === 0) {
    return [
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
    ];
  }

  return items.map((it) => {
    const total = (it.precioReferencial || 1000) * (it.cantidad || 1);
    const saldo = total + 3500;
    return {
      codigo: it.partidaPresupuestaria || "34200",
      denominacion: it.partidaNombre || "Materiales y Reactivos de Laboratorio",
      montoRequerido: total,
      saldoDisponible: saldo,
      suficiente: true,
    };
  });
}

export function generarSelloPreventivo(usuarioAprobador: string = "Alan - Resp. Presupuestos"): SelloPreventivo {
  const randomSeq = Math.floor(100 + Math.random() * 900);
  return {
    correlativo: `PREV-2026-00${randomSeq}`,
    fechaEmision: new Date().toISOString(),
    usuarioAprobador,
    estado: "APROBADO",
  };
}
