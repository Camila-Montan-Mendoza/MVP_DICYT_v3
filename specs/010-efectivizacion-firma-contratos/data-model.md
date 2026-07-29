# Data Model: Efectivización y Firma de Documentos Contractuales

**Feature**: `010-efectivizacion-firma-contratos`
**Date**: 2026-07-29

## Database Entities (Supabase / Postgres)

### Update to `orden_contractual`

Representa el estado de firmas y efectivización de la orden o contrato emitida.

| Campo                  | Tipo          | Descripción                                           |
| ---------------------- | ------------- | ----------------------------------------------------- |
| `firmado_coordinador`  | `boolean`     | `true` si la firma del Coordinador está verificada    |
| `firmado_director`     | `boolean`     | `true` si la firma del Director DICyT está verificada |
| `firmado_proveedor`    | `boolean`     | `true` si la firma del Proveedor está verificada      |
| `fecha_efectivizacion` | `timestamp`   | Fecha oficial en que se formalizó y notificó          |
| `estado`               | `varchar(30)` | Transiciona a `'EFECTUADO_Y_FIRMADO'`                 |

---

## State Transitions

```mermaid
stateDiagram-v2
    [*] --> EMITIDO: Órdenes creadas en Tarea 9
    EMITIDO --> EFECTUADO_Y_FIRMADO: Confirmar firmas en Tarea 10
    EFECTUADO_Y_FIRMADO --> EN_ESPERA_ENTREGA: Transición a Paso 2 Tarea 11
    EN_ESPERA_ENTREGA --> [*]
```
