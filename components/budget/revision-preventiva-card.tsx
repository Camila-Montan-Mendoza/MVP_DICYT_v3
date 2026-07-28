"use client";

import { useState } from "react";
import {
  obtenerCertificacionPartidas,
  generarSelloPreventivo,
  SelloPreventivo,
} from "@/lib/budget/preventivo-service";
import { ShieldCheck, CheckCircle2, AlertOctagon, X, Stamp } from "lucide-react";
import { tramiteDBRepository } from "@/lib/db/tramite-repository";

interface RevisionPreventivaCardProps {
  tramiteId: string;
  onApproveSuccess?: (sello: SelloPreventivo) => void;
  onRejectSuccess?: (observacion: string) => void;
}

export function RevisionPreventivaCard({
  tramiteId,
  onApproveSuccess,
  onRejectSuccess,
}: RevisionPreventivaCardProps) {
  const [sello, setSello] = useState<SelloPreventivo | null>(null);
  const [isObservado, setIsObservado] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [observacionTexto, setObservacionTexto] = useState("");

  const handleAprobar = () => {
    const nuevoSello = generarSelloPreventivo("Alan");
    setSello(nuevoSello);
    if (onApproveSuccess) onApproveSuccess(nuevoSello);
  };

  const handleConfirmarRechazo = () => {
    if (!observacionTexto.trim()) return;
    setIsObservado(true);
    setShowRejectModal(false);
    if (onRejectSuccess) onRejectSuccess(observacionTexto);
  };

  const partidasList = obtenerCertificacionPartidas();
  const allSuficientes = partidasList.every((p) => p.suficiente);

  return (
    <div className="bg-white p-5 rounded-2xl border border-[#e5e7eb] shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#002855]" />
          <h3 className="font-extrabold text-sm text-[#001B47]">
            Revisión y Emisión de Sello Preventivo Presupuestario
          </h3>
        </div>
        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#002855] border border-blue-200">
          Resp. Presupuestos: Alan
        </span>
      </div>

      {/* Sello Estampado (Si fue Aprobado) */}
      {sello ? (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-400 rounded-xl space-y-2 text-center animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-center gap-2 text-emerald-800 font-extrabold text-base uppercase">
            <Stamp className="w-6 h-6 text-emerald-600" />
            SELLO PREVENTIVO EMITIDO — {sello.correlativo}
          </div>
          <p className="text-xs text-emerald-700">
            Reserva Presupuestaria Confirmada por{" "}
            <strong className="font-bold">{sello.usuarioAprobador}</strong>
          </p>
          <p className="text-[11px] font-mono text-emerald-600">
            Fecha/Hora: {new Date(sello.fechaEmision).toLocaleString("es-BO")}
          </p>
        </div>
      ) : isObservado ? (
        <div className="p-4 bg-red-50 border-2 border-red-300 rounded-xl space-y-1 text-red-800 text-xs">
          <p className="font-extrabold text-sm flex items-center gap-1.5 text-red-900">
            <AlertOctagon className="w-4 h-4 text-red-600" />
            Trámite Observado por Presupuestos
          </p>
          <p>
            <strong>Observación:</strong> {observacionTexto}
          </p>
          <p className="text-[10px] text-red-600 italic">
            El trámite ha sido devuelto a la bandeja del Investigador Principal.
          </p>
        </div>
      ) : (
        <>
          {/* Tabla de Verificación de Saldos por Partida */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#2c3e50]">
              Verificación Automática de Disponibilidad Financiera:
            </p>
            <div className="overflow-x-auto rounded-xl border border-[#e5e7eb]">
              <table className="w-full text-left text-xs divide-y divide-[#e5e7eb]">
                <thead className="bg-[#f8fafc] text-[11px] font-bold text-[#6b7280] uppercase">
                  <tr>
                    <th className="py-2.5 px-3">PARTIDA (5 DÍGITOS)</th>
                    <th className="py-2.5 px-3">REQUERIDO (BS.)</th>
                    <th className="py-2.5 px-3">DISPONIBLE (BS.)</th>
                    <th className="py-2.5 px-3 text-center">ESTADO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e7eb]">
                  {partidasList.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3">
                        <p className="font-bold text-[#001B47] font-mono">{p.codigo}</p>
                        <p className="text-[11px] text-[#6b7280]">{p.denominacion}</p>
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-[#001B47]">
                        {p.montoRequerido.toLocaleString("es-BO")},00
                      </td>
                      <td className="py-2.5 px-3 text-[#2c3e50]">
                        {p.saldoDisponible.toLocaleString("es-BO")},00
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Suficiente
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Botones de Acción Operativa */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-[#e5e7eb]">
            <button
              type="button"
              onClick={() => setShowRejectModal(true)}
              className="w-full sm:w-auto px-4 py-2.5 bg-white border border-[#BC000C] text-[#BC000C] text-xs font-bold rounded-xl hover:bg-red-50 transition-all flex items-center justify-center gap-1.5"
            >
              <AlertOctagon className="w-4 h-4" />
              Rechazar / Observar Trámite
            </button>

            <button
              type="button"
              disabled={!allSuficientes}
              onClick={handleAprobar}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#002855] text-white text-xs font-bold rounded-xl hover:bg-[#001B47] transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Stamp className="w-4 h-4" />
              Aprobar Preventivo
            </button>
          </div>
        </>
      )}

      {/* Modal de Rechazo / Observación */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border-t-4 border-t-[#BC000C] border-[#e5e7eb] p-5 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-3">
              <h3 className="font-bold text-sm text-[#001B47] uppercase">
                Observar / Rechazar Trámite
              </h3>
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="text-[#9ca3af] hover:text-[#2c3e50]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#2c3e50] block">
                Justificación u Observación Obligatoria *
              </label>
              <textarea
                rows={4}
                placeholder="Escriba detalladamente los motivos del rechazo u observación..."
                value={observacionTexto}
                onChange={(e) => setObservacionTexto(e.target.value)}
                className="w-full p-2.5 text-xs bg-white border border-[#e5e7eb] rounded-lg text-[#2c3e50]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-xs font-medium text-[#64748b] bg-white border border-[#e5e7eb] rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={!observacionTexto.trim()}
                onClick={handleConfirmarRechazo}
                className="px-4 py-2 text-xs font-bold text-white bg-[#BC000C] rounded-lg hover:bg-red-700 disabled:bg-gray-300"
              >
                Confirmar Observación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
