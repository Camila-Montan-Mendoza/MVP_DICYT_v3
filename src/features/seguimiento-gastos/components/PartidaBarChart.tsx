import React from "react";
import { BarChart3 } from "lucide-react";
import { formatBolivianos } from "../utils/metrics-calculator";

export interface BarChartDataPoint {
  codigoPartida: number;
  nombrePartida: string;
  presupuestoAsignado: number;
  presupuestoEjecutado: number;
}

interface PartidaBarChartProps {
  data: BarChartDataPoint[];
}

export function PartidaBarChart({ data }: PartidaBarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-border rounded-xl p-6 text-center text-muted-foreground">
        Sin partidas registradas para graficar.
      </div>
    );
  }

  const maxVal = Math.max(...data.map((d) => d.presupuestoAsignado), 1);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#003770]" />
          <h3 className="font-semibold text-[#001B47]">Gasto por Partida</h3>
        </div>
        <span className="text-xs text-muted-foreground">Asignado vs. Ejecutado</span>
      </div>

      <div className="space-y-4">
        {data.map((item, idx) => {
          const pctAsignado = (item.presupuestoAsignado / maxVal) * 100;
          const pctEjecutado = (item.presupuestoEjecutado / maxVal) * 100;

          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#001B47] font-semibold">
                  Partida {item.codigoPartida} - {item.nombrePartida}
                </span>
                <span className="text-muted-foreground">
                  Ejecutado: {formatBolivianos(item.presupuestoEjecutado)} /{" "}
                  {formatBolivianos(item.presupuestoAsignado)}
                </span>
              </div>
              <div className="h-4 rounded-full relative flex items-center">
                {/* Barra Asignada (Azul institucional claro) */}
                <div
                  className="h-full bg-blue-200 rounded-full transition-all duration-500 absolute left-0 top-0"
                  style={{ width: `${pctAsignado}%` }}
                />
                {/* Barra Ejecutada (Azul institucional intenso) */}
                <div
                  className="h-full bg-[#003770] rounded-full transition-all duration-500 absolute left-0 top-0"
                  style={{ width: `${pctEjecutado}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-border text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-[#003770] inline-block" />
          <span>Presupuesto Gastado</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-blue-200 inline-block" />
          <span>Presupuesto Asignado</span>
        </div>
      </div>
    </div>
  );
}
