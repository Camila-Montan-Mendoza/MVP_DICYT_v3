/**
 * Tipos e interfaces del workflow de Compra Menor.
 *
 * IMPORTANTE: Los nodos, transiciones y roles se cargan desde la BD real
 * mediante `lib/workflow/workflow-db-service.ts`. Este archivo solo exporta
 * las interfaces de contrato que usa toda la aplicación.
 */

export type ActorRolCode = "I" | "RP" | "RC" | "AD" | "CD";

export interface AccionTransicion {
  id: string;
  label: string;
  siguienteNodoId: string;
  tipo: "AVANZAR" | "REBOTAR" | "RECHAZAR" | "REPETIR_BUCLE";
  varianteBtn: "primary" | "secondary" | "danger" | "outline";
}

export interface NodoWorkflow {
  id: string;
  pasoNumero: 1 | 2 | 3 | 4;
  pasoNombre: string;
  nombre: string;
  actorRol: ActorRolCode;
  actorNombreRol: string;
  instruccion: string;
  acciones: AccionTransicion[];
}
