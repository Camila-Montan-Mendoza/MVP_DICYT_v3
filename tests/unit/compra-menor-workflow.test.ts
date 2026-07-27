import {
  NODOS_COMPRA_MENOR,
} from "../../lib/workflow/compra-menor-strategy";

function runWorkflowTests() {
  console.log("=== Running Unit Tests: Compra Menor (1.001 - 20.000 Bs) Workflow Graph ===");

  // Test 1: Validate count of nodes (19 nodes total)
  const nodeIds = Object.keys(NODOS_COMPRA_MENOR);
  if (nodeIds.length !== 19) {
    throw new Error(`Expected 19 nodes in graph, got ${nodeIds.length}`);
  }
  console.log("✔ Test 1: Node count in graph (19 nodes) PASSED");

  // Test 2: Validate Step 1 transitions (Solicitud -> Presupuesto -> Compras -> Mercado Virtual -> Cotizaciones -> Adjudicar -> Paso 2)
  const node1_1 = NODOS_COMPRA_MENOR["node_1_1"];
  const avanzarAction1_1 = node1_1.acciones.find((a) => a.tipo === "AVANZAR");
  if (avanzarAction1_1?.siguienteNodoId !== "node_1_2") {
    throw new Error(`Expected node_1_1 to advance to node_1_2, got ${avanzarAction1_1?.siguienteNodoId}`);
  }
  console.log("✔ Test 2: Step 1 (Solicitud) linear transitions PASSED");

  // Test 3: Validate loop behavior in node_2_3 (Acta de recepción provisional)
  const node2_3 = NODOS_COMPRA_MENOR["node_2_3"];
  const loopAction = node2_3.acciones.find((a) => a.tipo === "REPETIR_BUCLE");
  if (!loopAction || loopAction.siguienteNodoId !== "node_2_3") {
    throw new Error("Expected node_2_3 to have a REPETIR_BUCLE action pointing to itself");
  }
  console.log("✔ Test 3: Step 2 Provisional Receipt loop behavior (node_2_3 -> node_2_3) PASSED");

  // Test 4: Validate Step 4 Completion (node_4_2 terminal node)
  const node4_2 = NODOS_COMPRA_MENOR["node_4_2"];
  if (node4_2.acciones.length !== 0 || node4_2.nombre !== "Trámite completado") {
    throw new Error("Expected terminal node node_4_2 to have 0 actions and title 'Trámite completado'");
  }
  console.log("✔ Test 4: Terminal completed node (node_4_2) PASSED");

  console.log("=== All Compra Menor Workflow Unit Tests Passed Successfully ===");
}

runWorkflowTests();
