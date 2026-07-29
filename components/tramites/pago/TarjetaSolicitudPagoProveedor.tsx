"use client";

import { useState } from "react";
import { SolicitudPagoProveedorData } from "@/types/solicitudPago";
import {
  Building2,
  ChevronDown,
  ChevronUp,
  FileText,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Send,
  FileCheck2,
  Paperclip,
  Printer,
  ShieldCheck,
} from "lucide-react";

interface TarjetaSolicitudPagoProveedorProps {
  solicitud: SolicitudPagoProveedorData;
  onGenerarNota: (sol: SolicitudPagoProveedorData) => void;
  onEnviarSolicitud: (sol: SolicitudPagoProveedorData) => void;
  onValidarSolicitud?: (sol: SolicitudPagoProveedorData) => void;
  onObservarSolicitud?: (sol: SolicitudPagoProveedorData) => void;
  readOnly?: boolean;
}

export function TarjetaSolicitudPagoProveedor({
  solicitud,
  onGenerarNota,
  onEnviarSolicitud,
  onValidarSolicitud,
  onObservarSolicitud,
  readOnly = false,
}: TarjetaSolicitudPagoProveedorProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [evidenciaFile, setEvidenciaFile] = useState<string | undefined>(solicitud.evidenciaExtraUrl);

  const handleEvidenciaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setEvidenciaFile(url);
      solicitud.evidenciaExtraUrl = url;
    }
  };

  const esEnviado = solicitud.estado === "PENDIENTE_REVISION";
  const esValidado = solicitud.estado === "VALIDADA";
  const esObservado = solicitud.estado === "OBSERVADA";
  const esSinEnviar = solicitud.estado === "SIN_ENVIAR";

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs space-y-0">
      {/* Header del Acordeón por Proveedor */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100/60 transition-colors flex-wrap sm:flex-nowrap"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#001B47]/10 text-[#001B47] flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>

          <div>
            <h4 className="font-extrabold text-sm text-[#001B47] tracking-tight flex items-center gap-2">
              <span>{solicitud.proveedorNombre}</span>
              <span className="text-[11px] font-mono text-slate-500 font-normal">
                NIT: {solicitud.proveedorNit}
              </span>
            </h4>
            <p className="text-[11px] text-slate-500">
              Generar nota de solicitud de pago •{" "}
              <strong className="text-[#001B47] font-mono">
                Bs. {solicitud.montoTotal.toLocaleString("es-BO", { minimumFractionDigits: 2 })}
              </strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Badge Estado Solicitud de Pago */}
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
              esValidado
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                : esEnviado
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
                  : esObservado
                    ? "bg-amber-100 text-amber-900 border border-amber-300"
                    : "bg-rose-100 text-rose-800 border border-rose-300"
            }`}
          >
            {esValidado
              ? "VALIDADA"
              : esEnviado
                ? "ENVIADO"
                : esObservado
                  ? "OBSERVADA"
                  : "SIN ENVIAR"}
          </span>

          <button type="button" className="text-slate-400 hover:text-slate-600">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Cuerpo Desplegable de Solicitud de Pago */}
      {isOpen && (
        <div className="p-6 space-y-6 bg-white text-xs">
          {/* Banner Alerta Si fue Observada (HU3) */}
          {esObservado && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5 text-xs text-amber-900 shadow-2xs">
              <div className="flex items-center gap-2 font-extrabold text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Solicitud de Pago Observada por Compras / Contabilidad</span>
              </div>
              <p className="text-amber-800 font-medium pl-6">
                Motivo:{" "}
                <strong>{solicitud.motivoObservacion || "Por favor adjunte la nota de entrega firmada."}</strong>
              </p>
            </div>
          )}

          {/* Dos Columnas (Izquierda: Documentos y Datos | Derecha: Visor y Envío) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Columna Izquierda (5 cols): Información General y Documentos Adjuntos */}
            <div className="lg:col-span-5 space-y-5">
              {/* Encabezado Izquierdo */}
              <div className="space-y-1">
                <h4 className="text-base font-extrabold text-[#001B47]">Nota solicitud de pago</h4>
                <p className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">
                  PROYECTO / UNIDAD
                </p>
                <p className="text-xs font-semibold text-slate-700">{solicitud.unidadSolicitante}</p>
              </div>

              {/* Documentos Adjuntos */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h5 className="font-bold text-[#001B47] text-xs flex items-center gap-1.5 uppercase tracking-wider">
                  <Paperclip className="w-4 h-4 text-blue-700" />
                  Documentos Adjuntos
                </h5>

                <div className="space-y-2">
                  {/* Documento 1: FACTURA.pdf */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                        PDF
                      </div>
                      <div>
                        <a
                          href={solicitud.facturaUrl || "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-[#001B47] hover:underline block"
                        >
                          FACTURA.pdf
                        </a>
                        <span className="text-[10px] text-slate-400 font-mono">2.4 MB • Adjunto oficial</span>
                      </div>
                    </div>
                  </div>

                  {/* Documento 2: NOTA_ENTREGA.jpg */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                        JPG
                      </div>
                      <div>
                        <a
                          href={solicitud.notaEntregaUrl || "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-[#001B47] hover:underline block"
                        >
                          NOTA_ENTREGA.jpg
                        </a>
                        <span className="text-[10px] text-slate-400 font-mono">5.1 MB • Recepción conforme</span>
                      </div>
                    </div>
                  </div>

                  {/* Evidencia Extra Subida */}
                  {evidenciaFile && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-bold text-emerald-900">Evidencia Adicional Subida</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Botón Adjuntar Evidencia */}
                {!readOnly && !esValidado && (
                  <div className="pt-2">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-[#BC000C] text-white hover:bg-[#a0000a] text-xs font-extrabold rounded-xl transition-all shadow-xs">
                      <Upload className="w-4 h-4" />
                      <span>ADJUNTAR EVIDENCIA</span>
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={handleEvidenciaUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Columna Derecha (7 cols): Visor de la Nota & Botón Flotante de Envío */}
            <div className="lg:col-span-7 space-y-4">
              {/* Barra Superior con Botón GENERAR NOTA */}
              <div className="bg-slate-900 text-white p-3 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-bold">
                  <FileText className="w-4 h-4 text-slate-300" />
                  <span>Previsualizador Nota de Pago</span>
                </div>

                <button
                  type="button"
                  onClick={() => onGenerarNota(solicitud)}
                  className="px-4 py-1.5 bg-[#BC000C] hover:bg-[#a0000a] text-white font-extrabold rounded-lg transition-all text-xs flex items-center gap-1.5 shadow-2xs"
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>GENERAR NOTA</span>
                </button>
              </div>

              {/* Documento Miniaturizado Membretado Oficial */}
              <div className="border border-slate-300 rounded-xl p-6 bg-white space-y-4 text-slate-900 relative shadow-2xs font-sans">
                {/* Header Membretado Mini */}
                <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">UMSS • DICyT</span>
                    <h4 className="font-extrabold text-xs text-slate-900">Nota de Solicitud de Pago</h4>
                  </div>

                  <div className="text-right text-[10px] text-slate-500">
                    <p className="font-mono font-bold">{solicitud.numeroSolicitud}</p>
                    <p>{solicitud.fechaSolicitud}</p>
                  </div>
                </div>

                {/* Subprograma y Fecha */}
                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <div>
                    <span className="text-slate-500 font-bold block text-[10px]">PROYECTO / SUBPROGRAMA</span>
                    <span className="font-semibold text-slate-800">{solicitud.proyectoNombre}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 font-bold block text-[10px]">FECHA DE SOLICITUD</span>
                    <span className="font-semibold text-slate-800">{solicitud.fechaSolicitud}</span>
                  </div>
                </div>

                {/* Detalle del Producto e Importe */}
                <div className="border border-slate-200 rounded-lg overflow-hidden text-[11px]">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[10px] uppercase">
                      <tr>
                        <th className="p-2">DETALLE DEL PRODUCTO</th>
                        <th className="p-2 text-right">IMPORTE (BS.)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-2 font-bold text-[#001B47]">{solicitud.proveedorNombre}</td>
                        <td className="p-2 text-right font-mono font-extrabold text-[#001B47]">
                          {solicitud.montoTotal.toLocaleString("es-BO", { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                      {solicitud.materiales.map((m, idx) => (
                        <tr key={idx} className="bg-slate-50/50 text-[10px]">
                          <td className="p-2 pl-4 text-slate-600 font-medium">
                            • {m.detalle} (Cant: {m.cantidad} {m.unidad})
                          </td>
                          <td className="p-2 text-right font-mono text-slate-700">
                            {m.precioTotal.toLocaleString("es-BO", { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Monto Total y Monto Literal */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                  <span className="font-bold text-slate-700">MONTO TOTAL</span>
                  <span className="font-mono font-extrabold text-sm text-[#001B47]">
                    Bs. {solicitud.montoTotal.toLocaleString("es-BO", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-[10px] text-slate-600 font-semibold italic">
                  MONTO LITERAL: {solicitud.montoLiteral}
                </div>
              </div>

              {/* Botón Flotante / Destacado de Envío (HU1 / HU3) */}
              {!readOnly && (esSinEnviar || esObservado) && (
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => onEnviarSolicitud(solicitud)}
                    className="w-full py-3 bg-[#001B47] text-white hover:bg-[#002855] font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>
                      {esObservado ? "RE-ENVIAR SOLICITUD DE PAGO A REVISIÓN" : "ENVIAR SOLICITUD DE PAGO"}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
