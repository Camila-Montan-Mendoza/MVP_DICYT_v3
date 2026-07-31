"use client";

import { useState } from "react";
import { CheckCircle2, AlertTriangle, X, Loader2 } from "lucide-react";
import { ProyectoDetalle } from "../types";

interface EvaluacionMemoriaModalProps {
  isOpen: boolean;
  modo: "aprobar" | "observar" | null;
  proyecto: ProyectoDetalle;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirmAprobar: () => void;
  onConfirmObservar: (motivo: string) => void;
}

export function EvaluacionMemoriaModal({
  isOpen,
  modo,
  proyecto,
  isSubmitting = false,
  onClose,
  onConfirmAprobar,
  onConfirmObservar,
}: EvaluacionMemoriaModalProps) {
  const [motivo, setMotivo] = useState("");
  const [errorValidation, setErrorValidation] = useState<string | null>(null);

  if (!isOpen || !modo) return null;

  const isAprobar = modo === "aprobar";

  const handleConfirm = () => {
    if (isAprobar) {
      onConfirmAprobar();
    } else {
      if (!motivo.trim()) {
        setErrorValidation("Debe ingresar un motivo explícito para registrar la observación.");
        return;
      }
      setErrorValidation(null);
      onConfirmObservar(motivo.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden flex flex-col animate-in fade-in-50 zoom-in-95">
        {/* Header Modal */}
        <div
          className={`p-4 flex items-center justify-between text-white ${
            isAprobar ? "bg-[#001B47]" : "bg-[#BC000C]"
          }`}
        >
          <div className="flex items-center gap-2">
            {isAprobar ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-300" />
            )}
            <h3 className="text-sm font-bold">
              {isAprobar ? "Aprobar Memoria de Cálculo" : "Observar Memoria de Cálculo"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Creador Body */}
        <div className="p-6 space-y-4 text-xs">
          <div>
            <p className="font-bold text-[#001B47]">{proyecto.nombre}</p>
            <p className="text-slate-500 mt-0.5">
              Investigador:{" "}
              <strong>{proyecto.investigadorPrincipal?.nombre ?? "Sin asignar"}</strong>
            </p>
          </div>

          {isAprobar ? (
            <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl text-slate-700 space-y-1">
              <p className="font-semibold text-[#001B47]">
                ¿Está seguro de aprobar la memoria de cálculo de este proyecto?
              </p>
              <p className="text-[11px] text-slate-500">
                Al confirmar, el estado cambiará a{" "}
                <strong>&quot;Habilitado para ejecutar partidas&quot;</strong> y se habilitará la
                ejecución presupuestaria.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block font-bold text-[#001B47]">
                Motivo de la Observación <span className="text-[#BC000C]">*</span>
              </label>
              <textarea
                rows={4}
                value={motivo}
                onChange={(e) => {
                  setMotivo(e.target.value);
                  if (errorValidation) setErrorValidation(null);
                }}
                placeholder="Escriba detalladamente las observaciones o inconsistencias encontradas para que el investigador proceda a corregirlas..."
                className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BC000C] text-slate-800 bg-white"
              />
              {errorValidation && (
                <p className="text-[11px] font-semibold text-[#BC000C]">{errorValidation}</p>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className={`px-5 py-2 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all disabled:opacity-50 ${
              isAprobar ? "bg-[#001B47] hover:bg-[#002855]" : "bg-[#BC000C] hover:bg-red-800"
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Procesando...</span>
              </>
            ) : (
              <span>{isAprobar ? "Confirmar Aprobación" : "Confirmar Observación"}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
