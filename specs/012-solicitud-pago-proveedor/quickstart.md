# Quickstart Guide: Generación y Envío de Solicitud de Pago

**Feature**: `012-solicitud-pago-proveedor`
**Date**: 2026-07-29

## Integration in Workflow Stepper

La gestión de solicitudes de pago a proveedores se ejecuta en el **Paso 3 (Pago a Proveedor)** en la vista activa:
`components/workflow/views/paso-3-pago/tarea-13-solicitud-pago-active.tsx`

---

## Runnable Verification Scenarios

### Scenario 1: Generación Automática y Envío de Solicitud (IP)

1. Abrir un trámite en el **Paso 3: Pago a Proveedor** (ej. `TR-2026-0089`).
2. Seleccionar la **Tarea 13: Emitir Nota Solicitud de Pago**.
3. Verificar que se despliegan automáticamente los acordeones por cada proveedor adjudicado con estado `SIN ENVIAR`.
4. Revisar que los montos, ítems y la vista previa de la "UMSS • DICyT Nota de Solicitud de Pago" están pre-llenados.
5. Hacer clic en **"ENVIAR SOLICITUD DE PAGO"**.
6. Verificar que el badge cambia a verde `ENVIADO` (`PENDIENTE_REVISION`).

---

### Scenario 2: Validación o Devuelta por Compras / Contabilidad

1. Iniciar sesión como Responsable de Compras o Contabilidad.
2. Abrir la Tarea 13 para la solicitud en `PENDIENTE_REVISION`.
3. Probar **"VALIDAR SOLICITUD"**: El trámite avanza a la Tarea 14 (Memorándum de Pago).
4. Probar **"OBSERVAR SOLICITUD"**: Se exige motivo obligatoriamente y se marca como `OBSERVADA`.
