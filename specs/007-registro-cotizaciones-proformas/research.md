# Research & Key Decisions: Transcripción de Proformas / Cotizaciones

**Feature**: `007-registro-cotizaciones-proformas`  
**Created**: 2026-07-28

## Key Architectural Decisions

### Decision 1: Database Persistence Structure (Supabase PostgreSQL)

- **Context**: Investigador transcribes proforma data obtained physically in the market.
- **Decision**: Store proforma header in `cotizacion` table and item entries in `item_cotizacion` table in Supabase PostgreSQL.
- **Rationale**: Strict compliance with Constitution Principle VI (Zero mock data policy).

### Decision 2: Quantity Ceiling Validation

- **Context**: Investigador transcribes requested items.
- **Decision**: Check `cantidad_cotizada <= item.cantidad` when user types in quantity input. If exceeded, show toast/alert `"La cantidad cotizada no puede ser mayor a la cantidad solicitada ([N] unidades)"` and prevent submission.
- **Rationale**: Prevents researchers from ordering extra quantities not originally approved in the requisition.

### Decision 3: 4th Quotation Rule Enforcement

- **Context**: Adjudication requires valid quotations.
- **Decision**: Count how many submitted proformas have items marked as `Sin existencia`. If count >= 2, block transition button `Cotización realizada` with message `"Se requiere registrar al menos una 4ta cotización con existencia para continuar"`.
- **Rationale**: Ensures sufficient valid suppliers exist before proceeding to formal comparison and award.
