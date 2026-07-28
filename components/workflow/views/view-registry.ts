"use client";

import { lazy, ComponentType } from "react";
import { TaskViewProps } from "./view-types";
import GenericFallbackView from "./generic-fallback-view";

/**
 * Entrada del registro: par de componentes (active/passive) para una tarea.
 */
type ViewEntry = {
  active: ComponentType<TaskViewProps>;
  passive: ComponentType<TaskViewProps>;
};

/**
 * Registro estático 2D: [tarea_id] × [active | passive] → Componente React.
 *
 * Cada tarea del flujo de "Compra Menor" tiene su par de vistas.
 * Los componentes se cargan con React.lazy() para code-splitting automático.
 *
 * Para agregar una vista nueva:
 * 1. Crea el archivo en la carpeta del paso correspondiente
 * 2. Agrega la entrada aquí con el ID de la tarea
 */
const registry: Record<string, ViewEntry> = {
  // ── Paso 1: Solicitud ─────────────────────────────────────────────
  "1": {
    active: lazy(() => import("./paso-1-solicitud/tarea-1-revision-presupuestaria-active")),
    passive: lazy(() => import("./paso-1-solicitud/tarea-1-revision-presupuestaria-passive")),
  },
  "2": {
    active: lazy(() => import("./paso-1-solicitud/tarea-2-revision-tecnica-active")),
    passive: lazy(() => import("./paso-1-solicitud/tarea-2-revision-tecnica-passive")),
  },
  "3": {
    active: lazy(() => import("./paso-1-solicitud/tarea-3-subsanacion-correcciones-active")),
    passive: lazy(() => import("./paso-1-solicitud/tarea-3-subsanacion-correcciones-passive")),
  },
  "4": {
    active: lazy(() => import("./paso-1-solicitud/tarea-4-rechazo-definitivo-active")),
    passive: lazy(() => import("./paso-1-solicitud/tarea-4-rechazo-definitivo-passive")),
  },
  "5": {
    active: lazy(() => import("./paso-1-solicitud/tarea-5-aprobacion-institucional-active")),
    passive: lazy(() => import("./paso-1-solicitud/tarea-5-aprobacion-institucional-passive")),
  },
  "6": {
    active: lazy(() => import("./paso-1-solicitud/tarea-6-verificacion-mercado-virtual-active")),
    passive: lazy(() => import("./paso-1-solicitud/tarea-6-verificacion-mercado-virtual-passive")),
  },
  "7": {
    active: lazy(() => import("./paso-1-solicitud/tarea-7-carga-cotizaciones-active")),
    passive: lazy(() => import("./paso-1-solicitud/tarea-7-carga-cotizaciones-passive")),
  },
  "8": {
    active: lazy(() => import("./paso-1-solicitud/tarea-8-adjudicacion-formal-active")),
    passive: lazy(() => import("./paso-1-solicitud/tarea-8-adjudicacion-formal-passive")),
  },

  // ── Paso 2: Recepción ─────────────────────────────────────────────
  "9": {
    active: lazy(() => import("./paso-2-recepcion/tarea-9-emision-orden-compra-active")),
    passive: lazy(() => import("./paso-2-recepcion/tarea-9-emision-orden-compra-passive")),
  },
  "10": {
    active: lazy(() => import("./paso-2-recepcion/tarea-10-firma-formalizacion-active")),
    passive: lazy(() => import("./paso-2-recepcion/tarea-10-firma-formalizacion-passive")),
  },
  "11": {
    active: lazy(() => import("./paso-2-recepcion/tarea-11-recepcion-provisional-active")),
    passive: lazy(() => import("./paso-2-recepcion/tarea-11-recepcion-provisional-passive")),
  },
  "12": {
    active: lazy(() => import("./paso-2-recepcion/tarea-12-recepcion-definitiva-active")),
    passive: lazy(() => import("./paso-2-recepcion/tarea-12-recepcion-definitiva-passive")),
  },

  // ── Paso 3: Pago ──────────────────────────────────────────────────
  "13": {
    active: lazy(() => import("./paso-3-pago/tarea-13-solicitud-pago-active")),
    passive: lazy(() => import("./paso-3-pago/tarea-13-solicitud-pago-passive")),
  },
  "14": {
    active: lazy(() => import("./paso-3-pago/tarea-14-memorandum-pago-active")),
    passive: lazy(() => import("./paso-3-pago/tarea-14-memorandum-pago-passive")),
  },
  "15": {
    active: lazy(() => import("./paso-3-pago/tarea-15-comprobante-c31-active")),
    passive: lazy(() => import("./paso-3-pago/tarea-15-comprobante-c31-passive")),
  },
  "16": {
    active: lazy(() => import("./paso-3-pago/tarea-16-cheque-transferencia-active")),
    passive: lazy(() => import("./paso-3-pago/tarea-16-cheque-transferencia-passive")),
  },
  "17": {
    active: lazy(() => import("./paso-3-pago/tarea-17-ejecucion-presupuestaria-active")),
    passive: lazy(() => import("./paso-3-pago/tarea-17-ejecucion-presupuestaria-passive")),
  },

  // ── Paso 4: Evidencia ─────────────────────────────────────────────
  "18": {
    active: lazy(() => import("./paso-4-evidencia/tarea-18-expediente-digital-active")),
    passive: lazy(() => import("./paso-4-evidencia/tarea-18-expediente-digital-passive")),
  },
  "19": {
    active: lazy(() => import("./paso-4-evidencia/tarea-19-tramite-completado-active")),
    passive: lazy(() => import("./paso-4-evidencia/tarea-19-tramite-completado-passive")),
  },
};

/**
 * Resuelve el componente de vista correcto para una tarea según su ID y modo.
 *
 * @param tareaId - ID del estado_paso_flujo (1-19)
 * @param isActive - true si el usuario actual es responsable de esta tarea
 * @returns Componente React que implementa TaskViewProps
 */
export function getTaskView(
  tareaId: string,
  isActive: boolean
): ComponentType<TaskViewProps> {
  const entry = registry[tareaId];
  if (!entry) return GenericFallbackView;
  return isActive ? entry.active : entry.passive;
}
