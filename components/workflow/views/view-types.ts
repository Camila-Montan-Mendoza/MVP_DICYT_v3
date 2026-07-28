import { TareaWorkflow } from "@/lib/workflow/stepper-service";
import { TramiteDBItem } from "@/lib/db/tramite-repository";

/**
 * Props que reciben TODOS los componentes de vista de tarea.
 * El registry ya resolvió la dimensión active/passive,
 * por lo que no se incluye `isMeAction`.
 */
export interface TaskViewProps {
  tarea: TareaWorkflow;
  tramite: TramiteDBItem;
  currentUser: string;
  currentRole: string;
  onActionSuccess?: () => void;
  /** Helper para ejecutar transiciones/acciones de workflow desde la vista */
  ejecutarTransicion?: (
    idTransicion: number,
    observaciones?: string,
    datosExtra?: Record<string, any>
  ) => Promise<{ success: boolean; message?: string }>;
}
