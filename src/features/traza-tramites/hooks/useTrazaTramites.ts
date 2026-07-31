import { useState, useEffect, useCallback, useMemo } from "react";
import { PartidaTrazaSummary, ItemGastoPartidaDetail } from "../types";
import { fetchPartidasConTraza } from "../api/fetchTrazaTramites";

export function useTrazaTramites() {
  const [partidas, setPartidas] = useState<PartidaTrazaSummary[]>([]);
  const [selectedPartida, setSelectedPartida] = useState<PartidaTrazaSummary | null>(null);
  const [selectedItem, setSelectedItem] = useState<ItemGastoPartidaDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Filtros de Cabecera
  const [selectedProgramaId, setSelectedProgramaId] = useState<number | "all">("all");
  const [selectedProyectoId, setSelectedProyectoId] = useState<number | "all">("all");

  // Filtro de Estado en Sidebar (1: Preventivo, 2: Comprometido, 3: Gastado, 4: Revertido)
  const [statusFilter, setStatusFilter] = useState<number | "all">("all");

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchPartidasConTraza();
      setPartidas(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Lista de Programas únicos para el selector de cabecera
  const programasDisponibles = useMemo(() => {
    const map = new Map<number, { id: number; nombre: string }>();
    partidas.forEach((p) => {
      if (p.idPrograma) {
        map.set(p.idPrograma, {
          id: p.idPrograma,
          nombre:
            p.idPrograma === 1 ? "Programa ASDI Fortalecimiento" : `Programa #${p.idPrograma}`,
        });
      }
    });
    return Array.from(map.values());
  }, [partidas]);

  // Lista de Proyectos únicos para el selector de cabecera
  const proyectosDisponibles = useMemo(() => {
    const map = new Map<number, { id: number; nombre: string; codigo: string }>();
    partidas.forEach((p) => {
      if (p.idProyecto) {
        map.set(p.idProyecto, {
          id: p.idProyecto,
          nombre: p.nombreProyecto || `Proyecto #${p.idProyecto}`,
          codigo: p.codigoSisin || "SISIN",
        });
      }
    });
    return Array.from(map.values());
  }, [partidas]);

  // Filtrado de partidas según Programa y Proyecto seleccionados
  const filteredPartidas = useMemo(() => {
    return partidas.filter((p) => {
      if (selectedProgramaId !== "all" && p.idPrograma !== selectedProgramaId) {
        return false;
      }
      if (selectedProyectoId !== "all" && p.idProyecto !== selectedProyectoId) {
        return false;
      }
      return true;
    });
  }, [partidas, selectedProgramaId, selectedProyectoId]);

  const handleSelectItem = (partida: PartidaTrazaSummary, item: ItemGastoPartidaDetail) => {
    setSelectedPartida(partida);
    setSelectedItem(item);
  };

  const handleCloseSidebar = () => {
    setSelectedPartida(null);
    setSelectedItem(null);
  };

  return {
    partidas: filteredPartidas,
    rawPartidas: partidas,
    selectedPartida,
    selectedItem,
    onSelectItem: handleSelectItem,
    onCloseSidebar: handleCloseSidebar,
    selectedProgramaId,
    setSelectedProgramaId,
    selectedProyectoId,
    setSelectedProyectoId,
    programasDisponibles,
    proyectosDisponibles,
    statusFilter,
    setStatusFilter,
    isLoading,
    error,
    refetch: loadData,
  };
}
