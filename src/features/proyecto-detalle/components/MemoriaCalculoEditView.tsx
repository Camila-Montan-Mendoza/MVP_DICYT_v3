"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  Trash2,
  Plus,
  AlertCircle,
  CheckCircle2,
  Tag,
  Check,
  ChevronDown,
} from "lucide-react";
import { PartidaCatalogo, ProyectoDetalle } from "../types";
import { useMemoriaCalculoEditor } from "../hooks/useMemoriaCalculoEditor";
import { mockProyectoService } from "../services/mockProyectoService";
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
    isSubmitting,
    feedback,
    updateMonto,
    removePartida,
    addPartidaFromCatalogo,
    enviarARevision,
  } = useMemoriaCalculoEditor(proyecto, onProyectoUpdated);

  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar el menú desplegable al hacer clic fuera del componente
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const catalogoResultados = mockProyectoService.buscarCatalogoPartidas(searchQuery);
  const yaIncluidasIds = new Set(partidas.map((p) => p.id));

  const handleSelectPartida = (partida: PartidaCatalogo) => {
    addPartidaFromCatalogo(partida);
    setSearchQuery("");
    setIsDropdownOpen(false);
  };

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

      {/* Encabezado Principal */}
      <div>
        <h3 className="text-base font-bold text-[#001B47]">
          Agregue las partidas necesarias para su memoria de cálculo
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Busque e ingrese las partidas requeridas seleccionándolas directamente desde el buscador.
        </p>
      </div>

      {/* Buscador Integrado de Partidas con Desplegable Directo */}
      <div className="relative" ref={dropdownRef}>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setIsDropdownOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsDropdownOpen(true);
            }}
            placeholder="Buscar por código (ej: 101), nombre de partida o ítem para agregar..."
            className="w-full text-xs pl-10 pr-10 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002855] focus:border-[#002855] text-slate-800 font-medium shadow-2xs transition-all"
          />
          <ChevronDown
            className={`w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-transform ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {/* Menú Desplegable con Lista de Partidas Disponibles */}
        {isDropdownOpen && (
          <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden max-h-72 overflow-y-auto divide-y divide-slate-100 animate-in fade-in-50 zoom-in-95">
            {catalogoResultados.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400 italic">
                No se encontraron partidas coincidentes con &quot;{searchQuery}&quot;.
              </div>
            ) : (
              catalogoResultados.map((item) => {
                const yaIncluida =
                  yaIncluidasIds.has(item.id) ||
                  partidas.some((p) => String(p.codigoPartida) === String(item.codigo));

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (!yaIncluida) handleSelectPartida(item);
                    }}
                    className={`p-3 flex items-center justify-between gap-3 transition-colors ${
                      yaIncluida
                        ? "bg-slate-50 opacity-60 cursor-not-allowed"
                        : "hover:bg-slate-50 cursor-pointer group"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-[#002855] bg-[#002855]/10 px-2 py-0.5 rounded-md">
                          {item.codigo}
                        </span>
                        <span className="text-xs font-bold text-[#001B47] group-hover:text-[#003770]">
                          {item.nombre}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {item.itemsRelacionados.map((rel) => (
                          <span
                            key={rel}
                            className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded"
                          >
                            {rel}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={yaIncluida}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!yaIncluida) handleSelectPartida(item);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all shrink-0 ${
                        yaIncluida
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : "bg-[#001B47] text-white hover:bg-[#002855] shadow-2xs"
                      }`}
                    >
                      {yaIncluida ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-slate-400" />
                          <span>Agregada</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Agregar</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Tabla Interactiva de Partidas Agregadas */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
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
            {partidas.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-slate-400 italic">
                  <Tag className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                  <p className="font-semibold text-slate-600 text-xs">
                    No hay partidas agregadas aún.
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Utilice el buscador superior para seleccionar y agregar partidas a su memoria de
                    cálculo.
                  </p>
                </td>
              </tr>
            ) : (
              partidas.map((partida) => (
                <tr key={partida.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-slate-500 font-mono">
                    {partida.codigoPartida || partida.id}
                  </td>
                  <td className="px-6 py-4 font-bold text-[#001B47]">{partida.nombrePartida}</td>
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
    </div>
  );
}
