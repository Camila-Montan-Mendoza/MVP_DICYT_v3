import { validateTramite } from "../../lib/requisitions/segregator";
import { TramiteSolicitud } from "../../types/requisitions";

async function runBatchSubmitTest() {
  console.log("=== Running Unit Test: Resilient Batch Submit Logic ===");

  const validMaterial: TramiteSolicitud = {
    id: "mat-1",
    categoria: "MATERIAL",
    estado: "BORRADOR",
    justificacion: "Compra de insumos químicos",
    archivosRespaldo: [{ id: "1", nombre: "proforma.pdf", path: "path.pdf" }],
    items: [
      {
        id: "item-1",
        nombre: "Reactivo A",
        categoria: "MATERIAL",
        cantidad: 10,
        unidad: "Frasco",
        precioUnitario: 50,
        precioReferencial: 500,
        partidaPresupuestaria: "34110",
        documentotecnicoPath: "et.pdf",
      },
    ],
    fechaCreacion: new Date().toISOString(),
  };

  const invalidActivoFijo: TramiteSolicitud = {
    id: "af-2",
    categoria: "ACTIVO_FIJO",
    estado: "BORRADOR",
    justificacion: "Compra de equipo laboratorio",
    archivosRespaldo: [], // Missing respaldo file
    custodioNombre: "", // Missing custodio
    items: [],
    fechaCreacion: new Date().toISOString(),
  };

  const tramites = [validMaterial, invalidActivoFijo];

  const results = await Promise.allSettled(
    tramites.map(async (t) => {
      const errors = validateTramite(t);
      if (errors.length > 0) {
        throw { id: t.id, categoria: t.categoria, errores: errors };
      }
      return { id: t.id, codigoSeguimiento: "TR-2026-0001", categoria: t.categoria };
    })
  );

  const exitosos = results.filter((r) => r.status === "fulfilled");
  const fallidos = results.filter((r) => r.status === "rejected");

  console.assert(exitosos.length === 1, "Expected 1 successful tramite submission");
  console.assert(fallidos.length === 1, "Expected 1 failed tramite submission");

  console.log(
    "✔ Resilient Batch Submit Test PASSED: Valid tramites submit independently without being blocked by invalid ones."
  );
}

runBatchSubmitTest();
