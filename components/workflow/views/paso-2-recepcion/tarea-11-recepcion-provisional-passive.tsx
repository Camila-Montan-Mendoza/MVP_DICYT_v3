"use client";

import { useState, useEffect, useCallback } from "react";
import { TaskViewProps } from "../view-types";
import { RecepcionProveedorData } from "@/types/recepcion";
import { obtenerDatosRecepcionTramite } from "@/services/recepcionService";
import { TarjetaRecepcionProveedor } from "@/components/tramites/ordenes/TarjetaRecepcionProveedor";
import { ModalImpresionActaRecepcion } from "@/components/tramites/ordenes/ModalImpresionActaRecepcion";
import { FileCheck2, Loader2, CheckCircle2 } from "lucide-react";

export default function Tarea11RecepcionProvisionalPassive({ tramite }: TaskViewProps) {
  const tramiteId = tramite?.id || 3;

  const [loading, setLoading] = useState(true);
  const [recepciones, setRecepciones] = useState<RecepcionProveedorData[]>([]);
  const [selectedRecepcionModal, setSelectedRecepcionModal] =
    useState<RecepcionProveedorData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cargarRecepciones = useCallback(async () => {
    setLoading(true);
    try {
      const data = await obtenerDatosRecepcionTramite(tramiteId);
      setRecepciones(data);
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, [tramiteId]);

  useEffect(() => {
    cargarRecepciones();
  }, [cargarRecepciones]);

  const handleGenerarActa = (recData: RecepcionProveedorData) => {
    setSelectedRecepcionModal(recData);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <Loader2 className="w-6 h-6 animate-spin text-[#001B47]" />
        <p className="text-xs font-semibold text-slate-500">
          Cargando actas de recepción desde Supabase...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Banner Informativo Vista Pasiva */}
      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-bold text-[#001B47]">
          <FileCheck2 className="w-4 h-4 text-[#001B47]" />
          <span>Actas de Recepción de Materiales Registradas (Modo Lectura)</span>
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span className="font-extrabold text-[#001B47]">
            {recepciones.length} recepción(es) registrada(s)
          </span>
        </div>
      </div>

      {/* Lista de Tarjetas en Modo Lectura */}
      <div className="space-y-4">
        {recepciones.map((recItem, idx) => (
          <TarjetaRecepcionProveedor
            key={idx}
            recepcion={recItem}
            onGenerarActa={handleGenerarActa}
            readOnly={true}
          />
        ))}
      </div>

      {/* Visor e Impresor de Acta */}
      <ModalImpresionActaRecepcion
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        recepcion={selectedRecepcionModal}
      />
    </div>
  );
}
