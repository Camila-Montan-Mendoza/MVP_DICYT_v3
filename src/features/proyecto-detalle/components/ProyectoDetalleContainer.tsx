"use client";

import { ShieldAlert, FolderX } from "lucide-react";
import { useProyectoDetalle } from "../hooks/useProyectoDetalle";
import { ProyectoInfoCard } from "./ProyectoInfoCard";
import { MemoriaCalculoTable } from "./MemoriaCalculoTable";
import { MemoriaCalculoActionBanner } from "./MemoriaCalculoActionBanner";

interface ProyectoDetalleContainerProps {
  proyectoId: number;
}

export function ProyectoDetalleContainer({ proyectoId }: ProyectoDetalleContainerProps) {
  const { proyecto, isLoading, error, notFound, forbidden } = useProyectoDetalle(proyectoId);

  if (isLoading) {
    return <p className="p-6 text-sm text-[#6b7280]">Cargando proyecto...</p>;
  }

  if (forbidden) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white p-16 text-center">
        <ShieldAlert className="h-10 w-10 text-red-500" />
        <p className="text-sm font-semibold text-[#001B47]">No tiene acceso a este proyecto</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white p-16 text-center">
        <FolderX className="h-10 w-10 text-[#6b7280]" />
        <p className="text-sm font-semibold text-[#001B47]">Proyecto no encontrado</p>
      </div>
    );
  }

  if (error || !proyecto) {
    return <p className="p-6 text-sm text-red-700">{error ?? "Error al consultar el proyecto"}</p>;
  }

  return (
    <div className="space-y-6">
      <ProyectoInfoCard proyecto={proyecto} />

      <div>
        <h3 className="mb-3 text-base font-bold text-[#001B47]">Memoria de cálculo del proyecto</h3>
        <div className="rounded-lg border border-[#e5e7eb] bg-white">
          <MemoriaCalculoActionBanner proyectoId={proyecto.id} permisos={proyecto.permisos} />
          <MemoriaCalculoTable partidas={proyecto.memoriaCalculo} total={proyecto.totalMemoriaCalculo} />
        </div>
      </div>
    </div>
  );
}
