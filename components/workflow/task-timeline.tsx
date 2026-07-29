"use client";

import { TareaWorkflow } from "@/lib/workflow/stepper-service";
import { useAuth } from "@/lib/auth/auth-context";
import { Check, RefreshCw, Clock, UserCheck, ListFilter } from "lucide-react";

interface TaskTimelineProps {
  pasoNombre: string;
  tareas: TareaWorkflow[];
  selectedTaskId?: string;
  onSelectTask?: (tarea: TareaWorkflow) => void;
}

export function TaskTimeline({
  pasoNombre,
  tareas,
  selectedTaskId,
  onSelectTask,
}: TaskTimelineProps) {
  const { user } = useAuth();
  const currentUser = user?.nombreCompleto || user?.username || "";
  const currentRole = user?.rolActivo || "";

  return (
    <div className="bg-white p-5 rounded-2xl border border-[#e5e7eb] shadow-2xs space-y-4">
      {/* Título de la Cronología Vertical de Tareas */}
      <h3 className="font-bold text-sm text-[#001B47] flex items-center gap-2 border-b border-[#e5e7eb] pb-3">
        <ListFilter className="w-4 h-4 text-[#BC000C]" />
        Tareas de {pasoNombre}
      </h3>

      {tareas.length === 0 ? (
        <p className="text-xs text-[#9ca3af] italic p-3">Sin tareas registradas para este paso.</p>
      ) : (
        <div className="relative pl-6 space-y-4">
          {tareas.map((tarea, index) => {
            const isLast = index === tareas.length - 1;
            const isFinalTask = Boolean(tarea.esFinal) || tarea.id === "19" || (!tarea.accionesDisponibles?.length && isLast && (pasoNombre.toLowerCase().includes("completado") || pasoNombre.toLowerCase().includes("evidencia")));
            const isCompletadoRaw = tarea.estado === "COMPLETADO";
            const isCompletado = isCompletadoRaw || (isFinalTask && tarea.estado !== "PENDIENTE");
            const isEnCurso = !isCompletado && tarea.estado === "EN_CURSO";
            const isPendiente = tarea.estado === "PENDIENTE";
            const isSelected = selectedTaskId === tarea.id;

            const isUserMatch =
              Boolean(currentUser) &&
              tarea.usuarioAsignado &&
              tarea.usuarioAsignado !== "—" &&
              tarea.usuarioAsignado.toLowerCase().includes(currentUser.toLowerCase());

            const isRoleMatch =
              Boolean(currentRole) &&
              ((tarea.rolEsperado &&
                tarea.rolEsperado.toLowerCase().includes(currentRole.toLowerCase())) ||
                (tarea.rolResponsable &&
                  tarea.rolResponsable.toLowerCase().includes(currentRole.toLowerCase())));

            const isMeAction = isEnCurso && (isUserMatch || isRoleMatch);
            const isSelectable = !isPendiente;

            return (
              <div key={tarea.id} className="relative flex items-start gap-3">
                {/* Línea vertical conectora hacia el siguiente ítem (se oculta en la última tarea) */}
                {!isLast && (
                  <span
                    className="absolute -left-3 top-3.5 -bottom-4 w-[2px] bg-[#e2e8f0] z-0"
                    aria-hidden="true"
                  />
                )}

                {/* Ícono de Estado en la Línea de Tiempo */}
                <div
                  className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full flex items-center justify-center z-10 transition-all ${
                    isCompletado
                      ? "bg-[#002855] text-white"
                      : isEnCurso
                        ? isMeAction
                          ? "bg-emerald-600 ring-4 ring-emerald-100 text-white shadow-xs"
                          : "bg-white border-2 border-[#002855] text-[#002855] ring-4 ring-blue-50/80"
                        : "bg-[#94a3b8] text-white"
                  }`}
                >
                  {isCompletado ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : isEnCurso ? (
                    <RefreshCw className={`w-3.5 h-3.5 animate-spin`} />
                  ) : (
                    <Clock className="w-3.5 h-3.5" />
                  )}
                </div>

                {/* Tarjeta Informativa de la Tarea (Interactiva) */}
                <div
                  onClick={() => {
                    if (isSelectable && onSelectTask) {
                      onSelectTask(tarea);
                    }
                  }}
                  className={`flex-1 p-3.5 rounded-xl border transition-all ${
                    isSelectable ? "cursor-pointer" : "cursor-not-allowed opacity-75"
                  } ${
                    isSelected
                      ? "ring-2 ring-[#002855] border-[#002855] shadow-md " +
                        (isEnCurso
                          ? isMeAction
                            ? "bg-emerald-50"
                            : "bg-blue-50/60"
                          : isCompletado
                            ? "bg-slate-50"
                            : "bg-white")
                      : isEnCurso
                        ? isMeAction
                          ? "bg-emerald-50 border-2 border-emerald-500/90 shadow-xs hover:border-emerald-600"
                          : "bg-blue-50/50 border-2 border-blue-400/80 shadow-2xs hover:border-blue-500"
                        : isCompletado
                          ? "bg-slate-50 border border-slate-200/90 hover:border-slate-300"
                          : "bg-white border border-slate-200/60 opacity-60 hover:border-slate-300"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`font-bold text-xs uppercase leading-snug ${
                          isEnCurso
                            ? isMeAction
                              ? "text-emerald-950"
                              : "text-blue-950"
                            : isCompletado
                              ? "text-emerald-950"
                              : "text-slate-500"
                        }`}
                      >
                        {tarea.nombre}
                      </p>
                      {isCompletado && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                          Completado
                        </span>
                      )}
                    </div>
                    {/* Rol institucional esperado */}
                    <p
                      className={`text-[11px] font-semibold ${
                        isEnCurso
                          ? isMeAction
                            ? "text-emerald-800/90"
                            : "text-blue-800/90"
                          : isCompletado
                            ? "text-emerald-800/80"
                            : "text-slate-400"
                      }`}
                    >
                      {tarea.rolEsperado}
                    </p>
                    {/* Usuario real + su rol */}
                    {tarea.usuarioAsignado && tarea.usuarioAsignado !== "—" && (
                      <p className="text-[11px] text-[#2c3e50] font-medium flex items-center gap-1 pt-0.5">
                        <UserCheck className="w-3 h-3 text-[#002855]" />
                        <span>
                          {isCompletado ? "Completado por: " : "Asignado a: "}
                          <strong className="text-[#001B47]">{tarea.usuarioAsignado}</strong>
                        </span>
                        {tarea.rolResponsable && tarea.rolResponsable !== tarea.rolEsperado && (
                          <span className="text-[10px] text-[#94a3b8] font-normal">
                            ({tarea.rolResponsable})
                          </span>
                        )}
                      </p>
                    )}

                    {/* Fecha de Finalización para Tareas Completadas */}
                    {isCompletado && tarea.fechaCompletado && (
                      <p className="text-[10px] font-mono text-emerald-700/80 pt-0.5 flex items-center gap-1">
                        <span>Finalizado el:</span>
                        <span>
                          {new Date(tarea.fechaCompletado).toLocaleString("es-BO", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </p>
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
