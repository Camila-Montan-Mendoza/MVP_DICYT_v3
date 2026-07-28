# Research & Key Decisions: Verificación Mercado Virtual SIGEP

**Feature**: `006-revision-mercado-virtual`  
**Created**: 2026-07-28

## Key Architectural Decisions

### Decision 1: Item Status Selectors & Database Persistence

- **Context**: Grover needs to classify items individually as `Encontrado` (Green) or `No encontrado` (Red).
- **Decision**: Update `existe_en_mercado_virtual` boolean field in `item_tramite` table in Supabase PostgreSQL upon state selection.
- **Rationale**: Direct database persistence per Constitution Principle VI (Zero mock data policy).

### Decision 2: Provider Modal & Auto-Suggest

- **Context**: When an item is marked as `Encontrado`, Grover inputs provider data (Supplier Name, NIT, Unit, Available Quantity, Unit Price).
- **Decision**: Show modal with optional auto-suggest dropdown offering previously registered providers in the same trámite.
- **Rationale**: Minimizes repetitive typing when multiple items are sourced from the same supplier in SIGEP.

### Decision 3: Service Category Exclusions

- **Context**: Service trámites do not exist in Mercado Virtual.
- **Decision**: Stepper automatically marks Tarea 3 as completed and advances to next step if `categoria === "SERVICIO"`.
- **Rationale**: Eliminates unnecessary manual review steps for services.
