"use client";

import { useState, useEffect, useCallback } from "react";
import { TaskViewProps } from "../view-types";
import { OrdenContractualData } from "@/types/ordenes";
import {
  obtenerOrdenesContractualesTramite,
  emitirOrdenContractual,
} from "@/services/ordenesService";
import { TarjetaOrdenProveedor } from "@/components/tramites/ordenes/TarjetaOrdenProveedor";
import { ModalImpresionOrden } from "@/components/tramites/ordenes/ModalImpresionOrden";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle2, AlertCircle, Loader2, Send } from "lucide-react";

export default function Tarea9EmisionOrdenCompraActive({
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
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  const cargarOrdenes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await obtenerOrdenesContractualesTramite(tramiteId);
      setOrdenes(data);
    } catch {
      setFeedback({
        type: "error",
        message: "No se pudieron obtener las órdenes de compra desde la base de datos.",
      });
    } finally {
      setLoading(false);
    }
  }, [tramiteId]);

  useEffect(() => {
    cargarOrdenes();
  }, [cargarOrdenes]);

  const handleAbrirImpresion = (orden: OrdenContractualData) => {
    setSelectedOrdenModal(orden);
    setIsModalOpen(true);
  };

  const handleAdjuntarContrato = async (orden: OrdenContractualData, file: File) => {
    const fileUrl = URL.createObjectURL(file);
    setOrdenes((prev) =>
      prev.map((o) =>
        o.proveedorId === orden.proveedorId
          ? { ...o, pdfContratoUrl: fileUrl, estado: "REGISTRADO" }
          : o
      )
    );
    setFeedback({
      type: "success",
      message: `Contrato PDF '${file.name}' adjuntado correctamente para ${orden.proveedorNombre}.`,
    });
  };

  const acciones = tarea.accionesDisponibles || [];
  const transicionFinalizar = acciones[0];

  const handleFinalizarTarea = async () => {
    if (ordenes.length === 0) {
      setFeedback({
        type: "error",
        message: "No existen órdenes o contratos adjudicados para emitir en este trámite.",
      });
      return;
    }

    // Verificar que si hay contratos (>15 días), tengan su PDF subido
    const contratoSinPdf = ordenes.find((o) => o.tipoDocumento === "CONTRATO" && !o.pdfContratoUrl);
    if (contratoSinPdf) {
      setFeedback({
        type: "error",
        message: `El contrato para ${contratoSinPdf.proveedorNombre} requiere adjuntar el archivo PDF firmado por Asesoría Legal.`,
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      // 1. Guardar y emitir cada orden en Supabase
      for (const ord of ordenes) {
        await emitirOrdenContractual({
          tramiteId,
          ordenId: ord.id,
          proveedorId: ord.proveedorId,
          tipoDocumento: ord.tipoDocumento,
          diasEntrega: ord.diasEntrega,
          fechaLimiteEntrega: ord.fechaLimiteEntrega,
          montoTotal: ord.montoTotal,
          montoLiteral: ord.montoLiteral,
          numeroCorrelativo: ord.numeroCorrelativo,
          pdfContratoUrl: ord.pdfContratoUrl,
          items: ord.items.map((it) => ({
            idItemTramite: it.idItemTramite,
            cantidad: it.cantidad,
            unidad: it.unidad,
            detalle: it.detalle,
            precioUnitario: it.precioUnitario,
            subtotal: it.subtotal,
          })),
        });
      }

      // 2. Ejecutar la transición del flujo para pasar al siguiente estado
      if (ejecutarTransicion && transicionFinalizar) {
        const transRes = await ejecutarTransicion(
          transicionFinalizar.idTransicion,
          `Emisión formal de ${ordenes.length} documento(s) contractual(es) completada por Responsable de Compras.`
        );

        if (!transRes.success) {
          console.warn("Advertencia en transición:", transRes.message);
        }
      }

      setFeedback({
        type: "success",
        message: "¡Emisión de órdenes contractuales finalizada y trámite avanzado!",
      });

      await cargarOrdenes();
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: "Error al emitir ordenes: " + err.message,
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
          Cargando adjudicación y ordenes desde Supabase...
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

      {/* Encabezado Principal Tarea 9 */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-extrabold text-white bg-[#001B47] px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-2xs">
              <FileText className="w-4 h-4" />
              Tarea 9
            </span>
            <div>
              <h3 className="text-base font-extrabold text-[#001B47] tracking-tight">
                Emisión de Orden de Compra, Orden de Servicio o Contrato
              </h3>
              <p className="text-xs text-slate-500">
                Generación automática de compromiso legal por proveedor adjudicado (Responsable de
                Compras - Grober).
              </p>
            </div>
          </div>
        </div>

        {/* Lista de Acordeones por Proveedor Adjudicado */}
        {ordenes.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <AlertCircle className="w-6 h-6 text-amber-500 mx-auto" />
            <p className="font-bold text-[#001B47]">Sin adjudicaciones para emitir órdenes</p>
            <p className="text-slate-500">
              Asegúrese de haber completado la adjudicación previa en la Tarea 8.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {ordenes.map((ordenItem, idx) => (
              <TarjetaOrdenProveedor
                key={idx}
                orden={ordenItem}
                onImprimir={handleAbrirImpresion}
                onAdjuntarContrato={handleAdjuntarContrato}
              />
            ))}
          </div>
        )}

        {/* Botón de Acción Inferior para Avanzar el Flujo */}
        {ordenes.length > 0 && (
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button
              size="default"
              onClick={handleFinalizarTarea}
              disabled={isSubmitting}
              className="bg-[#001B47] text-white hover:bg-[#002855] text-xs font-extrabold px-8 py-3 rounded-xl shadow-sm flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Procesando Emisión...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>EMITIR Y FINALIZAR EMISIÓN</span>
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Modal de Impresión Oficial Institucional */}
      <ModalImpresionOrden
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        orden={selectedOrdenModal}
        onConfirmarEmision={(ord) => {
          setOrdenes((prev) =>
            prev.map((o) => (o.proveedorId === ord.proveedorId ? { ...o, estado: "EMITIDO" } : o))
          );
        }}
      />
    </div>
  );
}
