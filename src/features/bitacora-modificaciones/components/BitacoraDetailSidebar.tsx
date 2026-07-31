import React from "react";
import {
  X,
  History,
  FileText,
  UserCheck,
  Calendar,
  Clock,
  TrendingDown,
  TrendingUp,
  Tag,
  ExternalLink,
  Info,
} from "lucide-react";
import { ModificacionPresupuestariaSummary } from "../types";
import { formatBolivianos } from "@/src/features/seguimiento-gastos/utils/metrics-calculator";

interface BitacoraDetailSidebarProps {
  modificacion: ModificacionPresupuestariaSummary | null;
  onClose: () => void;
}

export function BitacoraDetailSidebar({
  modificacion,
  onClose,
}: BitacoraDetailSidebarProps) {
  if (!modificacion) return null;

  const partidasDisminuidas = modificacion.partidasAfectadas.filter(
    (p) => p.tipoImpacto === "disminucion"
  );
  const partidasIncrementadas = modificacion.partidasAfectadas.filter(
    (p) => p.tipoImpacto === "incremento"
  );

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[540px] bg-white border-l border-border shadow-2xl z-40 flex flex-col justify-between transition-transform duration-300">
      {/* Header del Sidebar Jira Style */}
      <div className="p-5 border-b border-border bg-[#f8fafc] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-lg bg-[#003770]/10 text-[#003770]">
            <History className="w-5 h-5" />
          </span>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[11px] font-mono font-bold text-[#003770]">
                {modificacion.codigo}
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#001B47] line-clamp-1">
              {modificacion.nombreProyecto || "Proyecto DICYT"}
            </h3>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-muted-foreground hover:bg-slate-200 transition-colors"
          title="Cerrar panel"
        >
          <X className="w-5 h-5 text-[#001B47]" />
        </button>
      </div>

      {/* Cuerpo Informativo Limpio */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* SECCIÓN FECHAS Y RESPONSABLES */}
        <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-border">
          {/* Solicitante */}
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold block">
              Fecha Solicitud:
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              {modificacion.fechaSolicitud}
            </div>
            <p className="text-[11px] text-muted-foreground truncate" title={modificacion.solicitadoPor}>
              {modificacion.solicitadoPor}
            </p>
          </div>

          {/* Aprobador */}
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold block">
              Fecha Aprobación:
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
              <Calendar className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              {modificacion.fechaAprobacion}
            </div>
            <p className="text-[11px] font-semibold text-[#003770] truncate" title={modificacion.aprobadoPor}>
              {modificacion.aprobadoPor}
            </p>
          </div>
        </div>

        {/* DOCUMENTO DE RESPALDO (Si aplica) */}
        {modificacion.documentoRespaldoUrl && (
          <div className="bg-blue-50/40 p-3 rounded-xl border border-blue-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#003770] shrink-0" />
              <span className="font-semibold text-[#001B47]">Resolución / Documento Respaldatorio</span>
            </div>
            <a
              href={modificacion.documentoRespaldoUrl}
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 bg-white border border-blue-200 rounded-lg text-[11px] font-bold text-[#003770] hover:bg-blue-50 flex items-center gap-1 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              Ver PDF
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* JUSTIFICACIÓN COMPLETA */}
        <div className="space-y-1.5">
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
            Justificación / Motivo Registrado:
          </span>
          <div className="bg-slate-50 p-4 rounded-xl border border-border/80 text-xs font-medium text-[#001B47] leading-relaxed">
            {modificacion.justificacion}
          </div>
        </div>

        {/* DESGLOSE SENCILLO DE PARTIDAS AFECTADAS */}
        <div className="space-y-4 pt-2 border-t border-border">
          <h4 className="text-xs font-bold text-[#003770] uppercase tracking-wider">
            Detalle de Partidas Afectadas
          </h4>

          {/* 1. Partidas Decrementadas (-) */}
          {partidasDisminuidas.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-amber-800 uppercase flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5 text-amber-700" />
                Partidas Decrementadas (-)
              </span>
              <div className="space-y-2">
                {partidasDisminuidas.map((p) => (
                  <div
                    key={p.id}
                    className="bg-amber-50/50 border border-amber-200/80 p-3 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="font-mono font-bold px-2 py-0.5 rounded bg-white text-[#003770] border border-amber-200">
                          <Tag className="w-3 h-3 inline me-1" />
                          {p.codigoPartida}
                        </span>
                        <span className="font-bold text-[#001B47]">{p.nombrePartida}</span>
                      </div>
                    </div>
                    <span className="font-extrabold text-amber-900 text-sm">
                      -{formatBolivianos(p.monto)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Partidas Incrementadas (+) */}
          {partidasIncrementadas.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-emerald-800 uppercase flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                Partidas Incrementadas (+)
              </span>
              <div className="space-y-2">
                {partidasIncrementadas.map((p) => (
                  <div
                    key={p.id}
                    className="bg-emerald-50/50 border border-emerald-200/80 p-3 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="font-mono font-bold px-2 py-0.5 rounded bg-white text-[#003770] border border-emerald-200">
                          <Tag className="w-3 h-3 inline me-1" />
                          {p.codigoPartida}
                        </span>
                        <span className="font-bold text-[#001B47]">{p.nombrePartida}</span>
                      </div>
                    </div>
                    <span className="font-extrabold text-emerald-900 text-sm">
                      +{formatBolivianos(p.monto)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer del Sidebar */}
      <div className="p-4 border-t border-border bg-slate-50 text-right">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-white border border-border rounded-lg text-xs font-semibold text-[#001B47] hover:bg-slate-100 transition-colors shadow-2xs"
        >
          Cerrar Detalle
        </button>
      </div>
    </div>
  );
}
