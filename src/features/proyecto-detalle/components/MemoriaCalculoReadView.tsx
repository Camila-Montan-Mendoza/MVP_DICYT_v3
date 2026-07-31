"use client";

import { Edit3 } from "lucide-react";
import { PartidaMemoriaCalculo } from "../types";
import { PresupuestoConsolidadoFooter } from "./PresupuestoConsolidadoFooter";

interface MemoriaCalculoReadViewProps {
  partidas: PartidaMemoriaCalculo[];
  total: number;
  presupuestoTotal?: number;
  puedeDetallar?: boolean;
  puedeEvaluar?: boolean;
  onEditarClick?: () => void;
  onObservarClick?: () => void;
  onAprobarClick?: () => void;
  isSubmitting?: boolean;
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
  presupuestoTotal = 100000,
  puedeDetallar = false,
  puedeEvaluar = false,
  onEditarClick,
  onObservarClick,
  onAprobarClick,
  isSubmitting = false,
}: MemoriaCalculoReadViewProps) {
  return (
    <div className="space-y-4">
      {/* Encabezado de la Sección */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-[#001B47]">Memoria de cálculo del proyecto</h3>

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
        </table>
      </div>

      {/* Banner Consolidado con Métricas y Botones de Evaluación si aplica */}
      <PresupuestoConsolidadoFooter
        totalPartidas={total}
        presupuestoTotal={presupuestoTotal}
        excedente={Math.max(0, total - presupuestoTotal)}
        isSubmitting={isSubmitting}
        onObservar={puedeEvaluar ? onObservarClick : undefined}
        onAprobar={puedeEvaluar ? onAprobarClick : undefined}
      />
    </div>
  );
}
