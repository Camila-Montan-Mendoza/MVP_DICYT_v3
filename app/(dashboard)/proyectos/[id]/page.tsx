"use client";

import { use, Suspense } from "react";
import { SigefiShell } from "@/components/sigefi-shell";
import { ProyectoDetalleContainer } from "@/src/features/proyecto-detalle/components/ProyectoDetalleContainer";

interface PageProps {
  params: Promise<{ id: string }>;
}

function ProyectoDetalleContent({ params }: PageProps) {
  const { id } = use(params);
  const proyectoId = parseInt(id, 10);

  return <ProyectoDetalleContainer proyectoId={proyectoId} />;
}

export default function ProyectoDetallePage(props: PageProps) {
  return (
    <SigefiShell>
      <div className="space-y-6 pb-16">
        <Suspense
          fallback={
            <div className="p-12 text-center text-xs font-bold text-slate-500 animate-pulse">
              Cargando detalle del proyecto...
            </div>
          }
        >
          <ProyectoDetalleContent {...props} />
        </Suspense>
      </div>
    </SigefiShell>
  );
}
