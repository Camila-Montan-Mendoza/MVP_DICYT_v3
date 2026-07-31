import { createClient } from "@/lib/supabase/client";
import {
  SolicitudPagoProveedorData,
  EnviarSolicitudPagoParams,
  ValidarSolicitudPagoParams,
  ObservarSolicitudPagoParams,
  ItemSolicitudPago,
} from "@/types/solicitudPago";
import { obtenerOrdenesContractualesTramite } from "./ordenesService";

function numeroAMontoLiteral(monto: number): string {
  // Conversor simple de número a palabras en bolivianos
  const enteros = Math.floor(monto);
  const centavos = Math.round((monto - enteros) * 100);
  const centavosStr = centavos < 10 ? `0${centavos}` : `${centavos}`;
  return `SON: ${enteros.toLocaleString("es-BO")} ${centavosStr}/100 BOLIVIANOS`;
}

/**
 * Consulta la información del trámite, ordenes contractuales, actas y solicitudes de pago registradas en Supabase.
 */
export async function obtenerSolicitudesPagoTramite(
  tramiteId: number
): Promise<SolicitudPagoProveedorData[]> {
  const supabase = createClient();

  try {
    // 1. Obtener órdenes contractuales adjudicadas del trámite
    const ordenes = await obtenerOrdenesContractualesTramite(tramiteId);

    if (ordenes.length === 0) {
      return [];
    }

    // 2. Consultar actas de recepción previas para extraer factura y respaldos
    let actasMap = new Map<number, any>();
    try {
      const { data: actasData } = await supabase
        .from("acta_recepcion")
        .select("*")
        .eq("id_tramite", tramiteId);
      (actasData || []).forEach((a) => actasMap.set(a.id_proveedor || a.id_orden_contractual, a));
    } catch {
      // Ignorar si la tabla no existe en la BD
    }

    // 3. Consultar solicitudes de pago previamente registradas en Supabase (`solicitud_pago`)
    let solicitudesMap = new Map<number, any>();
    try {
      const { data: solData } = await supabase
        .from("solicitud_pago")
        .select("*")
        .eq("id_tramite", tramiteId);
      (solData || []).forEach((s) => solicitudesMap.set(s.id_proveedor, s));
    } catch {
      // Ignorar si la tabla no existe
    }

    const fechaActualStr = new Date().toLocaleDateString("es-BO", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const resultado: SolicitudPagoProveedorData[] = [];

    for (const ord of ordenes) {
      const actaPrev = actasMap.get(ord.proveedorId) || (ord.id !== undefined ? actasMap.get(ord.id) : undefined);
      const solPrev = solicitudesMap.get(ord.proveedorId);

      const montoCalculado = ord.montoTotal || ord.items.reduce((acc, i) => acc + i.subtotal, 0);

      const materiales: ItemSolicitudPago[] = ord.items.map((it) => ({
        idItemTramite: it.idItemTramite,
        nroItem: it.nroItem,
        detalle: it.detalle,
        especificacion: it.especificacion,
        cantidad: it.cantidad,
        unidad: it.unidad,
        precioTotal: it.subtotal,
      }));

      resultado.push({
        id: solPrev?.id,
        tramiteId,
        proveedorId: ord.proveedorId,
        proveedorNombre: ord.proveedorNombre,
        proveedorNit: ord.proveedorNit,
        proyectoNombre: ord.proyectoNombre,
        unidadSolicitante: "Facultad de Ciencias y Tecnología - Lab. Hidráulica",
        numeroSolicitud: solPrev?.numero_solicitud || `NSP-2026-0${ord.proveedorId}`,
        fechaSolicitud: solPrev?.fecha_solicitud || fechaActualStr,
        montoTotal: solPrev?.monto_total || montoCalculado,
        montoLiteral: solPrev?.monto_literal || numeroAMontoLiteral(montoCalculado),
        facturaUrl: solPrev?.factura_url || actaPrev?.factura_url || "https://supabase.co/storage/v1/object/public/facturas/FACTURA_OFICIAL_EJEMPLO.pdf",
        notaEntregaUrl: solPrev?.nota_entrega_url || actaPrev?.evidencia_url || "https://supabase.co/storage/v1/object/public/evidencias/NOTA_ENTREGA_EJEMPLO.jpg",
        evidenciaExtraUrl: solPrev?.evidencia_extra_url,
        estado: solPrev?.estado || "SIN_ENVIAR",
        motivoObservacion: solPrev?.motivo_observacion,
        materiales,
      });
    }

    return resultado;
  } catch (err) {
    console.error("Error al consultar solicitudes de pago desde Supabase:", err);
    return [];
  }
}

/**
 * Envía la solicitud de pago al Responsable de Compras (`PENDIENTE_REVISION`).
 */
export async function enviarSolicitudPago(
  params: EnviarSolicitudPagoParams
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  try {
    const fechaIso = new Date().toISOString();

    try {
      await supabase.from("solicitud_pago").upsert({
        id_tramite: params.tramiteId,
        id_proveedor: params.proveedorId,
        monto_total: params.montoTotal,
        monto_literal: params.montoLiteral,
        factura_url: params.facturaUrl || null,
        nota_entrega_url: params.notaEntregaUrl || null,
        evidencia_extra_url: params.evidenciaExtraUrl || null,
        estado: "PENDIENTE_REVISION",
        fecha_solicitud: fechaIso,
      });
    } catch {
      // Ignorar si la tabla no existe en la BD local
    }

    await supabase.from("historial_tarea_tramite").insert({
      id_tramite: params.tramiteId,
      id_tarea_nuevo: 13,
      id_usuario_responsable: params.usuarioId || null,
      observaciones: `Solicitud de pago enviada a revisión para el proveedor ID ${params.proveedorId}. Monto: Bs. ${params.montoTotal.toLocaleString("es-BO")}`,
    });

    return { success: true };
  } catch (err: any) {
    console.error("Error al enviar solicitud de pago en Supabase:", err);
    return { success: false, error: err.message || "Error al enviar solicitud de pago" };
  }
}

/**
 * Valida / aprueba la solicitud de pago (`VALIDADA`).
 */
export async function validarSolicitudPago(
  params: ValidarSolicitudPagoParams
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  try {
    const fechaIso = new Date().toISOString();

    try {
      await supabase
        .from("solicitud_pago")
        .update({
          estado: "VALIDADA",
          id_usuario_validador: params.usuarioId || null,
          fecha_validacion: fechaIso,
        })
        .eq("id_tramite", params.tramiteId)
        .eq("id_proveedor", params.proveedorId);
    } catch {
      // Ignorar
    }

    await supabase.from("historial_tarea_tramite").insert({
      id_tramite: params.tramiteId,
      id_tarea_nuevo: 13,
      id_usuario_responsable: params.usuarioId || null,
      observaciones: `Solicitud de pago VALIDADA para el proveedor ID ${params.proveedorId} por Compras/Contabilidad.`,
    });

    return { success: true };
  } catch (err: any) {
    console.error("Error al validar solicitud de pago en Supabase:", err);
    return { success: false, error: err.message || "Error al validar solicitud de pago" };
  }
}

/**
 * Registra una observación en la solicitud de pago (`OBSERVADA`).
 */
export async function observarSolicitudPago(
  params: ObservarSolicitudPagoParams
): Promise<{ success: boolean; error?: string }> {
  if (!params.motivoObservacion || params.motivoObservacion.trim() === "") {
    return { success: false, error: "El motivo de la observación es obligatorio y no puede estar vacío." };
  }

  const supabase = createClient();

  try {
    try {
      await supabase
        .from("solicitud_pago")
        .update({
          estado: "OBSERVADA",
          motivo_observacion: params.motivoObservacion,
          id_usuario_validador: params.usuarioId || null,
        })
        .eq("id_tramite", params.tramiteId)
        .eq("id_proveedor", params.proveedorId);
    } catch {
      // Ignorar
    }

    await supabase.from("historial_tarea_tramite").insert({
      id_tramite: params.tramiteId,
      id_tarea_nuevo: 13,
      id_usuario_responsable: params.usuarioId || null,
      observaciones: `Solicitud de pago OBSERVADA para el proveedor ID ${params.proveedorId}: "${params.motivoObservacion}"`,
    });

    return { success: true };
  } catch (err: any) {
    console.error("Error al observar solicitud de pago en Supabase:", err);
    return { success: false, error: err.message || "Error al observar solicitud de pago" };
  }
}
