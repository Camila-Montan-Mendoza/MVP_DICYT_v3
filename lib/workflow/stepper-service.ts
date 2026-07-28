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

export interface AccionTransicion {
  idTransicion: number;
  nombreAccion: string;
  idEstadoDestino: number;
}

export interface TareaWorkflow {
  id: string;
  pasoId: string;
  nombre: string;
  /** Rol institucional esperado para esta tarea (de rol_estado_paso_flujo) */
  rolEsperado: string;
  /** Nombre de usuario real que completó o está completando esta tarea */
  usuarioAsignado: string;
  /** Rol real del usuario responsable (de rol_usuario) */
  rolResponsable: string;
  estado: "COMPLETADO" | "EN_CURSO" | "PENDIENTE" | "RECHAZADO";
  fechaCompletado?: string;
  /** Acciones/transiciones disponibles que se pueden ejecutar desde esta tarea */
  accionesDisponibles?: AccionTransicion[];
}

export interface DetalleTramiteWorkflow {
  id: string;
  nroTramite: string;
  proyectoNombre: string;
  solicitanteNombre: string;
  pasos: PasoWorkflow[];
  tareas: TareaWorkflow[];
}
