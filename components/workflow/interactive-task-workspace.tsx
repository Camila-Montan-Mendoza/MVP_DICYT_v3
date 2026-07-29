"use client";

import { Suspense } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { TareaWorkflow } from "@/lib/workflow/stepper-service";
import { TramiteDBItem } from "@/lib/db/tramite-repository";
import { getTaskView } from "./views/view-registry";

interface InteractiveTaskWorkspaceProps {
  selectedTarea: TareaWorkflow | null;
  tramite: TramiteDBItem | undefined;
  onActionSuccess?: () => void;
}

export function InteractiveTaskWorkspace({
  selectedTarea,
  tramite,
  onActionSuccess,
}: InteractiveTaskWorkspaceProps) {
  const { user } = useAuth();
  const currentUser = user?.nombreCompleto || user?.username || "";
  const currentRole = user?.rolActivo || "";

  if (!selectedTarea || !tramite) {
    return (
      <div className="p-8 text-center text-xs text-[#94a3b8] italic">
        No se ha seleccionado ninguna tarea activa o el trámite no se ha cargado.
      </div>
    );
  }

  // ── Caso COMPLETADO: vista histórica de lectura pasiva ───────────────
  if (selectedTarea.estado === "COMPLETADO") {
    const TaskView = getTaskView(selectedTarea.id, false);

    return (
      <div className="space-y-4">
        {/* Encabezado e indicador de Tarea Completada */}
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900 font-semibold shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>✓ Tarea completada {selectedTarea.fechaCompletado ? `el ${selectedTarea.fechaCompletado}` : ""}</span>
          </div>
          {selectedTarea.usuarioAsignado && selectedTarea.usuarioAsignado !== "—" && (
            <span className="text-[11px] text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-lg">
              Ejecutado por: <strong>{selectedTarea.usuarioAsignado}</strong>
            </span>
          )}
        </div>

        {/* Vista Pasiva / Modo Lectura de la Tarea Completada */}
        <Suspense
          fallback={
            <div className="p-8 text-center text-xs text-[#94a3b8] animate-pulse">
              Cargando resumen de tarea completada...
            </div>
          }
        >
          <TaskView
            tarea={selectedTarea}
            tramite={tramite}
            currentUser={currentUser}
            currentRole={currentRole}
            onActionSuccess={onActionSuccess}
          />
        </Suspense>
      </div>
    );
  }

  // ── Caso PENDIENTE: tarea futura ───────────────────────────────────
  if (selectedTarea.estado === "PENDIENTE") {
    return (
      <div className="p-8 text-center text-xs text-[#64748b] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl space-y-2">
        <p className="font-bold text-[#001B47]">Etapa Pendiente (Futura)</p>
        <p className="text-[11px] text-[#64748b]">
          Esta tarea no ha sido iniciada aún. Estará disponible para procesamiento una vez que se
          completen los pasos anteriores.
        </p>
      </div>
    );
  }

  // ── Caso EN_CURSO: resolver active/passive vía registry ────────────
  const isUserMatch =
    Boolean(currentUser) &&
    Boolean(selectedTarea.usuarioAsignado) &&
    selectedTarea.usuarioAsignado !== "—" &&
    selectedTarea.usuarioAsignado.toLowerCase().includes(currentUser.toLowerCase());

  const isRoleMatch =
    Boolean(currentRole) &&
    ((Boolean(selectedTarea.rolEsperado) &&
      selectedTarea.rolEsperado.toLowerCase().includes(currentRole.toLowerCase())) ||
      (Boolean(selectedTarea.rolResponsable) &&
        selectedTarea.rolResponsable.toLowerCase().includes(currentRole.toLowerCase())));

  const isMeAction = isUserMatch || isRoleMatch;

  const handleEjecutarTransicion = async (
    idTransicion: number,
    observaciones?: string,
    datosExtra?: Record<string, any>
  ) => {
    try {
      const res = await fetch(`/api/tramites/${tramite.id}/transicion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idTransicion,
          observaciones,
          datosExtra,
          usuarioId: user?.id,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return {
          success: false,
          message: data.message || "Error al procesar la transición.",
        };
      }

      if (onActionSuccess) {
        onActionSuccess();
      }

      return {
        success: true,
        message: data.message || "Transición ejecutada exitosamente.",
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || "Error de red al ejecutar la transición.",
      };
    }
  };

  const TaskView = getTaskView(selectedTarea.id, isMeAction);

  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-[#94a3b8] animate-pulse">
          Cargando vista de tarea...
        </div>
      }
    >
      <TaskView
        tarea={selectedTarea}
        tramite={tramite}
        currentUser={currentUser}
        currentRole={currentRole}
        onActionSuccess={onActionSuccess}
        ejecutarTransicion={handleEjecutarTransicion}
      />
    </Suspense>
  );
}
