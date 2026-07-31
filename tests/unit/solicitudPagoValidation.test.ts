export function validarMotivoObservacion(motivo?: string): { valida: boolean; error?: string } {
  if (!motivo || motivo.trim().length === 0) {
    return {
      valida: false,
      error: "El motivo de la observación es obligatorio y no puede estar vacío.",
    };
  }
  return { valida: true };
}

export function ejecutarPruebasSolicitudPago(): boolean {
  // Prueba 1: Rechazar observación con texto vacío
  const res1 = validarMotivoObservacion("");
  console.assert(
    res1.valida === false && res1.error?.includes("obligatorio"),
    "Prueba 1 falló: debe exigir un motivo no vacío"
  );

  // Prueba 2: Rechazar observación con espacios en blanco
  const res2 = validarMotivoObservacion("   ");
  console.assert(res2.valida === false, "Prueba 2 falló: debe rechazar texto sólo con espacios");

  // Prueba 3: Aceptar observación válida
  const res3 = validarMotivoObservacion("Falta el sello oficial del NIT en la Factura.");
  console.assert(res3.valida === true, "Prueba 3 falló: debe aceptar motivo válido");

  return true;
}

ejecutarPruebasSolicitudPago();
