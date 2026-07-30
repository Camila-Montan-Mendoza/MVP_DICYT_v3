import { DashboardMetrics } from '../types';

export interface RawItemGasto {
  montoTotal: number;
  estadoItem: 1 | 2 | 3 | 4; // 1: PREVENTIVO, 2: COMPROMETIDO, 3: PAGADO, 4: REVERTIDO
  gestion?: number;
}

/**
 * Calcula las 5 métricas consolidadas del Dashboard de Seguimiento de Gastos
 */
export function calculateDashboardMetrics(
  presupuestoVigenteTotal: number,
  itemsGasto: RawItemGasto[]
): DashboardMetrics {
  let preventivoReservado = 0;
  let comprometido = 0;
  let gastadoDevengado = 0;

  for (const item of itemsGasto) {
    if (item.estadoItem === 1) {
      preventivoReservado += item.montoTotal;
    } else if (item.estadoItem === 2) {
      comprometido += item.montoTotal;
    } else if (item.estadoItem === 3) {
      gastadoDevengado += item.montoTotal;
    }
  }

  const saldoDisponibleGlobal = Math.max(
    0,
    presupuestoVigenteTotal - (preventivoReservado + comprometido + gastadoDevengado)
  );

  return {
    presupuestoVigenteTotal,
    preventivoReservado,
    comprometido,
    gastadoDevengado,
    saldoDisponibleGlobal,
  };
}

/**
 * Recalcula métricas presupuestarias aplicando multiplicadores por gestión fiscal o consolidado global
 */
export function calculateMetricsByGestion(
  basePresupuesto: number,
  gestion: number | 'global'
): DashboardMetrics {
  let factor = 1.0;
  if (gestion === 2025) factor = 0.85;
  if (gestion === 'global') factor = 1.65;

  const presVigente = basePresupuesto * factor;
  const prev = presVigente * 0.15;
  const comp = presVigente * 0.20;
  const gast = presVigente * 0.25;
  const disp = Math.max(0, presVigente - (prev + comp + gast));

  return {
    presupuestoVigenteTotal: presVigente,
    preventivoReservado: prev,
    comprometido: comp,
    gastadoDevengado: gast,
    saldoDisponibleGlobal: disp,
  };
}

/**
 * Formatea valores numéricos en formato de moneda Bolivianos (Bs.)
 */
export function formatBolivianos(amount: number): string {
  const num = new Intl.NumberFormat('es-BO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);
  return `Bs. ${num}`;
}

/**
 * Calcula el porcentaje de ejecución asegurando límites entre 0 y 100%
 */
export function calculatePercentage(part: number, total: number): number {
  if (!total || total <= 0) return 0;
  const pct = (part / total) * 100;
  return Math.min(100, Math.max(0, Math.round(pct * 10) / 10));
}
