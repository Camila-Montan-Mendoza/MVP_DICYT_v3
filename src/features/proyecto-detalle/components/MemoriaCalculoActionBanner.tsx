"use client";

import { useRouter } from "next/navigation";
import { AlertCircle, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PermisosDetalleProyecto } from "../types";

interface MemoriaCalculoActionBannerProps {
  proyectoId: number;
  permisos: PermisosDetalleProyecto;
}

export function MemoriaCalculoActionBanner({ proyectoId, permisos }: MemoriaCalculoActionBannerProps) {
  const router = useRouter();

  if (permisos.soloLectura) return null;

  if (permisos.puedeDetallarMemoria) {
    return (
      <div className="flex flex-col items-start gap-3 border-b border-[#e5e7eb] bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
          <p className="text-sm text-red-800">
            Esta memoria de cálculo debe ser completada o corregida por el investigador principal.
          </p>
        </div>
        <Button
          size="sm"
          className="shrink-0 bg-[#002855] text-white hover:bg-[#001B47]"
          onClick={() => router.push(`/proyectos/${proyectoId}/memoria-calculo`)}
        >
          Detallar memoria de cálculo
        </Button>
      </div>
    );
  }

  if (permisos.puedeEvaluar) {
    return (
      <div className="flex flex-col items-start gap-3 border-b border-[#e5e7eb] bg-blue-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2">
          <ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#003770]" />
          <p className="text-sm text-[#001B47]">
            Esta memoria de cálculo está en revisión y puede ser aprobada u observada.
          </p>
        </div>
        <Button
          size="sm"
          className="shrink-0 bg-[#002855] text-white hover:bg-[#001B47]"
          onClick={() => router.push(`/proyectos/${proyectoId}/evaluar`)}
        >
          Evaluar Memoria de Cálculo
        </Button>
      </div>
    );
  }

  return null;
}
