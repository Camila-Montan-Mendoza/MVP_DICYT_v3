import React from 'react';
import { Database, AlertCircle } from 'lucide-react';

interface EmptyDashboardStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function EmptyDashboardState({
  title = 'Sin datos asignados en Supabase',
  description = 'No se encontraron registros activos de programas o proyectos de investigación asociados a tu usuario.',
  onRetry,
}: EmptyDashboardStateProps) {
  return (
    <div className="bg-white border border-border rounded-xl p-12 text-center shadow-sm flex flex-col items-center justify-center my-6">
      <div className="p-4 rounded-full bg-muted text-muted-foreground mb-4">
        <Database className="w-10 h-10" />
      </div>
      <h3 className="text-lg font-semibold text-[#001B47] mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md mb-6">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#003770] rounded-lg hover:bg-[#002855] transition-colors"
        >
          <AlertCircle className="w-4 h-4" />
          Actualizar Consulta
        </button>
      )}
    </div>
  );
}
