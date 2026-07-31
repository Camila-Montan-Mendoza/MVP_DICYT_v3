# Implementation Plan: Traza Detallada de Trámites e Impacto Presupuestario por Partida Concreta

**Branch**: `016-traza-tramites-partida` | **Date**: 2026-07-30 | **Spec**: [specs/016-traza-tramites-partida/spec.md](spec.md)

**Input**: Feature specification from `/specs/016-traza-tramites-partida/spec.md` + directivas de usuario (UI estilo Jira con panel lateral detallado a la derecha, consulta 100% real a Supabase sin datos mockeados).

## Summary

Implementar la visualización y auditoría de la traza de trámites por partida presupuestaria conectada directamente a Supabase (consultando las tablas `partida_concreta`, `item_tramite`, `tramite`, `partida`). La interfaz adoptará un patrón de diseño **estilo Jira (Split View / Drawer Lateral)**: al hacer clic en cualquier fila de partida o trámite, se abre un panel lateral por la derecha desplazando suavemente la lista principal para desplegar los detalles completos de afectación, estados e ítems sin recargar la pantalla.

## Technical Context

**Language/Version**: TypeScript 5.x / Next.js 16 (React 19)

**Primary Dependencies**: Supabase SSR Client (`@/lib/supabase/client`), Lucide SVG Icons (`FileText`, `ChevronRight`, `X`, `Clock`, `CheckCircle2`), TailWind CSS

**Storage**: Base de datos de producción Supabase Postgres (`partida_concreta`, `item_tramite`, `tramite`, `partida`). Cero datos mockeados.

**Testing**: Estrategia MVP: Pruebas unitarias bien puntuales únicamente para la función de transformación y filtrado de trámites por partida.

**Target Platform**: Web Responsive dentro de `<SigefiShell>` con sidebar principal.

**Project Type**: Next.js App Router Client Component / Feature Module (`src/features/traza-tramites/`)

**Performance Goals**: Carga de la traza desde Supabase en menos de 800ms.

**Constraints**:
- UI Tipo Jira: Panel lateral deslizable a la derecha (`w-full md:w-96 lg:w-[480px]`).
- Consulta 100% real a Supabase (sin fallbacks mockeados).
- Cumplimiento de `DESIGN.md` (colores UMSS `#003770` y `#001B47`, cero emojis, badges de estado semánticos).

## Constitution Check

- **Diseño Jira Split View**: Tabla limpia en el centro + Panel lateral deslizable por la derecha. PASS.
- **Conexión Directa a Supabase**: Consume relaciones entre `partida_concreta`, `item_tramite` y `tramite`. PASS.
- **Cero Emojis & Iconografía Lucide SVG**: Iconos `FileText`, `Clock`, `CheckCircle2`, `AlertTriangle`. PASS.
- **Testing MVP**: Pruebas unitarias focalizadas en transformadores de consulta. PASS.

## Project Structure

### Documentation (this feature)

```text
specs/016-traza-tramites-partida/
├── plan.md              # Este archivo
├── research.md          # Patrón Jira Split-View y consultas relacionales en Supabase
├── data-model.md        # Relaciones Postgres entre partida_concreta, item_tramite y tramite
├── quickstart.md        # Guía rápida de prueba de la traza estilo Jira
└── contracts/
    └── traza-tramites-contract.md # Esquema de respuesta y props del componente
```

### Source Code (repository root)

```text
app/(dashboard)/traza-tramites/
└── page.tsx             # Vista accesible desde el sidebar principal en <SigefiShell>

src/features/traza-tramites/
├── api/
│   └── fetchTrazaTramites.ts # Consultas SQL relacionales a Supabase
├── hooks/
│   └── useTrazaTramites.ts   # Hook para obtener partidas y trámites reales
├── components/
│   ├── TrazaPartidasList.tsx  # Fila/Tabla principal estilo Jira
   └── TrazaDetailSidebar.tsx # Panel lateral desplegable por la derecha con el detalle completo
```

**Structure Decision**: Módulo independiente en `src/features/traza-tramites/` integrado en la navegación lateral de `<SigefiShell>`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| Ninguna | N/A | N/A |
