"use client";

import { useState } from "react";
import { RecepcionProveedorData, MaterialRecepcionItem, EstadoMaterial } from "@/types/recepcion";
import {
  Building2,
  FileCheck2,
  ChevronDown,
  ChevronUp,
  FileText,
  Upload,
  CheckCircle2,
  FileSpreadsheet,
} from "lucide-react";

interface TarjetaRecepcionProveedorProps {
  recepcion: RecepcionProveedorData;
  onGenerarActa: (recepcionData: RecepcionProveedorData) => void;
  onActualizarRecepcion?: (recepcionData: RecepcionProveedorData) => void;
  readOnly?: boolean;
}

export function TarjetaRecepcionProveedor({
  recepcion,
  onGenerarActa,
  onActualizarRecepcion,
  readOnly = false,
}: TarjetaRecepcionProveedorProps) {
  const [isOpen, setIsOpen] = useState(true);

  const [formData, setFormData] = useState<RecepcionProveedorData>({
    ...recepcion,
  });

  const handleInputChange = (field: keyof RecepcionProveedorData, value: string) => {
    if (readOnly) return;
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    if (onActualizarRecepcion) onActualizarRecepcion(updated);
  };

  const handleEstadoMaterialChange = (idx: number, nuevoEstado: EstadoMaterial) => {
    if (readOnly) return;
    const nuevosMateriales = [...formData.materiales];
    nuevosMateriales[idx] = { ...nuevosMateriales[idx], estadoMaterial: nuevoEstado };
    const updated = { ...formData, materiales: nuevosMateriales };
    setFormData(updated);
    if (onActualizarRecepcion) onActualizarRecepcion(updated);
  };

  const handleFacturaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      const updated = { ...formData, facturaUrl: url };
      setFormData(updated);
      if (onActualizarRecepcion) onActualizarRecepcion(updated);
    }
  };

  const handleEvidenciaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      const updated = { ...formData, evidenciaUrl: url };
      setFormData(updated);
      if (onActualizarRecepcion) onActualizarRecepcion(updated);
    }
  };

  const esDefinitiva = formData.tipoActa === "DEFINITIVA";
  const esProvisional = formData.tipoActa === "PROVISIONAL";

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
            <h4 className="font-extrabold text-sm text-[#001B47] tracking-tight">
              {formData.proveedorNombre}
            </h4>
            <p className="text-[11px] text-slate-500 font-mono">
              NIT: {formData.proveedorNit} • {formData.materiales.length} Ítem(s) en recepción
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Badge Estado Acta */}
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
              esDefinitiva
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                : esProvisional
                  ? "bg-blue-100 text-blue-800 border border-blue-300"
                  : "bg-amber-100 text-amber-900 border border-amber-300"
            }`}
          >
            {esDefinitiva
              ? "ACTA DEFINITIVA"
              : esProvisional
                ? "RECEPCIÓN PROVISIONAL"
                : "ACTA PENDIENTE"}
          </span>

          <button type="button" className="text-slate-400 hover:text-slate-600">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Cuerpo Desplegable de Recepción */}
      {isOpen && (
        <div className="p-6 space-y-6 bg-white text-xs">
          {/* Sección 1: Información General */}
          <div className="space-y-3">
            <h5 className="font-bold text-[#001B47] text-xs flex items-center gap-1.5 uppercase tracking-wider border-b border-slate-100 pb-2">
              <FileText className="w-4 h-4 text-blue-700" />
              Información General
            </h5>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block font-bold text-slate-500 text-[11px]">
                  Proyecto / Unidad Solicitante
                </label>
                <input
                  type="text"
                  readOnly
                  value={formData.unidadSolicitante}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-500 text-[11px]">
                  Nro. Orden de Compra
                </label>
                <input
                  type="text"
                  readOnly
                  value={formData.numeroOrdenCompra}
                  className="w-full p-2.5 bg-blue-50/50 border border-blue-200 rounded-xl text-[#001B47] font-extrabold font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* Sección 2: Participantes de la Recepción */}
          <div className="space-y-3">
            <h5 className="font-bold text-[#001B47] text-xs flex items-center gap-1.5 uppercase tracking-wider border-b border-slate-100 pb-2">
              <FileCheck2 className="w-4 h-4 text-blue-700" />
              Participantes de la Recepción
            </h5>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block font-bold text-slate-600 text-[11px]">
                  Coordinador / Solicitante *
                </label>
                <input
                  type="text"
                  disabled={readOnly}
                  value={formData.nombreCoordinador}
                  onChange={(e) => handleInputChange("nombreCoordinador", e.target.value)}
                  placeholder="Nombre completo"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-[#001B47]/20 focus:border-[#001B47]"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-600 text-[11px]">
                  Representante Empresa Proveedora *
                </label>
                <input
                  type="text"
                  disabled={readOnly}
                  value={formData.nombreRepProveedor}
                  onChange={(e) => handleInputChange("nombreRepProveedor", e.target.value)}
                  placeholder="Nombre representante"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-[#001B47]/20 focus:border-[#001B47]"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-600 text-[11px]">
                  Representante Bienes e Inventarios
                </label>
                <input
                  type="text"
                  disabled={readOnly}
                  value={formData.nombreRepBienes}
                  onChange={(e) => handleInputChange("nombreRepBienes", e.target.value)}
                  placeholder="Nombre representante"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-[#001B47]/20 focus:border-[#001B47]"
                />
              </div>
            </div>
          </div>

          {/* Sección 3: Detalle de Materiales e Inspección Técnica */}
          <div className="space-y-3">
            <h5 className="font-bold text-[#001B47] text-xs flex items-center gap-1.5 uppercase tracking-wider border-b border-slate-100 pb-2">
              <FileSpreadsheet className="w-4 h-4 text-blue-700" />
              Detalle de Materiales
            </h5>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-[#001B47] font-extrabold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3 text-center w-12">N° ITEM</th>
                    <th className="p-3">DETALLE</th>
                    <th className="p-3 text-center w-16">CANT.</th>
                    <th className="p-3 text-center w-20">UNIDAD</th>
                    <th className="p-3 text-right w-28">PRECIO TOTAL (BS.)</th>
                    <th className="p-3 text-center w-36">ESTADO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {formData.materiales.map((it, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="p-3 text-center font-bold font-mono">{it.nroItem}</td>
                      <td className="p-3 font-medium">
                        <strong className="block text-[#001B47]">{it.detalle}</strong>
                        {it.especificacion && (
                          <span className="text-[10px] text-slate-400 block">{it.especificacion}</span>
                        )}
                      </td>
                      <td className="p-3 text-center font-mono font-bold">{it.cantidad}</td>
                      <td className="p-3 text-center uppercase font-bold text-[11px]">{it.unidad}</td>
                      <td className="p-3 text-right font-mono font-extrabold text-[#001B47]">
                        {it.precioTotal.toLocaleString("es-BO", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-3 text-center">
                        <select
                          disabled={readOnly}
                          value={it.estadoMaterial}
                          onChange={(e) =>
                            handleEstadoMaterialChange(idx, e.target.value as EstadoMaterial)
                          }
                          className="w-full p-1.5 text-xs border border-slate-300 rounded-lg bg-white font-semibold text-slate-800 focus:ring-1 focus:ring-[#001B47]"
                        >
                          <option value="Excelente">Excelente</option>
                          <option value="Bueno">Bueno</option>
                          <option value="Con Observación">Con Observación</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sección 4: Carga de Factura Oficial y Evidencias Fotográficas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <label className="block font-bold text-slate-700 text-[11px] flex items-center justify-between">
                <span>Factura Oficial del Proveedor (PDF/Imagen) *</span>
                {formData.facturaUrl && (
                  <span className="text-[10px] text-emerald-700 font-extrabold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Factura Adjunta
                  </span>
                )}
              </label>
              <input
                type="file"
                disabled={readOnly}
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFacturaChange}
                className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-[#001B47] file:text-white hover:file:bg-[#002855] file:cursor-pointer"
              />
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <label className="block font-bold text-slate-700 text-[11px] flex items-center justify-between">
                <span>Fotografías / Evidencias de Recepción</span>
                {formData.evidenciaUrl && (
                  <span className="text-[10px] text-emerald-700 font-extrabold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Evidencias Adjuntas
                  </span>
                )}
              </label>
              <input
                type="file"
                disabled={readOnly}
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleEvidenciaChange}
                className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-[#001B47] file:text-white hover:file:bg-[#002855] file:cursor-pointer"
              />
            </div>
          </div>

          {/* Botón de Acción Principal: Generar Acta */}
          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onGenerarActa(formData)}
              className="px-6 py-2.5 bg-[#BC000C] text-white hover:bg-[#a0000a] text-xs font-extrabold rounded-xl transition-all shadow-sm flex items-center gap-2"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>GENERAR ACTA Y VER DOCUMENTO</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
