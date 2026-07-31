# Implementation Plan: Visualización del Detalle de Proyecto y su Memoria de Cálculo

**Branch**: `019-detalle-proyecto` | **Date**: 2026-07-31 | **Spec**: [specs/019-detalle-proyecto/spec.md](spec.md)

**Input**: Feature specification from `/specs/019-detalle-proyecto/spec.md`

## Summary

Construir `app/(dashboard)/proyectos/[id]/page.tsx` (carpeta ya existente y vacía, destino de navegación de la Lista de Proyectos de la HU 018) como una pantalla única que muestra la información general del proyecto y su memoria de cálculo (tabla de partidas), con los mensajes/opciones de acción condicionados por rol y estado calculados en el cliente a partir de datos servidos por un endpoint backend nuevo (`GET /api/proyectos/[id]`) que aplica el control de acceso (CA-6) **en el servidor**. Reutiliza componentes y patrones ya construidos en la HU 018 (`EstadoProyectoBadge`, `server-auth-service`, tokens `DESIGN.md`) en vez de crear variantes nuevas. Sin datos mock: la memoria de cálculo se sirve desde `partida_concreta`/`partida` reales; como esos catálogos no tienen hoy un nombre legible de partida, se añade una columna `nombre` real al catálogo `partida` (aditivo, sin romper nada existente) en vez de hardcodear textos como hacen otras features del repo (`bitacora-modificaciones`, `seguimiento-gastos`).

## Technical Context

**Language/Version**: TypeScript 5.x / Next.js (App Router) / React 19

**Primary Dependencies**: `@supabase/ssr` (`@/utils/supabase/server`), componentes ya existentes `components/ui/{table,badge,button,card}.tsx`, `lucide-react`, y reutilización directa de `src/features/proyectos-lista/components/EstadoProyectoBadge.tsx` (HU 018)

**Storage**: Supabase Postgres — `proyecto`, `estado_proyecto`, `proyecto_usuario`, `usuario`, `programa`, `convenio`, `fuente_financiamiento`, `partida_concreta`, `partida` (lectura; única escritura de este plan es aditiva sobre el catálogo `partida`, ver Research §1)

**Testing**: Estrategia MVP: pruebas unitarias bien puntuales (Vitest) para (1) la función pura que calcula las banderas de UI por rol+estado y (2) el control de acceso del repositorio (IP del proyecto vs. otro investigador). Sin pruebas E2E.

**Target Platform**: Web responsive, mismo layout `SigefiShell` que el resto del dashboard

**Project Type**: Next.js App Router existente — página + Route Handler + repositorio, mismo patrón que HU 018

**Performance Goals**: Respuesta de `GET /api/proyectos/[id]` en <500ms; la pantalla completa (info + memoria de cálculo) se sirve en una sola llamada, sin round-trips adicionales para lo mostrado en CA-1/CA-2

**Constraints**: Cero datos mock (Principio VI); el control de acceso (CA-6) se resuelve exclusivamente en el servidor a partir de la sesión, igual que en HU 018 — nunca se confía en un rol enviado por el cliente; las banderas de acción (mostrar botón "Detallar memoria de cálculo", opción "Evaluar", modo solo lectura) se derivan de datos ya autorizados y devueltos por el servidor, no de una decisión de seguridad adicional en el cliente; cumplimiento estricto de `DESIGN.md` y reutilización de componentes ya existentes del proyecto en vez de duplicarlos

