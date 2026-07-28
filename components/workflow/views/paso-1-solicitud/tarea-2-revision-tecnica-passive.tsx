"use client";

import { useState } from "react";
import { TaskViewProps } from "../view-types";
import { FileText, Eye, ChevronDown, ChevronUp } from "lucide-react";

export default function Tarea2RevisionTecnicaPassive({ tarea, tramite }: TaskViewProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({ 0: true });

  const toggleItem = (idx: number) => {
    setExpandedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const items = (tramite as any)?.items || [];

  const totalGeneral = items.reduce(
    (acc: number, item: any) => acc + (item.total || item.cantidad * item.precioUnitario || 0),
    0
  );

  const tipoSolicitudTitulo =
    tramite?.categoria === "ACTIVO_FIJO"
      ? "Solicitud de Activos Fijos"
      : tramite?.categoria === "SERVICIO"
        ? "Solicitud de Servicios"
        : "Solicitud de Materiales";

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

      {/* Grid Principal de 2 Columnas */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Columna Izquierda: Detalle de Solicitud (8 Cols) */}
        <div className="xl:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
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
    </div>
  );
}
