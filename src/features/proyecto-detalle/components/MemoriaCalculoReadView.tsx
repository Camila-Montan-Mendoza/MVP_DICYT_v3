"use client";

import { Calculator, Edit3 } from "lucide-react";
import { PartidaMemoriaCalculo } from "../types";

interface MemoriaCalculoReadViewProps {
  partidas: PartidaMemoriaCalculo[];
  total: number;
  puedeDetallar?: boolean;
  onEditarClick?: () => void;
}

function formatMonto(monto: number): string {
  return monto.toLocaleString("es-BO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function MemoriaCalculoReadView({
  partidas,
  total,
  puedeDetallar = false,
  onEditarClick,
}: MemoriaCalculoReadViewProps) {
  return (
    <div className="space-y-4">
      {/* Encabezado de la Sección */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-[#001B47]">Memoria de calculo del proyecto</h3>

        <div className="flex items-center gap-2">
          {puedeDetallar && onEditarClick && (
            <button
              type="button"
              onClick={onEditarClick}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 text-white font-bold text-xs rounded-xl hover:bg-amber-700 transition-all shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Detallar memoria de cálculo</span>
            </button>
          )}

          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#001B47] text-white font-bold text-xs rounded-xl hover:bg-[#002855] transition-all shadow-xs"
          >
            <Calculator className="w-4 h-4" />
            <span>Memoria de Cálculo</span>
          </button>
        </div>
      </div>

      {/* Tabla Estática Consolidada */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#f8fafc] text-[#64748b] font-bold border-b border-slate-200">
            <tr>
              <th className="px-6 py-3.5 w-24">ID</th>
              <th className="px-6 py-3.5">Nombre de Partida</th>
              <th className="px-6 py-3.5 text-right w-44">Monto (Bs.)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {partidas.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-slate-400 italic">
                  No se han agregado partidas a la memoria de cálculo.
                </td>
              </tr>
            ) : (
              partidas.map((partida) => (
                <tr key={partida.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-slate-500">
                    {partida.codigoPartida || partida.id}
                  </td>
                  <td className="px-6 py-4 font-bold text-[#001B47]">{partida.nombrePartida}</td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-slate-800">
                    {formatMonto(partida.monto)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot className="bg-[#f8fafc] border-t border-slate-200 font-bold text-xs">
            <tr>
              <td colSpan={2} className="px-6 py-4 text-[#001B47]">
                Total Consolidado
              </td>
              <td className="px-6 py-4 text-right font-mono text-sm text-[#001B47]">
                {formatMonto(total)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
