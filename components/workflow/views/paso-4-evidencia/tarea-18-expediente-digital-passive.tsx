"use client";

import { useState, useEffect, useCallback } from "react";
import { TaskViewProps } from "../view-types";
import { ArchivoExpedienteData } from "@/types/expediente";
import { obtenerArchivosExpediente } from "@/services/expedienteService";
import { TarjetaResumenArchivos } from "@/components/tramites/evidencia/TarjetaResumenArchivos";
import { Loader2 } from "lucide-react";

export default function Tarea18ExpedienteDigitalPassive({ tramite }: TaskViewProps) {
  const tramiteId = tramite?.id || 3;

  const [loading, setLoading] = useState(true);
  const [archivos, setArchivos] = useState<ArchivoExpedienteData[]>([]);

  const cargarArchivos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await obtenerArchivosExpediente(tramiteId);
      setArchivos(data);
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, [tramiteId]);

  useEffect(() => {
    cargarArchivos();
  }, [cargarArchivos]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <Loader2 className="w-6 h-6 animate-spin text-[#001B47]" />
        <p className="text-xs font-semibold text-slate-500">
          Cargando expediente desde Supabase...
        </p>
      </div>
    );
  }

  return (
    <TarjetaResumenArchivos
      archivos={archivos}
      onSubirArchivo={() => {}}
      onEliminarArchivo={() => {}}
      onArchivarRespaldos={() => {}}
      readOnly={true}
    />
  );
}
