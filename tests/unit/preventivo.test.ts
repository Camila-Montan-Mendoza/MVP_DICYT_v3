import {
  obtenerCertificacionPartidas,
  generarSelloPreventivo,
  PartidaPresupuestariaCheck,
} from "../../lib/budget/preventivo-service";

function runTests() {
  console.log("=== Running Unit Tests: Sello Preventivo & Revision Presupuestaria ===");

  // Test 1: Budget sufficiency check per 5-digit partida
  const partidas = obtenerCertificacionPartidas();
  const allSuficientes = partidas.every((p: PartidaPresupuestariaCheck) => p.suficiente);
  if (!allSuficientes) {
    throw new Error("Expected all partidas to have sufficient budget");
  }
  console.log("✔ Test 1: Budget sufficiency check per 5-digit partida PASSED");

  // Test 2: Preventive seal correlative PREV-2026-XXXXX generation
  const sello = generarSelloPreventivo("Alan - Resp. Presupuestos");
  if (!sello.correlativo.startsWith("PREV-2026-")) {
    throw new Error(`Expected correlative to start with 'PREV-2026-', got ${sello.correlativo}`);
  }
  if (sello.usuarioAprobador !== "Alan - Resp. Presupuestos") {
    throw new Error("Expected approver name 'Alan - Resp. Presupuestos'");
  }
  console.log("✔ Test 2: Preventive seal correlative PREV-2026-XXXXX generation PASSED");

  console.log("=== All Unit Tests Passed Successfully ===");
}

runTests();
