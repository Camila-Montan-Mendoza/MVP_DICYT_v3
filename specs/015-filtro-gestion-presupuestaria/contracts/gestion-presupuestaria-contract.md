# Contract: Selector de Gestión Presupuestaria

## Interfaz de Hook (`useDashboardSeguimiento`)

```typescript
export interface UseDashboardSeguimientoReturn {
  // Filtro de Gestión
  selectedGestion: number | 'global';
  setSelectedGestion: (gestion: number | 'global') => void;
  availableGestiones: number[];

  // Filtros existentes
  selectedProgramaId: number | 'all';
  setSelectedProgramaId: (id: number | 'all') => void;
  selectedProyectoId: number | 'all';
  setSelectedProyectoId: (id: number | 'all') => void;

  // Datos filtrados según gestión
  metrics: DashboardMetrics;
  programas: ProgramaSummary[];
  proyectos: ProyectoSummary[];
  isLoading: boolean;
  refetch: () => Promise<void>;
}
```

## Propiedades del Control Selector UI

- **Etiqueta**: `Gestión:`
- **Icono**: `Calendar` (Lucide SVG)
- **Opciones**:
  - `2026` (Gestión Activa por Defecto)
  - `2025`
  - `Histórico Global` (`global`)
