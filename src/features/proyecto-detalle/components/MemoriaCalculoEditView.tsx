"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, Trash2, Plus, AlertCircle, CheckCircle2 } from "lucide-react";
import { PartidaMemoriaCalculo, ProyectoDetalle } from "../types";
import { useMemoriaCalculoEditor } from "../hooks/useMemoriaCalculoEditor";
import { PartidaSearchModal } from "./PartidaSearchModal";
import { PresupuestoConsolidadoFooter } from "./PresupuestoConsolidadoFooter";

interface MemoriaCalculoEditViewProps {
  proyecto: ProyectoDetalle;
  onProyectoUpdated?: (updated: ProyectoDetalle) => void;
  onCancelar?: () => void;
}

export function MemoriaCalculoEditView({
  proyecto,
  onProyectoUpdated,
  onCancelar,
}: MemoriaCalculoEditViewProps) {
  const {
    partidas,
    totalPartidas,
    presupuestoTotal,
    excedente,
    esValidoParaEnviar,
    isSearchModalOpen,
    setIsSearchModalOpen,
    isSubmitting,
    feedback,
    updateMonto,
    removePartida,
    addPartidaFromCatalogo,
    enviarARevision,
  } = useMemoriaCalculoEditor(proyecto, onProyectoUpdated);

  const [filterText, setFilterText] = useState("");

  const partidasFiltradas = partidas.filter(
    (p) =>
      String(p.codigoPartida || p.id).includes(filterText.trim()) ||
      p.nombrePartida.toLowerCase().includes(filterText.trim().toLowerCase())
  );

  const yaIncluidasIds = new Set(partidas.map((p) => p.id));

  return (
    <div className="space-y-5">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 border shadow-xs ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Encabezado e Instrucción */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="text-base font-bold text-[#001B47]">
          Agregue las partidas necesarias para su memoria de calculo
        </h3>

        <button
          type="button"
          onClick={() => setIsSearchModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#001B47] text-white font-bold text-xs rounded-xl hover:bg-[#002855] transition-all shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir Partida</span>
        </button>
      </div>

      {/* Tabla Interactiva de Partidas (Matching Image 1) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Barra de Búsqueda Local en la Tabla */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Buscar por ítem o partida..."
              className="w-full text-xs pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002855]"
            />
          </div>
          <button
            type="button"
            onClick={() => setIsSearchModalOpen(true)}
            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-[#001B47] hover:bg-slate-50 transition-colors shrink-0"
            title="Abrir catálogo de partidas"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Tabla */}
        <table className="w-full text-left text-xs">
          <thead className="bg-[#f8fafc] text-[#64748b] font-bold border-b border-slate-200">
            <tr>
              <th className="px-6 py-3.5 w-24">ID</th>
              <th className="px-6 py-3.5">Nombre de Partida</th>
              <th className="px-6 py-3.5 text-right w-48">Monto (Bs.)</th>
              <th className="px-6 py-3.5 text-center w-16">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {partidasFiltradas.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-400 italic">
                  {filterText
                    ? `No hay partidas que coincidan con "${filterText}".`
                    : "No ha agregado partidas a la memoria de cálculo."}
                </td>
              </tr>
            ) : (
              partidasFiltradas.map((partida) => (
                <tr key={partida.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-slate-500 font-mono">
                    {partida.codigoPartida || partida.id}
                  </td>
                  <td className="px-6 py-4 font-bold text-[#001B47]">
                    {partida.nombrePartida}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <input
                      type="number"
                      min={0}
                      step={100}
                      value={partida.monto === 0 ? "" : partida.monto}
                      onChange={(e) => updateMonto(partida.id, parseFloat(e.target.value))}
                      placeholder="0.00"
                      className="w-36 text-right text-xs font-mono font-bold px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002855] text-slate-800 bg-white"
                    />
                  </td>
                  <td className="px-6 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => removePartida(partida.id)}
                      className="p-1.5 text-slate-400 hover:text-[#BC000C] hover:bg-red-50 rounded-lg transition-colors"
                      title="Quitar partida"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Consolidado con Métricas y Botones de Acción */}
      <PresupuestoConsolidadoFooter
        totalPartidas={totalPartidas}
        presupuestoTotal={presupuestoTotal}
        excedente={excedente}
        esValidoParaEnviar={esValidoParaEnviar}
        isSubmitting={isSubmitting}
        onCancelar={onCancelar}
        onEnviarARevision={enviarARevision}
      />

      {/* Modal de Búsqueda en Catálogo */}
      <PartidaSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectPartida={addPartidaFromCatalogo}
        partidasYaIncluidasIds={yaIncluidasIds}
      />
    </div>
  );
}
