"use client";

import { useState } from "react";
import { OrdenContractualData } from "@/types/ordenes";
import {
  Building2,
  Printer,
  FileCheck2,
  Upload,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface TarjetaOrdenProveedorProps {
  orden: OrdenContractualData;
  onImprimir: (orden: OrdenContractualData) => void;
  onAdjuntarContrato?: (orden: OrdenContractualData, file: File) => void;
}

export function TarjetaOrdenProveedor({
  orden,
  onImprimir,
  onAdjuntarContrato,
}: TarjetaOrdenProveedorProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const esContrato = orden.tipoDocumento === "CONTRATO";
  const esEmitido = orden.estado === "EMITIDO" || orden.estado === "REGISTRADO";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (onAdjuntarContrato) {
        onAdjuntarContrato(orden, file);
      }
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs transition-all space-y-0">
      {/* Header del Acordeón por Proveedor */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100/60 transition-colors flex-wrap sm:flex-nowrap"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#001B47]/10 text-[#001B47] flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>

          <div>
            <h4 className="font-extrabold text-sm text-[#001B47] tracking-tight">
              {orden.proveedorNombre}
            </h4>
            <p className="text-[11px] text-slate-400 font-mono">NIT: {orden.proveedorNit}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Badge Tipo Documento */}
          <span
            className={`px-3 py-1 rounded-lg text-[10px] font-extrabold tracking-wider uppercase border shadow-2xs ${
              esContrato
                ? "bg-purple-100 text-purple-900 border-purple-300"
                : orden.tipoDocumento === "ORDEN_SERVICIO"
                  ? "bg-amber-100 text-amber-900 border-amber-300"
                  : "bg-blue-100 text-blue-900 border-blue-300"
            }`}
          >
            {orden.tipoDocumento.replace("_", " ")}
          </span>

          {/* Monto Total */}
          <div className="text-right">
            <strong className="text-sm font-extrabold text-[#001B47] font-mono">
              {orden.montoTotal.toLocaleString("es-BO", { minimumFractionDigits: 2 })} Bs.
            </strong>
          </div>

          {/* Badge Estado */}
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
              esEmitido
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                : "bg-amber-100 text-amber-900 border border-amber-300"
            }`}
          >
            {esEmitido ? "EMITIDO" : "PENDIENTE DE EMISIÓN"}
          </span>

          <button type="button" className="text-slate-400 hover:text-slate-600">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Cuerpo Desplegable de la Orden */}
      {isOpen && (
        <div className="p-6 space-y-5 bg-white text-xs">
          {/* Alerta de Asesoría Legal para Contratos (> 15 días) */}
          {esContrato && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-start gap-2.5 font-medium">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">
                  Requiere Contrato por Asesoría Legal (&gt; 15 días de plazo)
                </strong>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Debido a que el plazo cotizado es de {orden.diasEntrega} días calendario, la
                  formalización requiere la elaboración de un Contrato. Adjunte el PDF escaneado
                  firmado a continuación.
                </p>
              </div>
            </div>
          )}

          {/* Grid 2 Columnas de Información Pre-llenada */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block font-bold text-slate-500 text-[11px]">
                Proyecto Relacionado
              </label>
              <input
                type="text"
                readOnly
                value={orden.proyectoNombre}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-500 text-[11px]">
                Nombre del Proveedor
              </label>
              <input
                type="text"
                readOnly
                value={orden.proveedorNombre}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium"
              />
            </div>
          </div>

          {/* Tabla de Ítems Copiados Exactamente de la Cotización Ganadora */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[#001B47] font-extrabold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3 text-center">Cant.</th>
                  <th className="p-3">Descripción</th>
                  <th className="p-3 text-right">Unitario (Bs.)</th>
                  <th className="p-3 text-right">Subtotal (Bs.)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {orden.items.map((it, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="p-3 text-center font-bold font-mono">{it.cantidad}</td>
                    <td className="p-3 font-medium">
                      <p className="font-bold text-[#001B47]">{it.detalle}</p>
                      {it.especificacion && (
                        <p className="text-[10px] text-slate-400 font-mono">{it.especificacion}</p>
                      )}
                    </td>
                    <td className="p-3 text-right font-mono font-medium">
                      {it.precioUnitario.toLocaleString("es-BO", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-right font-mono font-extrabold text-[#001B47]">
                      {it.subtotal.toLocaleString("es-BO", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Monto en Literal Formato Oficial UMSS */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-500 text-[11px]">
              Monto en Literal (Formato UMSS)
            </label>
            <input
              type="text"
              readOnly
              value={orden.montoLiteral}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#001B47] font-extrabold font-mono text-xs"
            />
          </div>

          {/* Fecha Límite de Entrega Calculada */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block font-bold text-slate-500 text-[11px]">
                Fecha Límite de Entrega / Conclusión
              </label>
              <span className="text-[9px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 uppercase">
                CÁLCULO AUTOMÁTICO ({orden.diasEntrega} DÍAS)
              </span>
            </div>
            <input
              type="text"
              readOnly
              value={orden.fechaLimiteEntrega}
              className="w-full p-2.5 bg-blue-50/50 border border-blue-200 rounded-xl text-[#001B47] font-bold text-xs"
            />
          </div>

          {/* Subida de Contrato PDF (Si es Contrato > 15 días) */}
          {esContrato && (
            <div className="pt-2">
              <label className="block font-bold text-slate-600 text-[11px] mb-1.5">
                Adjuntar Contrato PDF Firmado *
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-[#001B47] file:text-white hover:file:bg-[#002855] file:cursor-pointer"
                />
                {orden.pdfContratoUrl && (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <FileCheck2 className="w-4 h-4 text-emerald-600" />
                    <span>Contrato Cargado</span>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Botón de Acción Principal: Imprimir Orden */}
          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onImprimir(orden)}
              className="px-6 py-2.5 bg-[#001B47] text-white hover:bg-[#002855] text-xs font-extrabold rounded-xl transition-all shadow-sm flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir {orden.tipoDocumento === "CONTRATO" ? "Contrato" : "Orden"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
