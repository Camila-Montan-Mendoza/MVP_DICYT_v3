# Data Model: Visualización del Flujo de Pasos y Tareas del Trámite (Workflow Stepper)

**Feature Branch**: `003-workflow-stepper-tramite`  
**Date**: 2026-07-27

---

## Entities

### `PasoWorkflow` (Macro Level Step)

```typescript
export interface PasoWorkflow {
  id: string;
  numero: number;
  nombre: string; // e.g. "Solicitud", "Recepción", "Pago", "Completado"
  estado: "COMPLETADO" | "EN_CURSO" | "PENDIENTE";
}
```

### `TareaWorkflow` (Granular Level Task)

```typescript
export interface TareaWorkflow {
  id: string;
  pasoId: string;
  nombre: string; // e.g. "Formulación de Requerimiento"
  rolResponsable: string; // e.g. "Investigador Principal", "Compras y Contrataciones"
  usuarioAsignado: string; // e.g. "Marcelino Perez", "Grober Villarroel Flores"
  estado: "COMPLETADO" | "EN_CURSO" | "PENDIENTE";
  fechaCompletado?: string; // e.g. "11 Ene 2026 - 09:15"
}
```

### `DetalleTramiteWorkflow`

```typescript
export interface DetalleTramiteWorkflow {
  id: string;
  nroTramite: string; // e.g. "TR-2026-001"
  proyectoNombre: string; // e.g. "Implementación de IA para la Agricultura"
  solicitanteNombre: string; // e.g. "Dr. Marcelino Pérez"
  pasos: PasoWorkflow[];
  tareas: TareaWorkflow[];
}
```
