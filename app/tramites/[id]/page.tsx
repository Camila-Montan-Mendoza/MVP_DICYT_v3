"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { SigefiShell } from "@/components/sigefi-shell";
import { WorkflowStepper } from "@/components/workflow/workflow-stepper";
import { PasoWorkflow, TareaWorkflow } from "@/lib/workflow/stepper-service";
import { TaskTimeline } from "@/components/workflow/task-timeline";
import { WorkflowSharedUI } from "@/components/workflow/workflow-shared-ui";
import { InteractiveTaskWorkspace } from "@/components/workflow/interactive-task-workspace";
import { tramiteDBRepository, TramiteDBItem } from "@/lib/db/tramite-repository";
import { NODOS_COMPRA_MENOR } from "@/lib/workflow/compra-menor-strategy";
import { ArrowLeft, Layers, CheckCircle2, Clock, Stamp } from "lucide-react";

function TramiteWorkflowDetailContent() {
  const routeParams = useParams();
  const rawId = Array.isArray(routeParams?.id) ? routeParams.id[0] : routeParams?.id;
  const tramiteId = rawId || "1";

  const [tramite, setTramite] = useState<TramiteDBItem | undefined>();

  const loadTramite = () => {
    tramiteDBRepository.getTramiteById(tramiteId).then((found) => {
      if (found) setTramite(found);
      else {
        tramiteDBRepository.getTramites().then((list) => setTramite(list[0]));
      }
    });
  };

  useEffect(() => {
    loadTramite();
  }, [tramiteId]);

  const refreshTramite = () => {
    loadTramite();
  };

  const activeTramite: TramiteDBItem = tramite || {
    id: 1,
    nro: "01",
    codigoSeguimiento: "TR-2026-001",
    proyecto: "Implementación de IA para la Agricultura",
    tipoTramite: "Compra Menor de 1.001 Bs. a 20.000 Bs. de Material",
    categoria: "MATERIAL",
    fecha: "15 Ene 2026",
    fechaISO: new Date().toISOString(),
    creador: "Dr. Daniel Pérez",
    justificacion: "Adquisición de insumos y reactivos.",
    idEstadoTramite: 1,
    currentNodeId: "node_1_1",
    estadoNombre: "Revisión de disponibilidad presupuestaria y certificación de fondos",
    estado: "En proceso",
    pasoNumero: 1,
    pasoNombre: "PASO 1: Solicitud",
    items: [],
  };

  const pasosList: PasoWorkflow[] = [
    { id: "p1", numero: 1, nombre: "Solicitud", estado: activeTramite.pasoNumero === 1 ? "EN_CURSO" : activeTramite.pasoNumero > 1 ? "COMPLETADO" : "PENDIENTE" },
    { id: "p2", numero: 2, nombre: "Recepción", estado: activeTramite.pasoNumero === 2 ? "EN_CURSO" : activeTramite.pasoNumero > 2 ? "COMPLETADO" : "PENDIENTE" },
    { id: "p3", numero: 3, nombre: "Pago", estado: activeTramite.pasoNumero === 3 ? "EN_CURSO" : activeTramite.pasoNumero > 3 ? "COMPLETADO" : "PENDIENTE" },
    { id: "p4", numero: 4, nombre: "Evidencia", estado: activeTramite.pasoNumero === 4 ? "EN_CURSO" : "PENDIENTE" },
  ];

  const currentStep = pasosList.find((p) => p.numero === activeTramite.pasoNumero) || pasosList[0];
  const [activeStepId, setActiveStepId] = useState(currentStep.id);

  useEffect(() => {
    setActiveStepId(`p${activeTramite.pasoNumero}`);
  }, [activeTramite.pasoNumero]);

  const activeStep = pasosList.find((p) => p.id === activeStepId) || currentStep;

  // Retrieve ALL granular tasks belonging to the active macro step
  const nodosDelPaso = Object.values(NODOS_COMPRA_MENOR).filter(
    (n) => n.pasoNumero === activeStep.numero
  );
  const currentNodoActual =
    NODOS_COMPRA_MENOR[activeTramite.currentNodeId] || NODOS_COMPRA_MENOR["node_1_1"];

  const tareasDelPaso: TareaWorkflow[] = nodosDelPaso.map((n) => {
    const isCurrent = n.id === currentNodoActual.id;
    const isCompleted =
      activeTramite.pasoNumero > n.pasoNumero ||
      (activeTramite.pasoNumero === n.pasoNumero &&
        parseInt(n.id.split("_")[2], 10) < parseInt(currentNodoActual.id.split("_")[2], 10));

    return {
      id: n.id,
      pasoId: `p${n.pasoNumero}`,
      nombre: n.nombre,
      rolResponsable: n.actorNombreRol,
      usuarioAsignado: n.actorNombreRol,
      estado: isCurrent ? "EN_CURSO" : isCompleted ? "COMPLETADO" : "PENDIENTE",
    };
  });

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
        <div className="bg-white p-5 rounded-2xl border border-[#e5e7eb] shadow-2xs space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#001B47] tracking-tight">
                Trámite Nº {activeTramite.codigoSeguimiento}
              </h1>
              <p className="text-xs text-[#64748b] mt-0.5">
                <strong className="text-[#001B47]">Proyecto:</strong> {activeTramite.proyecto} |{" "}
                <strong className="text-[#001B47]">Solicitante:</strong> {activeTramite.creador}
              </p>
            </div>

            {/* Badge de Estado Global Dinámico */}
            <div>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-2xs ${
                  activeTramite.estado === "Aprobado"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : activeTramite.estado === "Observado por Presupuestos"
                    ? "bg-red-100 text-red-800 border border-red-200"
                    : "bg-amber-100/90 text-amber-900 border border-amber-200"
                }`}
              >
                {activeTramite.estado === "Aprobado" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Clock className="w-4 h-4 text-amber-700" />
                )}
                {activeTramite.estado}
              </span>
            </div>
          </div>

          {/* Muestra de Sello Preventivo Estampado en Encabezado si existe */}
          {activeTramite.selloPreventivo && activeTramite.selloPreventivo.correlativo !== "NO_EMITIDO" && (
            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200">
              <Stamp className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Sello Preventivo Estampado: <strong>{activeTramite.selloPreventivo.correlativo}</strong> por {activeTramite.selloPreventivo.usuarioAprobador}</span>
            </div>
          )}
        </div>

        {/* Stepper Horizontal Superior de Pasos Macro */}
        <WorkflowStepper
          pasos={pasosList}
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
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#002855]" />
                  <h3 className="font-extrabold text-sm text-[#001B47] uppercase tracking-wider">
                    Área Operativa — {activeStep.nombre}
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#f1f5f9] text-[#002855]">
                  Paso {activeStep.numero} de 4
                </span>
              </div>

              {/* UI Operativa Dinámica: Flujo de Transiciones y Estrategia Compra Menor */}
              <InteractiveTaskWorkspace
                tramiteId={String(activeTramite.id)}
                initialNodeId={activeTramite.currentNodeId}
                onNodeTransition={(nextNode, _log) => {
                  const nuevoPasoId = `p${nextNode.pasoNumero}`;
                  setActiveStepId(nuevoPasoId);
                  refreshTramite();
                }}
              />

              {/* UI Operativa Dinámica Compartida por Tipo de Nodo */}
              <WorkflowSharedUI
                nodo={currentNodoActual}
                tramiteId={String(activeTramite.id)}
                onRefresh={refreshTramite}
              />
            </div>

            <div className="text-[11px] text-[#9ca3af] border-t border-[#e5e7eb] pt-3 flex items-center justify-between">
              <span>Módulo de Ejecución Operativa SIGEFI DICYT</span>
              <span className="font-mono text-[#002855] font-bold">Estado Real: Conectado a Postgres DB</span>
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
