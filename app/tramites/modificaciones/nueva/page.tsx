"use client";

import { useState } from "react";
import { SigefiShell } from "@/components/sigefi-shell";
import { ModificacionDetalleBuilder } from "@/src/features/tramites/components/ModificacionDetalleBuilder";
import { ModificarPresupuestoModal } from "@/src/features/tramites/components/ModificarPresupuestoModal";
import { MovimientoPartidaItem } from "@/src/features/tramites/types/modificacion";

export default function NuevaModificacionPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [afectadas, setAfectadas] = useState<MovimientoPartidaItem[] | undefined>(undefined);
  const [beneficiadas, setBeneficiadas] = useState<MovimientoPartidaItem[] | undefined>(undefined);

  const handleConfirmModal = (af: MovimientoPartidaItem[], ben: MovimientoPartidaItem[]) => {
    setAfectadas(af);
    setBeneficiadas(ben);
    setIsModalOpen(false);
  };

  return (
    <SigefiShell>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ModificacionDetalleBuilder
          initialAfectadas={afectadas}
          initialBeneficiadas={beneficiadas}
          onOpenListaPartidasModal={() => setIsModalOpen(true)}
        />

        <ModificarPresupuestoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirmAgregar={handleConfirmModal}
        />
      </div>
    </SigefiShell>
  );
}
