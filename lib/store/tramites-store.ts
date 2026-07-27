"use client";

export interface ItemTramiteStore {
  id: string;
  nombre: string;
  categoria: "ACTIVO_FIJO" | "MATERIAL" | "SERVICIO";
  cantidad: number;
  precioReferencial: number;
  especificacionesTecnicasTexto?: string;
  detalleServicio?: string;
  partidaPresupuestaria: string;
  partidaNombre?: string;
  documentotecnicoNombre?: string;
}

export interface PasoStore {
  id: string;
  numero: number;
  nombre: string;
  estado: "COMPLETADO" | "EN_CURSO" | "PENDIENTE";
}

export interface TareaStore {
  id: string;
  pasoId: string;
  nombre: string;
  rolResponsable: string;
  usuarioAsignado: string;
  estado: "COMPLETADO" | "EN_CURSO" | "PENDIENTE";
  fechaCompletado?: string;
}

export interface SelloPreventivoStore {
  correlativo: string;
  fechaEmision: string;
  usuarioAprobador: string;
  estado: "APROBADO" | "OBSERVADO";
  observaciones?: string;
}

export interface TramiteStoreItem {
  id: string;
  nro: string;
  codigoSeguimiento: string;
  proyecto: string;
  tipoTramite: string; // e.g. "Solicitud de Materiales", "Solicitud de Servicio", "Solicitud de Activo Fijo", "Fondo Rotatorio"
  categoria: "ACTIVO_FIJO" | "MATERIAL" | "SERVICIO" | "OTROS";
  fecha: string;
  fechaISO: string;
  creador: string;
  justificacion: string;
  custodioNombre?: string;
  custodioUbicacion?: string;
  proformas: Array<{ id: string; nombre: string }>;
  items: ItemTramiteStore[];
  pasos: PasoStore[];
  tareas: TareaStore[];
  selloPreventivo?: SelloPreventivoStore;
  estado: "Borrador" | "Pendiente" | "En proceso" | "Observado por Presupuestos" | "Aprobado" | "Rechazado";
  requiereAccion: boolean;
}

const STORAGE_KEY = "sigefi_dicyt_tramites_v1";

