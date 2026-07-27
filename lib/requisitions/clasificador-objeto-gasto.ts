import { ItemCategoria } from "@/types/requisitions";

export interface PartidaObjetoGasto {
  codigo: string; // Código de 5 dígitos más profundo (ej. 34200, 43400, 25230)
  denominacion: string;
  categoria: ItemCategoria;
  descripcion: string;
  ejemplosInsumos: string[];
}

/**
 * Catálogo Oficial del Clasificador por Objeto del Gasto (Versión Descriptiva Ministerio de Economía).
 * Contiene únicamente las partidas de nivel más profundo (5 dígitos) clasificadas estrictamente
 * por tipo de compra: Materiales (30000), Activos Fijos (40000) y Servicios No Personales (20000).
 */
export const CLASIFICADOR_OBJETO_GASTO: PartidaObjetoGasto[] = [
  // ==================== MATERIALES Y SUMINISTROS (Grupo 30000) ====================
  {
    codigo: "34200",
    denominacion: "Productos Químicos y Farmacéuticos",
    categoria: "MATERIAL",
    descripcion: "Compuestos químicos, ácidos, sales, reactivos de laboratorio, reactivos bioquímicos y fertilizantes.",
    ejemplosInsumos: ["Reactivo A para laboratorio", "Ácido Clorhídrico industrial", "Insumos bioquímicos", "Fertilizante agrícola"],
  },
  {
    codigo: "39400",
    denominacion: "Instrumental Menor Médico-Quirúrgico",
    categoria: "MATERIAL",
    descripcion: "Probetas, tubos de ensayo, termómetros, estetoscopios e instrumental menor fungible.",
    ejemplosInsumos: ["Tubos de ensayo de vidrio", "Probeta graduada 500ml", "Pipetas graduadas", "Termómetro digital de laboratorio"],
  },
  {
    codigo: "39500",
    denominacion: "Útiles de Escritorio y Oficina",
    categoria: "MATERIAL",
    descripcion: "Tóner para impresoras, tintas, bolígrafos, papel, carpetas, engrapadoras y perforadoras.",
    ejemplosInsumos: ["Tóner HP LaserJet Pro", "Papel Bond fotocopia A4", "Bolígrafos azules", "Carpetas de archivo"],
  },
  {
    codigo: "39700",
    denominacion: "Útiles y Materiales Eléctricos",
    categoria: "MATERIAL",
    descripcion: "Focos, cables eléctricos, sockets, linternas, baterías, pilas, interruptores y conectores.",
    ejemplosInsumos: ["Cable de red UTP Categoría 6", "Baterías AA recargables", "Conectores RJ45", "Pilas alcalinas 9V"],
  },
  {
    codigo: "34110",
    denominacion: "Combustibles, Lubricantes y Derivados para Consumo",
    categoria: "MATERIAL",
    descripcion: "Gasolina, diésel, aceites, lubricantes y grasa para vehículos del proyecto.",
    ejemplosInsumos: ["Gasolina Especial para vehículo oficial", "Aceite sintético para motor", "Diésel de trabajo"],
  },
  {
    codigo: "34800",
    denominacion: "Herramientas Menores",
    categoria: "MATERIAL",
    descripcion: "Destornilladores, alicates, martillos, tenazas, serruchos, picos y palas no activables.",
    ejemplosInsumos: ["Juego de destornilladores de precisión", "Alicate aislado 1000V", "Multímetro digital de bolsillo"],
  },
  {
    codigo: "39100",
    denominacion: "Material de Limpieza e Higiene",
    categoria: "MATERIAL",
    descripcion: "Detergentes, desinfectantes, alcohol en gel, jabón líquido, paños y cepillos.",
    ejemplosInsumos: ["Alcohol antiséptico 70%", "Detergente enzimático para laboratorio", "Paños de microfibra"],
  },

  // ==================== ACTIVOS REALES / ACTIVOS FIJOS (Grupo 40000) ====================
  {
    codigo: "43400",
    denominacion: "Equipo Médico y de Laboratorio",
    categoria: "ACTIVO_FIJO",
    descripcion: "Microscopios, centrífugas, balanzas de precisión, tomógrafos, espectrofotómetros y autoclaves.",
    ejemplosInsumos: ["Microscopio Binocular Óptico", "Balanza Analítica de Precisión 0.0001g", "Centrífuga de alta velocidad", "Autoclave digital"],
  },
  {
    codigo: "43120",
    denominacion: "Equipo de Computación",
    categoria: "ACTIVO_FIJO",
    descripcion: "Servidores, computadoras de escritorio, laptops de alto rendimiento e impresoras industriales.",
    ejemplosInsumos: ["Servidor GPU para Inteligencia Artificial", "Laptop Workstation i9 64GB RAM", "Computadora de escritorio para desarrollo"],
  },
  {
    codigo: "43500",
    denominacion: "Equipo de Comunicación",
    categoria: "ACTIVO_FIJO",
    descripcion: "Equipos GPS de precisión, Access Points Wi-Fi, antenas, transmisores, cámaras de video y audio.",
    ejemplosInsumos: ["Sensor GPS Diferencial Geodésico", "Access Point Wi-Fi 6 Industrial", "Router Empresarial de Borde"],
  },
  {
    codigo: "43110",
    denominacion: "Equipo de Oficina y Muebles",
    categoria: "ACTIVO_FIJO",
    descripcion: "Escritorios ergónomicos, sillas ejecutivas, estantes metálicos y archivadores.",
    ejemplosInsumos: ["Escritorio modular para laboratorio", "Silla ergonómica de oficina", "Archivador metálico ignífugo"],
  },
  {
    codigo: "43700",
    denominacion: "Otra Maquinaria y Equipo",
    categoria: "ACTIVO_FIJO",
    descripcion: "Refrigeradores industriales para reactivos, extractores de aire, deshumidificadores y cámaras termográficas.",
    ejemplosInsumos: ["Refrigerador especial para conservación de muestras (-20°C)", "Cámara fotográfica termográfica digital", "Deshumidificador industrial"],
  },
  {
    codigo: "49100",
    denominacion: "Activos Intangibles",
    categoria: "ACTIVO_FIJO",
    descripcion: "Licencias de software de propiedad permanente, patentes y aplicaciones informáticas no efímeras.",
    ejemplosInsumos: ["Licencia Perpetua de Software Estadístico", "Licencia de Sistema Operativo Server"],
  },

  // ==================== SERVICIOS NO PERSONALES (Grupo 20000) ====================
  {
    codigo: "25230",
    denominacion: "Auditorías Externas",
    categoria: "SERVICIO",
    descripcion: "Servicios de auditorías financieras y de proyectos de investigación realizadas por firmas externas.",
    ejemplosInsumos: ["Servicio de Auditoría Financiera Externa", "Auditoría de cumplimiento de convenio"],
  },
  {
    codigo: "26700",
    denominacion: "Servicios de Laboratorios Especializados",
    categoria: "SERVICIO",
    descripcion: "Análisis y ensayos especializados de laboratorio contratados a terceros.",
    ejemplosInsumos: ["Servicio de Secuenciación Genética en Laboratorio Externo", "Análisis espectrométrico de muestras suelo"],
  },
  {
    codigo: "24120",
    denominacion: "Mantenimiento y Reparación de Maquinaria y Equipos",
    categoria: "SERVICIO",
    descripcion: "Servicio especializado de calibración, mantenimiento preventivo y correctivo de equipos de investigación.",
    ejemplosInsumos: ["Servicio de Mantenimiento Preventivo de Microscopios", "Calibración anual certificada de balanzas"],
  },
  {
    codigo: "25210",
    denominacion: "Consultorías por Producto",
    categoria: "SERVICIO",
    descripcion: "Estudios e investigaciones específicas por producto entregable contratadas a consultores de terceros.",
    ejemplosInsumos: ["Consultoría para diseño de modelo de Inteligencia Artificial", "Estudio de impacto ambiental"],
  },
  {
    codigo: "21600",
    denominacion: "Internet y Transmisión de Datos",
    categoria: "SERVICIO",
    descripcion: "Servicio de enlace dedicado de internet y transmisión de datos para laboratorios.",
    ejemplosInsumos: ["Servicio de Enlace Dedicado de Internet 100Mbps", "Hospedaje en la nube de servidores"],
  },
  {
    codigo: "25600",
    denominacion: "Servicios de Imprenta, Fotocopiado y Fotográficos",
    categoria: "SERVICIO",
    descripcion: "Servicios de impresión, diagramación, empastado y fotocopiado de guías y reportes de investigación.",
    ejemplosInsumos: ["Servicio de Impresión y Encuadernación de Memorias DICYT", "Fotocopiado de encuestas"],
  },
  {
    codigo: "26300",
    denominacion: "Derechos sobre Bienes Intangibles",
    categoria: "SERVICIO",
    descripcion: "Suscripción anual a licencias de software SaaS y bases de datos científicas.",
    ejemplosInsumos: ["Suscripción Anual a Base de Datos Científica Scopus", "Licencia SaaS de Plataforma Cloud"],
  },
];

/**
 * Busca una partida profunda de 5 dígitos según la descripción e ítem ingresado.
 */
export function buscarPartidaObjetoGasto(texto: string, categoria: ItemCategoria): PartidaObjetoGasto | undefined {
  if (!texto) return undefined;
  const lower = texto.toLowerCase();

  return CLASIFICADOR_OBJETO_GASTO.find((p) => {
    if (p.categoria !== categoria) return false;
    const matchNombre = p.denominacion.toLowerCase().includes(lower);
    const matchEjemplo = p.ejemplosInsumos.some((e) => e.toLowerCase().includes(lower) || lower.includes(e.toLowerCase()));
    return matchNombre || matchEjemplo;
  });
}
