import { TaskTransitionHandler } from "../../transition-types";

/**
 * Handler específico para Tarea 7:
 * "Carga de 3 cotizaciones de proveedores"
 */
export const tarea7CotizacionesHandler: TaskTransitionHandler = async (ctx) => {
  const cotizaciones = ctx.datosExtra?.cotizaciones;

  if (Array.isArray(cotizaciones) && cotizaciones.length < 3) {
    return {
      success: false,
      message: "Debe cargar al menos 3 cotizaciones de proveedores para adjudicar.",
    };
  }

  return {
    success: true,
    message: "Cotizaciones validadas y registradas correctamente.",
  };
};
