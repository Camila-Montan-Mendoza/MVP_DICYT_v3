"use client";

import { useState, useMemo } from "react";
import { Search, Plus, X, Tag } from "lucide-react";
import { PartidaCatalogo } from "../types";
import { mockProyectoService } from "../services/mockProyectoService";

interface PartidaSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPartida: (partida: PartidaCatalogo) => void;
  partidasYaIncluidasIds: Set<number | string>;
}

export function PartidaSearchModal({
  isOpen,
  onClose,
  onSelectPartida,
  partidasYaIncluidasIds,
}: PartidaSearchModalProps) {
  const [query, setQuery] = useState("");

  const resultados = useMemo(() => {
    return mockProyectoService.buscarCatalogoPartidas(query);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in-50 zoom-in-95">
        {/* Header Modal */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-[#001B47] text-white">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold">Buscar Partidas para la Memoria de Cálculo</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input Buscador */}
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por código (ej: 101), partida o ítem..."
              className="w-full text-xs pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002855]"
            />
          </div>
        </div>

        {/* Lista de Resultados */}
        <div className="p-4 overflow-y-auto flex-1 divide-y divide-slate-100 max-h-80">
          {resultados.length === 0 ? (
            <p className="text-xs text-slate-400 italic text-center py-6">
              No se encontraron partidas coincidentes con "{query}".
            </p>
          ) : (
            resultados.map((partida) => {
              const yaIncluida = partidasYaIncluidasIds.has(partida.id) || partidasYaIncluidasIds.has(partida.codigo);

              return (
                <div
                  key={partida.id}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50 px-2 rounded-lg transition-colors group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#002855] bg-[#002855]/10 px-2 py-0.5 rounded-md">
                        {partida.codigo}
                      </span>
                      <span className="text-xs font-bold text-[#001B47]">
                        {partida.nombre}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {partida.itemsRelacionados.map((it) => (
                        <span key={it} className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {it}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={yaIncluida}
                    onClick={() => onSelectPartida(partida)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                      yaIncluida
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-[#001B47] text-white hover:bg-[#002855] shadow-2xs"
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{yaIncluida ? "Agregada" : "Agregar"}</span>
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Modal */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-100 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
