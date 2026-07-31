# Data Model: Detallar Memoria de Cálculo de un Proyecto

## Entities & Interfaces

### 1. `ProyectoDetalle`
Represents the full detailed state of a project.

```ts
export interface ProyectoDetalle {
  id: number;
  nombre: string;
  presupuestoTotal: number;
  programa: string;
  fuenteFinanciamiento: string | null;
  fechaInicio: string;
  fechaFin: string;
  estado: {
    id: 1 | 2 | 3 | 4; // 1: Pendiente, 2: En revisión, 3: Observado, 4: Habilitado
    nombre: string;
  };
  investigadorPrincipal: {
    id: number;
    nombre: string;
  } | null;
  memoriaCalculo: PartidaMemoriaCalculo[];
  totalMemoriaCalculo: number;
  permisos: {
    puedeDetallarMemoria: boolean;
    puedeEvaluar: boolean;
    soloLectura: boolean;
  };
}
```

### 2. `PartidaMemoriaCalculo`
Representing a single partida entry in the memoria de cálculo.

```ts
export interface PartidaMemoriaCalculo {
  id: number;
  codigoPartida: number | string;
  nombrePartida: string;
  monto: number;
}
```

### 3. `PartidaCatalogo`
Catalog entry for searching partidas.

```ts
export interface PartidaCatalogo {
  id: number;
  codigo: string;
  nombre: string;
  itemsRelacionados: string[];
}
```

## Mock Data Seed

```ts
export const MOCK_PROJECT_SEED: ProyectoDetalle = {
  id: 1,
  nombre: "Implementación de Inteligencia Artificial en Procesos Agrícolas",
  presupuestoTotal: 100000,
  programa: "Innovación Tecnológica 2024",
  fuenteFinanciamiento: "Recursos Propios IDH",
  fechaInicio: "15/01/2024",
  fechaFin: "15/07/2025",
  estado: {
    id: 1,
    nombre: "Memoria de cálculo pendiente",
  },
  investigadorPrincipal: {
    id: 1,
    nombre: "Dr. Ricardo Villarroel",
  },
  memoriaCalculo: [
    { id: 101, codigoPartida: "101", nombrePartida: "Materiales y Suministros", monto: 45000 },
    { id: 205, codigoPartida: "205", nombrePartida: "Servicios Técnicos Profesionales", monto: 55000 },
  ],
  totalMemoriaCalculo: 100000,
  permisos: {
    puedeDetallarMemoria: true,
    puedeEvaluar: false,
    soloLectura: false,
  },
};
```
