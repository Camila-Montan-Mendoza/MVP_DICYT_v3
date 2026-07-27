"use client";

import { useState, Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { SigefiShell } from "@/components/sigefi-shell";
import { WorkflowStepper } from "@/components/workflow/workflow-stepper";
import { TaskTimeline } from "@/components/workflow/task-timeline";
import { RevisionPreventivaCard } from "@/components/budget/revision-preventiva-card";
import { getTramiteWorkflowDetail } from "@/lib/workflow/stepper-service";
import { ArrowLeft, Layers } from "lucide-react";

function TramiteWorkflowDetailContent() {
  const routeParams = useParams();
  const rawId = Array.isArray(routeParams?.id) ? routeParams.id[0] : routeParams?.id;
  const tramiteId = rawId || "tr-001";
  const tramite = getTramiteWorkflowDetail(tramiteId);

  // Selected Macro Step state (defaults to the step currently EN_CURSO)
  const currentStep = tramite.pasos.find((p) => p.estado === "EN_CURSO") || tramite.pasos[0];
  const [activeStepId, setActiveStepId] = useState(currentStep.id);

  const activeStep = tramite.pasos.find((p) => p.id === activeStepId) || currentStep;
  const tareasDelPaso = tramite.tareas.filter((t) => t.pasoId === activeStepId);

  return (
    <SigefiShell>
      <div className="space-y-6 max-w-6xl mx-auto pb-24">
        {/* Botón Volver */}
        <div>
          <Link
            href="/tramites"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#002855] hover:text-[#001B47] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a la Lista de Trámites
          </Link>
        </div>

        {/* Encabezado del Trámite */}
        <div className="space-y-1 bg-white p-5 rounded-2xl border border-[#e5e7eb] shadow-2xs">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#001B47] tracking-tight">
            Trámite Nº {tramite.nroTramite}
          </h1>
          <p className="text-xs text-[#64748b]">
            <strong className="text-[#001B47]">Proyecto:</strong> {tramite.proyectoNombre} |{" "}
            <strong className="text-[#001B47]">Solicitante:</strong> {tramite.solicitanteNombre}
          </p>
        </div>

        {/* Stepper Horizontal Superior de Pasos Macro */}
        <WorkflowStepper
          pasos={tramite.pasos}
          activeStepId={activeStepId}
          onSelectStep={setActiveStepId}
        />

        {/* Layout Split de 2 Columnas (Lado Izquierdo: Cronología de Tareas; Lado Derecho: Espacio para UI Operativa) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Lado Izquierdo: Cronología Vertical de Tareas (4 columnas) */}
          <div className="lg:col-span-4">
            <TaskTimeline
              pasoNombre={activeStep.nombre}
              tareas={tareasDelPaso}
              currentUser="Marcelino Perez"
            />
          </div>

          {/* Lado Derecho: Contenedor para UI Operativa de Ejecución (8 columnas) */}
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-[#e5e7eb] shadow-2xs space-y-4 flex flex-col justify-between min-h-[420px]">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#002855]" />
                  <h3 className="font-extrabold text-sm text-[#001B47] uppercase tracking-wider">
                    Área Operativa — {activeStep.nombre}
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#f1f5f9] text-[#002855]">
                  Paso {activeStep.numero} de {tramite.pasos.length}
                </span>
              </div>

              {/* UI Operativa de Revisión Presupuestaria y Sello Preventivo */}
              <RevisionPreventivaCard tramiteId={tramiteId} />
            </div>

            <div className="text-[11px] text-[#9ca3af] border-t border-[#e5e7eb] pt-3 flex items-center justify-between">
              <span>Módulo de Ejecución Operativa SIGEFI DICYT</span>
              <span className="font-mono text-[#002855] font-bold">Estado: Read-Only Stepper</span>
            </div>
          </div>
        </div>
      </div>
    </SigefiShell>
  );
}

export default function TramiteWorkflowDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f4f6f9] flex items-center justify-center p-8 text-center text-xs text-[#6b7280]">
          Cargando flujo del trámite...
        </div>
      }
    >
      <TramiteWorkflowDetailContent />
    </Suspense>
  );
}
