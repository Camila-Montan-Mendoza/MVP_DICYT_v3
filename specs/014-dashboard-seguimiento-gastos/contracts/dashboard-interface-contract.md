# Interface Contract: Dashboard Principal Adaptativo de Seguimiento de Gastos

## Service Contract (React Hook Interface)

### `useDashboardSeguimiento`

```typescript
export interface UseDashboardSeguimientoParams {
  userId: number;
}

export interface UseDashboardSeguimientoReturn {
  isLoading: boolean;
  error: Error | null;
  roleScope: UserRoleScope;
  metrics: DashboardMetrics;
  programas: ProgramaSummary[];
  proyectos: ProyectoSummary[];
  setActiveScope: (scope: "programa" | "proyectos") => void;
  refetch: () => Promise<void>;
}
```

## Component Architecture

1. **`SeguimientoGastosPage`** (`src/app/seguimiento-gastos/page.tsx`):
   - Contenedor principal de la página de solo lectura.
   - Renderiza la cabecera con el conmutador de ámbito (`ScopeSwitcher`) si `isMultiRole` es verdadero.

2. **`GlobalMetricsHeader`** (`src/features/seguimiento-gastos/components/GlobalMetricsHeader.tsx`):
   - Muestra las 5 tarjetas informativas con Lucide Icons (`Wallet`, `Clock`, `FileCheck`, `CheckCircle2`, `PiggyBank`).

3. **`ProgramaViewSection`** (`src/features/seguimiento-gastos/components/ProgramaViewSection.tsx`):
   - Despliega las tarjetas consolidadas de Programa y Subprogramas con barras de avance.

4. **`ProyectoViewSection`** (`src/features/seguimiento-gastos/components/ProyectoViewSection.tsx`):
   - Despliega la lista de Proyectos del investigador con tarjetas de partidas concretas.

5. **`FinancialChartsSection`** (`src/features/seguimiento-gastos/components/FinancialChartsSection.tsx`):
   - Renderiza el gráfico SVG de barras por partida y el gráfico Donut por estado de ejecución.
