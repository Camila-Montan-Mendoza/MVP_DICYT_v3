import { FolderOpen, SearchX } from "lucide-react";

export type ProyectosEmptyStateVariant = "sin-proyectos" | "sin-coincidencias";

interface ProyectosEmptyStateProps {
  variant: ProyectosEmptyStateVariant;
}

const CONFIG: Record<ProyectosEmptyStateVariant, { icon: typeof FolderOpen; title: string; description: string }> = {
  "sin-proyectos": {
    icon: FolderOpen,
    title: "Sin proyectos registrados",
    description: "Todavía no hay proyectos asociados a tu rol en el sistema.",
  },
  "sin-coincidencias": {
    icon: SearchX,
    title: "Sin coincidencias para los filtros aplicados",
    description: "Ningún proyecto cumple con los filtros seleccionados. Intenta ajustarlos o límpialos.",
  },
};

export function ProyectosEmptyState({ variant }: ProyectosEmptyStateProps) {
  const { icon: Icon, title, description } = CONFIG[variant];

  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
      <Icon className="h-10 w-10 text-muted-foreground/60" />
      <p className="text-sm font-semibold text-[#001B47]">{title}</p>
      <p className="max-w-sm text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
