import { createClient } from "@/lib/supabase/client";
import { AccionTransicion } from "../workflow/stepper-service";
import { LOGIN_OPTIONS } from "../auth/auth-service";

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
    descripcion?: string;
    categoria: string;
    cantidad: number;
    precioReferencial: number;
    precioUnitario?: number;
    especificacionesTecnicasTexto?: string;
    especificacion?: string;
    total?: number;
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
      // 1. Query principal de trámites con relaciones explícitas por columna id_tarea_tramite
      const { data: mainTramites, error: queryError } = await this.supabase
        .from("tramite")
        .select(
          `
          id,
          id_proyecto,
          id_tipo_tramite,
          id_tarea_tramite,
          justificacion,
          fecha_creacion,
          fecha_actualizacion,
          rechazado,
          proyecto:proyecto!id_proyecto ( nombre, codigo ),
          tipo_tramite:tipo_tramite!id_tipo_tramite ( nombre ),
          usuario:usuario!id_usuario ( username ),
          tarea_paso_flujo:tarea_paso_flujo!id_tarea_tramite ( id, nombre, es_inicial, es_final, id_paso_flujo, paso_flujo:paso_flujo!id_paso_flujo ( id, orden, nombre ) ),
          item_tramite:item_tramite!id_tramite (
            id,
            cantidad_solicitada,
            precio_unitario,
            especificacion,
            item:item!id_item ( id, nombre )
          )
        `
        )
        .order("id", { ascending: false });

      let tramites: any[] = mainTramites || [];

      // Fallback secundario si la relación con item_tramite no está expuesta en la caché PostgREST
      if (queryError) {
        console.warn(
          "[Supabase Tramites Query Warning]:",
          queryError.message,
          "- Intentando consulta base de trámites"
        );
        const { data: baseTramites, error: baseErr } = await this.supabase
          .from("tramite")
          .select(
            `
            id,
            id_proyecto,
            id_tipo_tramite,
            id_tarea_tramite,
            justificacion,
            fecha_creacion,
            fecha_actualizacion,
            rechazado,
            proyecto:proyecto!id_proyecto ( nombre, codigo ),
            tipo_tramite:tipo_tramite!id_tipo_tramite ( nombre ),
            usuario:usuario!id_usuario ( username ),
            tarea_paso_flujo:tarea_paso_flujo!id_tarea_tramite ( id, nombre, es_inicial, es_final, id_paso_flujo, paso_flujo:paso_flujo!id_paso_flujo ( id, orden, nombre ) )
          `
          )
          .order("id", { ascending: false });

        if (baseErr || !baseTramites) {
          console.error("[Supabase Base Tramites Query Error]:", baseErr?.message);
          return [];
        }

        tramites = baseTramites;
      }

      if (!tramites || tramites.length === 0) {
        return [];
      }

      return tramites.map((t: any, idx: number) => {
        const estadoObj = t.tarea_paso_flujo || {};
        const pasoObj = estadoObj.paso_flujo || {};
        const dbIdEstado = t.id_tarea_tramite || 1;
        const esFinal = estadoObj.es_final || false;

        const tipoNombre = (t.tipo_tramite?.nombre || "").toLowerCase();
        const categoria: "ACTIVO_FIJO" | "MATERIAL" | "SERVICIO" | "OTROS" = tipoNombre.includes(
          "activo"
        )
          ? "ACTIVO_FIJO"
          : tipoNombre.includes("servicio")
            ? "SERVICIO"
            : "MATERIAL";

        const rawItems = Array.isArray(t.item_tramite) ? t.item_tramite : [];
        const items = rawItems.map((it: any) => ({
          id: String(it.id),
          nombre: it.item?.nombre || "Ítem Solicitado",
          descripcion: it.item?.nombre || "Ítem Solicitado",
          categoria: categoria,
          cantidad: it.cantidad_solicitada || 1,
          precioReferencial: Number(it.precio_unitario || 0),
          precioUnitario: Number(it.precio_unitario || 0),
          especificacionesTecnicasTexto: it.especificacion || "",
          especificacion: it.especificacion || "",
          total: (it.cantidad_solicitada || 1) * Number(it.precio_unitario || 0),
        }));

        return {
          id: t.id,
          nro: `${tramites.length - idx}`.padStart(2, "0"),
          codigoSeguimiento: `TR-2026-${String(t.id).padStart(3, "0")}`,
          proyecto: t.proyecto?.nombre || "Proyecto DICYT",
          tipoTramite:
            t.tipo_tramite?.nombre || "Compra Menor de 1.001 Bs. a 20.000 Bs. de Material",
          categoria,
          fecha: new Date(t.fecha_creacion || Date.now()).toLocaleDateString("es-BO", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          fechaISO: t.fecha_creacion || new Date().toISOString(),
          creador:
            LOGIN_OPTIONS.find(
              (o) => o.username.toLowerCase() === (t.usuario?.username || "").toLowerCase()
            )?.nombreCompleto ||
            t.usuario?.username ||
            "Dr. Daniel Pérez",
          justificacion:
            t.justificacion || "Adquisición de insumos y reactivos para investigación.",
          idEstadoTramite: dbIdEstado,
          estadoNombre: estadoObj.nombre || "Estado desconocido",
          estado: esFinal && !t.rechazado ? "Aprobado" : t.rechazado ? "Rechazado" : "En proceso",
          requiereAccion: !esFinal && !t.rechazado,
          pasoNumero: pasoObj.orden || 1,
          pasoNombre: pasoObj.nombre || "Solicitud",
          items,
        };
      });
    } catch (err) {
      console.error("[getTramites Exception]:", err);
      return [];
    }
  }

  /**
   * Obtener los Pasos Macro de un Trámite según su tipo desde la BD
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
          tarea_paso_flujo:tarea_paso_flujo!id_tarea_tramite (
            id,
            id_paso_flujo,
            paso_flujo:paso_flujo!id_paso_flujo ( id, orden, nombre )
          )
        `
        )
        .eq("id", tramiteIdNum)
        .maybeSingle();

      if (tramiteErr || !tramiteData) {
        return this.getFallbackPasos();
      }

      const idTipoTramite = tramiteData.id_tipo_tramite || 1;
      const estadoObj = (tramiteData as any).tarea_paso_flujo || {};
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
      // 0. Intentar ejecución directa por RPC de Supabase (SQL Puro)
      const { data: rpcRows, error: rpcErr } = await this.supabase.rpc("obtener_timeline_tramite", {
        p_tramite_id: tramiteIdNum,
      });

      if (!rpcErr && rpcRows && Array.isArray(rpcRows) && rpcRows.length > 0) {
        const estadoActualRow = rpcRows.find(
          (r: any) => r.estado === "EN_CURSO" || r.estado === "RECHAZADO"
        );
        const estadoActualId = estadoActualRow?.tarea_id;

        let accionesDisponibles: AccionTransicion[] = [];
        if (estadoActualId) {
          const { data: transicionesActuales } = await this.supabase
            .from("transicion_flujo")
            .select("id, id_tarea_destino, nombre_accion")
            .eq("id_tarea_origen", estadoActualId);

          accionesDisponibles = (transicionesActuales || []).map((t: any) => ({
            idTransicion: t.id,
            nombreAccion: t.nombre_accion,
            idEstadoDestino: t.id_tarea_destino,
          }));
        }

        return rpcRows.map((r: any) => {
          const rawUser = r.usuario_responsable || "";
          const userOpt = LOGIN_OPTIONS.find(
            (o) => o.username.toLowerCase() === rawUser.toLowerCase()
          );
          const usuarioNom =
            userOpt?.nombreCompleto || (rawUser && rawUser !== "—" ? rawUser : "—");

          return {
            id: String(r.tarea_id),
            pasoId: `p1`,
            nombre: r.tarea_nombre,
            rolEsperado: r.rol_esperado || "Sin rol asignado",
            usuarioAsignado: usuarioNom,
            rolResponsable: r.rol_responsable_real || r.rol_esperado || "Sin rol asignado",
            estado: r.estado as "COMPLETADO" | "EN_CURSO" | "PENDIENTE",
            fechaCompletado: r.fecha_completado,
            accionesDisponibles:
              r.estado === "EN_CURSO" || r.estado === "RECHAZADO" ? accionesDisponibles : undefined,
          };
        });
      }

      // 1. Contexto del Trámite y su paso activo
      const { data: tramiteData, error: tramiteErr } = await this.supabase
        .from("tramite")
        .select(
          `
          id,
          id_tipo_tramite,
          id_tarea_tramite,
          rechazado,
          tarea_paso_flujo:tarea_paso_flujo!id_tarea_tramite (
            id,
            id_paso_flujo,
            nombre,
            paso_flujo:paso_flujo!id_paso_flujo ( id, orden, nombre )
          )
        `
        )
        .eq("id", tramiteIdNum)
        .maybeSingle();

      if (tramiteErr || !tramiteData) return [];

      const estadoActualId = tramiteData.id_tarea_tramite;
      const estadoObj = (tramiteData as any).tarea_paso_flujo || {};
      const pasoObj = estadoObj.paso_flujo || {};
      const pasoActualId = estadoObj.id_paso_flujo;
      const pasoActualOrden = pasoObj.orden;
      const idTipoTramite = tramiteData.id_tipo_tramite;
      const rechazado = Boolean(tramiteData.rechazado);

      // 2. HISTORIAL
      const { data: historial } = await this.supabase
        .from("historial_tarea_tramite")
        .select(
          `
          id_tarea_anterior,
          id_tarea_nuevo,
          fecha_cambio,
          usuario:usuario!id_usuario_responsable (
            id,
            username,
            rol_usuario:rol_usuario!id_usuario (
              rol:rol!id_rol ( nombre )
            )
          )
        `
        )
        .eq("id_tramite", tramiteIdNum)
        .order("fecha_cambio", { ascending: true });

      const usuarioPorEstadoAnterior = new Map<
        number,
        { username: string; rolReal: string; fechaCompletado: string }
      >();
      const estadosEnHistorial = new Set<number>();

      if (historial) {
        for (const h of historial as any[]) {
          if (h.id_tarea_anterior && h.id_tarea_anterior === h.id_tarea_nuevo) {
            continue;
          }

          const u = h.usuario;
          const rawUsername = u?.username || "";
          const userOpt = LOGIN_OPTIONS.find(
            (o) => o.username.toLowerCase() === rawUsername.toLowerCase()
          );
          const username =
            u?.nombre_completo || userOpt?.nombreCompleto || rawUsername || "Sistema";
          const rolReal =
            userOpt?.rolLabel || u?.rol_usuario?.[0]?.rol?.nombre || "Sin rol asignado";
          const fecha = h.fecha_cambio;

          if (h.id_tarea_anterior) {
            usuarioPorEstadoAnterior.set(h.id_tarea_anterior, {
              username,
              rolReal,
              fechaCompletado: fecha,
            });
          }
          if (h.id_tarea_nuevo) {
            estadosEnHistorial.add(h.id_tarea_nuevo);
          }
        }
      }

      // 3. ROL ESPERADO
      const { data: rolesEstado } = await this.supabase
        .from("rol_tarea_paso_flujo")
        .select("id_tarea_paso_flujo, rol:rol!id_rol ( nombre )");

      const rolEsperadoPorEstado = new Map<number, string>();
      (rolesEstado || []).forEach((re: any) => {
        rolEsperadoPorEstado.set(re.id_tarea_paso_flujo, re.rol?.nombre || "Sin rol asignado");
      });

      // 4. BFS
      const { data: todosEstados } = await this.supabase
        .from("tarea_paso_flujo")
        .select(
          `
          id, id_paso_flujo, nombre, es_final,
          paso_flujo:paso_flujo!id_paso_flujo ( id, orden, id_tipo_tramite )
        `
        )
        .eq("paso_flujo.id_tipo_tramite", idTipoTramite || 1);

      const estadosMap = new Map<number, any>();
      (todosEstados || []).forEach((e: any) => estadosMap.set(e.id, e));

      const { data: transiciones } = await this.supabase
        .from("transicion_flujo")
        .select("id_tarea_origen, id_tarea_destino, nombre_accion");

      const adjList = new Map<number, number[]>();
      (transiciones || []).forEach((t: any) => {
        const accion = (t.nombre_accion || "").toLowerCase();
        if (
          !accion.includes("rechaz") &&
          !accion.includes("observ") &&
          !accion.includes("subsan")
        ) {
          if (!adjList.has(t.id_tarea_origen)) {
            adjList.set(t.id_tarea_origen, []);
          }
          adjList.get(t.id_tarea_origen)!.push(t.id_tarea_destino);
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

      // 5. CONSOLIDAR
      const pasadasList: ReturnType<typeof this.makeTarea>[] = [];
      for (const [estadoId, userInfo] of Array.from(usuarioPorEstadoAnterior.entries())) {
        if (estadoId === estadoActualId) continue;
        const info = estadosMap.get(estadoId);
        if (!info || info.id_paso_flujo !== pasoActualId) continue;

        pasadasList.push({
          id: String(info.id),
          pasoId: `p${pasoActualId}`,
          nombre: info.nombre,
          rolEsperado: rolEsperadoPorEstado.get(info.id) || "Sin rol asignado",
          usuarioAsignado: userInfo.username || "Sistema",
          rolResponsable:
            userInfo.rolReal || rolEsperadoPorEstado.get(info.id) || "Sin rol asignado",
          estado: "COMPLETADO" as const,
          fechaCompletado: userInfo.fechaCompletado,
        });
      }

      pasadasList.sort((a, b) => {
        const fa = a.fechaCompletado ? new Date(a.fechaCompletado).getTime() : 0;
        const fb = b.fechaCompletado ? new Date(b.fechaCompletado).getTime() : 0;
        return fa - fb;
      });

      const { data: transicionesActuales } = await this.supabase
        .from("transicion_flujo")
        .select("id, id_tarea_destino, nombre_accion")
        .eq("id_tarea_origen", estadoActualId);

      const accionesDisponibles = (transicionesActuales || []).map((t: any) => ({
        idTransicion: t.id,
        nombreAccion: t.nombre_accion,
        idEstadoDestino: t.id_tarea_destino,
      }));

      const actualUserInfo = usuarioPorEstadoAnterior.get(estadoActualId);
      const tareaActualItem = {
        id: String(estadoActualId),
        pasoId: `p${pasoActualId}`,
        nombre: estadoObj.nombre || "Tarea Actual",
        rolEsperado: rolEsperadoPorEstado.get(estadoActualId) || "Sin rol asignado",
        usuarioAsignado: actualUserInfo?.username || "—",
        rolResponsable:
          actualUserInfo?.rolReal || rolEsperadoPorEstado.get(estadoActualId) || "Sin rol asignado",
        estado: (rechazado ? "EN_CURSO" : "EN_CURSO") as "EN_CURSO",
        fechaCompletado: undefined as string | undefined,
        accionesDisponibles,
      };

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

  public async getTramiteById(idOrCode: string): Promise<TramiteDBItem | undefined> {
    const list = await this.getTramites();
    const tramite = list.find(
      (t) =>
        String(t.id) === idOrCode || t.codigoSeguimiento.toLowerCase() === idOrCode.toLowerCase()
    );

    if (tramite && (!tramite.items || tramite.items.length === 0)) {
      try {
        const { data: itemRows } = await this.supabase
          .from("item_tramite")
          .select("id, id_item, cantidad_solicitada, precio_unitario, especificacion, item:item!id_item ( id, nombre )")
          .eq("id_tramite", tramite.id);

        if (itemRows && itemRows.length > 0) {
          tramite.items = itemRows.map((it: any) => ({
            id: String(it.id),
            nombre: it.item?.nombre || "Ítem de Solicitud",
            descripcion: it.item?.nombre || "Ítem de Solicitud",
            categoria: tramite.categoria,
            cantidad: it.cantidad_solicitada || 1,
            precioReferencial: Number(it.precio_unitario || 0),
            precioUnitario: Number(it.precio_unitario || 0),
            especificacionesTecnicasTexto: it.especificacion || "",
            especificacion: it.especificacion || "",
            total: (it.cantidad_solicitada || 1) * Number(it.precio_unitario || 0),
          }));
        }
      } catch (err) {
        console.error("[getTramiteById Items Fetch Error]:", err);
      }
    }

    return tramite;
  }

  public async createTramite(data: {
    proyectoId?: number;
    tipoTramiteId?: number;
    justificacion?: string;
    items?: any[];
  }): Promise<TramiteDBItem> {
    try {
      const { data: estadoInicial } = await this.supabase
        .from("tarea_paso_flujo")
        .select("id, nombre, paso_flujo:paso_flujo!id_paso_flujo ( orden, nombre )")
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
          id_tarea_tramite: estadoInicialId,
          id_usuario: 1,
          justificacion: data.justificacion || "Solicitud de compra menor",
          fecha_creacion: new Date().toISOString(),
          fecha_actualizacion: new Date().toISOString(),
          rechazado: false,
        })
        .select()
        .single();

      if (error || !newRow) {
        console.error("[createTramite Error]:", error?.message, error?.details);
        throw new Error(error?.message || "Error al crear el trámite en la base de datos");
      }

      if (data.items && data.items.length > 0) {
        const itemRows = data.items.map((it: any) => {
          let idItemNum = 1;
          if (typeof it.id === "number") idItemNum = it.id;
          else if (it.id_item) idItemNum = Number(it.id_item);
          else if (it.itemId) idItemNum = Number(it.itemId);

          return {
            id_tramite: newRow.id,
            id_item: idItemNum,
            cantidad_solicitada: it.cantidad || 1,
            precio_unitario: Number(it.precioReferencial || it.precioUnitario || it.precio || 0),
            especificacion:
              it.especificacionesTecnicasTexto || it.especificacion || it.nombre || "",
            existe_en_mercado_virtual: true,
          };
        });

        const { error: itemsErr } = await this.supabase.from("item_tramite").insert(itemRows);

        if (itemsErr) {
          console.error(
            "[createTramite item_tramite Insert Error]:",
            itemsErr.message,
            itemsErr.details
          );
        }
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
    } catch (err: any) {
      console.error("[createTramite Exception]:", err);
      throw new Error(err?.message || "Error al registrar el trámite en la base de datos");
    }
  }
}

export const tramiteDBRepository = new TramiteDBRepository();
