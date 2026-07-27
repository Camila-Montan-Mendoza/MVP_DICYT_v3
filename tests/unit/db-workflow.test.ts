/**
 * Unit Test: Verifica que workflow-db-service exporta las funciones correctas
 * y que las interfaces de retorno son coherentes.
 *
 * NOTA: Este test NO ejecuta queries reales (requeriría Supabase en vivo).
 * Solo verifica que los exports del módulo están disponibles.
 */
import {
  cargarGrafoWorkflow,
  cargarNodosDelPaso,
  obtenerNodoPorId,
  cargarTransicionesDesdeNodo,
  cargarPasosFlujo,
  invalidarCacheWorkflow,
} from "../../lib/workflow/workflow-db-service";

console.log("=== Running Unit Tests: Workflow DB Service Exports ===");

// Test 1: All functions are exported and callable
function testExports() {
  if (typeof cargarGrafoWorkflow !== "function") throw new Error("FAILED: cargarGrafoWorkflow not exported");
  if (typeof cargarNodosDelPaso !== "function") throw new Error("FAILED: cargarNodosDelPaso not exported");
  if (typeof obtenerNodoPorId !== "function") throw new Error("FAILED: obtenerNodoPorId not exported");
  if (typeof cargarTransicionesDesdeNodo !== "function") throw new Error("FAILED: cargarTransicionesDesdeNodo not exported");
  if (typeof cargarPasosFlujo !== "function") throw new Error("FAILED: cargarPasosFlujo not exported");
  if (typeof invalidarCacheWorkflow !== "function") throw new Error("FAILED: invalidarCacheWorkflow not exported");
  console.log("✔ Test 1: All 6 workflow-db-service functions are exported PASSED");
}

// Test 2: invalidarCacheWorkflow doesn't throw
function testInvalidateCache() {
  try {
    invalidarCacheWorkflow();
    console.log("✔ Test 2: invalidarCacheWorkflow executes without error PASSED");
  } catch (e) {
    throw new Error(`FAILED: invalidarCacheWorkflow threw: ${e}`);
  }
}

testExports();
testInvalidateCache();
console.log("=== All Workflow DB Service Export Tests Passed Successfully ===");
