"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SigefiShell } from "@/components/sigefi-shell";
import { ModificacionPresupuestaria } from "@/src/features/tramites/types/modificacion";
import { mockModificacionService } from "@/src/features/tramites/services/mockModificacionService";
import { ArrowLeft, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

export default function ModificacionDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [modificacion, setModificacion] = useState<ModificacionPresupuestaria | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const mod = mockModificacionService.getModificacionById(id);
    setModificacion(mod);
    setIsLoading(false);
  }, [id]);

  if (isLoading) {
    return (
      <SigefiShell>
        <div className="p-12 text-center text-xs font-bold text-slate-500 animate-pulse">
          Cargando detalle de la modificación presupuestaria...
        </div>
      </SigefiShell>
    );
  }

  if (!modificacion) {
    return (
      <SigefiShell>
        <div className="p-12 text-center text-xs font-bold text-slate-500">
          Trámite de modificación no encontrado.
        </div>
      </SigefiShell>
    );
  }

  return (
    <SigefiShell>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/tramites")}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-[#001B47]">
                  Modificación Presupuestaria {modificacion.codigoTramite}
                </h1>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    modificacion.estado === "PENDIENTE"
                      ? "bg-amber-50 text-amber-800 border border-amber-200"
                      : modificacion.estado === "APROBADO"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {modificacion.estado === "PENDIENTE" && (
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                  )}
                  {modificacion.estado === "APROBADO" && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                  {modificacion.estado === "OBSERVADO" && (
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                  )}
                  <span>
                    {modificacion.estado === "PENDIENTE"
                      ? "Pendiente de revisión"
                      : modificacion.estado === "APROBADO"
                        ? "Aprobado"
                        : "Observado"}
                  </span>
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Proyecto:{" "}
                <span className="font-bold text-[#001B47]">{modificacion.proyectoNombre}</span> (
                {modificacion.proyectoCodigo})
              </p>
            </div>
          </div>
        </div>

        {/* 2 Paneles de Partidas Read-Only */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Panel Izquierdo: Partidas Afectadas (De) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 bg-slate-50/80 border-b border-slate-200">
              <h3 className="text-xs font-bold text-[#001B47]">Partidas Afectadas (De)</h3>
            </div>
            <div className="p-4">
              <table className="w-full text-left text-xs">
                <thead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-2">CÓDIGO</th>
                    <th className="py-2 px-2">DESCRIPCIÓN</th>
                    <th className="py-2 px-2 text-right">MONTO QUITADO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {modificacion.partidasAfectadas.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 px-2 font-bold font-mono text-[#001B47]">
                        {item.codigo}
                      </td>
                      <td className="py-3 px-2 text-slate-800">{item.descripcion}</td>
                      <td className="py-3 px-2 text-right font-mono font-bold text-[#BC000C]">
                        - {item.monto.toLocaleString("es-BO", { minimumFractionDigits: 2 })} Bs
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Panel Derecho: Partidas Beneficiadas (A) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 bg-slate-50/80 border-b border-slate-200">
              <h3 className="text-xs font-bold text-[#001B47]">Partidas Beneficiadas (A)</h3>
            </div>
            <div className="p-4">
              <table className="w-full text-left text-xs">
                <thead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-2">CÓDIGO</th>
                    <th className="py-2 px-2">DESCRIPCIÓN</th>
                    <th className="py-2 px-2 text-right">MONTO AUMENTADO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {modificacion.partidasBeneficiadas.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 px-2 font-bold font-mono text-[#001B47]">
                        {item.codigo}
                      </td>
                      <td className="py-3 px-2 text-slate-800">{item.descripcion}</td>
                      <td className="py-3 px-2 text-right font-mono font-bold text-emerald-600">
                        + {item.monto.toLocaleString("es-BO", { minimumFractionDigits: 2 })} Bs
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Justificación Formatted */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <h3 className="text-xs font-bold text-[#001B47] uppercase tracking-wider">
            Justificación
          </h3>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-700">
            {modificacion.justificacionCodigos}
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50/50 p-4 rounded-xl border border-slate-200">
            {modificacion.justificacionTexto}
          </p>
        </div>
      </div>
    </SigefiShell>
  );
}
