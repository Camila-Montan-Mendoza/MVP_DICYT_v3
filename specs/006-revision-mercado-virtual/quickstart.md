# Quickstart Validation Guide: Verificación Mercado Virtual SIGEP

**Feature**: `006-revision-mercado-virtual`  
**Created**: 2026-07-28

## Validation Steps

### Scenario 1: Operational Review in Tarea 3

1. Select role **"Responsable de Compras (Grover Villarroel)"**.
2. Navigate to `/tramites/2` (or active trámite in Mercado Virtual state).
3. Select **Tarea 3 ("Revisión Mercado Virtual")**.
4. Verify table renders items loaded directly from Supabase PostgreSQL.

### Scenario 2: Marking Item as "Encontrado" & Supplier Registration

1. Change item status to **Encontrado**.
2. Verify Modal pops up requesting Supplier Name, NIT, Unit, Available Quantity, Unit Price.
3. Submit modal and verify Supplier badge is displayed in the table row with Eye and Cross icons.

### Scenario 3: Proforma Template Download

1. Click **Descargar Proforma en Blanco**.
2. Verify browser triggers download or preview of official proforma PDF.
