import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type {
  EstadoProyectoId,
  ProyectoListItem,
  RolActivoScope,
} from "@/src/features/proyectos-lista/types";
import type { ProyectoDetalle } from "@/src/features/proyecto-detalle/types";

export interface ProyectoDBItem {
  id: number;
  nombre: string;
}

const ESTADO_PROYECTO_IDS_VALIDOS: EstadoProyectoId[] = [1, 2, 3, 4];
const ID_ROL_INVESTIGADOR_PRINCIPAL = 1;
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;

export interface ListProyectosParams {
  usuarioId: number;
  scope: RolActivoScope;
  q?: string;
  estadoId?: number;
  investigadorId?: number;
  page?: number;
  pageSize?: number;
}

export interface ListProyectosResult {
  proyectos: ProyectoListItem[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Consulta real a Supabase para la lista de proyectos con alcance por rol,
 * filtros combinables y paginación. Sin arreglos de respaldo: ante error de
 * Supabase esta función propaga la excepción para que el Route Handler
 * responda 500, en vez de devolver datos inventados.
 */
export async function listProyectosParaUsuario(
  supabase: SupabaseClient,
  params: ListProyectosParams
): Promise<ListProyectosResult> {
  const page = params.page && params.page > 0 ? params.page : 1;
  const pageSize = Math.min(
    params.pageSize && params.pageSize > 0 ? params.pageSize : DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE
  );

  const estadoId = ESTADO_PROYECTO_IDS_VALIDOS.includes(params.estadoId as EstadoProyectoId)
    ? (params.estadoId as EstadoProyectoId)
    : undefined;

  // El `investigadorId` enviado por un Investigador Principal se ignora: su
  // alcance ya está fijado a sus propios proyectos (scope === "own").
  const investigadorFiltroId =
    params.scope === "all" && params.investigadorId ? params.investigadorId : undefined;

  let proyectoIdsPermitidos: number[] | null = null;

  if (params.scope === "own") {
    const { data: propios, error: propiosError } = await supabase
      .from("proyecto_usuario")
      .select("id_proyecto")
      .eq("id_usuario", params.usuarioId)
      .eq("id_rol", ID_ROL_INVESTIGADOR_PRINCIPAL);

    if (propiosError) throw propiosError;

    proyectoIdsPermitidos = (propios ?? []).map((row) => row.id_proyecto as number);
  } else if (investigadorFiltroId) {
    const { data: filtrados, error: filtradosError } = await supabase
      .from("proyecto_usuario")
      .select("id_proyecto")
      .eq("id_usuario", investigadorFiltroId)
      .eq("id_rol", ID_ROL_INVESTIGADOR_PRINCIPAL);

    if (filtradosError) throw filtradosError;

    proyectoIdsPermitidos = (filtrados ?? []).map((row) => row.id_proyecto as number);
  }

  if (proyectoIdsPermitidos !== null && proyectoIdsPermitidos.length === 0) {
    return { proyectos: [], total: 0, page, pageSize };
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("proyecto")
    .select("id, nombre, codigo, presupuesto, estado_proyecto(id, nombre)", { count: "exact" });

  if (proyectoIdsPermitidos !== null) {
    query = query.in("id", proyectoIdsPermitidos);
  }
  if (params.q) {
    const term = params.q.replace(/[%_]/g, "");
    query = query.or(`nombre.ilike.%${term}%,codigo.ilike.%${term}%`);
  }
  if (estadoId) {
    query = query.eq("id_estado_proyecto", estadoId);
  }

  const {
    data: proyectosRaw,
    error: proyectosError,
    count,
  } = await query.order("id", { ascending: true }).range(from, to);

  if (proyectosError) throw proyectosError;

  const rows = proyectosRaw ?? [];
  const proyectoIds = rows.map((row: any) => row.id as number);

  const investigadoresPorProyecto = new Map<number, { id: number; nombre: string }>();

  if (proyectoIds.length > 0) {
    const { data: relaciones, error: relacionesError } = await supabase
      .from("proyecto_usuario")
      .select("id_proyecto, usuario(id, username)")
      .eq("id_rol", ID_ROL_INVESTIGADOR_PRINCIPAL)
      .in("id_proyecto", proyectoIds)
      .order("id_usuario", { ascending: true });

    if (relacionesError) throw relacionesError;

    for (const rel of (relaciones ?? []) as any[]) {
      if (!investigadoresPorProyecto.has(rel.id_proyecto) && rel.usuario) {
        investigadoresPorProyecto.set(rel.id_proyecto, {
          id: rel.usuario.id,
          nombre: rel.usuario.username,
        });
      }
    }
  }

  const proyectos: ProyectoListItem[] = rows.map((row: any, index: number) => ({
    id: row.id,
    numero: from + index + 1,
    nombre: row.nombre,
    codigo: row.codigo,
    presupuesto: Number(row.presupuesto) || 0,
    estado: {
      id: row.estado_proyecto?.id ?? 1,
      nombre: row.estado_proyecto?.nombre ?? "Pendiente de memoria de cálculo",
    },
    investigadorPrincipal: investigadoresPorProyecto.get(row.id) ?? null,
  }));

  return { proyectos, total: count ?? 0, page, pageSize };
}

const ROLES_ACCESO_TOTAL_DETALLE = [
  "Administradora DICyT",
  "Administrador del Sistema SIGEFI",
  "Resp. de Presupuestos",
];

interface ProyectoDetalleAccesoParams {
  proyectoId: number;
  usuarioId: number;
  rolActivo: string;
}

/**
 * Control de acceso puntual por proyecto (CA-6): un Investigador Principal
 * solo tiene acceso si es IP de *este* proyecto específico, no de cualquiera.
 */
export async function usuarioTieneAccesoAProyecto(
  supabase: SupabaseClient,
  { proyectoId, usuarioId, rolActivo }: ProyectoDetalleAccesoParams
): Promise<boolean> {
  if (ROLES_ACCESO_TOTAL_DETALLE.includes(rolActivo)) return true;

  if (rolActivo === "Investigador Principal") {
    const { data, error } = await supabase
      .from("proyecto_usuario")
      .select("id_usuario")
      .eq("id_proyecto", proyectoId)
      .eq("id_usuario", usuarioId)
      .eq("id_rol", ID_ROL_INVESTIGADOR_PRINCIPAL)
      .maybeSingle();

    if (error) throw error;
    return Boolean(data);
  }

  return false;
}

interface GetProyectoDetalleParams {
  proyectoId: number;
  rolActivo: string;
}

function calcularPermisos(estadoId: EstadoProyectoId, rolActivo: string) {
  const esInvestigadorPrincipal = rolActivo === "Investigador Principal";
  const esRespPresupuestos = rolActivo === "Resp. de Presupuestos";
  const esAdministrador =
    rolActivo === "Administradora DICyT" || rolActivo === "Administrador del Sistema SIGEFI";

  const soloLectura = esAdministrador || estadoId === 4;
  const puedeDetallarMemoria =
    !soloLectura && esInvestigadorPrincipal && (estadoId === 1 || estadoId === 3);
  const puedeEvaluar = !soloLectura && esRespPresupuestos && estadoId === 2;

  return { puedeDetallarMemoria, puedeEvaluar, soloLectura };
}

/**
 * Consulta real a Supabase para el detalle de un proyecto y su memoria de
 * cálculo. Retorna `null` si el proyecto no existe (404). El control de
 * acceso (403) se resuelve por separado con `usuarioTieneAccesoAProyecto`
 * antes de llamar a esta función. Sin arreglos de respaldo.
 */
export async function getProyectoDetalle(
  supabase: SupabaseClient,
  { proyectoId, rolActivo }: GetProyectoDetalleParams
): Promise<ProyectoDetalle | null> {
  const { data: row, error } = await supabase
    .from("proyecto")
    .select(
      `id, nombre, presupuesto, fecha_inicio, fecha_fin,
       estado_proyecto(id, nombre),
       programa(nombre, convenio(fuente_financiamiento(nombre)))`
    )
    .eq("id", proyectoId)
    .maybeSingle();

  if (error) throw error;
  if (!row) return null;

  const proyectoRow = row as any;

  const { data: ipRow, error: ipError } = await supabase
    .from("proyecto_usuario")
    .select("usuario(id, username)")
    .eq("id_proyecto", proyectoId)
    .eq("id_rol", ID_ROL_INVESTIGADOR_PRINCIPAL)
    .order("id_usuario", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (ipError) throw ipError;

  const { data: partidasRaw, error: partidasError } = await supabase
    .from("partida_concreta")
    .select("id, presupuesto, partida(codigo, nombre)")
    .eq("id_proyecto", proyectoId);

  if (partidasError) throw partidasError;

  const memoriaCalculo = ((partidasRaw ?? []) as any[]).map((p) => ({
    id: p.id,
    codigoPartida: p.partida?.codigo ?? 0,
    nombrePartida: p.partida?.nombre ?? "Partida sin nombre registrado",
    monto: Number(p.presupuesto) || 0,
  }));

  const estadoId = (proyectoRow.estado_proyecto?.id ?? 1) as EstadoProyectoId;

  return {
    id: proyectoRow.id,
    nombre: proyectoRow.nombre,
    presupuestoTotal: Number(proyectoRow.presupuesto) || 0,
    programa: proyectoRow.programa?.nombre ?? "No especificado",
    fuenteFinanciamiento: proyectoRow.programa?.convenio?.fuente_financiamiento?.nombre ?? null,
    fechaInicio: proyectoRow.fecha_inicio,
    fechaFin: proyectoRow.fecha_fin,
    estado: {
      id: estadoId,
      nombre: proyectoRow.estado_proyecto?.nombre ?? "Pendiente de memoria de cálculo",
    },
    investigadorPrincipal: (ipRow as any)?.usuario
      ? { id: (ipRow as any).usuario.id, nombre: (ipRow as any).usuario.username }
      : null,
    memoriaCalculo,
    totalMemoriaCalculo: memoriaCalculo.reduce((sum, p) => sum + p.monto, 0),
    permisos: calcularPermisos(estadoId, rolActivo),
  };
}

export class ProyectoDBRepository {
  private supabase = createClient();

  /**
   * Fetch projects from real Supabase DB (tabla "proyecto", atributo "nombre")
   */
  public async getProyectos(): Promise<ProyectoDBItem[]> {
    try {
      const { data, error } = await this.supabase
        .from("proyecto")
        .select("id, nombre")
        .order("nombre", { ascending: true });

      if (error) {
        console.error("[Supabase Proyectos Query Error]:", error.message, error.details);
        return [];
      }

      return data ?? [];
    } catch (err) {
      console.error("[ProyectoRepository Exception]:", err);
      return [];
    }
  }
}

export const proyectoDBRepository = new ProyectoDBRepository();
