# Contract: Adjudicación Flexible por Ítem en Supabase

## 1. Consultar Cuadro Comparativo del Trámite

**Operación**: `obtenerCuadroComparativo(tramiteId: number)`  
**Tabla Primaria**: `tramite`, `item_tramite`, `cotizacion`, `detalle_cotizacion`, `proveedor`

### Query / Join Supabase JS:

```typescript
const { data: tramite, error } = await supabase
  .from("tramite")
  .select(
    `
    id,
    justificacion,
    id_estado_tramite,
    proyecto ( id, nombre ),
    usuario ( id, nombre ),
    item_tramite (
      id,
      cantidad_solicitada,
      precio,
      especificacion,
      item ( id, nombre )
    ),
    cotizacion (
      id,
      tiempo_entrega_dias,
      validez_oferta_dias,
      proveedor ( id, nombre, nit ),
      detalle_cotizacion (
        id,
        id_tramite_item,
        cantidad_existencias,
        precio,
        especificacion
      )
    ),
    item_proveedor_tramite (
      id,
      id_item_tramite,
      id_proveedor,
      cantidad_proveida,
      precio
    )
  `
  )
  .eq("id", tramiteId)
  .single();
```

---

## 2. Guardar / Confirmar Adjudicación Granular

**Operación**: `confirmarAdjudicacionTramite(payload: ConfirmarAdjudicacionPayload)`

### Interface Payload TypeScript:

```typescript
export interface AdjudicacionItemSeleccion {
  idItemTramite: number;
  idProveedor: number;
  cantidadAdjudicada: number;
  precioUnitario: number;
}

export interface ConfirmarAdjudicacionPayload {
  tramiteId: number;
  justificacionGeneral: string;
  adjudicaciones: AdjudicacionItemSeleccion[]; // Lista de ítems/cantidades asignadas
  observaciones?: string;
}
```

### Transacción / Mutaciones Supabase:

1. **Actualizar Justificación y Estado del Trámite**:

   ```typescript
   await supabase
     .from("tramite")
     .update({
       justificacion: payload.justificacionGeneral,
       id_estado_tramite: ESTADO_ADJUDICADO, // Transición de estado en paso de flujo
       fecha_actualizacion: new Date().toISOString(),
     })
     .eq("id", payload.tramiteId);
   ```

2. **Limpiar e Insertar Adjudicaciones en `item_proveedor_tramite`**:

   ```typescript
   // 1. Limpiar previas
   await supabase.from("item_proveedor_tramite").delete().in("id_item_tramite", idsItemTramite);

   // 2. Insertar nuevas asignaciones válidas (cantidad > 0)
   const registrosNuevos = payload.adjudicaciones.map((adj) => ({
     id_item_tramite: adj.idItemTramite,
     id_proveedor: adj.idProveedor,
     cantidad_proveida: adj.cantidadAdjudicada,
     precio: adj.precioUnitario,
   }));

   await supabase.from("item_proveedor_tramite").insert(registrosNuevos);
   ```

3. **Registrar Auditoría en Historial**:
   ```typescript
   await supabase.from("historial_estado_tramite").insert({
     id_tramite: payload.tramiteId,
     id_estado_tramite: ESTADO_ADJUDICADO,
     id_usuario: usuarioActualId,
     observacion: `Adjudicación confirmada. Justificación: ${payload.justificacionGeneral}. Monto liberado: ${montoLiberado} Bs.`,
   });
   ```
