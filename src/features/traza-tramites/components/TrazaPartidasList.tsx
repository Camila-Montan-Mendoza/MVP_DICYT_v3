import React, { useState } from "react";
import {
  Tag,
  ChevronDown,
  ChevronRight,
  Box,
  HardDrive,
  Wrench,
  Clock,
  CheckCircle2,
  FileText,
  ArrowLeftRight,
} from "lucide-react";
import { PartidaTrazaSummary, ItemGastoPartidaDetail } from "../types";
import { formatBolivianos } from "@/src/features/seguimiento-gastos/utils/metrics-calculator";

interface TrazaPartidasListProps {
  partidas: PartidaTrazaSummary[];
  selectedItemId: number | null;
  onSelectItem: (partida: PartidaTrazaSummary, item: ItemGastoPartidaDetail) => void;
}

export function TrazaPartidasList({
  partidas,
  selectedItemId,
  onSelectItem,
}: TrazaPartidasListProps) {
  // Estado local para expandir/colapsar subfilas por partida
  const [expandedPartidaIds, setExpandedPartidaIds] = useState<number[]>(
    partidas.map((p) => p.id) // Desplegados por defecto para visibilidad directa
  );

  if (!partidas || partidas.length === 0) {
    return (
      <div className="bg-white border border-border rounded-xl p-8 text-center text-xs text-muted-foreground italic">
        No existen partidas presupuestarias registradas para el filtro seleccionado.
      </div>
    );
  }

  const toggleExpandPartida = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedPartidaIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  const renderBadgeEstado = (estado: 1 | 2 | 3 | 4) => {
    switch (estado) {
      case 1:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-2.5 h-2.5 text-amber-700" />
            Preventivo
          </span>
        );
      case 2:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200">
            <FileText className="w-2.5 h-2.5 text-sky-700" />
            Comprometido
          </span>
        );
      case 3:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-700" />
            Gastado
          </span>
        );
      case 4:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300">
            <ArrowLeftRight className="w-2.5 h-2.5 text-slate-600" />
            Revertido
          </span>
        );
      default:
        return null;
    }
  };

  const renderBadgeTipo = (tipo: "material" | "activo_fijo" | "servicio") => {
    switch (tipo) {
      case "material":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#003770] border border-blue-200 shrink-0">
            <Box className="w-2.5 h-2.5 text-[#003770]" />
            Material
          </span>
        );
      case "activo_fijo":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200 shrink-0">
            <HardDrive className="w-2.5 h-2.5 text-purple-700" />
            Activo Fijo
          </span>
        );
      case "servicio":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
            <Wrench className="w-2.5 h-2.5 text-emerald-700" />
            Servicio
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#f8fafc] border-b border-border text-muted-foreground uppercase text-[11px] font-semibold tracking-wider">
              <th className="py-3 px-3 w-10 text-center"></th>
              <th className="py-3 px-3 w-28">Partida</th>
              <th className="py-3 px-4">Descripción de Partida / Ítems Afectantes</th>
              <th className="py-3 px-4 text-center w-28">Estado / Tipo</th>
              <th className="py-3 px-4 text-right w-32">Presupuesto</th>
              <th className="py-3 px-4 text-right w-32">Saldo Disp.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {partidas.map((p) => {
              const isExpanded = expandedPartidaIds.includes(p.id);

              return (
                <React.Fragment key={p.id}>
                  {/* FILA PRINCIPAL: PARTIDA PRESUPUESTARIA */}
                  <tr
                    onClick={(e) => toggleExpandPartida(p.id, e)}
                    className="bg-slate-50/70 border-b border-border/80 hover:bg-slate-100/80 cursor-pointer transition-colors font-semibold"
                  >
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={(e) => toggleExpandPartida(p.id, e)}
                        className="p-1 rounded hover:bg-slate-200 text-[#003770] transition-colors"
                        title={isExpanded ? "Colapsar subfilas" : "Expandir subfilas de ítems"}
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                    </td>

                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 bg-[#003770]/10 text-[#003770] px-2 py-0.5 rounded text-[11px] font-mono font-bold border border-[#003770]/20">
                        <Tag className="w-3 h-3" />
                        {p.codigoPartida}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-[#001B47]">{p.nombrePartida}</div>
                      <div className="text-[11px] text-muted-foreground font-normal truncate max-w-[320px]">
                        {p.nombreProyecto}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="text-[11px] font-bold text-slate-600 bg-white border border-border px-2 py-0.5 rounded-full shadow-2xs">
                        {p.items.length} {p.items.length === 1 ? "Ítem" : "Ítems"}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right font-medium text-[#001B47]">
                      {formatBolivianos(p.presupuestoAsignado)}
                    </td>

                    <td className="py-3 px-4 text-right font-bold text-emerald-700">
                      {formatBolivianos(p.presupuestoDisponible)}
                    </td>
                  </tr>

                  {/* SUBFILAS DESPLEGABLES: ÍTEMS DE GASTO AFECTANTES */}
                  {isExpanded &&
                    p.items.map((item) => {
                      const isItemSelected = item.id === selectedItemId;

                      return (
                        <tr
                          key={item.id}
                          onClick={() => onSelectItem(p, item)}
                          className={`cursor-pointer transition-colors border-b border-border/40 ${
                            isItemSelected
                              ? "bg-blue-50/90 border-l-4 border-l-[#003770]"
                              : "bg-white hover:bg-blue-50/40"
                          }`}
                        >
                          <td className="py-2.5 px-3"></td>
                          <td className="py-2.5 px-3 text-right">
                            <span className="text-slate-400 font-mono text-[11px]">↳</span>
                          </td>

                          {/* Descripción y Tipo de Ítem */}
                          <td className="py-2.5 px-4">
                            <div className="flex items-center gap-2">
                              {renderBadgeTipo(item.tipoItem)}
                              <span className="font-bold text-[#001B47] text-xs">
                                {item.nombreItem}
                              </span>
                            </div>
                          </td>

                          {/* Estado del Ítem */}
                          <td className="py-2.5 px-4 text-center">
                            {renderBadgeEstado(item.estadoItem)}
                          </td>

                          {/* Indicador de Acción Ver Detalle */}
                          <td className="py-2.5 px-4 text-right font-semibold text-slate-500 text-[11px]">
                            Ver detalle →
                          </td>

                          {/* Importe Afectado del Ítem */}
                          <td className="py-2.5 px-4 text-right font-bold text-[#001B47]">
                            <span
                              className={
                                item.estadoItem === 4 ? "line-through text-slate-400" : ""
                              }
                            >
                              {formatBolivianos(item.montoTotal)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
