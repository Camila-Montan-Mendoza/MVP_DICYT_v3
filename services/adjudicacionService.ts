import { createClient } from "@/lib/supabase/client";
import { TramiteAdjudicacion, AsignacionProveedorItem } from "@/types/adjudicacion";

export interface ConfirmarAdjudicacionParams {
  tramiteId: number;
  justificacionGeneral: string;
  asignacionesPorItem: Map<number, AsignacionProveedorItem[]>; // Key: idItemTramite
  usuarioId?: number;
}

/**
 * Consulta la información del trámite, sus ítems solicitados, cotizaciones registradas y adjudicaciones previas desde Supabase.
 */
export async function obtenerCuadroComparativoTramite(
  tramiteId: number
): Promise<TramiteAdjudicacion | null> {
  const supabase = createClient();

  // 1. Consultar datos del trámite
  const { data: tramiteData, error: tramiteErr } = await supabase
    .from("tramite")
    .select("id, id_proyecto, id_tipo_tramite, id_estado_tramite, justificacion")
    .eq("id", tramiteId)
    .maybeSingle();

  if (tramiteErr || !tramiteData) {
    console.error("Error al obtener trámite:", tramiteErr || "Trámite no encontrado");
    return null;
  }

  // 1b. Consultar datos del proyecto asociado
  let proyectoObj: { id: number; nombre: string } | null = null;
  if (tramiteData.id_proyecto) {
    const { data: projData } = await supabase
      .from("proyecto")
      .select("id, nombre")
      .eq("id", tramiteData.id_proyecto)
      .maybeSingle();
    if (projData) {
      proyectoObj = projData;
    }
  }

  // 2. Consultar ítems del trámite
  const { data: itemsData, error: itemsErr } = await supabase
    .from("item_tramite")
    .select("id, id_item, id_tramite, cantidad_solicitada, precio, especificacion")
    .eq("id_tramite", tramiteId);

  if (itemsErr) {
    console.error("Error al obtener ítems del trámite:", itemsErr);
  }

  const rawItems = itemsData || [];
  const catalogIds = Array.from(new Set(rawItems.map((i) => i.id_item)));
  const catalogMap = new Map<number, { id: number; nombre: string }>();

  if (catalogIds.length > 0) {
    const { data: catData } = await supabase.from("item").select("id, nombre").in("id", catalogIds);
    (catData || []).forEach((c) => catalogMap.set(c.id, c));
  }

  // 3. Consultar cotizaciones del trámite
  const { data: cotizacionesData, error: cotizacionesErr } = await supabase
    .from("cotizacion")
    .select("id, id_tramite, id_proveedor, tiempo_entrega_dias, validez_oferta_dias")
    .eq("id_tramite", tramiteId);

  if (cotizacionesErr) {
    console.error("Error al obtener cotizaciones:", cotizacionesErr);
  }

  const rawCotizaciones = cotizacionesData || [];
  const proveedorIds = Array.from(new Set(rawCotizaciones.map((c) => c.id_proveedor)));
  const cotizacionIds = rawCotizaciones.map((c) => c.id);

  // 3b. Consultar proveedores asociados
  const proveedorMap = new Map<number, any>();
  if (proveedorIds.length > 0) {
    const { data: provData } = await supabase
      .from("proveedor")
      .select("id, nombre, nit, telefono, direccion")
      .in("id", proveedorIds);
    (provData || []).forEach((p) => proveedorMap.set(p.id, p));
  }

  // 3c. Consultar detalle de cotizaciones
  const detallesMap = new Map<number, any[]>();
  if (cotizacionIds.length > 0) {
    const { data: detData } = await supabase
      .from("detalle_cotizacion")
      .select("id, id_cotizacion, id_tramite_item, cantidad_existencias, precio, especificacion")
      .in("id_cotizacion", cotizacionIds);

    (detData || []).forEach((d) => {
      const list = detallesMap.get(d.id_cotizacion) || [];
      list.push(d);
      detallesMap.set(d.id_cotizacion, list);
    });
  }

  // 4. Consultar adjudicaciones registradas previamente en item_proveedor_tramite
  const itemIds = rawItems.map((i) => i.id);
  let adjudicacionesData: any[] = [];
  if (itemIds.length > 0) {
    const { data: adjData, error: adjErr } = await supabase
      .from("item_proveedor_tramite")
      .select("id, id_item_tramite, id_proveedor, cantidad_proveida, precio")
      .in("id_item_tramite", itemIds);

    if (adjErr) {
      console.warn("Advertencia al consultar adjudicaciones previas:", adjErr.message);
    } else {
      adjudicacionesData = adjData || [];
    }
  }

  // Mapear respuesta completa estructurada
  return {
    id: tramiteData.id,
    id_proyecto: tramiteData.id_proyecto,
    id_tipo_tramite: tramiteData.id_tipo_tramite,
    id_estado_tramite: tramiteData.id_estado_tramite,
    justificacion: tramiteData.justificacion,
    proyecto: proyectoObj,
    usuario: null,
    item_tramite: rawItems.map((it) => ({
      id: it.id,
      id_item: it.id_item,
      id_tramite: it.id_tramite,
      cantidad_solicitada: it.cantidad_solicitada,
      precio: Number(it.precio),
      especificacion: it.especificacion,
      item: catalogMap.get(it.id_item) || { id: it.id_item, nombre: it.especificacion },
    })),
    cotizacion: rawCotizaciones.map((c) => ({
      id: c.id,
      id_tramite: c.id_tramite,
      id_proveedor: c.id_proveedor,
      tiempo_entrega_dias: c.tiempo_entrega_dias,
      validez_oferta_dias: c.validez_oferta_dias,
      proveedor: proveedorMap.get(c.id_proveedor) || null,
      detalle_cotizacion: (detallesMap.get(c.id) || []).map((dc) => ({
        id: dc.id,
        id_cotizacion: dc.id_cotizacion,
        id_tramite_item: dc.id_tramite_item,
        cantidad_existencias: dc.cantidad_existencias,
        precio: Number(dc.precio),
        especificacion: dc.especificacion,
      })),
    })),
    item_proveedor_tramite: adjudicacionesData.map((a) => ({
      id: a.id,
      id_item_tramite: a.id_item_tramite,
      id_proveedor: a.id_proveedor,
      cantidad_proveida: a.cantidad_proveida,
      precio: Number(a.precio),
    })),
  };
}

