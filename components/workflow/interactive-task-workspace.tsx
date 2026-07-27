"use client";

import { useState } from "react";
import {
  NODOS_COMPRA_MENOR,
  NodoWorkflow,
  AccionTransicion,
} from "@/lib/workflow/compra-menor-strategy";
import {
  Layers,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RotateCw,
  FileCheck,
  Building2,
  XCircle,
} from "lucide-react";import { tramitesStore } from "@/lib/store/tramites-store";

interface InteractiveTaskWorkspaceProps {
  tramiteId: string;
  initialNodeId?: string;
  onNodeTransition?: (nodoNuevo: NodoWorkflow, log: string) => void;
}

export function InteractiveTaskWorkspace({
  tramiteId,
  initialNodeId = "node_1_1",
  onNodeTransition,
}: InteractiveTaskWorkspaceProps) {
  const [currentNodeId, setCurrentNodeId] = useState(() => {
    const item = tramitesStore.getTramiteById(tramiteId);
    return item?.currentNodeId || initialNodeId;
  });
  const [actasProvisionalesCount, setActasProvisionalesCount] = useState(0);
  const [historyLog, setHistoryLog] = useState<
    Array<{ nodoNombre: string; accion: string; fecha: string }>
  >([]);

  const nodoActual = NODOS_COMPRA_MENOR[currentNodeId] || NODOS_COMPRA_MENOR["node_1_1"];

  const handleExecuteAction = (accion: AccionTransicion) => {
    if (accion.tipo === "REPETIR_BUCLE") {
      const newCount = actasProvisionalesCount + 1;
      setActasProvisionalesCount(newCount);
      const logEntry = {
        nodoNombre: nodoActual.nombre,
        accion: `${accion.label} (Total Actas: ${newCount})`,
        fecha: new Date().toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" }),
      };
      setHistoryLog((prev) => [logEntry, ...prev]);
      return;
    }

    const nextNode = NODOS_COMPRA_MENOR[accion.siguienteNodoId] || nodoActual;
    setCurrentNodeId(accion.siguienteNodoId);

    // Persist to Store / Database
    tramitesStore.updateWorkflowNode(tramiteId, nextNode.id, nextNode.pasoNumero);

    const logEntry = {
      nodoNombre: nodoActual.nombre,
      accion: accion.label,
      fecha: new Date().toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" }),
    };
    setHistoryLog((prev) => [logEntry, ...prev]);

    if (onNodeTransition) {
      onNodeTransition(nextNode, `Transición: ${accion.label} a las ${logEntry.fecha}`);
    }
  };

  const getActorBadgeColor = (rol: string) => {
    switch (rol) {
      case "I":
        return "bg-blue-100 text-blue-900 border-blue-200";
      case "RP":
        return "bg-amber-100 text-amber-900 border-amber-200";
      case "RC":
        return "bg-purple-100 text-purple-900 border-purple-200";
      case "AD":
        return "bg-emerald-100 text-emerald-900 border-emerald-200";
      case "CD":
        return "bg-teal-100 text-teal-900 border-teal-200";
      default:
        return "bg-slate-100 text-slate-900 border-slate-200";
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-[#e5e7eb] shadow-2xs space-y-5">
      {/* Header del Espacio Operativo */}
      <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#002855]" />
          <div>
            <h3 className="font-extrabold text-sm text-[#001B47] uppercase tracking-wider">
              Ejecución de Tarea Operativa
            </h3>
            <p className="text-[11px] text-[#6b7280]">
              Estrategia: <strong className="text-[#002855]">Compra Menor (1.001 a 20.000 Bs Material)</strong>
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#002855] text-white shadow-2xs">
          Paso {nodoActual.pasoNumero}/4: {nodoActual.pasoNombre}
        </span>
      </div>

      {/* Tarjeta de Tarea Actual */}
      <div className="p-4 bg-[#f8fafc] border border-[#cbd5e1] rounded-2xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#002855]" />
            <h4 className="font-bold text-base text-[#001B47]">
              {nodoActual.nombre}
            </h4>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-2xs ${getActorBadgeColor(
              nodoActual.actorRol
            )}`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            {nodoActual.actorNombreRol}
          </span>
        </div>

        <p className="text-xs text-[#475569] leading-relaxed bg-white p-3 rounded-xl border border-[#e5e7eb]">
          <strong className="text-[#001B47]">Instrucción de Tarea:</strong> {nodoActual.instruccion}
        </p>

        {/* Muestra de bucle de actas provisionales si aplica */}
        {nodoActual.id === "node_2_3" && actasProvisionalesCount > 0 && (
          <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center justify-between font-semibold">
            <span className="flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-blue-600" />
              Actas de Recepción Provisionales Registradas:
            </span>
            <span className="px-2.5 py-0.5 bg-blue-600 text-white rounded-full font-mono text-xs">
              {actasProvisionalesCount} Acta(s)
            </span>
          </div>
        )}
      </div>

      {/* Botones de Transición de Workflow (Fiel a las Especificaciones del Usuario) */}
      <div className="space-y-2 pt-1">
        <p className="text-xs font-bold text-[#001B47] uppercase tracking-wider">
          Transiciones de Avance Disponibles:
        </p>

        {nodoActual.acciones.length === 0 ? (
          <div className="p-4 rounded-xl text-center text-xs font-bold border border-[#e5e7eb] bg-gray-50 text-[#64748b] flex items-center justify-center gap-2">
            {nodoActual.id === "node_1_4" ? (
              <>
                <XCircle className="w-5 h-5 text-red-600" />
                Trámite Rechazado Definitivamente por Compras.
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Trámite Completado Exitosamente. Flujo Finalizado.
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3">
            {nodoActual.acciones.map((acc) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => handleExecuteAction(acc)}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 ${
                  acc.varianteBtn === "primary"
                    ? "bg-[#002855] text-white hover:bg-[#001B47]"
                    : acc.varianteBtn === "danger"
                    ? "bg-[#BC000C] text-white hover:bg-red-700"
                    : acc.varianteBtn === "outline"
                    ? "bg-white border-2 border-blue-600 text-blue-700 hover:bg-blue-50"
                    : "bg-slate-700 text-white hover:bg-slate-800"
                }`}
              >
                {acc.tipo === "REPETIR_BUCLE" ? (
                  <RotateCw className="w-4 h-4" />
                ) : acc.tipo === "RECHAZAR" ? (
                  <AlertCircle className="w-4 h-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
                {acc.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bitácora / Historial de Transiciones Realizadas en la Sesión */}
      {historyLog.length > 0 && (
        <div className="pt-3 border-t border-[#e5e7eb] space-y-2">
          <p className="text-[11px] font-bold text-[#64748b] uppercase">
            Bitácora de Transiciones en Vivo:
          </p>
          <div className="max-h-28 overflow-y-auto space-y-1.5 text-[11px] font-mono pr-1">
            {historyLog.map((log, idx) => (
              <div
                key={idx}
                className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between"
              >
                <span className="text-[#001B47] font-semibold">
                  {log.nodoNombre} → <strong>{log.accion}</strong>
                </span>
                <span className="text-[#9ca3af]">{log.fecha}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
