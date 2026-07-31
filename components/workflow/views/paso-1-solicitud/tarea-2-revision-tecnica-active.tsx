"use client";

import { useState } from "react";
import { TaskViewProps } from "../view-types";
import {
  FileText,
  Eye,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";

export default function Tarea2RevisionTecnicaActive({
  tarea,
  tramite,
  ejecutarTransicion,
}: TaskViewProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({ 0: true });
  const [isObserveModalOpen, setIsObserveModalOpen] = useState(false);
  const [observaciones, setObservaciones] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  const toggleItem = (idx: number) => {
    setExpandedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const acciones = tarea.accionesDisponibles || [];
  const transicionAprobar =
    acciones.find(
      (a) =>
        a.idEstadoDestino === 6 ||
        (!a.nombreAccion.toLowerCase().includes("rechaz") &&
          !a.nombreAccion.toLowerCase().includes("observ"))
    ) || acciones[0];

  const transicionObservar =
    acciones.find(
      (a) => a.idEstadoDestino === 3 || a.nombreAccion.toLowerCase().includes("observ")
    ) || acciones[1];

  const items = (tramite as any)?.items || [];

  const totalGeneral = items.reduce(
    (acc: number, item: any) => acc + (item.total || item.cantidad * item.precioUnitario || 0),
    0
  );

  const handleAprobar = async () => {
    if (!ejecutarTransicion || !transicionAprobar) return;
    setIsSubmitting(true);
    setFeedback(null);

    const res = await ejecutarTransicion(
      transicionAprobar.idTransicion,
      "Aprobado por Responsable de Compras"
    );
    setIsSubmitting(false);

    if (res.success) {
      setFeedback({ type: "success", message: res.message || "Solicitud aprobada exitosamente." });
    } else {
      setFeedback({ type: "error", message: res.message || "Error al procesar la aprobación." });
    }
  };

  const handleConfirmarObservacion = async () => {
    if (!observaciones.trim() || observaciones.trim().length < 5) return;
    if (!ejecutarTransicion || !transicionObservar) return;

    setIsSubmitting(true);
    setFeedback(null);

    const res = await ejecutarTransicion(transicionObservar.idTransicion, observaciones.trim());
    setIsSubmitting(false);
    setIsObserveModalOpen(false);

    if (res.success) {
      setFeedback({
        type: "success",
        message: res.message || "Observación registrada y trámite devuelto.",
      });
    } else {
      setFeedback({ type: "error", message: res.message || "Error al registrar la observación." });
    }
  };

  const tipoSolicitudTitulo =
    tramite?.categoria === "ACTIVO_FIJO"
      ? "Solicitud de Activos Fijos"
      : tramite?.categoria === "SERVICIO"
        ? "Solicitud de Servicios"
        : "Solicitud de Materiales";

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs ${
            feedback.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-900"
              : "bg-red-50 border border-red-200 text-red-900"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Grid Principal de 2 Columnas */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Columna Izquierda: Detalle de Solicitud (8 Cols) */}
        <div className="xl:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          {/* Encabezado del Formulario de Solicitud */}
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-[#001B47] text-center tracking-tight">
              {tipoSolicitudTitulo}
            </h2>

            <div className="flex items-center justify-between text-xs text-slate-700 pt-1">
              <div>
                <strong className="text-[#001B47]">Nº:</strong> {tramite?.nro || "01"}
              </div>
              <div>
                <strong className="text-[#001B47]">Fecha emisión:</strong>{" "}
                {tramite?.fecha || "06 Nov 2025"}
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-700 border-t border-slate-100 pt-3">
              <p>
                <strong className="text-[#001B47]">Proyecto:</strong>{" "}
                {tramite?.proyecto || "VLIR RAWSAYTA AWANACHEJ"}
              </p>
              {tramite?.custodioNombre && (
                <p>
                  <strong className="text-[#001B47]">Responsable del Activo:</strong>{" "}
                  {tramite.custodioNombre}
                </p>
              )}
              {tramite?.custodioUbicacion && (
                <p>
                  <strong className="text-[#001B47]">Ubicación física del Activo:</strong>{" "}
                  {tramite.custodioUbicacion}
                </p>
              )}
            </div>
          </div>

          {/* Tabla de Ítems Solicitados */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[#001B47] font-extrabold border-b border-slate-200 uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="p-3">Ítem</th>
                  <th className="p-3 text-center">Cantidad</th>
                  <th className="p-3 text-right">P/U</th>
                  <th className="p-3 text-right">Precio Ref.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {items.map((item: any, idx: number) => {
                  const isExpanded = Boolean(expandedItems[idx]);
                  return (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3">
                        <button
                          onClick={() => toggleItem(idx)}
                          className="flex items-center gap-1.5 font-bold text-[#001B47] hover:text-[#002855] text-left"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          )}
                          <span>{item.descripcion}</span>
                        </button>
                        {isExpanded && item.especificacion && (
                          <div className="pl-5 pt-1.5 text-[10px] font-mono text-slate-500 max-w-md leading-relaxed">
                            {item.especificacion}
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-center font-semibold">{item.cantidad}</td>
                      <td className="p-3 text-right font-mono">
                        {Number(item.precioUnitario).toLocaleString("es-BO", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        Bs
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-[#001B47]">
                        {Number(item.total || item.cantidad * item.precioUnitario).toLocaleString(
                          "es-BO",
                          { minimumFractionDigits: 2 }
                        )}{" "}
                        Bs
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-slate-50 border-t border-slate-200 font-extrabold text-xs text-[#001B47]">
                <tr>
                  <td colSpan={3} className="p-3 text-right uppercase">
                    Total
                  </td>
                  <td className="p-3 text-right font-mono text-sm text-[#002855]">
                    {totalGeneral.toLocaleString("es-BO", { minimumFractionDigits: 2 })} Bs
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Sección de Justificación */}
          <div className="space-y-1.5 border-t border-slate-100 pt-4">
            <h4 className="text-xs font-extrabold text-[#001B47]">Justificación</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-normal bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
              {tramite?.justificacion ||
                "El proyecto VLIR RAWSAYTA AWANACHEJ tiene como objetivo central el fortalecimiento de capacidades de investigación, innovación y transferencia de conocimiento en el área de Biotecnología-UMSS."}
            </p>
          </div>
        </div>

        {/* Columna Derecha: Archivos Cargados (4 Cols) */}
        <div className="xl:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 h-fit">
          <div>
            <h3 className="font-extrabold text-xs text-[#001B47]">Archivos</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
              ARCHIVOS CARGADOS (2)
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl flex items-center justify-between hover:border-blue-300 transition-colors">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="w-4 h-4 text-[#002855] shrink-0" />
                <div className="truncate">
                  <p className="font-extrabold text-xs text-[#001B47] truncate">
                    cotizacion inicial
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">1.2 MB</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => alert("Previsualizando PDF de Cotización Inicial...")}
                className="p-1.5 text-slate-500 hover:text-[#002855] hover:bg-blue-100/60 rounded-lg transition-colors"
                title="Ver cotización"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between hover:border-slate-300 transition-colors">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="w-4 h-4 text-slate-600 shrink-0" />
                <div className="truncate">
                  <p className="font-extrabold text-xs text-[#001B47] truncate">
                    especificaciones tecnicas
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">1.2 MB</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => alert("Previsualizando PDF de Especificaciones Técnicas...")}
                className="p-1.5 text-slate-500 hover:text-[#002855] hover:bg-slate-200 rounded-lg transition-colors"
                title="Ver especificaciones"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Barra Inferior Sticky de Acciones (Aprobar / Observar) */}
      <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3 bg-white p-4 rounded-2xl border shadow-xs">
        <button
          type="button"
          onClick={() => setIsObserveModalOpen(true)}
          disabled={isSubmitting || !transicionObservar}
          className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          Observar
        </button>

        <button
          type="button"
          onClick={handleAprobar}
          disabled={isSubmitting || !transicionAprobar}
          className="px-8 py-2.5 bg-[#002855] text-white font-bold text-xs rounded-xl hover:bg-[#001B47] transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Procesando...</span>
            </>
          ) : (
            <span>Aprobar</span>
          )}
        </button>
      </div>

      {/* Modal de Observación */}
      {isObserveModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-800 font-extrabold text-sm">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>Observar Solicitud de Compra</span>
              </div>
              <button
                onClick={() => setIsObserveModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Por favor ingrese el motivo detallado de la observación para enviar de retorno la
              solicitud al solicitante para su subsanación:
            </p>

            <textarea
              required
              rows={4}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Describa aquí la observación requerida..."
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002855] text-slate-800"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsObserveModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmarObservacion}
                disabled={isSubmitting || observaciones.trim().length < 5}
                className="px-5 py-2 bg-[#BC000C] text-white font-bold text-xs rounded-xl hover:bg-red-800 transition-colors shadow-md disabled:opacity-40"
              >
                {isSubmitting ? "Enviando..." : "Confirmar Observación"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
