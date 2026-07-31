"use client";

import { use } from "react";
import { SigefiShell } from "@/components/sigefi-shell";
import { ProyectoDetalleContainer } from "@/src/features/proyecto-detalle/components/ProyectoDetalleContainer";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProyectoDetallePage({ params }: PageProps) {
  const { id } = use(params);
  const proyectoId = parseInt(id, 10);

  return (
    <SigefiShell>
      <div className="space-y-6 pb-16">
        <ProyectoDetalleContainer proyectoId={proyectoId} />
      </div>
    </SigefiShell>
  );
}
