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
        .select(
          `
          id,
          id_proyecto,
          id_tipo_tramite,
          id_estado_tramite,
          justificacion,
          fecha_creacion,
          fecha_actualizacion,
          rechazado,
          proyecto:proyecto!tramite_id_proyecto_fkey ( nombre, codigo ),
          tipo_tramite:tipo_tramite!tramite_id_tipo_tramite_fkey ( nombre ),
          estado_paso_flujo:estado_paso_flujo!tramite_id_estado_tramite_fkey ( id, nombre, es_inicial, es_final, id_paso_flujo, paso_flujo:paso_flujo!estado_paso_flujo_id_paso_flujo_fkey ( id, orden, nombre ) )
        `,
        )
        .order("id", { ascending: false });

      if (error) {
        console.error(
          "[Supabase Tramites Query Error]:",
          error.message,
          error.details,
          error.hint,
        );
        return [];
      }

      if (!tramites || tramites.length === 0) {
        return [];
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
          tipoTramite:
            t.tipo_tramite?.nombre ||
            "Compra Menor de 1.001 Bs. a 20.000 Bs. de Material",
          categoria: "MATERIAL",
          fecha: new Date(t.fecha_creacion || Date.now()).toLocaleDateString(
            "es-BO",
            {
              day: "2-digit",
              month: "short",
              year: "numeric",
            },
          ),
          fechaISO: t.fecha_creacion || new Date().toISOString(),
          creador: "Dr. Daniel Pérez",
          justificacion:
            t.justificacion ||
            "Adquisición de insumos y reactivos para investigación.",
          idEstadoTramite: dbIdEstado,
          estadoNombre: estadoObj.nombre || "Estado desconocido",
          estado:
            esFinal && !t.rechazado
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
   * Obtener los Pasos Macro de un Trámite según su tipo desde la BD
   * (Opción 1: Consulta directa con Supabase JS Client sin funciones almacenadas)
   */
  public async getPasosTramite(tramiteIdNum: number): Promise<
    Array<{
      id: string;
      numero: number;
      nombre: string;
      estado: "COMPLETADO" | "EN_CURSO" | "PENDIENTE";
    }>
  > {
    try {
      // 1. Consulta la información del trámite actual y su paso activo
      const { data: tramiteData, error: tramiteErr } = await this.supabase
        .from("tramite")
        .select(
          `
          id,
          id_tipo_tramite,
          rechazado,
          estado_paso_flujo:estado_paso_flujo!tramite_id_estado_tramite_fkey (
            id,
            id_paso_flujo,
            paso_flujo:paso_flujo!estado_paso_flujo_id_paso_flujo_fkey ( id, orden, nombre )
          )
        `,
        )
        .eq("id", tramiteIdNum)
        .maybeSingle();

      if (tramiteErr || !tramiteData) {
        return this.getFallbackPasos();
      }

      const idTipoTramite = tramiteData.id_tipo_tramite || 1;
      const estadoObj = (tramiteData as any).estado_paso_flujo || {};
      const pasoObj = estadoObj.paso_flujo || {};
      const ordenActual = pasoObj.orden || 1;

      // 2. Consulta todos los pasos del tipo de trámite ordenados por su campo 'orden'
      const { data: pasosDB, error: pasosErr } = await this.supabase
        .from("paso_flujo")
        .select("id, orden, nombre")
        .eq("id_tipo_tramite", idTipoTramite)
        .order("orden", { ascending: true });

      if (pasosErr || !pasosDB || pasosDB.length === 0) {
        return this.getFallbackPasos();
      }

      // 3. Mapea el estado dinámicamente para cada paso macro
      return pasosDB.map((pf: any) => {
        const estado: "COMPLETADO" | "EN_CURSO" | "PENDIENTE" =
          pf.orden < ordenActual
            ? "COMPLETADO"
            : pf.orden === ordenActual
              ? "EN_CURSO"
              : "PENDIENTE";

        return {
          id: `p${pf.id}`,
          numero: pf.orden,
          nombre: pf.nombre,
          estado,
        };
      });
    } catch {
      return this.getFallbackPasos();
    }
  }

  private getFallbackPasos(): Array<{
    id: string;
    numero: number;
    nombre: string;
    estado: "COMPLETADO" | "EN_CURSO" | "PENDIENTE";
  }> {
    return [
      { id: "p1", numero: 1, nombre: "Solicitud", estado: "EN_CURSO" },
      { id: "p2", numero: 2, nombre: "Recepción", estado: "PENDIENTE" },
      { id: "p3", numero: 3, nombre: "Pago", estado: "PENDIENTE" },
      { id: "p4", numero: 4, nombre: "Evidencia", estado: "PENDIENTE" },
    ];
  }

  /**
   * Obtener las Tareas del Paso en el que se encuentra el Trámite
   * (Pasado de Bitácora + Presente En Curso + Ruta Optimista Futura hacia la meta)
   * Enriquecido con: rol esperado, usuario responsable real, rol real y fecha completado.
   * Consulta directa desde Supabase Client sin funciones almacenadas ni RPCs.
   */
  public async getTareasDelPaso(tramiteIdNum: number): Promise<
    Array<{
      id: string;
      pasoId: string;
      nombre: string;
      rolEsperado: string;
      usuarioAsignado: string;
      rolResponsable: string;
      estado: "COMPLETADO" | "EN_CURSO" | "PENDIENTE";
      fechaCompletado?: string;
    }>
  > {
    try {
      // 1. Contexto del Trámite y su paso activo
      const { data: tramiteData, error: tramiteErr } = await this.supabase
        .from("tramite")
        .select(
          `
          id,
          id_tipo_tramite,
          id_estado_tramite,
          rechazado,
          estado_paso_flujo:estado_paso_flujo!tramite_id_estado_tramite_fkey (
            id,
            id_paso_flujo,
            nombre,
            paso_flujo:paso_flujo!estado_paso_flujo_id_paso_flujo_fkey ( id, orden, nombre )
          )
        `
        )
        .eq("id", tramiteIdNum)
        .maybeSingle();

      if (tramiteErr || !tramiteData) return [];

      const estadoActualId = tramiteData.id_estado_tramite;
      const estadoObj = (tramiteData as any).estado_paso_flujo || {};
      const pasoObj = estadoObj.paso_flujo || {};
      const pasoActualId = estadoObj.id_paso_flujo;
      const pasoActualOrden = pasoObj.orden;
      const idTipoTramite = tramiteData.id_tipo_tramite;
      const rechazado = Boolean(tramiteData.rechazado);

      // 2. HISTORIAL: Quién completó cada estado + fecha (se sabe al SALIR del estado)
      //    id_estado_anterior = el estado que se completó (salida)
      const { data: historial } = await this.supabase
        .from("historial_estado_tramite")
        .select(
          `
          id_estado_anterior,
          id_estado_nuevo,
          fecha_cambio,
          usuario:usuario!historial_estado_tramite_id_usuario_responsable_fkey (
            id,
            username,
            rol_usuario:rol_usuario!rol_usuario_id_usuario_fkey (
              rol:rol ( nombre )
            )
          )
        `
        )
        .eq("id_tramite", tramiteIdNum)
        .order("fecha_cambio", { ascending: true });

      // Mapa: id del estado completado → { username, rolReal, fechaCompletado }
      const usuarioPorEstadoAnterior = new Map<
        number,
        { username: string; rolReal: string; fechaCompletado: string }
      >();
      // Mapa: id del estado nuevo → presente en historial (para marcar como completado)
      const estadosEnHistorial = new Set<number>();

      if (historial) {
        for (const h of historial as any[]) {
          const u = h.usuario;
          const username = u?.username || "Sistema";
          const rolReal =
            u?.rol_usuario?.[0]?.rol?.nombre || "Sin rol asignado";
          const fecha = h.fecha_cambio;

          if (h.id_estado_anterior && !usuarioPorEstadoAnterior.has(h.id_estado_anterior)) {
            usuarioPorEstadoAnterior.set(h.id_estado_anterior, {
              username,
              rolReal,
              fechaCompletado: fecha,
            });
          }
          if (h.id_estado_nuevo) {
            estadosEnHistorial.add(h.id_estado_nuevo);
          }
        }
      }

      // 3. ROL ESPERADO por estado (de rol_estado_paso_flujo → rol)
      const { data: rolesEstado } = await this.supabase
        .from("rol_estado_paso_flujo")
        .select("id_estado_paso_flujo, rol:rol!rol_estado_paso_flujo_id_rol_fkey ( nombre )");

      const rolEsperadoPorEstado = new Map<number, string>();
      (rolesEstado || []).forEach((re: any) => {
        rolEsperadoPorEstado.set(re.id_estado_paso_flujo, re.rol?.nombre || "Sin rol asignado");
      });

      // 4. BFS: Ruta más corta hacia siguiente paso o nodo final
      const { data: todosEstados } = await this.supabase
        .from("estado_paso_flujo")
        .select(
          `
          id, id_paso_flujo, nombre, es_final,
          paso_flujo:paso_flujo!estado_paso_flujo_id_paso_flujo_fkey ( id, orden, id_tipo_tramite )
        `
        )
        .eq("paso_flujo.id_tipo_tramite", idTipoTramite || 1);

      const estadosMap = new Map<number, any>();
      (todosEstados || []).forEach((e: any) => estadosMap.set(e.id, e));

      const { data: transiciones } = await this.supabase
        .from("transicion_flujo")
        .select("id_estado_origen, id_estado_destino, nombre_accion");

      const adjList = new Map<number, number[]>();
      (transiciones || []).forEach((t: any) => {
        const accion = (t.nombre_accion || "").toLowerCase();
        if (
          !accion.includes("rechaz") &&
          !accion.includes("observ") &&
          !accion.includes("subsan")
        ) {
          if (!adjList.has(t.id_estado_origen)) {
            adjList.set(t.id_estado_origen, []);
          }
          adjList.get(t.id_estado_origen)!.push(t.id_estado_destino);
        }
      });

      const queue: Array<{ node: number; path: number[] }> = [];
      const visited = new Set<number>([estadoActualId]);
      for (const nxt of adjList.get(estadoActualId) || []) {
        visited.add(nxt);
        queue.push({ node: nxt, path: [nxt] });
      }

      let rutaGanadora: number[] = [];
      while (queue.length > 0) {
        const current = queue.shift()!;
        const nodeInfo = estadosMap.get(current.node);
        const nodePasoOrden = nodeInfo?.paso_flujo?.orden || pasoActualOrden;
        const esFinal = Boolean(nodeInfo?.es_final);
        if (nodePasoOrden > pasoActualOrden || esFinal) {
          rutaGanadora = current.path;
          break;
        }
        for (const nxt of adjList.get(current.node) || []) {
          if (!visited.has(nxt)) {
            visited.add(nxt);
            queue.push({ node: nxt, path: [...current.path, nxt] });
          }
        }
      }

      // 5. CONSOLIDAR: Pasadas + Actual + Futuras con datos enriquecidos

      // Tareas pasadas: estados del paso actual que aparecen en historial (menos el actual)
      const pasadasList: ReturnType<typeof this.makeTarea>[] = [];
      for (const [estadoId, estadoInfo] of Array.from(estadosEnHistorial)
        .filter((id) => id !== estadoActualId)
        .map((id) => [id, estadosMap.get(id)])
        .filter(([_, info]) => (info as any)?.id_paso_flujo === pasoActualId)) {
        const info = estadoInfo as any;
        const userInfo = usuarioPorEstadoAnterior.get(info?.id || 0);
        pasadasList.push({
          id: String(info.id),
          pasoId: `p${pasoActualId}`,
          nombre: info.nombre,
          rolEsperado: rolEsperadoPorEstado.get(info.id) || "Sin rol asignado",
          usuarioAsignado: userInfo?.username || "Sistema",
          rolResponsable: userInfo?.rolReal || rolEsperadoPorEstado.get(info.id) || "Sin rol asignado",
          estado: "COMPLETADO" as const,
          fechaCompletado: userInfo?.fechaCompletado,
        });
      }

      // Tarea actual
      const actualUserInfo = usuarioPorEstadoAnterior.get(estadoActualId);
      const tareaActualItem = {
        id: String(estadoActualId),
        pasoId: `p${pasoActualId}`,
        nombre: estadoObj.nombre || "Tarea Actual",
        rolEsperado: rolEsperadoPorEstado.get(estadoActualId) || "Sin rol asignado",
        usuarioAsignado: actualUserInfo?.username || "—",
        rolResponsable: actualUserInfo?.rolReal || rolEsperadoPorEstado.get(estadoActualId) || "Sin rol asignado",
        estado: (rechazado ? "EN_CURSO" : "EN_CURSO") as "EN_CURSO",
        fechaCompletado: undefined as string | undefined,
      };

      // Tareas futuras
      const tareasFuturas = rutaGanadora
        .map((nodeNum) => estadosMap.get(nodeNum))
        .filter((n) => n && n.id_paso_flujo === pasoActualId)
        .map((n) => ({
          id: String(n.id),
          pasoId: `p${pasoActualId}`,
          nombre: n.nombre,
          rolEsperado: rolEsperadoPorEstado.get(n.id) || "Sin rol asignado",
          usuarioAsignado: "—",
          rolResponsable: rolEsperadoPorEstado.get(n.id) || "Sin rol asignado",
          estado: "PENDIENTE" as const,
          fechaCompletado: undefined as string | undefined,
        }));

      return [...pasadasList, tareaActualItem, ...tareasFuturas];
    } catch {
      return [];
    }
  }

  // Helper para inferencia de tipos
  private makeTarea(_: {
    id: string;
    pasoId: string;
    nombre: string;
    rolEsperado: string;
    usuarioAsignado: string;
    rolResponsable: string;
    estado: "COMPLETADO" | "EN_CURSO" | "PENDIENTE";
    fechaCompletado?: string;
  }) {
    return _;
  }

  /**
   * Fetch single trámite by string ID or numeric ID
   */
  public async getTramiteById(
    idOrCode: string,
  ): Promise<TramiteDBItem | undefined> {
    const list = await this.getTramites();
    return list.find(
      (t) =>
        String(t.id) === idOrCode ||
        t.codigoSeguimiento.toLowerCase() === idOrCode.toLowerCase(),
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
      const estadoInicialNombre =
        (estadoInicial as any)?.nombre || "Estado inicial";
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
        fecha: new Date().toLocaleDateString("es-BO", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
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
        fecha: new Date().toLocaleDateString("es-BO", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
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
