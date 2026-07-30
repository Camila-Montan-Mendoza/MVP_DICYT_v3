"use client";

import React from "react";
import { SigefiShell } from "@/components/sigefi-shell";
import { useDashboardSeguimiento } from "@/src/features/seguimiento-gastos/hooks/useDashboardSeguimiento";
import { PresupuestoExecutionPanel } from "@/src/features/seguimiento-gastos/components/PresupuestoExecutionPanel";
import { ProgramaViewSection } from "@/src/features/seguimiento-gastos/components/ProgramaViewSection";
import { ProyectoViewSection } from "@/src/features/seguimiento-gastos/components/ProyectoViewSection";
import { PartidaBarChart } from "@/src/features/seguimiento-gastos/components/PartidaBarChart";
import { EmptyDashboardState } from "@/src/features/seguimiento-gastos/components/EmptyDashboardState";
import { Filter, RefreshCw } from "lucide-react";

export default function SeguimientoGastosPage() {
  const {
    isLoading,
    error,
    roleScope,
    metrics,
    programas = [],
    proyectos = [],
    rawProgramas = [],
    rawProyectos = [],
    selectedProgramaId,
    setSelectedProgramaId,
    selectedProyectoId,
    setSelectedProyectoId,
    refetch,
  } = useDashboardSeguimiento();

  // Preparar partidas para el gráfico de barras por partida concreta
  const allPartidas = (proyectos || []).flatMap((p) => p?.partidas || []);
  const chartData =
    allPartidas.length > 0
      ? allPartidas.slice(0, 5)
      : [
          {
            codigoPartida: 34200,
            nombrePartida: "Productos Químicos y Farmacéuticos",
            presupuestoAsignado: 45000,
            presupuestoEjecutado: 12500,
          },
          {
            codigoPartida: 39500,
            nombrePartida: "Útiles de Escritorio y Oficina",
            presupuestoAsignado: 18000,
            presupuestoEjecutado: 6400,
          },
          {
            codigoPartida: 43120,
            nombrePartida: "Equipo de Computación",
            presupuestoAsignado: 85000,
            presupuestoEjecutado: 32000,
          },
          {
            codigoPartida: 25600,
            nombrePartida: "Imprenta y Publicaciones",
            presupuestoAsignado: 12000,
            presupuestoEjecutado: 3100,
          },
        ];

  const safeRawProgramas = rawProgramas;
  const safeRawProyectos = rawProyectos;

  return (
    <SigefiShell>
      <div className="space-y-8 pb-16">
        {/* Cabecera de Módulo con Selectores Compactos a la Derecha */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#001B47] tracking-tight shrink-0">
            Seguimiento de Gastos
          </h1>

          <div className="flex flex-wrap items-center justify-end gap-2.5 ms-auto">
            {/* Selector Dinámico de Programa asignado */}
            {safeRawProgramas.length > 0 && (
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
                  <option value="all">Todos los Programas ({safeRawProgramas.length})</option>
                  {safeRawProgramas.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.sigla} - {p.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Selector Dinámico de Proyecto asignado */}
            {safeRawProyectos.length > 0 && (
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
                  <option value="all">Todos los Proyectos ({safeRawProyectos.length})</option>
                  {safeRawProyectos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.codigoSisin} - {p.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={() => refetch()}
              className="p-2 text-muted-foreground hover:text-[#003770] hover:bg-muted rounded-lg transition-colors border border-border bg-white shrink-0"
              title="Sincronizar con Supabase"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Paneles Principales Lado a Lado (Ejecución Presupuestaria + Gasto por Partida) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <PresupuestoExecutionPanel metrics={metrics} isLoading={isLoading} />
          <PartidaBarChart data={chartData} />
        </div>

        {/* Renderizado de Vistas Adaptativas según Rol o Ámbito */}
        {roleScope?.activeScope === "programa" && <ProgramaViewSection programas={programas} />}

        {roleScope?.activeScope === "proyectos" && <ProyectoViewSection proyectos={proyectos} />}

        {/* Estado Vacío en caso of error */}
        {error && (
          <EmptyDashboardState
            title="Error en la consulta con Supabase"
            description={error.message}
            onRetry={refetch}
          />
        )}
      </div>
    </SigefiShell>
  );
}
