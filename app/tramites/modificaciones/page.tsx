"use client";

import { useEffect, useState } from "react";
import { SigefiShell } from "@/components/sigefi-shell";
import { mockModificacionService } from "@/src/features/tramites/services/mockModificacionService";
import { ModificacionPresupuestaria } from "@/src/features/tramites/types/modificacion";
import { ModificacionesListTable } from "@/src/features/tramites/components/ModificacionesListTable";
import { ModificarPresupuestoModal } from "@/src/features/tramites/components/ModificarPresupuestoModal";
import { useRouter } from "next/navigation";
import { Plus, FileSpreadsheet } from "lucide-react";

export default function ModificacionesPresupuestariasPage() {
  const router = useRouter();
  const [modificaciones, setModificaciones] = useState<ModificacionPresupuestaria[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setModificaciones(mockModificacionService.getModificaciones());
  }, []);

  return (
    <SigefiShell>
      <div className="space-y-6 pb-12">
        {/* Header Principal */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#001B47] text-[#ffffff] flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-[#001B47] tracking-tight">
                Modificaciones Presupuestarias
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Solicitudes de traspaso de fondos entre partidas registradas para el proyecto.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#001B47] text-white font-bold text-xs rounded-xl hover:bg-[#002855] transition-all shadow-md self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Modificación Presupuestaria</span>
          </button>
        </div>

        {/* Tabla Listado de Modificaciones */}
        <ModificacionesListTable modificaciones={modificaciones} />

        {/* Modal Modificar Presupuesto (Captura 1) */}
        <ModificarPresupuestoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirmAgregar={() => {
            setIsModalOpen(false);
            router.push("/tramites/modificaciones/nueva");
          }}
        />
      </div>
    </SigefiShell>
  );
}
