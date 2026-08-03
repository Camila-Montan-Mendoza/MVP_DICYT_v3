"use client";

import { useState } from "react";
import { TaskViewProps } from "../view-types";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
} from "lucide-react";

export default function Tarea1RevisionPresupuestariaActive({
  tarea,
  tramite,
  ejecutarTransicion,
  onActionSuccess,
}: TaskViewProps) {
  const [observaciones, setObservaciones] = useState("");
  const [showObservarModal, setShowObservarModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  // Filtros de tabla
  const [searchQuery, setSearchQuery] = useState("");
  const [montoQuery, setMontoQuery] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("suficiente");

  const acciones = tarea.accionesDisponibles || [];

  // Mapeo dinámico de acciones (Aprobar vs Observar/Rechazar)
  const accionObservar = acciones.find(
    (a) =>
      a.nombreAccion.toLowerCase().includes("observ") ||
      a.nombreAccion.toLowerCase().includes("rechaz")
  ) || {
    idTransicion: 2,
    nombreAccion: "Observar",
  };

  const accionAprobar = acciones.find(
    (a) =>
      !a.nombreAccion.toLowerCase().includes("observ") &&
      !a.nombreAccion.toLowerCase().includes("rechaz")
  ) || {
    idTransicion: 1,
    nombreAccion: "Aprobar Preventivo",
  };

  const handleAction = async (idTransicion: number, obsText?: string) => {
    if (!ejecutarTransicion) return;

    setIsSubmitting(true);
    setFeedback(null);

    const textToSubmit = obsText !== undefined ? obsText : observaciones;

    const res = await ejecutarTransicion(idTransicion, textToSubmit, {
      observacionesDetalle: textToSubmit,
    });

    setIsSubmitting(false);

    if (res.success) {
      setFeedback({ type: "success", message: res.message || "Acción ejecutada correctamente." });
      setShowObservarModal(false);
      if (onActionSuccess) onActionSuccess();
    } else {
      setFeedback({ type: "error", message: res.message || "Error al procesar la acción." });
    }
  };

  // Ítems a desplegar: de la HU/Trámite o fallback idéntico al mockup
  const itemsBase =
    tramite?.items && tramite.items.length > 0
      ? tramite.items.map((it, idx) => {
          const totalVal =
            it.total || it.cantidad * (it.precioReferencial || it.precioUnitario || 1000);
          return {
            cantidad: it.cantidad,
            item: it.nombre,
            partida: it.partidaPresupuestaria || String(4210 + idx * 10),
            montoSolicitado: `${totalVal} Bs`,
            presupuestoEnPartida: `${totalVal + 5000} Bs`,
            estado: "SUFICIENTE",
          };
        })
      : [
          {
            cantidad: 1,
            item: "Computador personal",
            partida: "4210",
            montoSolicitado: "3456 Bs",
            presupuestoEnPartida: "10000 Bs",
            estado: "SUFICIENTE",
          },
          {
            cantidad: 2,
            item: "Parlante ATMOS",
            partida: "4220",
            montoSolicitado: "4567 Bs",
            presupuestoEnPartida: "10000 Bs",
            estado: "SUFICIENTE",
          },
          {
            cantidad: 10,
            item: "Microfono Profesional",
            partida: "4230",
            montoSolicitado: "7655 Bs",
            presupuestoEnPartida: "15000 Bs",
            estado: "SUFICIENTE",
          },
          {
            cantidad: 1,
            item: "Microondas",
            partida: "4240",
            montoSolicitado: "10000 Bs",
            presupuestoEnPartida: "10900 Bs",
            estado: "SUFICIENTE",
          },
        ];

  // Filtrado simple
  const itemsFiltrados = itemsBase.filter((it) => {
    const matchesSearch =
      it.item.toLowerCase().includes(searchQuery.toLowerCase()) || it.partida.includes(searchQuery);
    const matchesEstado =
      estadoFilter === "todos" || it.estado.toLowerCase() === estadoFilter.toLowerCase();
    return matchesSearch && matchesEstado;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Barra de Filtros y Búsqueda */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-2">
        {/* Filtro BUSCAR */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            BUSCAR
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="tramite, código...\\"
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#001B47]/20 transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Filtro MONTO */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            MONTO
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={montoQuery}
                onChange={(e) => setMontoQuery(e.target.value)}
                placeholder="tramite, código...\\"
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#001B47]/20 transition-all shadow-2xs"
              />
            </div>
          </div>
        </div>

        {/* Filtro ESTADO */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            ESTADO
          </label>
          <select
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#001B47]/20 transition-all cursor-pointer shadow-2xs"
          >
            <option value="suficiente">Suficiente</option>
            <option value="todos">Todos</option>
            <option value="insuficiente">Insuficiente</option>
          </select>
        </div>
      </div>

      {/* Alertas de Feedback si existen */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs font-medium flex items-center gap-3 ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
              : "bg-rose-50 text-rose-900 border border-rose-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Contenedor Principal de la Tabla */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-6 text-center w-24">CANTIDAD</th>
                <th className="py-4 px-6">ITEM</th>
                <th className="py-4 px-6 text-left">Nº PARTIDA</th>
                <th className="py-4 px-6 text-left">MONTO SOLICITADO</th>
                <th className="py-4 px-6 text-left">PRESUPUESTO EN PARTIDA</th>
                <th className="py-4 px-6 text-center">ESTADO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {itemsFiltrados.map((it, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-5 px-6 text-center text-slate-600 font-medium">
                    {it.cantidad}
                  </td>
                  <td className="py-5 px-6 font-bold text-[#0B192C]">{it.item}</td>
                  <td className="py-5 px-6 text-slate-700 font-medium">{it.partida}</td>
                  <td className="py-5 px-6 text-slate-400 font-medium">{it.montoSolicitado}</td>
                  <td className="py-5 px-6 font-black text-[#0B192C]">{it.presupuestoEnPartida}</td>
                  <td className="py-5 px-6 text-center">
                    <span className="inline-block bg-[#EAF5EA] text-[#2E7D32] px-3.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider">
                      {it.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginador inferior dentro del Card */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium bg-white">
          <span>Mostrando 1-{itemsFiltrados.length} de 24 trámites</span>
          <div className="flex items-center gap-1.5">
            <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-400 transition-colors disabled:opacity-40">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Botones de Acción Inferiores */}
      <div className="pt-4 flex items-center justify-between">
        {/* Botón Izquierdo: Observar */}
        <button
          onClick={() => setShowObservarModal(true)}
          disabled={isSubmitting}
          className="px-7 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 font-bold text-xs hover:bg-slate-50 transition-all shadow-xs disabled:opacity-50 flex items-center gap-2"
        >
          {isSubmitting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          )}
          <span>{accionObservar.nombreAccion || "Observar"}</span>
        </button>

        {/* Botón Derecho: Aprobar Preventivo */}
        <button
          onClick={() => handleAction(accionAprobar.idTransicion)}
          disabled={isSubmitting}
          className="px-8 py-3 bg-[#0B192C] hover:bg-[#002855] text-white font-bold text-xs rounded-xl transition-all shadow-xs disabled:opacity-50 flex items-center gap-2"
        >
          {isSubmitting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5" />
          )}
          <span>{accionAprobar.nombreAccion || "Aprobar Preventivo"}</span>
        </button>
      </div>

      {/* Modal / Popover para ingresar Observaciones al hacer clic en Observar */}
      {showObservarModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl border border-slate-100">
            <h3 className="text-sm font-bold text-[#0B192C]">Registrar Observaciones</h3>
            <p className="text-xs text-slate-500">
              Detalle el motivo de la observación o devolución del trámite presupuestario.
            </p>
            <textarea
              rows={4}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Escriba las observaciones presupuestarias..."
              className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001B47]/20 resize-none"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowObservarModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleAction(accionObservar.idTransicion, observaciones)}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 rounded-lg transition-all flex items-center gap-1.5"
              >
                {isSubmitting && <Loader2 className="w-3 h-3 animate-spin" />}
                Confirmar Observación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
