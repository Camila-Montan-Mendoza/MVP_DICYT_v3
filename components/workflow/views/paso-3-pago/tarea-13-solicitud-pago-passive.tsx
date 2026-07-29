"use client";

import { useState, useEffect, useCallback } from "react";
import { TaskViewProps } from "../view-types";
import { SolicitudPagoProveedorData } from "@/types/solicitudPago";
import { obtenerSolicitudesPagoTramite } from "@/services/solicitudPagoService";
import { TarjetaSolicitudPagoProveedor } from "@/components/tramites/pago/TarjetaSolicitudPagoProveedor";
import { ModalImpresionNotaPago } from "@/components/tramites/pago/ModalImpresionNotaPago";
import { FileCheck2, Loader2, CheckCircle2 } from "lucide-react";

export default function Tarea13SolicitudPagoPassive({ tramite }: TaskViewProps) {
  const tramiteId = tramite?.id || 3;

  const [loading, setLoading] = useState(true);
  const [solicitudes, setSolicitudes] = useState<SolicitudPagoProveedorData[]>([]);
  const [selectedNotaModal, setSelectedNotaModal] = useState<SolicitudPagoProveedorData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cargarSolicitudes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await obtenerSolicitudesPagoTramite(tramiteId);
      setSolicitudes(data);
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, [tramiteId]);

  useEffect(() => {
    cargarSolicitudes();
  }, [cargarSolicitudes]);

  const handleGenerarNota = (solData: SolicitudPagoProveedorData) => {
    setSelectedNotaModal(solData);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <Loader2 className="w-6 h-6 animate-spin text-[#001B47]" />
        <p className="text-xs font-semibold text-slate-500">Cargando solicitudes de pago desde Supabase...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Banner Informativo Vista Pasiva */}
      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-bold text-[#001B47]">
          <FileCheck2 className="w-4 h-4 text-[#001B47]" />
          <span>Solicitudes de Pago a Proveedor Registradas (Modo Lectura)</span>
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span className="font-extrabold text-[#001B47]">
            {solicitudes.length} solicitud(es) registrada(s)
          </span>
        </div>
      </div>

      {/* Lista de Tarjetas en Modo Lectura */}
      <div className="space-y-4">
        {solicitudes.map((solItem, idx) => (
          <TarjetaSolicitudPagoProveedor
            key={idx}
            solicitud={solItem}
            onGenerarNota={handleGenerarNota}
            onEnviarSolicitud={() => {}}
            readOnly={true}
          />
        ))}
      </div>

      {/* Visor e Impresor de Nota */}
      <ModalImpresionNotaPago
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        solicitud={selectedNotaModal}
      />
    </div>
  );
}
