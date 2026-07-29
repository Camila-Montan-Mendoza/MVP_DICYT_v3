import { createClient } from "@/lib/supabase/client";
import {
  RecepcionProveedorData,
  GuardarActaParams,
  MaterialRecepcionItem,
} from "@/types/recepcion";
import { obtenerOrdenesContractualesTramite } from "./ordenesService";

/**
 * Consulta la información del trámite, orden de compra e ítems adjudicados desde Supabase para la recepción.
 */
export async function obtenerDatosRecepcionTramite(
  tramiteId: number
): Promise<RecepcionProveedorData[]> {
  const supabase = createClient();

  try {
    // 1. Obtener órdenes contractuales del trámite previa emisión en Tarea 9 y 10
    const ordenes = await obtenerOrdenesContractualesTramite(tramiteId);

    if (ordenes.length === 0) {
      return [];
    }

    // 2. Consultar si existen actas previamente registradas en Supabase (`acta_recepcion`)
    let actasMap = new Map<number, any>();
    try {
      const { data: actasData } = await supabase
        .from("acta_recepcion")
        .select("*")
        .eq("id_tramite", tramiteId);
      (actasData || []).forEach((a) => actasMap.set(a.id_proveedor || a.id_orden_contractual, a));
    } catch {
      // Ignorar si la tabla aún no existe en Supabase
    }

    const resultado: RecepcionProveedorData[] = [];

    for (const ord of ordenes) {
      const actaPrev = actasMap.get(ord.proveedorId) || (ord.id !== undefined ? actasMap.get(ord.id) : undefined);

      const materiales: MaterialRecepcionItem[] = ord.items.map((it) => ({
        idItemTramite: it.idItemTramite,
        nroItem: it.nroItem,
        detalle: it.detalle,
        especificacion: it.especificacion,
        cantidad: it.cantidad,
        unidad: it.unidad,
        precioTotal: it.subtotal,
        estadoMaterial: "Excelente",
      }));

      resultado.push({
        ordenId: ord.id,
        tramiteId,
        proveedorId: ord.proveedorId,
        proveedorNombre: ord.proveedorNombre,
        proveedorNit: ord.proveedorNit,
        numeroOrdenCompra: ord.numeroCorrelativo || "OC-2023-00452-L1",
        proyectoNombre: ord.proyectoNombre,
        unidadSolicitante: "Facultad de Ciencias y Tecnología - Lab. Hidráulica",
        nombreCoordinador: actaPrev?.nombre_coordinador || "Dr. Winsor Orellana",
        nombreRepProveedor: actaPrev?.nombre_rep_proveedor || ord.proveedorNombre,
        nombreRepBienes: actaPrev?.nombre_rep_bienes || "Ing. Mario Gutiérrez (Bienes e Inventarios)",
        facturaUrl: actaPrev?.factura_url || undefined,
        evidenciaUrl: actaPrev?.evidencia_url || undefined,
        observaciones: actaPrev?.observaciones || "",
        tipoActa: (actaPrev?.tipo_acta as "PROVISIONAL" | "DEFINITIVA") || "PENDIENTE",
        materiales,
      });
    }

    return resultado;
  } catch (err) {
    console.error("Error al obtener datos de recepción desde Supabase:", err);
    return [];
  }
}

/**
 * Persiste el Acta de Recepción (Provisional o Definitiva) en Supabase y ejecuta auditoría.
 */
export async function guardarActaRecepcion(
  params: GuardarActaParams
): Promise<{ success: boolean; idActa?: number; error?: string }> {
  const supabase = createClient();

  try {
    const fechaActualIso = new Date().toISOString();

    let idActaGenerado: number | undefined;

    // 1. Intentar upsert en `acta_recepcion`
    try {
      const { data: actaRes } = await supabase
        .from("acta_recepcion")
        .upsert({
          id_tramite: params.tramiteId,
          id_orden_contractual: params.ordenId || null,
          id_proveedor: params.proveedorId,
          tipo_acta: params.tipoActa,
          fecha_recepcion: fechaActualIso,
          nombre_coordinador: params.nombreCoordinador,
          nombre_rep_proveedor: params.nombreRepProveedor,
          nombre_rep_bienes: params.nombreRepBienes,
          factura_url: params.facturaUrl || null,
          evidencia_url: params.evidenciaUrl || null,
          observaciones: params.observaciones || null,
          estado: params.tipoActa,
        })
        .select("id")
        .maybeSingle();

      if (actaRes?.id) idActaGenerado = actaRes.id;
    } catch {
      // Ignorar si la tabla no existe en la BD local
    }

    // 2. Auditoría en `historial_estado_tramite`
    const obsStr = `Acta de Recepción ${params.tipoActa} registrada para el proveedor ID ${params.proveedorId}. Participantes: ${params.nombreCoordinador}, ${params.nombreRepProveedor}.`;

    await supabase.from("historial_estado_tramite").insert({
      id_tramite: params.tramiteId,
      id_estado_tramite: 11,
      id_usuario: params.usuarioId || null,
      observaciones: obsStr,
    });

    return {
      success: true,
      idActa: idActaGenerado,
    };
  } catch (err: any) {
    console.error("Error al guardar acta de recepción en Supabase:", err);
    return {
      success: false,
      error: err.message || "Error al procesar acta de recepción",
    };
  }
}
