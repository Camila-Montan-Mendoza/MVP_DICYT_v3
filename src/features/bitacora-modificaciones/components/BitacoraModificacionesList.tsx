import React from "react";
import { History, ChevronRight, Calendar, Clock, Tag } from "lucide-react";
import { ModificacionPresupuestariaSummary } from "../types";

interface BitacoraModificacionesListProps {
  modificaciones: ModificacionPresupuestariaSummary[];
  selectedModificacionId: number | null;
  onSelectModificacion: (mod: ModificacionPresupuestariaSummary) => void;
}

export function BitacoraModificacionesList({
  modificaciones,
  selectedModificacionId,
  onSelectModificacion,
}: BitacoraModificacionesListProps) {
  if (!modificaciones || modificaciones.length === 0) {
    return (
      <div className="bg-white border border-border rounded-xl p-8 text-center text-xs text-muted-foreground italic">
        No se encontraron registros de modificaciones presupuestarias para el filtro seleccionado.
      </div>
    );
  }

  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#f8fafc] border-b border-border text-muted-foreground uppercase text-[11px] font-semibold tracking-wider">
              <th className="py-3 px-3 w-32">Correlativo</th>
              <th className="py-3 px-3 w-28">Fecha Solicitud</th>
              <th className="py-3 px-3 w-28">Fecha Aprobación</th>
              <th className="py-3 px-4">Justificación</th>
              <th className="py-3 px-3 w-40">Solicitante</th>
              <th className="py-3 px-3 w-40">Aprobador</th>
              <th className="py-3 px-3 text-center w-28">Partidas Afectadas</th>
              <th className="py-3 px-2 w-8"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {modificaciones.map((m) => {
              const isSelected = m.id === selectedModificacionId;

              return (
                <tr
                  key={m.id}
                  onClick={() => onSelectModificacion(m)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? "bg-blue-50/70 border-l-4 border-l-[#003770]" : "hover:bg-slate-50"
                  }`}
                >
                  {/* 1. Correlativo */}
                  <td className="py-3 px-3 font-bold text-[#003770] align-top">
                    <span className="inline-flex items-center gap-1 bg-[#003770]/5 px-2 py-0.5 rounded text-[11px] font-mono border border-[#003770]/10">
                      <History className="w-3 h-3 text-[#003770]" />
                      {m.codigo}
                    </span>
                  </td>

                  {/* 2. Fecha Solicitud */}
                  <td className="py-3 px-3 align-top text-slate-700 font-medium">
                    <div className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3 text-amber-700 shrink-0" />
                      <span>{m.fechaSolicitud}</span>
                    </div>
                  </td>

                  {/* 3. Fecha Aprobación */}
                  <td className="py-3 px-3 align-top text-emerald-800 font-bold">
                    <div className="flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3 h-3 text-emerald-700 shrink-0" />
                      <span>{m.fechaAprobacion}</span>
                    </div>
                  </td>

                  {/* 4. Justificación */}
                  <td className="py-3 px-4 align-top">
                    <p
                      className="text-[11px] text-[#001B47] font-medium line-clamp-2 leading-relaxed max-w-[360px]"
                      title={m.justificacion}
                    >
                      {m.justificacion}
                    </p>
                  </td>

                  {/* 5. Solicitante */}
                  <td
                    className="py-3 px-3 align-top text-[#001B47] text-[11px] truncate max-w-[160px]"
                    title={m.solicitadoPor}
                  >
                    {m.solicitadoPor}
                  </td>

                  {/* 6. Aprobador */}
                  <td
                    className="py-3 px-3 align-top text-[#003770] font-bold text-[11px] truncate max-w-[160px]"
                    title={m.aprobadoPor}
                  >
                    {m.aprobadoPor}
                  </td>

                  {/* 7. Partidas Afectadas (Solo Número) */}
                  <td className="py-3 px-3 text-center align-top font-bold text-[#001B47]">
                    <span className="inline-flex items-center gap-1 bg-slate-100 text-[#001B47] px-2.5 py-0.5 rounded-full text-xs font-extrabold border border-border shadow-2xs">
                      <Tag className="w-3 h-3 text-[#003770]" />
                      {m.partidasAfectadas.length}
                    </span>
                  </td>

                  {/* Action Chevron */}
                  <td className="py-3 px-2 text-right align-middle">
                    <ChevronRight
                      className={`w-4 h-4 text-muted-foreground transition-transform ${
                        isSelected ? "rotate-90 text-[#003770]" : ""
                      }`}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
