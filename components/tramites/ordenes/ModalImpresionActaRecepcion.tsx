"use client";

import { useState } from "react";
import { RecepcionProveedorData } from "@/types/recepcion";
import { Printer, X, Download, ZoomIn, ZoomOut } from "lucide-react";

interface ModalImpresionActaRecepcionProps {
  isOpen: boolean;
  onClose: () => void;
  recepcion: RecepcionProveedorData | null;
  onEmitirProvisional?: (recepcion: RecepcionProveedorData) => void;
  onEmitirDefinitiva?: (recepcion: RecepcionProveedorData) => void;
  isSubmitting?: boolean;
}

export function ModalImpresionActaRecepcion({
  isOpen,
  onClose,
  recepcion,
  onEmitirProvisional,
  onEmitirDefinitiva,
  isSubmitting = false,
}: ModalImpresionActaRecepcionProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  if (!isOpen || !recepcion) return null;

  const fechaObj = new Date();
  const fechaFormateadaStr = `${fechaObj.getDate()} de ${fechaObj.toLocaleString("es-BO", { month: "long" })}, ${fechaObj.getFullYear()}`;

  const handlePrint = () => {
    window.print();
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 15, 150));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 15, 75));

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col my-2 max-h-[96vh] animate-in fade-in zoom-in-95">
        {/* Navy Top Header Bar */}
        <div className="bg-[#001B47] text-white px-6 py-4 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2 font-extrabold text-sm">
            <span className="bg-[#BC000C] text-white px-2.5 py-0.5 rounded-md text-xs">UMSS - DAF</span>
            <span>Documento Oficial: Acta de Recepción de Materiales</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="p-2 text-slate-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-bold"
              title="Imprimir documento"
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
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-2.5 flex items-center justify-between gap-4 text-xs shrink-0 print:hidden flex-wrap">
          {/* Controles de Zoom */}
          <div className="flex items-center gap-2 bg-slate-800 text-white px-3 py-1 rounded-xl shadow-xs">
            <button type="button" onClick={handleZoomOut} className="hover:text-slate-300">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] px-1">{zoomLevel}%</span>
            <button type="button" onClick={handleZoomIn} className="hover:text-slate-300">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Las 2 Acciones / Transiciones Principales del Solicitante */}
          {onEmitirProvisional && onEmitirDefinitiva && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => onEmitirProvisional(recepcion)}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-extrabold rounded-xl transition-all shadow-xs text-xs"
              >
                Emitir Acta de Recepción Provisional
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => onEmitirDefinitiva(recepcion)}
                className="px-5 py-2 bg-[#BC000C] hover:bg-[#a0000a] text-white font-extrabold rounded-xl transition-all shadow-xs text-xs"
              >
                Emitir Acta de Recepción Definitiva
              </button>
            </div>
          )}
        </div>

        {/* Printable Document Body Container */}
        <div className="p-8 overflow-y-auto flex-1 bg-slate-200/50 print:bg-white print:p-0 print:overflow-visible flex justify-center">
          <div
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
            className="bg-white p-10 border border-slate-300 shadow-md max-w-3xl w-full mx-auto space-y-6 text-slate-900 font-sans relative overflow-hidden print:shadow-none print:border-none print:p-0 transition-transform"
          >
            {/* Watermark Background UMSS */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
              <span className="text-[120px] font-black tracking-widest text-slate-900 select-none">
                UMSS
              </span>
            </div>

            {/* Header section UMSS DAF */}
            <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">
                  UNIVERSIDAD MAYOR DE SAN SIMÓN
                </h3>
                <p className="text-[10px] text-slate-600 font-bold uppercase">
                  DIRECCIÓN ADMINISTRATIVA FINANCIERA - DAF
                </p>
              </div>

              <div className="text-right">
                <h2 className="text-base font-black text-[#BC000C] uppercase tracking-wider">
                  ACTA DE RECEPCIÓN
                </h2>
                <p className="text-[10px] font-bold text-slate-500 font-mono">
                  {recepcion.proveedorNombre}
                </p>
              </div>
            </div>

            {/* General Metadata Box */}
            <div className="grid grid-cols-2 gap-4 text-xs font-medium border border-slate-300 p-4 rounded-lg bg-slate-50/50">
              <div className="space-y-1">
                <p>
                  <span className="font-bold text-slate-600">PROYECTO:</span>{" "}
                  {recepcion.proyectoNombre}
                </p>
                <p>
                  <span className="font-bold text-slate-600">UNIDAD SOLICITANTE:</span>{" "}
                  {recepcion.unidadSolicitante}
                </p>
                <p>
                  <span className="font-bold text-slate-600">NRO. ORDEN COMPRA:</span>{" "}
                  <span className="font-mono font-bold">{recepcion.numeroOrdenCompra}</span>
                </p>
              </div>

              <div className="space-y-1 text-right">
                <p>
                  <span className="font-bold text-slate-600">PROVEEDOR:</span>{" "}
                  {recepcion.proveedorNombre}
                </p>
                <p>
                  <span className="font-bold text-slate-600">NIT:</span>{" "}
                  <span className="font-mono">{recepcion.proveedorNit}</span>
                </p>
                <p>
                  <span className="font-bold text-slate-600">FECHA:</span> {fechaFormateadaStr}
                </p>
              </div>
            </div>

            {/* Participants Metadata Box */}
            <div className="border border-slate-300 p-4 rounded-lg bg-slate-50/50 space-y-1 text-xs">
              <h4 className="font-bold text-[#001B47] text-[11px] uppercase tracking-wider mb-2">
                PARTICIPANTES DE LA RECEPCIÓN
              </h4>
              <p>
                <span className="font-bold text-slate-600">1. Coordinador / Solicitante:</span>{" "}
                {recepcion.nombreCoordinador}
              </p>
              <p>
                <span className="font-bold text-slate-600">2. Rep. Empresa Proveedora:</span>{" "}
                {recepcion.nombreRepProveedor}
              </p>
              <p>
                <span className="font-bold text-slate-600">3. Rep. Bienes e Inventarios:</span>{" "}
                {recepcion.nombreRepBienes}
              </p>
            </div>

            {/* Table of Materials */}
            <div className="border border-slate-900 text-xs">
              <table className="w-full text-left border-collapse">
                <thead className="border-b border-slate-900 bg-slate-100 text-[10px] font-extrabold uppercase tracking-wider text-slate-900">
                  <tr className="divide-x divide-slate-900">
                    <th className="p-2 text-center w-12">N° ITEM</th>
                    <th className="p-2">DETALLE DE MATERIALES</th>
                    <th className="p-2 text-center w-16">CANT.</th>
                    <th className="p-2 text-center w-20">UNIDAD</th>
                    <th className="p-2 text-right w-28">PRECIO TOTAL (BS.)</th>
                    <th className="p-2 text-center w-28">ESTADO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 text-[11px]">
                  {recepcion.materiales.map((it, idx) => (
                    <tr key={idx} className="divide-x divide-slate-900">
                      <td className="p-2.5 text-center align-top font-mono font-bold">{it.nroItem}</td>
                      <td className="p-2.5 align-top">
                        <strong className="block font-bold text-slate-900">{it.detalle}</strong>
                        {it.especificacion && (
                          <span className="text-[10px] text-slate-500 block">{it.especificacion}</span>
                        )}
                      </td>
                      <td className="p-2.5 text-center align-top font-mono font-bold">{it.cantidad}</td>
                      <td className="p-2.5 text-center align-top uppercase font-bold">{it.unidad}</td>
                      <td className="p-2.5 text-right align-top font-mono font-extrabold">
                        {it.precioTotal.toLocaleString("es-BO", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-2.5 text-center align-top font-bold text-emerald-800">
                        {it.estadoMaterial}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Signature Blocks */}
            <div className="pt-16 grid grid-cols-3 gap-6 text-center text-[10px] font-extrabold uppercase text-slate-800">
              <div className="border-t border-slate-900 pt-2">
                <span>COORDINADOR DEL PROYECTO</span>
              </div>
              <div className="border-t border-slate-900 pt-2">
                <span>EMPRESA PROVEEDORA</span>
              </div>
              <div className="border-t border-slate-900 pt-2">
                <span>BIENES E INVENTARIOS UMSS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
