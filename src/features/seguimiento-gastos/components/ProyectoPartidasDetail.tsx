import React from 'react';
import { Tag } from 'lucide-react';
import { PartidaConcretaSummary } from '../types';
import { formatBolivianos } from '../utils/metrics-calculator';

interface ProyectoPartidasDetailProps {
  partidas: PartidaConcretaSummary[];
}

export function ProyectoPartidasDetail({ partidas }: ProyectoPartidasDetailProps) {
  if (!partidas || partidas.length === 0) {
    return <p className="text-xs text-muted-foreground italic">Sin partidas asignadas en este proyecto.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
      {partidas.map((p) => {
        return (
          <div
            key={p.id}
            className="bg-white border border-border/80 rounded-lg p-2.5 shadow-2xs hover:border-blue-300 transition-colors flex flex-col justify-between space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#003770] flex items-center gap-1">
                <Tag className="w-3 h-3 shrink-0 text-[#003770]" />
                Partida {p.codigoPartida}
              </span>
            </div>
            <div
              className="text-xs font-semibold text-[#001B47] truncate"
              title={p.nombrePartida}
            >
              {p.nombrePartida}
            </div>
            <div className="text-[11px] text-muted-foreground flex justify-between pt-1 border-t border-border/50">
              <span className="truncate">Vigente: {formatBolivianos(p.presupuestoAsignado)}</span>
              <span className="text-emerald-700 font-bold shrink-0 ms-1">
                Disp: {formatBolivianos(p.presupuestoDisponible)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
