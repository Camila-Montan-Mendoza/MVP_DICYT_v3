"use client";

import React from "react";
import { SigefiShell } from "@/components/sigefi-shell";
import { useBitacoraModificaciones } from "@/src/features/bitacora-modificaciones/hooks/useBitacoraModificaciones";
import { BitacoraModificacionesList } from "@/src/features/bitacora-modificaciones/components/BitacoraModificacionesList";
import { BitacoraDetailSidebar } from "@/src/features/bitacora-modificaciones/components/BitacoraDetailSidebar";
import { RefreshCw, History, Filter, Calendar, FolderSearch } from "lucide-react";

export default function ModificacionesPresupuestariasPage() {
  const {
    modificaciones,
    selectedModificacion,
    onSelectModificacion,
    onCloseSidebar,
    selectedProgramaId,
    setSelectedProgramaId,
    selectedProyectoId,
    setSelectedProyectoId,
    selectedGestion,
    setSelectedGestion,
    hasSelection,
    availableGestiones,
    programasDisponibles,
    proyectosDisponibles,
    isLoading,
    error,
    refetch,
  } = useBitacoraModificaciones();

  return (
    <SigefiShell>
      <div className="space-y-6 pb-16 relative">
        {/* Cabecera del Módulo con Título y Selectores (Programa, Proyecto, Gestión Fiscal) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-[#003770]/10 text-[#003770] rounded-lg">
                <History className="w-5 h-5" />
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#001B47] tracking-tight">
                Historial de Modificaciones Presupuestarias
              </h1>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Bitácora de auditoría informativa de reasignaciones de fondos (Datos en vivo desde
              Supabase)
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2.5 ms-auto">
            {/* Selector de Gestión Presupuestaria */}
            <div className="flex items-center gap-1.5 bg-white border border-[#003770]/40 px-2.5 py-1.5 rounded-lg text-xs shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-[#003770] shrink-0" />
              <span className="text-muted-foreground font-medium shrink-0">Gestión:</span>
              <select
                value={selectedGestion}
                onChange={(e) => {
                  const val = e.target.value === "global" ? "global" : Number(e.target.value);
                  setSelectedGestion(val);
                }}
                className="bg-transparent font-bold text-[#001B47] focus:outline-hidden cursor-pointer shrink-0"
              >
                {availableGestiones.map((g) => (
                  <option key={g} value={g}>
                    Gestión {g}
                  </option>
                ))}
                <option value="global">Histórico Global</option>
              </select>
            </div>

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
                  <option value="all">Seleccionar Programa...</option>
                  {programasDisponibles.map((p) => (
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
                  <option value="all">Seleccionar Proyecto...</option>
                  {proyectosDisponibles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
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

        {/* Contenido Principal */}
        {!hasSelection ? (
          <div className="bg-white border border-border rounded-xl p-12 text-center shadow-2xs max-w-2xl mx-auto my-8">
            <div className="w-12 h-12 rounded-full bg-[#003770]/10 text-[#003770] flex items-center justify-center mx-auto mb-3">
              <FolderSearch className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#001B47] mb-1">
              Selecciona un Programa o Proyecto
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Por favor, elige un Programa o Proyecto en el encabezado superior para desplegar su
              bitácora histórica de modificaciones presupuestarias.
            </p>
          </div>
        ) : (
          <div className="flex gap-6">
            <div
              className={`flex-1 transition-all duration-300 ${selectedModificacion ? "pr-0 md:pr-[550px]" : ""}`}
            >
              {isLoading ? (
                <div className="bg-white border border-border rounded-xl p-12 text-center shadow-2xs animate-pulse">
                  <div className="h-6 bg-slate-200 rounded w-1/3 mx-auto mb-2" />
                  <span className="text-xs text-muted-foreground">
                    Cargando bitácora real desde Supabase...
                  </span>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-xs text-red-700">
                  Ocurrió un error al consultar Supabase: {error.message}
                </div>
              ) : (
                <BitacoraModificacionesList
                  modificaciones={modificaciones}
                  selectedModificacionId={selectedModificacion?.id || null}
                  onSelectModificacion={onSelectModificacion}
                />
              )}
            </div>

            {/* Panel Lateral Estilo Jira (Drawer por la Derecha con Justificación Completa) */}
            <BitacoraDetailSidebar modificacion={selectedModificacion} onClose={onCloseSidebar} />
          </div>
        )}
      </div>
    </SigefiShell>
  );
}
