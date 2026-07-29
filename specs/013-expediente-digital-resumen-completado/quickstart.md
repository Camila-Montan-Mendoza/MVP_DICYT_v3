# Quickstart Guide: Expediente Digital y Resumen de Trámite Completado (Paso 4)

**Feature**: `013-expediente-digital-resumen-completado`
**Date**: 2026-07-29

## Integration in Workflow Stepper

La gestión del expediente digital y resumen final se ejecuta en el **Paso 4 (Evidencia)**:
- **Tarea 18**: `components/workflow/views/paso-4-evidencia/tarea-18-expediente-digital-active.tsx`
- **Tarea 19**: `components/workflow/views/paso-4-evidencia/tarea-19-tramite-completado-active.tsx`

---

## Runnable Verification Scenarios

### Scenario 1: Carga y Archivación del Expediente (Tarea 18)

1. Abrir un trámite en el **Paso 4: Evidencia** (ej. `TR-2026-0089`).
2. Seleccionar la **Tarea 18: Expediente Digital**.
3. Verificar la tarjeta "Resumen de archivos" con la zona punteada "Adjuntar archivo".
4. Subir 1 o más archivos (PDF e imágenes).
5. Probar la previsualización (ojo) y la eliminación de items.
6. Hacer clic en **"Archivar respaldos"**.
7. Verificar que los respaldos se guardan en Supabase y el trámite avanza a la Tarea 19.

---

### Scenario 2: Consulta del Resumen Ejecutivo Final (Tarea 19)

1. Seleccionar la **Tarea 19: Trámite Completado**.
2. Verificar que se despliega la ficha de resumen con el badge verde `TRÁMITE COMPLETADO Y ARCHIVADO`.
3. Validar que se muestran los 4 bloques consolidados (Solicitud, Recepción, Pago, Expediente).
