import {
  ModificacionPresupuestaria,
  CrearModificacionPayload,
  EstadoModificacion,
} from "../types/modificacion";

const STORAGE_KEY = "sigefi_mock_modificaciones_v1";

const INITIAL_MOCK_MODIFICACIONES: ModificacionPresupuestaria[] = [
  {
    id: "mod-0089",
    codigoTramite: "#TR-2026-0089",
    proyectoId: 2,
    proyectoNombre: "Implementación de Inteligencia Artificial en Procesos Agrícolas",
    proyectoCodigo: "PT09FC001",
    solicitanteId: 1,
    solicitanteNombre: "Ing. Iván Méndez Velásquez",
    fecha: "2026-07-28",
    estado: "PENDIENTE",
    totalQuitado: 700.0,
    totalAumentado: 700.0,
    balance: 0.0,
    partidasAfectadas: [
      {
        id: "m-1",
        partidaId: 31120,
        codigo: "31120",
        descripcion: "Alimentación y Similares",
        saldoActual: 2115.32,
        monto: 200.0,
        tipo: "QUITAR",
      },
      {
        id: "m-2",
        partidaId: 32300,
        codigo: "32300",
        descripcion: "Libros y Manuales",
        saldoActual: 5.0,
        monto: 5.0,
        tipo: "QUITAR",
      },
      {
        id: "m-3",
        partidaId: 34600,
        codigo: "34600",
        descripcion: "Productos Metálicos",
        saldoActual: 190.0,
        monto: 100.0,
        tipo: "QUITAR",
      },
      {
        id: "m-4",
        partidaId: 39700,
        codigo: "39700",
        descripcion: "Material Eléctrico",
        saldoActual: 8.0,
        monto: 8.0,
        tipo: "QUITAR",
      },
      {
        id: "m-5",
        partidaId: 22120,
        codigo: "22120",
        descripcion: "Pasajes Exterior",
        saldoActual: 1020.0,
        monto: 387.0,
        tipo: "QUITAR",
      },
    ],
    partidasBeneficiadas: [
      {
        id: "m-6",
        partidaId: 39100,
        codigo: "39100",
        descripcion: "Material de Limpieza",
        saldoActual: 1000.0,
        monto: 200.0,
        tipo: "AUMENTAR",
      },
      {
        id: "m-7",
        partidaId: 39800,
        codigo: "39800",
        descripcion: "Repuestos y Accesorios",
        saldoActual: 1000.0,
        monto: 150.0,
        tipo: "AUMENTAR",
      },
      {
        id: "m-8",
        partidaId: 22110,
        codigo: "22110",
        descripcion: "Pasajes Interior",
        saldoActual: 2240.24,
        monto: 250.0,
        tipo: "AUMENTAR",
      },
      {
        id: "m-9",
        partidaId: 22210,
        codigo: "22210",
        descripcion: "Viáticos Interior",
        saldoActual: 5000.0,
        monto: 99.99,
        tipo: "AUMENTAR",
      },
      {
        id: "m-10",
        partidaId: 23200,
        codigo: "23200",
        descripcion: "Alquiler de equipos",
        saldoActual: 0.01,
        monto: 0.01,
        tipo: "AUMENTAR",
      },
    ],
    justificacionCodigos:
      "De: 31120, 32300, 34600, 39700, 22120 | A: 39100, 39800, 22110, 22210, 23200",
    justificacionTexto:
      "Con estas modificaciones, no se afectarán a los objetivos del proyecto y más bien se dará más incidencia a la difusión de resultados de investigación, permitiendo la adquisición de insumos críticos para la fase experimental y garantizando la movilidad del equipo técnico a las estaciones regionales.",
  },
  {
    id: "mod-0042",
    codigoTramite: "#TR-2026-0042",
    proyectoId: 1,
    proyectoNombre: "Optimización de Algoritmos Eficientes en Redes Hídricas",
    proyectoCodigo: "IDH-2024",
    solicitanteId: 2,
    solicitanteNombre: "Dr. Ricardo Villarroel",
    fecha: "2026-06-14",
    estado: "APROBADO",
    totalQuitado: 1250.0,
    totalAumentado: 1250.0,
    balance: 0.0,
    partidasAfectadas: [
      {
        id: "m-20",
        partidaId: 101,
        codigo: "101",
        descripcion: "Materiales y Suministros",
        saldoActual: 1500.0,
        monto: 1250.0,
        tipo: "QUITAR",
      },
    ],
    partidasBeneficiadas: [
      {
        id: "m-21",
        partidaId: 301,
        codigo: "301",
        descripcion: "Equipamiento de Laboratorio",
        saldoActual: 5000.0,
        monto: 1250.0,
        tipo: "AUMENTAR",
      },
    ],
    justificacionCodigos: "De: 101 | A: 301",
    justificacionTexto:
      "Traspaso de fondos no ejecutados de materiales para reforzar la adquisición de sensores especializados.",
    fechaAprobacion: "2026-06-16",
  },
];

