import { createClient } from "@/lib/supabase/client";
import type { NodoWorkflow } from "@/lib/workflow/compra-menor-strategy";
import { obtenerNodoPorId } from "@/lib/workflow/workflow-db-service";

export interface TramiteDBRow {
  id: number;
  id_proyecto: number;
  id_tipo_tramite: number;
  id_tarea_tramite: number;
  fecha_creacion: string;
  fecha_actualizacion: string;
  rechazado: boolean;
}

export interface HistorialEstadoDBRow {
  id: number;
  id_tramite: number;
  id_tarea_anterior: number;
  id_tarea_nuevo: number;
  fecha_cambio: string;
  id_usuario_responsable: number | null;
  observaciones: string | null;
}

export class WorkflowRepository {
  private supabase = createClient();

  /**
   * Get active node for a trámite by ID — consultando la BD real
   */
  public async getEstadoActualTramite(tramiteIdNum: number): Promise<{
    dbIdEstado: number;
    nodo: NodoWorkflow | null;
  }> {
    try {
      const { data, error } = await this.supabase
        .from("tramite")
        .select("id_tarea_tramite")
        .eq("id", tramiteIdNum)
        .single();

      if (error || !data) {
        const nodoFallback = await obtenerNodoPorId(1);
        return { dbIdEstado: 1, nodo: nodoFallback };
      }

      const dbId = data.id_tarea_tramite || 1;
      const nodo = await obtenerNodoPorId(dbId);
      return { dbIdEstado: dbId, nodo };
    } catch {
      const nodoFallback = await obtenerNodoPorId(1);
      return { dbIdEstado: 1, nodo: nodoFallback };
    }
  }

  /**
   * Execute node transition in DB (inserts into `historial_tarea_tramite` and updates `tramite.id_tarea_tramite`)
   * Trabaja directamente con IDs de la BD — sin mapeos intermedios.
   */
  public async transicionarEstadoTramite(
    tramiteIdNum: number,
    estadoOrigenDbId: number,
    estadoDestinoDbId: number,
    idUsuarioResponsable: number = 1,
    observacion?: string
  ): Promise<boolean> {
    try {
      // 1. Insert row into `historial_tarea_tramite`
      await this.supabase.from("historial_tarea_tramite").insert({
        id_tramite: tramiteIdNum,
        id_tarea_anterior: estadoOrigenDbId,
        id_tarea_nuevo: estadoDestinoDbId,
        fecha_cambio: new Date().toISOString(),
        id_usuario_responsable: idUsuarioResponsable,
        observaciones: observacion || "Transición de estado realizada en SIGEFI",
      });

      // 2. Update `tramite` record with new state
      const { error: updateErr } = await this.supabase
        .from("tramite")
        .update({
          id_tarea_tramite: estadoDestinoDbId,
          fecha_actualizacion: new Date().toISOString(),
          rechazado: estadoDestinoDbId === 4, // tarea_paso_flujo.id=4 es "Rechazo definitivo"
        })
        .eq("id", tramiteIdNum);

      return !updateErr;
    } catch (e) {
      console.error("Error executing DB transition", e);
      return false;
    }
  }
}

export const workflowRepository = new WorkflowRepository();
