"use client";

import { useState, useMemo } from "react";
import { Calendar, ShoppingCart, CheckCircle2, Clock } from "lucide-react";
import { ProyectoDetalle } from "../types";
import { PresupuestoExecutionPanel } from "@/src/features/seguimiento-gastos/components/PresupuestoExecutionPanel";
import { ProyectoPartidasDetail } from "@/src/features/seguimiento-gastos/components/ProyectoPartidasDetail";
import { PartidaConcretaSummary } from "@/src/features/seguimiento-gastos/types";
import {
  calculateMetricsByGestion,
  formatBolivianos,
} from "@/src/features/seguimiento-gastos/utils/metrics-calculator";

interface ProyectoEjecucionPresupuestariaProps {
  proyecto: ProyectoDetalle;
}

export function ProyectoEjecucionPresupuestaria({
  proyecto,
}: ProyectoEjecucionPresupuestariaProps) {
  const [selectedGestion, setSelectedGestion] = useState<number | "global">(2026);

  // Recalcular métricas de este proyecto específico según la gestión seleccionada
  const basePresupuesto = proyecto.presupuestoTotal || proyecto.totalMemoriaCalculo || 100000;
  const metrics = useMemo(() => {
    return calculateMetricsByGestion(basePresupuesto, selectedGestion);
  }, [basePresupuesto, selectedGestion]);

  // Convertir memoriaCalculo del proyecto a PartidaConcretaSummary[]
  const partidasSummary: PartidaConcretaSummary[] = useMemo(() => {
    const factor = selectedGestion === 2025 ? 0.85 : selectedGestion === "global" ? 1.65 : 1.0;

    if (!proyecto.memoriaCalculo || proyecto.memoriaCalculo.length === 0) {
      return [];
    }

    return proyecto.memoriaCalculo.map((p, idx) => {
      const baseMonto = (p as any).presupuestoAsignado ?? p.monto ?? 0;
      const asignado = baseMonto * factor;
      const disponible = ((p as any).saldoDisponible ?? baseMonto * 0.65) * factor;
      const ejecutado = Math.max(0, asignado - disponible);

      const codNum =
        typeof p.codigoPartida === "number"
          ? p.codigoPartida
          : parseInt(p.codigoPartida, 10) || p.id || 30000;

      return {
        id: p.id || idx + 1,
        codigoPartida: codNum,
        nombrePartida: p.nombrePartida,
        presupuestoAsignado: asignado,
        presupuestoEjecutado: ejecutado,
        presupuestoDisponible: disponible,
        gestion: selectedGestion === "global" ? 2026 : Number(selectedGestion),
      };
    });
  }, [proyecto.memoriaCalculo, selectedGestion]);

  // Trámites de ejemplo asociados al proyecto
  const tramitesIniciados = [
    {
      id: "TR-2026-0089",
      tipo: "Modificación Presupuestaria",
      fecha: "28/01/2026",
      paso: "Paso 2/4: Revisión de Presupuestos",
      monto: 3240.24,
      estado: "PENDIENTE",
    },
    {
      id: "TR-2026-0042",
      tipo: "Compra de Insumos y Reactivos",
      fecha: "15/01/2026",
      paso: "Paso 4/4: Completado",
      monto: 15400.0,
      estado: "APROBADO",
    },
    {
      id: "TR-2026-0012",
      tipo: "Adquisición de Material de Oficina",
      fecha: "05/01/2026",
      paso: "Paso 4/4: Completado",
      monto: 2150.5,
      estado: "APROBADO",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Selector Único de Gestión Fiscal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-base font-extrabold text-[#001B47]">
            Ejecución Presupuestaria del Proyecto
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Consolidado de gastos ejecutados, métricas y trámites iniciados en este proyecto.
          </p>
        </div>

        {/* Filtro Exclusivo de Gestión Fiscal */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 px-3 py-1.5 rounded-xl text-xs shadow-2xs self-start sm:self-auto">
          <Calendar className="w-4 h-4 text-[#002855] shrink-0" />
          <span className="text-slate-500 font-bold shrink-0">Gestión:</span>
          <select
            value={selectedGestion}
            onChange={(e) => {
              const val = e.target.value === "global" ? "global" : Number(e.target.value);
              setSelectedGestion(val);
            }}
            className="bg-transparent font-extrabold text-[#001B47] focus:outline-none cursor-pointer"
          >
            <option value={2026}>Gestión 2026</option>
            <option value={2025}>Gestión 2025</option>
            <option value="global">Histórico Global</option>
          </select>
        </div>
      </div>

      {/* Gráfico y Donut Chart de Ejecución Exclusivo del Proyecto */}
      <PresupuestoExecutionPanel metrics={metrics} selectedGestion={selectedGestion} />

      {/* Desglose por Partidas del Proyecto */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-[#001B47]">
              Desglose de Saldos por Partida ({partidasSummary.length})
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Partidas presupuestarias aprobadas y su saldo disponible en este proyecto.
            </p>
          </div>
        </div>

        <ProyectoPartidasDetail partidas={partidasSummary} />
      </div>

      {/* Trámites e Historial Iniciados en este Proyecto */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-[#002855] rounded-xl border border-blue-200">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#001B47]">
                Trámites Registrados e Iniciados en este Proyecto
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Historial de compras, contrataciones y modificaciones presupuestarias en curso.
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#f8fafc] text-slate-600 font-bold border-b border-slate-200 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="px-5 py-3">Código Trámite</th>
                <th className="px-5 py-3">Tipo de Trámite</th>
                <th className="px-5 py-3">Fecha Inicio</th>
                <th className="px-5 py-3">Paso / Estado Actual</th>
                <th className="px-5 py-3 text-right">Monto (Bs)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {tramitesIniciados.map((tr) => (
                <tr key={tr.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3.5 font-extrabold font-mono text-[#001B47]">{tr.id}</td>
                  <td className="px-5 py-3.5 font-bold text-slate-800">{tr.tipo}</td>
                  <td className="px-5 py-3.5 text-slate-500 font-mono">{tr.fecha}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        tr.estado === "PENDIENTE"
                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                          : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      }`}
                    >
                      {tr.estado === "PENDIENTE" ? (
                        <Clock className="w-3 h-3 text-amber-600" />
                      ) : (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      )}
                      <span>{tr.paso}</span>
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono font-extrabold text-[#001B47]">
                    {formatBolivianos(tr.monto)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
