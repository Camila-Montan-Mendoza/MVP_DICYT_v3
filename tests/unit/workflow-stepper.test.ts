import type {
  PasoWorkflow,
  TareaWorkflow,
  DetalleTramiteWorkflow,
} from "../../lib/workflow/stepper-service";

function runTests() {
  console.log("=== Running Unit Tests: Workflow Stepper & Tasks Interfaces ===");

  // Test 1: PasoWorkflow interface validates correctly
  const paso: PasoWorkflow = {
    id: "p1",
    numero: 1,
    nombre: "Solicitud",
    estado: "EN_CURSO",
  };
  if (!paso.id || !paso.nombre || paso.numero !== 1 || paso.estado !== "EN_CURSO") {
    throw new Error("FAILED: PasoWorkflow interface validation failed");
  }
  console.log("✔ Test 1: PasoWorkflow interface validates correctly PASSED");

  // Test 2: TareaWorkflow interface validates correctly
  const tarea: TareaWorkflow = {
    id: "t1",
    pasoId: "p1",
    nombre: "Revisión presupuestaria",
    rolEsperado: "Responsable de Presupuesto",
    rolResponsable: "Responsable de Presupuesto",
    usuarioAsignado: "Alan",
    estado: "COMPLETADO",
    fechaCompletado: "10 Ene 2026",
  };
  if (!tarea.fechaCompletado || tarea.estado !== "COMPLETADO") {
    throw new Error("FAILED: TareaWorkflow interface validation failed");
  }
  console.log("✔ Test 2: TareaWorkflow interface with fechaCompletado PASSED");

  // Test 3: DetalleTramiteWorkflow interface validates correctly
  const detalle: DetalleTramiteWorkflow = {
    id: "tr-001",
    nroTramite: "TR-2026-001",
    proyectoNombre: "Proyecto Test",
    solicitanteNombre: "Dr. Test",
    pasos: [paso],
    tareas: [tarea],
  };
  if (detalle.pasos.length !== 1 || detalle.tareas.length !== 1) {
    throw new Error("FAILED: DetalleTramiteWorkflow validation failed");
  }
  console.log("✔ Test 3: DetalleTramiteWorkflow interface validates correctly PASSED");

  // Test 4: Estado values are strictly typed
  const validEstados: PasoWorkflow["estado"][] = ["COMPLETADO", "EN_CURSO", "PENDIENTE"];
  for (const est of validEstados) {
    const p: PasoWorkflow = { id: "px", numero: 1, nombre: "Test", estado: est };
    if (!p.estado) throw new Error(`FAILED: Estado ${est} not valid`);
  }
  console.log("✔ Test 4: All 3 estado values are valid PASSED");

  console.log("=== All Unit Tests Passed Successfully ===");
}

runTests();
