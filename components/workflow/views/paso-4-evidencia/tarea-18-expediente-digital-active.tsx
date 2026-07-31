"use client";

import { useState, useEffect, useCallback } from "react";
import { TaskViewProps } from "../view-types";
import { ArchivoExpedienteData } from "@/types/expediente";
import {
  obtenerArchivosExpediente,
  guardarArchivoExpediente,
  eliminarArchivoExpediente,
  archivarExpedienteFinal,
} from "@/services/expedienteService";
import { TarjetaResumenArchivos } from "@/components/tramites/evidencia/TarjetaResumenArchivos";
import { FileCheck2, CheckCircle2, Loader2 } from "lucide-react";

export default function Tarea18ExpedienteDigitalActive({
  tarea,
  tramite,
  ejecutarTransicion,
}: TaskViewProps) {
  const tramiteId = tramite?.id || 3;

  const [loading, setLoading] = useState(true);
  const [archivos, setArchivos] = useState<ArchivoExpedienteData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const cargarArchivos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await obtenerArchivosExpediente(tramiteId);
      setArchivos(data);
    } catch {
      setFeedback({
        type: "error",
        message: "No se pudieron consultar los archivos del expediente desde Supabase.",
      });
    } finally {
      setLoading(false);
    }
  }, [tramiteId]);

  useEffect(() => {
    cargarArchivos();
  }, [cargarArchivos]);

  // Subir nuevo archivo al expediente
  const handleSubirArchivo = async (file: File) => {
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const urlTemp = URL.createObjectURL(file);
      const esPdf = file.name.toLowerCase().endsWith(".pdf");

      const res = await guardarArchivoExpediente({
        tramiteId,
        nombreArchivo: file.name,
        urlArchivo: urlTemp,
        tipoArchivo: esPdf ? "pdf" : "image",
        tamanoBytes: file.size,
      });

      if (!res.success) {
        throw new Error(res.error || "Error al subir archivo");
      }

      setFeedback({
        type: "success",
        message: `¡Archivo "${file.name}" cargado al expediente digital!`,
      });

      await cargarArchivos();
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: "Error al subir archivo: " + err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Eliminar archivo de la lista borrador
  const handleEliminarArchivo = async (archivoId: number, index: number) => {
    setIsSubmitting(true);
    try {
      if (archivoId && archivoId > 0 && archivoId < 100) {
        await eliminarArchivoExpediente(archivoId);
      }
      setArchivos((prev) => prev.filter((_, idx) => idx !== index));
      setFeedback({
        type: "success",
        message: "Archivo removido del expediente.",
      });
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: "Error al remover archivo: " + err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Acción Principal: Archivar respaldos y avanzar a Tarea 19
  const handleArchivarRespaldos = async () => {
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await archivarExpedienteFinal(tramiteId);

      if (!res.success) {
        throw new Error(res.error || "Error al archivar expediente");
      }

      const acciones = tarea.accionesDisponibles || [];
      const transicionFinalizar =
        acciones.find(
          (a) =>
            a.idEstadoDestino === 19 ||
            a.nombreAccion.toLowerCase().includes("complet") ||
            a.nombreAccion.toLowerCase().includes("finaliz")
        ) || acciones[0];

      if (ejecutarTransicion && transicionFinalizar) {
        const transRes = await ejecutarTransicion(
          transicionFinalizar.idTransicion,
          `Expediente Digital de Respaldos consolidado con ${archivos.length} archivo(s). Trámite avanzado a Completado.`
        );

        if (!transRes.success) {
          console.warn("Advertencia en transición:", transRes.message);
        }
      }

      setFeedback({
        type: "success",
        message: "¡Expediente digital archivado exitosamente! Avance automático a Trámite Completado.",
      });

      await cargarArchivos();
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: "Error al archivar respaldos: " + err.message,
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
          Cargando expediente digital desde Supabase...
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

      {/* Encabezado Tarea 18 */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-extrabold text-white bg-[#001B47] px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-2xs">
            <FileCheck2 className="w-4 h-4" />
            Tarea 18
          </span>
          <div>
            <h3 className="text-base font-extrabold text-[#001B47] tracking-tight">
              Expediente Digital de Respaldos
            </h3>
            <p className="text-xs text-slate-500">
              Carga final de documentos y archivación definitiva del trámite en Supabase.
            </p>
          </div>
        </div>

        {/* Tarjeta Maqueta "Resumen de archivos" */}
        <TarjetaResumenArchivos
          archivos={archivos}
          onSubirArchivo={handleSubirArchivo}
          onEliminarArchivo={handleEliminarArchivo}
          onArchivarRespaldos={handleArchivarRespaldos}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
