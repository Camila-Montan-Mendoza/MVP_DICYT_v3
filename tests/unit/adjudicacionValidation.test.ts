// Funciones puras de validación de reglas de negocio para Adjudicación

export function esOfertaValidaParaAdjudicacion(
  cantidadExistencias: number,
  precioCotizado: number,
  precioReferencial: number
): { valida: boolean; motivo?: string } {
  if (cantidadExistencias <= 0) {
    return { valida: false, motivo: "Sin Stock" };
  }
  if (precioCotizado > precioReferencial) {
    return { valida: false, motivo: "El precio cotizado supera el precio referencial inicial" };
  }
  return { valida: true };
}

export function validarSumaAdjudicacionDividida(
  cantidades: number[],
  cantidadSolicitada: number
): { valida: boolean; sumaTotal: number } {
  const sumaTotal = cantidades.reduce((a, b) => a + b, 0);
  return {
    valida: sumaTotal <= cantidadSolicitada,
    sumaTotal,
  };
}

// Ejecución de afirmaciones en entorno ligero
export function ejecutarValidacionesPrueba() {
  const res1 = esOfertaValidaParaAdjudicacion(0, 100, 150);
  console.assert(
    res1.valida === false && res1.motivo === "Sin Stock",
    "Prueba 1 falló: debe rechazar existencias 0"
  );

  const res2 = esOfertaValidaParaAdjudicacion(10, 200, 150);
  console.assert(
    res2.valida === false &&
      res2.motivo === "El precio cotizado supera el precio referencial inicial",
    "Prueba 2 falló: debe rechazar sobreprecio"
  );

  const res3 = esOfertaValidaParaAdjudicacion(10, 140, 150);
  console.assert(res3.valida === true, "Prueba 3 falló: debe aceptar oferta válida");

  const res4 = validarSumaAdjudicacionDividida([3, 4], 5);
  console.assert(
    res4.valida === false && res4.sumaTotal === 7,
    "Prueba 4 falló: debe rechazar suma > solicitada"
  );

  const res5 = validarSumaAdjudicacionDividida([2, 3], 5);
  console.assert(
    res5.valida === true && res5.sumaTotal === 5,
    "Prueba 5 falló: debe aceptar suma correcta"
  );

  return true;
}
