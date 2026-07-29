"use client";

import { OrdenContractualData } from "@/types/ordenes";
import { Printer, X, Eye } from "lucide-react";

interface ModalImpresionOrdenProps {
  isOpen: boolean;
  onClose: () => void;
  orden: OrdenContractualData | null;
  onConfirmarEmision?: (orden: OrdenContractualData) => void;
}

export function ModalImpresionOrden({
  isOpen,
  onClose,
  orden,
  onConfirmarEmision,
}: ModalImpresionOrdenProps) {
  if (!isOpen || !orden) return null;

  const fechaObj = new Date(orden.fechaEmision || Date.now());
  const diaStr = String(fechaObj.getDate()).padStart(2, "0");
  const mesStr = String(fechaObj.getMonth() + 1).padStart(2, "0");
  const anioStr = String(fechaObj.getFullYear());

  const handlePrint = () => {
    if (onConfirmarEmision) {
      onConfirmarEmision(orden);
    }
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col my-4 max-h-[95vh] animate-in fade-in zoom-in-95">
        {/* Navy Header Bar */}
        <div className="bg-[#001B47] text-white px-6 py-4 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2 font-extrabold text-sm">
            <Eye className="w-5 h-5 text-white" />
            <span>Previsualización de Impresión</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="p-2 text-slate-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Imprimir documento"
            >
              <Printer className="w-5 h-5" />
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

        {/* Printable Document Body Container */}
        <div className="p-8 overflow-y-auto flex-1 bg-slate-100/60 print:bg-white print:p-0 print:overflow-visible">
          <div className="bg-white p-8 border border-slate-200 shadow-sm max-w-3xl mx-auto space-y-6 text-slate-900 font-sans print:shadow-none print:border-none print:p-0">
            {/* Header Table 3 Columns */}
            <div className="border border-slate-900 grid grid-cols-12 text-center text-xs font-bold divide-x divide-slate-900">
              {/* Left Column: DICyT Logo & Title */}
              <div className="col-span-4 p-4 flex flex-col items-center justify-center text-[11px] leading-tight font-extrabold uppercase">
                <span>DIRECCIÓN DE INVESTIGACIÓN CIENTÍFICA Y TECNOLÓGICA</span>
              </div>

              {/* Center Column: Document Name */}
              <div className="col-span-5 p-4 flex flex-col items-center justify-center space-y-1">
                <h2 className="text-base font-black tracking-wider uppercase text-slate-900">
                  {orden.tipoDocumento === "ORDEN_SERVICIO"
                    ? "ORDEN DE SERVICIO"
                    : orden.tipoDocumento === "CONTRATO"
                      ? "CONTRATO DE COMPRA"
                      : "ORDEN DE COMPRA"}
                </h2>
                <span className="text-[10px] font-normal text-slate-600">
                  (Expresado en bolivianos)
                </span>
              </div>

              {/* Right Column: Date Breakdown Table */}
              <div className="col-span-3 flex flex-col divide-y divide-slate-900 text-[10px]">
                <div className="py-1 bg-slate-50 font-extrabold uppercase tracking-wider">
                  EMISIÓN
                </div>
                <div className="py-1 bg-slate-50 font-extrabold uppercase tracking-wider">
                  COCHABAMBA
                </div>
                <div className="grid grid-cols-3 divide-x divide-slate-900 text-center font-mono py-1.5 flex-1 items-center">
                  <div>
                    <span className="block text-[8px] text-slate-400 font-sans">Día</span>
                    <strong className="font-bold text-xs">{diaStr}</strong>
                  </div>
                  <div>
                    <span className="block text-[8px] text-slate-400 font-sans">Mes</span>
                    <strong className="font-bold text-xs">{mesStr}</strong>
                  </div>
                  <div>
                    <span className="block text-[8px] text-slate-400 font-sans">Año</span>
                    <strong className="font-bold text-xs">{anioStr}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Number and Metadata Header */}
            <div className="space-y-3 pt-2 text-xs">
              <h3 className="text-sm font-extrabold text-slate-900 font-mono">
                {orden.numeroCorrelativo || "N° 231"}
              </h3>

              <div className="space-y-1.5 font-bold text-slate-900 uppercase tracking-tight text-[11px]">
                <p>
                  <span className="text-slate-500 font-semibold">PROYECTO:</span>{" "}
                  {orden.proyectoNombre}
                </p>
                <p>
                  <span className="text-slate-500 font-semibold">A:</span> {orden.proveedorNombre}
                </p>
                <p>
                  <span className="text-slate-500 font-semibold">NIT:</span>{" "}
                  <span className="font-mono">{orden.proveedorNit}</span>
                </p>
              </div>
            </div>

            {/* Items Printable Table */}
            <div className="border border-slate-900 text-xs">
              <table className="w-full text-left border-collapse">
                <thead className="border-b border-slate-900 bg-slate-50 text-[10px] font-extrabold uppercase tracking-wider text-slate-900">
                  <tr className="divide-x divide-slate-900">
                    <th className="p-2 text-center w-12">N° ITEM</th>
                    <th className="p-2">DETALLE</th>
                    <th className="p-2 text-center w-16">CANT.</th>
                    <th className="p-2 text-center w-20">UNIDAD</th>
                    <th className="p-2 text-right w-28">PRECIO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 text-[11px]">
                  {orden.items.map((it, idx) => (
                    <tr key={idx} className="divide-x divide-slate-900">
                      <td className="p-3 text-center align-top font-mono font-bold">
                        {it.nroItem}
                      </td>
                      <td className="p-3 align-top space-y-1">
                        <strong className="block font-extrabold text-slate-900 uppercase">
                          {it.detalle}
                        </strong>
                        {it.especificacion && (
                          <p className="text-[10px] text-slate-600 font-normal">
                            • {it.especificacion}
                          </p>
                        )}
                      </td>
                      <td className="p-3 text-center align-top font-mono font-bold">
                        {it.cantidad}
                      </td>
                      <td className="p-3 text-center align-top uppercase font-bold">{it.unidad}</td>
                      <td className="p-3 text-right align-top font-mono font-extrabold">
                        {it.subtotal.toLocaleString("es-BO", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}

                  {/* Total Row */}
                  <tr className="border-t-2 border-slate-900 font-extrabold">
                    <td colSpan={4} className="p-2.5 text-right uppercase tracking-wider pr-4">
                      TOTAL
                    </td>
                    <td className="p-2.5 text-right font-mono text-xs border-l border-slate-900">
                      {orden.montoTotal.toLocaleString("es-BO", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Literal Conversion & Fecha de Entrega Box */}
              <div className="border-t border-slate-900 p-3 space-y-2 text-[11px] uppercase font-extrabold">
                <p>
                  <span className="text-slate-600 font-bold mr-2">SON:</span>
                  <span>{orden.montoLiteral}</span>
                </p>
                <p className="border-t border-slate-200 pt-2">
                  <span className="text-slate-600 font-bold mr-2">FECHA DE ENTREGA:</span>
                  <span className="font-mono">{orden.fechaLimiteEntrega}</span>
                </p>
              </div>
            </div>

            {/* Signature Blocks 3 Columns */}
            <div className="pt-12 grid grid-cols-3 gap-6 text-center text-[10px] font-extrabold uppercase text-slate-800">
              <div className="border-t border-slate-900 pt-2">
                <span>COORDINADOR</span>
              </div>
              <div className="border-t border-slate-900 pt-2">
                <span>DIRECTOR DICYT</span>
              </div>
              <div className="border-t border-slate-900 pt-2">
                <span>PROVEEDOR</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
