import { getTaskTransitionHandler } from "../../lib/workflow/handlers/handler-registry";
import { defaultTaskHandler } from "../../lib/workflow/handlers/default-task-handler";
import { tarea1PresupuestoHandler } from "../../lib/workflow/handlers/paso-1-solicitud/tarea-1-presupuesto-handler";

console.log("=== Running Unit Tests: Workflow Transition Handlers ===");

async function testHandlerRegistry() {
  const handler1 = getTaskTransitionHandler(1);
  if (handler1 !== tarea1PresupuestoHandler) {
    throw new Error("FAILED: Task 1 should resolve to tarea1PresupuestoHandler");
  }
  console.log("✔ Test 1: Task 1 resolves custom handler PASSED");

  const handlerUnknown = getTaskTransitionHandler(999);
  if (handlerUnknown !== defaultTaskHandler) {
    throw new Error("FAILED: Unknown task should fallback to defaultTaskHandler");
  }
  console.log("✔ Test 2: Unknown task resolves defaultTaskHandler PASSED");
}

async function testTarea1Validation() {
  const resultObsFail = await tarea1PresupuestoHandler({
    tramiteId: 1,
    idEstadoOrigen: 1,
    idEstadoDestino: 3,
    nombreAccion: "Observar y Solicitar Corrección",
    usuarioId: 1,
    datosExtra: {},
  });

  if (resultObsFail.success !== false) {
    throw new Error("FAILED: Observación without details should fail validation");
  }
  console.log("✔ Test 3: Tarea 1 observation validation PASSED");

  const resultOk = await tarea1PresupuestoHandler({
    tramiteId: 1,
    idEstadoOrigen: 1,
    idEstadoDestino: 2,
    nombreAccion: "Aprobar Presupuesto",
    usuarioId: 1,
    datosExtra: {},
  });

  if (resultOk.success !== true) {
    throw new Error("FAILED: Valid approval should succeed");
  }
  console.log("✔ Test 4: Tarea 1 approval validation PASSED");
}

async function runAll() {
  await testHandlerRegistry();
  await testTarea1Validation();
  console.log("=== All Workflow Transition Handler Tests Passed Successfully ===");
}

runAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
