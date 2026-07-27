import { createClient } from "@/lib/supabase/client";
import type { NodoWorkflow, AccionTransicion } from "@/lib/workflow/compra-menor-strategy";

// ─── Tipos de fila de BD ─────────────────────────────────────────
interface PasoFlujoRow {
  id: number;
  id_tipo_tramite: number;
  nombre: string;
  orden: number;
}

interface EstadoPasoFlujoRow {
  id: number;
  id_paso_flujo: number;
  nombre: string;
  es_inicial: boolean;
  es_final: boolean;
  paso_flujo?: PasoFlujoRow;
}

interface TransicionFlujoRow {
  id: number;
  id_estado_origen: number;
  id_estado_destino: number;
  nombre_accion: string;
}

interface RolEstadoRow {
  id_rol: number;
  id_estado_paso_flujo: number;
  rol?: { id: number; nombre: string };
}

// ─── Cache en memoria ────────────────────────────────────────────
let cachedGrafo: Record<number, NodoWorkflow> | null = null;
let cachedTipoTramiteId: number | null = null;

/**
 * Determinar la variante del botón según el tipo de transición
 */
function inferVarianteBtn(
  nombreAccion: string,
  origenPasoOrden: number,
  destinoPasoOrden: number,
  destinoEsFinal: boolean,
  origenEstadoId: number,
  destinoEstadoId: number
): { tipo: AccionTransicion["tipo"]; varianteBtn: AccionTransicion["varianteBtn"] } {
  const nombreLower = nombreAccion.toLowerCase();

  // Bucle: origen === destino
  if (origenEstadoId === destinoEstadoId) {
    return { tipo: "REPETIR_BUCLE", varianteBtn: "outline" };
  }

  // Rechazo explícito
  if (nombreLower.includes("rechazar") || nombreLower.includes("rechazo")) {
    return { tipo: "RECHAZAR", varianteBtn: "danger" };
  }

  // Rebote: el destino tiene orden menor o igual y retrocede en nodos
  if (
    nombreLower.includes("observar") ||
    nombreLower.includes("subsanar") ||
    nombreLower.includes("corrección")
  ) {
    return { tipo: "REBOTAR", varianteBtn: "secondary" };
  }

  // Avance normal
  return { tipo: "AVANZAR", varianteBtn: "primary" };
}

/**
 * Inferir el código de rol de actor a partir del nombre del rol en BD
 */
function inferActorRolCode(rolNombre: string): string {
  const n = rolNombre.toLowerCase();
  if (n.includes("investigador")) return "I";
  if (n.includes("presupuesto")) return "RP";
  if (n.includes("compras") || n.includes("contratacion")) return "RC";
  if (n.includes("administrador") || n.includes("director")) return "AD";
  if (n.includes("caja") || n.includes("contabilidad") || n.includes("fondos")) return "CD";
  return "I"; // Default
}

/**
 * Carga el grafo completo del workflow desde Supabase para un tipo de trámite.
 * Usa cache en memoria: solo consulta la BD la primera vez.
 */
