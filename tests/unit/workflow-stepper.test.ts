import {
  getTramiteWorkflowDetail,
} from "../../lib/workflow/stepper-service";

function runTests() {
  console.log("=== Running Unit Tests: Workflow Stepper & Tasks Timeline ===");

  // Test 1: Macro step status resolution
  const detail = getTramiteWorkflowDetail("tr-001");
  if (detail.pasos.length !== 4) {
    throw new Error(`Expected 4 steps, got ${detail.pasos.length}`);
  }
  const enCursoStep = detail.pasos.find((p) => p.estado === "EN_CURSO");
  if (!enCursoStep || enCursoStep.nombre !== "Recepcion") {
    throw new Error("Expected step 2 'Recepcion' to be EN_CURSO");
  }
  console.log("✔ Test 1: Macro step status resolution PASSED");

  // Test 2: Task completion timestamps
  const completedTask = detail.tareas.find((t) => t.estado === "COMPLETADO" && t.pasoId === "p2");
  if (!completedTask || !completedTask.fechaCompletado) {
    throw new Error("Expected completed task in step 2 to have timestamp");
  }
  console.log("✔ Test 2: Task completion timestamps PASSED");

  // Test 3: Intervention badge ('Acción requerida' vs 'En espera')
  const activeTask = detail.tareas.find((t) => t.estado === "EN_CURSO");
  if (!activeTask) {
    throw new Error("Expected an EN_CURSO active task");
  }
  const isMeAction = activeTask.usuarioAsignado === "Marcelino Perez";
  if (!isMeAction) {
    throw new Error("Expected active task to be assigned to Marcelino Perez");
  }
  console.log("✔ Test 3: Intervention badge ('Acción requerida' vs 'En espera') PASSED");

  console.log("=== All Unit Tests Passed Successfully ===");
}

runTests();
