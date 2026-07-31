# Technical Research: Detallar Memoria de Cálculo de un Proyecto

## 1. Mock Data Strategy

### Decision

Implement a client/server unified mock service (`mockProyectoService.ts`) pre-seeded with sample projects (e.g., ID 1: "Implementación de Inteligencia Artificial en Procesos Agrícolas", IP: "Dr. Ricardo Villarroel", Budget: 100.000,00 Bs., Program: "Innovación Tecnológica 2024", Fuente: "Recursos Propios IDH", Fechas: "15/01/2024" - "15/07/2025").

### Rationale

- Allows 100% full interactive testing (Search partidas, Add partida, Remove partida, Edit amount, Validate total budget overflow, Submit to review).
- If Supabase DB is offline or table lacks items, system seamlessly falls back to mock service without throwing 500/404 errors.
- Syncs mutated state in `localStorage` so refreshing page preserves edited/submitted state.

---

## 2. UI Component Architecture (Matching Images)

### Decision

Split the view into distinct modular components matching the design screenshots:

1. **`ProyectoHeaderNav`**:
   - Title: "Detalles del Proyecto"
   - Top Right Pill Button: "Trámites del Proyecto"
   - Sub-tabs: "Detalle del Proyecto" (Active) | "Ejecución Presupuestaria"

2. **`ProyectoInfoCard`**:
   - Displays project title, status badge ("Memoria de cálculo pendiente", "En revisión de memoria de cálculo", "Habilitado para ejecutar partidas"), IP, Presupuesto Total, Programa, Fuente, Fechas.

3. **`MemoriaCalculoEditView`** (Image 1 Mode):
   - Banner: "Agregue las partidas necesarias para su memoria de calculo"
   - Search Bar with Filter dropdown
   - Table: ID, Nombre de Partida, Monto Input (Bs.), Trash Icon action
   - Footer Banner: "Presupuesto Consolidado", Total Partidas, Presupuesto Total, Buttons: "Cancelar", "Enviar a revisión" (disabled if total > budget or empty).

4. **`MemoriaCalculoReadView`** (Image 2 Mode):
   - Section Title: "Memoria de calculo del proyecto" with top right button "Memoria de Cálculo"
   - Table: ID, Nombre de Partida, Monto (Bs.), Total Consolidado row.

---

## 3. State Management & Real-time Validation

### Decision

Create custom React Hook `useMemoriaCalculoEditor`:

- Manages draft partidas array: `[{ id: 101, codigo: "101", nombre: "Materiales y Suministros", monto: 45000 }]`.
- Computes `totalConsolidado = sum(partidas.monto)`.
- Computes `excedente = max(0, totalConsolidado - presupuestoTotal)`.
- Provides `addPartida`, `removePartida`, `updateMonto`, `enviarARevision`.
