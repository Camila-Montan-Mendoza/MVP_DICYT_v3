import { ItemSolicitud, TramiteSolicitud, ItemCategoria } from "@/types/requisitions";

/**
 * Pure domain function to auto-classify items and segregate them into
 * up to 3 strictly homogeneous requisition drafts (Materiales, Activos Fijos, Servicios).
 */
export function segregateItemsToRequisitions(
  items: ItemSolicitud[],
  existingTramites: TramiteSolicitud[] = []
): TramiteSolicitud[] {
  if (!items || items.length === 0) {
    return [];
  }

  // Group items by exact category
  const grouped: Record<ItemCategoria, ItemSolicitud[]> = {
    MATERIAL: [],
    ACTIVO_FIJO: [],
    SERVICIO: [],
  };

  for (const item of items) {
    // Calculate reference price
    let precioReferencial = item.precioReferencial;
    if (item.categoria !== "SERVICIO" && item.cantidad && item.precioUnitario) {
      precioReferencial = item.cantidad * item.precioUnitario;
    }

    const processedItem: ItemSolicitud = {
      ...item,
      precioReferencial,
    };

    if (grouped[item.categoria]) {
      grouped[item.categoria].push(processedItem);
    }
  }

  const categories: ItemCategoria[] = ["MATERIAL", "ACTIVO_FIJO", "SERVICIO"];
  const result: TramiteSolicitud[] = [];

  for (const cat of categories) {
    const categoryItems = grouped[cat];
    if (categoryItems.length > 0) {
      // Find existing tramite to preserve header fields
      const existing = existingTramites.find((t) => t.categoria === cat);

      const tramite: TramiteSolicitud = {
        id: existing ? existing.id : `tramite-${cat.toLowerCase()}-${Date.now()}`,
        categoria: cat,
        estado: existing ? existing.estado : "BORRADOR",
        justificacion: existing ? existing.justificacion : "",
        archivosRespaldo: existing ? existing.archivosRespaldo : [],
        custodioNombre: existing ? existing.custodioNombre : "",
        custodioUbicacion: existing ? existing.custodioUbicacion : "",
        items: categoryItems,
        fechaCreacion: existing ? existing.fechaCreacion : new Date().toISOString(),
      };

      result.push(tramite);
    }
  }

  return result;
}

/**
 * Validates a single requisition draft against administrative business rules.
 * Returns array of validation error messages (empty array if valid).
 */
export function validateTramite(tramite: TramiteSolicitud): string[] {
  const errors: string[] = [];

  if (!tramite.justificacion || tramite.justificacion.trim() === "") {
    errors.push("La Justificación del Trámite es obligatoria.");
  }

  if (!tramite.archivosRespaldo || tramite.archivosRespaldo.length === 0) {
    errors.push("Debe adjuntar al menos un archivo de respaldo (proforma o cotización).");
  }

  if (tramite.categoria === "ACTIVO_FIJO") {
    if (!tramite.custodioNombre || tramite.custodioNombre.trim() === "") {
      errors.push("El Nombre del Custodio es obligatorio para Activos Fijos.");
    }
    if (!tramite.custodioUbicacion || tramite.custodioUbicacion.trim() === "") {
      errors.push("La Ubicación/Laboratorio es obligatoria para Activos Fijos.");
    }
  }

  if (!tramite.items || tramite.items.length === 0) {
    errors.push("El trámite no contiene ningún ítem.");
  } else {
    for (let i = 0; i < tramite.items.length; i++) {
      const item = tramite.items[i];
      const indexStr = `Ítem ${i + 1} (${item.nombre})`;

      if (item.categoria !== "SERVICIO") {
        if (!item.cantidad || item.cantidad <= 0) {
          errors.push(`${indexStr}: Debe especificar una Cantidad mayor a 0.`);
        }
        if (!item.unidad || item.unidad.trim() === "") {
          errors.push(`${indexStr}: La Unidad de medida es requerida.`);
        }
        if (!item.precioUnitario || item.precioUnitario <= 0) {
          errors.push(`${indexStr}: El Precio Unitario debe ser mayor a 0.`);
        }
        if (!item.documentotecnicoPath) {
          errors.push(`${indexStr}: Debe adjuntar el documento ET (Especificaciones Técnicas).`);
        }
      } else {
        if (!item.detalleServicio || item.detalleServicio.trim() === "") {
          errors.push(`${indexStr}: El Detalle del Servicio es requerido.`);
        }
        if (!item.precioReferencial || item.precioReferencial <= 0) {
          errors.push(`${indexStr}: El Precio Referencial debe ser mayor a 0.`);
        }
        if (!item.documentotecnicoPath) {
          errors.push(`${indexStr}: Debe adjuntar el documento TDR en PDF.`);
        }
      }
    }
  }

  return errors;
}
