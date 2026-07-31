"use client";

import { useState, useEffect, useCallback } from "react";
import { TaskViewProps } from "../view-types";
import { ResumenEjecutivoTramiteData } from "@/types/expediente";
import { obtenerResumenEjecutivoTramite } from "@/services/expedienteService";
import { FichaResumenEjecutivoTramite } from "@/components/tramites/evidencia/FichaResumenEjecutivoTramite";
import { Loader2 } from "lucide-react";

export default function Tarea19TramiteCompletadoPassive({ tramite }: TaskViewProps) {
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
      <div className="flex flex-col items-center justify-center p-8 gap-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <Loader2 className="w-6 h-6 animate-spin text-[#001B47]" />
        <p className="text-xs font-semibold text-slate-500">
          Cargando resumen de trámite completado...
        </p>
      </div>
    );
  }

  return <FichaResumenEjecutivoTramite resumen={resumen} />;
}
