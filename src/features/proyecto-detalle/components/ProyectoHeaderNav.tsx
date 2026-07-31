"use client";

import { FileText } from "lucide-react";
import Link from "next/link";

interface ProyectoHeaderNavProps {
  proyectoId: number;
  activeTab?: "detalle" | "ejecucion";
  onTabChange?: (tab: "detalle" | "ejecucion") => void;
}

export function ProyectoHeaderNav({
  proyectoId,
  activeTab = "detalle",
  onTabChange,
}: ProyectoHeaderNavProps) {
  return (
    <div className="space-y-6">
      {/* Encabezado Superior */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#001B47] tracking-tight">
          Detalles del Proyecto
        </h1>

        <Link
          href={`/tramites?proyectoId=${proyectoId}`}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#001B47] text-white font-bold text-xs rounded-lg hover:bg-[#002855] transition-all shadow-xs"
        >
          <FileText className="w-4 h-4" />
          <span>Trámites del Proyecto</span>
        </Link>
      </div>

      {/* Pestañas de Navegación */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-8 text-sm font-semibold">
          <button
            type="button"
            onClick={() => onTabChange?.("detalle")}
            className={`pb-3 border-b-2 transition-all ${
              activeTab === "detalle"
                ? "border-[#002855] text-[#002855] font-bold"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Detalle del Proyecto
          </button>
          <button
            type="button"
            onClick={() => onTabChange?.("ejecucion")}
            className={`pb-3 border-b-2 transition-all ${
              activeTab === "ejecucion"
                ? "border-[#002855] text-[#002855] font-bold"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Ejecución Presupuestaria
          </button>
        </nav>
      </div>
    </div>
  );
}
