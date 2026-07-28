/**
 * Tipos y contratos para la ejecución de transiciones de workflow y handlers por tarea.
 */

export interface TransitionRequestPayload {
  idTramite: number;
  idTransicion: number;
  observaciones?: string;
  datosExtra?: Record<string, any>;
  usuarioId: number;
}

export interface TransitionHandlerContext {
  tramiteId: number;
  idEstadoOrigen: number;
  idEstadoDestino: number;
  nombreAccion: string;
  usuarioId: number;
  datosExtra?: Record<string, any>;
}

export interface TransitionHandlerResult {
  success: boolean;
  message?: string;
  data?: any;
}

export type TaskTransitionHandler = (
  ctx: TransitionHandlerContext
) => Promise<TransitionHandlerResult>;
