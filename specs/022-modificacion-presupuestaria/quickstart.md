# Quickstart & Validation Guide: Modificación Presupuestaria

## Scenario 1: Accessing Modificaciones Presupuestarias Sub-division

1. Open browser to `http://localhost:3000/tramites`.
2. Observe tab bar at top of Trámites view: **"Compras / Contrataciones"** | **"Modificaciones Presupuestarias"**.
3. Click **"Modificaciones Presupuestarias"**.
4. Verify table shows registered modification requests (e.g. `#TR-2026-0089`).

## Scenario 2: Opening Modal & Selecting Partidas

1. Click **"+ Nueva Modificación Presupuestaria"** button.
2. Modal **"Modificar Presupuesto"** opens (matching Screenshot 1).
3. Search for partida `31120`. Enter `2115.32` in **Quitar (-)**.
4. Search for partida `39100`. Enter `2115.32` in **Aumentar (+)**.
5. Click **"+ Agregar movimientos"**.

## Scenario 3: Detail Builder & Real-time Cuadre Validation

1. Detail view **"Modificación Presupuestaria"** displays side-by-side tables (matching Screenshot 2):
   - Left: **Partidas Afectadas (De)**
   - Right: **Partidas Beneficiadas (A)**
2. Verify **ESTADO DE VALIDACIÓN** card shows `"Balance: 0.00 Bs — Montos Validados"` in green.
3. Verify automatically generated justification prefix contains `"De: 31120 | A: 39100"`.
4. Enter complementary justification text.
5. Click **"Confirmar Modificación"**.

## Scenario 4: Official Document Print Format

1. Open any approved or pending modification request.
2. Click **"Imprimir Solicitud"**.
3. Official print view modal opens rendering "De la partida afectada" and "En favor a la partida" tables with investigator sign block.
