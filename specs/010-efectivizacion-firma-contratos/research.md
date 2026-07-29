# Research: Efectivización, Firma de Documentos Contractuales y Confirmación de Espera de Entrega

**Feature**: `010-efectivizacion-firma-contratos`
**Date**: 2026-07-29

## Research Items

### 1. Diseño Simplificado Orientado a la Acción Directa

- **Contexto**: El usuario solicitó explícitamente que la vista de la Tarea 10 no vuelva a renderizar la tabla con todos los detalles e ítems desglosados (como en la Tarea 9), sino que sea una interfaz directa para lanzar la impresión del documento oficial en 1 solo clic y confirmar las firmas.
- **Decisión**: Crear el componente `components/tramites/ordenes/TarjetaEfectivizacionProveedor.tsx` que muestra únicamente:
  1. Cabecera con Nombre de Proveedor, NIT, Tipo de Documento y Monto Total.
  2. Botón directo de 1 solo clic "Imprimir Documento Oficial" que abre el `ModalImpresionOrden`.
  3. Checklist interactivo de firmas: `[ ] Firma Coordinador`, `[ ] Firma Director DICyT`, `[ ] Firma Proveedor`.
  4. Indicador de fecha límite y estado de efectivización.

### 2. Persistencia en Supabase (`services/ordenesService.ts`)

- **Decisión**: Extender `services/ordenesService.ts` agregando la función:
  - `confirmarEfectivizacionYFirmas(params)`: Actualiza las órdenes contractuales en Supabase marcando `firmado_coordinador`, `firmado_director`, `firmado_proveedor`, `fecha_efectivizacion` y `estado = 'EFECTUADO_Y_FIRMADO'`, e inserta la auditoría en `historial_estado_tramite`.

### 3. Conteo de Días Restantes (Cronómetro de Entrega)

- **Decisión**: Implementar la función de utilidad `calcularDiasRestantes(fechaLimiteIso: string)` que compara la fecha actual con la fecha de entrega y retorna el estado (`"3 DÍAS RESTANTES"`, `"ENTREGA HOY"`, `"VENCIDO HACE 2 DÍAS"`).