/**
 * Persiste la justificación obligatoria, limpia e inserta las adjudicaciones en `item_proveedor_tramite`
 * y registra la trazabilidad en `historial_estado_tramite`.
 */
export async function confirmarAdjudicacionTramite({
  tramiteId,
  justificacionGeneral,
  asignacionesPorItem,
  usuarioId = 1,
}: ConfirmarAdjudicacionParams): Promise<{
  success: boolean;
  error?: string;
  montoLiberado?: number;
}> {
  const supabase = createClient();

  try {
    // 1. Actualizar justificación general en la tabla tramite
    const { error: tramiteUpdateErr } = await supabase
      .from("tramite")
      .update({
        justificacion: justificacionGeneral,
        fecha_actualizacion: new Date().toISOString(),
      })
      .eq("id", tramiteId);

    if (tramiteUpdateErr) {
      throw new Error(`Error actualizando justificación del trámite: ${tramiteUpdateErr.message}`);
    }

    // 2. Obtener lista de IDs de ítems para limpiar e insertar
    const itemIds = Array.from(asignacionesPorItem.keys());

    if (itemIds.length > 0) {
      // Eliminar adjudicaciones previas para estos ítems
      const { error: deleteErr } = await supabase
        .from("item_proveedor_tramite")
        .delete()
        .in("id_item_tramite", itemIds);

      if (deleteErr) {
        console.warn("Advertencia al limpiar adjudicaciones previas:", deleteErr.message);
      }

      // Preparar nuevos registros de adjudicación válidos (cantidad > 0)
      const nuevosRegistros: any[] = [];
      asignacionesPorItem.forEach((asignaciones, idItemTramite) => {
        asignaciones.forEach((asig) => {
          if (asig.cantidadAdjudicada > 0) {
            nuevosRegistros.push({
              id_item_tramite: idItemTramite,
              id_proveedor: asig.idProveedor,
              cantidad_proveida: asig.cantidadAdjudicada,
              precio: asig.precioUnitario,
            });
          }
        });
      });

      if (nuevosRegistros.length > 0) {
        const { error: insertErr } = await supabase
          .from("item_proveedor_tramite")
          .insert(nuevosRegistros);

        if (insertErr) {
          throw new Error(`Error al guardar asignaciones de adjudicación: ${insertErr.message}`);
        }
      }
    }

    // 3. Registrar auditoría en historial_estado_tramite
    const { error: historialErr } = await supabase.from("historial_estado_tramite").insert({
      id_tramite: tramiteId,
      id_estado_tramite: 6, // Estado paso adjudicado o siguiente paso
      id_usuario: usuarioId,
      observaciones: `Adjudicación finalizada por IP. Justificación General: ${justificacionGeneral}`,
    });

    if (historialErr) {
      console.warn("Advertencia al registrar auditoría en historial:", historialErr.message);
    }

    return { success: true };
  } catch (err: any) {
    console.error("Excepción en confirmarAdjudicacionTramite:", err);
    return { success: false, error: err.message || "Error desconocido al procesar adjudicación" };
  }
}

