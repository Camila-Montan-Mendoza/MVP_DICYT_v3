import { PartidaCatalogo, PartidaMemoriaCalculo, ProyectoDetalle } from "../types";

const STORAGE_KEY = "sigefi_mock_proyecto_";

export const CATALOGO_PARTIDAS_SEED: PartidaCatalogo[] = [
  { id: 101, codigo: "101", nombre: "Materiales y Suministros", itemsRelacionados: ["papeleria", "escritorio", "suministros", "hojas"] },
  { id: 205, codigo: "205", nombre: "Servicios Técnicos Profesionales", itemsRelacionados: ["consultoria", "servicios", "honorarios", "desarrollo"] },
  { id: 301, codigo: "301", nombre: "Equipamiento de Laboratorio", itemsRelacionados: ["equipos", "microscopio", "centrifuga", "gpu", "hardware", "servidores"] },
  { id: 405, codigo: "405", nombre: "Insumos Químicos", itemsRelacionados: ["reactivos", "adn", "insumos", "laboratorio", "quimica"] },
  { id: 512, codigo: "512", nombre: "Capacitación Técnica", itemsRelacionados: ["talleres", "cursos", "formacion", "capacitacion", "seminarios"] },
  { id: 601, codigo: "601", nombre: "Impresiones y Publicaciones", itemsRelacionados: ["banners", "afiches", "folletos", "libros", "publicaciones"] },
  { id: 702, codigo: "702", nombre: "Pasajes y Viáticos", itemsRelacionados: ["viajes", "transporte", "pasajes", "hotel", "viaticos"] },
];

export const MOCK_PROYECTOS_SEED: Record<number, ProyectoDetalle> = {
  1: {
    id: 1,
    nombre: "Implementación de Inteligencia Artificial en Procesos Agrícolas",
    presupuestoTotal: 100000,
    programa: "Innovación Tecnológica 2024",
    fuenteFinanciamiento: "Recursos Propios IDH",
    fechaInicio: "15/01/2024",
    fechaFin: "15/07/2025",
    estado: {
      id: 1,
      nombre: "Memoria de cálculo pendiente",
    },
    investigadorPrincipal: {
      id: 1,
      nombre: "Dr. Ricardo Villarroel",
    },
    memoriaCalculo: [
      { id: 101, codigoPartida: "101", nombrePartida: "Materiales y Suministros", monto: 45000 },
      { id: 205, codigoPartida: "205", nombrePartida: "Servicios Técnicos Profesionales", monto: 55000 },
      { id: 301, codigoPartida: "301", nombrePartida: "Equipamiento de Laboratorio", monto: 25000 },
      { id: 405, codigoPartida: "405", nombrePartida: "Insumos Químicos", monto: 15000 },
      { id: 512, codigoPartida: "512", nombrePartida: "Capacitación Técnica", monto: 10000 },
    ],
    totalMemoriaCalculo: 150000,
    permisos: {
      puedeDetallarMemoria: true,
      puedeEvaluar: false,
      soloLectura: false,
    },
  },
  2: {
    id: 2,
    nombre: "Desarrollo de Biotecnología para Variedades Resilientes de Trigo",
    presupuestoTotal: 150000,
    programa: "Biotecnología Agrícola 2024",
    fuenteFinanciamiento: "Convenio ASDI / ARES",
    fechaInicio: "01/02/2024",
    fechaFin: "30/11/2025",
    estado: {
      id: 2,
      nombre: "En revisión de memoria de cálculo",
    },
    investigadorPrincipal: {
      id: 2,
      nombre: "Dr. Daniel Pérez",
    },
    memoriaCalculo: [
      { id: 101, codigoPartida: "101", nombrePartida: "Materiales y Suministros", monto: 35000 },
      { id: 205, codigoPartida: "205", nombrePartida: "Servicios Técnicos Profesionales", monto: 40000 },
      { id: 301, codigoPartida: "301", nombrePartida: "Equipamiento de Laboratorio", monto: 50000 },
      { id: 405, codigoPartida: "405", nombrePartida: "Insumos Químicos", monto: 25000 },
    ],
    totalMemoriaCalculo: 150000,
    permisos: {
      puedeDetallarMemoria: false,
      puedeEvaluar: true,
      soloLectura: false,
    },
  },
  3: {
    id: 3,
    nombre: "Monitoreo Satelital de Cuencas Hidrográficas en Cochabamba",
    presupuestoTotal: 200000,
    programa: "Recursos Hídricos 2024",
    fuenteFinanciamiento: "Recursos Propios IDH",
    fechaInicio: "10/03/2024",
    fechaFin: "10/12/2025",
    estado: {
      id: 3,
      nombre: "Observado",
    },
    investigadorPrincipal: {
      id: 3,
      nombre: "Ing. Winsor Soliz",
    },
    memoriaCalculo: [
      { id: 101, codigoPartida: "101", nombrePartida: "Materiales y Suministros", monto: 50000 },
      { id: 301, codigoPartida: "301", nombrePartida: "Equipamiento de Laboratorio", monto: 100000 },
      { id: 702, codigoPartida: "702", nombrePartida: "Pasajes y Viáticos", monto: 30000 },
    ],
    totalMemoriaCalculo: 180000,
    permisos: {
      puedeDetallarMemoria: true,
      puedeEvaluar: false,
      soloLectura: false,
    },
  },
  4: {
    id: 4,
    nombre: "Optimización de Energía Solar para Estaciones Experimentales",
    presupuestoTotal: 80000,
    programa: "Energías Renovables 2024",
    fuenteFinanciamiento: "Fondo TGN",
    fechaInicio: "01/01/2024",
    fechaFin: "31/12/2024",
    estado: {
      id: 4,
      nombre: "Habilitado para ejecutar partidas",
    },
    investigadorPrincipal: {
      id: 4,
      nombre: "Lic. Alan Morales",
    },
    memoriaCalculo: [
      { id: 101, codigoPartida: "101", nombrePartida: "Materiales y Suministros", monto: 20000 },
      { id: 301, codigoPartida: "301", nombrePartida: "Equipamiento de Laboratorio", monto: 60000 },
    ],
    totalMemoriaCalculo: 80000,
    permisos: {
      puedeDetallarMemoria: false,
      puedeEvaluar: false,
      soloLectura: true,
    },
  },
};

