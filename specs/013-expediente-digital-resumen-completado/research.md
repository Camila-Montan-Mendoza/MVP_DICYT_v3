# Research: Expediente Digital de Respaldos y Resumen de Trámite Completado (Paso 4)

**Feature**: `013-expediente-digital-resumen-completado`
**Date**: 2026-07-29

## Research Items

### 1. Conexión Real a Supabase y Backend (`services/expedienteService.ts`)

- **Contexto**: El usuario solicitó expresamente implementar la conexión a backend y Supabase para traer y registrar datos tanto en `Tarea18ExpedienteDigitalActive()` como en `Tarea19TramiteCompletadoActive()`.
- **Decisión**: Crear el servicio dedicado `services/expedienteService.ts` para interactuar con Supabase:
  1. `obtenerArchivosExpediente(tramiteId: number)`: Consulta los respaldos registrados en `expediente_digital`. Se auto-puebla por defecto con los documentos generados en pasos anteriores (Factura, Nota de Entrega, Orden de Compra, Nota de Pago) si el expediente aún está vacío.
  2. `guardarArchivoExpediente(params)`: Almacena nuevos respaldos cargados por el usuario.
  3. `eliminarArchivoExpediente(archivoId: number)`: Remueve archivos en borrador antes de la archivación final.
  4. `archivarExpedienteFinal(tramiteId: number)`: Consolida la archivación definitiva en Supabase y transiciona a la Tarea 19.
  5. `obtenerResumenEjecutivoTramite(tramiteId: number)`: Consulta de forma consolidada todos los hitos del trámite (Paso 1: Solicitud, Paso 2: Recepción, Paso 3: Pago, Paso 4: Expediente) para renderizar el resumen ejecutivo de la Tarea 19.

### 2. Réplica Fiel del Diseño del Mockup Institucional ("Resumen de archivos")

- **Decisión**: Crear el componente `components/tramites/evidencia/TarjetaResumenArchivos.tsx` que replica la maqueta:
  - Header: **Resumen de archivos**
  - Zona de Carga: Rectángulo punteado **Adjuntar archivo** con ícono de subir `(^)`.
  - Lista de Archivos: Ícono por tipo (rojo PDF / azul Imagen), nombre truncado (ej. `Acta_Lapt...`), peso (MB/KB), y botones de acción (Ojo previsualizador + Papelera roja).
  - Botón Principal: **"Archivar respaldos"** (Azul Marino `#001B47`).

### 3. Ficha de Resumen Ejecutivo Integral (Tarea 19)

- **Decisión**: Crear el componente `components/tramites/evidencia/FichaResumenEjecutivoTramite.tsx` para renderizar el consolidado final del trámite en la Tarea 19 con el badge `TRÁMITE COMPLETADO Y ARCHIVADO`.
