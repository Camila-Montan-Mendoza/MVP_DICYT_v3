import { createClient } from "@/lib/supabase/client";
import { NODOS_COMPRA_MENOR, NodoWorkflow } from "@/lib/workflow/compra-menor-strategy";

export interface TramiteDBRow {
  id: number;
  id_proyecto: number;
  id_tipo_tramite: number;
  id_estado_tramite: number;
  fecha_creacion: string;
  fecha_actualizacion: string;
  rechazado: boolean;
}

export interface HistorialEstadoDBRow {
  id: number;
  id_tramite: number;
  id_estado_anterior: number;
  id_estado_nuevo: number;
  fecha_cambio: string;
  id_usuario_responsable: number | null;
  observaciones: string | null;
}

// Mapping Node IDs to Schema DB `estado_paso_flujo.id` (1 to 19)
export const NODE_ID_TO_DB_ID: Record<string, number> = {
  node_1_1: 1,
  node_1_2: 2,
  node_1_3: 3,
  node_1_4: 4,
  node_1_5: 5,
  node_1_6: 6,
  node_1_7: 7,
  node_1_8: 8,
  node_2_1: 9,
  node_2_2: 10,
  node_2_3: 11,
  node_2_4: 12,
  node_3_1: 13,
  node_3_2: 14,
  node_3_3: 15,
  node_3_4: 16,
  node_3_5: 17,
  node_4_1: 18,
  node_4_2: 19,
};

export const DB_ID_TO_NODE_ID: Record<number, string> = Object.entries(NODE_ID_TO_DB_ID).reduce(
  (acc, [nodeId, dbId]) => {
    acc[dbId] = nodeId;
    return acc;
  },
  {} as Record<number, string>
);

export class WorkflowRepository {
  private supabase = createClient();

  /**
   * Get active node for a trámite by ID
   */
  public async getEstadoActualTramite(tramiteIdNum: number): Promise<{
    dbIdEstado: number;
    nodoId: string;
    nodo: NodoWorkflow;
  }> {
    try {
      const { data, error } = await this.supabase
        .from("tramite")
        .select("id_estado_tramite")
        .eq("id", tramiteIdNum)
        .single();

      if (error || !data) {
        return {
          dbIdEstado: 1,
          nodoId: "node_1_1",
          nodo: NODOS_COMPRA_MENOR["node_1_1"],
        };
      }

      const dbId = data.id_estado_tramite || 1;
      const nodeId = DB_ID_TO_NODE_ID[dbId] || "node_1_1";
      return {
        dbIdEstado: dbId,
        nodoId: nodeId,
        nodo: NODOS_COMPRA_MENOR[nodeId] || NODOS_COMPRA_MENOR["node_1_1"],
      };
    } catch {
      return {
        dbIdEstado: 1,
        nodoId: "node_1_1",
        nodo: NODOS_COMPRA_MENOR["node_1_1"],
      };
    }
  }

  /**
   * Execute node transition in DB (inserts into `historial_estado_tramite` and updates `tramite.id_estado_tramite`)
   */
  public async transicionarEstadoTramite(
    tramiteIdNum: number,
    estadoOrigenDbId: number,
    estadoDestinoDbId: number,
    idUsuarioResponsable: number = 1,
    observacion?: string
  ): Promise<boolean> {
    try {
      // 1. Insert row into `historial_estado_tramite`
      await this.supabase.from("historial_estado_tramite").insert({
        id_tramite: tramiteIdNum,
        id_estado_anterior: estadoOrigenDbId,
        id_estado_nuevo: estadoDestinoDbId,
        fecha_cambio: new Date().toISOString(),
        id_usuario_responsable: idUsuarioResponsable,
        observaciones: observacion || "Transición de estado realizada en SIGEFI",
      });

      // 2. Update `tramite` record with new state
      const { error: updateErr } = await this.supabase
        .from("tramite")
        .update({
          id_estado_tramite: estadoDestinoDbId,
          fecha_actualizacion: new Date().toISOString(),
          rechazado: estadoDestinoDbId === 4,
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
