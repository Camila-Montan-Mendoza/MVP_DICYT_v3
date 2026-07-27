"use client";

import { TareaWorkflow } from "@/lib/workflow/stepper-service";
import { Check, RefreshCw, Clock, UserCheck, ShieldAlert, ListFilter } from "lucide-react";

interface TaskTimelineProps {
  pasoNombre: string;
  tareas: TareaWorkflow[];
  currentUser?: string;
}

export function TaskTimeline({
  pasoNombre,
  tareas,
  currentUser = "Marcelino Perez",
}: TaskTimelineProps) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-[#e5e7eb] shadow-2xs space-y-4">
      {/* Título de la Cronología Vertical de Tareas */}
      <h3 className="font-bold text-sm text-[#001B47] flex items-center gap-2 border-b border-[#e5e7eb] pb-3">
        <ListFilter className="w-4 h-4 text-[#BC000C]" />
        Tareas de {pasoNombre}
      </h3>

      {tareas.length === 0 ? (
        <p className="text-xs text-[#9ca3af] italic p-3">
          Sin tareas registradas para este paso.
        </p>
      ) : (
        <div className="relative pl-6 space-y-4 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-[2px] before:bg-[#e2e8f0]">
          {tareas.map((tarea) => {
            const isCompletado = tarea.estado === "COMPLETADO";
            const isEnCurso = tarea.estado === "EN_CURSO";
            const isMeAction = isEnCurso && tarea.usuarioAsignado.toLowerCase().includes(currentUser.toLowerCase());

            return (
              <div key={tarea.id} className="relative flex items-start gap-3">
                {/* Ícono de Estado en la Línea de Tiempo */}
                <div
                  className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-white z-10 transition-all ${
                    isCompletado
                      ? "bg-[#002855]"
                      : isEnCurso
                      ? "bg-emerald-600 ring-4 ring-emerald-100 animate-pulse"
                      : "bg-[#94a3b8]"
                  }`}
                >
                  {isCompletado ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : isEnCurso ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Clock className="w-3.5 h-3.5" />
                  )}
                </div>

                {/* Tarjeta Informativa de la Tarea */}
                <div
                  className={`flex-1 p-3.5 rounded-xl border transition-all ${
                    isEnCurso
                      ? "bg-emerald-50/60 border-2 border-emerald-300 shadow-xs"
                      : "bg-white border-[#e5e7eb]"
                  }`}
                >
                  <div className="space-y-1">
                    <p className="font-bold text-xs text-[#001B47] uppercase leading-snug">
                      {tarea.nombre}
                    </p>
                    <p className="text-[11px] font-semibold text-[#64748b]">
                      {tarea.rolResponsable}
                    </p>
                    <p className="text-[11px] text-[#2c3e50] font-medium flex items-center gap-1">
                      <UserCheck className="w-3 h-3 text-[#002855]" />
                      {tarea.usuarioAsignado}
                    </p>

                    {/* Fecha de Finalización para Tareas Completadas */}
                    {isCompletado && tarea.fechaCompletado && (
                      <p className="text-[10px] font-mono text-[#64748b] pt-0.5">
                        Completed: {tarea.fechaCompletado}
                      </p>
                    )}

                    {/* Indicador de Intervención del Usuario ("¿Me toca actuar o espero?") */}
                    {isEnCurso && (
                      <div className="pt-2">
                        {isMeAction ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-700 text-white font-bold text-[10px] rounded-md shadow-2xs">
                            <ShieldAlert className="w-3 h-3" />
                            Acción requerida por tu parte
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-900 font-bold text-[10px] rounded-md border border-amber-300">
                            <Clock className="w-3 h-3 text-amber-700" />
                            En espera de acción por parte de {tarea.usuarioAsignado} ({tarea.rolResponsable})
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
