"use client";

import { useState } from "react";
import { NodoWorkflow } from "@/lib/workflow/compra-menor-strategy";
import { RevisionPreventivaCard } from "@/components/budget/revision-preventiva-card";
import {
  FileText,
  FileCheck,
  ShoppingBag,
  Building2,
  DollarSign,
  Paperclip,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Upload,
} from "lucide-react";

interface WorkflowSharedUIProps {
  nodo: NodoWorkflow;
  tramiteId: string;
  onRefresh: () => void;
}

export function WorkflowSharedUI({ nodo, tramiteId, onRefresh }: WorkflowSharedUIProps) {
  const [cotizacionesSubmitted, setCotizacionesSubmitted] = useState(false);
  const [ordenFirmada, setOrdenFirmada] = useState(false);
  const [actasCount, setActasCount] = useState(1);
  const [comprobanteEmitido, setComprobanteEmitido] = useState(false);

  // 1. Paso 1.1: Revisión Presupuestaria y Sello Preventivo
  if (nodo.id === "node_1_1" || nodo.id === "node_1_3") {
    return (
      <RevisionPreventivaCard
        tramiteId={tramiteId}
        onApproveSuccess={onRefresh}
        onRejectSuccess={onRefresh}
      />
    );
  }

  // 2. Paso 1.6 / 1.7 / 1.8: Verificación Mercado Virtual, Cotizaciones y Adjudicación
  if (nodo.id === "node_1_6" || nodo.id === "node_1_7" || nodo.id === "node_1_8") {
    return (
      <div className="bg-white p-5 rounded-2xl border border-[#e5e7eb] shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-3">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#002855]" />
            <h3 className="font-extrabold text-sm text-[#001B47]">
              Cuadro Comparativo de Cotizaciones & Mercado Virtual
            </h3>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            Mercado Virtual: Sin Inexistencia
          </span>
        </div>

        <div className="space-y-3">
          <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#e5e7eb] text-xs space-y-1">
            <p className="font-bold text-[#001B47]">Cotizaciones de Proveedores del Mercado Local (Mínimo 3):</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
              <div className="p-2.5 bg-white rounded-lg border border-[#e5e7eb] text-[11px] space-y-1">
                <p className="font-bold text-[#002855]">1. Tech-Bolivia SRL</p>
                <p className="text-[#64748b]">Monto: Bs. 18,500.00</p>
                <span className="inline-block px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                  Menor Precio (Adjudicado)
                </span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-[#e5e7eb] text-[11px] space-y-1">
                <p className="font-bold text-[#002855]">2. Importadora Andina</p>
                <p className="text-[#64748b]">Monto: Bs. 19,200.00</p>
                <span className="inline-block px-1.5 py-0.5 bg-slate-100 text-slate-700 font-bold rounded text-[10px]">
                  Valido
                </span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-[#e5e7eb] text-[11px] space-y-1">
                <p className="font-bold text-[#002855]">3. Soluciones TI Bolivia</p>
                <p className="text-[#64748b]">Monto: Bs. 19,800.00</p>
                <span className="inline-block px-1.5 py-0.5 bg-slate-100 text-slate-700 font-bold rounded text-[10px]">
                  Valido
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-[#64748b] font-medium">3 proformas adjuntas correctamente.</span>
            <button
              type="button"
              onClick={() => setCotizacionesSubmitted(true)}
              className="px-4 py-2 bg-[#002855] text-white text-xs font-bold rounded-xl hover:bg-[#001B47] transition-all flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4" />
              {cotizacionesSubmitted ? "Cuadro Consolidado Registrado" : "Consolidar Cuadro Comparativo"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Paso 2.1 / 2.2: Orden de Compra o Contrato
  if (nodo.id === "node_2_1" || nodo.id === "node_2_2") {
    return (
      <div className="bg-white p-5 rounded-2xl border border-[#e5e7eb] shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#002855]" />
            <h3 className="font-extrabold text-sm text-[#001B47]">
              Orden de Compra / Contrato Formalizado
            </h3>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#002855] border border-blue-200">
            Nº OC-2026-042
          </span>
        </div>

        <div className="p-4 bg-[#f8fafc] rounded-xl border border-[#e5e7eb] text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-[#64748b]">Proveedor:</span>
            <strong className="text-[#001B47]">COMERCIALIZADORA TECH-BOLIVIA S.R.L.</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748b]">Monto Total Adjudicado:</span>
            <strong className="text-[#001B47]">Bs. 18,500.00</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748b]">Plazo de Entrega:</span>
            <strong className="text-[#001B47]">5 Días Hábiles</strong>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => setOrdenFirmada(true)}
            className="px-4 py-2 bg-[#002855] text-white text-xs font-bold rounded-xl hover:bg-[#001B47] transition-all flex items-center gap-1.5"
          >
            <FileCheck className="w-4 h-4" />
            {ordenFirmada ? "Orden Firmada y Digitalizada" : "Registrar Firma de Orden de Compra"}
          </button>
        </div>
      </div>
    );
  }

  // 4. Paso 2.3 / 2.4: Actas de Recepción Provisional y Definitiva
  if (nodo.id === "node_2_3" || nodo.id === "node_2_4") {
    return (
      <div className="bg-white p-5 rounded-2xl border border-[#e5e7eb] shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#002855]" />
            <h3 className="font-extrabold text-sm text-[#001B47]">
              Acta de Recepción y Conformidad Técnica de Bienes
            </h3>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            Total Actas Emitidas: {actasCount}
          </span>
        </div>

        <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 text-xs space-y-2">
          <div className="flex items-center gap-2 text-emerald-900 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Verificación de Insumos Recibidos en Almacén / Laboratorio DICYT
          </div>
          <p className="text-[#64748b]">
            Se verificó la recepción de los bienes conforme a las especificaciones técnicas requeridas.
          </p>
        </div>
      </div>
    );
  }

  // 5. Paso 3.1 a 3.5: Solicitud de Pago, Memorándum, Comprobante C-31 y Desembolso
  if (nodo.pasoNumero === 3) {
    return (
      <div className="bg-white p-5 rounded-2xl border border-[#e5e7eb] shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-3">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#002855]" />
            <h3 className="font-extrabold text-sm text-[#001B47]">
              Módulo Financiero de Pago & Comprobante C-31
            </h3>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#002855] border border-blue-200">
            Devengado C-31
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#e5e7eb] space-y-1">
            <p className="text-[#64748b]">Beneficiario del Pago:</p>
            <p className="font-bold text-[#001B47]">COMERCIALIZADORA TECH-BOLIVIA S.R.L.</p>
          </div>
          <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#e5e7eb] space-y-1">
            <p className="text-[#64748b]">Monto Solicitado:</p>
            <p className="font-bold text-emerald-700 font-mono text-sm">Bs. 18,500.00</p>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => setComprobanteEmitido(true)}
            className="px-4 py-2 bg-[#002855] text-white text-xs font-bold rounded-xl hover:bg-[#001B47] transition-all flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            {comprobanteEmitido ? "Comprobante C-31 Emitido" : "Generar Comprobante C-31"}
          </button>
        </div>
      </div>
    );
  }

  // 6. Paso 4: Expediente Digital y Cierre
  return (
    <div className="bg-white p-5 rounded-2xl border border-[#e5e7eb] shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-3">
        <div className="flex items-center gap-2">
          <Paperclip className="w-5 h-5 text-[#002855]" />
          <h3 className="font-extrabold text-sm text-[#001B47]">
            Expediente Digital de Evidencia PDF & Archivo
          </h3>
        </div>
        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
          PDF Consolidado
        </span>
      </div>

      <div className="p-4 bg-[#f8fafc] rounded-xl border border-[#e5e7eb] text-xs space-y-2 text-center">
        <Upload className="w-8 h-8 text-[#002855] mx-auto" />
        <p className="font-bold text-[#001B47]">Expediente Completo del Trámite</p>
        <p className="text-[#64748b]">
          Incluye Solicitud, Cotizaciones, Orden de Compra, Actas de Conformidad y Comprobante C-31.
        </p>
      </div>
    </div>
  );
}
