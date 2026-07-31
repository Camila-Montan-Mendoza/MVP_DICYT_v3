import { AlertCircle, AlertTriangle, CheckCircle2, Clock, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { EstadoProyectoId } from "../types";

interface EstadoVisualConfig {
  className: string;
  icon: LucideIcon;
}

const ESTADO_VISUAL_MAP: Record<EstadoProyectoId, EstadoVisualConfig> = {
  1: {
    className: "bg-red-50 text-red-700 border-red-200",
    icon: AlertCircle,
  },
  2: {
    className: "bg-blue-50 text-[#003770] border-blue-200",
    icon: Clock,
  },
  3: {
    className: "bg-amber-50 text-amber-800 border-amber-200",
    icon: AlertTriangle,
  },
  4: {
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
};

export function getEstadoVisualConfig(estadoId: EstadoProyectoId): EstadoVisualConfig {
  return ESTADO_VISUAL_MAP[estadoId] ?? ESTADO_VISUAL_MAP[1];
}

interface EstadoProyectoBadgeProps {
  estadoId: EstadoProyectoId;
  nombre: string;
}

export function EstadoProyectoBadge({ estadoId, nombre }: EstadoProyectoBadgeProps) {
  const { className, icon: Icon } = getEstadoVisualConfig(estadoId);

  return (
    <Badge variant="outline" className={cn("gap-1.5 font-medium", className)}>
      <Icon className="h-3.5 w-3.5" />
      {nombre}
    </Badge>
  );
}
