# Data Model: Bandeja Consolidada y Seguimiento de Trámites con Filtrado

**Feature Branch**: `002-bandeja-consolidada-tramites`  
**Date**: 2026-07-27

---

## Entities

### `TramiteConsolidado`

Represents a unified administrative requisition entry in the principal investigator's consolidated inbox.

```typescript
export interface TramiteConsolidado {
  id: string;                      // Unique ID (e.g. "tr-001")
  nro: string;                     // Sequential number per project (e.g. "01", "02")
  proyecto: string;                // Research project title
  tipoTramite: string;             // Type label (e.g. "Solicitud de Materiales", "Fondo Rotatorio")
  fecha: string;                   // Display date (e.g. "15 Oct 2023")
  fechaISO: string;                // ISO date for sorting (e.g. "2023-10-15")
  pasoActualEtiqueta: string;      // Dynamic step label (e.g. "Paso 1/4: Solicitud")
  pasoNumero: number;              // Current step index (e.g. 1)
  pasoTotal: number;               // Total steps in workflow (e.g. 4)
  creador: string;                 // User who created the requisition
  requiereAccion: boolean;         // True = ATENDER button, False = VER DETALLE button
  estadoGeneral: "EN_PROCESO" | "COMPLETADO" | "PENDIENTE_MODIFICACION" | "RECHAZADO";
}
```

---

## Validation Rules

1. **Un-hardcoded Categories**: `tipoTramite` can accept any string without rigid enum restriction to allow future administrative process types.
2. **Step Formatting**: `pasoActualEtiqueta` must follow `Paso X/Y: [Nombre del Paso]` structure.
3. **Action Button Mapping**:
   - `requiereAccion === true`: Render primary button `ATENDER` in UMSS Azul (`#002855`).
   - `requiereAccion === false`: Render outline button `VER DETALLE`.
