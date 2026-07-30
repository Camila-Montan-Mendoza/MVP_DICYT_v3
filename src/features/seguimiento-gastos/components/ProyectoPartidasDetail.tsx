import React, { useState } from 'react';
import { Tag, Search, LayoutGrid, List } from 'lucide-react';
import { PartidaConcretaSummary } from '../types';
import { formatBolivianos } from '../utils/metrics-calculator';

interface ProyectoPartidasDetailProps {
  partidas: PartidaConcretaSummary[];
}

export function ProyectoPartidasDetail({ partidas }: ProyectoPartidasDetailProps) {
  // Proyectos pequeños (<=4 partidas) usan tarjetas por defecto; grandes (>4 partidas) usan tabla minimalista
  const [viewMode, setViewMode] = useState<'table' | 'grid'>(
    partidas && partidas.length > 4 ? 'table' : 'grid'
  );
  const [searchQuery, setSearchQuery] = useState('');

  if (!partidas || partidas.length === 0) {
    return <p className="text-xs text-muted-foreground italic">Sin partidas asignadas en este proyecto.</p>;
  }

  // Filtrado reactivo en búsqueda
  const filteredPartidas = partidas.filter((p) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      p.codigoPartida.toString().includes(query) ||
      p.nombrePartida.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-3">
      {/* Barra Superior con Búsqueda y Alternador de Vista (Minimalist Wizard UI) */}
      {partidas.length > 4 && (
        <div className="flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Filtrar partida por código o nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#001B47] placeholder:text-muted-foreground focus:outline-hidden focus:border-[#003770] transition-colors"
            />
          </div>

          <div className="flex items-center bg-muted/60 p-0.5 rounded-lg border border-border shrink-0">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs transition-colors flex items-center gap-1 ${
                viewMode === 'table'
                  ? 'bg-white text-[#003770] shadow-2xs font-semibold'
                  : 'text-muted-foreground hover:text-[#001B47]'
              }`}
              title="Vista Lista Tabla"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs transition-colors flex items-center gap-1 ${
                viewMode === 'grid'
                  ? 'bg-white text-[#003770] shadow-2xs font-semibold'
                  : 'text-muted-foreground hover:text-[#001B47]'
              }`}
              title="Vista Tarjetas"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Renderizado de Modo Tabla Minimalista (Wizard Pattern para >4 partidas) */}
      {viewMode === 'table' ? (
        <div className="bg-white border border-border rounded-lg overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-border text-muted-foreground uppercase text-[11px] font-semibold tracking-wider">
                  <th className="py-2.5 px-3.5 w-32">Partida</th>
                  <th className="py-2.5 px-3.5">Descripción de Partida</th>
                  <th className="py-2.5 px-3.5 text-right w-36">Presupuesto</th>
                  <th className="py-2.5 px-3.5 text-right w-36">Saldo Disp.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredPartidas.length > 0 ? (
                  filteredPartidas.map((p) => (
                    <tr key={p.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-2.5 px-3.5 font-bold text-[#003770]">
                        <span className="inline-flex items-center gap-1 bg-[#003770]/5 px-2 py-0.5 rounded text-[11px] font-mono border border-[#003770]/10">
                          <Tag className="w-3 h-3 text-[#003770]" />
                          {p.codigoPartida}
                        </span>
                      </td>
                      <td className="py-2.5 px-3.5 font-medium text-[#001B47]">
                        {p.nombrePartida}
                      </td>
                      <td className="py-2.5 px-3.5 text-right font-medium text-[#001B47]">
                        {formatBolivianos(p.presupuestoAsignado)}
                      </td>
                      <td className="py-2.5 px-3.5 text-right font-bold text-emerald-700">
                        {formatBolivianos(p.presupuestoDisponible)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-muted-foreground italic">
                      No se encontraron partidas con ese filtro.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Renderizado de Modo Cuadrícula de Tarjetas (ideal para <=4 partidas) */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {filteredPartidas.map((p) => (
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
              <div className="text-xs font-semibold text-[#001B47] truncate" title={p.nombrePartida}>
                {p.nombrePartida}
              </div>
              <div className="text-[11px] text-muted-foreground flex justify-between pt-1 border-t border-border/50">
                <span className="truncate">Vigente: {formatBolivianos(p.presupuestoAsignado)}</span>
                <span className="text-emerald-700 font-bold shrink-0 ms-1">
                  Disp: {formatBolivianos(p.presupuestoDisponible)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
