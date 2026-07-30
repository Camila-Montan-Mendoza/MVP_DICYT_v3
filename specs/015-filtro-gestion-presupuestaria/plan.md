# Implementation Plan: Filtro y Selector de Gestión Presupuestaria para la Consulta de Gastos

**Branch**: `015-filtro-gestion-presupuestaria` | **Date**: 2026-07-30 | **Spec**: [specs/015-filtro-gestion-presupuestaria/spec.md](spec.md)

**Input**: Feature specification from `/specs/015-filtro-gestion-presupuestaria/spec.md`

## Summary

Implementar un selector de Gestión Presupuestaria (ej: 2026, 2025, "Histórico Global") en el encabezado del módulo de Seguimiento de Gastos en `app/(dashboard)/seguimiento-gastos/page.tsx`. El selector permitirá filtrar reactivamente los saldos vigentes, montos ejecutados, gráfico Donut, barras por partida y lista de desgloses por año fiscal o acumulado plurianual.

## Technical Context

**Language/Version**: TypeScript 5.x / Next.js 16 (React 19)

**Primary Dependencies**: React state, Lucide SVG icons (`Calendar`, `Filter`, `Clock`), TailWind CSS, Supabase Client

**Storage**: Supabase Postgres (`presupuesto_gestion`, `proyecto`, `programa`, `partida_concreta`) + Fallback React State / Mocks

**Testing**: Estrategia MVP: Pruebas unitarias bien puntuales para el cálculo de métricas por gestión (Vitest).

**Target Platform**: Web Responsive (Desktop / Mobile)

**Project Type**: Next.js App Router Client Component / Hook (`useDashboardSeguimiento.ts`)

**Performance Goals**: Filtrado en cliente de métricas e interfaz en menos de 100ms.

**Constraints**: Seguir estrictamente `DESIGN.md` (Minimalist Wizard UI, cero emojis, colores institucional UMSS `#003770` y `#001B47`).

**Scale/Scope**: Módulo de Seguimiento de Gastos (`app/(dashboard)/seguimiento-gastos/page.tsx`).

## Constitution Check

- **Minimalist Wizard UI**: Cero emojis, uso de iconos Lucide SVG (`Calendar`, `Clock`). PASS.
- **Color Tokens**: Uso de `#003770` (UMSS Primary), `#001B47` (Headers/Text), `emerald-700` (Saldos Disponibles). PASS.
- **Persistencia**: Compatible con Supabase client y estado local mock. PASS.
- **Estrategia MVP de Pruebas**: Únicamente pruebas unitarias enfocadas en `metrics-calculator.ts`. PASS.

## Project Structure

### Documentation (this feature)

```text
specs/015-filtro-gestion-presupuestaria/
├── plan.md              # Este archivo
├── research.md          # Investigación de patrones de filtrado por gestión
├── data-model.md        # Modelo de entidad PresupuestoGestion
├── quickstart.md        # Guía rápida de prueba del selector de gestión
└── contracts/
    └── gestion-presupuestaria-contract.md # Contrato de interfaz del selector
```

### Source Code (repository root)

```text
app/(dashboard)/seguimiento-gastos/
└── page.tsx             # Integración del selector de gestión en la cabecera del módulo

src/features/seguimiento-gastos/
├── hooks/
│   └── useDashboardSeguimiento.ts # Inclusión del estado selectedGestion y recálculo por gestión
├── types/
│   └── index.ts        # Interfaces actualizadas con gestion y listado de gestiones
├── utils/
│   └── metrics-calculator.ts # Funciones auxiliares de filtrado por año fiscal
└── components/
    ├── PresupuestoExecutionPanel.tsx
    ├── ProyectoViewSection.tsx
    └── ProyectoPartidasDetail.tsx
```

**Structure Decision**: Aplicación Next.js App Router existente con componentes modulares en `src/features/seguimiento-gastos/`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| Ninguna | N/A | N/A |
