<!--
### Sync Impact Report
- Version change: 1.1.0 → 1.2.0
- Added/Modified principles:
  - Principle VI: Expanded to "Strict Real Database Data & Backend Persistence Discipline (Prohibition of Mock Data)" — Mandates bi-directional read/write active usage of Supabase PostgreSQL and backend endpoints across all workflow views and task components.
- Added sections: None
- Removed sections: None
- Templates requiring updates:
  - ✅ `.specify/templates/plan-template.md` (aligned)
  - ✅ `.specify/templates/spec-template.md` (aligned)
  - ✅ `.specify/templates/tasks-template.md` (aligned)
- Follow-up TODOs: None.
-->

# SIGEFI DICyT MVP Constitution

## Core Principles

### I. Workflow-Driven Role-Based Access Control (RBAC & Dynamic Views)

Every trámite execution MUST be strictly governed by the procedure step-and-state workflow engine (`paso_flujo`, `estado_paso_flujo`, `rol_estado_paso_flujo`, `transicion_flujo`).

- **Actor Permissions**: Access and actions are strictly role-scoped across the 13 defined system actors:
  1. **IP (Investigador Principal)**: Initiates trámites, uploads quotes & receipt acts, requests payments, gathers signatures.
  2. **RC (Responsable de Compras)**: Conducts initial review, verifies virtual market items, awards/rejects providers, issues purchase orders.
  3. **RP (Responsable de Presupuesto)**: Verifies budget & fund availability before trámite progress; issues SIGEP preventives & C-31s.
  4. **AD (Administrador DICyT)**: Formally approves requests & instructs issuance of purchase orders/contracts.
  5. **CD (Contabilidad DICyT)**: Handles accounting processes, generates memorandums, C-31 vouchers, checks/transfers, registers expenditure execution.
  6. **DD (Director DICyT)**: Executive authority signing/authorizing official memorandums, funds openings/closures, C-31s, and checks.
  7. **AL (Asesoría Legal)**: Formally issues contracts when strategy dictates.
  8. **SOL (Solicitante / Resp. Fondo)**: Registers fund opening requests and presents closing expense renditions.
  9. **JI (Jefe Inmediato / Coordinador)**: Hierarchical superior signing/endorsing unit requests and expense reports.
  10. **ACD (Analista de Control DAF)**: Audits and approves SIGEP preventives, reversions, and C-31 registrations.
  11. **ET (Encargado de Tesorería)**: Prepares physical/digital disbursement checks.
  12. **CAJ (Cajero DICyT)**: Manages cash control and registers C-31 voucher numbers.
  13. **EA (Encargado de Archivo)**: Unifies and archives project opening/closing files in project folders.
- **Dynamic Views**: User Interfaces MUST render dynamically based on active user role. Active actors display actionable controls (approve, reject, submit, upload); passive actors display read-only monitoring and stepper tracking.

### II. Institutional Minimalist UX & Prototyping Consistency

Visual interfaces MUST adhere strictly to `DESIGN.md` and institutional identity standards of the Universidad Mayor de San Simón (UMSS).

- **Color Tokens**: Primary Azul Institutional (`#003770`), Secondary Rojo Institutional (`#BC000C`), Dark Blue Accent (`#001B47`), Button Blue (`#002855`), Background (`#fdfdfd`), Foreground (`#2c3e50`), Muted (`#f0f4f8`), Border (`#e5e7eb`).
- **UI Uniformity**: High design consistency across all screens without design fragmentation or mixed component styles. Component variants (buttons, cards, inputs, tables, badges) MUST utilize ShadCN UI + Tailwind CSS mapped directly to `globals.css` CSS variables.
- **Mockup Fidelity**: Interface layouts MUST replicate prototype mockups in `.mockups/` using the `/frontend-design` skill to ensure clean, non-cluttered, accessible UI/UX.

### III. Modular React Architecture & Pattern Discipline

Frontend codebase structure MUST implement clean component architecture using standard React design patterns:

