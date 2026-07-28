"use client";

import { TaskViewProps } from "../view-types";

export default function Tarea6VerificacionMercadoVirtualPassive({ tarea }: TaskViewProps) {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-[#002855] bg-[#002855]/10 px-2.5 py-1 rounded-md">
          Tarea 6
        </span>
        <h3 className="text-sm font-bold text-[#001B47]">
          Verificación en Mercado Virtual y adjudicación provisional
        </h3>
      </div>

      <div className="p-4 bg-[#eff6ff] border border-[#93c5fd] rounded-lg text-xs text-[#1e40af]">
        🔵 Vista pasiva — Pendiente de implementación
      </div>

      <div className="grid grid-cols-2 gap-3 text-[11px]">
        <div className="p-3 bg-[#f1f5f9] rounded-lg">
          <span className="text-[#94a3b8] block mb-1">Estado</span>
          <span className="text-[#334155] font-medium">{tarea.estado}</span>
        </div>
        <div className="p-3 bg-[#f1f5f9] rounded-lg">
          <span className="text-[#94a3b8] block mb-1">Asignado a</span>
          <span className="text-[#334155] font-medium">{tarea.usuarioAsignado || "—"}</span>
        </div>
      </div>
    </div>
  );
}
