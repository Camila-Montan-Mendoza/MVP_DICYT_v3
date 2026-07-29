# Quickstart Guide: Registro de Acta de Recepción (Provisional / Definitiva)

**Feature**: `011-acta-recepcion-materiales`
**Date**: 2026-07-29

## Integration in Workflow Stepper

La recepción consolidada se ejecuta en el **Paso 2 (Recepción)** dentro de la vista activa:
`components/workflow/views/paso-2-recepcion/tarea-11-recepcion-provisional-active.tsx`

---

## Runnable Verification Scenarios

### Scenario 1: Emitir Acta de Recepción Provisional

1. Abrir un trámite con orden efectivizada (ej. `TR-2026-0089`).
2. Avanzar hasta la **Tarea 11: Recepción de Materiales**.
3. Verificar la carga automática del Proyecto, Nro. Orden de Compra y tabla de materiales.
4. Llenar los nombres de los 3 representantes (Coordinador, Representante Empresa Proveedora, Representante de Bienes e Inventarios).
5. Seleccionar el estado del material ("Excelente").
6. Hacer clic en **"GENERAR ACTA"** y verificar el visor del documento oficial membretado "UMSS - DAF ACTA DE RECEPCIÓN".
7. Hacer clic en **"Emitir Acta Provisional"**.
8. Verificar que el acta se registra como `PROVISIONAL` y el trámite se mantiene en la Tarea 11 para futuras entregas.

---

### Scenario 2: Emitir Acta de Recepción Definitiva

1. En la Tarea 11 de Recepción, adjuntar la Factura en PDF y las fotos de evidencia.
2. Hacer clic en **"Emitir Acta Definitiva"**.
3. Verificar que el sistema guarda el acta `DEFINITIVA` en Supabase y ejecuta la transición al **Paso 3 (Pago a Proveedor)**.
