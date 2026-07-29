import { numeroALetras, calcularFechaLimiteEntrega } from "../../lib/utils/numero-a-letras";

export function ejecutarPruebasUnitariasOrdenes(): boolean {
  // Prueba 1: Conversión a letras entero con 00/100
  const res1 = numeroALetras(8556);
  console.assert(
    res1 === "SON: OCHO MIL QUINIENTOS CINCUENTA Y SEIS 00/100 BOLIVIANOS",
    `Prueba 1 falló. Esperado: "SON: OCHO MIL QUINIENTOS CINCUENTA Y SEIS 00/100 BOLIVIANOS", Recibido: "${res1}"`
  );

  // Prueba 2: Conversión a letras decimal
  const res2 = numeroALetras(12400.5);
  console.assert(
    res2 === "SON: DOCE MIL CUATROCIENTOS 50/100 BOLIVIANOS",
    `Prueba 2 falló. Recibido: "${res2}"`
  );

  // Prueba 3: Cero bolivianos
  const res3 = numeroALetras(0);
  console.assert(res3 === "SON: CERO 00/100 BOLIVIANOS", `Prueba 3 falló. Recibido: "${res3}"`);

  // Prueba 4: Orden de compra suma días
  const fechaEmision = "2024-11-20T00:00:00.000Z";
  const res4 = calcularFechaLimiteEntrega(fechaEmision, 3, "ORDEN_COMPRA");
  console.assert(
    res4.fechaFormateada.includes("23 de Noviembre, 2024"),
    `Prueba 4 falló. Recibido: "${res4.fechaFormateada}"`
  );

  // Prueba 5: Orden de servicio suma días incluyendo fecha de emisión
  const res5 = calcularFechaLimiteEntrega(fechaEmision, 3, "ORDEN_SERVICIO");
  console.assert(
    res5.fechaFormateada.includes("22 de Noviembre, 2024"),
    `Prueba 5 falló. Recibido: "${res5.fechaFormateada}"`
  );

  // Prueba 6: Transición de mes
  const res6 = calcularFechaLimiteEntrega("2024-12-29T00:00:00.000Z", 5, "ORDEN_COMPRA");
  console.assert(
    res6.fechaFormateada.includes("3 de Enero, 2025"),
    `Prueba 6 falló. Recibido: "${res6.fechaFormateada}"`
  );

  return true;
}

// Auto-ejecución al importar si es necesario
ejecutarPruebasUnitariasOrdenes();
