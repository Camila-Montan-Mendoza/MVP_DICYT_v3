"use client";

import { useState, useEffect, useCallback } from "react";
import { TaskViewProps } from "../view-types";
import { OrdenContractualData } from "@/types/ordenes";
import { obtenerOrdenesContractualesTramite } from "@/services/ordenesService";
import { TarjetaEfectivizacionProveedor } from "@/components/tramites/ordenes/TarjetaEfectivizacionProveedor";
import { ModalImpresionOrden } from "@/components/tramites/ordenes/ModalImpresionOrden";
import { FileCheck2, Loader2, CheckCircle2 } from "lucide-react";

export default function Tarea10FirmaFormalizacionPassive({ tramite }: TaskViewProps) {
  const tramiteId = tramite?.id || 3;

  const [loading, setLoading] = useState(true);
  const [ordenes, setOrdenes] = useState<OrdenContractualData[]>([]);
  const [selectedOrdenModal, setSelectedOrdenModal] = useState<OrdenContractualData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cargarOrdenes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await obtenerOrdenesContractualesTramite(tramiteId);
      setOrdenes(data);
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, [tramiteId]);

  useEffect(() => {
    cargarOrdenes();
  }, [cargarOrdenes]);

  const handleImprimirDirecto = (orden: OrdenContractualData) => {
    setSelectedOrdenModal(orden);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <Loader2 className="w-6 h-6 animate-spin text-[#001B47]" />
        <p className="text-xs font-semibold text-slate-500">
          Cargando efectivizaciones desde Supabase...
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
          <span>Órdenes Efectivizadas y Firmadas (Modo Lectura)</span>
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span className="font-extrabold text-[#001B47]">
            {ordenes.length} compromiso(s) efectivizado(s)
          </span>
        </div>
      </div>

      {/* Lista de Tarjetas en Modo Lectura */}
      <div className="space-y-4">
        {ordenes.map((ordenItem, idx) => (
          <TarjetaEfectivizacionProveedor
            key={idx}
            orden={ordenItem}
            onImprimirDirecto={handleImprimirDirecto}
            readOnly={true}
          />
        ))}
      </div>

      {/* Modal de Impresión */}
      <ModalImpresionOrden
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        orden={selectedOrdenModal}
      />
    </div>
  );
}
