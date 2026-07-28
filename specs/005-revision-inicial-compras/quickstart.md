# Quickstart Validation Guide: Revisión Inicial por Compras

**Feature**: `005-revision-inicial-compras`  
**Created**: 2026-07-28

## Validation Steps

### Scenario 1: Operational Review as Grover (Resp. Compras)

1. Select role **"Responsable de Compras (Grover Villarroel)"** from topbar switcher.
2. Navigate to `/tramites/1`.
3. Select **Tarea 2 ("Revisión técnica inicial de solicitud")** in the timeline.
4. Verify that:
   - Header title matches request category ("Solicitud de Activos Fijos", "Solicitud de Materiales", "Solicitud de Servicios").
   - Items table displays collapsible details, quantities, unit prices, and total reference prices.
   - Attachments card displays uploaded reference quotes ("cotizacion inicial").
   - Bottom bar presents **Observar** (outline) and **Aprobar** (primary navy `#002855`) buttons.

### Scenario 2: 1-Click Approval

1. Click **Aprobar**.
2. Verify Toast success notification displays.
3. Verify task status in timeline updates to `COMPLETADO` and next state activates.

### Scenario 3: Observation Modal

1. Click **Observar**.
2. Verify modal pops up requiring observation text.
3. Confirm button remains disabled until at least 5 characters are entered.
4. Enter observation and confirm.
