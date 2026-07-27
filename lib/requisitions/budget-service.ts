import { itemDBRepository } from "@/lib/db/item-repository";

export interface BudgetLookupResult {
  found: boolean;
  partidaCode: string;
  partidaNombre: string;
}

/**
 * Servicio de consulta de partidas presupuestarias desde el Backend / Supabase DB.
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
    const matches = await itemDBRepository.searchItems(description);
    if (matches.length > 0) {
      const match = matches[0];
      return {
        found: true,
        partidaCode: String(match.partidaCodigo),
        partidaNombre: match.partidaNombre,
      };
    }

    // Default deep fallback codes for categories if specific match is not found in DB
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
