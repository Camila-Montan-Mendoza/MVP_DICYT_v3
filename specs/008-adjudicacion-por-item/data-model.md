# Data Model: Cuadro Comparativo y Adjudicación Flexible por Ítem

## Entidades de la Base de Datos Supabase (PostgreSQL)

### 1. `public.tramite`

Representa el trámite de solicitud de compra.

| Columna             | Tipo        | Nulable | Descripción                              |
| :------------------ | :---------- | :------ | :--------------------------------------- |
| `id`                | `integer`   | NO      | Clave primaria                           |
| `id_proyecto`       | `integer`   | NO      | FK a `proyecto`                          |
| `id_tipo_tramite`   | `smallint`  | NO      | FK a `tipo_tramite`                      |
| `id_estado_tramite` | `smallint`  | NO      | FK a `estado_paso_flujo`                 |
| `id_usuario`        | `integer`   | NO      | FK a `usuario` (Solicitante / IP)        |
| `justificacion`     | `text`      | SI      | Justificación General de la Adjudicación |
| `fecha_creacion`    | `timestamp` | NO      | Fecha de creación del trámite            |

---

### 2. `public.item_tramite`

Representa los bienes o insumos solicitados en el trámite.

| Columna               | Tipo       | Nulable | Descripción                                     |
| :-------------------- | :--------- | :------ | :---------------------------------------------- |
| `id`                  | `integer`  | NO      | Clave primaria                                  |
| `id_item`             | `integer`  | NO      | FK a catálogo de ítems (`item`)                 |
| `id_tramite`          | `integer`  | NO      | FK a `tramite`                                  |
| `cantidad_solicitada` | `smallint` | NO      | Cantidad total requerida por el proyecto        |
| `precio`              | `numeric`  | NO      | **Precio Referencial Inicial** unitario fijado  |
| `especificacion`      | `text`     | NO      | Descripción técnica / especificación del insumo |

---

### 3. `public.cotizacion`

Representa la propuesta global presentada por un proveedor para un trámite.

| Columna               | Tipo       | Nulable | Descripción                     |
| :-------------------- | :--------- | :------ | :------------------------------ |
| `id`                  | `integer`  | NO      | Clave primaria                  |
| `id_tramite`          | `integer`  | NO      | FK a `tramite`                  |
| `id_proveedor`        | `smallint` | NO      | FK a `proveedor`                |
| `tiempo_entrega_dias` | `smallint` | NO      | Días calendario de entrega      |
| `validez_oferta_dias` | `smallint` | SI      | Días de validez de la propuesta |

---

### 4. `public.detalle_cotizacion`

Representa la oferta específica de un proveedor para un ítem del trámite.

| Columna                | Tipo       | Nulable | Descripción                                        |
| :--------------------- | :--------- | :------ | :------------------------------------------------- |
| `id`                   | `integer`  | NO      | Clave primaria                                     |
| `id_cotizacion`        | `integer`  | NO      | FK a `cotizacion`                                  |
| `id_tramite_item`      | `integer`  | NO      | FK a `item_tramite`                                |
| `cantidad_existencias` | `smallint` | NO      | Unidades en stock (0 = Sin Existencia / Sin Stock) |
| `precio`               | `numeric`  | NO      | Precio unitario cotizado por el proveedor          |
| `especificacion`       | `text`     | NO      | Detalle técnico u observaciones de la oferta       |

---

### 5. `public.item_proveedor_tramite`

Registra el resultado de la adjudicación (proveedor(es) ganador(es) y cantidades asignadas por ítem).

| Columna             | Tipo       | Nulable | Descripción                          |
| :------------------ | :--------- | :------ | :----------------------------------- |
| `id`                | `integer`  | NO      | Clave primaria                       |
| `id_item_tramite`   | `integer`  | NO      | FK a `item_tramite`                  |
| `id_proveedor`      | `smallint` | NO      | FK a `proveedor`                     |
| `cantidad_proveida` | `smallint` | NO      | Cantidad adjudicada a este proveedor |
| `precio`            | `numeric`  | NO      | Precio unitario final adjudicado     |

---

## Validaciones y Reglas de Negocio en Modelo de Datos

1. **Suma de Adjudicación Dividida**:
   $$\sum \text{cantidad\_proveida} \le \text{cantidad\_solicitada}$$
2. **Filtro de Existencias**:
   Si `detalle_cotizacion.cantidad_existencias == 0`, la oferta queda bloqueada. No se puede insertar en `item_proveedor_tramite`.
3. **Filtro Techo de Precio Referencial**:
   Si `detalle_cotizacion.precio > item_tramite.precio`, la oferta queda deshabilitada.
4. **Liberación de Saldo**:
   $$\text{Monto Liberado} = \sum (\text{item\_tramite.cantidad\_solicitada} \times \text{item\_tramite.precio}) - \sum (\text{item\_proveedor\_tramite.cantidad\_proveida} \times \text{item\_proveedor\_tramite.precio})$$
