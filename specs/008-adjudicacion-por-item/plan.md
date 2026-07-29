# Implementation Plan: Cuadro Comparativo y Adjudicación Flexible por Ítem

**Branch**: `008-adjudicacion-por-item` | **Date**: 2026-07-29 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/008-adjudicacion-por-item/spec.md`

## Summary

Implementar en la interfaz de Next.js / React la pantalla y modal de evaluación del cuadro comparativo de cotizaciones para el Investigador Principal (IP), permitiendo adjudicación granular independiente por ítem y dividida por cantidades entre proveedores, con bloqueo de ofertas "Sin Stock" o que superen el Precio Referencial Inicial. El flujo consulta y persiste directamente en la base de datos de Supabase (`tramite`, `item_tramite`, `cotizacion`, `detalle_cotizacion`, `item_proveedor_tramite`, `proveedor`), exigiendo Justificación General obligatoria y ejecutando la desafectación/liberación automática del Preventivo presupuestario no ejecutado al confirmar.

## Technical Context

**Language/Version**: TypeScript 5+, Next.js 15 (App Router), React 19

**Primary Dependencies**: Supabase JS SDK (`@supabase/supabase-js`, `@supabase/ssr`), ShadCN UI (`@/shared/ui`), Tailwind CSS v4, Lucide React icons

**Storage**: Supabase PostgreSQL (`tramite`, `item_tramite`, `cotizacion`, `detalle_cotizacion`, `item_proveedor_tramite`, `proveedor`, `historial_estado_tramite`)

**Testing**: Pruebas unitarias bien puntuales para la lógica de validación de cantidades (suma <= cantidad solicitada), cálculo del techo referencial y liberación presupuestaria (xUnit/Vitest o Jest/RTL puntual). Sin pipelines E2E pesados.

**Target Platform**: Navegador Web Desktop & Mobile (diseño responsivo minimalista según `DESIGN.md`)

**Project Type**: Next.js App Router Web Application (Client & Server Components)

**Performance Goals**: Carga de tabla comparativa en < 1 segundo, actualización de totales e imputación en tiempo real (< 100ms)

**Constraints**:

- **Prohibición de Datos Mock**: Prohibido usar arrays estáticos mockeados. Todo el cuadro comparativo se consulta y persiste en Supabase.
- **Tokens de Diseño**: Azul UMSS `#003770`, Rojo `#BC000C`, Fondo `#fdfdfd`, Texto `#2c3e50`, Bordes `border-border`.
- **Fidelidad al Mockup**: Coincidir exactamente con el diseño proporcionado (Stepper de estado, lista de ítems a la izquierda, detalle comparativo de ofertas con badges de "Ahorro Máximo" y selección independiente a la derecha).

**Scale/Scope**: 1 Pantalla de Adjudicación Granular de Trámite + Componente Cuadro Comparativo Matricial + Modales de Confirmación y Justificación

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

1. **Principle I (Workflow-Driven RBAC)**: PASSED. La vista está condicionada al rol IP (Investigador Principal) y al paso de flujo `ADJUDICAR PROVEEDORES` en `paso_flujo` / `estado_paso_flujo`.
2. **Principle II (Institutional Minimalist UX & DESIGN.md)**: PASSED. Cumple estrictamente los tokens de color UMSS (`--primary` `#003770`, `--secondary` `#BC000C`, etc.) y la disposición de Sidebar + layout.
3. **Principle III (Modular React Architecture)**: PASSED. Se utilizan hooks personalizados (`useAdjudicacionTramite`), componentes contenedores/presentacionales y UI de shadcn (`@/shared/ui`).
4. **Principle IV (Functional Core Scope - MVP First)**: PASSED. Enfocado en completar el flujo de compra menor de materiales/activos.
5. **Principle V (Supabase Relational Integrity)**: PASSED. Utiliza claves foráneas y la tabla `item_proveedor_tramite` para registrar la adjudicación por ítem y proveedor.
6. **Principle VI (Strict Real Database Data Discipline - No Mock Data)**: PASSED. Se consulta y persiste directamente en Supabase sin ningún array de datos estáticos en código.

## Project Structure

### Documentation (this feature)

```text
specs/008-adjudicacion-por-item/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 API/Supabase contracts
│   └── adjudicacion-api-contract.md
└── mockups/             # User design UI screenshots
    └── hu1-seleccion-independiente-item.png
```

### Source Code (repository root)

```text
app/
├── (dashboard)/
│   └── tramites/
│       └── [id]/
│           └── adjudicacion/
│               └── page.tsx        # Página de Adjudicación de Trámite (Server/Client)
components/
├── tramites/
│   ├── adjudicacion/
│   │   ├── CuadroComparativoMatriz.tsx   # Matriz/Cards de comparación de proveedores por ítem
│   │   ├── ItemListaSeleccion.tsx        # Lista de ítems con indicador de estado (Adjudicado / Pendiente / Sin Stock)
│   │   ├── AdjudicacionDivididaModal.tsx # Modal para dividir cantidades entre 2 o más proveedores
│   │   └── ConfirmarAdjudicacionDialog.tsx # Diálogo de confirmación con campo obligatorio de Justificación General
│   └── TramiteStepperHeader.tsx          # Stepper superior (1: Solicitud, 2: Recepción, etc.)
lib/
├── supabase/
│   ├── client.ts                          # Supabase browser client
│   └── server.ts                          # Supabase server client
services/
└── adjudicacionService.ts                # Funciones de consulta y persistencia en Supabase (RPC o mutaciones en lote)
hooks/
└── useAdjudicacionTramite.ts             # React Custom Hook para estado de selección, validaciones y cálculo en tiempo real
```

**Structure Decision**: Aplicación Next.js App Router unificada en directorio raíz (`app/`, `components/`, `lib/`, `services/`, `hooks/`) respetando el mapeo del proyecto actual.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| N/A       | N/A        | No constitution violations           |
