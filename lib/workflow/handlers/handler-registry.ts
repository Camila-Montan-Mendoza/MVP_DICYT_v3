import { TaskTransitionHandler } from "../transition-types";
import { defaultTaskHandler } from "./default-task-handler";
import { tarea1PresupuestoHandler } from "./paso-1-solicitud/tarea-1-presupuesto-handler";
import { tarea7CotizacionesHandler } from "./paso-1-solicitud/tarea-7-cotizaciones-handler";

/**
 * Registro de Handlers por ID de estado_paso_flujo (1-19).
 * Si un estado no tiene un handler registrado, se utiliza `defaultTaskHandler`.
 */
const registry: Record<string, TaskTransitionHandler> = {
  "1": tarea1PresupuestoHandler,
  "7": tarea7CotizacionesHandler,
};

/**
 * Obtiene el handler de transición correspondiente a un ID de tarea/estado.
 */
export function getTaskTransitionHandler(tareaId: number | string): TaskTransitionHandler {
  const key = String(tareaId);
  return registry[key] || defaultTaskHandler;
}
