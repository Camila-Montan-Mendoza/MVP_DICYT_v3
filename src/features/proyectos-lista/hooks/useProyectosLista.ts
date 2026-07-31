"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchProyectos } from "../api/fetchProyectos";
import { EstadoProyectoId, ProyectoListItem } from "../types";

const DEFAULT_PAGE_SIZE = 10;
const SIN_FILTRO = "all" as const;

const ESTADOS_QUE_REQUIEREN_MEMORIA_DE_CALCULO: EstadoProyectoId[] = [1, 3]; // Pendiente / Observado

/**
 * Decide a dónde navegar al hacer clic en un proyecto (FR-008/FR-009).
 * Para el Investigador Principal, si su proyecto está Pendiente u Observado,
 * navega directo a completar/corregir la memoria de cálculo en vez del
 * detalle genérico. Las rutas de destino son responsabilidad de otras HUs.
 */
export function resolveProyectoNavigationTarget(
  proyecto: Pick<ProyectoListItem, "id" | "estado">,
  rolActivo: string | undefined
): string {
  const esInvestigadorPrincipal = rolActivo === "Investigador Principal";
  const requiereMemoriaDeCalculo = ESTADOS_QUE_REQUIEREN_MEMORIA_DE_CALCULO.includes(
    proyecto.estado.id
  );

  if (esInvestigadorPrincipal && requiereMemoriaDeCalculo) {
    return `/proyectos/${proyecto.id}/memoria-calculo`;
  }

  return `/proyectos/${proyecto.id}`;
}

export function useProyectosLista() {
  const [proyectos, setProyectos] = useState<ProyectoListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [estadoId, setEstadoId] = useState<EstadoProyectoId | typeof SIN_FILTRO>(SIN_FILTRO);
  const [investigadorId, setInvestigadorId] = useState<number | typeof SIN_FILTRO>(SIN_FILTRO);

  const hasActiveFilters = search.trim() !== "" || estadoId !== SIN_FILTRO || investigadorId !== SIN_FILTRO;

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchProyectos({
        page,
        pageSize,
        q: search.trim() || undefined,
        estadoId: estadoId === SIN_FILTRO ? undefined : estadoId,
        investigadorId: investigadorId === SIN_FILTRO ? undefined : investigadorId,
      });
      setProyectos(response.proyectos);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al consultar proyectos");
      setProyectos([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, search, estadoId, investigadorId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const updateEstadoId = (value: EstadoProyectoId | typeof SIN_FILTRO) => {
    setEstadoId(value);
    setPage(1);
  };

  const updateInvestigadorId = (value: number | typeof SIN_FILTRO) => {
    setInvestigadorId(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setEstadoId(SIN_FILTRO);
    setInvestigadorId(SIN_FILTRO);
    setPage(1);
  };

  return {
    proyectos,
    total,
    page,
    pageSize,
    setPage,
    isLoading,
    error,

    search,
    setSearch: updateSearch,
    estadoId,
    setEstadoId: updateEstadoId,
    investigadorId,
    setInvestigadorId: updateInvestigadorId,
    clearFilters,
    hasActiveFilters,

    refetch: loadData,
  };
}
