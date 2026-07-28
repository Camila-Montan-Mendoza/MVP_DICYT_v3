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
        <p className="text-xs text-[#9ca3af] italic p-3">
          Sin tareas registradas para este paso.
        </p>
      ) : (
        <div className="relative pl-6 space-y-4">
          {tareas.map((tarea, index) => {
            const isCompletado = tarea.estado === "COMPLETADO";
            const isEnCurso = tarea.estado === "EN_CURSO";
            const isPendiente = tarea.estado === "PENDIENTE";
            const isSelected = selectedTaskId === tarea.id;
            const isLast = index === tareas.length - 1;

            const isUserMatch =
              Boolean(currentUser) &&
              tarea.usuarioAsignado &&
              tarea.usuarioAsignado !== "—" &&
              tarea.usuarioAsignado
                .toLowerCase()
                .includes(currentUser.toLowerCase());

            const isRoleMatch =
              Boolean(currentRole) &&
              ((tarea.rolEsperado &&
                tarea.rolEsperado
                  .toLowerCase()
                  .includes(currentRole.toLowerCase())) ||
                (tarea.rolResponsable &&
                  tarea.rolResponsable
                    .toLowerCase()
                    .includes(currentRole.toLowerCase())));

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
                      ? "ring-2 ring-[#002855] border-[#002855] shadow-md bg-blue-50/20"
                      : isEnCurso
                        ? isMeAction
                          ? "bg-emerald-50/70 border-2 border-emerald-400/80 shadow-xs hover:border-emerald-500"
                          : "bg-blue-50/20 border-2 border-[#002855]/40 shadow-2xs hover:border-[#002855]"
                        : "bg-white border-[#e5e7eb] hover:border-[#cbd5e1]"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-xs text-[#001B47] uppercase leading-snug">
                        {tarea.nombre}
                      </p>
                    </div>
                    {/* Rol institucional esperado */}
                    <p className="text-[11px] font-semibold text-[#64748b]">
                      {tarea.rolEsperado}
                    </p>
                    {/* Usuario real + su rol */}
                    {tarea.usuarioAsignado && tarea.usuarioAsignado !== "—" && (
                      <p className="text-[11px] text-[#2c3e50] font-medium flex items-center gap-1">
                        <UserCheck className="w-3 h-3 text-[#002855]" />
                        {tarea.usuarioAsignado}
                        {tarea.rolResponsable &&
                          tarea.rolResponsable !== tarea.rolEsperado && (
                            <span className="text-[10px] text-[#94a3b8] font-normal">
                              ({tarea.rolResponsable})
                            </span>
                          )}
                      </p>
                    )}

                    {/* Fecha de Finalización para Tareas Completadas */}
                    {isCompletado && tarea.fechaCompletado && (
                      <p className="text-[10px] font-mono text-[#64748b] pt-0.5">
                        {new Date(tarea.fechaCompletado).toLocaleString(
                          "es-BO",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
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
