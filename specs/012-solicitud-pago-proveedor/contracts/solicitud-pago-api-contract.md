# API Contract: Generación y Envío de Solicitud de Pago a Proveedor

**Feature**: `012-solicitud-pago-proveedor`
**Date**: 2026-07-29

## Service Contract (`services/solicitudPagoService.ts`)

```typescript
export type EstadoSolicitudPago = "SIN_ENVIAR" | "PENDIENTE_REVISION" | "VALIDADA" | "OBSERVADA";

export interface ItemSolicitudPago {
  idItemTramite: number;
  nroItem: number;
  detalle: string;
  especificacion?: string;
  cantidad: number;
  unidad: string;
  precioTotal: number;
}

export interface SolicitudPagoProveedorData {
  id?: number;
  tramiteId: number;
  proveedorId: number;
  proveedorNombre: string;
  proveedorNit: string;
  proyectoNombre: string;
  unidadSolicitante: string;
  numeroSolicitud: string;
  fechaSolicitud: string;
  montoTotal: number;
  montoLiteral: string;
  facturaUrl?: string;
  notaEntregaUrl?: string;
  evidenciaExtraUrl?: string;
  estado: EstadoSolicitudPago;
  motivoObservacion?: string;
  materiales: ItemSolicitudPago[];
}

export interface EnviarSolicitudPagoParams {
  tramiteId: number;
  proveedorId: number;
  solicitudId?: number;
  montoTotal: number;
  montoLiteral: string;
  facturaUrl?: string;
  notaEntregaUrl?: string;
  evidenciaExtraUrl?: string;
  usuarioId?: number;
}

export interface ValidarSolicitudPagoParams {
  tramiteId: number;
  proveedorId: number;
  solicitudId?: number;
  usuarioId?: number;
}

export interface ObservarSolicitudPagoParams {
  tramiteId: number;
  proveedorId: number;
  solicitudId?: number;
  motivoObservacion: string;
  usuarioId?: number;
}

// Métodos expuestos por el servicio Supabase
export async function obtenerSolicitudesPagoTramite(
  tramiteId: number
): Promise<SolicitudPagoProveedorData[]>;
export async function enviarSolicitudPago(
  params: EnviarSolicitudPagoParams
): Promise<{ success: boolean; error?: string }>;
export async function validarSolicitudPago(
  params: ValidarSolicitudPagoParams
): Promise<{ success: boolean; error?: string }>;
export async function observarSolicitudPago(
  params: ObservarSolicitudPagoParams
): Promise<{ success: boolean; error?: string }>;
```
