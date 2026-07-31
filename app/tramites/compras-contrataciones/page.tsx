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
  CheckCircle2,
  CreditCard,
  Inbox,
  FilterX,
  ShoppingCart,
} from "lucide-react";
import { tramiteDBRepository, TramiteDBItem } from "@/lib/db/tramite-repository";

export default function ComprasContratacionesPage() {
  const router = useRouter();

  // Dynamic DB dataset Compras
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
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const matchesProyecto = t.proyecto.toLowerCase().includes(q);
        const matchesCodigo = t.codigoSeguimiento.toLowerCase().includes(q);
        const matchesCreador = t.creador.toLowerCase().includes(q);
        if (!matchesProyecto && !matchesCodigo && !matchesCreador) return false;
      }

      if (tipoTramiteFilter !== "Todos los tipos") {
        if (t.tipoTramite.toLowerCase() !== tipoTramiteFilter.toLowerCase()) return false;
      }

      if (proyectoFilter !== "Todos los proyectos") {
        if (t.proyecto.toLowerCase() !== proyectoFilter.toLowerCase()) return false;
      }

      if (pasoActualFilter !== "Cualquier paso") {
        const pasoInfo = getPasoInfo(t);
        if (pasoInfo.label !== pasoActualFilter) return false;
      }

      return true;
    });
  }, [tramitesList, searchTerm, tipoTramiteFilter, proyectoFilter, pasoActualFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const isFilterActive =
    searchTerm !== "" ||
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
        {/* Cabecera Principal */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#001B47] text-white flex items-center justify-center shrink-0">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-[#001B47] tracking-tight">
                Lista de Compras / Contrataciones
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Trámites de adquisición de bienes, materiales y contratación de servicios.
              </p>
            </div>
          </div>

          <Link
            href="/tramites/nuevo"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#002855] text-white font-bold text-xs rounded-xl hover:bg-[#001B47] transition-all shadow-md self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar tramite</span>
          </Link>
        </div>

        {/* Barra de Filtros en Fila */}
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

        {/* Tabla de Trámites de Compra */}
        <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-2xs overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#f9fafb] text-[#6b7280] font-bold border-b border-[#e5e7eb]">
              <tr>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">
                  INFORMACIÓN DEL PROYECTO
                </th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">
                  PASO ACTUAL
                </th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">
                  MÉTRICAS DEL TRÁMITE
                </th>
                <th className="px-6 py-4 text-center font-semibold uppercase tracking-wider text-[11px]">
                  ACCIÓN
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e7eb] font-medium">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[#9ca3af]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Inbox className="w-8 h-8 text-slate-300" />
                      <p className="text-sm font-bold text-[#2c3e50]">No se encontraron trámites</p>
                      <p className="text-xs text-slate-400">
                        Pruebe cambiando los criterios de búsqueda o limpiando los filtros.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((item) => {
                  const pasoInfo = getPasoInfo(item);

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/60 transition-colors group cursor-pointer"
                      onClick={() => router.push(`/tramites/${item.id}`)}
                    >
                      <td className="px-6 py-5 align-top">
                        <div className="space-y-1">
                          <span className="font-extrabold text-[#002855] text-sm group-hover:underline block">
                            {item.proyecto}
                          </span>

                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#4b5563]">
                            <span className="font-bold text-[#001B47] bg-[#f0f4f8] px-2 py-0.5 rounded-md border border-[#d0e0f5]">
                              {item.codigoSeguimiento}
                            </span>
                            <span>•</span>
                            <span className="font-semibold text-slate-700">{item.tipoTramite}</span>
                          </div>

                          <div className="text-[11px] text-[#6b7280] pt-1">
                            Creado por:{" "}
                            <span className="font-semibold text-[#2c3e50]">{item.creador}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 align-top">
                        <div className="space-y-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                              pasoInfo.isCompletado
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : "bg-blue-50 text-[#002855] border border-blue-200"
                            }`}
                          >
                            {pasoInfo.isCompletado ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <AlertCircle className="w-3.5 h-3.5 text-[#002855]" />
                            )}
                            <span>{pasoInfo.label}</span>
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5 align-top">
                        <div className="space-y-1.5 text-xs">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-[#6b7280]">Monto Total:</span>
                            <span className="font-extrabold text-[#002855]">
                              {item.items
                                ? `${item.items
                                    .reduce(
                                      (sum, it) =>
                                        sum + (it.precioReferencial || 0) * (it.cantidad || 1),
                                      0
                                    )
                                    .toLocaleString("es-BO", {
                                      minimumFractionDigits: 2,
                                    })} Bs.`
                                : "0,00 Bs."}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 align-top text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/tramites/${item.id}`);
                          }}
                          className="px-4 py-2 bg-white border border-[#002855] text-[#002855] font-bold text-xs rounded-xl hover:bg-[#002855] hover:text-white transition-all shadow-2xs"
                        >
                          Ver Trámite
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-white border-t border-[#e5e7eb] flex items-center justify-between">
              <p className="text-xs text-[#6b7280]">
                Mostrando{" "}
                <span className="font-bold text-[#2c3e50]">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                a{" "}
                <span className="font-bold text-[#2c3e50]">
                  {Math.min(currentPage * itemsPerPage, filteredData.length)}
                </span>{" "}
                de <span className="font-bold text-[#2c3e50]">{filteredData.length}</span> trámites
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="p-2 border border-[#e5e7eb] rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-[#002855] px-2">
                  {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="p-2 border border-[#e5e7eb] rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </SigefiShell>
  );
}
