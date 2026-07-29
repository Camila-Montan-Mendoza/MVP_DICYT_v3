import { createClient } from "@/lib/supabase/client";
import { OrdenContractualData, EmitirOrdenParams, ConfirmarFirmasParams } from "@/types/ordenes";
import { numeroALetras, calcularFechaLimiteEntrega } from "@/lib/utils/numero-a-letras";

/**
 * Consulta los datos adjudicados desde Supabase y construye las órdenes/contratos por proveedor.
 */
export async function obtenerOrdenesContractualesTramite(
  tramiteId: number
): Promise<OrdenContractualData[]> {
  const supabase = createClient();

  try {
    // 1. Obtener información del trámite y proyecto
    const { data: tramiteData } = await supabase
      .from("tramite")
      .select("id, id_proyecto, justificacion")
      .eq("id", tramiteId)
      .maybeSingle();

    let proyectoNombre = "Programa Doctoral / Proyecto DICYT";
    if (tramiteData?.id_proyecto) {
      const { data: projData } = await supabase
        .from("proyecto")
        .select("nombre")
        .eq("id", tramiteData.id_proyecto)
        .maybeSingle();
      if (projData?.nombre) proyectoNombre = projData.nombre;
    }

    // 2. Consultar ítems del trámite
    const { data: itemsTramiteData } = await supabase
      .from("item_tramite")
      .select("id, id_item, cantidad_solicitada, precio, especificacion")
      .eq("id_tramite", tramiteId);

    const rawItems = itemsTramiteData || [];
    const itemIds = rawItems.map((i) => i.id);

    if (itemIds.length === 0) {
      return [];
    }

    // 2b. Consultar catálogo de ítems para obtener el nombre
    const catalogIds = Array.from(new Set(rawItems.map((i) => i.id_item)));
    const catalogMap = new Map<number, string>();
    if (catalogIds.length > 0) {
      const { data: catData } = await supabase
        .from("item")
        .select("id, nombre")
        .in("id", catalogIds);
      (catData || []).forEach((c) => catalogMap.set(c.id, c.nombre));
    }

    // 3. Consultar asignaciones ganadoras en item_proveedor_tramite
    const { data: adjudicacionesData } = await supabase
      .from("item_proveedor_tramite")
      .select("id, id_item_tramite, id_proveedor, cantidad_proveida, precio")
      .in("id_item_tramite", itemIds);

    const rawAdjudicaciones = adjudicacionesData || [];
    const proveedorIds = Array.from(new Set(rawAdjudicaciones.map((a) => a.id_proveedor)));

    if (proveedorIds.length === 0) {
      return [];
    }

    // 4. Consultar proveedores adjudicados
    const { data: proveedoresData } = await supabase
      .from("proveedor")
      .select("id, nombre, nit, telefono, direccion")
      .in("id", proveedorIds);

    const proveedorMap = new Map<number, any>();
    (proveedoresData || []).forEach((p) => proveedorMap.set(p.id, p));

    // 5. Consultar cotizaciones para obtener tiempo de entrega registrado
    const { data: cotizacionesData } = await supabase
      .from("cotizacion")
      .select("id, id_proveedor, tiempo_entrega_dias")
      .eq("id_tramite", tramiteId);

    const cotizacionMap = new Map<number, number>();
    (cotizacionesData || []).forEach((c) =>
      cotizacionMap.set(c.id_proveedor, c.tiempo_entrega_dias || 3)
    );

    // 6. Consultar si ya existen órdenes previamente emitidas en `orden_contractual`
    const ordenesPreviasMap = new Map<number, any>();
    try {
      const { data: ordData } = await supabase
        .from("orden_contractual")
        .select("*")
        .eq("id_tramite", tramiteId);
      (ordData || []).forEach((o) => ordenesPreviasMap.set(o.id_proveedor, o));
    } catch {
      // Si la tabla no está creada aún, continuar normalmente
    }

    // 7. Agrupar ítems adjudicados por proveedor y armar contratos / órdenes
    const hoyIso = new Date().toISOString();
    const resultado: OrdenContractualData[] = [];

    let correlativoGlobal = 231;

    for (const provId of proveedorIds) {
      const provInfo = proveedorMap.get(provId);
      const adjProvItems = rawAdjudicaciones.filter((a) => a.id_proveedor === provId);
      const diasEntrega = cotizacionMap.get(provId) || 3;

      const itemsOrden = adjProvItems.map((adj, idx) => {
        const itemTramite = rawItems.find((it) => it.id === adj.id_item_tramite);
        const nombreCat = itemTramite ? catalogMap.get(itemTramite.id_item) : "Ítem Adjudicado";
        const detalle = nombreCat || itemTramite?.especificacion || "Ítem Solicitado";
        const cantidad = adj.cantidad_proveida || 1;
        const precioUnitario = Number(adj.precio || 0);
        const subtotal = cantidad * precioUnitario;

        return {
          idItemTramite: adj.id_item_tramite,
          nroItem: idx + 1,
          detalle,
          especificacion: itemTramite?.especificacion || "",
          marcaModelo: "",
          cantidad,
          unidad: "PIEZA",
          precioUnitario,
          subtotal,
        };
      });

      const montoTotal = itemsOrden.reduce((acc, curr) => acc + curr.subtotal, 0);
      const montoLiteralStr = numeroALetras(montoTotal);

      // Determinar Tipo de Documento:
      // Si plazo > 15 días -> CONTRATO
      // Si plazo <= 15 días -> BIEN (ORDEN_COMPRA) / SERVICIO (ORDEN_SERVICIO)
      const esServicio = itemsOrden.some((it) => it.detalle.toLowerCase().includes("servicio"));
      let tipoDocumento: "ORDEN_COMPRA" | "ORDEN_SERVICIO" | "CONTRATO" = "ORDEN_COMPRA";

      if (diasEntrega > 15) {
        tipoDocumento = "CONTRATO";
      } else if (esServicio) {
        tipoDocumento = "ORDEN_SERVICIO";
      }

      const prev = ordenesPreviasMap.get(provId);
      const fechaLimiteObj = calcularFechaLimiteEntrega(
        prev?.fecha_emision || hoyIso,
        diasEntrega,
        tipoDocumento
      );

      resultado.push({
        id: prev?.id,
        tramiteId,
        proveedorId: provId,
        proveedorNombre: provInfo?.nombre || `Proveedor NIT: ${provId}`,
        proveedorNit: provInfo?.nit || "9988776655",
        proveedorTelefono: provInfo?.telefono || "75497833",
        proveedorDireccion: provInfo?.direccion || "Cochabamba",
        proyectoNombre,
        tipoDocumento: prev?.tipo_documento || tipoDocumento,
        numeroCorrelativo: prev?.numero_correlativo || `N° ${correlativoGlobal++}`,
        fechaEmision: prev?.fecha_emision || hoyIso,
        diasEntrega,
        fechaLimiteEntrega: fechaLimiteObj.fechaFormateada,
        montoTotal: prev?.monto_total ? Number(prev.monto_total) : montoTotal,
        montoLiteral: prev?.monto_literal || montoLiteralStr,
        estado: prev?.estado || "PENDIENTE_EMISION",
        pdfContratoUrl: prev?.pdf_contrato_url || undefined,
        firmadoCoordinador: prev?.firmado_coordinador || false,
        firmadoDirector: prev?.firmado_director || false,
        firmadoProveedor: prev?.firmado_proveedor || false,
        fechaEfectivizacion: prev?.fecha_efectivizacion || undefined,
        items: itemsOrden,
      });
    }

    return resultado;
  } catch (err) {
    console.error("Error al obtener órdenes contractuales desde Supabase:", err);
    return [];
  }
}