export class MockProyectoService {
  public getProyecto(id: number): ProyectoDetalle {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(`${STORAGE_KEY}${id}`);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch {
        // Fallback to in-memory mock
      }
    }

    const template = MOCK_PROYECTOS_SEED[id];
    if (template) {
      return { ...template };
    }

    // Default mock project template adjusted for requested id
    const base = { ...MOCK_PROYECTOS_SEED[1], id };
    base.nombre = `Proyecto de Investigación Nº ${id}`;
    return base;
  }

  public getProyectosList() {
    return Object.values(MOCK_PROYECTOS_SEED).map((p, idx) => ({
      id: p.id,
      numero: idx + 1,
      nombre: p.nombre,
      codigo: `PRJ-2024-00${p.id}`,
      presupuesto: p.presupuestoTotal,
      estado: p.estado,
      investigadorPrincipal: p.investigadorPrincipal,
    }));
  }

  public saveProyecto(proyecto: ProyectoDetalle): void {
    proyecto.totalMemoriaCalculo = proyecto.memoriaCalculo.reduce((acc, item) => acc + (Number(item.monto) || 0), 0);
    
    // Auto-update permissions according to state
    const estadoId = proyecto.estado.id;
    proyecto.permisos = {
      puedeDetallarMemoria: estadoId === 1 || estadoId === 3,
      puedeEvaluar: estadoId === 2,
      soloLectura: estadoId === 4,
    };

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`${STORAGE_KEY}${proyecto.id}`, JSON.stringify(proyecto));
      } catch {
        // Ignore localStorage write failure
      }
    }
  }

  public updateMemoriaCalculo(proyectoId: number, partidas: PartidaMemoriaCalculo[]): ProyectoDetalle {
    const proyecto = this.getProyecto(proyectoId);
    proyecto.memoriaCalculo = partidas;
    this.saveProyecto(proyecto);
    return proyecto;
  }

  public enviarARevision(proyectoId: number): ProyectoDetalle {
    const proyecto = this.getProyecto(proyectoId);
    proyecto.estado = {
      id: 2,
      nombre: "En revisión de memoria de cálculo",
    };
    this.saveProyecto(proyecto);
    return proyecto;
  }

  public evaluarMemoriaCalculo(proyectoId: number, decision: "aprobar" | "observar", observaciones?: string): ProyectoDetalle {
    const proyecto = this.getProyecto(proyectoId);
    if (decision === "aprobar") {
      proyecto.estado = {
        id: 4,
        nombre: "Habilitado para ejecutar partidas",
      };
    } else {
      proyecto.estado = {
        id: 3,
        nombre: "Observado",
      };
    }
    this.saveProyecto(proyecto);
    return proyecto;
  }

  public buscarCatalogoPartidas(query: string): PartidaCatalogo[] {
    const q = query.trim().toLowerCase();
    if (!q) return CATALOGO_PARTIDAS_SEED;

    return CATALOGO_PARTIDAS_SEED.filter(
      (p) =>
        p.codigo.toLowerCase().includes(q) ||
        p.nombre.toLowerCase().includes(q) ||
        p.itemsRelacionados.some((it) => it.toLowerCase().includes(q))
    );
  }
}

export const mockProyectoService = new MockProyectoService();
