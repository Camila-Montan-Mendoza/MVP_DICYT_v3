"use client";

import { useState, useMemo } from "react";
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
  Inbox
} from "lucide-react";
import {
  MOCK_TRAMITES_CONSOLIDADOS,
  filterTramitesConsolidados,
} from "@/lib/tramites/consolidated-service";

export default function ListaTramitesConsolidadaPage() {
  const router = useRouter();

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoTramiteFilter, setTipoTramiteFilter] = useState("Todos los tipos");
  const [proyectoFilter, setProyectoFilter] = useState("Todos los proyectos");
  const [pasoActualFilter, setPasoActualFilter] = useState("Cualquier paso");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Extract unique projects and tipos for dropdown options
  const uniqueTipos = useMemo(() => {
    const tipos = Array.from(new Set(MOCK_TRAMITES_CONSOLIDADOS.map((t) => t.tipoTramite)));
    return ["Todos los tipos", ...tipos];
  }, []);

  const uniqueProyectos = useMemo(() => {
    const proyectos = Array.from(new Set(MOCK_TRAMITES_CONSOLIDADOS.map((t) => t.proyecto)));
    return ["Todos los proyectos", ...proyectos];
  }, []);

  const uniquePasos = [
    "Cualquier paso",
    "Paso 1",
    "Paso 2",
    "Paso 3",
    "Paso 4: Completado",
  ];

  // Filter dataset
  const filteredData = useMemo(() => {
    return filterTramitesConsolidados(MOCK_TRAMITES_CONSOLIDADOS, {
      search: searchTerm,
      tipoTramite: tipoTramiteFilter,
      proyecto: proyectoFilter,
      pasoActual: pasoActualFilter,
    });
  }, [searchTerm, tipoTramiteFilter, proyectoFilter, pasoActualFilter]);

  // Paginated items
  const totalItems = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const isFilterActive =
    searchTerm.trim() !== "" ||
    tipoTramiteFilter !== "Todos los tipos" ||
    proyectoFilter !== "Todos los proyectos" ||
    pasoActualFilter !== "Cualquier paso";

  const handleResetFilters = () => {
    setSearchTerm("");
    setTipoTramiteFilter("Todos los tipos");
    setProyectoFilter("Todos los proyectos");
    setPasoActualFilter("Cualquier paso");
    setCurrentPage(1);
  };

  return (
    <SigefiShell>
      <div className="space-y-6 pb-12">
        {/* Cabecera Principal y Botón de Acción Superior */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#001B47] tracking-tight">
              Lista de Trámites
            </h1>
          </div>

          <Link
            href="/tramites/nuevo"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#002855] text-white font-bold text-xs rounded-full hover:bg-[#001B47] transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            Agregar tramite
          </Link>
        </div>

        {/* Barra de Filtros Multi-criterio */}
        <div className="bg-white p-4 rounded-xl border border-[#e5e7eb] shadow-2xs space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* Filtro BUSCAR */}
            <div className="space-y-1">
              <label className="font-bold text-[11px] text-[#6b7280] uppercase tracking-wider block">
                BUSCAR
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#9ca3af] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Proyecto, código..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-[#e5e7eb] rounded-lg text-[#2c3e50] focus:outline-none focus:ring-1 focus:ring-[#002855]"
                />
              </div>
            </div>

            {/* Filtro TIPO DE TRÁMITE */}
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

            {/* Filtro PROYECTO */}
            <div className="space-y-1">
              <label className="font-bold text-[11px] text-[#6b7280] uppercase tracking-wider block">
                PROYECTO
              </label>
              <select
                value={proyectoFilter}
                onChange={(e) => {
                  setProyectoFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full p-2 text-xs bg-white border border-[#e5e7eb] rounded-lg text-[#2c3e50] font-medium focus:outline-none focus:ring-1 focus:ring-[#002855] truncate"
              >
                {uniqueProyectos.map((p, idx) => (
                  <option key={idx} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro PASO ACTUAL */}
            <div className="space-y-1">
              <label className="font-bold text-[11px] text-[#6b7280] uppercase tracking-wider block">
                PASO ACTUAL
              </label>
              <select
                value={pasoActualFilter}
                onChange={(e) => {
                  setPasoActualFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full p-2 text-xs bg-white border border-[#e5e7eb] rounded-lg text-[#2c3e50] font-medium focus:outline-none focus:ring-1 focus:ring-[#002855]"
              >
                {uniquePasos.map((p, idx) => (
                  <option key={idx} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Botón de Limpiar Filtros */}
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

        {/* Tabla Consolidada de Trámites */}
        <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-2xs overflow-hidden">
          {totalItems === 0 ? (
            /* Estado Vacío (Empty State) */
            <div className="p-12 text-center space-y-3">
              <div className="w-14 h-14 bg-slate-100 text-[#64748b] rounded-full flex items-center justify-center mx-auto">
                <Inbox className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-base text-[#001B47]">No se encontraron trámites</h3>
              <p className="text-xs text-[#6b7280] max-w-sm mx-auto leading-relaxed">
                No existen trámites que coincidan con los criterios de búsqueda seleccionados.
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
                      <th className="py-3 px-4 w-12 text-center">Nº</th>
                      <th className="py-3 px-4">PROYECTO</th>
                      <th className="py-3 px-4">TIPO DE TRÁMITE</th>
                      <th className="py-3 px-4">FECHA</th>
                      <th className="py-3 px-4">PASO ACTUAL</th>
                      <th className="py-3 px-4">CREADOR</th>
                      <th className="py-3 px-4 text-center">ACCIÓN</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e5e7eb] text-xs">
                    {currentItems.map((tramite) => {
                      const isCompletado = tramite.estadoGeneral === "COMPLETADO";

                      return (
                        <tr
                          key={tramite.id}
                          className="hover:bg-[#f8fafc] transition-colors cursor-pointer"
                          onClick={() => router.push(`/tramites/nuevo`)}
                        >
                          {/* Nº */}
                          <td className="py-4 px-4 text-center font-bold text-[#64748b]">
                            {tramite.nro}
                          </td>

                          {/* PROYECTO */}
                          <td className="py-4 px-4 font-extrabold text-[#001B47] max-w-xs leading-snug">
                            {tramite.proyecto}
                          </td>

                          {/* TIPO DE TRÁMITE */}
                          <td className="py-4 px-4 text-[#2c3e50] font-medium">
                            {tramite.tipoTramite}
                          </td>

                          {/* FECHA */}
                          <td className="py-4 px-4 text-[#64748b] whitespace-nowrap">
                            {tramite.fecha}
                          </td>

                          {/* PASO ACTUAL (Badge Dinámico de Avance) */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            {isCompletado ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                {tramite.pasoActualEtiqueta}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100/90 text-amber-900 text-[11px] font-semibold rounded-full border border-amber-200">
                                <Clock className="w-3.5 h-3.5 text-amber-700" />
                                {tramite.pasoActualEtiqueta}
                              </span>
                            )}
                          </td>

                          {/* CREADOR */}
                          <td className="py-4 px-4 text-[#2c3e50] font-medium">
                            {tramite.creador}
                          </td>

                          {/* ACCIÓN (Boton ATENDER vs VER DETALLE) */}
                          <td className="py-4 px-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            {tramite.requiereAccion ? (
                              <button
                                type="button"
                                onClick={() => router.push(`/tramites/nuevo`)}
                                className="px-4 py-1.5 bg-[#002855] text-white font-bold text-xs rounded-lg hover:bg-[#001B47] transition-all shadow-xs uppercase tracking-wider"
                              >
                                ATENDER
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => router.push(`/tramites/nuevo`)}
                                className="px-3.5 py-1.5 bg-white border border-[#cbd5e1] text-[#2c3e50] font-semibold text-xs rounded-lg hover:bg-slate-50 transition-all uppercase tracking-wider"
                              >
                                VER DETALLE
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pie de Tabla con Contador y Paginador */}
              <div className="p-4 bg-[#f8fafc] border-t border-[#e5e7eb] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6b7280]">
                <div>
                  Mostrando <strong className="text-[#001B47]">{startIndex + 1}</strong>-
                  <strong className="text-[#001B47]">{Math.min(startIndex + itemsPerPage, totalItems)}</strong> de{" "}
                  <strong className="text-[#001B47]">{totalItems}</strong> trámites
                </div>

                {/* Controles de Paginación */}
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
