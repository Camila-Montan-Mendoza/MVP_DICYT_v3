# API Contract: Expediente Digital y Resumen de Trámite Completado

**Feature**: `013-expediente-digital-resumen-completado`
**Date**: 2026-07-29

## Service Contract (`services/expedienteService.ts`)

```typescript
export interface ArchivoExpedienteData {
  id?: number;
  tramiteId: number;
  nombreArchivo: string;
  urlArchivo: string;
  tipoArchivo: "pdf" | "image" | "doc";
  tamanoFormateado: string;
  categoria?: string;
  fechaCarga?: string;
}

export interface ResumenEjecutivoTramiteData {
  tramiteId: number;
  codigoTramite: string;
  proyectoNombre: string;
  solicitanteNombre: string;
  unidadSolicitante: string;
  montoTotalTramite: number;
  proveedoresAdjudicadosCount: number;
  actasEmitidasCount: number;
  solicitudesPagoCount: number;
  fechaInicio: string;
  fechaCompletado: string;
  expedienteArchivos: ArchivoExpedienteData[];
}

export interface GuardarArchivoExpedienteParams {
  tramiteId: number;
  nombreArchivo: string;
  urlArchivo: string;
  tipoArchivo: "pdf" | "image" | "doc";
  tamanoBytes: number;
  categoria?: string;
  usuarioId?: number;
}

// Métodos del servicio Supabase
export async function obtenerArchivosExpediente(tramiteId: number): Promise<ArchivoExpedienteData[]>;
export async function guardarArchivoExpediente(params: GuardarArchivoExpedienteParams): Promise<{ success: boolean; id?: number; error?: string }>;
export async function eliminarArchivoExpediente(archivoId: number): Promise<{ success: boolean; error?: string }>;
export async function archivarExpedienteFinal(tramiteId: number, usuarioId?: number): Promise<{ success: boolean; error?: string }>;
export async function obtenerResumenEjecutivoTramite(tramiteId: number): Promise<ResumenEjecutivoTramiteData | null>;
```
