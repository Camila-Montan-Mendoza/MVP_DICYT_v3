"use client";

import { useState, useEffect, useCallback } from "react";
import { TaskViewProps } from "../view-types";
import { SolicitudPagoProveedorData } from "@/types/solicitudPago";
import {
  obtenerSolicitudesPagoTramite,
  enviarSolicitudPago,
  validarSolicitudPago,
  observarSolicitudPago,
} from "@/services/solicitudPagoService";
import { TarjetaSolicitudPagoProveedor } from "@/components/tramites/pago/TarjetaSolicitudPagoProveedor";
import { ModalImpresionNotaPago } from "@/components/tramites/pago/ModalImpresionNotaPago";
import { Button } from "@/components/ui/button";
import {
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Zap,
  ShieldCheck,
  XCircle,
} from "lucide-react";

export default function Tarea13SolicitudPagoActive({
  tarea,
  tramite,
  ejecutarTransicion,
}: TaskViewProps) {
  const tramiteId = tramite?.id || 3;

  const [loading, setLoading] = useState(true);
  const [solicitudes, setSolicitudes] = useState<SolicitudPagoProveedorData[]>([]);
  const [selectedNotaModal, setSelectedNotaModal] = useState<SolicitudPagoProveedorData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [motivoObsInput, setMotivoObsInput] = useState("");
  const [showObsModal, setShowObsModal] = useState<SolicitudPagoProveedorData | null>(null);

  const cargarSolicitudes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await obtenerSolicitudesPagoTramite(tramiteId);
      setSolicitudes(data);
    } catch {
      setFeedback({
        type: "error",
        message: "No se pudieron obtener las solicitudes de pago desde Supabase.",
      });
    } finally {
      setLoading(false);
    }
  }, [tramiteId]);

  useEffect(() => {
    cargarSolicitudes();
  }, [cargarSolicitudes]);

  const handleGenerarNota = (solData: SolicitudPagoProveedorData) => {
    setSelectedNotaModal(solData);
    setIsModalOpen(true);
  };

  // ── Acción 1: Enviar Solicitud de Pago (IP -> Compras) ───────────────────
  const handleEnviarSolicitud = async (sol: SolicitudPagoProveedorData) => {
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await enviarSolicitudPago({
        tramiteId,
        proveedorId: sol.proveedorId,
        solicitudId: sol.id,
        montoTotal: sol.montoTotal,
        montoLiteral: sol.montoLiteral,
        facturaUrl: sol.facturaUrl,
        notaEntregaUrl: sol.notaEntregaUrl,
        evidenciaExtraUrl: sol.evidenciaExtraUrl,
      });

      if (!res.success) {
        throw new Error(res.error || "Error al enviar la solicitud de pago");
      }

      setFeedback({
        type: "success",
        message: `¡Solicitud de pago enviada a revisión para ${sol.proveedorNombre}!`,
      });

      await cargarSolicitudes();
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: "Error al enviar solicitud: " + err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Acción 2: Validar Solicitud de Pago (Compras -> Siguiente Paso) ──────
  const handleValidarSolicitud = async (sol: SolicitudPagoProveedorData) => {
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await validarSolicitudPago({
        tramiteId,
        proveedorId: sol.proveedorId,
        solicitudId: sol.id,
      });

      if (!res.success) {
        throw new Error(res.error || "Error al validar la solicitud");
      }

      const acciones = tarea.accionesDisponibles || [];
      const transicionFinalizar = acciones[0];

      if (ejecutarTransicion && transicionFinalizar) {
        const transRes = await ejecutarTransicion(
          transicionFinalizar.idTransicion,
          `Solicitud de pago VALIDADA para ${sol.proveedorNombre}. Trámite avanzado a Memorándum de Pago.`
        );

        if (!transRes.success) {
          console.warn("Advertencia en transición:", transRes.message);
        }
      }

      setFeedback({
        type: "success",
        message: `¡Solicitud de pago VALIDADA para ${sol.proveedorNombre}! Trámite avanzado al siguiente paso.`,
      });

      await cargarSolicitudes();
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: "Error al validar solicitud: " + err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Acción 3: Observar Solicitud de Pago ────────────────────────────────
  const handleConfirmarObservacion = async () => {
    if (!showObsModal) return;
    if (!motivoObsInput.trim()) {
      setFeedback({
        type: "error",
        message: "El motivo de la observación es obligatorio.",
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await observarSolicitudPago({
        tramiteId,
        proveedorId: showObsModal.proveedorId,
        solicitudId: showObsModal.id,
        motivoObservacion: motivoObsInput,
      });

      if (!res.success) {
        throw new Error(res.error || "Error al observar solicitud");
      }

      setFeedback({
        type: "success",
        message: `Solicitud de pago observada y devuelta al Investigador Principal.`,
      });

      setShowObsModal(null);
      setMotivoObsInput("");
      await cargarSolicitudes();
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: "Error al observar solicitud: " + err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Happy Path: Validar todas las solicitudes y avanzar ───────────────
  const handleHappyPathCompletar = async () => {
    if (solicitudes.length === 0) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      for (const sol of solicitudes) {
        await enviarSolicitudPago({
          tramiteId,
          proveedorId: sol.proveedorId,
          solicitudId: sol.id,
          montoTotal: sol.montoTotal,
          montoLiteral: sol.montoLiteral,
          facturaUrl: sol.facturaUrl,
          notaEntregaUrl: sol.notaEntregaUrl,
        });

        await validarSolicitudPago({
          tramiteId,
          proveedorId: sol.proveedorId,
          solicitudId: sol.id,
        });
      }

      const acciones = tarea.accionesDisponibles || [];
      const transicionFinalizar = acciones[0];

      if (ejecutarTransicion && transicionFinalizar) {
        const transRes = await ejecutarTransicion(
          transicionFinalizar.idTransicion,
          `Solicitudes de pago validadas 100% conformes para ${solicitudes.length} proveedor(es). Avance directo a Memorándum de Pago.`
        );

        if (!transRes.success) {
          console.warn("Advertencia en transición:", transRes.message);
        }
      }

      setFeedback({
        type: "success",
        message: "¡Happy Path exitoso! Todas las solicitudes de pago fueron validadas y el trámite avanzó al siguiente paso.",
      });

      await cargarSolicitudes();
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
          Cargando solicitudes de pago desde Supabase...
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

      {/* Encabezado Principal Tarea 13: Solicitud de Pago */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-extrabold text-white bg-[#001B47] px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-2xs">
              <FileCheck2 className="w-4 h-4" />
              Tarea 13
            </span>
            <div>
              <h3 className="text-base font-extrabold text-[#001B47] tracking-tight">
                Solicitud de Pago a Proveedor
              </h3>
              <p className="text-xs text-slate-500">
                Generación automática de notas de pago, revisión de respaldos y validación por Compras / Contabilidad.
              </p>
            </div>
          </div>

          {/* Botón Acción Rápida Happy Path */}
          {solicitudes.length > 0 && (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleHappyPathCompletar}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
              title="Validar automáticamente las solicitudes de pago y avanzar directamente al siguiente paso"
            >
              <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span>VALIDAR SOLICITUDES Y AVANZAR (HAPPY PATH)</span>
            </button>
          )}
        </div>

        {/* Tarjetas de Solicitud por Proveedor */}
        {solicitudes.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <AlertCircle className="w-6 h-6 text-amber-500 mx-auto" />
            <p className="font-bold text-[#001B47]">Sin solicitudes de pago disponibles</p>
            <p className="text-slate-500">
              Asegúrese de haber completado la recepción de materiales en el Paso 2 previo.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {solicitudes.map((solItem, idx) => (
              <TarjetaSolicitudPagoProveedor
                key={idx}
                solicitud={solItem}
                onGenerarNota={handleGenerarNota}
                onEnviarSolicitud={handleEnviarSolicitud}
                onValidarSolicitud={handleValidarSolicitud}
                onObservarSolicitud={(s) => setShowObsModal(s)}
              />
            ))}
          </div>
        )}

        {/* Botón Principal para Validar y Avanzar */}
        {solicitudes.length > 0 && (
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button
              size="default"
              onClick={handleHappyPathCompletar}
              disabled={isSubmitting}
              className="bg-[#001B47] text-white hover:bg-[#002855] text-xs font-extrabold px-8 py-3 rounded-xl shadow-sm flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Procesando Validación...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>VALIDAR SOLICITUDES Y AVANZAR</span>
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Visor e Impresor Membretado Oficial */}
      <ModalImpresionNotaPago
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        solicitud={selectedNotaModal}
      />

      {/* Modal para ingresar Motivo de Observación */}
      {showObsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center gap-2 text-rose-700 font-extrabold text-sm">
              <XCircle className="w-5 h-5" />
              <span>Observar Solicitud de Pago</span>
            </div>

            <p className="text-xs text-slate-600">
              Ingrese el motivo de la observación para el proveedor{" "}
              <strong>{showObsModal.proveedorNombre}</strong>. El investigador deberá subsanar este punto.
            </p>

            <textarea
              rows={3}
              value={motivoObsInput}
              onChange={(e) => setMotivoObsInput(e.target.value)}
              placeholder="Ej: Falta adjuntar el sello oficial del NIT en la Factura..."
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 font-medium focus:ring-2 focus:ring-rose-500"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowObsModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmarObservacion}
                className="px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white font-extrabold text-xs rounded-xl shadow-xs"
              >
                Confirmar Observación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
