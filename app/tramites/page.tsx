"use client";

import { useState } from "react";
import Link from "next/link";
import { SigefiShell } from "@/components/sigefi-shell";
import { Search, Plus } from "lucide-react";

interface TramiteListItem {
  id: string;
  proyecto: string;
  tipoTramite: string;
  estado: "Rechazado" | "Aprobado" | "Pendiente";
}

export default function TramitesListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState("TODOS");

  const [tramites] = useState<TramiteListItem[]>([
    {
      id: "1",
      proyecto: "Sistema de Riego Inteligente",
      tipoTramite: "Contratación de servicios",
      estado: "Rechazado",
    },
    {
      id: "2",
      proyecto: "Laboratorio de Biotecnología",
      tipoTramite: "Contratación de servicios",
      estado: "Aprobado",
    },
    {
      id: "3",
      proyecto: "Sistema de Riego Inteligente",
      tipoTramite: "Compra directa",
      estado: "Pendiente",
    },
  ]);

  const filteredTramites = tramites.filter((t) => {
    const matchesSearch = t.proyecto.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = tipoFilter === "TODOS" || t.tipoTramite === tipoFilter;
    return matchesSearch && matchesTipo;
  });

  const getBadgeStyle = (estado: string) => {
    switch (estado) {
      case "Rechazado":
        return "bg-red-100 text-red-700 font-bold border border-red-200";
      case "Aprobado":
        return "bg-emerald-100 text-emerald-700 font-bold border border-emerald-200";
      case "Pendiente":
        return "bg-gray-200 text-gray-700 font-bold border border-gray-300";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <SigefiShell>
      <div className="space-y-6">
        {/* Título de la vista */}
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#001B47] tracking-tight">
          Lista de Trámites
        </h1>

        {/* Barra de Búsqueda y Botón de Acción */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#9ca3af] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por proyecto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#002855] text-[#2c3e50]"
              />
            </div>

            <select
              value={tipoFilter}
              onChange={(e) => setTipoFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-white border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#002855] text-[#6b7280]"
            >
              <option value="TODOS">Todos los tipos</option>
              <option value="Contratación de servicios">Contratación de servicios</option>
              <option value="Compra directa">Compra directa</option>
            </select>
          </div>

          <Link
            href="/tramites/nuevo"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#002855] text-white text-xs font-bold rounded-lg hover:bg-[#001B47] transition-colors shadow-xs w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            Crear trámite
          </Link>
        </div>

        {/* Tabla de Trámites estilo Mockup lista_tramites.png */}
        <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-[#e5e7eb] text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">
                  <th className="py-3 px-6">PROYECTO</th>
                  <th className="py-3 px-6">TIPO DE TRÁMITE</th>
                  <th className="py-3 px-6 text-right">ESTADO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e7eb] text-xs font-medium text-[#2c3e50]">
                {filteredTramites.map((t) => (
                  <tr key={t.id} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="py-4 px-6 font-semibold text-[#001B47]">{t.proyecto}</td>
                    <td className="py-4 px-6 text-[#6b7280]">{t.tipoTramite}</td>
                    <td className="py-4 px-6 text-right">
                      <span className={`inline-block px-3 py-1 text-[11px] rounded-full ${getBadgeStyle(t.estado)}`}>
                        {t.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SigefiShell>
  );
}