// Initial seed dataset for demo
const INITIAL_SEEDS: TramiteStoreItem[] = [
  {
    id: "tr-2026-001",
    nro: "01",
    codigoSeguimiento: "TR-2026-001",
    proyecto: "Implementación de IA para la Agricultura",
    tipoTramite: "Solicitud de Activo Fijo",
    categoria: "ACTIVO_FIJO",
    fecha: "15 Ene 2026",
    fechaISO: "2026-01-15",
    creador: "Dr. Marcelino Pérez",
    justificacion: "Adquisición de servidor GPU y kit de sensores agrícolas para procesamiento de modelos de cultivo.",
    custodioNombre: "Dr. Marcelino Pérez",
    custodioUbicacion: "Laboratorio de Inteligencia Artificial - Edificio DICYT",
    proformas: [{ id: "p1", nombre: "Cotizacion_TechSol_GPU.pdf" }],
    items: [
      {
        id: "it-1",
        nombre: "IMPRESORA LÁSER DE ALTA VELOCIDAD",
        categoria: "ACTIVO_FIJO",
        cantidad: 1,
        precioReferencial: 4500,
        especificacionesTecnicasTexto: "Impresora láser monocromática duplex con conectividad de red institucional.",
        partidaPresupuestaria: "43120",
        partidaNombre: "Equipo de Computación",
      },
    ],
    pasos: [
      { id: "p1", numero: 1, nombre: "Solicitud", estado: "COMPLETADO" },
      { id: "p2", numero: 2, nombre: "Presupuesto", estado: "EN_CURSO" },
      { id: "p3", numero: 3, nombre: "Recepción", estado: "PENDIENTE" },
      { id: "p4", numero: 4, nombre: "Completado", estado: "PENDIENTE" },
    ],
    tareas: [
      {
        id: "t1",
        pasoId: "p1",
        nombre: "Formulación de Requerimiento",
        rolResponsable: "Investigador Principal",
        usuarioAsignado: "Marcelino Perez",
        estado: "COMPLETADO",
        fechaCompletado: "15 Ene 2026 - 10:30",
      },
      {
        id: "t2",
        pasoId: "p2",
        nombre: "Sello Preventivo y Certificación de Saldos",
        rolResponsable: "Responsable de Presupuestos",
        usuarioAsignado: "Alan",
        estado: "EN_CURSO",
      },
      {
        id: "t3",
        pasoId: "p3",
        nombre: "Revisión Técnica e Ingreso de Bienes",
        rolResponsable: "Compras y Contrataciones",
        usuarioAsignado: "Grober Villarroel",
        estado: "PENDIENTE",
      },
    ],
    estado: "Pendiente",
    requiereAccion: true,
  },
  {
    id: "tr-2026-002",
    nro: "02",
    codigoSeguimiento: "TR-2026-002",
    proyecto: "VLIR RAWSAYTA AWANACHEJ",
    tipoTramite: "Solicitud de Materiales",
    categoria: "MATERIAL",
    fecha: "18 Ene 2026",
    fechaISO: "2026-01-18",
    creador: "Elena Rodriguez",
    justificacion: "Reactivos químicos y reactores de cristal para ensayos bioquímicos.",
    proformas: [{ id: "p2", nombre: "Proforma_Reactivos_Lab.pdf" }],
    items: [
      {
        id: "it-2",
        nombre: "REACTIVOS DE EXTRACTO BOTÁNICO",
        categoria: "MATERIAL",
        cantidad: 5,
        precioReferencial: 1200,
        especificacionesTecnicasTexto: "Reactivos grado analítico HPLC para extracción de aceites esenciales.",
        partidaPresupuestaria: "34200",
        partidaNombre: "Productos Químicos y Farmacéuticos",
      },
    ],
    pasos: [
      { id: "p1", numero: 1, nombre: "Solicitud", estado: "COMPLETADO" },
      { id: "p2", numero: 2, nombre: "Presupuesto", estado: "COMPLETADO" },
      { id: "p3", numero: 3, nombre: "Recepción", estado: "EN_CURSO" },
      { id: "p4", numero: 4, nombre: "Completado", estado: "PENDIENTE" },
    ],
    tareas: [
      {
        id: "t1",
        pasoId: "p1",
        nombre: "Formulación de Requerimiento",
        rolResponsable: "Investigador Principal",
        usuarioAsignado: "Elena Rodriguez",
        estado: "COMPLETADO",
        fechaCompletado: "18 Ene 2026 - 09:15",
      },
      {
        id: "t2",
        pasoId: "p2",
        nombre: "Aprobación de Sello Preventivo",
        rolResponsable: "Responsable de Presupuestos",
        usuarioAsignado: "Alan",
        estado: "COMPLETADO",
        fechaCompletado: "18 Ene 2026 - 11:40",
      },
      {
        id: "t3",
        pasoId: "p3",
        nombre: "Acta de Recepción e Conformidad",
        rolResponsable: "Compras y Contrataciones",
        usuarioAsignado: "Grober Villarroel",
        estado: "EN_CURSO",
      },
    ],
    selloPreventivo: {
      correlativo: "PREV-2026-00184",
      fechaEmision: "2026-01-18T11:40:00Z",
      usuarioAprobador: "Alan - Resp. Presupuestos",
      estado: "APROBADO",
    },
    estado: "En proceso",
    requiereAccion: false,
  },
  {
    id: "tr-2026-003",
    nro: "03",
    codigoSeguimiento: "TR-2026-003",
    proyecto: "Sistema de Riego Inteligente",
    tipoTramite: "Solicitud de Servicio",
    categoria: "SERVICIO",
    fecha: "22 Ene 2026",
    fechaISO: "2026-01-22",
    creador: "Jorge Villarroel",
    justificacion: "Servicio especializado de auditoría técnica y mantenimiento de electroválvulas.",
    proformas: [{ id: "p3", nombre: "Cotización_Servicio_Riego.pdf" }],
    items: [
      {
        id: "it-3",
        nombre: "SERVICIO DE AUDITORÍA EXTERNA Y MANTENIMIENTO",
        categoria: "SERVICIO",
        cantidad: 1,
        precioReferencial: 3000,
        detalleServicio: "Mantenimiento preventivo y calibración de caudalímetros.",
        partidaPresupuestaria: "25230",
        partidaNombre: "Auditorías Especiales y Externas",
        documentotecnicoNombre: "TDR_Servicio_Auditoria_Riego.pdf",
      },
    ],
    pasos: [
      { id: "p1", numero: 1, nombre: "Solicitud", estado: "COMPLETADO" },
      { id: "p2", numero: 2, nombre: "Presupuesto", estado: "COMPLETADO" },
      { id: "p3", numero: 3, nombre: "Recepción", estado: "COMPLETADO" },
      { id: "p4", numero: 4, nombre: "Completado", estado: "COMPLETADO" },
    ],
    tareas: [
      {
        id: "t1",
        pasoId: "p1",
        nombre: "Formulación de Requerimiento",
        rolResponsable: "Investigador Principal",
        usuarioAsignado: "Jorge Villarroel",
        estado: "COMPLETADO",
        fechaCompletado: "22 Ene 2026 - 15:20",
      },
      {
        id: "t2",
        pasoId: "p4",
        nombre: "Trámite Finalizado Exitosamente",
        rolResponsable: "Sistema SIGEFI",
        usuarioAsignado: "Sistema",
        estado: "COMPLETADO",
        fechaCompletado: "24 Ene 2026 - 17:00",
      },
    ],
    selloPreventivo: {
      correlativo: "PREV-2026-00201",
      fechaEmision: "2026-01-23T10:15:00Z",
      usuarioAprobador: "Alan - Resp. Presupuestos",
      estado: "APROBADO",
    },
    estado: "Aprobado",
    requiereAccion: false,
  },
];

