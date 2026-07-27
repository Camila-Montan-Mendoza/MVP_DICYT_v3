import { createClient } from "@/lib/supabase/client";

export interface TramiteDBItem {
  id: number;
  codigoSeguimiento: string;
  nro: string;
  proyecto: string;
  tipoTramite: string;
  categoria: "ACTIVO_FIJO" | "MATERIAL" | "SERVICIO" | "OTROS";
  fecha: string;
  fechaISO: string;
  creador: string;
  justificacion: string;
  custodioNombre?: string;
  custodioUbicacion?: string;
  /** ID directo de estado_paso_flujo en la BD */
  idEstadoTramite: number;
  estadoNombre: string;
  estado: string;
  requiereAccion?: boolean;
  /** Orden del paso macro (1-4) leído de paso_flujo.orden */
  pasoNumero: number;
  pasoNombre: string;
  selloPreventivo?: {
    correlativo: string;
    fechaEmision: string;
    usuarioAprobador: string;
    estado: "APROBADO" | "OBSERVADO";
    observaciones?: string;
  };
  items: Array<{
    id: string;
    nombre: string;
    categoria: string;
    cantidad: number;
    precioReferencial: number;
    especificacionesTecnicasTexto?: string;
    partidaPresupuestaria?: string;
    partidaNombre?: string;
  }>;
}

export class TramiteDBRepository {
  private supabase = createClient();

