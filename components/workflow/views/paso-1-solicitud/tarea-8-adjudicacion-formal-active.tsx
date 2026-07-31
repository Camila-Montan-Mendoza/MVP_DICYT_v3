"use client";

import { useState } from "react";
import { TaskViewProps } from "../view-types";
import { useAdjudicacionTramite } from "@/hooks/useAdjudicacionTramite";
import { ItemListaSeleccion } from "@/components/tramites/adjudicacion/ItemListaSeleccion";
import { CuadroComparativoMatriz } from "@/components/tramites/adjudicacion/CuadroComparativoMatriz";
import { AdjudicacionDivididaModal } from "@/components/tramites/adjudicacion/AdjudicacionDivididaModal";
import { ConfirmarAdjudicacionDialog } from "@/components/tramites/adjudicacion/ConfirmarAdjudicacionDialog";
import { confirmarAdjudicacionTramite } from "@/services/adjudicacionService";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Loader2, Award } from "lucide-react";

export default function Tarea8AdjudicacionFormalActive({
  tarea,
  tramite,
  ejecutarTransicion,
}: TaskViewProps) {
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
    adjudicarProveedorSimple,
    adjudicarDividido,
    desmarcarAdjudicacionItem,
    calculos,
    refetch,
  } = useAdjudicacionTramite(tramiteId);

  // Estados de modales
  const [isModalDivididoOpen, setIsModalDivididoOpen] = useState<boolean>(false);
  const [isConfirmarDialogOpen, setIsConfirmarDialogOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  // Opciones formateadas para modal dividido del ítem activo
  const cotizacionesDivididoOptions = (cotizacionesActiveItem || [])
    .filter(
      (c) =>
        c.detalle &&
        c.detalle.cantidad_existencias > 0 &&
        activeItem &&
        c.detalle.precio <= activeItem.precio
    )
    .map((c) => ({
      cotizacionId: c.cotizacionId,
      proveedorId: c.proveedor?.id || 0,
      nombreProveedor: c.proveedor?.nombre || "Proveedor",
      precioUnitario: c.detalle?.precio || 0,
      stockDisponible: c.detalle?.cantidad_existencias || 0,
    }));

  const acciones = tarea.accionesDisponibles || [];
  const transicionFinalizar =
    acciones.find(
      (a) =>
        a.idEstadoDestino === 9 ||
        a.nombreAccion.toLowerCase().includes("recepc") ||
        a.nombreAccion.toLowerCase().includes("iniciar")
    ) || acciones[0];

  const handleConfirmarFinal = async (justificacion: string) => {
    setIsSubmitting(true);
    setFeedback(null);

    try {
      // 1. Persistir adjudicación granular en Supabase
      const res = await confirmarAdjudicacionTramite({
        tramiteId,
        justificacionGeneral: justificacion,
        asignacionesPorItem: asignacionesMap,
      });

      if (!res.success) {
        setFeedback({
          type: "error",
          message: res.error || "Ocurrió un error al guardar en Supabase.",
        });
        setIsSubmitting(false);
        return;
      }

      // 2. Avanzar el paso en el workflow engine si existe la función de transición
      if (ejecutarTransicion && transicionFinalizar) {
        const transRes = await ejecutarTransicion(
          transicionFinalizar.idTransicion,
          `Adjudicación formal finalizada. Justificación: ${justificacion}`
        );

        if (!transRes.success) {
          console.warn("Advertencia en transición de workflow:", transRes.message);
        }
      }

      setFeedback({
        type: "success",
        message: "¡Adjudicación formal guardada exitosamente y trámite avanzado!",
      });
      setIsConfirmarDialogOpen(false);
      await refetch();
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: "Error al confirmar adjudicación: " + err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 gap-3 bg-white rounded-2xl border border-slate-200">
        <Loader2 className="w-8 h-8 animate-spin text-[#001B47]" />
        <p className="text-xs font-semibold text-slate-500">
          Cargando cuadro comparativo desde Supabase...
        </p>
      </div>
    );
  }

  if (error || !tramiteData) {
    return (
      <div className="p-6 bg-white border border-slate-200 rounded-2xl text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
        <h4 className="text-sm font-bold text-[#001B47]">No se pudieron cargar las cotizaciones</h4>
        <p className="text-xs text-slate-500">
          {error || "Asegúrese de haber registrado cotizaciones previamente en la Tarea 7."}
        </p>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          Reintentar Carga
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado de la Tarea 8 */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <span className="text-xs font-extrabold text-white bg-[#001B47] px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-2xs">
            <Award className="w-4 h-4" />
            Tarea 8
          </span>
          <div>
            <h3 className="text-base font-extrabold text-[#001B47] tracking-tight">
              Adjudicación Formal por Ítem (Investigador Principal)
            </h3>
            <p className="text-xs text-slate-500">
              Seleccione de forma independiente el proveedor por cada ítem o divida cantidades según
              existencia.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="text-right">
            <span className="text-slate-400 block text-[10px]">TOTAL ADJUDICADO</span>
            <strong className="font-bold text-[#001B47] text-sm">
              Bs.{" "}
              {calculos.montoTotalAdjudicado.toLocaleString("es-BO", { minimumFractionDigits: 2 })}
            </strong>
          </div>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs ${
            feedback.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-900"
              : "bg-rose-50 border border-rose-200 text-rose-900"
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-600">
            ×
          </button>
        </div>
      )}

      {/* Grid Principal de 2 Columnas de Adjudicación Granular */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[520px]">
        {/* Lista de selección de insumos (5 columnas) */}
        <div className="lg:col-span-5 h-full min-h-[480px]">
          <ItemListaSeleccion
            items={tramiteData.item_tramite}
            selectedItemId={selectedItemId}
            onSelectItem={setSelectedItemId}
            searchFilter={searchFilter}
            onSearchChange={setSearchFilter}
            asignacionesMap={asignacionesMap}
          />
        </div>

        {/* Cuadro comparativo matricial de ofertas (7 columnas) */}
        <div className="lg:col-span-7 h-full flex flex-col min-h-[480px]">
          <div className="flex-1">
            <CuadroComparativoMatriz
              activeItem={activeItem}
              cotizaciones={cotizacionesActiveItem}
              idProveedorAhorroMaximo={idProveedorAhorroMaximo}
              asignacionesMap={asignacionesMap}
              onAdjudicarSimple={(provId, provNombre, precio, cant) =>
                activeItem &&
                adjudicarProveedorSimple(activeItem.id, provId, provNombre, precio, cant)
              }
              onDesmarcar={() => activeItem && desmarcarAdjudicacionItem(activeItem.id)}
              onAbrirModalDividido={() => setIsModalDivididoOpen(true)}
            />
          </div>

          {/* Barra de Acciones Inferior */}
          <Button
            size="default"
            onClick={() => setIsConfirmarDialogOpen(true)}
            className="mt-4 p-4 bg-[#001B47] text-white hover:bg-[#002855] text-xs font-extrabold px-6 rounded-xl shadow-sm"
          >
            APROBAR Y CONFIRMAR ADJUDICACIÓN
          </Button>
        </div>
      </div>

      {/* Modales */}
      <AdjudicacionDivididaModal
        isOpen={isModalDivididoOpen}
        onClose={() => setIsModalDivididoOpen(false)}
        activeItem={activeItem}
        cotizacionesOptions={cotizacionesDivididoOptions}
        asignacionesActuales={activeItem ? asignacionesMap.get(activeItem.id) || [] : []}
        onGuardarAsignaciones={(asigs) => activeItem && adjudicarDividido(activeItem.id, asigs)}
      />

      <ConfirmarAdjudicacionDialog
        isOpen={isConfirmarDialogOpen}
        onClose={() => setIsConfirmarDialogOpen(false)}
        onConfirmar={handleConfirmarFinal}
        isSubmitting={isSubmitting}
        montoSolicitado={calculos.montoTotalSolicitado}
        montoAdjudicado={calculos.montoTotalAdjudicado}
        montoLiberado={calculos.montoLiberado}
        itemsAdjudicadosCount={calculos.itemsAdjudicadosCount}
        itemsTotalCount={calculos.itemsTotalCount}
        itemsSinStockCount={calculos.itemsSinStockCount}
      />
    </div>
  );
}
