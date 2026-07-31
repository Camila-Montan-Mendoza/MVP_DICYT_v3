import { ProyectosApiErrorResponse, ProyectosListFilters, ProyectosListResponse } from "../types";

export async function fetchProyectos(
  filters: ProyectosListFilters = {}
): Promise<ProyectosListResponse> {
  const params = new URLSearchParams();

  if (filters.q) params.set("q", filters.q);
  if (filters.estadoId) params.set("estadoId", String(filters.estadoId));
  if (filters.investigadorId) params.set("investigadorId", String(filters.investigadorId));
  params.set("page", String(filters.page ?? 1));
  params.set("pageSize", String(filters.pageSize ?? 10));

  const response = await fetch(`/api/proyectos?${params.toString()}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as ProyectosApiErrorResponse | null;
    throw new Error(errorBody?.message ?? "Error al consultar proyectos");
  }

  return (await response.json()) as ProyectosListResponse;
}
