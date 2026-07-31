"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdjudicacionTramite } from "@/hooks/useAdjudicacionTramite";
import { ItemListaSeleccion } from "@/components/tramites/adjudicacion/ItemListaSeleccion";
import { CuadroComparativoMatriz } from "@/components/tramites/adjudicacion/CuadroComparativoMatriz";
import { AdjudicacionDivididaModal } from "@/components/tramites/adjudicacion/AdjudicacionDivididaModal";
import { ConfirmarAdjudicacionDialog } from "@/components/tramites/adjudicacion/ConfirmarAdjudicacionDialog";
import { confirmarAdjudicacionTramite } from "@/services/adjudicacionService";
import { Button } from "@/components/ui/button";
import {
  Check,
  ChevronRight,
  AlertCircle,
  FileCheck,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Loader2,
} from "lucide-react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function AdjudicacionTramitePage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const tramiteId = parseInt(resolvedParams.id, 10) || 0;

  const {
    loading,
    error,
    tramite,
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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Opciones formateadas para modal dividido de este ítem activo
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

  const handleConfirmarFinal = async (justificacion: string) => {
    setIsSubmitting(true);
    try {
      const res = await confirmarAdjudicacionTramite({
        tramiteId,
        justificacionGeneral: justificacion,
        asignacionesPorItem: asignacionesMap,
      });

      if (res.success) {
        setSuccessMessage("¡Adjudicación guardada exitosamente en Supabase!");
        setIsConfirmarDialogOpen(false);
        await refetch();
      } else {
        alert(res.error || "Ocurrió un error al guardar en Supabase.");
      }
    } catch (err: any) {
      alert("Error al confirmar adjudicación: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">
          Cargando cuadro comparativo desde Supabase...
        </p>
      </div>
    );
  }

  if (error || !tramite) {
    return (
      <div className="p-8 max-w-lg mx-auto my-8 bg-card border border-border rounded-xl text-center space-y-4 shadow-xs">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-foreground">Trámite no encontrado</h3>
        <p className="text-sm text-muted-foreground">
          {error || "No existe información para este trámite."}
        </p>
        <Button onClick={() => router.push("/protected")} variant="outline" size="sm">
          Volver a Compras/Contrataciones
        </Button>
      </div>
    );
  }

  const proyectoNombre = tramite.proyecto?.nombre || "Proyecto DICYT";

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Breadcrumbs & Título Principal */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/protected" className="hover:text-primary transition-colors">
            Compras/Contrataciones
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-foreground">
            Detalle de Trámite #TR-2026-{tramite.id.toString().padStart(4, "0")}
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Trámite #TR-2026-{tramite.id.toString().padStart(4, "0")}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Proyecto <strong className="text-primary">{proyectoNombre}</strong> | Solicitante:
              Winsor Orellana
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="gap-1.5 text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Volver
          </Button>
        </div>
      </div>

      {/* Mensaje de éxito si recién se guardó */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl text-sm text-emerald-900 dark:text-emerald-300 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            {successMessage}
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setSuccessMessage(null)}
            className="text-xs"
          >
            Cerrar
          </Button>
        </div>
      )}

      {/* 2. Stepper Header de Estado del Trámite (1: Solicitud, 2: Recepción Material, 3: Pago, 4: Completado) */}
      <div className="p-4 bg-card border border-border rounded-xl shadow-xs">
        <div className="grid grid-cols-4 gap-2 relative">
          {/* Paso 1: Solicitud (En Curso) */}
          <div className="flex flex-col items-center text-center space-y-1.5 relative z-10">
            <div className="w-8 h-8 rounded-full border-2 border-primary bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center">
              1
            </div>
            <span className="text-xs font-bold text-foreground">Solicitud</span>
            <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded-full uppercase">
              EN CURSO
            </span>
          </div>

          {/* Paso 2: Recepción Material */}
          <div className="flex flex-col items-center text-center space-y-1.5 relative z-10">
            <div className="w-8 h-8 rounded-full border-2 border-border bg-muted text-muted-foreground font-semibold text-sm flex items-center justify-center">
              2
            </div>
            <span className="text-xs font-medium text-muted-foreground">Recepción Material</span>
            <span className="text-[10px] text-muted-foreground italic">Pendiente</span>
          </div>

          {/* Paso 3: Pago a Proveedor */}
          <div className="flex flex-col items-center text-center space-y-1.5 relative z-10">
            <div className="w-8 h-8 rounded-full border-2 border-border bg-muted text-muted-foreground font-semibold text-sm flex items-center justify-center">
              3
            </div>
            <span className="text-xs font-medium text-muted-foreground">Pago a Proveedor</span>
            <span className="text-[10px] text-muted-foreground italic">Pendiente</span>
          </div>

          {/* Paso 4: Completado */}
          <div className="flex flex-col items-center text-center space-y-1.5 relative z-10">
            <div className="w-8 h-8 rounded-full border-2 border-border bg-muted text-muted-foreground font-semibold text-sm flex items-center justify-center">
              4
            </div>
            <span className="text-xs font-medium text-muted-foreground">Completado</span>
            <span className="text-[10px] text-muted-foreground italic">Pendiente</span>
          </div>
        </div>
      </div>

      {/* 3. Disposición Principal de 3 Columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[550px]">
        {/* Columna Izquierda (3 cols): Timeline de Pasos de Solicitud */}
        <div className="lg:col-span-3 bg-card border border-border rounded-xl p-4 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
            <FileCheck className="w-4 h-4 text-primary" />
            Detalle de Solicitud
          </h3>

          <div className="space-y-3 relative text-xs">
            {/* Pasos completados previas */}
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3" />
              </span>
              <div>
                <strong className="block font-semibold text-foreground">
                  REVISIÓN PRESUPUESTO
                </strong>
                <span className="text-[11px] text-muted-foreground">11 Ene 2026 - 09:15</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3" />
              </span>
              <div>
                <strong className="block font-semibold text-foreground">REVISIÓN INICIAL</strong>
                <span className="text-[11px] text-muted-foreground">12 Ene 2026 - 11:30</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3" />
              </span>
              <div>
                <strong className="block font-semibold text-foreground">APROBAR SOLICITUD</strong>
                <span className="text-[11px] text-muted-foreground">13 Ene 2026 - 11:30</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3" />
              </span>
              <div>
                <strong className="block font-semibold text-foreground">
                  REVISAR ITEMS EN MERCADO VIRTUAL
                </strong>
                <span className="text-[11px] text-muted-foreground">13 Ene 2026 - 11:30</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3" />
              </span>
              <div>
                <strong className="block font-semibold text-foreground">
                  SUBIR 3 COTIZACIONES
                </strong>
                <span className="text-[11px] text-muted-foreground">13 Ene 2026 - 11:30</span>
              </div>
            </div>

            {/* Paso Activo: ADJUDICAR PROVEEDORES */}
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-lg space-y-1">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-600 shrink-0" />
                <strong className="font-bold text-rose-900 dark:text-rose-200">
                  ADJUDICAR PROVEEDORES
                </strong>
              </div>
              <p className="text-[11px] text-rose-700 dark:text-rose-300 pl-6">
                14 Ene 2026 - 14:30
              </p>
            </div>
          </div>
        </div>

        {/* Columna Central (4 cols): Lista de Selección de Insumos */}
        <div className="lg:col-span-4 h-full min-h-[500px]">
          <ItemListaSeleccion
            items={tramite.item_tramite}
            selectedItemId={selectedItemId}
            onSelectItem={setSelectedItemId}
            searchFilter={searchFilter}
            onSearchChange={setSearchFilter}
            asignacionesMap={asignacionesMap}
          />
        </div>

        {/* Columna Derecha (5 cols): Cuadro Comparativo de Proveedores para el ítem seleccionado */}
        <div className="lg:col-span-5 h-full flex flex-col min-h-[500px]">
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

          {/* Barra de Acciones Inferior ([OBSERVAR] y [APROBAR / CONFIRMAR ADJUDICACIÓN]) */}
          <div className="mt-4 p-4 bg-card border border-border rounded-xl shadow-xs flex items-center justify-between gap-3">
            <Button variant="outline" size="default" className="gap-1.5 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              OBSERVAR
            </Button>

            <Button
              size="default"
              onClick={() => setIsConfirmarDialogOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold px-6"
            >
              APROBAR Y CONFIRMAR ADJUDICACIÓN
            </Button>
          </div>
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
