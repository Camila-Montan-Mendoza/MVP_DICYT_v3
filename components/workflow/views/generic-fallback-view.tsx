"use client";

import { TaskViewProps } from "./view-types";

/**
 * Vista genérica de fallback para tareas que aún no tienen
 * un componente de vista implementado en el registry.
 */
export default function GenericFallbackView({ tarea }: TaskViewProps) {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-[#002855] bg-[#002855]/10 px-2.5 py-1 rounded-md">
          Tarea {tarea.id}
        </span>
        <h3 className="text-sm font-bold text-[#001B47]">{tarea.nombre}</h3>
      </div>

      <div className="p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg space-y-2">
        <p className="text-xs font-medium text-[#64748b]">
          Vista pendiente de implementación
        </p>
        <p className="text-[11px] text-[#94a3b8]">
          Este espacio de trabajo será personalizado próximamente con los
          formularios y acciones específicas para esta tarea del flujo.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 text-[11px]">
        <div className="p-3 bg-[#f1f5f9] rounded-lg">
          <span className="text-[#94a3b8] block mb-1">Rol esperado</span>
          <span className="text-[#334155] font-medium">
            {tarea.rolEsperado || "—"}
          </span>
        </div>
        <div className="p-3 bg-[#f1f5f9] rounded-lg">
          <span className="text-[#94a3b8] block mb-1">Asignado a</span>
          <span className="text-[#334155] font-medium">
            {tarea.usuarioAsignado || "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