/**
 * Persiste o actualiza un proveedor en Supabase por NIT.
 */
export async function upsertProveedor(datos: {
  nit: string;
  nombre: string;
  telefono?: string;
  direccion?: string;
}): Promise<number | null> {
  const supabase = createClient();
  const nitTrimmed = datos.nit.trim();

  // Buscar si ya existe por NIT
  const { data: existente } = await supabase
    .from("proveedor")
    .select("id")
    .eq("nit", nitTrimmed)
    .single();

  if (existente) {
    return existente.id;
  }

  // Insertar nuevo proveedor
  const { data: nuevo, error } = await supabase
    .from("proveedor")
    .insert({
      nombre: datos.nombre.trim() || `Proveedor NIT ${nitTrimmed}`,
      nit: nitTrimmed,
      telefono: datos.telefono?.trim() || null,
      direccion: datos.direccion?.trim() || null,
    })
    .select("id")
    .single();

  if (error || !nuevo) {
    console.error("Error al insertar proveedor:", error);
    return null;
  }

  return nuevo.id;
}

/**
 * Persiste una cotización completa con sus detalles de ítems en Supabase.
 */
export async function guardarCotizacionProforma({
  tramiteId,
  nit,
  proveedorNombre,
  telefono,
  direccion,
  tiempoEntregaDias = 3,
  validezOfertaDias = 30,
  items,
}: {
  tramiteId: number;
  nit: string;
  proveedorNombre: string;
  telefono: string;
  direccion: string;
  tiempoEntregaDias?: number;
  validezOfertaDias?: number;
  items: Array<{
    idItem: number; // id_tramite_item
    cantidad: number;
    precioUnitario: number;
    conExistencia: boolean;
    detalle: string;
  }>;
}): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  try {
    // 1. Asegurar el registro del proveedor en la tabla `proveedor`
    const proveedorId = await upsertProveedor({
      nit,
      nombre: proveedorNombre,
      telefono,
      direccion,
    });

    if (!proveedorId) {
      throw new Error("No se pudo registrar ni obtener el ID del proveedor.");
    }

    // 2. Insertar cabecera en `cotizacion`
    const { data: cotizacionData, error: cotErr } = await supabase
      .from("cotizacion")
      .insert({
        id_tramite: tramiteId,
        id_proveedor: proveedorId,
        tiempo_entrega_dias: tiempoEntregaDias,
        validez_oferta_dias: validezOfertaDias,
      })
      .select("id")
      .single();

    if (cotErr || !cotizacionData) {
      throw new Error(`Error insertando cabecera de cotización: ${cotErr?.message}`);
    }

    const cotizacionId = cotizacionData.id;

    // 3. Insertar detalles en `detalle_cotizacion`
    const detallesInsert = items.map((it) => ({
      id_cotizacion: cotizacionId,
      id_tramite_item: it.idItem,
      cantidad_existencias: it.conExistencia ? it.cantidad : 0,
      precio: it.precioUnitario,
      especificacion: it.detalle || "",
    }));

    const { error: detErr } = await supabase.from("detalle_cotizacion").insert(detallesInsert);

    if (detErr) {
      throw new Error(`Error insertando detalles de cotización: ${detErr.message}`);
    }

    return { success: true };
  } catch (err: any) {
    console.error("Error al guardar proforma en Supabase:", err);
    return { success: false, error: err.message || "Error al guardar proforma" };
  }
}
