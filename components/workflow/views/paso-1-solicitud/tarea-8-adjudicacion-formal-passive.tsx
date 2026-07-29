"use client";

import { TaskViewProps } from "../view-types";
import { useAdjudicacionTramite } from "@/hooks/useAdjudicacionTramite";
import { ItemListaSeleccion } from "@/components/tramites/adjudicacion/ItemListaSeleccion";
import { CuadroComparativoMatriz } from "@/components/tramites/adjudicacion/CuadroComparativoMatriz";
import { AlertCircle, Loader2, Award, CheckCircle2 } from "lucide-react";

export default function Tarea8AdjudicacionFormalPassive({ tramite }: TaskViewProps) {
  const tramiteId = tramite?.id || 3;

  const {
    loading,
    error,
    tramite: tramiteData,
    selectedItemId,
    setSelectedItemId,
    activeItem,
    cotizacionesActiveItem,
    idProveedorAhorroMaximo,
    searchFilter,
    setSearchFilter,
    asignacionesMap,
    calculos,
  } = useAdjudicacionTramite(tramiteId);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-2 bg-white rounded-xl border border-slate-200">
        <Loader2 className="w-6 h-6 animate-spin text-[#001B47]" />
        <p className="text-xs font-semibold text-slate-500">Cargando adjudicación completada...</p>
      </div>
    );
  }

  if (error || !tramiteData) {
    return (
      <div className="p-4 bg-white border border-slate-200 rounded-xl text-center space-y-2 text-xs">
        <AlertCircle className="w-6 h-6 text-amber-500 mx-auto" />
        <p className="font-bold text-[#001B47]">Sin datos de adjudicación</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Banner Informativo Vista Pasiva */}
      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-bold text-[#001B47]">
          <Award className="w-4 h-4 text-[#001B47]" />
          <span>Resumen de Adjudicación Formal (Modo Lectura)</span>
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span className="font-extrabold text-[#001B47]">
            Total Adjudicado: Bs. {calculos.montoTotalAdjudicado.toLocaleString("es-BO", { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Grid 2 Columnas de Lectura */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[440px]">
        <div className="lg:col-span-5 h-full min-h-[400px]">
          <ItemListaSeleccion
            items={tramiteData.item_tramite}
            selectedItemId={selectedItemId}
            onSelectItem={setSelectedItemId}
            searchFilter={searchFilter}
            onSearchChange={setSearchFilter}
            asignacionesMap={asignacionesMap}
          />
        </div>

        <div className="lg:col-span-7 h-full flex flex-col min-h-[400px]">
          <CuadroComparativoMatriz
            activeItem={activeItem}
            cotizaciones={cotizacionesActiveItem}
            idProveedorAhorroMaximo={idProveedorAhorroMaximo}
            asignacionesMap={asignacionesMap}
            onAdjudicarSimple={() => {}}
            onDesmarcar={() => {}}
            onAbrirModalDividido={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