class MockModificacionService {
  private memoryCache: ModificacionPresupuestaria[] | null = null;

  private loadStore(): ModificacionPresupuestaria[] {
    if (this.memoryCache) return this.memoryCache;

    if (typeof window === "undefined") {
      return INITIAL_MOCK_MODIFICACIONES;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.memoryCache = JSON.parse(stored);
        return this.memoryCache!;
      }
    } catch {
      // Fallback on parse error
    }

    this.memoryCache = INITIAL_MOCK_MODIFICACIONES;
    this.saveStore(this.memoryCache);
    return this.memoryCache;
  }

  private saveStore(items: ModificacionPresupuestaria[]) {
    this.memoryCache = items;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch {
        // Fallback on storage write error
      }
    }
  }

  public getModificaciones(): ModificacionPresupuestaria[] {
    return this.loadStore();
  }

  public getModificacionById(id: string): ModificacionPresupuestaria | null {
    const items = this.loadStore();
    return items.find((m) => m.id === id || m.codigoTramite === id) || null;
  }

  public crearModificacion(payload: CrearModificacionPayload): ModificacionPresupuestaria {
    const items = this.loadStore();
    const nextNum = items.length + 90;
    const codigoTramite = `#TR-2026-0${nextNum}`;
    const id = `mod-${nextNum}`;

    const totalQuitado = payload.partidasAfectadas.reduce((sum, item) => sum + item.monto, 0);
    const totalAumentado = payload.partidasBeneficiadas.reduce((sum, item) => sum + item.monto, 0);

    const codigosDe = payload.partidasAfectadas.map((p) => p.codigo).join(", ");
    const codigosA = payload.partidasBeneficiadas.map((p) => p.codigo).join(", ");
    const justificacionCodigos = `De: ${codigosDe || "N/A"} | A: ${codigosA || "N/A"}`;

    const newModificacion: ModificacionPresupuestaria = {
      id,
      codigoTramite,
      proyectoId: payload.proyectoId,
      proyectoNombre: payload.proyectoNombre || "Investigación y Desarrollo Tecnológico 2024",
      proyectoCodigo: payload.proyectoCodigo || "PT09FC001",
      solicitanteId: 1,
      solicitanteNombre: payload.solicitanteNombre || "Ing. Iván Méndez Velásquez",
      fecha: new Date().toISOString().split("T")[0],
      estado: "PENDIENTE",
      totalQuitado,
      totalAumentado,
      balance: Math.abs(totalQuitado - totalAumentado),
      partidasAfectadas: payload.partidasAfectadas,
      partidasBeneficiadas: payload.partidasBeneficiadas,
      justificacionCodigos,
      justificacionTexto: payload.justificacionTexto,
    };

    items.unshift(newModificacion);
    this.saveStore(items);
    return newModificacion;
  }

  public evaluarModificacion(
    id: string,
    estado: EstadoModificacion
  ): ModificacionPresupuestaria | null {
    const items = this.loadStore();
    const mod = items.find((m) => m.id === id || m.codigoTramite === id);
    if (!mod) return null;

    mod.estado = estado;
    if (estado === "APROBADO") {
      mod.fechaAprobacion = new Date().toISOString().split("T")[0];
    }
    this.saveStore(items);
    return mod;
  }
}

export const mockModificacionService = new MockModificacionService();
