import { TaskTransitionHandler } from "../transition-types";

/**
 * Handler genérico/default para tareas que no requieren lógica extra
 * más allá de la validación básica y el cambio de estado.
 */
export const defaultTaskHandler: TaskTransitionHandler = async (ctx) => {
  return {
    success: true,
    message: `Transición '${ctx.nombreAccion}' procesada correctamente.`,
  };
};
