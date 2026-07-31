"use client";

import { AlertTriangle } from "lucide-react";
import { ProyectoDetalle } from "../types";

interface MemoriaCalculoActionBannerProps {
  proyecto: ProyectoDetalle;
  onAprobarClick?: () => void;
  onObservarClick?: () => void;
}

export function MemoriaCalculoActionBanner({ proyecto }: MemoriaCalculoActionBannerProps) {
  const { estado, ultimaObservacion } = proyecto;

  // Estado Observado (ID 3): Mostrar motivo de la observación al Investigador Principal
  if (estado.id === 3 || (ultimaObservacion && estado.id !== 4)) {
    return (
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl shadow-2xs space-y-2">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Proyecto Observado por la Unidad de Presupuestos</span>
        </div>
        <div className="pl-6 text-xs text-amber-950 font-medium bg-white/60 p-3 rounded-xl border border-amber-200/60">
          <p className="font-bold text-[11px] text-amber-800 uppercase tracking-wider mb-0.5">
            Motivo de la Observación:
          </p>
          <p>
            {ultimaObservacion ||
              "Se registraron observaciones en el desglose de partidas de este proyecto."}
          </p>
        </div>
      </div>
    );
  }

  return null;
}
