"use client";

import { useState } from "react";
import { TaskViewProps } from "../view-types";
import { ChevronDown, ChevronUp, Download } from "lucide-react";

export default function Tarea6VerificacionMercadoVirtualPassive({ tarea, tramite }: TaskViewProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({ 0: true });

  const toggleItem = (idx: number) => {
    setExpandedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const rawItems = (tramite as any)?.items || [];

  const totalGeneral = rawItems.reduce(
    (acc: number, item: any) =>
      acc +
      (item.total || (item.cantidad || 1) * (item.precioUnitario || item.precioReferencial || 0)),
    0
  );

  const handleDownloadProforma = () => {
    alert("Descargando Plantilla Oficial de Proforma en Blanco (PDF)...");
  };

  return (
    <div className="space-y-6">
      {/* Banner de Modo Lectura Pasiva */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-center justify-between">
        <span>
          ℹ️ <strong>Vista en modo lectura</strong> ({tarea.nombre})
        </span>
        <span className="font-mono text-[11px] bg-slate-200/80 px-2 py-0.5 rounded-md font-semibold text-slate-700">
          {tarea.estado}
        </span>
      </div>

      {/* Tarjeta Principal de Mercado Virtual */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-extrabold text-[#001B47] tracking-tight">
            Revisión Mercado Virtual
          </h2>
          <p className="text-xs text-slate-500">
            Estado de verificación de los ítems en el catálogo público del Mercado Virtual SIGEP.
          </p>
        </div>

        {/* Tabla de Ítems */}
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[#001B47] font-extrabold border-b border-slate-200 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="p-3">Ítem</th>
                <th className="p-3 text-center">Cant.</th>
                <th className="p-3 text-right">P/U</th>
                <th className="p-3 text-right">Precio Ref.</th>
                <th className="p-3 text-center">Mercado Virtual</th>
                <th className="p-3 text-center">Proveedor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {rawItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-400 text-xs italic">
                    Sin ítems registrados en la base de datos para este trámite.
                  </td>
                </tr>
              ) : (
                rawItems.map((item: any, idx: number) => {
                  const isExpanded = Boolean(expandedItems[idx]);
                  const existeMV = Boolean(item.existeEnMercadoVirtual);

                  return (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3 align-top">
                        <button
                          onClick={() => toggleItem(idx)}
                          className="flex items-center gap-1.5 font-bold text-[#001B47] hover:text-[#002855] text-left"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          )}
                          <span>{item.descripcion || item.nombre}</span>
                        </button>
                        {isExpanded &&
                          (item.especificacion || item.especificacionesTecnicasTexto) && (
                            <div className="pl-5 pt-1.5 text-[10px] font-mono text-slate-500 max-w-xs leading-relaxed">
                              {item.especificacion || item.especificacionesTecnicasTexto}
                            </div>
                          )}
                      </td>
                      <td className="p-3 align-top text-center font-semibold">
                        {item.cantidad || 1}
                      </td>
                      <td className="p-3 align-top text-right font-mono">
                        {Number(item.precioUnitario || item.precioReferencial || 0).toLocaleString(
                          "es-BO",
                          {
                            minimumFractionDigits: 2,
                          }
                        )}{" "}
                        Bs
                      </td>
                      <td className="p-3 align-top text-right font-mono font-bold text-[#001B47]">
                        {Number(
                          item.total ||
                            (item.cantidad || 1) *
                              (item.precioUnitario || item.precioReferencial || 0)
                        ).toLocaleString("es-BO", { minimumFractionDigits: 2 })}{" "}
                        Bs
                      </td>
                      <td className="p-3 align-top text-center">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-lg border inline-block ${
                            existeMV
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                              : "bg-red-50 text-red-800 border-red-300"
                          }`}
                        >
                          {existeMV ? "Encontrado" : "No encontrado"}
                        </span>
                      </td>
                      <td className="p-3 align-top text-center">
                        <span className="text-slate-400 text-xs italic">
                          {item.proveedorNombre || "Sin asignar"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {rawItems.length > 0 && (
              <tfoot className="bg-slate-50 border-t border-slate-200 font-extrabold text-xs text-[#001B47]">
                <tr>
                  <td colSpan={3} className="p-3 text-right uppercase">
                    Total
                  </td>
                  <td className="p-3 text-right font-mono text-sm text-[#002855]">
                    {totalGeneral.toLocaleString("es-BO", { minimumFractionDigits: 2 })} Bs
                  </td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Botón de Descarga Proforma */}
      <div className="pt-4 border-t border-slate-200 flex items-center justify-start bg-white p-4 rounded-2xl border shadow-xs">
        <button
          type="button"
          onClick={handleDownloadProforma}
          className="px-5 py-2.5 bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4 text-slate-600" />
          <span>Descargar Proforma en Blanco</span>
        </button>
      </div>
    </div>
  );
}
