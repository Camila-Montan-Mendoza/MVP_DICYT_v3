# Implementation Plan: Creación y Envío de Trámites de Adquisición Divididos por Tipo de Compra

**Branch**: `001-segregacion-tramites-lote` | **Date**: 2026-07-27 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-segregacion-tramites-lote/spec.md`

## Summary

Implementar la auto-clasificación y segregación estricta de solicitudes de compra en hasta 3 trámites homogeneizados por categoría (Materiales, Activos Fijos y Servicios), la edición de datos técnicos/documentos obligatorios (ET/TDR), el enriquecimiento de partidas presupuestarias externas con fallback, y el envío de trámites individual o en lote resiliente (non-blocking). Todo el desarrollo UI utilizará componentes estilizados de `shadcn/ui` y los tokens institucionales UMSS definidos en `DESIGN.md`.

## Technical Context

**Language/Version**: Next.js 15 (TypeScript, React 19, Node.js)

**Primary Dependencies**: TailwindCSS, `shadcn/ui` components (`@/shared/ui`), `@supabase/supabase-js`, `lucide-react`

**Storage**: Supabase Postgres Database + Supabase Storage (`requisition-attachments` bucket para ET, TDR y Proformas)

**Testing**: MVP Strategy: Targeted unit tests only ("pruebas unitarias bien puntuales") para la función de segregación `segregateItemsToRequisitions` y la validación de envío en lote resiliente. Evitar suites de pruebas exhaustivas o E2E para mantener alta velocidad de desarrollo.

**Target Platform**: Web Browsers (Desktop y Móvil responsivo con margen `pb-16`)

**Project Type**: Next.js Web Application

**Performance Goals**: Auto-clasificación instantánea en el cliente (<50ms), consulta de partidas presupuestarias con timeout de 1.5s.

**Constraints**: Segregación estricta 100% homogénea (0% mezcla de categorías por trámite). Cumplimiento estricto de los tokens y reglas minimalistas de `DESIGN.md`.

**Scale/Scope**: Módulo de Registro de Solicitudes de Compras en el Portal DICYT.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- **MVP Validation Focus**: Aprobado. Pruebas puntuales acotadas a la lógica de negocio central.
- **Design Tokens**: Aprobado. Integración de variables institucionales `--primary: #003770` y `--secondary: #BC000C`.

## Project Structure

### Documentation (this feature)

```text
specs/001-segregacion-tramites-lote/
├── plan.md              # Este plan de implementación
├── research.md          # Investigación técnica y decisiones (Fase 0)
├── data-model.md        # Entidades y tipos TypeScript (Fase 1)
├── quickstart.md        # Guía rápida de validación manual y pruebas (Fase 1)
├── contracts/           # Especificación de Endpoints API (Fase 1)
│   └── requisitions-api.md
└── checklists/
    └── requirements.md  # Checklist de calidad de especificación
```

### Source Code (repository root)

```text
app/
├── (requisitions)/
│   └── requisitions/
│       └── page.tsx                 # Vista principal de registro y segregación de trámites
components/
├── requisitions/
│   ├── item-input-form.tsx          # Formulario para agregar ítems a la lista inicial
│   ├── tramite-card-header.tsx      # Cabecera por trámite (Justificación, Respaldos, Custodio)
│   ├── tramite-item-row.tsx         # Fila/detalle por ítem (Cantidad, ET/TDR, Partida)
│   └── batch-submit-bar.tsx         # Barra de envío individual y en lote resiliente
lib/
├── requisitions/
│   ├── segregator.ts                # Lógica pura de auto-clasificación y segregación (Unit Test target)
│   └── budget-service.ts            # Servicio de consulta externa de partidas con fallback
types/
└── requisitions.ts                  # Interfaces TypeScript (TramiteSolicitud, ItemSolicitud)
```

**Structure Decision**: Estructura estándar Next.js App Router modularizando componentes de trámites bajo `components/requisitions/` y la lógica pura de segregación/dominio bajo `lib/requisitions/`.

## Complexity Tracking

> **Sin violaciones ni complejidad adicional requerida.**
