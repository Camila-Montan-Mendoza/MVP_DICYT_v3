import { ProyectoDetalle, ProyectoDetalleApiErrorResponse } from "../types";

export interface FetchProyectoDetalleResult {
  proyecto: ProyectoDetalle | null;
  notFound: boolean;
  forbidden: boolean;
}

export async function fetchProyectoDetalle(
  proyectoId: number
): Promise<FetchProyectoDetalleResult> {
  const response = await fetch(`/api/proyectos/${proyectoId}`, {
    method: "GET",
    credentials: "include",
  });

  if (response.status === 404) {
    return { proyecto: null, notFound: true, forbidden: false };
  }

  if (response.status === 403) {
    return { proyecto: null, notFound: false, forbidden: true };
  }

  if (!response.ok) {
    const errorBody = (await response
      .json()
      .catch(() => null)) as ProyectoDetalleApiErrorResponse | null;
    throw new Error(errorBody?.message ?? "Error al consultar el proyecto");
  }

  const proyecto = (await response.json()) as ProyectoDetalle;
  return { proyecto, notFound: false, forbidden: false };
}
