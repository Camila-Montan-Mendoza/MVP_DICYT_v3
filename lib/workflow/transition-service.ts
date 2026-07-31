import { createClient } from "@/utils/supabase/server";
import { TransitionRequestPayload, TransitionHandlerResult } from "./transition-types";
import { getTaskTransitionHandler } from "./handlers/handler-registry";

export class WorkflowTransitionService {
  /**
   * Ejecuta una transición de workflow garantizando la ejecución de validaciones y side-effects
   * del handler específico de la tarea antes de actualizar el estado en la base de datos.
   */
  public static async ejecutarTransicion(
    payload: TransitionRequestPayload
  ): Promise<TransitionHandlerResult> {
    const supabase = await createClient();

    const { idTramite, idTransicion, observaciones, datosExtra, usuarioId } = payload;

    // 1. Obtener estado actual del trámite
    const { data: tramite, error: tramiteErr } = await supabase
      .from("tramite")
      .select("id, id_tarea_tramite, rechazado")
      .eq("id", idTramite)
      .single();

    if (tramiteErr || !tramite) {
      return {
        success: false,
        message: "No se encontró el trámite especificado.",
      };
    }

    const estadoOrigenId = tramite.id_tarea_tramite;

    // 2. Validar que la transición existe y corresponde al estado origen actual
    const { data: transicion, error: transErr } = await supabase
      .from("transicion_flujo")
      .select("id, id_tarea_origen, id_tarea_destino, nombre_accion")
      .eq("id", idTransicion)
      .single();

    if (transErr || !transicion) {
      return {
        success: false,
        message: "La transición seleccionada no existe.",
      };
    }

    if (transicion.id_tarea_origen !== estadoOrigenId) {
      return {
        success: false,
        message: "La transición enviada no corresponde al estado actual del trámite.",
      };
    }

    const idEstadoDestino = transicion.id_tarea_destino;
    const nombreAccion = transicion.nombre_accion;

    // 3. Obtener e invocar el handler de la tarea (Handler-First Execution)
    const handler = getTaskTransitionHandler(estadoOrigenId);
    const handlerResult = await handler({
      tramiteId: idTramite,
      idEstadoOrigen: estadoOrigenId,
      idEstadoDestino,
      nombreAccion,
      usuarioId,
      datosExtra,
    });

    if (!handlerResult.success) {
      return handlerResult; // Abortar si el handler rechazó la operación
    }

    // 4. Determinar si la acción implica rechazo definitivo
    const esRechazo = nombreAccion.toLowerCase().includes("rechaz");

    // 5. Actualizar el trámite
    const { error: updateErr } = await supabase
      .from("tramite")
      .update({
        id_tarea_tramite: idEstadoDestino,
        ...(esRechazo ? { rechazado: true } : {}),
      })
      .eq("id", idTramite);

    if (updateErr) {
      return {
        success: false,
        message: `Error al actualizar el estado del trámite: ${updateErr.message}`,
      };
    }

    // 6. Insertar registro en historial_tarea_tramite
    const { error: histErr } = await supabase.from("historial_tarea_tramite").insert({
      id_tramite: idTramite,
      id_tarea_anterior: estadoOrigenId,
      id_tarea_nuevo: idEstadoDestino,
      id_usuario_responsable: usuarioId || null,
      observaciones: observaciones || handlerResult.message || `Acción '${nombreAccion}' ejecutada`,
    });

    if (histErr) {
      console.error("Error al registrar historial de transición:", histErr);
    }

    return {
      success: true,
      message: handlerResult.message || `Transición '${nombreAccion}' completada exitosamente.`,
      data: {
        tramiteId: idTramite,
        nuevoEstadoId: idEstadoDestino,
        nombreAccion,
      },
    };
  }
}
