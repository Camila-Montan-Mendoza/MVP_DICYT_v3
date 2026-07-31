"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchProyectoDetalle } from "../api/fetchProyectoDetalle";
import { ProyectoDetalle } from "../types";

export function useProyectoDetalle(proyectoId: number) {
  const [proyecto, setProyecto] = useState<ProyectoDetalle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [forbidden, setForbidden] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setNotFound(false);
    setForbidden(false);
    try {
      const result = await fetchProyectoDetalle(proyectoId);
      setProyecto(result.proyecto);
      setNotFound(result.notFound);
      setForbidden(result.forbidden);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al consultar el proyecto");
      setProyecto(null);
    } finally {
      setIsLoading(false);
    }
  }, [proyectoId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { proyecto, isLoading, error, notFound, forbidden, refetch: loadData };
}
