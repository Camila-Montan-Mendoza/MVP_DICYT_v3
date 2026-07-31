export function validarRequisitosActaDefinitiva(
  facturaUrl?: string,
  evidenciaUrl?: string,
  materialesSinVerificar: number = 0
): { valida: boolean; motivo?: string } {
  if (!facturaUrl) {
    return {
      valida: false,
      motivo: "La factura oficial del proveedor es obligatoria para el Acta Definitiva",
    };
  }
  if (materialesSinVerificar > 0) {
    return { valida: false, motivo: "Existen materiales sin verificar en la tabla" };
  }
  return { valida: true };
}

export function ejecutarPruebasRecepcion(): boolean {
  // Prueba 1: Rechazar emisión definitiva sin factura
  const res1 = validarRequisitosActaDefinitiva(undefined, "http://evidencia.jpg", 0);
  console.assert(
    res1.valida === false && res1.motivo?.includes("factura"),
    "Prueba 1 falló: debe rechazar si falta la factura"
  );

  // Prueba 2: Aceptar si la factura está adjunta
  const res2 = validarRequisitosActaDefinitiva("http://factura.pdf", "http://evidencia.jpg", 0);
  console.assert(res2.valida === true, "Prueba 2 falló: debe aceptar con factura");

  // Prueba 3: Rechazar si hay ítems sin verificar
  const res3 = validarRequisitosActaDefinitiva("http://factura.pdf", undefined, 2);
  console.assert(res3.valida === false, "Prueba 3 falló: debe rechazar ítems no verificados");

  return true;
}

ejecutarPruebasRecepcion();
