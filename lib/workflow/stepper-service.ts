/**
 * Interfaces de contrato para el workflow stepper y la cronología de tareas.
 * NO contiene datos mockeados — todo se carga desde la BD real.
 */

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
