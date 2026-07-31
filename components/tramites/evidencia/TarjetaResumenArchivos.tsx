"use client";

import { useState } from "react";
import { ArchivoExpedienteData } from "@/types/expediente";
import { FileText, Upload, Eye, Trash2, Image as ImageIcon, X } from "lucide-react";

interface TarjetaResumenArchivosProps {
  archivos: ArchivoExpedienteData[];
  onSubirArchivo: (file: File) => void;
  onEliminarArchivo: (archivoId: number, index: number) => void;
  onArchivarRespaldos: () => void;
  isSubmitting?: boolean;
  readOnly?: boolean;
}

export function TarjetaResumenArchivos({
  archivos,
  onSubirArchivo,
  onEliminarArchivo,
  onArchivarRespaldos,
  isSubmitting = false,
  readOnly = false,
}: TarjetaResumenArchivosProps) {
  const [selectedPreview, setSelectedPreview] = useState<ArchivoExpedienteData | null>(null);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onSubirArchivo(e.target.files[0]);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-sm w-full mx-auto shadow-sm space-y-6 font-sans">
      {/* Header Fiel a la Maqueta */}
      <h3 className="text-lg font-extrabold text-[#001B47] tracking-tight">Resumen de archivos</h3>

      {/* Zona de Carga con Borde Punteado (Adjuntar archivo) */}
      {!readOnly && (
        <label className="border-2 border-dashed border-slate-300 hover:border-[#001B47] bg-slate-50/50 hover:bg-slate-100/50 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all group">
          <span className="font-extrabold text-xs text-[#001B47]">Adjuntar archivo</span>
          <div className="w-10 h-10 rounded-full border-2 border-[#001B47] text-[#001B47] flex items-center justify-center group-hover:scale-110 transition-transform">
            <Upload className="w-5 h-5 stroke-[2.5]" />
          </div>
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
            onChange={handleFileInput}
            className="hidden"
          />
        </label>
      )}

      {/* Lista de Archivos Adjuntos */}
      <div className="space-y-3">
        {archivos.map((item, idx) => {
          const esPdf =
            item.tipoArchivo === "pdf" || item.nombreArchivo.toLowerCase().endsWith(".pdf");

          return (
            <div
              key={item.id || idx}
              className="p-3 bg-blue-50/40 border border-blue-100 rounded-2xl flex items-center justify-between gap-3 text-xs"
            >
              {/* Formato e Info */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-[10px] ${
                    esPdf ? "bg-rose-100 text-rose-700" : "bg-[#001B47] text-white"
                  }`}
                >
                  {esPdf ? <FileText className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                </div>

                <div className="min-w-0">
                  <h5 className="font-extrabold text-[#001B47] truncate text-xs">
                    {item.nombreArchivo}
                  </h5>
                  <span className="text-[10px] text-slate-400 font-mono block">
                    {item.tamanoFormateado}
                  </span>
                </div>
              </div>

              {/* Acciones de Ojo (Vista previa) y Papelera (Eliminar) */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedPreview(item)}
                  className="p-1.5 text-slate-500 hover:text-[#001B47] hover:bg-slate-200/50 rounded-lg transition-colors"
                  title="Previsualizar archivo"
                >
                  <Eye className="w-4 h-4" />
                </button>

                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => onEliminarArchivo(item.id || 0, idx)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-100/50 rounded-lg transition-colors"
                    title="Eliminar archivo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Botón Principal Fiel a la Maqueta: "Archivar respaldos" */}
      {!readOnly && (
        <div className="pt-2">
          <button
            type="button"
            disabled={isSubmitting || archivos.length === 0}
            onClick={onArchivarRespaldos}
            className="w-full py-3.5 bg-[#001B47] hover:bg-[#002855] text-white font-black text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
          >
            <span>Archivar respaldos</span>
          </button>
        </div>
      )}

      {/* Modal Previsualización de Archivo (HU3) */}
      {selectedPreview && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 text-[#001B47] font-extrabold text-sm">
                <FileText className="w-4 h-4" />
                <span className="truncate">{selectedPreview.nombreArchivo}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPreview(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#001B47]/10 text-[#001B47] flex items-center justify-center mx-auto">
                <Eye className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-700">Previsualizador de Documento</p>
              <p className="text-[11px] text-slate-500 font-mono">{selectedPreview.urlArchivo}</p>
            </div>

            <div className="flex justify-end">
              <a
                href={selectedPreview.urlArchivo}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2 bg-[#001B47] text-white font-extrabold text-xs rounded-xl"
              >
                Abrir en nueva pestaña
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
