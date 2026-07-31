import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EstadoProyectoBadge } from "@/src/features/proyectos-lista/components/EstadoProyectoBadge";
import { ProyectoDetalle } from "../types";

interface ProyectoInfoCardProps {
  proyecto: ProyectoDetalle;
}

function formatMonto(monto: number): string {
  return `${monto.toLocaleString("es-BO", { minimumFractionDigits: 2 })} Bs.`;
}

function formatFecha(iso: string): string {
  const [year, month, day] = iso.split("T")[0].split("-");
  return `${day}/${month}/${year}`;
}

function Campo({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-[#6b7280]">{label}</p>
      <p className="text-sm font-bold text-[#001B47]">{value}</p>
    </div>
  );
}

export function ProyectoInfoCard({ proyecto }: ProyectoInfoCardProps) {
  return (
    <Card className="border-[#e5e7eb] bg-white text-[#2c3e50] shadow-sm">
      <CardContent className="space-y-6 p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-bold text-[#001B47]">{proyecto.nombre}</h2>
          <EstadoProyectoBadge estadoId={proyecto.estado.id} nombre={proyecto.estado.nombre} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Campo
            label="Investigador Principal"
            value={proyecto.investigadorPrincipal?.nombre ?? "Sin asignar"}
          />
          <Campo label="Presupuesto Total" value={formatMonto(proyecto.presupuestoTotal)} />
          <Campo label="Programa" value={proyecto.programa} />

          <Campo
            label="Fuente de Financiamiento"
            value={proyecto.fuenteFinanciamiento ?? "No especificado"}
          />
          <Campo
            label="Fecha de Inicio"
            value={
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#6b7280]" />
                {formatFecha(proyecto.fechaInicio)}
              </span>
            }
          />
          <Campo
            label="Fecha de Fin"
            value={
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#6b7280]" />
                {formatFecha(proyecto.fechaFin)}
              </span>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
