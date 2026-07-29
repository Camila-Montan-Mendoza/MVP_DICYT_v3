import { formatearTamanoBytes } from "@/services/expedienteService";

export function ejecutarPruebasExpediente(): boolean {
  // Prueba 1: Formatear bytes < 1024
  const res1 = formatearTamanoBytes(500);
  console.assert(res1 === "500 B", `Prueba 1 falló: ${res1}`);

  // Prueba 2: Formatear Kilobytes
  const res2 = formatearTamanoBytes(450 * 1024);
  console.assert(res2 === "450.0 KB", `Prueba 2 falló: ${res2}`);

  // Prueba 3: Formatear Megabytes
  const res3 = formatearTamanoBytes(1.2 * 1024 * 1024);
  console.assert(res3 === "1.2 MB", `Prueba 3 falló: ${res3}`);

  return true;
}

ejecutarPruebasExpediente();
