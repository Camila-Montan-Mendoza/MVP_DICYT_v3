# Implementation Plan: Efectivización, Firma de Documentos Contractuales y Confirmación de Espera de Entrega

**Branch**: `010-efectivizacion-firma-contratos` | **Date**: 2026-07-29 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/010-efectivizacion-firma-contratos/spec.md`

## Summary

Implementar la Tarea 10 (**`Tarea10FirmaDocumentosActive`**) del workflow con un diseño simplificado enfocado en la acción rápida (`/frontend-design`): botón de impresión directa de 1 solo clic (`ModalImpresionOrden`), checklist interactivo de confirmación de firmas (Coordinador, Director DICyT, Proveedor), persistencia de efectivización en Supabase (`services/ordenesService.ts`), e indicador visual de conteo de días restantes para la espera de materiales/servicios.

## Technical Context

**Language/Version**: TypeScript / Next.js 15 (React 19, Turbopack)
**Primary Dependencies**: Supabase JS SDK, Lucide React icons, TailwindCSS, shadcn/ui components
**Storage**: Supabase Postgres DB (`orden_contractual`, `historial_estado_tramite`)
**Testing**: Pruebas unitarias para validación del checklist de firmas obligatorias (`tests/unit/efectivizacionValidation.test.ts`).
**Target Platform**: Navegador Web Desktop / Móvil (Responsive)
**Project Type**: Next.js App Router Web Application
**Performance Goals**: Impresión directa de 1 clic en < 500ms y confirmación instantánea de efectivización.
**Constraints**: Cumplimiento del diseño minimalista de `DESIGN.md` con tokens de color de la UMSS (`#003770`, `#001B47`, `#BC000C`).

## Constitution Check

_GATE: Pass_

## Project Structure

### Documentation (this feature)

```text
specs/010-efectivizacion-firma-contratos/
├── spec.md              # Especificación funcional
├── plan.md              # Plan de implementación técnica (este archivo)
├── research.md          # Investigación de interfaz simplificada e impresión directa
├── data-model.md        # Actualización de modelo de firmas y efectivización
├── quickstart.md        # Guía rápida de validación
└── contracts/           # Contrato de servicio confirmarEfectivizacionYFirmas
```

### Source Code (repository root)

```text
components/
├── workflow/
│   └── views/
│       └── paso-2-recepcion/
│           ├── tarea-10-firma-documentos-active.tsx   # Vista activa Tarea 10
│           └── tarea-10-firma-documentos-passive.tsx  # Vista pasiva Tarea 10
└── tramites/
    └── ordenes/
        └── TarjetaEfectivizacionProveedor.tsx         # Tarjeta simplificada de firmas e impresión

services/
└── ordenesService.ts                                  # Extensión con confirmarEfectivizacionYFirmas
```

**Structure Decision**: Aplicación Next.js App Router integrando la lógica en `components/workflow/views/paso-2-recepcion/tarea-10-firma-documentos-active.tsx` y `TarjetaEfectivizacionProveedor.tsx`.
