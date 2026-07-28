# Implementation Plan: Verificación de Disponibilidad en Mercado Virtual SIGEP por Ítem

**Branch**: `006-revision-mercado-virtual`  
**Feature Spec**: `specs/006-revision-mercado-virtual/spec.md`  
**Created**: 2026-07-28

---

## Technical Context

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling & UI Design**: Vanilla TailwindCSS with UMSS institutional color palette (`#002855` Azul Primario, `#003770` Azul Secundario, `#BC000C` Rojo, `#f4f6f9` Fondo) following `DESIGN.md`.
- **Database & Data Layer**: Supabase PostgreSQL database tables (`tramite`, `item_tramite`, `item`, `proveedor`, `item_proveedor_tramite`). **Zero mock data policy per Constitution Principle VI**.
- **Icons**: `lucide-react`
- **MVP Testing Strategy**: Fast validation focus. Includes lightweight, targeted unit tests in `tests/unit/mercado-virtual.test.ts`.

---

## Phase 0: Research & Key Decisions (`research.md`)

- **Decision 1**: Table view component for Tarea 3 ("Revisión Mercado Virtual") featuring dropdown selector per item (`Pendiente`, `Encontrado`, `No encontrado`).
- **Decision 2**: Automatic bypass for `SERVICIO` category trámites (skips Mercado Virtual check state).
- **Decision 3**: Provider assignment modal when marking an item as `Encontrado`, requesting Supplier Name, NIT, Unit, Quantity, and Unit Price with auto-suggest for previously entered suppliers in the same trámite.
- **Decision 4**: Provider badge rendering in the table column with Eye icon (view modal) and Cross icon (unassign/delete).
- **Decision 5**: Interactive "Descargar Proforma en Blanco" button for downloading the official PDF proforma template.

---

## Phase 1: Design Artifacts

### 1. Data Model (`data-model.md`)

- `MercadoVirtualStatus`: Enum (`PENDIENTE`, `ENCONTRADO`, `NO_ENCONTRADO`).
- `ProveedorSIGEP`: Entity representing provider info assigned to an item (`id`, `nombre`, `nit`, `unidad`, `cantidadDisponible`, `precioUnitario`).
- `ItemMercadoVirtual`: Entity representing an item in Mercado Virtual review.

### 2. Interface Contracts (`contracts/`)

- `components/workflow/views/paso-1-solicitud/tarea-3-mercado-virtual-active.tsx`: Active operational UI view component for Grover (Resp. Compras).
- `components/workflow/views/paso-1-solicitud/tarea-3-mercado-virtual-passive.tsx`: Passive read-only UI view component for non-Compras roles.

### 3. Quickstart Validation (`quickstart.md`)

- Runnable manual & automated test instructions proving Mercado Virtual item classification, supplier registration modal with auto-suggest, proforma template download, and transition execution.

---

## Plan Status

- [x] Phase 0: Research & Decisions complete (`research.md`)
- [x] Phase 1: Design Artifacts generated (`data-model.md`, `quickstart.md`, `contracts/`)
- [x] Targeted Unit Testing: `tests/unit/mercado-virtual.test.ts`
