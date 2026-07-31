# Data Model: Dashboard Principal Adaptativo de Seguimiento de Gastos

## Entities & Type Definitions

### 1. `DashboardMetrics`

Representa el resumen consolidado de las 5 métricas financieras globales:

```typescript
export interface DashboardMetrics {
  presupuestoVigenteTotal: number; // Suma total de presupuestos aprobados en la gestión
  preventivoReservado: number; // Suma de ítems en estado PREVENTIVO (id_estado_item = 1)
  comprometido: number; // Suma de ítems en estado COMPROMETIDO (id_estado_item = 2)
  gastadoDevengado: number; // Suma de ítems en estado PAGADO (id_estado_item = 3)
  saldoDisponibleGlobal: number; // presupuestoVigenteTotal - (preventivo + comprometido + gastado)
}
```

### 2. `ProgramaSummary`

Resumen de ejecución de un Programa principal y sus Subprogramas asociados (`id_programa_padre`):

```typescript
export interface ProgramaSummary {
  id: number;
  nombre: string;
  sigla: string;
  codigoClasificador: string; // DA-UE-PRG-ACT (Ej: 16-33-101-1)
  presupuestoVigente: number;
  ejecutadoVisual: number;
  saldoDisponible: number;
  subprogramas: ProgramaSummary[];
}
```

### 3. `ProyectoSummary`

Resumen de avance financiero de un Proyecto asignado a un Investigador:

```typescript
export interface ProyectoSummary {
  id: number;
  nombre: string;
  codigoSisin: string;
  gestion: number;
  presupuestoVigente: number;
  ejecutado: number;
  porcentajeAvance: number; // (ejecutado / presupuestoVigente) * 100
  partidas: PartidaConcretaSummary[];
}

export interface PartidaConcretaSummary {
  id: number;
  codigoPartida: number; // Ej: 34200, 39500, 43120
  nombrePartida: string;
  presupuestoAsignado: number;
  presupuestoEjecutado: number;
}
```

### 4. `UserRoleScope`

Determina la perspectiva y el conmutador de ámbito habilitado para el usuario:

```typescript
export interface UserRoleScope {
  isCoordinador: boolean;
  isInvestigadorOrTutor: boolean;
  isMultiRole: boolean;
  activeScope: "programa" | "proyectos";
}
```
