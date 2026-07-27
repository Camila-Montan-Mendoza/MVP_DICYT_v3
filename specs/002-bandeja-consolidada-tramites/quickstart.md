# Quickstart Validation Guide: Bandeja Consolidada y Seguimiento de Trámites con Filtrado

**Feature Branch**: `002-bandeja-consolidada-tramites`  
**Date**: 2026-07-27

---

## 1. Automated Verification

Run unit tests verifying multi-criteria filtering and action button resolution:

```bash
npx tsx tests/unit/consolidated-inbox.test.ts
```

Expected output:
```text
=== Running Unit Tests: Consolidated Inbox & Filtering ===
✔ Test 1: Filter by search text (proyecto/nro) PASSED
✔ Test 2: Filter by tipo de trámite PASSED
✔ Test 3: Action button resolution (ATENDER vs VER DETALLE) PASSED
=== All Unit Tests Passed Successfully ===
```

---

## 2. Manual Verification Walkthrough

1. Open local dev server at `http://localhost:3000/tramites`.
2. Verify table contains all 7 columns (`Nº`, `PROYECTO`, `TIPO DE TRÁMITE`, `FECHA`, `PASO ACTUAL`, `CREADOR`, `ACCIÓN`).
3. Test search filter: Type `VLIR` in `BUSCAR` input and confirm only matching project items remain.
4. Test dropdown filters: Select `Solicitud de Servicio` under `TIPO DE TRÁMITE` and verify filtering.
5. Click `Limpiar Filtros` button to verify all records restore.
6. Verify button `ATENDER` (dark blue) appears on pending items, and `VER DETALLE` appears on completed/read-only items.
