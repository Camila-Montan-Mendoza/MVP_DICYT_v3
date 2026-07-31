import React from "react";
import { FolderGit2, FileText, Calendar } from "lucide-react";
import { ProyectoSummary } from "../types";
import { formatBolivianos } from "../utils/metrics-calculator";
import { ProyectoPartidasDetail } from "./ProyectoPartidasDetail";

interface ProyectoViewSectionProps {
  proyectos: ProyectoSummary[];
}

export function ProyectoViewSection({ proyectos }: ProyectoViewSectionProps) {
  if (!proyectos || proyectos.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#001B47]">Mis Proyectos de Investigación</h2>
          <p className="text-xs text-muted-foreground">
            Saldos disponibles y desglose por partidas presupuestarias
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {proyectos.map((proy) => {
          return (
            <div
              key={proy.id}
              className="bg-white border border-border rounded-xl p-6 shadow-sm space-y-4 hover:border-blue-200 transition-colors"
            >
              {/* Header de Proyecto */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-emerald-100/60 rounded-xl text-emerald-800 shrink-0">
                    <FolderGit2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        SISIN: {proy.codigoSisin}
                      </span>
                      {proy.isPlurianual && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-[#003770] border border-blue-200 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#003770]" />
                          Fondo Plurianual Acumulado
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-[#001B47] mt-1">{proy.nombre}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-right shrink-0">
                  <div>
                    <span className="text-[11px] text-muted-foreground uppercase font-semibold block">
                      Presupuesto Asignado
                    </span>
                    <div className="text-lg font-bold text-[#001B47]">
                      {formatBolivianos(proy.presupuestoVigente)}
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground uppercase font-semibold block">
                      Saldo Disponible
                    </span>
                    <div className="text-lg font-bold text-emerald-700">
                      {formatBolivianos(proy.saldoDisponible)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Detalle de Partidas */}
              <div className="pt-1">
                <div className="text-xs font-semibold text-muted-foreground mb-3">
                  Desglose por Partidas ({proy.partidas.length})
                </div>
                <ProyectoPartidasDetail partidas={proy.partidas} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
