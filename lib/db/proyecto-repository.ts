import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { EstadoProyectoId, ProyectoListItem, RolActivoScope } from "@/src/features/proyectos-lista/types";

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

  const { data: proyectosRaw, error: proyectosError, count } = await query
    .order("id", { ascending: true })
    .range(from, to);

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
