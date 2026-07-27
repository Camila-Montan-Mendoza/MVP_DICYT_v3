"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SigefiShell } from "@/components/sigefi-shell";
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  MessageSquare,
  CheckCircle2,
  CreditCard,
  Inbox,
  FilterX
} from "lucide-react";
import { tramiteDBRepository, TramiteDBItem } from "@/lib/db/tramite-repository";

export default function ListaTramitesPage() {
  const router = useRouter();

  // Dynamic DB dataset
  const [tramitesList, setTramitesList] = useState<TramiteDBItem[]>([]);

  // 4 Filters from Mockup
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoTramiteFilter, setTipoTramiteFilter] = useState("Todos los tipos");
  const [proyectoFilter, setProyectoFilter] = useState("Todos los proyectos");
  const [pasoActualFilter, setPasoActualFilter] = useState("Cualquier paso");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    tramiteDBRepository.getTramites().then((items) => {
      setTramitesList(items);
    });
  }, []);

  // Dropdown options
  const uniqueTipos = useMemo(() => {
    const tipos = Array.from(new Set(tramitesList.map((t) => t.tipoTramite)));
    return ["Todos los tipos", ...tipos];
  }, [tramitesList]);

  const uniqueProyectos = useMemo(() => {
    const proyectos = Array.from(new Set(tramitesList.map((t) => t.proyecto)));
    return ["Todos los proyectos", ...proyectos];
  }, [tramitesList]);

  const uniquePasos = [
    "Cualquier paso",
    "Paso 1/4: Solicitud",
    "Paso 2/4: Recepcion de Material",
    "Paso 3/4: Pago a Proveedor",
    "Paso 4/4: Completado",
  ];

  // Helper to format step badge text & style
  const getPasoInfo = (item: TramiteDBItem) => {
    const num = item.pasoNumero || 1;
    const totalPasos = 4;
    let label = `Paso ${num}/${totalPasos}: ${item.pasoNombre || "Solicitud"}`;
    if (num === 2) label = `Paso 2/4: Recepción de Material`;
    if (num === 3) label = `Paso 3/4: Pago a Proveedor`;
    if (num === 4 || item.estado === "Aprobado") label = `Paso 4/4: Completado`;

    return {
      num,
      label,
      isCompletado: num === 4 || item.estado === "Aprobado",
    };
  };

  // Filtering Logic
  const filteredData = useMemo(() => {
    return tramitesList.filter((t) => {
      // Filter 1: Buscar (Proyecto o Código)
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const matchesProyecto = t.proyecto.toLowerCase().includes(q);
        const matchesCodigo = t.codigoSeguimiento.toLowerCase().includes(q);
        const matchesCreador = t.creador.toLowerCase().includes(q);
        if (!matchesProyecto && !matchesCodigo && !matchesCreador) return false;
      }

      // Filter 2: Tipo de Trámite
      if (tipoTramiteFilter !== "Todos los tipos") {
        if (t.tipoTramite.toLowerCase() !== tipoTramiteFilter.toLowerCase()) return false;
      }

      // Filter 3: Proyecto
      if (proyectoFilter !== "Todos los proyectos") {
        if (t.proyecto.toLowerCase() !== proyectoFilter.toLowerCase()) return false;
      }

      // Filter 4: Paso Actual
      if (pasoActualFilter !== "Cualquier paso") {
        const pasoInfo = getPasoInfo(t);
        if (pasoActualFilter === "Paso 1/4: Solicitud" && pasoInfo.num !== 1) return false;
        if (pasoActualFilter === "Paso 2/4: Recepcion de Material" && pasoInfo.num !== 2) return false;
        if (pasoActualFilter === "Paso 3/4: Pago a Proveedor" && pasoInfo.num !== 3) return false;
        if (pasoActualFilter === "Paso 4/4: Completado" && !pasoInfo.isCompletado) return false;
      }

      return true;
    });
  }, [tramitesList, searchTerm, tipoTramiteFilter, proyectoFilter, pasoActualFilter]);

  // Pagination bounds
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
        {/* Cabecera Principal (Título y Botón "+ Agregar tramite" Fiel al Mockup) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#001B47] tracking-tight">
            Lista de Trámites
          </h1>

          <Link
            href="/tramites/nuevo"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#002855] text-white font-bold text-xs rounded-full hover:bg-[#001B47] transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            Agregar tramite
          </Link>
        </div>

        {/* Barra de Filtros en Fila (BUSCAR, TIPO DE TRÁMITE, PROYECTO, PASO ACTUAL) */}
        <div className="bg-white p-4 rounded-xl border border-[#e5e7eb] shadow-2xs space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* 1. BUSCAR */}
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

            {/* 2. TIPO DE TRÁMITE */}
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

            {/* 3. PROYECTO */}
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
                className="w-full p-2 text-xs bg-white border border-[#e5e7eb] rounded-lg text-[#2c3e50] font-medium focus:outline-none focus:ring-1 focus:ring-[#002855]"
              >
                {uniqueProyectos.map((p, idx) => (
                  <option key={idx} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. PASO ACTUAL */}
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
                {uniquePasos.map((paso, idx) => (
                  <option key={idx} value={paso}>
                    {paso}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Limpiar Filtros si hay alguno activo */}
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

        {/* Tabla Fiel al Mockup (7 Columnas: Nº, PROYECTO, TIPO DE TRÁMITE, FECHA, PASO ACTUAL, CREADOR, ACCIÓN) */}
        <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-2xs overflow-hidden">
          {totalItems === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-14 h-14 bg-slate-100 text-[#64748b] rounded-full flex items-center justify-center mx-auto">
                <Inbox className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-base text-[#001B47]">No se encontraron trámites</h3>
              <p className="text-xs text-[#6b7280] max-w-sm mx-auto leading-relaxed">
                Pruebe ajustando o limpiando los filtros de búsqueda.
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
                      <th className="py-3.5 px-4 w-12 text-center">Nº</th>
                      <th className="py-3.5 px-5">PROYECTO</th>
                      <th className="py-3.5 px-5">TIPO DE TRÁMITE</th>
                      <th className="py-3.5 px-5">FECHA</th>
                      <th className="py-3.5 px-5">PASO ACTUAL</th>
                      <th className="py-3.5 px-5">CREADOR</th>
                      <th className="py-3.5 px-5 text-center">ACCIÓN</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e5e7eb] text-xs">
                    {currentItems.map((tramite, index) => {
                      const pasoInfo = getPasoInfo(tramite);
                      const isAtender = tramite.requiereAccion || pasoInfo.num === 2;

                      return (
                        <tr
                          key={tramite.id}
                          className="hover:bg-[#f8fafc] transition-colors"
                        >
                          {/* 1. Nº */}
                          <td className="py-4 px-4 text-center font-mono font-semibold text-[#64748b]">
                            {tramite.nro || `${index + 1}`.padStart(2, "0")}
                          </td>

                          {/* 2. PROYECTO */}
                          <td className="py-4 px-5 max-w-xs">
                            <div className="font-extrabold text-[#001B47] text-sm leading-snug">
                              {tramite.proyecto}
                            </div>
                            <div className="text-[11px] text-[#9ca3af] font-mono mt-0.5">
                              {tramite.codigoSeguimiento}
                            </div>
                          </td>

                          {/* 3. TIPO DE TRÁMITE */}
                          <td className="py-4 px-5 text-[#2c3e50] font-medium text-xs">
                            {tramite.tipoTramite}
                          </td>

                          {/* 4. FECHA */}
                          <td className="py-4 px-5 text-[#2c3e50] text-xs whitespace-nowrap font-mono">
                            {tramite.fecha}
                          </td>

                          {/* 5. PASO ACTUAL (Badges Pill según Mockup) */}
                          <td className="py-4 px-5 whitespace-nowrap">
                            {pasoInfo.isCompletado ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full border border-emerald-200 shadow-2xs">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                {pasoInfo.label}
                              </span>
                            ) : pasoInfo.num === 1 ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 text-[11px] font-bold rounded-full border border-amber-300 shadow-2xs">
                                <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                                {pasoInfo.label}
                              </span>
                            ) : pasoInfo.num === 2 ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-900 text-[11px] font-bold rounded-full border border-orange-200 shadow-2xs">
                                <MessageSquare className="w-3.5 h-3.5 text-orange-700" />
                                {pasoInfo.label}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-900 text-[11px] font-bold rounded-full border border-orange-200 shadow-2xs">
                                <CreditCard className="w-3.5 h-3.5 text-orange-700" />
                                {pasoInfo.label}
                              </span>
                            )}
                          </td>

                          {/* 6. CREADOR */}
                          <td className="py-4 px-5 text-[#2c3e50] font-medium text-xs">
                            {tramite.creador}
                          </td>

                          {/* 7. ACCIÓN (Botón ATENDER vs VER DETALLE) */}
                          <td className="py-4 px-5 text-center whitespace-nowrap">
                            {isAtender ? (
                              <button
                                type="button"
                                onClick={() => router.push(`/tramites/${tramite.id}`)}
                                className="px-4 py-1.5 bg-[#002855] text-white text-xs font-bold rounded-lg hover:bg-[#001B47] transition-all shadow-xs"
                              >
                                ATENDER
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => router.push(`/tramites/${tramite.id}`)}
                                className="px-3 py-1.5 bg-white border border-[#cbd5e1] text-[#002855] text-xs font-bold rounded-lg hover:bg-slate-50 transition-all shadow-2xs"
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

              {/* Pie de Tabla Fiel al Mockup ("Mostrando 1-4 de 24 trámites") */}
              <div className="p-4 bg-[#f8fafc] border-t border-[#e5e7eb] flex items-center justify-between text-xs text-[#6b7280]">
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
