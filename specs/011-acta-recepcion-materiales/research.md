# Research: Registro del Acta de Recepción Provisional o Definitiva de Materiales

**Feature**: `011-acta-recepcion-materiales`
**Date**: 2026-07-29

## Research Items

### 1. Consolidación de Recepción y Eliminación de Tarea 12

- **Contexto**: El usuario solicitó consolidar la recepción en la **Tarea 11 (`Tarea11RecepcionProvisionalActive`)** renombrándola conceptualmente como **"Recepción"**, disponiendo de 2 acciones/transiciones de flujo en la misma tarea, y eliminando completamente la vista independiente `Tarea12RecepcionDefinitivaActive`.
- **Decisión**:
  1. Eliminar `tarea-12-recepcion-definitiva-active.tsx` y `tarea-12-recepcion-definitiva-passive.tsx`.
  2. Implementar en `tarea-11-recepcion-provisional-active.tsx` la vista completa de Recepción con 2 botones de acción principal:
     - **"Emitir Acta de Recepción Provisional"**: Guarda la recepción parcial/provisional en Supabase DB (`acta_recepcion`, `detalle_acta_recepcion`) y mantiene el trámite en la Tarea 11.
     - **"Emitir Acta de Recepción Definitiva"**: Guarda la recepción definitiva 100% conforme en Supabase DB, exige factura y fotos de evidencia, y avanza el trámite al Paso 3 (Pago a Proveedor).

### 2. Conexión Real a Supabase y Backend (`services/recepcionService.ts`)

- **Decisión**: Crear el servicio `services/recepcionService.ts` para interactuar directamente con Supabase PostgreSQL:
  1. `obtenerDatosRecepcionTramite(tramiteId: number)`: Consulta la orden de compra efectivizada, proyecto, unidad solicitante y lista de materiales adjudicados.
  2. `guardarActaRecepcion(params)`: Inserta o actualiza la cabecera en `acta_recepcion` y los detalles en `detalle_acta_recepcion`, registrando la auditoría en `historial_estado_tramite`.

### 3. Visor e Impresión del Documento Oficial "UMSS - DAF ACTA DE RECEPCIÓN"

- **Decisión**: Crear el componente `components/tramites/ordenes/ModalImpresionActaRecepcion.tsx` que simula en pantalla el documento impreso membretado oficial de la UMSS - DAF con controles de descarga, impresión y zoom (identico al diseño del mockup).
