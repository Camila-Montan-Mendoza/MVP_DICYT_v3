"use client";

import { Calendar } from "lucide-react";
import { ProyectoDetalle } from "../types";

interface ProyectoInfoCardProps {
  proyecto: ProyectoDetalle;
}

function formatMonto(monto: number): string {
  return `${monto.toLocaleString("es-BO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs.`;
}

function formatFecha(fechaStr: string): string {
  if (!fechaStr) return "—";
  if (fechaStr.includes("/")) return fechaStr;
  try {
    const parts = fechaStr.split("T")[0].split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  } catch {
    // Return original string if format parsing fails
  }
  return fechaStr;
}

function Campo({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="text-xs font-bold text-[#001B47]">{value}</p>
    </div>
  );
}

export function ProyectoInfoCard({ proyecto }: ProyectoInfoCardProps) {
  const isPendiente = proyecto.estado.id === 1;
  const isEnRevision = proyecto.estado.id === 2;
  const isObservado = proyecto.estado.id === 3;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
      {/* Título y Estado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-base md:text-lg font-bold text-[#001B47]">
          {proyecto.nombre}
        </h2>

        <div>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
              isPendiente
                ? "bg-red-50 text-red-700 border border-red-200"
                : isEnRevision
                  ? "bg-amber-50 text-amber-800 border border-amber-200"
                  : isObservado
                    ? "bg-[#BC000C]/10 text-[#BC000C] border border-[#BC000C]/20"
                    : "bg-emerald-50 text-emerald-800 border border-emerald-200"
            }`}
          >
            {proyecto.estado.nombre}
          </span>
        </div>
      </div>

      {/* Grid de Metadatos 3 Columnas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-6">
        <Campo
          label="Investigador Principal"
          value={proyecto.investigadorPrincipal?.nombre ?? "Sin asignar"}
        />
        <Campo
          label="Presupuesto Total"
          value={formatMonto(proyecto.presupuestoTotal)}
        />
        <Campo label="Programa" value={proyecto.programa} />

        <Campo
          label="Fuente de Financiamiento"
          value={proyecto.fuenteFinanciamiento ?? "Recursos Propios IDH"}
        />
        <Campo
          label="Fecha de Inicio"
          value={
            <span className="inline-flex items-center gap-1.5 font-normal text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatFecha(proyecto.fechaInicio)}</span>
            </span>
          }
        />
        <Campo
          label="Fecha de Fin"
          value={
            <span className="inline-flex items-center gap-1.5 font-normal text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatFecha(proyecto.fechaFin)}</span>
            </span>
          }
        />
      </div>
    </div>
  );
}
