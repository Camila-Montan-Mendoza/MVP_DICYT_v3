"use client";

import { ResumenEjecutivoTramiteData } from "@/types/expediente";
import { CheckCircle2, FileCheck2, Building2, DollarSign, FolderArchive } from "lucide-react";

interface FichaResumenEjecutivoTramiteProps {
  resumen: ResumenEjecutivoTramiteData;
}

export function FichaResumenEjecutivoTramite({ resumen }: FichaResumenEjecutivoTramiteProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs space-y-8 text-slate-800 font-sans">
      {/* Banner de Éxito: TRÁMITE COMPLETADO Y ARCHIVADO */}
      <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div>
            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-md uppercase tracking-wider block w-fit mb-1">
              ESTADO FINAL CONSOLIDADO
            </span>
            <h3 className="text-lg font-black text-emerald-950 tracking-tight">
              TRÁMITE COMPLETADO Y ARCHIVADO
            </h3>
            <p className="text-xs text-emerald-800 font-medium">
              Expediente digital verificado y rendición de cuentas concluida exitosamente.
            </p>
          </div>
        </div>

        <div className="text-right text-xs text-emerald-900 font-mono font-bold bg-white/80 px-4 py-2 rounded-xl border border-emerald-200">
          <span>Finalizado: {resumen.fechaCompletado}</span>
        </div>
      </div>

      {/* Grid de 4 Bloques Ejecutivos por Paso */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Paso 1: Solicitud de Contratación */}
        <div className="p-5 bg-slate-50/70 border border-slate-200 rounded-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2 font-extrabold text-[#001B47]">
              <FileCheck2 className="w-4 h-4 text-blue-700" />
              <span>PASO 1: Solicitud y Cotizaciones</span>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
              ✓ COMPLETADO
            </span>
          </div>

          <div className="space-y-1.5 text-slate-700">
            <p>
              <strong className="text-slate-900">Proyecto:</strong> {resumen.proyectoNombre}
            </p>
            <p>
              <strong className="text-slate-900">Solicitante / IP:</strong>{" "}
              {resumen.solicitanteNombre}
            </p>
            <p>
              <strong className="text-slate-900">Unidad:</strong> {resumen.unidadSolicitante}
            </p>
            <p>
              <strong className="text-slate-900">Proveedores Adjudicados:</strong>{" "}
              {resumen.proveedoresAdjudicadosCount} proveedor(es)
            </p>
          </div>
        </div>

        {/* Paso 2: Recepción y Contratos */}
        <div className="p-5 bg-slate-50/70 border border-slate-200 rounded-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2 font-extrabold text-[#001B47]">
              <Building2 className="w-4 h-4 text-blue-700" />
              <span>PASO 2: Ordenes y Recepción</span>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
              ✓ COMPLETADO
            </span>
          </div>

          <div className="space-y-1.5 text-slate-700">
            <p>
              <strong className="text-slate-900">Órdenes Contractuales:</strong> Emitidas y
              efectivizadas
            </p>
            <p>
              <strong className="text-slate-900">Actas de Recepción:</strong>{" "}
              {resumen.actasEmitidasCount} acta(s) definitivas
            </p>
            <p>
              <strong className="text-slate-900">Conformidad:</strong> 100% de ítems entregados y
              verificados
            </p>
          </div>
        </div>

        {/* Paso 3: Pago a Proveedor */}
        <div className="p-5 bg-slate-50/70 border border-slate-200 rounded-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2 font-extrabold text-[#001B47]">
              <DollarSign className="w-4 h-4 text-blue-700" />
              <span>PASO 3: Pago a Proveedor</span>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
              ✓ COMPLETADO
            </span>
          </div>

          <div className="space-y-1.5 text-slate-700">
            <p>
              <strong className="text-slate-900">Solicitudes de Pago:</strong>{" "}
              {resumen.solicitudesPagoCount} validada(s)
            </p>
            <p>
              <strong className="text-slate-900">Monto Total Ejecutado:</strong>{" "}
              <span className="font-mono font-extrabold text-[#001B47]">
                Bs.{" "}
                {resumen.montoTotalTramite.toLocaleString("es-BO", { minimumFractionDigits: 2 })}
              </span>
            </p>
            <p>
              <strong className="text-slate-900">Facturación:</strong> Respaldos fiscales adjuntos
            </p>
          </div>
        </div>

        {/* Paso 4: Expediente Digital */}
        <div className="p-5 bg-slate-50/70 border border-slate-200 rounded-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2 font-extrabold text-[#001B47]">
              <FolderArchive className="w-4 h-4 text-blue-700" />
              <span>PASO 4: Expediente Digital</span>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
              ✓ ARCHIVADO
            </span>
          </div>

          <div className="space-y-1.5 text-slate-700">
            <p>
              <strong className="text-slate-900">Archivos Respaldados:</strong>{" "}
              {resumen.expedienteArchivos.length} documento(s)
            </p>
            <p>
              <strong className="text-slate-900">Custodia:</strong> Supabase Cloud Storage DICyT
            </p>
          </div>
        </div>
      </div>

      {/* Lista del Expediente Digital Resumido */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <h4 className="font-extrabold text-sm text-[#001B47] flex items-center gap-2">
          <FolderArchive className="w-4 h-4 text-blue-700" />
          <span>Documentos del Expediente Digital</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {resumen.expedienteArchivos.map((arc, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-2"
            >
              <span className="font-bold text-[#001B47] truncate">{arc.nombreArchivo}</span>
              <a
                href={arc.urlArchivo}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] font-extrabold text-blue-700 hover:underline shrink-0"
              >
                Ver Documento →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
