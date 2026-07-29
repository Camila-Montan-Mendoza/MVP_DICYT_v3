# Implementation Plan: Generación y Emisión de Órdenes de Compra, Órdenes de Servicio o Contratos

**Branch**: `009-emision-ordenes-contratos` | **Date**: 2026-07-29 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/009-emision-ordenes-contratos/spec.md`

## Summary

Implementar la generación, previsualización, emisión y registro de Órdenes de Compra, Órdenes de Servicio y Contratos por proveedor adjudicado en la **Tarea 9 (`Tarea9EmisionOrdenCompraActive`)** del workflow. La solución consulta los datos reales de adjudicación desde Supabase (`services/ordenesService.ts`), clasifica el tipo de documento según categoría y plazo (≤ 15 días vs. > 15 días), calcula las fechas límite de entrega (diferenciando bienes vs. servicios), convierte montos a texto literal oficial de la UMSS y despliega el modal de previsualización e impresión física oficial.

## Technical Context

**Language/Version**: TypeScript / Next.js 15 (React 19, Turbopack)
**Primary Dependencies**: Supabase JS SDK, Lucide React icons, TailwindCSS, shadcn/ui components (`@/components/ui`)
**Storage**: Supabase Postgres DB (`orden_contractual`, `detalle_orden_contractual`, `item_proveedor_tramite`, `historial_estado_tramite`)
**Testing**: Pruebas unitarias bien puntuales para el cálculo de fechas límite y conversión a texto literal (`tests/unit/ordenesValidation.test.ts`).
**Target Platform**: Navegador Web Desktop / Móvil (Responsive)
**Project Type**: Next.js App Router Web Application
**Performance Goals**: Carga de órdenes adjudicadas y previsualización de impresión en menos de 1 segundo.
**Constraints**: Uso estricto de tokens de diseño UMSS (`#003770`, `#BC000C`, `#001B47`), datos reales de Supabase (sin mocks), y cumplimiento de las reglas de cálculo de entrega.

## Constitution Check

_GATE: Pass_

- Principio I: Cumplimiento estricto del workflow y estrategia de compra menor.
- Principio VI: Disciplina estricta de datos reales en Supabase DB.

## Project Structure

### Documentation (this feature)

```text
specs/009-emision-ordenes-contratos/
├── spec.md              # Especificación funcional y de diseño
├── plan.md              # Plan de implementación técnica (este archivo)
├── research.md          # Investigación de reglas de entrega y servicio Supabase
├── data-model.md        # Modelo de entidades orden_contractual y detalle
├── quickstart.md        # Guía rápida de validación end-to-end
├── contracts/           # Contrato de servicio ordenesService.ts
└── mockups/             # Capturas de pantalla de la interfaz e impresión
```

### Source Code (repository root)

```text
components/
├── workflow/
│   └── views/
│       └── paso-2-recepcion/
│           ├── tarea-9-emision-orden-compra-active.tsx   # Vista activa del Responsable de Compras
│           └── tarea-9-emision-orden-compra-passive.tsx  # Vista pasiva de lectura
└── tramites/
    └── ordenes/
        ├── TarjetaOrdenProveedor.tsx                      # Tarjeta de orden/contrato por proveedor
        └── ModalImpresionOrden.tsx                        # Modal de impresión oficial UMSS / DICyT

lib/
└── utils/
    └── numero-a-letras.ts                                # Conversor a texto literal oficial UMSS

services/
└── ordenesService.ts                                      # Consultas y mutaciones de órdenes en Supabase

tests/
└── unit/
    └── ordenesValidation.test.ts                         # Pruebas unitarias de cálculo de fechas y literal
```

**Structure Decision**: Aplicación Next.js App Router integrando la lógica en `services/ordenesService.ts` y componentes reutilizables en `components/tramites/ordenes/` llamados desde `Tarea9EmisionOrdenCompraActive`.

## Complexity Tracking

> No constitution violations.
