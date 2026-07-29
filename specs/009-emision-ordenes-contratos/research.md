# Research: Generación y Emisión de Órdenes de Compra, Órdenes de Servicio o Contratos

**Feature**: `009-emision-ordenes-contratos`
**Date**: 2026-07-29

## Research Items

### 1. Estrategia de Persistencia y Conexión con Supabase / Backend

- **Contexto**: El usuario solicitó explícitamente usar endpoints/servicios de backend para obtener los datos de la adjudicación e ítems adjudicados por proveedor y guardar las órdenes/contratos emitidos directamente en la base de datos dentro de `Tarea9EmisionOrdenCompraActive()`.
- **Decisión**: Crear un servicio dedicado `services/ordenesService.ts` que consulte la base de datos de Supabase e integre los siguientes métodos:
  1. `obtenerDatosEmisionOrdenes(tramiteId: number)`: Obtiene los ítems adjudicados desde `item_proveedor_tramite`, `cotizacion`, `detalle_cotizacion`, `proveedor`, `item_tramite`, `tramite` y `proyecto`.
  2. `emitirOrdenContractual(params)`: Persiste la emisión de la orden o registro de contrato en `orden_contractual` y `detalle_orden_contractual`, actualiza el correlativo, registra la auditoría en `historial_estado_tramite` y ejecuta la transición de la tarea.
- **Alternativas consideradas**: Usar datos mockeados en memoria (rechazado por violar la regla de datos reales de Supabase del proyecto).

### 2. Reglas de Cálculo de Fecha Límite de Entrega

- **Decisión**:
  - **Bienes (Materiales / Activos Fijos - Orden de Compra)**: `Fecha Límite = Fecha Emisión + Días Cotizados` (contabilizado a partir del día siguiente de la emisión, usando funciones de suma de días fecha de Javascript/date-fns sin contar el día 0).
  - **Servicios (Orden de Servicio)**: `Fecha Límite = Fecha Emisión + Días Cotizados - 1 día` (contabilizado incluyendo el mismo día de la emisión).
  - **Contratos (> 15 días)**: El plazo de entrega se registra como la fecha tope estipulada en las cláusulas del contrato firmado.

### 3. Conversión de Cifras Decimales a Texto Literal Oficial (Formato UMSS)

- **Decisión**: Crear la utilidad `lib/utils/numero-a-letras.ts` que convierte montos numéricos a texto en español respetando el estándar bancario/administrativo boliviano:
  - Formato: `"SON: [TEXTO EN MAYÚSCULAS] [CENTAVOS]/100 BOLIVIANOS"`
  - Ejemplo: `8556.00` $\rightarrow$ `"SON: OCHO MIL QUINIENTOS CINCUENTA Y SEIS 00/100 BOLIVIANOS"`.

### 4. Impresión e Integración del Modal de Previsualización

- **Decisión**: Implementar el componente `components/tramites/ordenes/ModalImpresionOrden.tsx` utilizando la hoja de estilos de impresión CSS (`@media print`) y componentes modal alineados con `DESIGN.md` y shadcn/ui.
