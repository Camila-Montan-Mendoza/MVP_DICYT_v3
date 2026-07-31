import { useState, useEffect, useCallback, useMemo } from "react";
import { ModificacionPresupuestariaSummary } from "../types";
import { fetchBitacoraModificaciones } from "../api/fetchBitacoraModificaciones";

export function useBitacoraModificaciones() {
  const [modificaciones, setModificaciones] = useState<ModificacionPresupuestariaSummary[]>([]);
  const [selectedModificacion, setSelectedModificacion] =
    useState<ModificacionPresupuestariaSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Filtros de Cabecera: Programa, Proyecto y Gestión Fiscal
  const [selectedProgramaId, setSelectedProgramaId] = useState<number | "all">("all");
  const [selectedProyectoId, setSelectedProyectoId] = useState<number | "all">("all");
  const [selectedGestion, setSelectedGestion] = useState<number | "global">(2026);

  const availableGestiones = [2026, 2025];

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchBitacoraModificaciones();
      setModificaciones(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Lista de Programas únicos
  const programasDisponibles = useMemo(() => {
    const map = new Map<number, { id: number; nombre: string }>();
    modificaciones.forEach((m) => {
      if (m.idPrograma) {
        map.set(m.idPrograma, {
          id: m.idPrograma,
          nombre:
            m.idPrograma === 1 ? "Programa ASDI Fortalecimiento" : `Programa #${m.idPrograma}`,
        });
      }
    });
    return Array.from(map.values());
  }, [modificaciones]);

  // Lista de Proyectos únicos
  const proyectosDisponibles = useMemo(() => {
    const map = new Map<number, { id: number; nombre: string }>();
    modificaciones.forEach((m) => {
      if (m.idProyecto) {
        map.set(m.idProyecto, {
          id: m.idProyecto,
          nombre: m.nombreProyecto || `Proyecto #${m.idProyecto}`,
        });
      }
    });
    return Array.from(map.values());
  }, [modificaciones]);

  // Filtrado reactivo por Programa, Proyecto y Gestión Fiscal
  const filteredModificaciones = useMemo(() => {
    return modificaciones.filter((m) => {
      if (selectedProgramaId !== "all" && m.idPrograma !== selectedProgramaId) {
        return false;
      }
      if (selectedProyectoId !== "all" && m.idProyecto !== selectedProyectoId) {
        return false;
      }
      if (selectedGestion !== "global" && m.gestion !== selectedGestion) {
        return false;
      }
      return true;
    });
  }, [modificaciones, selectedProgramaId, selectedProyectoId, selectedGestion]);

  const hasSelection = selectedProgramaId !== "all" || selectedProyectoId !== "all";

  const handleSelectModificacion = (mod: ModificacionPresupuestariaSummary) => {
    setSelectedModificacion(mod);
  };

  const handleCloseSidebar = () => {
    setSelectedModificacion(null);
  };

  return {
    modificaciones: filteredModificaciones,
    rawModificaciones: modificaciones,
    selectedModificacion,
    onSelectModificacion: handleSelectModificacion,
    onCloseSidebar: handleCloseSidebar,
    selectedProgramaId,
    setSelectedProgramaId,
    selectedProyectoId,
    setSelectedProyectoId,
    selectedGestion,
    setSelectedGestion,
    hasSelection,
    availableGestiones,
    programasDisponibles,
    proyectosDisponibles,
    isLoading,
    error,
    refetch: loadData,
  };
}
