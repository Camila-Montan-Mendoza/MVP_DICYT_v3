# Quickstart Validation Guide: Transcripción de Proformas / Cotizaciones

**Feature**: `007-registro-cotizaciones-proformas`  
**Created**: 2026-07-28

## Validation Steps

### Scenario 1: Descarga de Plantilla de Proforma

1. Iniciar sesión o seleccionar rol **"Investigador Principal"**.
2. Navegar a un trámite en estado de Cotizaciones (ej. `/tramites/1`).
3. Seleccionar **Tarea 7 ("Carga de cotizaciones")**.
4. Hacer clic en **"Plantilla de proforma"** y verificar que se inicie la descarga del archivo PDF oficial.

### Scenario 2: Transcripción de Nueva Cotización Proforma

1. Hacer clic en **"+ Nueva cotizacion"**.
2. Verificar que se despliegue el modal **"Nueva Cotización - Proforma"** con los campos de Proveedor (NIT, Teléfono, Dirección, Preparada por) y Condiciones (Tiempo de entrega, Validez oferta, Tiempo garantía).
3. Ingresar NIT y datos del proveedor.
4. Agregar un ítem y probar ingresar una cantidad mayor a la solicitada: Verificar que el sistema bloquee el registro mostrando la alerta `"La cantidad cotizada no puede ser mayor a la cantidad solicitada ([N] unidades)"`.
5. Guardar la proforma y verificar que aparezca registrada en la tabla principal con las acciones de editar/eliminar.

### Scenario 3: Evaluación de Regla de Existencias (4ta Cotización)

1. Registrar 2 proformas con ítems en estado `Sin existencia`.
2. Hacer clic en **"Cotizacion realizada"**.
3. Verificar que el sistema bloquee el avance exigiendo transcribir la 4ta cotización con existencia.
