import { describe, it, expect } from "vitest";
import {
  calculateDashboardMetrics,
  calculatePercentage,
  formatBolivianos,
} from "../metrics-calculator";

describe("metrics-calculator", () => {
  it("calculates the 5 global metrics correctly", () => {
    const items = [
      { montoTotal: 1000, estadoItem: 1 as const }, // Preventivo
      { montoTotal: 2500, estadoItem: 2 as const }, // Comprometido
      { montoTotal: 1500, estadoItem: 3 as const }, // Pagado
    ];
    const metrics = calculateDashboardMetrics(10000, items);

    expect(metrics.presupuestoVigenteTotal).toBe(10000);
    expect(metrics.preventivoReservado).toBe(1000);
    expect(metrics.comprometido).toBe(2500);
    expect(metrics.gastadoDevengado).toBe(1500);
    expect(metrics.saldoDisponibleGlobal).toBe(5000); // 10000 - (1000+2500+1500)
  });

  it("handles empty items correctly", () => {
    const metrics = calculateDashboardMetrics(5000, []);
    expect(metrics.saldoDisponibleGlobal).toBe(5000);
    expect(metrics.preventivoReservado).toBe(0);
  });

  it("calculates percentage correctly", () => {
    expect(calculatePercentage(2500, 10000)).toBe(25);
    expect(calculatePercentage(0, 10000)).toBe(0);
    expect(calculatePercentage(100, 0)).toBe(0);
  });

  it("formats currency correctly", () => {
    const formatted = formatBolivianos(1250.5);
    expect(formatted).toContain("Bs.");
  });
});
