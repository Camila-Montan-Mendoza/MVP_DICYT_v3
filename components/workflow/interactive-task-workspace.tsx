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

  // ── Caso COMPLETADO: vista histórica de lectura ────────────────────
  if (selectedTarea.estado === "COMPLETADO") {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-[#002855] bg-[#002855]/10 px-2.5 py-1 rounded-md">
            Tarea {selectedTarea.id}
          </span>
          <h3 className="text-sm font-bold text-[#001B47]">{selectedTarea.nombre}</h3>
        </div>

        <div className="p-4 bg-[#f0fdf4] border border-[#86efac] rounded-lg space-y-2">
          <p className="text-xs font-medium text-[#166534]">✓ Tarea completada</p>
          {selectedTarea.fechaCompletado && (
            <p className="text-[11px] text-[#16a34a]">
              Completada el {selectedTarea.fechaCompletado}
            </p>
          )}
          {selectedTarea.usuarioAsignado && selectedTarea.usuarioAsignado !== "—" && (
            <p className="text-[11px] text-[#16a34a]">Por: {selectedTarea.usuarioAsignado}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 text-[11px]">
          <div className="p-3 bg-[#f1f5f9] rounded-lg">
            <span className="text-[#94a3b8] block mb-1">Rol responsable</span>
            <span className="text-[#334155] font-medium">
              {selectedTarea.rolEsperado || selectedTarea.rolResponsable || "—"}
            </span>
          </div>
          <div className="p-3 bg-[#f1f5f9] rounded-lg">
            <span className="text-[#94a3b8] block mb-1">Ejecutado por</span>
            <span className="text-[#334155] font-medium">
              {selectedTarea.usuarioAsignado || "—"}
            </span>
          </div>
        </div>
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
