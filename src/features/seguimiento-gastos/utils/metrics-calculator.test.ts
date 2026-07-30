import { describe, it, expect } from 'vitest';
import { calculateMetricsByGestion, calculatePercentage, formatBolivianos } from './metrics-calculator';

describe('metrics-calculator por gestión', () => {
  it('debe calcular métricas para la gestión activa 2026', () => {
    const res = calculateMetricsByGestion(100000, 2026);
    expect(res.presupuestoVigenteTotal).toBe(100000);
    expect(res.preventivoReservado).toBe(15000);
    expect(res.comprometido).toBe(20000);
    expect(res.gastadoDevengado).toBe(25000);
    expect(res.saldoDisponibleGlobal).toBe(40000);
  });

  it('debe calcular métricas reducidas para la gestión anterior 2025', () => {
    const res = calculateMetricsByGestion(100000, 2025);
    expect(res.presupuestoVigenteTotal).toBe(85000);
  });

  it('debe calcular el consolidado acumulado para Histórico Global', () => {
    const res = calculateMetricsByGestion(100000, 'global');
    expect(res.presupuestoVigenteTotal).toBe(165000);
  });

  it('debe formar adecuadamente montos en Bolivianos', () => {
    expect(formatBolivianos(12500.5)).toBe('Bs. 12.500,50');
  });

  it('debe calcular porcentajes válidos entre 0 y 100', () => {
    expect(calculatePercentage(25, 100)).toBe(25);
    expect(calculatePercentage(150, 100)).toBe(100);
  });
});
