"use client";

import { SigefiShell } from "@/components/sigefi-shell";
import { Folder } from "lucide-react";
import { ProyectosListaContainer } from "@/src/features/proyectos-lista/components/ProyectosListaContainer";

export default function ProyectosPage() {
  return (
    <SigefiShell>
      <div className="space-y-6 pb-16">
        <div className="flex items-center gap-2 border-b border-border pb-4">
          <span className="p-1.5 bg-[#003770]/10 text-[#003770] rounded-lg">
            <Folder className="w-5 h-5" />
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#001B47] tracking-tight">
            Lista de Proyectos
          </h1>
        </div>

        <ProyectosListaContainer />
      </div>
    </SigefiShell>
  );
}
