"use client";

import { useState } from "react";
import type {
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
} from "lucide-react";
import { workflowRepository } from "@/lib/db/workflow-repository";

interface InteractiveTaskWorkspaceProps {
  tramiteId: string;
  /** El nodo actual viene del servidor (BD), NO de un diccionario local */
  nodoActual: NodoWorkflow;
  /** Callback para resolver el nodo destino tras una transición */
  onResolveNextNode: (destinoDbId: number) => Promise<NodoWorkflow | null>;
  onNodeTransition?: (nodoNuevo: NodoWorkflow, log: string) => void;
}

export function InteractiveTaskWorkspace({
  tramiteId,
  nodoActual,
  onResolveNextNode,
  onNodeTransition,
}: InteractiveTaskWorkspaceProps) {
  const [currentNodo, setCurrentNodo] = useState<NodoWorkflow>(nodoActual);
  const [actasProvisionalesCount, setActasProvisionalesCount] = useState(0);
  const [historyLog, setHistoryLog] = useState<
    Array<{ nodoNombre: string; accion: string; fecha: string }>
  >([]);

  const handleExecuteAction = async (accion: AccionTransicion) => {
    if (accion.tipo === "REPETIR_BUCLE") {
      const newCount = actasProvisionalesCount + 1;
      setActasProvisionalesCount(newCount);
      const logEntry = {
        nodoNombre: currentNodo.nombre,
        accion: `${accion.label} (Total Actas: ${newCount})`,
        fecha: new Date().toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" }),
      };
      setHistoryLog((prev) => [logEntry, ...prev]);
      return;
    }

    const destinoDbId = parseInt(accion.siguienteNodoId, 10);

    // Persist transition to Postgres DB
    const tramiteIdNum = parseInt(tramiteId.replace(/\D/g, ""), 10) || 1;
    const origenDbId = parseInt(currentNodo.id, 10) || 1;
    await workflowRepository.transicionarEstadoTramite(
      tramiteIdNum,
      origenDbId,
      destinoDbId,
      1,
      accion.label
    );

    // Resolver el nodo destino desde la BD
    const nextNode = await onResolveNextNode(destinoDbId);
    if (nextNode) {
      setCurrentNodo(nextNode);
    }

    const logEntry = {
      nodoNombre: currentNodo.nombre,
      accion: accion.label,
      fecha: new Date().toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" }),
    };
    setHistoryLog((prev) => [logEntry, ...prev]);

    if (onNodeTransition && nextNode) {
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

  // Detectar si el nodo actual es terminal (sin acciones) y si fue rechazado
  const isRejected = currentNodo.acciones.length === 0 && currentNodo.nombre.toLowerCase().includes("rechazo");
  const isCompleted = currentNodo.acciones.length === 0 && !isRejected;

  // Detectar nodo de recepción provisional por nombre (server-driven, no por ID hardcodeado)
  const isRecepcionProvisional = currentNodo.nombre.toLowerCase().includes("recepción provisional");

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
          Paso {currentNodo.pasoNumero}/4: {currentNodo.pasoNombre}
        </span>
      </div>

      {/* Tarjeta de Tarea Actual — Renderizado genérico basado en datos del servidor */}
      <div className="p-4 bg-[#f8fafc] border border-[#cbd5e1] rounded-2xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#002855]" />
            <h4 className="font-bold text-base text-[#001B47]">
              {currentNodo.nombre}
            </h4>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-2xs ${getActorBadgeColor(
              currentNodo.actorRol
            )}`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            {currentNodo.actorNombreRol}
          </span>
        </div>

        <p className="text-xs text-[#475569] leading-relaxed bg-white p-3 rounded-xl border border-[#e5e7eb]">
          <strong className="text-[#001B47]">Instrucción de Tarea:</strong> {currentNodo.instruccion}
        </p>

        {/* Contador de actas provisionales (server-driven: detectado por nombre del nodo) */}
        {isRecepcionProvisional && actasProvisionalesCount > 0 && (
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

      {/* Botones de Transición — Renderizados dinámicamente desde las acciones que vienen de la BD */}
      <div className="space-y-2 pt-1">
        <p className="text-xs font-bold text-[#001B47] uppercase tracking-wider">
          Transiciones de Avance Disponibles:
        </p>

        {currentNodo.acciones.length === 0 ? (
          <div className="p-4 rounded-xl text-center text-xs font-bold border border-[#e5e7eb] bg-gray-50 text-[#64748b] flex items-center justify-center gap-2">
            {isRejected ? (
              <>
                <XCircle className="w-5 h-5 text-red-600" />
                Trámite Rechazado Definitivamente.
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
            {currentNodo.acciones.map((acc) => (
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
