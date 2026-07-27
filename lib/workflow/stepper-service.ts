export interface PasoWorkflow {
  id: string;
  numero: number;
  nombre: string;
  estado: "COMPLETADO" | "EN_CURSO" | "PENDIENTE";
}

export interface TareaWorkflow {
  id: string;
  pasoId: string;
  nombre: string;
  rolResponsable: string;
  usuarioAsignado: string;
  estado: "COMPLETADO" | "EN_CURSO" | "PENDIENTE";
  fechaCompletado?: string;
}

export interface DetalleTramiteWorkflow {
  id: string;
  nroTramite: string;
  proyectoNombre: string;
  solicitanteNombre: string;
  pasos: PasoWorkflow[];
  tareas: TareaWorkflow[];
}

export const MOCK_WORKFLOW_DETAIL: DetalleTramiteWorkflow = {
  id: "tr-001",
  nroTramite: "TR-2026-001",
  proyectoNombre: "Implementación de IA para la Agricultura",
  solicitanteNombre: "Dr. Marcelino Pérez",
  pasos: [
    { id: "p1", numero: 1, nombre: "Solicitud", estado: "COMPLETADO" },
    { id: "p2", numero: 2, nombre: "Recepcion", estado: "EN_CURSO" },
    { id: "p3", numero: 3, nombre: "Pago", estado: "PENDIENTE" },
    { id: "p4", numero: 4, nombre: "Completado", estado: "PENDIENTE" },
  ],
  tareas: [
    // Tareas del Paso 1: Solicitud
    {
      id: "t1-1",
      pasoId: "p1",
      nombre: "Formulación de Requerimiento",
      rolResponsable: "Investigador Principal",
      usuarioAsignado: "Marcelino Perez",
      estado: "COMPLETADO",
      fechaCompletado: "10 Ene 2026 - 14:30",
    },
    {
      id: "t1-2",
      pasoId: "p1",
      nombre: "Verificación de Certificación Presupuestaria",
      rolResponsable: "Presupuestos y Finanzas",
      usuarioAsignado: "Fernando Ramirez",
      estado: "COMPLETADO",
      fechaCompletado: "10 Ene 2026 - 16:45",
    },
    // Tareas del Paso 2: Recepcion
    {
      id: "t2-1",
      pasoId: "p2",
      nombre: "Revisión Técnica de Insumos",
      rolResponsable: "Compras y Contrataciones",
      usuarioAsignado: "Grober Villarroel Flores",
      estado: "COMPLETADO",
      fechaCompletado: "11 Ene 2026 - 09:15",
    },
    {
      id: "t2-2",
      pasoId: "p2",
      nombre: "Acta de Recepción y Conformidad",
      rolResponsable: "Investigador Principal",
      usuarioAsignado: "Marcelino Perez",
      estado: "EN_CURSO",
    },
    {
      id: "t2-3",
      pasoId: "p2",
      nombre: "Ingreso a Almacén e Inventario",
      rolResponsable: "Encargado de Activos",
      usuarioAsignado: "Daniel Flores",
      estado: "PENDIENTE",
    },
    // Tareas del Paso 3: Pago
    {
      id: "t3-1",
      pasoId: "p3",
      nombre: "Emisión de Nota de Pago al Proveedor",
      rolResponsable: "Tesorería DICYT",
      usuarioAsignado: "Elena Rodriguez",
      estado: "PENDIENTE",
    },
  ],
};

export function getTramiteWorkflowDetail(id: string): DetalleTramiteWorkflow {
  return {
    ...MOCK_WORKFLOW_DETAIL,
    id: id || "tr-001",
    nroTramite: id ? `TR-2026-${id.replace("tr-", "").padStart(3, "0")}` : "TR-2026-001",
  };
}
