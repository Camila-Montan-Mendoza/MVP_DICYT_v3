"use client";

import { useState } from "react";
import { TaskViewProps } from "../view-types";
import { CheckCircle2, AlertTriangle, XCircle, Loader2 } from "lucide-react";

export default function Tarea1RevisionPresupuestariaActive({
  tarea,
  ejecutarTransicion,
}: TaskViewProps) {
  const [observaciones, setObservaciones] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  const acciones = tarea.accionesDisponibles || [];

  const handleAction = async (idTransicion: number, _nombreAccion: string) => {
    if (!ejecutarTransicion) return;

    setIsSubmitting(true);
    setFeedback(null);

    const res = await ejecutarTransicion(idTransicion, observaciones, {
      observacionesDetalle: observaciones,
    });

    setIsSubmitting(false);

    if (res.success) {
      setFeedback({ type: "success", message: res.message || "Acción ejecutada correctamente." });
    } else {
      setFeedback({ type: "error", message: res.message || "Error al procesar la acción." });
    }
  };

  return (
    <div className="p-6 space-y-5">
      {/* Cabecera */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-[#002855] bg-[#002855]/10 px-2.5 py-1 rounded-md">
          Tarea {tarea.id}
        </span>
        <h3 className="text-sm font-bold text-[#001B47]">{tarea.nombre}</h3>
      </div>

      {/* Tarjeta de estado activo */}
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Verificación de Disponibilidad Presupuestaria</span>
        </div>
        <p className="text-xs text-emerald-800 leading-relaxed">
          Como Responsable de Presupuestos, verifique la existencia de partidas y saldo disponible
          para respaldar este trámite.
        </p>
      </div>

      {/* Formulario de Observaciones */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-[#001B47] block">
          Observaciones / Notas de Certificación
        </label>
        <textarea
          rows={3}
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          placeholder="Ingrese notas sobre la disponibilidad presupuestaria u observaciones si corresponde..."
          className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002855] resize-none"
          disabled={isSubmitting}
        />
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
            feedback.type === "success"
              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <XCircle className="w-4 h-4" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Botones Dinámicos de Acción */}
      <div className="pt-2">
        <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block mb-2">
          Acciones Disponibles
        </span>
        {acciones.length === 0 ? (
          <p className="text-xs text-slate-400 italic">
            No hay transiciones configuradas para esta tarea.
          </p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {acciones.map((acc) => {
              const isObservar = acc.nombreAccion.toLowerCase().includes("observ");
              const isRechazar = acc.nombreAccion.toLowerCase().includes("rechaz");

              let btnStyle = "bg-[#002855] text-white hover:bg-[#001B47]";
              if (isObservar) {
                btnStyle = "bg-amber-600 text-white hover:bg-amber-700";
              } else if (isRechazar) {
                btnStyle = "bg-rose-600 text-white hover:bg-rose-700";
              }

              return (
                <button
                  key={acc.idTransicion}
                  onClick={() => handleAction(acc.idTransicion, acc.nombreAccion)}
                  disabled={isSubmitting}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shadow-xs ${btnStyle} disabled:opacity-50`}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : isObservar ? (
                    <AlertTriangle className="w-3.5 h-3.5" />
                  ) : isRechazar ? (
                    <XCircle className="w-3.5 h-3.5" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  <span>{acc.nombreAccion}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Info Contextual */}
      <div className="grid grid-cols-2 gap-3 text-[11px] pt-2 border-t border-slate-100">
        <div className="p-3 bg-slate-50 rounded-lg">
          <span className="text-slate-400 block mb-1">Estado Tarea</span>
          <span className="text-slate-700 font-medium">{tarea.estado}</span>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg">
          <span className="text-slate-400 block mb-1">Responsable</span>
          <span className="text-slate-700 font-medium">{tarea.usuarioAsignado || "—"}</span>
        </div>
      </div>
    </div>
  );
}