export async function cargarGrafoWorkflow(
  tipoTramiteId: number = 1
): Promise<Record<number, NodoWorkflow>> {
  // Retornar cache si existe para el mismo tipo de trámite
  if (cachedGrafo && cachedTipoTramiteId === tipoTramiteId) {
    return cachedGrafo;
  }

  const supabase = createClient();

  // 1. Cargar pasos del flujo
  const { data: pasos, error: errorPasos } = await supabase
    .from("paso_flujo")
    .select("id, id_tipo_tramite, nombre, orden")
    .eq("id_tipo_tramite", tipoTramiteId)
    .order("orden", { ascending: true });

  if (errorPasos) {
    console.error("[Supabase Workflow Error - paso_flujo]:", errorPasos.message, errorPasos.details);
  }

  if (!pasos || pasos.length === 0) {
    console.warn("[workflow-db-service] No se encontraron pasos de flujo para tipo_tramite:", tipoTramiteId);
    return {};
  }

  const pasosMap = new Map<number, PasoFlujoRow>();
  for (const p of pasos) {
    pasosMap.set(p.id, p as PasoFlujoRow);
  }
  const pasoIds = pasos.map((p) => p.id);

  // 2. Cargar estados (nodos) del flujo con relación a paso_flujo
  const { data: estados } = await supabase
    .from("estado_paso_flujo")
    .select("id, id_paso_flujo, nombre, es_inicial, es_final")
    .in("id_paso_flujo", pasoIds)
    .order("id", { ascending: true });

  if (!estados || estados.length === 0) {
    console.warn("[workflow-db-service] No se encontraron estados para pasos:", pasoIds);
    return {};
  }

  const estadoIds = estados.map((e) => e.id);

  // 3. Cargar transiciones entre nodos
  const { data: transiciones } = await supabase
    .from("transicion_flujo")
    .select("id, id_estado_origen, id_estado_destino, nombre_accion")
    .in("id_estado_origen", estadoIds);

  // 4. Cargar roles responsables por nodo
  const { data: rolesEstado } = await supabase
    .from("rol_estado_paso_flujo")
    .select("id_rol, id_estado_paso_flujo, rol ( id, nombre )")
    .in("id_estado_paso_flujo", estadoIds);

  // ─── Construir mapas auxiliares ────────────────────────────────
  // Mapa: estadoId -> transiciones salientes
  const transicionesPorEstado = new Map<number, TransicionFlujoRow[]>();
  if (transiciones) {
    for (const t of transiciones) {
      const list = transicionesPorEstado.get(t.id_estado_origen) || [];
      list.push(t as TransicionFlujoRow);
      transicionesPorEstado.set(t.id_estado_origen, list);
    }
  }

  // Mapa: estadoId -> rol asignado
  const rolPorEstado = new Map<number, { rolNombre: string; rolCode: string }>();
  if (rolesEstado) {
    for (const re of rolesEstado as any[]) {
      const rolObj = re.rol;
      const rolNombre = rolObj?.nombre || "Sin rol asignado";
      rolPorEstado.set(re.id_estado_paso_flujo, {
        rolNombre,
        rolCode: inferActorRolCode(rolNombre),
      });
    }
  }

  // Mapa: estadoId -> EstadoPasoFlujoRow (para resolver destinos)
  const estadosMap = new Map<number, EstadoPasoFlujoRow>();
  for (const e of estados) {
    estadosMap.set(e.id, e as EstadoPasoFlujoRow);
  }

  // ─── Construir el grafo de NodoWorkflow ────────────────────────
  const grafo: Record<number, NodoWorkflow> = {};

  for (const estado of estados as EstadoPasoFlujoRow[]) {
    const paso = pasosMap.get(estado.id_paso_flujo);
    if (!paso) continue;

    const rolInfo = rolPorEstado.get(estado.id) || { rolNombre: "Sin rol asignado", rolCode: "I" };
    const transicionesSalientes = transicionesPorEstado.get(estado.id) || [];

    // Construir acciones de transición
    const acciones: AccionTransicion[] = transicionesSalientes.map((t) => {
      const destinoEstado = estadosMap.get(t.id_estado_destino);
      const destinoPaso = destinoEstado ? pasosMap.get(destinoEstado.id_paso_flujo) : null;

      const { tipo, varianteBtn } = inferVarianteBtn(
        t.nombre_accion,
        paso.orden,
        destinoPaso?.orden || paso.orden,
        destinoEstado?.es_final || false,
        estado.id,
        t.id_estado_destino
      );

      return {
        id: `trans_${t.id}`,
        label: t.nombre_accion,
        siguienteNodoId: String(t.id_estado_destino),
        tipo,
        varianteBtn,
      };
    });

    grafo[estado.id] = {
      id: String(estado.id),
      pasoNumero: paso.orden as 1 | 2 | 3 | 4,
      pasoNombre: paso.nombre,
      nombre: estado.nombre,
      actorRol: rolInfo.rolCode as any,
      actorNombreRol: rolInfo.rolNombre,
      instruccion: estado.nombre, // La instrucción es el mismo nombre del estado
      acciones,
    };
  }

  // Guardar en cache
  cachedGrafo = grafo;
  cachedTipoTramiteId = tipoTramiteId;

  return grafo;
}

/**
 * Obtener los nodos de un paso macro específico
 */
export async function cargarNodosDelPaso(
  tipoTramiteId: number,
  pasoOrden: number
): Promise<NodoWorkflow[]> {
  const grafo = await cargarGrafoWorkflow(tipoTramiteId);
  return Object.values(grafo).filter((n) => n.pasoNumero === pasoOrden);
}

/**
 * Obtener un nodo específico por su ID de BD
 */
export async function obtenerNodoPorId(
  estadoId: number,
  tipoTramiteId: number = 1
): Promise<NodoWorkflow | null> {
  const grafo = await cargarGrafoWorkflow(tipoTramiteId);
  return grafo[estadoId] || null;
}

/**
 * Obtener las transiciones disponibles desde un nodo
 */
export async function cargarTransicionesDesdeNodo(
  estadoId: number,
  tipoTramiteId: number = 1
): Promise<AccionTransicion[]> {
  const nodo = await obtenerNodoPorId(estadoId, tipoTramiteId);
  return nodo?.acciones || [];
}

/**
 * Obtener los pasos macro del flujo
 */
export async function cargarPasosFlujo(
  tipoTramiteId: number = 1
): Promise<Array<{ id: number; nombre: string; orden: number }>> {
  const supabase = createClient();
  const { data } = await supabase
    .from("paso_flujo")
    .select("id, nombre, orden")
    .eq("id_tipo_tramite", tipoTramiteId)
    .order("orden", { ascending: true });
  return (data as Array<{ id: number; nombre: string; orden: number }>) || [];
}

/**
 * Invalidar el cache (útil si se modifica el workflow en BD)
 */
export function invalidarCacheWorkflow(): void {
  cachedGrafo = null;
  cachedTipoTramiteId = null;
}
