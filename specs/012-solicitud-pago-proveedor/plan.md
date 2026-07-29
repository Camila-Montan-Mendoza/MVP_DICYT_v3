# Implementation Plan: Generación y Envío de Solicitud de Pago a Proveedor

**Branch**: `012-solicitud-pago-proveedor` | **Date**: 2026-07-29 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/012-solicitud-pago-proveedor/spec.md`

## Summary

Implementar la conexión real al backend y a Supabase PostgreSQL para la **Tarea 13 (`Tarea13SolicitudPagoActive`)** en el Paso 3 (Pago a Proveedor). Se autogenerará la solicitud de pago por proveedor adjudicado (`solicitud_pago`), pre-llenando montos, ítems y la vista previa de la "UMSS • DICyT Nota de Solicitud de Pago" membretada, administrando los estados (`SIN_ENVIAR`, `PENDIENTE_REVISION`, `VALIDADA`, `OBSERVADA`) y permitiendo validar o registrar observaciones obligatorias.

## Technical Context

**Language/Version**: TypeScript / Next.js 15 (React 19, Turbopack)
**Primary Dependencies**: Supabase JS SDK, Lucide React icons, TailwindCSS, shadcn/ui components
**Storage**: Supabase Postgres DB (`solicitud_pago`, `acta_recepcion`, `orden_contractual`, `historial_estado_tramite`)
**Testing**: Pruebas unitarias para validación de montos y motivos de observación obligatorios (`tests/unit/solicitudPagoValidation.test.ts`).
**Target Platform**: Navegador Web Desktop / Móvil (Responsive)
**Project Type**: Next.js App Router Web Application
**Performance Goals**: Carga de solicitudes de pago y previsualización membretada en < 1 segundo.
**Constraints**: Fiel reproducción del diseño institucional del mockup e integración directa en `components/workflow/views/paso-3-pago/tarea-13-solicitud-pago-active.tsx`.

## Constitution Check

_GATE: Pass_

## Project Structure

### Documentation (this feature)

```text
specs/012-solicitud-pago-proveedor/
├── spec.md              # Especificación funcional
├── plan.md              # Plan de implementación técnica (este archivo)
├── research.md          # Investigación de backend Supabase y componentes UI
├── data-model.md        # Modelo de entidades solicitud_pago
├── quickstart.md        # Guía rápida de validación
└── contracts/           # Contrato de servicio solicitudPagoService.ts
```

### Source Code (repository root)

```text
components/
├── workflow/
│   └── views/
│       └── paso-3-pago/
│           ├── tarea-13-solicitud-pago-active.tsx   # Vista activa con datos Supabase
│           └── tarea-13-solicitud-pago-passive.tsx  # Vista pasiva de lectura
└── tramites/
    └── pago/
        ├── TarjetaSolicitudPagoProveedor.tsx        # Acordeón de solicitud por proveedor
        └── ModalImpresionNotaPago.tsx               # Visor membretado "UMSS • DICyT Nota de Solicitud de Pago"

services/
└── solicitudPagoService.ts                           # Conexión real Supabase DB
```

**Structure Decision**: Aplicación Next.js App Router implementando el módulo de solicitudes de pago dentro de `tarea-13-solicitud-pago-active.tsx` con componentes en `components/tramites/pago/`.