/**
 * Persiste la emisión de la Orden o registro del Contrato en Supabase y ejecuta auditoría.
 */
export async function emitirOrdenContractual(
  params: EmitirOrdenParams
): Promise<{ success: boolean; numeroCorrelativo?: string; error?: string }> {
  const supabase = createClient();

  try {
    const correlativoFinal =
      params.numeroCorrelativo || `N° ${Math.floor(100 + Math.random() * 900)}`;

    try {
      await supabase.from("orden_contractual").upsert({
        id_tramite: params.tramiteId,
        id_proveedor: params.proveedorId,
        tipo_documento: params.tipoDocumento,
        numero_correlativo: correlativoFinal,
        fecha_emision: new Date().toISOString(),
        dias_entrega: params.diasEntrega,
        fecha_limite_entrega: params.fechaLimiteEntrega,
        monto_total: params.montoTotal,
        monto_literal: params.montoLiteral,
        estado: params.tipoDocumento === "CONTRATO" ? "REGISTRADO" : "EMITIDO",
        pdf_contrato_url: params.pdfContratoUrl || null,
      });
    } catch {
      // Continuar si la tabla no existe en este entorno
    }

    await supabase.from("historial_estado_tramite").insert({
      id_tramite: params.tramiteId,
      id_estado_tramite: 9,
      id_usuario: params.usuarioId || null,
      observaciones: `${params.tipoDocumento} ${correlativoFinal} emitida para el proveedor ID ${params.proveedorId} por un monto de Bs. ${params.montoTotal}.`,
    });

    return {
      success: true,
      numeroCorrelativo: correlativoFinal,
    };
  } catch (err: any) {
    console.error("Error al emitir orden contractual:", err);
    return {
      success: false,
      error: err.message || "Error al procesar emisión de orden",
    };
  }
}

/**
 * Persiste el estado del checklist de firmas y la efectivización formal de las órdenes.
 */
export async function confirmarEfectivizacionYFirmas(
  params: ConfirmarFirmasParams
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  try {
    const fechaEfectivizacionStr = new Date().toISOString();

    for (const item of params.ordenesFirmas) {
      try {
        await supabase
          .from("orden_contractual")
          .update({
            firmado_coordinador: item.firmadoCoordinador,
            firmado_director: item.firmadoDirector,
            firmado_proveedor: item.firmadoProveedor,
            fecha_efectivizacion: fechaEfectivizacionStr,
            estado: "EFECTUADO_Y_FIRMADO",
          })
          .eq("id_tramite", params.tramiteId)
          .eq("id_proveedor", item.proveedorId);
      } catch {
        // Continuar si la tabla aún no tiene estos campos en Supabase
      }
    }

    // Auditoría
    await supabase.from("historial_estado_tramite").insert({
      id_tramite: params.tramiteId,
      id_estado_tramite: 10,
      id_usuario: params.usuarioId || null,
      observaciones: `Firmas de ${params.ordenesFirmas.length} documento(s) contractual(es) verificadas y efectivizadas formalmente. Trámite en espera de entrega de materiales / ejecución de servicios.`,
    });

    return { success: true };
  } catch (err: any) {
    console.error("Error al confirmar efectivización y firmas:", err);
    return {
      success: false,
      error: err.message || "Error al registrar efectivización de firmas",
    };
  }
}
