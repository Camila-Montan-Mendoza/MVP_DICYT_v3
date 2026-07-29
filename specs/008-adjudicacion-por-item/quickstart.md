# Quickstart: Validación de Adjudicación Flexible por Ítem

Este documento describe los escenarios de prueba para validar la funcionalidad del cuadro comparativo y adjudicación por ítem en el entorno local con Supabase.

## Requisitos Previos

- Servidor de desarrollo corriendo (`npm run dev` en `http://localhost:3000`).
- Conexión a la base de datos Supabase configurada en `.env`.

## Escenarios de Prueba Manual

### Escenario 1: Navegación e Carga del Cuadro Comparativo (Supabase Real)

1. Iniciar sesión como Investigador Principal (IP) / Admin User.
2. Navegar a **Trámites** -> Seleccionar Trámite de prueba con cotizaciones (`#TR-2026-0089` o equivalente).
3. Ir al paso **ADJUDICAR PROVEEDORES**.
4. **Resultado Esperado**: Se carga el cuadro comparativo consultando `cotizacion` y `detalle_cotizacion` desde Supabase. La lista de insumos muestra los ítems y las tarjetas comparativas con precios y disponibilidad de stock.

### Escenario 2: Adjudicación Granular e Independiente

1. Seleccionar el **Ítem A** y adjudicarlo al **Proveedor 1**.
2. Seleccionar el **Ítem B** y adjudicarlo al **Proveedor 2**.
3. **Resultado Esperado**: El sistema permite seleccionar proveedores distintos sin forzar la cotización entera a un solo proveedor. Los subtotales se actualizan dinámicamente.

### Escenario 3: Bloqueo de Oferta "Sin Stock" y Techo de Precio Referencial

1. Localizar un ítem que tenga una cotización con `cantidad_existencias = 0`.
2. Verificar que la celda muestre el distintivo **"Sin Stock"** y esté deshabilitada.
3. Verificar que las cotizaciones con precio unitario mayor al precio referencial del ítem muestren la advertencia **"El precio cotizado supera el precio referencial inicial"** y estén deshabilitadas.

### Escenario 4: Adjudicación Dividida por Cantidades Parciales

1. Seleccionar un ítem que requiera 5 unidades.
2. Asignar 2 unidades al Proveedor A y 3 unidades al Proveedor B en el modal de división.
3. Intentar ingresar 4 unidades al Proveedor A y 3 al B (total 7 > 5).
4. **Resultado Esperado**: El sistema bloquea el guardado si supera 5 unidades. Si la suma es exactamente 5 (o menor), habilita la asignación combinada.

### Escenario 5: Confirmación, Justificación Obligatoria y Liberación Presupuestaria

1. Presionar "Confirmar Adjudicación" dejando vacía la Justificación General.
2. **Resultado Esperado**: El formulario requiere obligatoriamente completar el campo.
3. Ingresar la Justificación General y confirmar.
4. **Resultado Esperado en Supabase**:
   - `tramite.justificacion` guardada.
   - Registros insertados en `item_proveedor_tramite`.
   - Saldo no adjudicado liberado y registrado en `historial_estado_tramite`.
