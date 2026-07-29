# Implementation Plan: Registro del Acta de Recepción Provisional o Definitiva de Materiales

**Branch**: `011-acta-recepcion-materiales` | **Date**: 2026-07-29 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/011-acta-recepcion-materiales/spec.md`

## Summary

Consolidar la etapa de recepción en la **Tarea 11 (`Tarea11RecepcionProvisionalActive`)** renombrada conceptualmente como **"Recepción"**, ofreciendo conexión directa a Supabase DB (`services/recepcionService.ts`), previsualización del documento membretado "UMSS - DAF ACTA DE RECEPCIÓN", carga de factura/evidencia y 2 transiciones posibles: **Acta Provisional** (re-circulante en la tarea) o **Acta Definitiva** (avanza al Paso 3 Pago a Proveedor). Se elimina la vista obsoleta `Tarea12RecepcionDefinitivaActive`.

## Technical Context

**Language/Version**: TypeScript / Next.js 15 (React 19, Turbopack)
**Primary Dependencies**: Supabase JS SDK, Lucide React icons, TailwindCSS, shadcn/ui components
**Storage**: Supabase Postgres DB (`acta_recepcion`, `detalle_acta_recepcion`, `orden_contractual`, `historial_estado_tramite`)
**Testing**: Pruebas unitarias para validación del formulario de recepción y requerimientos de factura (`tests/unit/recepcionValidation.test.ts`).
**Target Platform**: Navegador Web Desktop / Móvil (Responsive)
**Project Type**: Next.js App Router Web Application
**Performance Goals**: Carga de materiales y previsualización de acta membretada en < 1 segundo.
**Constraints**: Cumplimiento del diseño identico al mockup institucional (UMSS DAF), eliminación de `Tarea12RecepcionDefinitivaActive` y persistencia real en Supabase DB.

## Constitution Check

_GATE: Pass_

## Project Structure

### Documentation (this feature)

```text
specs/011-acta-recepcion-materiales/
├── spec.md              # Especificación funcional
├── plan.md              # Plan de implementación técnica (este archivo)
├── research.md          # Investigación de consolidación en Tarea 11 y borrado de Tarea 12
├── data-model.md        # Modelo de entidades acta_recepcion y detalle
├── quickstart.md        # Guía rápida de validación
└── contracts/           # Contrato de servicio recepcionService.ts
```

### Source Code (repository root)

```text
components/
├── workflow/
│   └── views/
│       └── paso-2-recepcion/
│           ├── tarea-11-recepcion-provisional-active.tsx   # Vista activa consolidada "Recepción"
│           └── tarea-11-recepcion-provisional-passive.tsx  # Vista pasiva de lectura
└── tramites/
    └── ordenes/
        ├── TarjetaRecepcionProveedor.tsx                   # Formulario e insumos por proveedor
        └── ModalImpresionActaRecepcion.tsx                 # Visor PDF membretado "UMSS - DAF ACTA DE RECEPCIÓN"

services/
└── recepcionService.ts                                      # Conexión real Supabase DB
```

**Structure Decision**: Aplicación Next.js App Router integrando la recepción consolidada en `tarea-11-recepcion-provisional-active.tsx` y eliminando los componentes de Tarea 12.
