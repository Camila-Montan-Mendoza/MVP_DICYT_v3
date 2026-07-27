export interface TramiteConsolidado {
  id: string;
  nro: string;
  proyecto: string;
  tipoTramite: string;
  fecha: string;
  fechaISO: string;
  pasoActualEtiqueta: string;
  pasoNumero: number;
  pasoTotal: number;
  creador: string;
  requiereAccion: boolean; // true = ATENDER (accion pendiente del usuario actual), false = VER DETALLE
  estadoGeneral: "EN_PROCESO" | "COMPLETADO" | "PENDIENTE_MODIFICACION" | "RECHAZADO";
}

// Initial mock dataset matching the user's official mockup image!
export const MOCK_TRAMITES_CONSOLIDADOS: TramiteConsolidado[] = [
  {
    id: "tr-001",
    nro: "01",
    proyecto: "VLIR RAWSAYTA AWANACHEJ",
    tipoTramite: "Solicitud de Materiales",
    fecha: "15 Oct 2023",
    fechaISO: "2023-10-15",
    pasoActualEtiqueta: "Paso 1/4: Solicitud",
    pasoNumero: 1,
    pasoTotal: 4,
    creador: "Carlos Montaño",
    requiereAccion: true, // Shows ATENDER button
    estadoGeneral: "EN_PROCESO",
  },
  {
    id: "tr-002",
    nro: "02",
    proyecto: "VLIR RAWSAYTA AWANACHEJ",
    tipoTramite: "Solicitud de Servicio",
    fecha: "18 Oct 2023",
    fechaISO: "2023-10-18",
    pasoActualEtiqueta: "Paso 2/4: Recepcion de Material",
    pasoNumero: 2,
    pasoTotal: 4,
    creador: "Elena Rodriguez",
    requiereAccion: true, // Shows ATENDER button
    estadoGeneral: "EN_PROCESO",
  },
  {
    id: "tr-003",
    nro: "01",
    proyecto: "Programa Doctoral Sandwich En Agricultura",
    tipoTramite: "Solicitud de Activo Fijo",
    fecha: "22 Oct 2023",
    fechaISO: "2023-10-22",
    pasoActualEtiqueta: "Paso 4/4: Completado",
    pasoNumero: 4,
    pasoTotal: 4,
    creador: "Jorge Villarroel",
    requiereAccion: false, // Shows VER DETALLE button
    estadoGeneral: "COMPLETADO",
  },
  {
    id: "tr-004",
    nro: "01",
    proyecto: "Investigación Forestal Tropical",
    tipoTramite: "Solicitud de Materiales",
    fecha: "25 Oct 2023",
    fechaISO: "2023-10-25",
    pasoActualEtiqueta: "Paso 3/4: Pago a Proveedor",
    pasoNumero: 3,
    pasoTotal: 4,
    creador: "Elena Rodriguez",
    requiereAccion: false, // Shows VER DETALLE button
    estadoGeneral: "EN_PROCESO",
  },
  {
    id: "tr-005",
    nro: "03",
    proyecto: "Implementacion de IA para la agricultura",
    tipoTramite: "Fondo Rotatorio",
    fecha: "02 Nov 2023",
    fechaISO: "2023-11-02",
    pasoActualEtiqueta: "Paso 1/3: Apertura de Fondo",
    pasoNumero: 1,
    pasoTotal: 3,
    creador: "Marcelino Perez",
    requiereAccion: true,
    estadoGeneral: "EN_PROCESO",
  },
  {
    id: "tr-006",
    nro: "04",
    proyecto: "Implementacion de IA para la agricultura",
    tipoTramite: "Modificación Presupuestaria",
    fecha: "10 Nov 2023",
    fechaISO: "2023-11-10",
    pasoActualEtiqueta: "Paso 2/3: Verificación Financiera",
    pasoNumero: 2,
    pasoTotal: 3,
    creador: "Marcelino Perez",
    requiereAccion: false,
    estadoGeneral: "PENDIENTE_MODIFICACION",
  },
];

// Helper service to query & filter consolidated trámites
export function filterTramitesConsolidados(
  data: TramiteConsolidado[],
  filters: {
    search?: string;
    tipoTramite?: string;
    proyecto?: string;
    pasoActual?: string;
  }
): TramiteConsolidado[] {
  return data.filter((t) => {
    // 1. Text Search (matches proyecto, nro, tipo, creador)
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      const matchSearch =
        t.proyecto.toLowerCase().includes(q) ||
        t.nro.toLowerCase().includes(q) ||
        t.tipoTramite.toLowerCase().includes(q) ||
        t.creador.toLowerCase().includes(q);
      if (!matchSearch) return false;
    }

    // 2. Filter by Tipo de Trámite
    if (filters.tipoTramite && filters.tipoTramite !== "Todos los tipos") {
      if (t.tipoTramite.toLowerCase() !== filters.tipoTramite.toLowerCase()) {
        return false;
      }
    }

    // 3. Filter by Proyecto
    if (filters.proyecto && filters.proyecto !== "Todos los proyectos") {
      if (t.proyecto.toLowerCase() !== filters.proyecto.toLowerCase()) {
        return false;
      }
    }

    // 4. Filter by Paso Actual
    if (filters.pasoActual && filters.pasoActual !== "Cualquier paso") {
      if (!t.pasoActualEtiqueta.toLowerCase().includes(filters.pasoActual.toLowerCase())) {
        return false;
      }
    }

    return true;
  });
}
