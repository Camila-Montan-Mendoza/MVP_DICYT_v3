# Quickstart Guide: Efectivización y Firma de Documentos Contractuales

**Feature**: `010-efectivizacion-firma-contratos`
**Date**: 2026-07-29

## Integration in Workflow Stepper

La tarea de efectivización y firma se ejecuta en el **Paso 2 (Recepción)** dentro del componente activo:
`components/workflow/views/paso-2-recepcion/tarea-10-firma-documentos-active.tsx`

---

## Runnable Verification Scenarios

### Scenario 1: Impresión Directa y Registro de Firmas

1. Abrir un trámite con órdenes emitidas en la Tarea 9 (ej. `TR-2026-003`).
2. Avanzar el flujo hasta la **Tarea 10: Efectivización y Firma de Documentos**.
3. Verificar que se despliegan tarjetas simplificadas por proveedor con el botón **"Imprimir Documento Oficial"** directo.
4. Hacer clic en "Imprimir Documento Oficial" y comprobar que abre el modal de impresión sin recargar datos pesados de ítems.
5. Marcar las casillas del checklist: `[x] Firma Coordinador`, `[x] Firma Director DICyT`, `[x] Firma Proveedor`.
6. Hacer clic en **"CONFIRMAR EFECTIVIZACIÓN Y FINALIZAR TAREA 10"**.
7. Verificar que el trámite avanza y muestra el distintivo de esperas y conteo de días restantes.
