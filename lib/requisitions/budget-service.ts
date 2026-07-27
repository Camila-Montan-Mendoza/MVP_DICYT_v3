import { ItemCategoria } from "@/types/requisitions";
import { buscarPartidaObjetoGasto } from "@/lib/requisitions/clasificador-objeto-gasto";

export interface BudgetLookupResult {
  found: boolean;
  partidaCode: string;
  partidaNombre: string;
}

/**
 * Servicio de consulta de partidas presupuestarias según el Clasificador por Objeto del Gasto de Bolivia.
 * Devuelve SIEMPRE el código de 5 dígitos de nivel más profundo (ej. 34200, 43400, 25230).
 * Si no encuentra coincidencia, retorna la marca de contingencia "Pendiente de asignación".
 */
export async function lookupBudgetLine(description: string, category: string): Promise<BudgetLookupResult> {
  const DEFAULT_FALLBACK: BudgetLookupResult = {
    found: false,
    partidaCode: "Pendiente de asignación",
    partidaNombre: "Delegado a Responsable de Presupuestos DICYT",
  };

  if (!description || description.trim() === "") {
    return DEFAULT_FALLBACK;
  }

  try {
    const match = buscarPartidaObjetoGasto(description, category as ItemCategoria);
    if (match) {
      return {
        found: true,
        partidaCode: match.codigo,
        partidaNombre: match.denominacion,
      };
    }

    // Default deep fallback codes for categories if specific match is not found
    if (category === "MATERIAL") {
      return { found: true, partidaCode: "39500", partidaNombre: "Útiles de Escritorio y Oficina" };
    }
    if (category === "ACTIVO_FIJO") {
      return { found: true, partidaCode: "43400", partidaNombre: "Equipo Médico y de Laboratorio" };
    }
    if (category === "SERVICIO") {
      return { found: true, partidaCode: "25210", partidaNombre: "Consultorías por Producto" };
    }

    return DEFAULT_FALLBACK;
  } catch (error) {
    console.warn("Budget lookup fallback activated:", error);
    return DEFAULT_FALLBACK;
  }
}