class TramiteStoreManager {
  private getLocalItems(): TramiteStoreItem[] {
    if (typeof window === "undefined") return INITIAL_SEEDS;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEEDS));
        return INITIAL_SEEDS;
      }
      return JSON.parse(saved);
    } catch {
      return INITIAL_SEEDS;
    }
  }

  private saveLocalItems(items: TramiteStoreItem[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Error saving tramites store to localStorage", e);
    }
  }

  public getTramites(): TramiteStoreItem[] {
    return this.getLocalItems();
  }

  public getTramiteById(id: string): TramiteStoreItem | undefined {
    const items = this.getLocalItems();
    return (
      items.find((t) => t.id === id || t.codigoSeguimiento === id) ||
      items.find((t) => t.nro === id) ||
      items[0]
    );
  }

  public addTramites(newItems: TramiteStoreItem[]): void {
    const current = this.getLocalItems();
    const updated = [...newItems, ...current];
    this.saveLocalItems(updated);
  }

  public approvePreventivo(
    id: string,
    sello: SelloPreventivoStore,
    approverName: string = "Alan"
  ): TramiteStoreItem | undefined {
    const current = this.getLocalItems();
    const updated = current.map((t) => {
      if (t.id === id || t.codigoSeguimiento === id) {
        const updatedPasos: PasoStore[] = t.pasos.map((p) => {
          if (p.numero === 2) return { ...p, estado: "COMPLETADO" as const };
          if (p.numero === 3) return { ...p, estado: "EN_CURSO" as const };
          return p;
        });

        const updatedTareas: TareaStore[] = t.tareas.map((tar) => {
          if (tar.pasoId === "p2" || tar.nombre.includes("Preventivo")) {
            return {
              ...tar,
              estado: "COMPLETADO" as const,
              fechaCompletado: new Date().toLocaleString("es-BO"),
            };
          }
          if (tar.pasoId === "p3") {
            return { ...tar, estado: "EN_CURSO" as const };
          }
          return tar;
        });

        return {
          ...t,
          selloPreventivo: sello,
          pasos: updatedPasos,
          tareas: updatedTareas,
          estado: "En proceso" as const,
          requiereAccion: false,
        };
      }
      return t;
    });

    this.saveLocalItems(updated);
    return updated.find((t) => t.id === id || t.codigoSeguimiento === id);
  }

  public rejectTramite(
    id: string,
    observacion: string,
    rejectorName: string = "Alan"
  ): TramiteStoreItem | undefined {
    const current = this.getLocalItems();
    const updated = current.map((t) => {
      if (t.id === id || t.codigoSeguimiento === id) {
        return {
          ...t,
          selloPreventivo: {
            correlativo: "NO_EMITIDO",
            fechaEmision: new Date().toISOString(),
            usuarioAprobador: rejectorName,
            estado: "OBSERVADO" as const,
            observaciones: observacion,
          },
          estado: "Observado por Presupuestos" as const,
          requiereAccion: true,
        };
      }
      return t;
    });

    this.saveLocalItems(updated);
    return updated.find((t) => t.id === id || t.codigoSeguimiento === id);
  }
}

export const tramitesStore = new TramiteStoreManager();
