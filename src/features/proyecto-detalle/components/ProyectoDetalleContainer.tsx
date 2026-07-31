"use client";

import { useState } from "react";
import { ShieldAlert, FolderX } from "lucide-react";
import { useProyectoDetalle } from "../hooks/useProyectoDetalle";
import { ProyectoHeaderNav } from "./ProyectoHeaderNav";
import { ProyectoInfoCard } from "./ProyectoInfoCard";
import { MemoriaCalculoReadView } from "./MemoriaCalculoReadView";
import { MemoriaCalculoEditView } from "./MemoriaCalculoEditView";

interface ProyectoDetalleContainerProps {
  proyectoId: number;
}

export function ProyectoDetalleContainer({ proyectoId }: ProyectoDetalleContainerProps) {
  const { proyecto, isLoading, error, notFound, forbidden, refetch } = useProyectoDetalle(proyectoId);
  const [activeTab, setActiveTab] = useState<"detalle" | "ejecucion">("detalle");
  const [isEditingOverride, setIsEditingOverride] = useState<boolean | null>(null);

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs font-bold text-slate-500 animate-pulse">
        Cargando detalle del proyecto desde el servidor...
      </div>
    );
  }

  if (forbidden) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-red-200 bg-red-50/50 p-16 text-center shadow-2xs">
        <ShieldAlert className="h-10 w-10 text-[#BC000C]" />
        <p className="text-sm font-extrabold text-[#001B47]">No tiene acceso a este proyecto</p>
        <p className="text-xs text-slate-500 max-w-sm">
          El acceso está restringido únicamente al Investigador Principal asignado o al Administrador.
        </p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-16 text-center shadow-2xs">
        <FolderX className="h-10 w-10 text-slate-400" />
        <p className="text-sm font-extrabold text-[#001B47]">Proyecto no encontrado</p>
      </div>
    );
  }

  if (error || !proyecto) {
    return (
      <div className="p-6 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-800">
        {error ?? "Error al consultar el proyecto"}
      </div>
    );
  }

  // Determinar si la pantalla está en modo edición
  const puedeDetallar = Boolean(proyecto.permisos?.puedeDetallarMemoria);
  const isEditing = isEditingOverride !== null ? isEditingOverride : puedeDetallar;

  return (
    <div className="space-y-6">
      {/* Header con Pestañas "Detalle del Proyecto" | "Ejecución Presupuestaria" */}
      <ProyectoHeaderNav
        proyectoId={proyecto.id}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === "ejecucion" ? (
        <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
          <p className="font-bold text-[#001B47]">Módulo de Ejecución Presupuestaria del Proyecto</p>
          <p className="text-[11px] mt-1 text-slate-400">
            Consolidado de gastos ejecutados y trámites iniciados en este proyecto.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Card de Información Principal del Proyecto */}
          <ProyectoInfoCard proyecto={proyecto} />

          {/* Área de Memoria de Cálculo (Modo Lectura o Modo Edición) */}
          {isEditing ? (
            <MemoriaCalculoEditView
              proyecto={proyecto}
              onProyectoUpdated={(updated) => {
                setIsEditingOverride(false);
                refetch();
              }}
              onCancelar={() => setIsEditingOverride(false)}
            />
          ) : (
            <MemoriaCalculoReadView
              partidas={proyecto.memoriaCalculo}
              total={proyecto.totalMemoriaCalculo}
              puedeDetallar={puedeDetallar}
              onEditarClick={() => setIsEditingOverride(true)}
            />
          )}
        </div>
      )}
    </div>
  );
}
