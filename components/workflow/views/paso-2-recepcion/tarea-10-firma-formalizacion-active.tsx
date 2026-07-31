"use client";

import { useState, useEffect, useCallback } from "react";
import { TaskViewProps } from "../view-types";
import { OrdenContractualData } from "@/types/ordenes";
import {
  obtenerOrdenesContractualesTramite,
  confirmarEfectivizacionYFirmas,
} from "@/services/ordenesService";
import { TarjetaEfectivizacionProveedor } from "@/components/tramites/ordenes/TarjetaEfectivizacionProveedor";
import { ModalImpresionOrden } from "@/components/tramites/ordenes/ModalImpresionOrden";
import { Button } from "@/components/ui/button";
import {
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
} from "lucide-react";

export default function Tarea10FirmaFormalizacionActive({
  tarea,
  tramite,
  ejecutarTransicion,
}: TaskViewProps) {
  const tramiteId = tramite?.id || 3;

  const [loading, setLoading] = useState(true);
  const [ordenes, setOrdenes] = useState<OrdenContractualData[]>([]);
  const [selectedOrdenModal, setSelectedOrdenModal] = useState<OrdenContractualData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const cargarOrdenes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await obtenerOrdenesContractualesTramite(tramiteId);
      setOrdenes(data);
    } catch {
      setFeedback({
        type: "error",
        message: "No se pudieron consultar las órdenes emitidas desde Supabase.",
      });
    } finally {
      setLoading(false);
    }
  }, [tramiteId]);

  useEffect(() => {
    cargarOrdenes();
  }, [cargarOrdenes]);

  const handleImprimirDirecto = (orden: OrdenContractualData) => {
    setSelectedOrdenModal(orden);
    setIsModalOpen(true);
  };

  const acciones = tarea.accionesDisponibles || [];
  const transicionFinalizar =
    acciones.find(
      (a) =>
        a.idEstadoDestino === 11 ||
        a.nombreAccion.toLowerCase().includes("firm") ||
        a.nombreAccion.toLowerCase().includes("recepc")
    ) || acciones[0];

  const handleFinalizarEfectivizacion = async () => {
    if (ordenes.length === 0) {
      setFeedback({
        type: "error",
        message: "No hay órdenes emitidas para efectivizar en este trámite.",
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const ordenesPayload = ordenes.map((o) => ({
        ordenId: o.id,
        proveedorId: o.proveedorId,
        firmadoCoordinador: true,
        firmadoDirector: true,
        firmadoProveedor: true,
      }));

      const res = await confirmarEfectivizacionYFirmas({
        tramiteId,
        ordenesFirmas: ordenesPayload,
      });

      if (!res.success) {
        throw new Error(res.error || "Error al registrar efectivización");
      }

      if (ejecutarTransicion && transicionFinalizar) {
        const transRes = await ejecutarTransicion(
          transicionFinalizar.idTransicion,
          `Efectivización formal y firmas confirmadas para ${ordenes.length} compromiso(s) legal(es). Trámite en espera de entrega.`
        );

        if (!transRes.success) {
          console.warn("Advertencia en transición:", transRes.message);
        }
      }

      setFeedback({
        type: "success",
        message: "¡Firmas efectivizadas y trámite en espera de entrega de materiales / servicios!",
      });

      await cargarOrdenes();
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: "Error al finalizar efectivización: " + err.message,
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
          Cargando órdenes emitidas desde Supabase...
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

      {/* Encabezado Principal Tarea 10 */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-extrabold text-white bg-[#001B47] px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-2xs">
              <FileCheck2 className="w-4 h-4" />
              Tarea 10
            </span>
            <div>
              <h3 className="text-base font-extrabold text-[#001B47] tracking-tight">
                Firma y Formalización de Orden de Compra o Contrato
              </h3>
              <p className="text-xs text-slate-500">
                Impresión directa, confirmación de firmas oficiales y pase a espera de entrega de materiales / servicios.
              </p>
            </div>
          </div>
        </div>

        {/* Tarjetas Simplificadas por Proveedor */}
        {ordenes.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <AlertCircle className="w-6 h-6 text-amber-500 mx-auto" />
            <p className="font-bold text-[#001B47]">Sin órdenes emitidas para efectivizar</p>
            <p className="text-slate-500">
              Asegúrese de haber completado la emisión de órdenes en la Tarea 9 previa.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {ordenes.map((ordenItem, idx) => (
              <TarjetaEfectivizacionProveedor
                key={idx}
                orden={ordenItem}
                onImprimirDirecto={handleImprimirDirecto}
              />
            ))}
          </div>
        )}

        {/* Botón de Acción Principal para Finalizar Tarea 10 */}
        {ordenes.length > 0 && (
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button
              size="default"
              onClick={handleFinalizarEfectivizacion}
              disabled={isSubmitting}
              className="bg-[#001B47] text-white hover:bg-[#002855] text-xs font-extrabold px-8 py-3 rounded-xl shadow-sm flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registrando Efectivización...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>EFECTUAR Y CONFIRMAR FIRMAS</span>
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Modal de Impresión Oficial */}
      <ModalImpresionOrden
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        orden={selectedOrdenModal}
      />
    </div>
  );
}
