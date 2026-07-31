# Research: Dashboard Principal Adaptativo de Seguimiento de Gastos según Rol

## Technical Decisions & Rationale

### 1. Data Fetching & Aggregation Engine

- **Decision**: Create a custom React hook `useDashboardSeguimiento` backed by Supabase Client queries on `programa_usuario`, `proyecto_usuario`, `programa`, `proyecto`, `presupuesto_gestion`, `partida_concreta`, `tramite` and `item_tramite`.
- **Rationale**: Keeps calculations clean, reactive, and strictly read-only. Avoids server-side reload bottlenecks while enforcing bi-directional data persistence discipline.
- **Alternatives Considered**: Direct SQL RPC view vs. Client-side hook aggregation. Client-side aggregation with custom hook selected for instant role switching without network round-trips.

### 2. Role-Adaptive UI State & Scope Switcher

- **Decision**: Client-side state switcher (`viewScope`: `'programa' | 'proyectos'`) using ShadCN Tabs + Lucide Icons (`Building2`, `FolderGit2`).
- **Rationale**: For multi-role users (e.g. Coordinador and IP simultaneously), switching views is instantaneous (< 200 ms) and requires zero page reloads, satisfying SC-002.

### 3. Charting & Visualization Strategy

- **Decision**: Build lightweight SVG-based Bar Chart and Donut Chart components using `DESIGN.md` CSS tokens (`#003770` Azul UMSS, `#BC000C` Rojo UMSS, `#001B47` Dark Blue, `#f0f4f8` Muted).
- **Rationale**: Ensures high visual quality, zero emoji usage, zero heavy external library bloat, and 100% adherence to institutional design standards.

### 4. PDF Export Strategy

- **Decision**: Utilize standard `window.print()` with `@media print` CSS overrides for clean, institutional A4 executive summary printing.
- **Rationale**: Lightest, zero-dependency approach for instant PDF creation directly from browser print controls.
