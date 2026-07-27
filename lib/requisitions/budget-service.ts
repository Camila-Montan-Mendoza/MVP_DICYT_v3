export interface BudgetLookupResult {
  found: boolean;
  partidaCode: string;
  partidaNombre: string;
}

/**
 * Simulates external budget line lookup service with timeout and resilient fallback.
 * Implements FR-005: If lookup fails or returns no match, marks as "Pendiente de asignación".
 */
export async function lookupBudgetLine(description: string, category: string): Promise<BudgetLookupResult> {
  const DEFAULT_FALLBACK: BudgetLookupResult = {
    found: false,
    partidaCode: "Pendiente de asignación",
    partidaNombre: "Delegado a Responsable de Presupuestos",
  };

  if (!description || description.trim() === "") {
    return DEFAULT_FALLBACK;
  }

  try {
    // Timeout promise after 1.5 seconds per spec SLA
    const timeoutPromise = new Promise<BudgetLookupResult>((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 1500)
    );

    const lookupPromise = (async (): Promise<BudgetLookupResult> => {
      const lower = description.toLowerCase();

      if (category === "MATERIAL") {
        if (lower.includes("reactivo") || lower.includes("quimico") || lower.includes("insumo")) {
          return { found: true, partidaCode: "34110", partidaNombre: "Combustibles, Lubricantes y Reactivos" };
        }
        if (lower.includes("papel") || lower.includes("tinta") || lower.includes("oficina")) {
          return { found: true, partidaCode: "32100", partidaNombre: "Papel y Útiles de Escritorio" };
        }
        return { found: true, partidaCode: "39100", partidaNombre: "Materiales y Suministros Varios" };
      }

      if (category === "ACTIVO_FIJO") {
        if (lower.includes("equipo") || lower.includes("microscopio") || lower.includes("balanza")) {
          return { found: true, partidaCode: "43110", partidaNombre: "Equipo de Oficina y Computación" };
        }
        return { found: true, partidaCode: "43500", partidaNombre: "Maquinaria y Equipo de Investigación" };
      }

      if (category === "SERVICIO") {
        if (lower.includes("mantenimiento") || lower.includes("reparacion")) {
          return { found: true, partidaCode: "24100", partidaNombre: "Mantenimiento y Reparación de Equipos" };
        }
        return { found: true, partidaCode: "25200", partidaNombre: "Estudios e Investigaciones Técnicas" };
      }

      return DEFAULT_FALLBACK;
    })();

    return await Promise.race([lookupPromise, timeoutPromise]);
  } catch (error) {
    console.warn("Budget lookup fallback activated:", error);
    return DEFAULT_FALLBACK;
  }
}
