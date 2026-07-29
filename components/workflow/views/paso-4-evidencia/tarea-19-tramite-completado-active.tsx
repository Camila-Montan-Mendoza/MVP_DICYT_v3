"use client";

import { useState, useEffect, useCallback } from "react";
import { TaskViewProps } from "../view-types";
import { ResumenEjecutivoTramiteData } from "@/types/expediente";
import { obtenerResumenEjecutivoTramite } from "@/services/expedienteService";
import { FichaResumenEjecutivoTramite } from "@/components/tramites/evidencia/FichaResumenEjecutivoTramite";
import { Loader2 } from "lucide-react";

export default function Tarea19TramiteCompletadoActive({ tramite }: TaskViewProps) {
  const tramiteId = tramite?.id || 3;

  const [loading, setLoading] = useState(true);
  const [resumen, setResumen] = useState<ResumenEjecutivoTramiteData | null>(null);

  const cargarResumen = useCallback(async () => {
    setLoading(true);
    try {
      const data = await obtenerResumenEjecutivoTramite(tramiteId);
      setResumen(data);
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, [tramiteId]);

  useEffect(() => {
    cargarResumen();
  }, [cargarResumen]);

  if (loading || !resumen) {
    return (
      <div className="flex flex-col items-center justify-center p-12 gap-3 bg-white rounded-2xl border border-slate-200 shadow-2xs">
        <Loader2 className="w-8 h-8 animate-spin text-[#001B47]" />
        <p className="text-xs font-semibold text-slate-500">
          Consolidando resumen del trámite completado desde Supabase...
        </p>
      </div>
    );
  }

  return <FichaResumenEjecutivoTramite resumen={resumen} />;
}
