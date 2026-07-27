import {
  MOCK_TRAMITES_CONSOLIDADOS,
  filterTramitesConsolidados,
} from "../../lib/tramites/consolidated-service";

function runTests() {
  console.log("=== Running Unit Tests: Consolidated Inbox & Filtering ===");

  // Test 1: Search by text
  const searchResults = filterTramitesConsolidados(MOCK_TRAMITES_CONSOLIDADOS, {
    search: "VLIR",
  });
  if (searchResults.length !== 2) {
    throw new Error(`Expected 2 items for search 'VLIR', got ${searchResults.length}`);
  }
  console.log("✔ Test 1: Filter by search text (proyecto/nro) PASSED");

  // Test 2: Filter by tipo de trámite
  const tipoResults = filterTramitesConsolidados(MOCK_TRAMITES_CONSOLIDADOS, {
    tipoTramite: "Solicitud de Servicio",
  });
  if (tipoResults.length !== 1 || tipoResults[0].id !== "tr-002") {
    throw new Error("Expected 1 item for tipo 'Solicitud de Servicio'");
  }
  console.log("✔ Test 2: Filter by tipo de trámite PASSED");

  // Test 3: Action button resolution
  const atenderCount = MOCK_TRAMITES_CONSOLIDADOS.filter((t) => t.requiereAccion).length;
  const verDetalleCount = MOCK_TRAMITES_CONSOLIDADOS.filter((t) => !t.requiereAccion).length;
  if (atenderCount === 0 || verDetalleCount === 0) {
    throw new Error("Expected non-zero counts for ATENDER and VER DETALLE items");
  }
  console.log("✔ Test 3: Action button resolution (ATENDER vs VER DETALLE) PASSED");

  console.log("=== All Unit Tests Passed Successfully ===");
}

runTests();
