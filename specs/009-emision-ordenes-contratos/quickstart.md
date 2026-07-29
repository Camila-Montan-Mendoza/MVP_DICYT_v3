# Quickstart Guide: Emisión de Órdenes de Compra, Servicio y Contratos

**Feature**: `009-emision-ordenes-contratos`
**Date**: 2026-07-29

## Integration in Workflow Stepper

La tarea de emisión de órdenes se ejecuta en el **Paso 2 (Recepción)** dentro del componente activo:
`components/workflow/views/paso-2-recepcion/tarea-9-emision-orden-compra-active.tsx`

---

## Runnable Verification Scenarios

### Scenario 1: Emisión de Orden de Compra (Bienes, ≤ 15 días)

1. Ingresar al trámite `TR-2026-003` o navegar a `/tramites/3`.
2. Avanzar el flujo hasta la **Tarea 9: Emisión de orden de compra o contrato**.
3. Verificar la carga automática del acordeón por proveedor adjudicado.
4. Confirmar que la tarjeta muestra el distintivo `"ORDEN DE COMPRA"`, la fecha límite sumada a partir del día siguiente y el monto literal `"SON: ... BOLIVIANOS"`.
5. Hacer clic en **"Imprimir"** para abrir el modal de previsualización membretado de la UMSS / DICyT.
6. Verificar que la orden asigna el N° Correlativo institucional (ej. `"231"`) y muestra las 3 casillas para firma (**Coordinador**, **Director DICyT**, **Proveedor**).

---

### Scenario 2: Emisión de Orden de Servicio (Servicios, ≤ 15 días)

1. Abrir un trámite cuyo ítem adjudicado sea de categoría `SERVICIO` con plazo de 3 días.
2. En la Tarea 9, verificar que la tarjeta se clasifica automáticamente como `"ORDEN DE SERVICIO"`.
3. Validar que la Fecha Límite de Entrega cuenta incluyendo el mismo día de la emisión.

---

### Scenario 3: Contrato para Plazos Mayores a 15 Días (> 15 días)

1. Abrir un trámite donde el proveedor adjudicado cotizó un plazo de 20 días calendario.
2. En la Tarea 9, verificar que el tipo de documento cambia a `"CONTRATO"`.
3. Verificar que aparece la alerta `"Requiere elaboración de contrato por Asesoría Legal (> 15 días de plazo)"`.
4. Adjuntar un archivo PDF escaneado y confirmar el guardado en Supabase.

---

## Unit Testing Scenarios (`tests/unit/ordenesValidation.test.ts`)

- **Prueba 1**: `calcularFechaLimiteEntrega("2024-11-20", 3, "ORDEN_COMPRA")` $\rightarrow$ `"2024-11-23"`.
- **Prueba 2**: `calcularFechaLimiteEntrega("2024-11-20", 3, "ORDEN_SERVICIO")` $\rightarrow$ `"2024-11-22"`.
- **Prueba 3**: `numeroALetras(8556.00)` $\rightarrow$ `"SON: OCHO MIL QUINIENTOS CINCUENTA Y SEIS 00/100 BOLIVIANOS"`.
