# Quickstart Validation Guide: Creación y Envío de Trámites de Adquisición Divididos por Tipo de Compra

**Feature**: `001-segregacion-tramites-lote`  
**Date**: 2026-07-27  

Esta guía rápida permite probar y validar el flujo de auto-clasificación, segregación estricta y envío en lote de trámites de adquisición en el MVP.

## Prerrequisitos

- Node.js v18+ y servidor de desarrollo activo (`npm run dev`).
- Navegador web abierto en `http://localhost:3000`.

## Escenarios de Validación Manual (MVP)

### Escenario 1: Auto-Clasificación y Segregación de Ítems en Trámites Independientes
1. Navegar a la sección de **Registro de Trámites de Adquisición**.
2. Agregar 3 ítems a la lista de pedido inicial:
   - Ítem 1: "Reactivo de Laboratorio" -> Seleccionar tipo **Material**.
   - Ítem 2: "Microscopio Binocular" -> Seleccionar tipo **Activo Fijo**.
   - Ítem 3: "Mantenimiento de Equipo" -> Seleccionar tipo **Servicio**.
3. **Resultado Esperado**: El sistema auto-clasifica los ítems y genera automáticamente 3 pestañas/tarjetas de trámites independientes:
   - Trámite de Materiales (1 ítem)
   - Trámite de Activos Fijos (1 ítem)
   - Trámite de Servicios (1 ítem)

### Escenario 2: Llenado de Datos Técnicos y Documentos Obligatorios (ET / TDR)
1. En la tarjeta de **Materiales**:
   - Ingresar Cantidad `5`, Unidad `Frasco`, Precio Unitario `200`. Verificar que el Precio de Referencia muestre `1000 Bs`.
   - Adjuntar el archivo de Especificaciones Técnicas (`ET_reactivo.pdf`).
2. En la tarjeta de **Servicios**:
   - Ingresar Detalle `Mantenimiento preventivo anual` y Precio Referencial `3500 Bs`.
   - Adjuntar el archivo de Términos de Referencia (`TDR_servicio.pdf`).
3. Verificar que la Partida Presupuestaria muestre la partida sugerida o `"Pendiente de asignación"` sin bloquear el formulario.

### Escenario 3: Envío Resiliente en Lote (Non-Blocking Batch Submit)
1. Completar la Justificación y adjuntar proforma en **Materiales** y **Servicios**.
2. En **Activos Fijos**, dejar deliberadamente vacíos el Nombre del Custodio y la proforma.
3. Presionar el botón **"Enviar Todos los Trámites"**.
4. **Resultado Esperado**:
   - Los trámites de **Materiales** y **Servicios** se envían con éxito emitiendo sus números de seguimiento (`TR-2026-XXXX`).
   - El trámite de **Activos Fijos** permanece en pantalla con un borde de advertencia resaltando los campos faltantes (Custodio y Proforma) para corregir y reintentar.

## Verificación de Pruebas Unitarias Puntuales
Ejecutar el comando de unit tests para la función de segregación y validación:

```bash
npm run test -- --grep "segregation"
```
