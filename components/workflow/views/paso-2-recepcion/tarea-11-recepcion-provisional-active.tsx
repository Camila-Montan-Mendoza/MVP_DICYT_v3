"use client";

import { useState, useEffect, useCallback } from "react";
import { TaskViewProps } from "../view-types";
import { RecepcionProveedorData } from "@/types/recepcion";
import {
  obtenerDatosRecepcionTramite,
  guardarActaRecepcion,
} from "@/services/recepcionService";
import { TarjetaRecepcionProveedor } from "@/components/tramites/ordenes/TarjetaRecepcionProveedor";
import { ModalImpresionActaRecepcion } from "@/components/tramites/ordenes/ModalImpresionActaRecepcion";
import { Button } from "@/components/ui/button";
import {
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Zap,
  Send,
} from "lucide-react";

export default function Tarea11RecepcionProvisionalActive({
  tarea,
  tramite,
  ejecutarTransicion,
}: TaskViewProps) {
  const tramiteId = tramite?.id || 3;

  const [loading, setLoading] = useState(true);
  const [recepciones, setRecepciones] = useState<RecepcionProveedorData[]>([]);
  const [selectedRecepcionModal, setSelectedRecepcionModal] = useState<RecepcionProveedorData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const cargarRecepciones = useCallback(async () => {
    setLoading(true);
    try {
      const data = await obtenerDatosRecepcionTramite(tramiteId);
      setRecepciones(data);
    } catch {
      setFeedback({
        type: "error",
        message: "No se pudieron obtener los datos de recepción desde Supabase.",
      });
    } finally {
      setLoading(false);
    }
  }, [tramiteId]);

  useEffect(() => {
    cargarRecepciones();
  }, [cargarRecepciones]);

  const handleActualizarRecepcion = (updated: RecepcionProveedorData) => {
    setRecepciones((prev) =>
      prev.map((r) => (r.proveedorId === updated.proveedorId ? updated : r))
    );
  };

  const handleGenerarActa = (recepcionData: RecepcionProveedorData) => {
    setSelectedRecepcionModal(recepcionData);
    setIsModalOpen(true);
  };

  // ── Acción 1: Emitir Acta Provisional (Permanece en Tarea 11) ───────────
  const handleEmitirProvisional = async (rec: RecepcionProveedorData) => {
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await guardarActaRecepcion({
        tramiteId,
        proveedorId: rec.proveedorId,
        ordenId: rec.ordenId,
        tipoActa: "PROVISIONAL",
        nombreCoordinador: rec.nombreCoordinador || "Dr. Winsor Orellana",
        nombreRepProveedor: rec.nombreRepProveedor || rec.proveedorNombre,
        nombreRepBienes: rec.nombreRepBienes || "Ing. Mario Gutiérrez (Bienes)",
        facturaUrl: rec.facturaUrl,
        evidenciaUrl: rec.evidenciaUrl,
        observaciones: rec.observaciones,
        materiales: rec.materiales.map((m) => ({
          idItemTramite: m.idItemTramite,
          cantidadRecibida: m.cantidad,
          estadoMaterial: m.estadoMaterial || "Excelente",
        })),
      });

      if (!res.success) {
        throw new Error(res.error || "Error al registrar acta provisional");
      }

      setFeedback({
        type: "success",
        message: `¡Acta de Recepción Provisional emitida para ${rec.proveedorNombre}! Se guardó el estado parcial en Supabase.`,
      });

      setIsModalOpen(false);
      await cargarRecepciones();
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: "Error al emitir acta provisional: " + err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Acción 2: Emitir Acta Definitiva (Avanza a Paso 3 Pago) ─────────────
  const handleEmitirDefinitiva = async (rec: RecepcionProveedorData) => {
    const facturaFinal =
      rec.facturaUrl ||
      "https://supabase.co/storage/v1/object/public/facturas/factura_oficial_ejemplo.pdf";

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await guardarActaRecepcion({
        tramiteId,
        proveedorId: rec.proveedorId,
        ordenId: rec.ordenId,
        tipoActa: "DEFINITIVA",
        nombreCoordinador: rec.nombreCoordinador || "Dr. Winsor Orellana",
        nombreRepProveedor: rec.nombreRepProveedor || rec.proveedorNombre,
        nombreRepBienes: rec.nombreRepBienes || "Ing. Mario Gutiérrez (Bienes)",
        facturaUrl: facturaFinal,
        evidenciaUrl: rec.evidenciaUrl || "https://supabase.co/storage/v1/object/public/evidencias/foto_entrega_ejemplo.jpg",
        observaciones: rec.observaciones,
        materiales: rec.materiales.map((m) => ({
          idItemTramite: m.idItemTramite,
          cantidadRecibida: m.cantidad,
          estadoMaterial: m.estadoMaterial || "Excelente",
        })),
      });

      if (!res.success) {
        throw new Error(res.error || "Error al registrar acta definitiva");
      }

      const acciones = tarea.accionesDisponibles || [];
      const transicionFinalizar = acciones[0];

      if (ejecutarTransicion && transicionFinalizar) {
        const transRes = await ejecutarTransicion(
          transicionFinalizar.idTransicion,
          `Acta de Recepción Definitiva emitida 100% conforme para ${rec.proveedorNombre}. Trámite avanzado a Pago a Proveedor.`
        );

        if (!transRes.success) {
          console.warn("Advertencia en transición:", transRes.message);
        }
      }

      setFeedback({
        type: "success",
        message: `¡Acta de Recepción Definitiva emitida para ${rec.proveedorNombre}! Trámite avanzado a Paso 3 (Pago a Proveedor).`,
      });

      setIsModalOpen(false);
      await cargarRecepciones();
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: "Error al emitir acta definitiva: " + err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Happy Path: Completar y Emitir Acta Definitiva Directamente ────────
  const handleHappyPathCompletarDefinitivo = async () => {
    if (recepciones.length === 0) {
      setFeedback({
        type: "error",
        message: "No hay ordenes de recepción para completar.",
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      for (const rec of recepciones) {
        const facturaFinal =
          rec.facturaUrl ||
          "https://supabase.co/storage/v1/object/public/facturas/factura_oficial_ejemplo.pdf";

        await guardarActaRecepcion({
          tramiteId,
          proveedorId: rec.proveedorId,
          ordenId: rec.ordenId,
          tipoActa: "DEFINITIVA",
          nombreCoordinador: rec.nombreCoordinador || "Dr. Winsor Orellana (Investigador Principal)",
          nombreRepProveedor: rec.nombreRepProveedor || rec.proveedorNombre,
          nombreRepBienes: rec.nombreRepBienes || "Ing. Mario Gutiérrez (Bienes e Inventarios)",
          facturaUrl: facturaFinal,
          evidenciaUrl:
            rec.evidenciaUrl ||
            "https://supabase.co/storage/v1/object/public/evidencias/foto_entrega_ejemplo.jpg",
          observaciones: "Recepción 100% conforme de materiales efectivizada (Happy Path).",
          materiales: rec.materiales.map((m) => ({
            idItemTramite: m.idItemTramite,
            cantidadRecibida: m.cantidad,
            estadoMaterial: "Excelente",
          })),
        });
      }

      const acciones = tarea.accionesDisponibles || [];
      const transicionFinalizar = acciones[0];

      if (ejecutarTransicion && transicionFinalizar) {
        const transRes = await ejecutarTransicion(
          transicionFinalizar.idTransicion,
          `Recepción 100% conforme completada de ${recepciones.length} proveedor(es). Avance directo a Pago a Proveedor.`
        );

        if (!transRes.success) {
          console.warn("Advertencia en transición:", transRes.message);
        }
      }

      setFeedback({
        type: "success",
        message: "¡Happy Path exitoso! Todas las recepciones se registraron como Actas Definitivas y el trámite avanzó al Paso 3 (Pago a Proveedor).",
      });

      await cargarRecepciones();
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: "Error al ejecutar Happy Path: " + err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 gap-3 bg-white rounded-2xl border border-slate-200 shadow-2xs">
        <Loader2 className="w-8 h-8 animate-spin text-[#001B47]" />
        <p className="text-xs font-semibold text-slate-500">
          Cargando datos de recepción desde Supabase...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
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

      {/* Encabezado Principal Tarea 11: Recepción */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-extrabold text-white bg-[#001B47] px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-2xs">
              <FileCheck2 className="w-4 h-4" />
              Tarea 11
            </span>
            <div>
              <h3 className="text-base font-extrabold text-[#001B47] tracking-tight">
                Recepción de Materiales
              </h3>
              <p className="text-xs text-slate-500">
                Inspección de insumos, verificación de participantes y emisión de Acta Provisional o Definitiva.
              </p>
            </div>
          </div>

          {/* Botón Acción Rápida Happy Path */}
          {recepciones.length > 0 && (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleHappyPathCompletarDefinitivo}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
              title="Pre-llenar datos 100% conformes, emitir Acta Definitiva y avanzar directamente al Paso 3"
            >
              <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span>EMITIR ACTA DEFINITIVA (HAPPY PATH)</span>
            </button>
          )}
        </div>

        {/* Formulario e Inspección por Proveedor */}
        {recepciones.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <AlertCircle className="w-6 h-6 text-amber-500 mx-auto" />
            <p className="font-bold text-[#001B47]">Sin ítems en recepción</p>
            <p className="text-slate-500">
              Asegúrese de haber efectivizado las órdenes contractuales en la Tarea 10 previa.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recepciones.map((recItem, idx) => (
              <TarjetaRecepcionProveedor
                key={idx}
                recepcion={recItem}
                onGenerarActa={handleGenerarActa}
                onActualizarRecepcion={handleActualizarRecepcion}
              />
            ))}
          </div>
        )}

        {/* Botón Inferior para Emitir Acta Definitiva Directamente */}
        {recepciones.length > 0 && (
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button
              size="default"
              onClick={handleHappyPathCompletarDefinitivo}
              disabled={isSubmitting}
              className="bg-[#BC000C] text-white hover:bg-[#a0000a] text-xs font-extrabold px-8 py-3 rounded-xl shadow-sm flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Procesando Emisión...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>EMITIR ACTA DEFINITIVA Y AVANZAR A PAGO</span>
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Visor e Impresor de Acta Membretada Oficial con las 2 Transiciones */}
      <ModalImpresionActaRecepcion
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        recepcion={selectedRecepcionModal}
        onEmitirProvisional={handleEmitirProvisional}
        onEmitirDefinitiva={handleEmitirDefinitiva}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
