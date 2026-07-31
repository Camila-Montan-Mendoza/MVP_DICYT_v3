# Quickstart & Validation Guide: Revisar Memoria de Cálculo

## Scenario 1: Evaluation View for Project in Review (State 2)

1. Open browser to `http://localhost:3000/proyectos/2`.
2. Verify project status badge shows **"En revisión de memoria de cálculo"**.
3. Verify top banner displays action: **"Evaluar Memoria de Cálculo"** (or action buttons **Aprobar** / **Observar**).

## Scenario 2: Approving Memoria de Cálculo

1. Click **"Aprobar"** on `/proyectos/2`.
2. Confirm approval in modal dialog.
3. System updates project status badge to **"Habilitado para ejecutar partidas"**.
4. View freezes into read-only mode with zero edit/eval buttons.

## Scenario 3: Observing Memoria de Cálculo with Required Reason

1. Reset project status or navigate to a project in state 2.
2. Click **"Observar"**.
3. Attempt to submit without entering a reason -> system blocks submission with error message.
4. Enter reason `"Falta justificación detallada para reactivos químicos"` and confirm.
5. Project status updates to **"Observado"**.
6. Switch view to Investigador Principal -> top banner prominently displays the observation reason.

## Scenario 4: Correction and Re-submission

1. Open `/proyectos/3` (Observado) as Investigador Principal.
2. View observation banner, edit partida amounts, click **"Enviar a revisión"**.
3. Project status returns to **"En revisión de memoria de cálculo"**.