- **Container / Presentational Pattern**: Decouple data-fetching / state containers from purely visual presentation components.
- **Hooks Pattern**: Encapsulate reusable domain logic, Supabase queries, and state management into custom React hooks.
- **Compound Pattern**: Build flexible, composed UI components (e.g., dynamic Steppers, Trámite Modals, Form Steppers).
- **Higher-Order Component (HOC) Pattern & Render Props Pattern**: Use for cross-cutting concerns such as role authorization wrappers (`withRoleGuard`) and dynamic list/table renders (`RenderProps`).
- **AI UI & React Stack Patterns**: Modern layout structures with ShadCN Studio standards, responsive mobile/desktop navigation, and seamless state transitions.

### IV. Functional Core Scope & Trámite Execution (MVP First)

The application MUST prioritize end-to-end functionality for the 8 core trámites over non-essential features or edge-case customization:

1. **Compra menor de material** (PD-73)
2. **Compra menor de activo fijo** (PD-73)
3. **Compra menor de servicios** (PD-73)
4. **Apertura de fondos rotatorios (caja chica)**
5. **Apertura de fondos de avance**
6. **Cierre de fondos rotatorios**
7. **Cierre de fondos de avance**
8. **Modificación presupuestaria**

- **Navigation Flow**: IP and authorized users MUST be able to navigate: `Lista de Proyectos` → `Detalle de Proyecto` → `Crear Nuevo Trámite`, alongside a dedicated global `Sección de Trámites` listing all user-accessible trámites with workflow stepper status tracking.

### V. Supabase / PostgreSQL Relational Integrity & Traceability

The database schema MUST reflect the core PostgreSQL schema provided for Supabase:

- Strict Foreign Keys with `ON UPDATE CASCADE` and explicit deletion constraints (`RESTRICT` or `SET NULL`, strictly avoiding cascading deletes).
- Complete traceability of state changes through `historial_estado_tramite` with timestamp, user ID, previous state, new state, and observations.
- Document and file handling centralized via `archivo` UUIDs for quotes, contractual documents, receipt acts, and payment vouchers (C-31, cheques, memorandums).

### VI. Strict Real Database Data & Backend Persistence Discipline (Prohibition of Mock Data)

All UI views, workflow task strategies, and API endpoints MUST actively query, render, and persist data directly using the backend and Supabase PostgreSQL database (`tramite`, `item_tramite`, `item`, `cotizacion`, `detalle_cotizacion`, `proveedor`, `item_proveedor_tramite`, `orden_contractual`, `historial_estado_tramite`, `transicion_flujo`).

- **Prohibition of Hardcoded Mock Arrays**: In-memory static mock arrays, fallback mock items, or dummy static objects inside UI view components are strictly prohibited.
- **Bi-directional Supabase Persistence**: Every user operation (creating trámites, uploading quotes, awarding items, issuing purchase orders, verifying signatures, recording payments) MUST write directly to Supabase PostgreSQL tables and update workflow state via `historial_estado_tramite`.
- **Fail-Fast Database Renders**: If an entity or item list is empty in the database, the interface MUST gracefully render an explicit empty state indicator (e.g. "Sin registros en la base de datos de Supabase") rather than falling back to static fake datasets.

## Technical Requirements & Stack Standards

- **Core Stack**: Next.js (App Router), Supabase (Auth & Database), ShadCN UI, ShadCN Studio, Tailwind CSS, TypeScript.
- **Styling & Layout**: Vanilla CSS tokens in `globals.css` with Tailwind utility mapping. Minimalist typography, desktop auto-expanding sidebar (`w-16` to `w-64`), mobile bottom bar (`h-16`) with `pb-16` safe margin.
- **State & Data Handling**: Client-side state managed via React Hooks and Context; server calls mediated by Supabase Client / Server Actions with strict error boundary handling.

## Governance & Amendment Policy

1. **Constitution Authority**: This Constitution supersedes all informal architectural decisions. All proposed features, pull requests, specifications (`spec.md`), and task breakdowns (`tasks.md`) MUST comply with these principles.
2. **Amendment Procedure**: Any modification to core principles, actor definitions, or tech stack mandates requires incrementing `CONSTITUTION_VERSION`, updating governance dates, and documenting rationale in a Sync Impact Report.
3. **Compliance Verification**: Automated and manual reviews must verify adherence to `DESIGN.md` tokens, RBAC view dynamic rendering, strict Supabase backend persistence, and React design pattern discipline before merging code.

**Version**: 1.2.0 | **Ratified**: 2026-07-23 | **Last Amended**: 2026-07-29
