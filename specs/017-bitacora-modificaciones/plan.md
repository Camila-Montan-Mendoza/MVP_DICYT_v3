# Implementation Plan: Consulta y Monitoreo de la Bitácora de Modificaciones Presupuestarias

**Branch**: `017-bitacora-modificaciones` | **Date**: 2026-07-30 | **Spec**: [specs/017-bitacora-modificaciones/spec.md](spec.md)

**Input**: Feature specification from `/specs/017-bitacora-modificaciones/spec.md` + directivas del usuario (Navegación "Historial de modificaciones presupuestarias", selectores de Programa, Proyecto y Gestión Fiscal, Sidebar lateral derecho para justificaciones largas y evolución de partidas afectadas, conexión real a Supabase).

## Summary

Implementar la vista de auditoría para el **Historial de Modificaciones Presupuestarias** en la ruta `/historial-modificaciones-presupuestarias`. La interfaz contará con selectores de **Programa**, **Proyecto** y **Gestión Fiscal** en el encabezado. La tabla principal exhibirá las modificaciones aprobadas (Traspasos e Incrementos), y al interactuar con cualquier fila, se desplegará un **panel lateral a la derecha (Jira Split View)** para consultar la justificación extensa completa, el usuario autorizador, el documento respaldatorio y la **evolución del presupuesto vigente** en cada partida afectada (`Presupuesto Inicial +/- Ajuste = Presupuesto Vigente Resultante`).

## Technical Context

**Language/Version**: TypeScript 5.x / Next.js 16 (React 19)

**Primary Dependencies**: Supabase SSR Client (`@/lib/supabase/client`), Lucide SVG Icons (`History`, `Filter`, `Calendar`, `ArrowLeftRight`, `TrendingUp`, `X`), TailWind CSS

**Storage**: Tablas Supabase Postgres (`bitacora_modificacion_presupuestaria`, `detalle_modificacion_presupuestaria`, `partida_concreta`, `partida`). Conexión real con fallback resiliente.

**Testing**: Estrategia MVP: Pruebas unitarias focalizadas únicamente para la función de cálculo de evolución de saldos por partida modificada.

**Target Platform**: Web Responsive dentro de `<SigefiShell>` con acceso directo en la navegación lateral.

**Project Type**: Next.js App Router Client Component / Feature Module (`src/features/bitacora-modificaciones/`)

**Performance Goals**: Carga del historial y apertura del sidebar lateral en menos de 500ms.

**Constraints**:

- UI Tipo Jira: Tabla principal + Panel lateral deslizable a la derecha (`w-full md:w-96 lg:w-[540px]`).
- Selectores triples en cabecera: Programa, Proyecto y Gestión Fiscal.
- Cumplimiento estricto de `DESIGN.md` (sin emojis, colores institucional UMSS `#003770` y `#001B47`).

## Constitution Check

- **Diseño Jira Split View**: Tabla + Sidebar derecho para justificación larga. PASS.
- **Navegación Lateral `<SigefiShell>`**: Opción "Historial de modificaciones presupuestarias". PASS.
- **Iconografía SVG Lucide**: `History`, `TrendingUp`, `ArrowLeftRight`, `FileText`. PASS.
- **Testing MVP**: Prueba unitaria puntual en cálculo de saldos vigentes. PASS.

## Project Structure

### Documentation (this feature)

```text
specs/017-bitacora-modificaciones/
├── plan.md              # Este archivo
├── research.md          # Patrón de consulta relacional y evolución de partidas
├── data-model.md        # Relaciones entre bitacora_modificacion y detalle_modificacion
├── quickstart.md        # Guía rápida de prueba de la bitácora
└── contracts/
    └── bitacora-modificaciones-contract.md # Props e interfaces
```

### Source Code (repository root)

```text
app/(dashboard)/historial-modificaciones-presupuestarias/
└── page.tsx             # Ruta física accesible desde el sidebar principal

src/features/bitacora-modificaciones/
├── api/
│   └── fetchBitacoraModificaciones.ts # Consultas a Supabase
├── hooks/
│   └── useBitacoraModificaciones.ts   # Hook de estado y filtrado reactivo
├── components/
│   ├── BitacoraModificacionesList.tsx # Tabla principal de modificaciones
    └── BitacoraDetailSidebar.tsx      # Sidebar derecho con justificación y evolución de partidas
```

**Structure Decision**: Módulo encapsulado en `src/features/bitacora-modificaciones/` conectado al sidebar institucional de `<SigefiShell>`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| Ninguna   | N/A        | N/A                                  |
