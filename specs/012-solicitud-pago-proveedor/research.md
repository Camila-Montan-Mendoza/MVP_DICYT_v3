# Research: Generación y Envío de Solicitud de Pago a Proveedor

**Feature**: `012-solicitud-pago-proveedor`
**Date**: 2026-07-29

## Research Items

### 1. Conexión Real a Supabase y Backend (`services/solicitudPagoService.ts`)

- **Contexto**: El usuario exigió expresamente utilizar activamente el backend y Supabase para traer y registrar datos dentro de `Tarea13SolicitudPagoActive()`.
- **Decisión**: Crear el servicio dedicado `services/solicitudPagoService.ts` que consulta e interactúa con las tablas de Supabase:
  1. `obtenerSolicitudesPagoTramite(tramiteId: number)`: Consulta la orden de compra, el acta de recepción, la factura adjunta y los ítems adjudicados (`item_proveedor_tramite`, `orden_contractual`, `acta_recepcion`, `solicitud_pago`).
  2. `enviarSolicitudPago(params)`: Registra o actualiza la solicitud de pago en estado `PENDIENTE_REVISION` y notifica en `historial_estado_tramite`.
  3. `validarSolicitudPago(params)`: Aprueba la solicitud (`VALIDADA`), guarda la identidad del validador y fecha, y transiciona al siguiente paso (Memorándum de Pago / C-31).
  4. `observarSolicitudPago(params)`: Guarda el motivo obligatorio de observación, cambia el estado a `OBSERVADA` y devuelve la solicitud al Investigador Principal.

### 2. Réplica Fiel del Diseño del Mockup Institucional

- **Decisión**: Crear el componente `components/tramites/pago/TarjetaSolicitudPagoProveedor.tsx` que replica exactamente la tarjeta del mockup:
  - Acordeones por proveedor con badges de estado (`SIN ENVIAR`, `PENDIENTE REVISIÓN`, `VALIDADA`, `OBSERVADA`).
  - Columna Izquierda: Información General (Proyecto/Unidad), Documentos Adjuntos (`FACTURA.pdf`, `NOTA_ENTREGA.jpg`), botón `[ADJUNTAR EVIDENCIA]`.
  - Columna Derecha: Visor membretado "UMSS • DICyT Nota de Solicitud de Pago" con detalle del producto e importe, y el botón de acción flotante `[ENVIAR SOLICITUD DE PAGO]`.

### 3. Visor de Impresión y Plantilla Membretada

- **Decisión**: Crear el componente `components/tramites/pago/ModalImpresionNotaPago.tsx` para previsualizar e imprimir la Nota de Solicitud de Pago oficial de la UMSS.
