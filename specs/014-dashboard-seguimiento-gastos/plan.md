# Implementation Plan: Dashboard Principal Adaptativo de Seguimiento de Gastos según Rol

**Branch**: `014-dashboard-seguimiento-gastos` | **Date**: 2026-07-30 | **Spec**: [specs/014-dashboard-seguimiento-gastos/spec.md](spec.md)

**Input**: Feature specification from `/specs/014-dashboard-seguimiento-gastos/spec.md`

## Summary

Implementar un Dashboard de Seguimiento de Gastos de solo lectura en la ruta `/seguimiento-gastos` de Next.js App Router, adaptando sus tarjetas informativas, barras de progreso y gráficos SVG (barras y donut) según los roles del usuario (`Coordinador de Programa` vs. `Investigador Principal / Tutor`). Ofrecerá un conmutador gráfico de ámbito ("Visión Programa" / "Mis Proyectos") para usuarios multirrol y presentará las 5 métricas clave calculadas directamente desde Supabase sin emojis y respetando `DESIGN.md`.

## Technical Context

**Language/Version**: TypeScript 5+, Next.js 14+ (App Router), React 18+

**Primary Dependencies**: Next.js App Router, `@supabase/ssr`, `@supabase/supabase-js`, `lucide-react`, ShadCN UI, Tailwind CSS

**Storage**: Supabase PostgreSQL (`programa_usuario`, `proyecto_usuario`, `programa`, `proyecto`, `presupuesto_gestion`, `partida_concreta`, `tramite`, `item_tramite`)

**Testing**: Targeted unit tests (`pruebas unitarias bien puntuales`) for financial metric calculation helper functions in `src/features/seguimiento-gastos/utils/metrics-calculator.ts`.

**Target Platform**: Web (Desktop auto-expanding sidebar `w-16` to `w-64`, Mobile bottom bar `h-16` with `pb-16` margin)

**Project Type**: Next.js Web Application

**Performance Goals**: Dashboard render and initial calculations < 1.5s; Client-side scope tab switch < 200 ms.

**Constraints**: Read-only interface, zero emojis (Lucide icons only), UMSS color tokens (`#003770` Azul, `#BC000C` Rojo, `#001B47` Dark Blue), zero in-memory mock data.

**Scale/Scope**: Single page `/seguimiento-gastos` with 5 metric cards, 2 SVG charts, 2 view modes, and PDF print layout.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- **Principle I (RBAC & Dynamic Views)**: PASS — Adapts UI views dynamically for Coordinador (Program & Subprograms) vs. Investigador (Proyectos) and Multirrol switcher.
- **Principle II (Minimalist Wizard UI & Zero Emojis)**: PASS — Clean step/tab architecture, zero emojis, Lucide SVG icons only, UMSS tokens `#003770` and `#BC000C`.
- **Principle III (Modular React Architecture)**: PASS — Container/Presentational decoupled pattern, custom hook `useDashboardSeguimiento`, modular feature components.
- **Principle IV (Functional Core Scope)**: PASS — Focuses on core read-only financial tracking for programs and projects.
- **Principle V & VI (Supabase Integrity & Real Database Persistence)**: PASS — Reads directly from Supabase PostgreSQL tables without static mock arrays; fail-fast empty states.

## Project Structure

### Documentation (this feature)

```text
specs/014-dashboard-seguimiento-gastos/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   └── dashboard-interface-contract.md
└── tasks.md             # Phase 2 output (/speckit-tasks command)
```

### Source Code (repository root)

```text
src/
├── app/
│   └── seguimiento-gastos/
│       └── page.tsx                         # Página principal de solo lectura
├── features/
│   └── seguimiento-gastos/
│       ├── hooks/
│       │   └── useDashboardSeguimiento.ts   # Custom Hook de lectura y agregación Supabase
│       ├── components/
│       │   ├── GlobalMetricsCards.tsx       # Tarjetas de las 5 métricas clave
│       │   ├── ScopeSwitcher.tsx            # Conmutador "Visión Programa" vs "Mis Proyectos"
│       │   ├── ProgramaViewSection.tsx      # Vista consolidada de Programa y Subprogramas
│       │   ├── ProyectoViewSection.tsx      # Vista de tarjetas de Proyectos e ítems
│       │   ├── FinancialChartsSection.tsx   # Gráficos SVG (Barras por partida + Donut)
│       │   └── EmptyDashboardState.tsx      # Estado vacío sobrio con icono Lucide
│       └── utils/
│           └── metrics-calculator.ts        # Funciones puras de cálculo presupuestario
```

**Structure Decision**: Single Next.js web application utilizing modular feature-based folder organization (`src/features/seguimiento-gastos/`).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| None      | N/A        | All constitution principles met.     |
