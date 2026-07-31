import React from "react";
import {
  X,
  Tag,
  Clock,
  CheckCircle2,
  ArrowLeftRight,
  Filter,
  Box,
  HardDrive,
  Wrench,
  UserCheck,
  MapPin,
  Calendar,
  FileText,
  Package,
} from "lucide-react";
import { PartidaTrazaSummary, ItemGastoPartidaDetail } from "../types";
import { formatBolivianos } from "@/src/features/seguimiento-gastos/utils/metrics-calculator";

interface TrazaDetailSidebarProps {
  partida: PartidaTrazaSummary | null;
  item: ItemGastoPartidaDetail | null;
  statusFilter: number | "all";
  onStatusFilterChange: (status: number | "all") => void;
  onClose: () => void;
}

export function TrazaDetailSidebar({
  partida,
  item,
  statusFilter,
  onStatusFilterChange,
  onClose,
}: TrazaDetailSidebarProps) {
  if (!partida || !item) return null;

  const isRevertido = item.estadoItem === 4;
  const cantidadEfectiva = isRevertido ? 0 : (item.cantidadAdquirida ?? 0);

  // Badges informativos de Estado (1: Preventivo, 2: Comprometido, 3: Gastado, 4: Revertido)
  const renderBadgeEstado = (estado: 1 | 2 | 3 | 4) => {
    switch (estado) {
      case 1:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-700" />
            Preventivo (Reservado)
          </span>
        );
      case 2:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200">
            <FileText className="w-3 h-3 text-sky-700" />
            Comprometido
          </span>
        );
      case 3:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            Gastado
          </span>
        );
      case 4:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300">
            <ArrowLeftRight className="w-3 h-3 text-slate-600" />
            Revertido (Anulado)
          </span>
        );
      default:
        return null;
    }
  };

  // Badge para el tipo de ítem
  const renderBadgeTipo = (tipo: "material" | "activo_fijo" | "servicio") => {
    switch (tipo) {
      case "material":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#003770] border border-blue-200">
            <Box className="w-3 h-3 text-[#003770]" />
            Material
          </span>
        );
      case "activo_fijo":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200">
            <HardDrive className="w-3 h-3 text-purple-700" />
            Activo Fijo
          </span>
        );
      case "servicio":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Wrench className="w-3 h-3 text-emerald-700" />
            Servicio
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[540px] bg-white border-l border-border shadow-2xl z-40 flex flex-col justify-between transition-transform duration-300">
      {/* Header del Panel Lateral Jira Style */}
      <div className="p-5 border-b border-border bg-[#f8fafc] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="p-2 bg-[#003770]/10 text-[#003770] rounded-lg">
            <Package className="w-4 h-4" />
          </span>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              {renderBadgeTipo(item.tipoItem)}
              <span className="text-[11px] font-mono font-bold text-[#003770]">
                Partida {partida.codigoPartida}
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#001B47] line-clamp-1">{item.nombreItem}</h3>
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

      {/* Cuerpo Informativo: Detalle Técnico Completo del Ítem Seleccionado */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Cabecera con Estado e Importe Afectado */}
        <div className="bg-slate-50 border border-border rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">
              Estado del Ítem
            </span>
            {renderBadgeEstado(item.estadoItem)}
          </div>

          <div className="text-right">
            <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">
              Importe Afectado
            </span>
            <span
              className={`text-base font-extrabold ${
                isRevertido ? "line-through text-slate-400" : "text-[#001B47]"
              }`}
            >
              {formatBolivianos(item.montoTotal)}
            </span>
          </div>
        </div>

        {/* DETALLE ESPECÍFICO SEGÚN TIPO DE ÍTEM */}

        {/* 1. TIPO: MATERIAL */}
        {item.tipoItem === "material" && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[#003770] uppercase tracking-wider border-b border-border pb-1">
              Detalle del Material
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50/40 p-3 rounded-xl border border-blue-100">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-0.5">
                  Cantidad Adquirida:
                </span>
                <span className="text-sm font-extrabold text-[#003770]">
                  {cantidadEfectiva} {isRevertido ? "(0 por reversión)" : "unidades"}
                </span>
              </div>

              <div className="bg-blue-50/40 p-3 rounded-xl border border-blue-100">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-0.5">
                  Fecha de Recepción:
                </span>
                <span className="text-xs font-bold text-[#001B47] flex items-center gap-1.5 mt-1">
                  <Calendar className="w-3.5 h-3.5 text-[#003770]" />
                  {item.fechaRecepcion || "No registrada"}
                </span>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">
                Especificación:
              </span>
              <p className="bg-slate-50 p-3 rounded-xl border border-border/80 text-xs font-medium text-[#001B47] leading-relaxed">
                {item.especificacion || "Sin especificación registrada"}
              </p>
            </div>
          </div>
        )}

        {/* 2. TIPO: ACTIVO FIJO */}
        {item.tipoItem === "activo_fijo" && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wider border-b border-border pb-1">
              Detalle del Activo Fijo
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-purple-50/40 p-3 rounded-xl border border-purple-100">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-0.5">
                  Cantidad Adquirida:
                </span>
                <span className="text-sm font-extrabold text-purple-900">
                  {cantidadEfectiva} {isRevertido ? "(0 por reversión)" : "unidades"}
                </span>
              </div>

              <div className="bg-purple-50/40 p-3 rounded-xl border border-purple-100">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-0.5">
                  Fecha de Recepción:
                </span>
                <span className="text-xs font-bold text-[#001B47] flex items-center gap-1.5 mt-1">
                  <Calendar className="w-3.5 h-3.5 text-purple-700" />
                  {item.fechaRecepcion || "No registrada"}
                </span>
              </div>
            </div>

            <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-border/80">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-purple-700 shrink-0" />
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">Custodio:</span>
                  <span className="text-xs font-bold text-[#001B47]">{item.custodio || "Sin custodio asignado"}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                <MapPin className="w-4 h-4 text-purple-700 shrink-0" />
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">Lugar / Ubicación:</span>
                  <span className="text-xs font-bold text-[#001B47]">{item.lugar || "Sin ubicación especificada"}</span>
                </div>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">
                Especificación Técnica:
              </span>
              <p className="bg-slate-50 p-3 rounded-xl border border-border/80 text-xs font-medium text-[#001B47] leading-relaxed">
                {item.especificacionTecnica || item.especificacion || "Sin especificación técnica registrada"}
              </p>
            </div>
          </div>
        )}

        {/* 3. TIPO: SERVICIO */}
        {item.tipoItem === "servicio" && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider border-b border-border pb-1">
              Detalle del Servicio
            </h4>

            <div className="bg-emerald-50/40 p-3 rounded-xl border border-emerald-100 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground uppercase font-bold">
                Fecha de Conformidad:
              </span>
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-700" />
                {item.fechaConformidad || "En trámite de conformidad"}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">
                Especificación del Servicio:
              </span>
              <p className="bg-slate-50 p-3 rounded-xl border border-border/80 text-xs font-medium text-[#001B47] leading-relaxed">
                {item.especificacion || "Sin especificación de servicio registrada"}
              </p>
            </div>
          </div>
        )}

        {/* Contexto de la Partida Asignada */}
        <div className="pt-4 border-t border-border">
          <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-2">
            Partida Presupuestaria Asignada:
          </span>
          <div className="bg-slate-50 border border-border rounded-xl p-3 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-[#003770]">{partida.nombrePartida}</span>
              <span className="text-[11px] text-muted-foreground block font-mono">
                SISIN: {partida.codigoSisin}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-muted-foreground block">Saldo Disp.</span>
              <span className="font-bold text-emerald-700">{formatBolivianos(partida.presupuestoDisponible)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer del Sidebar */}
      <div className="p-4 border-t border-border bg-slate-50 text-right">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-white border border-border rounded-lg text-xs font-semibold text-[#001B47] hover:bg-slate-100 transition-colors shadow-2xs"
        >
          Cerrar Detalle del Ítem
        </button>
      </div>
    </div>
  );
}