**Scale/Scope**: Ruta `/proyectos/[id]` (detalle). Los destinos "Detallar memoria de cálculo" (`/proyectos/[id]/memoria-calculo`, ya referenciado por la navegación de la HU 018) y "Evaluar" (`/proyectos/[id]/evaluar`, nuevo) quedan como enlaces/rutas stub: su contenido pertenece a otras HUs y no se implementa aquí.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- **I. RBAC Workflow-Driven**: El acceso (CA-6) y las banderas de acción por rol+estado (CA-3/CA-4/CA-5) se resuelven en `GET /api/proyectos/[id]` reutilizando `resolveServerAuthContext` de la HU 018 más una verificación adicional de "¿es este usuario el IP de *este* proyecto?". PASS.
- **II. Minimalist Wizard UI & Zero Emojis**: Pantalla de consulta (no wizard) con tarjeta de información general + tabla de partidas, banners de acción con íconos `lucide-react`, cero emojis, tokens `DESIGN.md`. PASS.
- **III. Modular React Architecture**: Container (`useProyectoDetalle` hook) / Presentacional (`ProyectoInfoCard`, `MemoriaCalculoTable`, `MemoriaCalculoActionBanner`); acceso a datos en `lib/db/proyecto-repository.ts` (mismo archivo que HU 018, coherente con el patrón ya establecido). PASS.
- **IV. Functional Core Scope (MVP First)**: Implementa el segundo tramo de la navegación mandatada por este principio: `Lista de Proyectos` → `Detalle de Proyecto`. PASS.
- **V. Relational Integrity & Traceability**: Única alteración de esquema es aditiva y no destructiva (`ALTER TABLE partida ADD COLUMN nombre`, con `DEFAULT` seguro y sin afectar FKs existentes). Sin nuevas escrituras de negocio en esta HU (solo lectura). PASS.
- **VI. Prohibición de Mock Data**: Todo el detalle (info general + memoria de cálculo) se sirve desde Supabase real; se corrige explícitamente el antipatrón de nombres de partida hardcodeados visto en otras features en lugar de replicarlo. PASS.

## Project Structure

### Documentation (this feature)

```text
specs/019-detalle-proyecto/
├── plan.md              # Este archivo
├── research.md          # Decisiones: columna partida.nombre, control de acceso, banderas UI, rutas stub
├── data-model.md        # Entidades ProyectoDetalle, PartidaMemoriaCalculo, permisos por rol/estado
├── quickstart.md        # Guía de validación manual por rol y estado
└── contracts/
    └── proyecto-detalle-api-contract.md   # Contrato de GET /api/proyectos/[id]
```

### Source Code (repository root)

```text
app/api/proyectos/[id]/
└── route.ts                        # GET: control de acceso (CA-6) + detalle + memoria de cálculo

app/(dashboard)/proyectos/[id]/
└── page.tsx                        # Contenedor de la página, monta <ProyectoDetalleContainer proyectoId={id} />

src/features/proyecto-detalle/
├── api/
│   └── fetchProyectoDetalle.ts     # fetch cliente hacia /api/proyectos/[id]
├── components/
│   ├── ProyectoDetalleContainer.tsx    # Orquesta hook + tarjeta info + banner de acción + tabla
│   ├── ProyectoInfoCard.tsx            # CA-1: nombre, IP, presupuesto, programa, fuente, fechas, estado
│   ├── MemoriaCalculoTable.tsx         # CA-2: tabla de partidas + total consolidado
│   └── MemoriaCalculoActionBanner.tsx  # CA-3/CA-4: mensaje+botón "Detallar" o acceso a "Evaluar", oculto si solo-lectura (CA-5)
├── hooks/
│   └── useProyectoDetalle.ts       # fetch, estado de carga/error, banderas de permiso ya calculadas por el servidor
└── types/
    └── index.ts                    # ProyectoDetalle, PartidaMemoriaCalculo, PermisosDetalleProyecto

lib/db/
└── proyecto-repository.ts          # + getProyectoDetalle(supabase, { proyectoId, usuarioId, rolActivo })

docs/
└── 01_seed_catalogos_base.sql      # ALTER/seed: columna partida.nombre + valores reales de los códigos ya usados
```

**Structure Decision**: Mismo monolito Next.js App Router y mismos patrones que la HU 018 (`app/api/<recurso>/route.ts` + `src/features/<feature>/{api,components,hooks,types}` + `lib/db/proyecto-repository.ts` compartido). Se reutiliza `EstadoProyectoBadge` de `src/features/proyectos-lista/components/` en vez de duplicarlo, y `server-auth-service.ts` para la resolución de rol.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| Ninguna | N/A | N/A |
