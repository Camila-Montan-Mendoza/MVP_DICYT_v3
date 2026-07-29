/**
 * Convierte un número decimal a su expresión en palabras en español
 * en formato oficial bancario/administrativo de la UMSS:
 * Ejemplo: 8556.00 -> "SON: OCHO MIL QUINIENTOS CINCUENTA Y SEIS 00/100 BOLIVIANOS"
 */

function Unidades(num: number): string {
  switch (num) {
    case 1:
      return "UN";
    case 2:
      return "DOS";
    case 3:
      return "TRES";
    case 4:
      return "CUATRO";
    case 5:
      return "CINCO";
    case 6:
      return "SEIS";
    case 7:
      return "SIETE";
    case 8:
      return "OCHO";
    case 9:
      return "NUEVE";
  }
  return "";
}

function Decenas(num: number): string {
  const decena = Math.floor(num / 10);
  const unidad = num % 10;

  switch (decena) {
    case 1:
      switch (unidad) {
        case 0:
          return "DIEZ";
        case 1:
          return "ONCE";
        case 2:
          return "DOCE";
        case 3:
          return "TRECE";
        case 4:
          return "CATORCE";
        case 5:
          return "QUINCE";
        default:
          return "DIECI" + Unidades(unidad);
      }
    case 2:
      switch (unidad) {
        case 0:
          return "VEINTE";
        default:
          return "VEINTI" + Unidades(unidad);
      }
    case 3:
      return DecenasY("TREINTA", unidad);
    case 4:
      return DecenasY("CUARENTA", unidad);
    case 5:
      return DecenasY("CINCUENTA", unidad);
    case 6:
      return DecenasY("SESENTA", unidad);
    case 7:
      return DecenasY("SETENTA", unidad);
    case 8:
      return DecenasY("OCHENTA", unidad);
    case 9:
      return DecenasY("NOVENTA", unidad);
    case 0:
      return Unidades(unidad);
  }
  return "";
}

function DecenasY(strSin: string, numUnidades: number): string {
  if (numUnidades > 0) return strSin + " Y " + Unidades(numUnidades);
  return strSin;
}

function Centenas(num: number): string {
  const centenas = Math.floor(num / 100);
  const decenas = num % 100;

  switch (centenas) {
    case 1:
      if (decenas > 0) return "CIENTO " + Decenas(decenas);
      return "CIEN";
    case 2:
      return "DOSCIENTOS " + Decenas(decenas);
    case 3:
      return "TRESCIENTOS " + Decenas(decenas);
    case 4:
      return "CUATROCIENTOS " + Decenas(decenas);
    case 5:
      return "QUINIENTOS " + Decenas(decenas);
    case 6:
      return "SEISCIENTOS " + Decenas(decenas);
    case 7:
      return "SETECIENTOS " + Decenas(decenas);
    case 8:
      return "OCHOCIENTOS " + Decenas(decenas);
    case 9:
      return "NOVECIENTOS " + Decenas(decenas);
  }
  return Decenas(decenas);
}

function Seccion(num: number, divisor: number, strSingular: string, strPlural: string): string {
  const cientos = Math.floor(num / divisor);
  const resto = num % divisor;

  let letras = "";

  if (cientos > 0) {
    if (cientos > 1) letras = Centenas(cientos) + " " + strPlural;
    else letras = strSingular;
  }

  if (resto > 0) letras += " ";

  return letras;
}

function Miles(num: number): string {
  const divisor = 1000;
  const cientos = Math.floor(num / divisor);
  const resto = num % divisor;

  const strMiles = Seccion(num, divisor, "UN MIL", "MIL");
  const strCentenas = Centenas(resto);

  if (strMiles === "") return strCentenas;
  return (strMiles + " " + strCentenas).replace(/\s+/g, " ");
}

function Millones(num: number): string {
  const divisor = 1000000;
  const cientos = Math.floor(num / divisor);
  const resto = num % divisor;

  const strMillones = Seccion(num, divisor, "UN MILLON", "MILLONES");
  const strMiles = Miles(resto);

  if (strMillones === "") return strMiles;
  return (strMillones + " " + strMiles).replace(/\s+/g, " ");
}

export function numeroALetras(monto: number): string {
  if (isNaN(monto) || monto < 0) return "SON: CERO 00/100 BOLIVIANOS";

  const entero = Math.floor(monto);
  const centavos = Math.round((monto - entero) * 100);
  const strCentavos = centavos < 10 ? `0${centavos}` : `${centavos}`;

  let textoEntero = "";
  if (entero === 0) {
    textoEntero = "CERO";
  } else {
    textoEntero = Millones(entero).trim().replace(/\s+/g, " ");
  }

  return `SON: ${textoEntero} ${strCentavos}/100 BOLIVIANOS`;
}

/**
 * Calcula la fecha límite de entrega respetando las reglas de la UMSS:
 * - Bienes (ORDEN_COMPRA): Emisión + días (contabilizado a partir del día siguiente)
 * - Servicios (ORDEN_SERVICIO): Emisión + días - 1 (incluyendo el mismo día de emisión)
 * - Contrato (> 15 días): Emisión + días
 */
export function calcularFechaLimiteEntrega(
  fechaEmisionIso: string,
  diasEntrega: number,
  tipoDocumento: "ORDEN_COMPRA" | "ORDEN_SERVICIO" | "CONTRATO"
): { fechaIso: string; fechaFormateada: string } {
  let date: Date;

  if (fechaEmisionIso.includes("T")) {
    const parts = fechaEmisionIso.split("T")[0].split("-");
    if (parts.length === 3) {
      date = new Date(
        parseInt(parts[0], 10),
        parseInt(parts[1], 10) - 1,
        parseInt(parts[2], 10),
        12,
        0,
        0
      );
    } else {
      date = new Date(fechaEmisionIso);
    }
  } else {
    const parts = fechaEmisionIso.split("-");
    if (parts.length === 3) {
      date = new Date(
        parseInt(parts[0], 10),
        parseInt(parts[1], 10) - 1,
        parseInt(parts[2], 10),
        12,
        0,
        0
      );
    } else {
      date = new Date(fechaEmisionIso);
    }
  }

  if (isNaN(date.getTime())) {
    date = new Date();
  }

  let diasSumar = diasEntrega;

  // Si es Orden de Servicio, cuenta incluyendo el mismo día de emisión
  if (tipoDocumento === "ORDEN_SERVICIO" && diasEntrega > 0) {
    diasSumar = Math.max(1, diasEntrega - 1);
  }

  date.setDate(date.getDate() + diasSumar);

  const day = date.getDate();
  const monthNames = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  const monthName = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return {
    fechaIso: date.toISOString(),
    fechaFormateada: `${day} de ${monthName.charAt(0).toUpperCase() + monthName.slice(1)}, ${year}`,
  };
}
