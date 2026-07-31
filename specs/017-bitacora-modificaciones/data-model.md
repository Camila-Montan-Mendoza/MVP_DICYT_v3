# Phase 1: Data Model - Bitácora de Modificaciones Presupuestarias

## Entidades Principales en Supabase

### 1. BitacoraModificacionPresupuestaria

Representa el evento de aprobación de un movimiento de modificación presupuestaria.

| Campo                    | Tipo   | Descripción                                  |
| ------------------------ | ------ | -------------------------------------------- |
| `id`                     | number | Identificador primario de la modificación    |
| `codigo`                 | string | Correlativo del registro (ej: MOD-2026-003)  |
| `justificacion`          | string | Motivo o justificación legal/técnica extensa |
| `tipo_modificacion`      | string | `'traspaso'` o `'incremento'`                |
| `fecha_aprobacion`       | string | Fecha de aprobación oficial                  |
| `usuario_autorizador`    | string | Nombre y cargo del autorizador               |
| `documento_respaldo_url` | string | Enlace opcional al archivo PDF               |

### 2. DetalleModificacionPresupuestaria

Representa el impacto individual (+ o -) en una partida concreta.

| Campo                  | Tipo   | Descripción                              |
| ---------------------- | ------ | ---------------------------------------- |
| `id`                   | number | Identificador primario                   |
| `id_bitacora`          | number | Referencia a la modificación             |
| `id_partida_concreta`  | number | Referencia a la partida afectada         |
| `monto_modificado`     | number | Importe del movimiento                   |
| `tipo_impacto`         | string | `'disminucion'` (-) o `'incremento'` (+) |
| `presupuesto_anterior` | number | Saldo de la partida antes del movimiento |
| `presupuesto_nuevo`    | number | Saldo vigente resultante                 |
