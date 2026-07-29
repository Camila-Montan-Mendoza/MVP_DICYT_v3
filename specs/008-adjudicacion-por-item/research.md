# Research: Cuadro Comparativo y Adjudicación Flexible por Ítem

## 1. Persistencia Relacional en Supabase para Adjudicación por Ítem

### Decision

Utilizar la tabla existente `public.item_proveedor_tramite` para registrar cada adjudicación de ítem a proveedor(es), junto con la actualización de `public.tramite` (`justificacion`, `id_estado_tramite`) y `public.historial_estado_tramite`.

### Rationale

- La tabla `item_proveedor_tramite` cuenta con las columnas: `id_item_tramite`, `id_proveedor`, `cantidad_proveida`, `precio`.
- Soporta de forma natural la **adjudicación dividida**: para un mismo `id_item_tramite`, pueden existir múltiples registros con diferentes `id_proveedor` y su correspondiente `cantidad_proveida`.
- Los ítems o saldos con "Sin Stock" no generan registros en `item_proveedor_tramite` (o su `cantidad_proveida` es 0), lo que permite calcular fácilmente la brecha para la liberación presupuestaria.

### Alternatives Considered

- _Crear una tabla JSONB en `tramite`_: Rechazada porque viola el principio V de la Constitución (Integridad relacional y trazabilidad en Supabase).
- _Adjudicación a nivel de `cotizacion`_: Rechazada porque no permite la adjudicación granular por ítem ni la división entre proveedores.

---

## 2. Estrategia de Desafectación Presupuestaria y Liberación de Saldo

### Decision

Calcular el monto total no ejecutado directamente en la transacción de confirmación:
$$\text{Monto Liberado} = \sum (\text{Cantidad Solicitada} \times \text{Precio Referencial}) - \sum (\text{Cantidad Adjudicada} \times \text{Precio Cotizado Adjudicado})$$

El sistema actualiza el estado del trámite a `ADJUDICADO` (o paso equivalente en `estado_paso_flujo`), inserta la auditoría en `historial_estado_tramite` detallando el monto liberado a la partida, y si aplica registra la desafectación en `ejecucion_gasto`.

### Rationale

- Garantiza que sólo el dinero de los productos efectivamente adjudicados pase a las Órdenes de Compra.
- El saldo sobrante retorna inmediatamente al fondo presupuestario disponible de la partida del proyecto sin requerir trámites adicionales.

---

## 3. Arquitectura UI & Componentes shadcn/ui alineados a DESIGN.md

### Decision

Implementar la interfaz en `app/(dashboard)/tramites/[id]/adjudicacion/page.tsx` usando un layout responsivo de 3 zonas principales alineado exactamente al prototipo capturado:

1. **Header & Stepper del Trámite**: Muestra los datos del trámite (`Trámite #TR-2026-0089`), proyecto, solicitante y el Stepper de 4 etapas (Solicitud EN CURSO, Recepción Material, Pago a Proveedor, Completado).
2. **Columna Izquierda (Detalle del Trámite)**: Timeline vertical de pasos finalizados y paso activo ("ADJUDICAR PROVEEDORES 14 Ene 2026").
3. **Columna Central (Lista de Insumos / Ítems)**: Campo de búsqueda (`Buscar insumo...`), tarjetas de ítems con badges `[ADJUDICADO]`, cantidad, proveedor asignado y subtotal.
4. **Zona Derecha (Cuadro Comparativo de Proveedores)**: Detalle del ítem seleccionado, tarjetas de proveedores cotizantes con distintivo `[AHORRO MÁXIMO]`, precio total, precio unitario, stock disponible (`32 UND.`), botón de selección (`Seleccionado` / `Ver Detalles`) y barra inferior de acciones (`[OBSERVAR]`, `[APROBAR / CONFIRMAR]`).

### Rationale

- Coincide 100% con la experiencia de usuario y mockups institucionales exigidos por la Universidad Mayor de San Simón (UMSS).
- Cumple con la regla minimalista de `DESIGN.md` sin sobrecarga visual y con colores `--primary` (`#003770`) y `--secondary` (`#BC000C`).
