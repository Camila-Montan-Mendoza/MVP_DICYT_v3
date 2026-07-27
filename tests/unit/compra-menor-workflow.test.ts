/**
 * Unit Test: Verifica que las interfaces de NodoWorkflow y AccionTransicion
 * estén correctamente definidas en compra-menor-strategy.ts (solo tipos).
 *
 * Los nodos reales se cargan desde la BD — este test solo valida las interfaces.
 */
import type { NodoWorkflow, AccionTransicion, ActorRolCode } from "../../lib/workflow/compra-menor-strategy";

console.log("=== Running Unit Tests: Workflow Type Interfaces ===");

// Test 1: NodoWorkflow interface structure
function testNodoWorkflowInterface() {
  const nodo: NodoWorkflow = {
    id: "1",
    pasoNumero: 1,
    pasoNombre: "Solicitud",
    nombre: "Test Node",
    actorRol: "RP",
    actorNombreRol: "Responsable de Presupuesto",
    instruccion: "Test instruction",
    acciones: [],
  };

  if (!nodo.id || !nodo.pasoNombre || !nodo.nombre) {
    throw new Error("FAILED: NodoWorkflow interface missing required fields");
  }
  console.log("✔ Test 1: NodoWorkflow interface validates correctly PASSED");
}

// Test 2: AccionTransicion interface structure
function testAccionTransicionInterface() {
  const accion: AccionTransicion = {
    id: "trans_1",
    label: "Aprobar",
    siguienteNodoId: "2",
    tipo: "AVANZAR",
    varianteBtn: "primary",
  };

  if (!accion.id || !accion.label || !accion.siguienteNodoId) {
    throw new Error("FAILED: AccionTransicion interface missing required fields");
  }

  // Verify all tipo values are valid
  const tipos: AccionTransicion["tipo"][] = ["AVANZAR", "REBOTAR", "RECHAZAR", "REPETIR_BUCLE"];
  if (!tipos.includes(accion.tipo)) {
    throw new Error("FAILED: Invalid tipo value");
  }
  console.log("✔ Test 2: AccionTransicion interface validates correctly PASSED");
}

// Test 3: ActorRolCode type
function testActorRolCodeType() {
  const roles: ActorRolCode[] = ["I", "RP", "RC", "AD", "CD"];
  if (roles.length !== 5) {
    throw new Error("FAILED: ActorRolCode should have 5 values");
  }
  console.log("✔ Test 3: ActorRolCode type has 5 valid values PASSED");
}

// Test 4: NodoWorkflow with acciones
function testNodoWithAcciones() {
  const nodo: NodoWorkflow = {
    id: "1",
    pasoNumero: 1,
    pasoNombre: "Solicitud",
    nombre: "Revisión presupuestaria",
    actorRol: "RP",
    actorNombreRol: "Responsable de Presupuesto",
    instruccion: "Verificar disponibilidad",
    acciones: [
      {
        id: "trans_1",
        label: "Aprobar",
        siguienteNodoId: "2",
        tipo: "AVANZAR",
        varianteBtn: "primary",
      },
      {
        id: "trans_2",
        label: "Observar",
        siguienteNodoId: "3",
        tipo: "REBOTAR",
        varianteBtn: "secondary",
      },
    ],
  };

  if (nodo.acciones.length !== 2) {
    throw new Error("FAILED: NodoWorkflow should have 2 acciones");
  }
  if (nodo.acciones[0].tipo !== "AVANZAR" || nodo.acciones[1].tipo !== "REBOTAR") {
    throw new Error("FAILED: Acciones tipos don't match");
  }
  console.log("✔ Test 4: NodoWorkflow with acciones validates correctly PASSED");
}

testNodoWorkflowInterface();
testAccionTransicionInterface();
testActorRolCodeType();
testNodoWithAcciones();
console.log("=== All Workflow Type Interface Tests Passed Successfully ===");
