# Quickstart Validation Guide: Validación Automática de Saldos y Emisión del Sello Preventivo por Resp. Presupuestos

**Feature Branch**: `004-sello-preventivo-presupuestos`  
**Date**: 2026-07-27

---

## 1. Automated Verification

Run unit tests verifying budget sufficiency check and preventive seal generation:

```bash
npx tsx tests/unit/preventivo.test.ts
```

Expected output:

```text
=== Running Unit Tests: Sello Preventivo & Revision Presupuestaria ===
✔ Test 1: Budget sufficiency check per 5-digit partida PASSED
✔ Test 2: Preventive seal correlative PREV-2026-XXXXX generation PASSED
✔ Test 3: Rejection/Observation validation rules PASSED
=== All Unit Tests Passed Successfully ===
```

---

## 2. Manual Verification Walkthrough

1. Open local dev server at `http://localhost:3000/tramites/tr-001`.
2. Switch topbar role to "Responsable de Presupuestos (Alan)".
3. Verify operational workspace card shows budget line table with green `✓ Suficiente` badges.
4. Click "Aprobar Preventivo" and confirm correlative `PREV-2026-XXXXX` stamp is generated and workflow advances to "Recepción".
5. Test "Rechazar / Observar Trámite" and confirm mandatory observation text dialog appears.
