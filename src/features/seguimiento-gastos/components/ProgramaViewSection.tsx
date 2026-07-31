import React from "react";
import { Building2, Layers, ChevronRight, Clock } from "lucide-react";
import { ProgramaSummary } from "../types";
import { formatBolivianos, calculatePercentage } from "../utils/metrics-calculator";

interface ProgramaViewSectionProps {
  programas: ProgramaSummary[];
}

export function ProgramaViewSection({ programas }: ProgramaViewSectionProps) {
  if (!programas || programas.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#001B47]">
            Visión Ejecutiva de Programas e Institucional
          </h2>
          <p className="text-xs text-muted-foreground">
            Consolidado presupuestario de Programas Principales y Subprogramas asociados
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {programas.map((prog) => {
          const pctEjecutado = calculatePercentage(prog.ejecutadoVisual, prog.presupuestoVigente);

          return (
            <div
              key={prog.id}
              className="bg-white border border-border rounded-xl p-6 shadow-sm space-y-4 hover:border-blue-200 transition-colors"
            >
              {/* Header de Programa */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-[#003770]/10 rounded-xl text-[#003770]">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-100 text-[#003770]">
                        {prog.sigla}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">
                        Clasificador: {prog.codigoClasificador}
                      </span>
                      {prog.isCerrada && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-800" />
                          Gestión Cerrada / Recursos Vencidos
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-[#001B47] mt-1">{prog.nombre}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-right">
                  <div>
                    <span className="text-[11px] text-muted-foreground uppercase font-semibold">
                      Presupuesto Vigente
                    </span>
                    <div className="text-lg font-bold text-[#001B47]">
                      {formatBolivianos(prog.presupuestoVigente)}
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground uppercase font-semibold">
                      Saldo Disponible
                    </span>
                    <div className="text-lg font-bold text-emerald-700">
                      {formatBolivianos(prog.saldoDisponible)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Barra de Ejecución del Programa */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-muted-foreground">
                  <span>Ejecución Presupuestaria del Programa</span>
                  <span className="font-semibold text-[#003770]">{pctEjecutado}%</span>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#003770] rounded-full transition-all duration-500"
                    style={{ width: `${pctEjecutado}%` }}
                  />
                </div>
              </div>

              {/* Lista de Subprogramas */}
              {prog.subprogramas && prog.subprogramas.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-3">
                    <Layers className="w-4 h-4 text-[#003770]" />
                    <span>Subprogramas Asociados ({prog.subprogramas.length})</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {prog.subprogramas.map((sub) => {
                      const subPct = calculatePercentage(
                        sub.ejecutadoVisual,
                        sub.presupuestoVigente
                      );
                      return (
                        <div
                          key={sub.id}
                          className="bg-muted/40 border border-border/80 rounded-lg p-3 flex flex-col justify-between"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="pr-2">
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                                {sub.sigla}
                              </span>
                              <h4 className="text-xs font-bold text-[#001B47] mt-1 line-clamp-1">
                                {sub.nombre}
                              </h4>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px]">
                              <span className="text-muted-foreground">
                                Vigente: {formatBolivianos(sub.presupuestoVigente)}
                              </span>
                              <span className="font-bold text-[#003770]">{subPct}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#003770] rounded-full"
                                style={{ width: `${subPct}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
