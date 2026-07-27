# Quickstart Validation Guide: Visualización del Flujo de Pasos y Tareas del Trámite (Workflow Stepper)

**Feature Branch**: `003-workflow-stepper-tramite`  
**Date**: 2026-07-27

---

## 1. Automated Verification

Run unit tests verifying workflow step status calculation and task intervention badge resolution:

```bash
npx tsx tests/unit/workflow-stepper.test.ts
```

Expected output:
```text
=== Running Unit Tests: Workflow Stepper & Tasks Timeline ===
✔ Test 1: Macro step status resolution PASSED
✔ Test 2: Task completion timestamps PASSED
✔ Test 3: Intervention badge ('Acción requerida' vs 'En espera') PASSED
=== All Unit Tests Passed Successfully ===
```

---

## 2. Manual Verification Walkthrough

1. Open local dev server at `http://localhost:3000/tramites/tr-001` or `/tramites/detalle`.
2. Verify top header shows `Trámite Nº TR-2026-001`, project name, and applicant name.
3. Check horizontal stepper renders 4 steps: Step 1 (COMPLETADO), Step 2 (EN CURSO), Step 3 (PENDIENTE), Step 4 (PENDIENTE).
4. Check vertical timeline renders granular tasks with checkmarks `✓`, role, user name, and completion timestamps.
5. Confirm active task displays highlighted green card *"Acción requerida por tu parte"*.
6. Confirm right workspace area is available for operational execution UI.
