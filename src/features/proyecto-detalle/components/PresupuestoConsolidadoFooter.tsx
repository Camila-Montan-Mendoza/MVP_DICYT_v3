"use client";

import { ShieldCheck, AlertCircle, Loader2 } from "lucide-react";

interface PresupuestoConsolidadoFooterProps {
  totalPartidas: number;
  presupuestoTotal: number;
  excedente: number;
  esValidoParaEnviar: boolean;
  isSubmitting?: boolean;
  onCancelar?: () => void;
  onEnviarARevision?: () => void;
}

function formatMonto(monto: number): string {
  return `${monto.toLocaleString("es-BO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} Bs.`;
}

export function PresupuestoConsolidadoFooter({
  totalPartidas,
  presupuestoTotal,
  excedente,
  esValidoParaEnviar,
  isSubmitting = false,
  onCancelar,
  onEnviarARevision,
}: PresupuestoConsolidadoFooterProps) {
  const tieneExcedente = excedente > 0;

  return (
    <div className="space-y-4 pt-2">
      {/* Banner Consolidado (Matching Image 1) */}
      <div
        className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
          tieneExcedente
            ? "bg-red-50/90 border-red-200 text-red-900"
            : "bg-[#f0f5fc] border-[#d0e0f5] text-[#001B47]"
        }`}
      >
        {/* Lado Izquierdo */}
        <div className="flex items-center gap-2.5">
          {tieneExcedente ? (
            <AlertCircle className="w-5 h-5 text-[#BC000C] shrink-0" />
          ) : (
            <ShieldCheck className="w-5 h-5 text-[#003770] shrink-0" />
          )}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider">
              Presupuesto Consolidado
            </h4>
            {tieneExcedente && (
              <p className="text-[11px] font-semibold text-red-700">
                ¡Atención! La suma excede el presupuesto total por{" "}
                <strong>{formatMonto(excedente)}</strong>. Corrija los montos antes de enviar.
              </p>
            )}
          </div>
        </div>

        {/* Lado Derecho - Métricas */}
        <div className="flex items-center gap-8 text-right self-end sm:self-auto">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Total Partidas
            </span>
            <span
              className={`text-sm font-extrabold font-mono ${
                tieneExcedente ? "text-red-700" : "text-[#001B47]"
              }`}
            >
              {formatMonto(totalPartidas)}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Presupuesto Total
            </span>
            <span className="text-sm font-extrabold font-mono text-[#001B47]">
              {formatMonto(presupuestoTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancelar && (
          <button
            type="button"
            onClick={onCancelar}
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
        )}

        {onEnviarARevision && (
          <button
            type="button"
            onClick={onEnviarARevision}
            disabled={!esValidoParaEnviar || isSubmitting}
            className="px-6 py-2.5 bg-[#001B47] text-white font-bold text-xs rounded-xl hover:bg-[#002855] transition-all shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Enviando...</span>
              </>
            ) : (
              <span>Enviar a revisión</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
