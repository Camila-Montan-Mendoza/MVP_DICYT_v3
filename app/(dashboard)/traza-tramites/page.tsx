"use client";

import React from "react";
import { SigefiShell } from "@/components/sigefi-shell";
import { useTrazaTramites } from "@/src/features/traza-tramites/hooks/useTrazaTramites";
import { TrazaPartidasList } from "@/src/features/traza-tramites/components/TrazaPartidasList";
import { TrazaDetailSidebar } from "@/src/features/traza-tramites/components/TrazaDetailSidebar";
import { RefreshCw, GitCommit, Filter } from "lucide-react";

export default function TrazaTramitesPage() {
  const {
    partidas,
    selectedPartida,
    selectedItem,
    onSelectItem,
    onCloseSidebar,
    selectedProgramaId,
    setSelectedProgramaId,
    selectedProyectoId,
    setSelectedProyectoId,
    programasDisponibles,
    proyectosDisponibles,
    statusFilter,
    setStatusFilter,
    isLoading,
    error,
    refetch,
  } = useTrazaTramites();

  return (
    <SigefiShell>
      <div className="space-y-6 pb-16 relative">
        {/* Cabecera del Módulo con Título y Selectores (Programa, Proyecto) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-[#003770]/10 text-[#003770] rounded-lg">
                <GitCommit className="w-5 h-5" />
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#001B47] tracking-tight">
                Seguimiento de Partidas (Trazabilidad)
              </h1>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Traza de presupuesto comprometido, ejecutado y pagado a nivel de partida e ítem (Datos
              en vivo desde Supabase)
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2.5 ms-auto">
            {/* Selector de Programa */}
            {programasDisponibles.length > 0 && (
              <div className="flex items-center gap-1.5 bg-white border border-border px-2.5 py-1.5 rounded-lg text-xs shadow-2xs max-w-[210px]">
                <Filter className="w-3.5 h-3.5 text-[#003770] shrink-0" />
                <span className="text-muted-foreground font-medium shrink-0">Programa:</span>
                <select
                  value={selectedProgramaId}
                  onChange={(e) => {
                    const val = e.target.value === "all" ? "all" : Number(e.target.value);
                    setSelectedProgramaId(val);
                    setSelectedProyectoId("all");
                  }}
                  className="bg-transparent font-bold text-[#001B47] focus:outline-hidden cursor-pointer truncate w-full"
                >
                  <option value="all">Todos los Programas ({programasDisponibles.length})</option>
                  {programasDisponibles.map((p: any) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Selector de Proyecto */}
            {proyectosDisponibles.length > 0 && (
              <div className="flex items-center gap-1.5 bg-white border border-border px-2.5 py-1.5 rounded-lg text-xs shadow-2xs max-w-[210px]">
                <Filter className="w-3.5 h-3.5 text-[#003770] shrink-0" />
                <span className="text-muted-foreground font-medium shrink-0">Proyecto:</span>
                <select
                  value={selectedProyectoId}
                  onChange={(e) =>
                    setSelectedProyectoId(e.target.value === "all" ? "all" : Number(e.target.value))
                  }
                  className="bg-transparent font-bold text-[#001B47] focus:outline-hidden cursor-pointer truncate w-full"
                >
                  <option value="all">Todos los Proyectos ({proyectosDisponibles.length})</option>
                  {proyectosDisponibles.map((p: any) => (
                    <option key={p.id} value={p.id}>
                      {p.codigo} - {p.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={() => refetch()}
              className="p-2 text-muted-foreground hover:text-[#003770] hover:bg-muted rounded-lg transition-colors border border-border bg-white shrink-0 shadow-2xs"
              title="Sincronizar con Supabase"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Layout Ajustable Split-View Estilo Jira */}
        <div className="flex gap-6">
          <div
            className={`flex-1 transition-all duration-300 ${selectedItem ? "pr-0 md:pr-[550px]" : ""}`}
          >
            {isLoading ? (
              <div className="bg-white border border-border rounded-xl p-12 text-center shadow-2xs animate-pulse">
                <div className="h-6 bg-slate-200 rounded w-1/3 mx-auto mb-2" />
                <span className="text-xs text-muted-foreground">
                  Cargando partidas reales desde Supabase...
                </span>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-xs text-red-700">
                Ocurrió un error al consultar Supabase: {error.message}
              </div>
            ) : (
              <TrazaPartidasList
                partidas={partidas}
                selectedItemId={selectedItem?.id || null}
                onSelectItem={onSelectItem}
              />
            )}
          </div>

          {/* Panel Lateral Estilo Jira (Drawer por la Derecha que se abre al hacer clic en una SUBFILA de Ítem) */}
          <TrazaDetailSidebar
            partida={selectedPartida}
            item={selectedItem}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onClose={onCloseSidebar}
          />
        </div>
      </div>
    </SigefiShell>
  );
}
