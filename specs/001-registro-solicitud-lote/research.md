# Research & Architectural Decisions: Registro y Auto-Distribución de Solicitud de Adquisición por Tipo

**Feature**: `001-registro-solicitud-lote`  
**Date**: 2026-07-23  

---

## 1. Automatic Item Classification Strategy

### Decision
Implement automatic classification in `lib/services/itemClassifierService.ts` combined with custom hook `useItemClassification`. When an item is selected or typed by the user, the classifier analyzes its name against a dictionary of keywords and catalog patterns:
- Keywords like "reactivo", "papel", "tinta", "frasco", "pipeta" -> Categorized automatically as **`MATERIAL`**.
- Keywords like "laptop", "computadora", "microscopio", "impresora", "escáner" -> Categorized automatically as **`ACTIVO`** (Activo Fijo).
- Keywords like "mantenimiento", "reparación", "instalación", "servicio", "consultoría" -> Categorized automatically as **`SERVICIO`**.
- Unmatched or custom items default to `MATERIAL` with an option for fast manual override if needed.

### Rationale
- Removes user friction during request entry (CA-1.1).
- Instant execution (<50ms) in the client context before auto-partitioning.

---

## 2. Auto-Partitioning into Homogeneous Trámites

### Decision
Implement client-side auto-grouping algorithm in `useSolicitudAutoDistribution` hook. When the user inputs items into a unified temporary state array `RawItem[]` with automatic category tags (`MATERIAL`, `ACTIVO`, `SERVICIO`), clicking "Generar Trámites por Tipo" generates a `grupo_solicitud` UUID and partitions `RawItem[]` into up to 3 discrete `TramiteDraft` objects:
- `TramiteDraft` (Materiales) -> mapping to `tipo_tramite_id = 1` (Compra menor de material)
- `TramiteDraft` (Activos Fijos) -> mapping to `tipo_tramite_id = 2` (Compra menor de activo fijo)
- `TramiteDraft` (Servicios) -> mapping to `tipo_tramite_id = 3` (Compra menor de servicios)

### Rationale
- Immediate UI response (<50ms) without round-trip database overhead during drafting.
- Guarantees 100% homogeneity before persisting to Supabase or submitting for review.

---

## 3. Dynamic Form Fields (ET vs TDR) Implementation

### Decision
Use a Compound Component pattern (`FormularioTecnico.Root`, `FormularioTecnico.ET`, `FormularioTecnico.TDR`) combined with a dynamic JSON Schema structure in `tramite_item.especificacion_tecnica`:
- **ET (Materiales / Activos)**: `{ especificacion_tecnica: string, marca_sugerida?: string, unidad_medida: string, cantidad: number, precio_referencia: number }`
- **TDR (Servicios)**: `{ objetivo_servicio: string, entregables: string, plazo_ejecucion_dias: number, cantidad: number, precio_referencia: number }`

### Rationale
- Provides high flexibility and preserves typed React forms via `react-hook-form` or controlled components.
- Direct alignment with Constitution Principle III (Compound Components) and Principle II (ShadCN UI + institutional styling).

---

## 4. Simulated External Budget Equivalence Service

### Decision
Create a decoupled utility service (`lib/services/budgetLookupService.ts`) with a keyword-matching dictionary and fuzzy fallback:
- Keywords like "reactivo", "papel", "toner" -> Code `39700` (Materiales de Consumo)
- Keywords like "computadora", "microscopio", "impresora" -> Code `43110` (Equipo de Oficina/Laboratorio)
- Keywords like "mantenimiento", "reparación", "consultoría" -> Code `24110` (Servicios Técnicos)
- Unmatched keywords -> return `null`, resulting in `estado_partida = "Pendiente de asignación"`.

### Rationale
- Non-blocking execution allows instant lookup.
- Fulfills CA-1.4 / FR-006 requirements cleanly without external API dependency failures during demo/testing.

---

## 5. Multi-File Upload & Storage Strategy per Trámite

### Decision
Use Supabase Storage bucket `tramite-respaldos` with local preview object URLs (`URL.createObjectURL`) for instant visual feedback. Files are uploaded per trámite and linked via UUID records in the `archivo` table and `tramite_archivo` junction structure. Allowed formats: `.pdf`, `.png`, `.jpg`, `.jpeg` (max 10MB).

### Rationale
- Fulfills requirement for PDF and Image proformas at trámite header level.
- Integrates seamlessly with existing `archivo` schema.
