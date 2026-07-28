import { TaskTransitionHandler } from "../../transition-types";

/**
 * Handler específico para Tarea 1:
 * "Revisión de disponibilidad presupuestaria y certificación de fondos"
 */
export const tarea1PresupuestoHandler: TaskTransitionHandler = async (ctx) => {
  // Ejemplo de validación o lógica extra:
  // Si la acción es "Observar y Solicitar Corrección", se requiere observaciones
  const esObservacion = ctx.nombreAccion.toLowerCase().includes("observ");

  if (esObservacion && !ctx.datosExtra?.observacionesDetalle && !ctx.datosExtra?.observaciones) {
    return {
      success: false,
      message: "Se requiere detallar la observación antes de devolver la solicitud.",
    };
  }

  return {
    success: true,
    message: `Revisión presupuestaria '${ctx.nombreAccion}' procesada exitosamente.`,
  };
};
