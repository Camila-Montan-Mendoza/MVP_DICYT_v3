# Quickstart Validation Guide: Registro y Auto-Distribución por Tipo

**Feature**: `001-registro-solicitud-lote`  
**Date**: 2026-07-23  

---

## 🚀 Scenario Walkthrough & Verification Steps

### Step 1: Access Project & New Request View
1. Navigate to `http://localhost:3000/proyectos/1`.
2. Click **"Crear Solicitud de Adquisición"**.
3. Verify that the **Unified Selection View** opens.

### Step 2: Add Items with Automatic Classification
1. Type or select Item 1: `Papel Bond A4` -> Verify automatic classification badge: **Material**.
2. Type or select Item 2: `Impresora Multifuncional` -> Verify automatic classification badge: **Activo Fijo**.
3. Type or select Item 3: `Mantenimiento de Servidores` -> Verify automatic classification badge: **Servicio**.

### Step 3: Trigger Auto-Distribution
1. Click **"Generar Trámites por Tipo"**.
2. **Expected Outcome**: The unified list partitions into up to 3 tabs/cards:
   - **Trámite A (Materiales)**: Contains `Papel Bond A4`
   - **Trámite B (Activos Fijos)**: Contains `Impresora Multifuncional`
   - **Trámite C (Servicios)**: Contains `Mantenimiento de Servidores`

### Step 4: Complete Technical Forms per Trámite
1. Open **Trámite A (Materiales)** tab/accordion:
   - Complete ET fields: Cantidad (`10`), Unidad (`Caja`), Precio de referencia (`120.00`).
   - Enter Justificación: `"Estamos comprando estos materiales para experimentos de laboratorio"`.
   - Upload PDF proforma: `proforma_materiales.pdf`.
2. Open **Trámite C (Servicios)** tab/accordion:
   - Complete TDR fields: Objetivos, Entregables (`Informe técnico`), Plazo (`15 días`).
   - Enter Justificación: `"Servicio de mantenimiento técnico"`.
   - Upload PDF proforma: `cotizacion_servicio.pdf`.

### Step 5: Test Budget Line Lookup & Permissiveness
1. For Item 1 (`Papel Bond A4`), click **"Consultar Partida"**.
   - Expected: Code `39700` is returned with status `"ASIGNADA"`.
2. For an unrecognized item name, click **"Consultar Partida"**.
   - Expected: Status becomes `"Pendiente de asignación"` without error dialog.

### Step 6: Submit Trámites
1. Click **"Enviar Trámites a Revisión"**.
2. **Expected Outcome**:
   - Success toast appears: `"Trámites enviados a revisión exitosamente"`.
   - User is redirected to `/tramites` showing the new trámites in status **"Enviado a Revisión"**.
