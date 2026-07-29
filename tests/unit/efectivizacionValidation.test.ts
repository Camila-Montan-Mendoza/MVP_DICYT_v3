import { calcularDiasRestantes } from "../../lib/utils/dias-restantes";

export function esFirmaCompleta(
  coordinador: boolean,
  director: boolean,
  proveedor: boolean
): boolean {
  return coordinador && director && proveedor;
}

export function ejecutarPruebasEfectivizacion(): boolean {
  // Prueba 1: Firma completa
  const res1 = esFirmaCompleta(true, true, true);
  console.assert(res1 === true, "Prueba 1 falló: debe ser true con 3 firmas");

  // Prueba 2: Firma incompleta
  const res2 = esFirmaCompleta(true, false, true);
  console.assert(res2 === false, "Prueba 2 falló: debe rechazar si falta 1 firma");

  // Prueba 3: Conteo de días restantes a futuro
  const hoy = new Date();
  const en7Dias = new Date(hoy.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const res3 = calcularDiasRestantes(en7Dias);
  console.assert(res3.estado === "NORMAL", "Prueba 3 falló: debe marcar NORMAL con 7 días");

  // Prueba 4: Conteo urgente con 1 día
  const en1Dia = new Date(hoy.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString();
  const res4 = calcularDiasRestantes(en1Dia);
  console.assert(res4.estado === "URGENTE", "Prueba 4 falló: debe marcar URGENTE con 1 día");

  return true;
}

ejecutarPruebasEfectivizacion();
