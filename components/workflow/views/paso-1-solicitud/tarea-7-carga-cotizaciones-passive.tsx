"use client";

import { TaskViewProps } from "../view-types";
import { Download } from "lucide-react";

export default function Tarea7CargaCotizacionesPassive({ tarea, tramite }: TaskViewProps) {
  const rawItems = (tramite as any)?.items || [];

  const handleDownloadPlantilla = () => {
    alert("Descargando Plantilla Oficial de Proforma en Blanco (PDF)...");
  };

  return (
    <div className="space-y-6">
      {/* Banner Read-Only */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-center justify-between">
        <span>
          ℹ️ <strong>Vista en modo lectura</strong> ({tarea.nombre})
        </span>
        <span className="font-mono text-[11px] bg-slate-200/80 px-2 py-0.5 rounded-md font-semibold text-slate-700">
          {tarea.estado}
        </span>
      </div>

      {/* Main Card */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-2xs space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-lg font-extrabold text-[#001B47] tracking-tight">
            Cotizaciones Registradas
          </h2>

          <button
            type="button"
            onClick={handleDownloadPlantilla}
            className="px-4 py-2.5 bg-white border border-slate-200 text-[#001B47] hover:bg-slate-50 text-xs font-extrabold rounded-xl transition-colors flex items-center gap-2 shadow-2xs"
          >
            <Download className="w-4 h-4 text-[#001B47]" />
            <span>Plantilla de proforma</span>
          </button>
        </div>

        {/* Table Read Only */}
        <div className="border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[#001B47] font-extrabold border-b border-slate-200 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="p-3.5 pl-4">PROVEEDOR</th>
                <th className="p-3.5 text-left">TOTAL BS.</th>
                <th className="p-3.5 text-left">TIEMPO ENTREGA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {rawItems.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-slate-400 text-xs italic">
                    Sin cotizaciones registradas para este trámite.
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-slate-500 text-xs">
                    Cotizaciones en proceso de registro por el Investigador.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
