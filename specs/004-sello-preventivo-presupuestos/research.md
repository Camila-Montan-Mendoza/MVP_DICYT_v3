# Research & Architectural Decisions: Validación Automática de Saldos y Emisión del Sello Preventivo por Resp. Presupuestos

**Feature Branch**: `004-sello-preventivo-presupuestos`  
**Date**: 2026-07-27

---

## 1. Topbar Role Switching Context

- **Decision**: Provide an interactive user role switcher in `SigefiShell` header (`Investigador Principal (Marcelino Pérez)` vs `Responsable de Presupuestos (Alan)`).
- **Rationale**: Allows instant role switching during demo presentations to demonstrate approval controls.

---

## 2. Automatic Budget Line Check per 5-Digit Partida

- **Decision**: Evaluate `partida.saldoDisponible >= partida.montoRequerido` for each line item.
- **Rationale**: Ensures transparent verification and display of green status badge (`✓ Suficiente`).

---

## 3. Preventive Seal Correlative Generation (`PREV-2026-XXXXX`)

- **Decision**: Format seal as `PREV-2026-00` + sequential number.
- **Rationale**: Official Bolivian institutional reservation format for university accounting.
