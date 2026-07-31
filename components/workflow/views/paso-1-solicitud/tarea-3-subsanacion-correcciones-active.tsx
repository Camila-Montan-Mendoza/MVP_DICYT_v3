"use client";

import { useState } from "react";
import { TaskViewProps } from "../view-types";
import { AlertTriangle, CheckCircle2, Loader2, Send } from "lucide-react";

export default function Tarea3SubsanacionCorreccionesActive({
  tarea,
  ejecutarTransicion,
}: TaskViewProps) {
  const [observaciones, setObservaciones] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  const acciones = tarea.accionesDisponibles || [];

  const handleAction = async (idTransicion: number, nombreAccion: string) => {
    if (!ejecutarTransicion) return;

    setIsSubmitting(true);
    setFeedback(null);

    const res = await ejecutarTransicion(
      idTransicion,
      observaciones.trim() || `Correcciones realizadas y subsanadas mediante acción: ${nombreAccion}`
    );

    setIsSubmitting(false);

    if (res.success) {
      setFeedback({ type: "success", message: res.message || "Subsanación enviada exitosamente." });
    } else {
      setFeedback({ type: "error", message: res.message || "Error al procesar la subsanación." });
    }
  };

  return (
    <div className="p-6 space-y-5 bg-white rounded-2xl border border-slate-200">
      {/* Cabecera */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-md">
          Tarea {tarea.id}
        </span>
        <h3 className="text-sm font-bold text-[#001B47]">
          Subsanación y Realización de Correcciones
        </h3>
      </div>

      {/* Indicador de Atención */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Solicitud con Observaciones Realizadas</span>
        </div>
        <p className="text-xs text-amber-800 leading-relaxed">
          Como Solicitante/Investigador, revise las observaciones indicadas anteriormente, realice las
          correcciones necesarias y reenvíe la solicitud para una nueva revisión.
        </p>
      </div>

      {/* Formulario de Observaciones / Correcciones */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-[#001B47] block">
          Detalle de Correcciones Realizadas
        </label>
        <textarea
          rows={4}
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          placeholder="Describa los cambios realizados, justificando los puntos observados..."
          className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002855] resize-none"
          disabled={isSubmitting}
        />
      </div>

      {/* Feedback Toast */}
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
            <AlertTriangle className="w-4 h-4" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Botones de Acción */}
      <div className="pt-2">
        <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block mb-2">
          Opciones de Reenvío
        </span>
        {acciones.length === 0 ? (
          <p className="text-xs text-slate-400 italic">
            No hay transiciones de subsanación configuradas para esta tarea.
          </p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {acciones.map((acc) => {
              const isPresupuesto = acc.nombreAccion.toLowerCase().includes("presupuest");
              const btnStyle = isPresupuesto
                ? "bg-[#002855] text-white hover:bg-[#001B47]"
                : "bg-emerald-700 text-white hover:bg-emerald-800";

              return (
                <button
                  key={acc.idTransicion}
                  onClick={() => handleAction(acc.idTransicion, acc.nombreAccion)}
                  disabled={isSubmitting}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs ${btnStyle} disabled:opacity-50`}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>{acc.nombreAccion}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Info Contextual */}
      <div className="grid grid-cols-2 gap-3 text-[11px] pt-3 border-t border-slate-100">
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
