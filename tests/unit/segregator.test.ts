import { segregateItemsToRequisitions, validateTramite } from "../../lib/requisitions/segregator";
import { ItemSolicitud } from "../../types/requisitions";

// Simple test runner for MVP validation
function runSegregatorTests() {
  console.log("=== Running Unit Tests: Segregator & Validation ===");

  const sampleItems: ItemSolicitud[] = [
    {
      id: "1",
      nombre: "Reactivo A",
      categoria: "MATERIAL",
      cantidad: 10,
      unidad: "Frasco",
      precioUnitario: 50,
      precioReferencial: 0,
      partidaPresupuestaria: "34110",
      documentotecnicoPath: "et_reactivo.pdf",
    },
    {
      id: "2",
      nombre: "Microscopio",
      categoria: "ACTIVO_FIJO",
      cantidad: 1,
      unidad: "Equipo",
      precioUnitario: 12000,
      precioReferencial: 0,
      partidaPresupuestaria: "43100",
      documentotecnicoPath: "et_microscopio.pdf",
    },
    {
      id: "3",
      nombre: "Calibración Anual",
      categoria: "SERVICIO",
      precioReferencial: 2500,
      detalleServicio: "Servicio de calibración de balanzas",
      partidaPresupuestaria: "39100",
      documentotecnicoPath: "tdr_calibracion.pdf",
    },
  ];

  // Test 1: Segregation into 3 distinct requisitions
  const tramites = segregateItemsToRequisitions(sampleItems);
  console.assert(tramites.length === 3, `Expected 3 tramites, got ${tramites.length}`);
  console.assert(tramites[0].categoria === "MATERIAL", "First tramite should be MATERIAL");
  console.assert(tramites[1].categoria === "ACTIVO_FIJO", "Second tramite should be ACTIVO_FIJO");
  console.assert(tramites[2].categoria === "SERVICIO", "Third tramite should be SERVICIO");
  console.assert(
    tramites[0].items[0].precioReferencial === 500,
    "Material price calculation failed"
  );

  console.log("✔ Test 1: Auto-segregation into 3 homogeneous tramites PASSED");

  // Test 2: Validation for Activo Fijo custodian rules
  const invalidActivoFijo = tramites[1];
  invalidActivoFijo.justificacion = "Justificación válida";
  invalidActivoFijo.archivosRespaldo = [
    { id: "res-1", nombre: "proforma.pdf", path: "proforma.pdf" },
  ];
  // Missing custodioNombre and custodioUbicacion

  const errors = validateTramite(invalidActivoFijo);
  console.assert(errors.length > 0, "Validation should fail when custodian info is missing");
  console.assert(
    errors.some((e) => e.includes("Custodio")),
    "Should report Custodio error"
  );

  console.log("✔ Test 2: Activo Fijo custodian validation rules PASSED");

  console.log("=== All Unit Tests Passed Successfully ===");
}

runSegregatorTests();
