/**
 * Calcula los días restantes o vencidos hasta la fecha límite de entrega
 */

export interface ResultadoDiasRestantes {
  dias: number;
  texto: string;
  estado: "NORMAL" | "ALERTA" | "URGENTE" | "VENCIDO";
}

export function calcularDiasRestantes(fechaLimiteIso: string | Date): ResultadoDiasRestantes {
  let targetDate: Date;

  if (typeof fechaLimiteIso === "string") {
    // Si viene en formato DD de Mes, AAAA o ISO
    if (fechaLimiteIso.includes("de")) {
      // Intentar parsear "23 de Noviembre, 2024"
      const now = new Date();
      targetDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    } else {
      targetDate = new Date(fechaLimiteIso);
    }
  } else {
    targetDate = fechaLimiteIso;
  }

  if (isNaN(targetDate.getTime())) {
    const now = new Date();
    targetDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  }

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const limite = new Date(targetDate);
  limite.setHours(0, 0, 0, 0);

  const diffMs = limite.getTime() - hoy.getTime();
  const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDias > 5) {
    return {
      dias: diffDias,
      texto: `${diffDias} DÍAS RESTANTES`,
      estado: "NORMAL",
    };
  } else if (diffDias > 2) {
    return {
      dias: diffDias,
      texto: `${diffDias} DÍAS RESTANTES`,
      estado: "ALERTA",
    };
  } else if (diffDias >= 1) {
    return {
      dias: diffDias,
      texto: `Quedan ${diffDias} día(s)`,
      estado: "URGENTE",
    };
  } else if (diffDias === 0) {
    return {
      dias: 0,
      texto: "ENTREGA HOY",
      estado: "URGENTE",
    };
  } else {
    const vencidos = Math.abs(diffDias);
    return {
      dias: diffDias,
      texto: `VENCIDO HACE ${vencidos} DÍA(S)`,
      estado: "VENCIDO",
    };
  }
}
