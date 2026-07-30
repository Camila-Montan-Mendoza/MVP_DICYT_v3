# Phase 0: Research - Filtro y Selector de Gestión Presupuestaria

## 1. Patrón de Selección de Gestión Fiscal

### Decision
Implementar un control selector de gestión en la barra superior de `app/(dashboard)/seguimiento-gastos/page.tsx` al lado de los filtros de Programa y Proyecto. El selector ofrecerá las gestiones registradas (ej. `2026`, `2025`) más la opción `Histórico Global`.

### Rationale
- Carga por defecto la gestión activa (`2026`).
- Permite la discriminación inmediata de montos por gestión fiscal.
- `Histórico Global` acumula el total plurianual desde el inicio del proyecto/programa.

---

## 2. Distinción Visual entre Saldos Vencidos vs. Fondos Acumulables

### Decision
Utilizar badges informativos con colores semánticos distintos:
- **Gestión Anual Cerrada / Programa Vencido**: Badge tenue `bg-amber-50 text-amber-800 border-amber-200` con icono `Clock`.
- **Fondo Plurianual Acumulado**: Badge `bg-blue-50 text-[#003770] border-blue-200` con icono `Calendar`.

### Rationale
- Cumple con `DESIGN.md` y la regla de no utilizar emojis.
- Proporciona retroalimentación visual clara sin saturar la vista.
