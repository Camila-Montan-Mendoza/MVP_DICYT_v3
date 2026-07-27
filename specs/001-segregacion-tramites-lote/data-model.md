# Data Model: Creación y Envío de Trámites de Adquisición Divididos por Tipo de Compra

**Feature**: `001-segregacion-tramites-lote`  
**Date**: 2026-07-27  

## Data Entities & TypeScript Interfaces

### 1. `ItemCategoria` (Enum)
Categoría estricta de compras permitida:
- `"MATERIAL"`
- `"ACTIVO_FIJO"`
- `"SERVICIO"`

### 2. `EstadoTramite` (Enum)
Estado del ciclo de vida del trámite:
- `"BORRADOR"`
- `"ENVIADO"`
- `"CON_ERRORES"`

### 3. `ItemSolicitud` (Entity)
Representa un ítem individual dentro de la lista de pedido o de un trámite segregado.

```typescript
export interface ItemSolicitud {
  id: string;
  nombre: string;
  categoria: 'MATERIAL' | 'ACTIVO_FIJO' | 'SERVICIO';
  cantidad?: number; // Requerido en Material / Activo Fijo
  unidad?: string;   // Requerido en Material / Activo Fijo
  precioUnitario?: number; // Requerido en Material / Activo Fijo
  precioReferencial: number; // Calculado (cantidad * precioUnitario) o directo en Servicio
  detalleServicio?: string;  // Requerido si categoria === 'SERVICIO'
  partidaPresupuestaria: string; // Código sugerido o "Pendiente de asignación"
  documentotecnicoPath?: string; // Path a ET (Material/Activo) o TDR (Servicio)
  documentotecnicoNombre?: string;
}
```

### 4. `TramiteSolicitud` (Entity)
Representa un trámite administrativo homogeneizado por categoría.

```typescript
export interface TramiteSolicitud {
  id: string;
  codigoSeguimiento?: string; // ej. "TR-2026-0042" (generado al enviar)
  categoria: 'MATERIAL' | 'ACTIVO_FIJO' | 'SERVICIO';
  estado: 'BORRADOR' | 'ENVIADO' | 'CON_ERRORES';
  justificacion: string;
  archivosRespaldo: Array<{ id: string; nombre: string; path: string }>;
  custodioNombre?: string;   // Obligatorio solo si categoria === 'ACTIVO_FIJO'
  custodioUbicacion?: string;// Obligatorio solo si categoria === 'ACTIVO_FIJO'
  items: ItemSolicitud[];
  erroresValidacion?: string[]; // Para destacar visualmente en la UI
  fechaCreacion: string;
  fechaEnvio?: string;
}
```

### 5. `EnvíoLoteResultado` (Value Object)
Resultado del envío masivo resiliente.

```typescript
export interface EnvioLoteResultado {
  tramitesExitosos: Array<{ id: string; codigoSeguimiento: string; categoria: string }>;
  tramitesFallidos: Array<{ id: string; categoria: string; errores: string[] }>;
}
```

## State Validation Rules

- **Segregación Estricta**: Ningún objeto `TramiteSolicitud` debe contener ítems de más de una categoría.
- **Validación Materiales / Activos Fijos**: Exige `cantidad > 0`, `unidad` no vacía, `precioUnitario > 0` y `documentotecnicoPath` (ET).
- **Validación Servicios**: Exige `detalleServicio` no vacío, `precioReferencial > 0` y `documentotecnicoPath` (TDR PDF).
- **Validación Cabecera Activos Fijos**: Exige `custodioNombre` y `custodioUbicacion` no vacíos.
- **Validación Archivos Respaldo**: Exige al menos un archivo en `archivosRespaldo` por cada trámite antes del envío.