  /**
   * Fetch all trámites from real Supabase DB.
   * Los datos del nodo actual (nombre, paso, orden) vienen del JOIN con estado_paso_flujo → paso_flujo.
   */
  public async getTramites(): Promise<TramiteDBItem[]> {
    try {
      const { data: tramites, error } = await this.supabase
        .from("tramite")
        .select(`
          id,
          id_proyecto,
          id_tipo_tramite,
          id_estado_tramite,
          justificacion,
          fecha_creacion,
          fecha_actualizacion,
          rechazado,
          proyecto:proyecto!tramite_id_proyecto_fkey ( nombre, codigo ),
          tipo_tramite ( nombre ),
          estado_paso_flujo ( id, nombre, es_inicial, es_final, id_paso_flujo, paso_flujo ( id, orden, nombre ) )
        `)
        .order("id", { ascending: false });

      if (error) {
        console.error("[Supabase Tramites Query Error]:", error.message, error.details, error.hint);
        return this.getFallbackTramites();
      }

      if (!tramites || tramites.length === 0) {
        console.warn("[Supabase Tramites Warning]: No trámites rows found in database table 'tramite'. Returning fallback item.");
        return this.getFallbackTramites();
      }

      return tramites.map((t: any, idx: number) => {
        const estadoObj = t.estado_paso_flujo || {};
        const pasoObj = estadoObj.paso_flujo || {};
        const dbIdEstado = t.id_estado_tramite || 1;
        const esFinal = estadoObj.es_final || false;

        return {
          id: t.id,
          nro: `${tramites.length - idx}`.padStart(2, "0"),
          codigoSeguimiento: `TR-2026-${String(t.id).padStart(3, "0")}`,
          proyecto: t.proyecto?.nombre || "Proyecto DICYT",
          tipoTramite: t.tipo_tramite?.nombre || "Compra Menor de 1.001 Bs. a 20.000 Bs. de Material",
          categoria: "MATERIAL",
          fecha: new Date(t.fecha_creacion || Date.now()).toLocaleDateString("es-BO", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          fechaISO: t.fecha_creacion || new Date().toISOString(),
          creador: "Dr. Daniel Pérez",
          justificacion: t.justificacion || "Adquisición de insumos y reactivos para investigación.",
          idEstadoTramite: dbIdEstado,
          estadoNombre: estadoObj.nombre || "Estado desconocido",
          estado: esFinal && !t.rechazado
            ? "Aprobado"
            : t.rechazado
            ? "Rechazado"
            : "En proceso",
          requiereAccion: !esFinal && !t.rechazado,
          pasoNumero: pasoObj.orden || 1,
          pasoNombre: pasoObj.nombre || "Solicitud",
          items: [],
        };
      });
    } catch {
      return this.getFallbackTramites();
    }
  }

  /**
   * Fetch single trámite by string ID or numeric ID
   */
  public async getTramiteById(idOrCode: string): Promise<TramiteDBItem | undefined> {
    const list = await this.getTramites();
    return list.find(
      (t) =>
        String(t.id) === idOrCode ||
        t.codigoSeguimiento.toLowerCase() === idOrCode.toLowerCase()
    );
  }

  /**
   * Create new trámite in real database.
   * El estado inicial es estado_paso_flujo.id=1 (es_inicial=true del primer paso).
   */
  public async createTramite(data: {
    proyectoId?: number;
    tipoTramiteId?: number;
    justificacion?: string;
    items?: any[];
  }): Promise<TramiteDBItem> {
    try {
      // Buscar el estado inicial del flujo del tipo de trámite
      const { data: estadoInicial } = await this.supabase
        .from("estado_paso_flujo")
        .select("id, nombre, paso_flujo ( orden, nombre )")
        .eq("es_inicial", true)
        .limit(1)
        .single();

      const estadoInicialId = (estadoInicial as any)?.id || 1;
      const estadoInicialNombre = (estadoInicial as any)?.nombre || "Estado inicial";
      const pasoInicial = (estadoInicial as any)?.paso_flujo;

      const { data: newRow, error } = await this.supabase
        .from("tramite")
        .insert({
          id_proyecto: data.proyectoId || 1,
          id_tipo_tramite: data.tipoTramiteId || 1,
          id_estado_tramite: estadoInicialId,
          id_usuario: 1,
          justificacion: data.justificacion || "Solicitud de compra menor",
          fecha_creacion: new Date().toISOString(),
          fecha_actualizacion: new Date().toISOString(),
          rechazado: false,
        })
        .select()
        .single();

      if (error || !newRow) {
        const fallback = this.getFallbackTramites()[0];
        return fallback;
      }

      return {
        id: newRow.id,
        nro: `${newRow.id}`.padStart(2, "0"),
        codigoSeguimiento: `TR-2026-${String(newRow.id).padStart(3, "0")}`,
        proyecto: "Proyecto DICYT",
        tipoTramite: "Compra Menor de 1.001 Bs. a 20.000 Bs. de Material",
        categoria: "MATERIAL",
        fecha: new Date().toLocaleDateString("es-BO", { day: "2-digit", month: "short", year: "numeric" }),
        fechaISO: newRow.fecha_creacion,
        creador: "Dr. Daniel Pérez",
        justificacion: data.justificacion || "Solicitud de compra menor",
        idEstadoTramite: estadoInicialId,
        estadoNombre: estadoInicialNombre,
        estado: "En proceso",
        pasoNumero: pasoInicial?.orden || 1,
        pasoNombre: pasoInicial?.nombre || "Solicitud",
        items: data.items || [],
      };
    } catch {
      return this.getFallbackTramites()[0];
    }
  }

  private getFallbackTramites(): TramiteDBItem[] {
    return [
      {
        id: 0,
        nro: "00",
        codigoSeguimiento: "TR-FALLBACK-000",
        proyecto: "Sin conexión a BD",
        tipoTramite: "Compra Menor",
        categoria: "MATERIAL",
        fecha: new Date().toLocaleDateString("es-BO", { day: "2-digit", month: "short", year: "numeric" }),
        fechaISO: new Date().toISOString(),
        creador: "Sistema",
        justificacion: "Error de conexión a la base de datos.",
        idEstadoTramite: 1,
        estadoNombre: "Sin conexión",
        estado: "Error",
        pasoNumero: 1,
        pasoNombre: "Solicitud",
        items: [],
      },
    ];
  }
}

export const tramiteDBRepository = new TramiteDBRepository();
