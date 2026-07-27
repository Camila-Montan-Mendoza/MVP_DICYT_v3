"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SigefiShell } from "@/components/sigefi-shell";
import {
  Search,
  Plus,
  FilterX,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Inbox
} from "lucide-react";
import { tramitesStore, TramiteStoreItem } from "@/lib/store/tramites-store";

export default function ListaTramitesPage() {
  const router = useRouter();

  // Load store items dynamically
  const [tramitesList, setTramitesList] = useState<TramiteStoreItem[]>([]);
  const [searchProyecto, setSearchProyecto] = useState("");
  const [tipoTramiteFilter, setTipoTramiteFilter] = useState("Todos los tipos");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setTramitesList(tramitesStore.getTramites());
  }, []);

  // Extract unique tipos for dropdown options
  const uniqueTipos = useMemo(() => {
    const tipos = Array.from(new Set(tramitesList.map((t) => t.tipoTramite)));
    return ["Todos los tipos", ...tipos];
  }, [tramitesList]);

  // Filter dataset by project search and tipo de trámite
  const filteredData = useMemo(() => {
    return tramitesList.filter((t) => {
      if (searchProyecto.trim()) {
        const q = searchProyecto.toLowerCase().trim();
        if (!t.proyecto.toLowerCase().includes(q) && !t.codigoSeguimiento.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (tipoTramiteFilter !== "Todos los tipos") {
        if (t.tipoTramite.toLowerCase() !== tipoTramiteFilter.toLowerCase()) {
          return false;
        }
      }
      return true;
    });
  }, [tramitesList, searchProyecto, tipoTramiteFilter]);

  // Paginated items
  const totalItems = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const isFilterActive = searchProyecto.trim() !== "" || tipoTramiteFilter !== "Todos los tipos";

  const handleResetFilters = () => {
    setSearchProyecto("");
    setTipoTramiteFilter("Todos los tipos");
    setCurrentPage(1);
  };

  return (
    <SigefiShell>
      <div className="space-y-6 pb-12">
        {/* Cabecera Principal y Botón de Crear Trámite */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#001B47] tracking-tight">
              Lista de Trámites
            </h1>
            <p className="text-xs text-[#64748b] mt-0.5">
              Bandeja consolidada en tiempo real de todas las solicitudes registradas.
            </p>
          </div>

          <Link
            href="/tramites/nuevo"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#002855] text-white font-bold text-xs rounded-full hover:bg-[#001B47] transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            + Crear trámite
          </Link>
        </div>

        {/* Barra de Filtros Minimalista (Buscar por proyecto y Tipo de trámite) */}
        <div className="bg-white p-4 rounded-xl border border-[#e5e7eb] shadow-2xs space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Buscador de Texto (Buscar por proyecto) */}
            <div className="space-y-1">
              <label className="font-bold text-[11px] text-[#6b7280] uppercase tracking-wider block">
                BUSCAR POR PROYECTO
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#9ca3af] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por proyecto..."
                  value={searchProyecto}
                  onChange={(e) => {
                    setSearchProyecto(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-[#e5e7eb] rounded-lg text-[#2c3e50] focus:outline-none focus:ring-1 focus:ring-[#002855]"
                />
              </div>
            </div>

            {/* Selector de TIPO DE TRÁMITE */}
            <div className="space-y-1">
              <label className="font-bold text-[11px] text-[#6b7280] uppercase tracking-wider block">
                TIPO DE TRÁMITE
              </label>
              <select
                value={tipoTramiteFilter}
                onChange={(e) => {
                  setTipoTramiteFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full p-2 text-xs bg-white border border-[#e5e7eb] rounded-lg text-[#2c3e50] font-medium focus:outline-none focus:ring-1 focus:ring-[#002855]"
              >
                {uniqueTipos.map((t, idx) => (
                  <option key={idx} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Botón para Limpiar Filtros */}
          {isFilterActive && (
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-[#BC000C] bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
              >
                <FilterX className="w-3.5 h-3.5" />
                Limpiar Filtros
              </button>
            </div>
          )}
        </div>

        {/* Tabla Consolidada de 3 Columnas (PROYECTO, TIPO DE TRÁMITE, ESTADO) */}
        <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-2xs overflow-hidden">
          {totalItems === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-14 h-14 bg-slate-100 text-[#64748b] rounded-full flex items-center justify-center mx-auto">
                <Inbox className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-base text-[#001B47]">No hay trámites registrados</h3>
              <p className="text-xs text-[#6b7280] max-w-sm mx-auto leading-relaxed">
                {isFilterActive
                  ? "No se encontraron trámites coincidentes con los filtros de búsqueda."
                  : "Presione '+ Crear trámite' para iniciar su primera solicitud."}
              </p>
              {isFilterActive && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-[#002855] text-white text-xs font-bold rounded-lg hover:bg-[#001B47] transition-all shadow-xs"
                >
                  Restablecer Filtros
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f8fafc] border-b border-[#e5e7eb] text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">
                      <th className="py-3.5 px-5">PROYECTO</th>
                      <th className="py-3.5 px-5">TIPO DE TRÁMITE</th>
                      <th className="py-3.5 px-5 text-right">ESTADO</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e5e7eb] text-xs">
                    {currentItems.map((tramite) => {
                      const isAprobado = tramite.estado === "Aprobado";
                      const isObservado = tramite.estado === "Observado por Presupuestos" || tramite.estado === "Rechazado";

                      return (
                        <tr
                          key={tramite.id}
                          onClick={() => router.push(`/tramites/${tramite.id}`)}
                          className="hover:bg-[#f8fafc] transition-colors cursor-pointer group"
                        >
                          {/* Columna 1: PROYECTO */}
                          <td className="py-4 px-5">
                            <div className="font-extrabold text-[#001B47] text-sm group-hover:text-[#BC000C] transition-colors">
                              {tramite.proyecto}
                            </div>
                            <div className="text-[11px] text-[#64748b] font-mono mt-0.5 flex items-center gap-2">
                              <span>Código: <strong>{tramite.codigoSeguimiento}</strong></span>
                              <span>•</span>
                              <span>Solicitante: {tramite.creador}</span>
                            </div>
                          </td>

                          {/* Columna 2: TIPO DE TRÁMITE */}
                          <td className="py-4 px-5 text-[#2c3e50] font-semibold text-xs">
                            {tramite.tipoTramite}
                          </td>

                          {/* Columna 3: ESTADO */}
                          <td className="py-4 px-5 text-right whitespace-nowrap">
                            {isAprobado ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full border border-emerald-200 shadow-2xs">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                {tramite.estado}
                              </span>
                            ) : isObservado ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-800 text-[11px] font-bold rounded-full border border-red-200 shadow-2xs">
                                <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                                {tramite.estado}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100/90 text-amber-900 text-[11px] font-semibold rounded-full border border-amber-200 shadow-2xs">
                                <Clock className="w-3.5 h-3.5 text-amber-700" />
                                {tramite.estado}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pie de Tabla con Paginación y Contador */}
              <div className="p-4 bg-[#f8fafc] border-t border-[#e5e7eb] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6b7280]">
                <div>
                  Mostrando <strong className="text-[#001B47]">{startIndex + 1}</strong>-
                  <strong className="text-[#001B47]">{Math.min(startIndex + itemsPerPage, totalItems)}</strong> de{" "}
                  <strong className="text-[#001B47]">{totalItems}</strong> trámites
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                        : "bg-white text-[#001B47] border-[#cbd5e1] hover:bg-gray-50"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="px-3 py-1 font-bold text-xs text-[#001B47]">
                    Página {currentPage} de {totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                        : "bg-white text-[#001B47] border-[#cbd5e1] hover:bg-gray-50"
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </SigefiShell>
  );
}
