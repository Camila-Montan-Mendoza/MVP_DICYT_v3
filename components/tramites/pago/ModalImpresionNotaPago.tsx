"use client";

import { useState } from "react";
import { SolicitudPagoProveedorData } from "@/types/solicitudPago";
import { Printer, X, ZoomIn, ZoomOut } from "lucide-react";

interface ModalImpresionNotaPagoProps {
  isOpen: boolean;
  onClose: () => void;
  solicitud: SolicitudPagoProveedorData | null;
}

export function ModalImpresionNotaPago({
  isOpen,
  onClose,
  solicitud,
}: ModalImpresionNotaPagoProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  if (!isOpen || !solicitud) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 15, 150));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 15, 75));

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col my-2 max-h-[96vh] animate-in fade-in zoom-in-95">
        {/* Navy Top Header Bar */}
        <div className="bg-[#001B47] text-white px-6 py-4 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2 font-extrabold text-sm">
            <span className="bg-[#BC000C] text-white px-2.5 py-0.5 rounded-md text-xs">
              UMSS • DICyT
            </span>
            <span>Documento Oficial: Nota de Solicitud de Pago</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="p-2 text-slate-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-bold"
              title="Imprimir nota"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Controls & Zoom Bar */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-2.5 flex items-center justify-between gap-4 text-xs shrink-0 print:hidden">
          <div className="flex items-center gap-2 bg-slate-800 text-white px-3 py-1 rounded-xl shadow-xs">
            <button type="button" onClick={handleZoomOut} className="hover:text-slate-300">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] px-1">{zoomLevel}%</span>
            <button type="button" onClick={handleZoomIn} className="hover:text-slate-300">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="text-[11px] text-slate-500 font-semibold font-mono">
            {solicitud.numeroSolicitud}
          </span>
        </div>

        {/* Printable Document Body Container */}
        <div className="p-8 overflow-y-auto flex-1 bg-slate-200/50 print:bg-white print:p-0 print:overflow-visible flex justify-center">
          <div
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
            className="bg-white p-10 border border-slate-300 shadow-md max-w-2xl w-full mx-auto space-y-6 text-slate-900 font-sans relative overflow-hidden print:shadow-none print:border-none print:p-0 transition-transform"
          >
            {/* Watermark Background UMSS */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
              <span className="text-[120px] font-black tracking-widest text-slate-900 select-none">
                UMSS
              </span>
            </div>

            {/* Header section UMSS DICyT */}
            <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">
                  UNIVERSIDAD MAYOR DE SAN SIMÓN
                </h3>
                <p className="text-[10px] text-slate-600 font-bold uppercase">
                  DIRECCIÓN DE INVESTIGACIÓN CIENTÍFICA Y TECNOLÓGICA - DICYT
                </p>
              </div>

              <div className="text-right">
                <h2 className="text-sm font-black text-[#BC000C] uppercase tracking-wider">
                  NOTA DE SOLICITUD DE PAGO
                </h2>
                <p className="text-[10px] font-bold text-slate-500 font-mono">
                  {solicitud.numeroSolicitud}
                </p>
              </div>
            </div>

            {/* General Metadata Box */}
            <div className="grid grid-cols-2 gap-4 text-xs font-medium border border-slate-300 p-4 rounded-lg bg-slate-50/50">
              <div className="space-y-1">
                <p>
                  <span className="font-bold text-slate-600">PROYECTO / SUBPROGRAMA:</span>{" "}
                  {solicitud.proyectoNombre}
                </p>
                <p>
                  <span className="font-bold text-slate-600">UNIDAD SOLICITANTE:</span>{" "}
                  {solicitud.unidadSolicitante}
                </p>
              </div>

              <div className="space-y-1 text-right">
                <p>
                  <span className="font-bold text-slate-600">PROVEEDOR:</span>{" "}
                  {solicitud.proveedorNombre}
                </p>
                <p>
                  <span className="font-bold text-slate-600">FECHA SOLICITUD:</span>{" "}
                  {solicitud.fechaSolicitud}
                </p>
              </div>
            </div>

            {/* Table of Items and Amounts */}
            <div className="border border-slate-900 text-xs">
              <table className="w-full text-left border-collapse">
                <thead className="border-b border-slate-900 bg-slate-100 text-[10px] font-extrabold uppercase tracking-wider text-slate-900">
                  <tr className="divide-x divide-slate-900">
                    <th className="p-2">DETALLE DEL PRODUCTO / CONCEPTO</th>
                    <th className="p-2 text-right w-32">IMPORTE (BS.)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 text-[11px]">
                  <tr className="divide-x divide-slate-900 font-bold">
                    <td className="p-2.5 text-[#001B47]">{solicitud.proveedorNombre}</td>
                    <td className="p-2.5 text-right font-mono font-extrabold text-[#001B47]">
                      {solicitud.montoTotal.toLocaleString("es-BO", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                  {solicitud.materiales.map((m, idx) => (
                    <tr key={idx} className="divide-x divide-slate-900">
                      <td className="p-2.5 pl-6 text-slate-700">
                        • {m.detalle} (Cant: {m.cantidad} {m.unidad})
                      </td>
                      <td className="p-2.5 text-right font-mono">
                        {m.precioTotal.toLocaleString("es-BO", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Monto Total y Monto Literal */}
            <div className="space-y-2 border-t-2 border-slate-900 pt-4">
              <div className="flex items-center justify-between text-sm font-extrabold">
                <span>MONTO TOTAL A CANCELAR:</span>
                <span className="font-mono text-base text-[#001B47]">
                  Bs. {solicitud.montoTotal.toLocaleString("es-BO", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="p-3 bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold italic text-slate-800">
                MONTO LITERAL: {solicitud.montoLiteral}
              </div>
            </div>

            {/* Signature Block */}
            <div className="pt-16 grid grid-cols-2 gap-12 text-center text-[10px] font-extrabold uppercase text-slate-800">
              <div className="border-t border-slate-900 pt-2">
                <span>SOLICITANTE / INVESTIGADOR PRINCIPAL</span>
              </div>
              <div className="border-t border-slate-900 pt-2">
                <span>RESPONSABLE DE COMPRAS / CONTABILIDAD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
