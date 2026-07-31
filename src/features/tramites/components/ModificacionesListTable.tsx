"use client";

import { useRouter } from "next/navigation";
import { Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { ModificacionPresupuestaria } from "../types/modificacion";

interface ModificacionesListTableProps {
  modificaciones: ModificacionPresupuestaria[];
}

function formatMonto(monto: number): string {
  return `${monto.toLocaleString("es-BO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs.`;
}

export function ModificacionesListTable({ modificaciones }: ModificacionesListTableProps) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      {/* Tabla Listado */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#f8fafc] text-[#64748b] font-bold border-b border-slate-200">
            <tr>
              <th className="px-5 py-3.5 w-36 uppercase tracking-wider text-[11px]">
                Código Trámite
              </th>
              <th className="px-5 py-3.5 uppercase tracking-wider text-[11px]">Proyecto</th>
              <th className="px-5 py-3.5 w-52 uppercase tracking-wider text-[11px]">Solicitante</th>
              <th className="px-5 py-3.5 w-28 uppercase tracking-wider text-[11px] text-center">
                Fecha
              </th>
              <th className="px-5 py-3.5 w-44 uppercase tracking-wider text-[11px] text-right">
                Monto Modificado
              </th>
              <th className="px-5 py-3.5 w-44 uppercase tracking-wider text-[11px] text-center">
                Estado
              </th>
              <th className="px-5 py-3.5 w-24 uppercase tracking-wider text-[11px] text-center">
                Acción
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {modificaciones.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-slate-400 italic">
                  No hay solicitudes de modificación presupuestaria registradas.
                </td>
              </tr>
            ) : (
              modificaciones.map((mod) => (
                <tr key={mod.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4 font-extrabold font-mono text-[#001B47]">
                    {mod.codigoTramite}
                  </td>
                  <td className="px-5 py-4 max-w-xs truncate">
                    <span className="font-bold text-slate-800 block text-xs">
                      {mod.proyectoNombre}
                    </span>
                    <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
                      {mod.proyectoCodigo}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-700 font-medium">{mod.solicitanteNombre}</td>
                  <td className="px-5 py-4 text-slate-500 text-center font-mono">{mod.fecha}</td>
                  <td className="px-5 py-4 text-right font-mono font-extrabold text-[#001B47] text-xs">
                    {formatMonto(mod.totalAumentado)}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        mod.estado === "PENDIENTE"
                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                          : mod.estado === "APROBADO"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-red-50 text-red-800 border border-red-200"
                      }`}
                    >
                      {mod.estado === "PENDIENTE" && <Clock className="w-3 h-3 text-amber-600" />}
                      {mod.estado === "APROBADO" && (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      )}
                      {mod.estado === "OBSERVADO" && (
                        <AlertTriangle className="w-3 h-3 text-red-600" />
                      )}
                      <span>
                        {mod.estado === "PENDIENTE"
                          ? "Pendiente de revisión"
                          : mod.estado === "APROBADO"
                            ? "Aprobado"
                            : "Observado"}
                      </span>
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => router.push(`/tramites/modificaciones/${mod.id}`)}
                        className="px-3 py-1.5 rounded-xl border border-[#002855] text-[#002855] hover:bg-[#002855] hover:text-white font-bold text-xs transition-all shadow-2xs"
                        title="Ver detalle"
                      >
                        Ver Trámite
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
