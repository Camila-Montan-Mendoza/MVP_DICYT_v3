"use client";

import { OrdenContractualData } from "@/types/ordenes";
import { calcularDiasRestantes } from "@/lib/utils/dias-restantes";
import {
  Building2,
  Printer,
  FileCheck2,
  Clock,
  ExternalLink,
} from "lucide-react";

interface TarjetaEfectivizacionProveedorProps {
  orden: OrdenContractualData;
  onImprimirDirecto: (orden: OrdenContractualData) => void;
  readOnly?: boolean;
}

export function TarjetaEfectivizacionProveedor({
  orden,
  onImprimirDirecto,
}: TarjetaEfectivizacionProveedorProps) {
  const esEfectuado = orden.estado === "EFECTUADO_Y_FIRMADO";
  const diasObj = calcularDiasRestantes(orden.fechaLimiteEntrega);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4 hover:border-slate-300 transition-all">
      {/* Cabecera Principal Simplificada */}
      <div className="flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#001B47]/10 text-[#001B47] flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-sm text-[#001B47] tracking-tight">
                {orden.proveedorNombre}
              </h4>
              <span className="text-[10px] font-mono text-slate-400">
                ({orden.numeroCorrelativo || "N° 231"})
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              NIT: <span className="font-mono">{orden.proveedorNit}</span> • {orden.proyectoNombre}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Badge Tipo Documento */}
          <span
            className={`px-3 py-1 rounded-lg text-[10px] font-extrabold tracking-wider uppercase border ${
              orden.tipoDocumento === "CONTRATO"
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
            <strong className="text-sm font-extrabold text-[#001B47] font-mono block">
              {orden.montoTotal.toLocaleString("es-BO", { minimumFractionDigits: 2 })} Bs.
            </strong>
          </div>

          {/* Botón de Impresión Directa de 1 solo Clic */}
          <button
            type="button"
            onClick={() => onImprimirDirecto(orden)}
            className="px-4 py-2 bg-[#001B47] text-white hover:bg-[#002855] text-xs font-extrabold rounded-xl transition-all shadow-xs flex items-center gap-2 shrink-0"
            title="Lanzar impresión del documento oficial"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      {/* Grid 2 Columnas: Estado de Formalización + Conteo de Días Restantes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
        {/* Sección 1: Estado de Formalización Legal */}
        <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-xl space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-[#001B47] text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-[#001B47]" />
              Compromiso Legal
            </span>
            <span
              className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-md border uppercase ${
                esEfectuado
                  ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                  : "bg-amber-100 text-amber-900 border-amber-300"
              }`}
            >
              {esEfectuado ? "EFECTUADO Y FIRMADO" : "PENDIENTE DE EFECTIVIZACIÓN"}
            </span>
          </div>

          <p className="text-[11px] text-slate-600 font-medium">
            Impresión y firmas requeridas: <strong className="text-[#001B47]">Coordinador, Director DICyT y Proveedor</strong>.
          </p>
        </div>

        {/* Sección 2: Conteo de Días Restantes y Fecha Límite */}
        <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-xl space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-[#001B47] text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-700" />
              Plazo de Entrega Pactado
            </span>
            <span
              className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-md uppercase border ${
                diasObj.estado === "NORMAL"
                  ? "bg-blue-100 text-blue-900 border-blue-300"
                  : diasObj.estado === "ALERTA"
                    ? "bg-amber-100 text-amber-900 border-amber-300"
                    : "bg-rose-100 text-rose-900 border-rose-300"
              }`}
            >
              {diasObj.texto}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-700 text-[11px]">
            <span>
              Fecha Límite: <strong className="text-[#001B47]">{orden.fechaLimiteEntrega}</strong>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              ({orden.diasEntrega} días cal.)
            </span>
          </div>

          {orden.pdfContratoUrl && (
            <a
              href={orden.pdfContratoUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-blue-800 font-bold hover:underline flex items-center gap-1 pt-1"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Ver Contrato PDF Adjunto</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
