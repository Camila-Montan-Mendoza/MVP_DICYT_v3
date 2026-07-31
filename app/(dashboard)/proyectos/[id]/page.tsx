"use client";

import { use } from "react";
import { SigefiShell } from "@/components/sigefi-shell";
import { Folder } from "lucide-react";
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
        <div className="flex items-center gap-2 border-b border-[#e5e7eb] pb-4">
          <span className="p-1.5 bg-[#003770]/10 text-[#003770] rounded-lg">
            <Folder className="w-5 h-5" />
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#001B47] tracking-tight">
            Detalle del Proyecto
          </h1>
        </div>

        <ProyectoDetalleContainer proyectoId={proyectoId} />
      </div>
    </SigefiShell>
  );
}
