"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { SigefiShell } from "@/components/sigefi-shell";
import { WorkflowStepper } from "@/components/workflow/workflow-stepper";
import { PasoWorkflow, TareaWorkflow } from "@/lib/workflow/stepper-service";
import { TaskTimeline } from "@/components/workflow/task-timeline";
import { InteractiveTaskWorkspace } from "@/components/workflow/interactive-task-workspace";
import {
  tramiteDBRepository,
  TramiteDBItem,
} from "@/lib/db/tramite-repository";
import { cargarGrafoWorkflow } from "@/lib/workflow/workflow-db-service";
import type { NodoWorkflow } from "@/lib/workflow/compra-menor-strategy";
import { ArrowLeft, CheckCircle2, Clock, Stamp } from "lucide-react";

function TramiteWorkflowDetailContent() {
  const routeParams = useParams();
  const rawId = Array.isArray(routeParams?.id)
    ? routeParams.id[0]
    : routeParams?.id;
  const tramiteId = rawId!;

  const [tramite, setTramite] = useState<TramiteDBItem | undefined>();
  const [grafo, setGrafo] = useState<Record<number, NodoWorkflow>>({});
  const [nodoActual, setNodoActual] = useState<NodoWorkflow | null>(null);
  const [pasosList, setPasosList] = useState<PasoWorkflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [tareasList, setTareasList] = useState<TareaWorkflow[]>([]);

  useEffect(() => {
    cargarGrafoWorkflow(1).then(setGrafo);
  }, []);

  const loadTramite = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const tramiteIdNum = parseInt(tramiteId, 10) || 0;
      const found = await tramiteDBRepository.getTramiteById(tramiteId);
      let targetTramite = found;

      if (!targetTramite) {
        const list = await tramiteDBRepository.getTramites();
        targetTramite = list.length > 0 ? list[0] : undefined;
      }

      if (!targetTramite) {
        setLoadError(
          `No se encontró ningún trámite registrado en la base de datos.`
        );
        setIsLoading(false);
        return;
      }

      setTramite(targetTramite);

      const targetId = targetTramite.id || tramiteIdNum;
      const pasos = await tramiteDBRepository.getPasosTramite(targetId);
      if (pasos && pasos.length > 0) {
        setPasosList(pasos);
      } else {
        setLoadError(
          "No se encontraron pasos de flujo registrados en la base de datos."
        );
      }

      const tareas = await tramiteDBRepository.getTareasDelPaso(targetId);
      if (tareas && tareas.length > 0) {
        setTareasList(tareas as TareaWorkflow[]);
      }
    } catch (e: any) {
      setLoadError(e?.message || "Error al conectar con la base de datos.");
    } finally {
      setIsLoading(false);
    }
  }, [tramiteId]);

  useEffect(() => {
    loadTramite();
  }, [loadTramite]);

  // Cuando el trámite o el grafo cambian, resolver el nodo actual
  useEffect(() => {
    if (tramite && Object.keys(grafo).length > 0) {
      const nodo = grafo[tramite.idEstadoTramite] || null;
      setNodoActual(nodo);
    }
  }, [tramite, grafo]);

  const currentStep =
    pasosList.find((p) => p.numero === tramite?.pasoNumero) || pasosList[0];
  const [activeStepId, setActiveStepId] = useState<string>("");

  useEffect(() => {
    if (currentStep) {
      setActiveStepId(currentStep.id);
    }
  }, [currentStep]);

  const activeStep =
    pasosList.find((p) => p.id === activeStepId) || currentStep;

  if (isLoading) {
    return (
      <SigefiShell>
        <div className="max-w-6xl mx-auto py-20 text-center text-xs font-bold text-[#64748b]">
          Cargando flujo del trámite desde la base de datos...
        </div>
      </SigefiShell>
    );
  }

  if (loadError || !tramite || pasosList.length === 0) {
    return (
      <SigefiShell>
        <div className="max-w-3xl mx-auto my-12 p-8 bg-white border border-red-200 rounded-2xl text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-lg font-bold">
            ⚠️
          </div>
          <h3 className="font-extrabold text-base text-red-900">
            Error al consultar los Pasos del Trámite desde la BD
          </h3>
          <p className="text-xs text-red-700 max-w-md mx-auto leading-relaxed">
            {loadError ||
              "No se encontraron pasos de flujo configurados para este trámite en Supabase."}
          </p>
          <div className="pt-2">
            <Link
              href="/tramites"
              className="px-5 py-2.5 bg-[#002855] text-white font-bold text-xs rounded-xl hover:bg-[#001B47] transition-colors inline-block"
            >
              Volver a la Lista de Trámites
            </Link>
          </div>
        </div>
      </SigefiShell>
    );
  }

  const activeTramite = tramite;

  const nodosDelPaso = Object.values(grafo).filter(
    (n) => n.pasoNumero === activeStep.numero,
  );

  const nodoActualResuelto = nodoActual || (Object.values(grafo)[0] ?? null);

  const tareasDelPaso: TareaWorkflow[] =
    tareasList.length > 0
      ? tareasList
      : nodosDelPaso.map((n) => {
          const nodoId = parseInt(n.id, 10);
          const currentId = nodoActualResuelto
            ? parseInt(nodoActualResuelto.id, 10)
            : 1;
          const isCurrent = nodoId === currentId;
          const isCompleted =
            activeTramite.pasoNumero > n.pasoNumero ||
            (activeTramite.pasoNumero === n.pasoNumero && nodoId < currentId);

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
                <strong className="text-[#001B47]">Proyecto:</strong>{" "}
                {activeTramite.proyecto} |{" "}
                <strong className="text-[#001B47]">Solicitante:</strong>{" "}
                {activeTramite.creador}
              </p>
            </div>

            {/* Badge de Estado Global Dinámico */}
            <div>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-2xs ${
                  activeTramite.estado === "Aprobado"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : activeTramite.estado === "Rechazado"
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
          {activeTramite.selloPreventivo &&
            activeTramite.selloPreventivo.correlativo !== "NO_EMITIDO" && (
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200">
                <Stamp className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Sello Preventivo Estampado:{" "}
                  <strong>{activeTramite.selloPreventivo.correlativo}</strong>{" "}
                  por {activeTramite.selloPreventivo.usuarioAprobador}
                </span>
              </div>
            )}
        </div>

        {/* Stepper Horizontal Superior de Pasos Macro */}
        <WorkflowStepper
          pasos={pasosList}
          activeStepId={activeStepId}
          onSelectStep={setActiveStepId}
        />

        {/* Layout Split de 2 Columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <TaskTimeline
              pasoNombre={activeStep.nombre}
              tareas={tareasDelPaso}
            />
          </div>

          {/* Lado Derecho: Área Operativa Server-Driven (8 columnas) */}
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-[#e5e7eb] shadow-2xs space-y-4 flex flex-col justify-between min-h-[420px]">
            <div className="space-y-4">
              <InteractiveTaskWorkspace />
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
