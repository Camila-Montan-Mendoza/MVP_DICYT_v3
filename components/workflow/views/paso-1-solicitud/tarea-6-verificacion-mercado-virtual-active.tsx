"use client";

import { useState, useMemo, useEffect } from "react";
import { TaskViewProps } from "../view-types";
import { Eye, CheckCircle2, XCircle, Loader2, ChevronDown, ChevronUp, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ProveedorSIGEP {
  nombre: string;
  nit: string;
  cantidadDisponible: number;
  precioUnitario: number;
}

export default function Tarea6VerificacionMercadoVirtualActive({
  tarea,
  tramite,
  ejecutarTransicion,
}: TaskViewProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({ 0: true });
  const [itemStatuses, setItemStatuses] = useState<
    Record<number, "PENDIENTE" | "ENCONTRADO" | "NO_ENCONTRADO">
  >({});
  const [assignedProviders, setAssignedProviders] = useState<Record<number, ProveedorSIGEP>>({});

  // Dynamic Providers fetched directly from Supabase 'proveedor' table (Zero mock data policy)
  const [dbProviders, setDbProviders] = useState<ProveedorSIGEP[]>([]);

  useEffect(() => {
    const loadDbProviders = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.from("proveedor").select("*");
        if (data && data.length > 0) {
          setDbProviders(
            data.map((p: any) => ({
              nombre: p.nombre,
              nit: p.nit,
              cantidadDisponible: 10,
              precioUnitario: 0,
            }))
          );
        }
      } catch (err) {
        console.error("[loadDbProviders Error]:", err);
      }
    };
    loadDbProviders();
  }, []);

  // Modal State for Provider Registration
  const [activeModalItemIdx, setActiveModalItemIdx] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [providerForm, setProviderForm] = useState<ProveedorSIGEP>({
    nombre: "",
    nit: "",
    cantidadDisponible: 1,
    precioUnitario: 0,
  });

  // Modal State for Provider View
  const [viewProviderModalIdx, setViewProviderModalIdx] = useState<number | null>(null);

  // Feedback State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  const rawItems = (tramite as any)?.items || [];

  const toggleItem = (idx: number) => {
    setExpandedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Dynamically filtered providers from PostgreSQL 'proveedor' table + already assigned providers
  const catalogSuggestions = useMemo(() => {
    const existing = Object.values(assignedProviders);
    const all = [...existing, ...dbProviders];

    if (!searchQuery.trim()) return all;

    return all.filter(
      (p) =>
        p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) || p.nit.includes(searchQuery)
    );
  }, [assignedProviders, dbProviders, searchQuery]);

  const handleStatusChange = (
    idx: number,
    status: "PENDIENTE" | "ENCONTRADO" | "NO_ENCONTRADO"
  ) => {
    setItemStatuses((prev) => ({ ...prev, [idx]: status }));
    if (status === "ENCONTRADO" && !assignedProviders[idx]) {
      const defaultPrice = rawItems[idx]?.precioUnitario || rawItems[idx]?.precioReferencial || 0;
      setSearchQuery("");
      setProviderForm({
        nombre: "",
        nit: "",
        cantidadDisponible: rawItems[idx]?.cantidad || 1,
        precioUnitario: defaultPrice,
      });
      setActiveModalItemIdx(idx);
    }
  };

  const handleOpenAssignModal = (idx: number) => {
    const existing = assignedProviders[idx];
    const defaultPrice = rawItems[idx]?.precioUnitario || rawItems[idx]?.precioReferencial || 0;
    setSearchQuery(existing?.nombre || "");
    setProviderForm(
      existing || {
        nombre: "",
        nit: "",
        cantidadDisponible: rawItems[idx]?.cantidad || 1,
        precioUnitario: defaultPrice,
      }
    );
    setActiveModalItemIdx(idx);
  };

  const handleSelectSuggestion = (p: ProveedorSIGEP) => {
    setSearchQuery(p.nombre);
    setProviderForm((prev) => ({
      ...prev,
      nombre: p.nombre,
      nit: p.nit,
      cantidadDisponible: p.cantidadDisponible || prev.cantidadDisponible,
      precioUnitario: p.precioUnitario || prev.precioUnitario,
    }));
  };

  const handleSaveProvider = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeModalItemIdx === null) return;
    const finalName = searchQuery.trim() || providerForm.nombre.trim();
    if (!finalName || !providerForm.nit.trim()) return;

    setAssignedProviders((prev) => ({
      ...prev,
      [activeModalItemIdx]: {
        ...providerForm,
        nombre: finalName,
      },
    }));
    setItemStatuses((prev) => ({ ...prev, [activeModalItemIdx]: "ENCONTRADO" }));
    setActiveModalItemIdx(null);
  };

  const handleUnassignProvider = (idx: number) => {
    setAssignedProviders((prev) => {
      const copy = { ...prev };
      delete copy[idx];
      return copy;
    });
    setItemStatuses((prev) => ({ ...prev, [idx]: "PENDIENTE" }));
  };

  const totalGeneral = rawItems.reduce(
    (acc: number, item: any) =>
      acc +
      (item.total || (item.cantidad || 1) * (item.precioUnitario || item.precioReferencial || 0)),
    0
  );

  const acciones = tarea.accionesDisponibles || [];
  const transicionCotizaciones =
    acciones.find(
      (a) => a.idEstadoDestino === 7 || a.nombreAccion.toLowerCase().includes("cotiz")
    ) || acciones[0];

  const transicionAdjudicarMV =
    acciones.find(
      (a) => a.idEstadoDestino === 9 || a.nombreAccion.toLowerCase().includes("adjudic")
    ) || acciones[0];

  const handleFinalizarRevision = async () => {
    if (!ejecutarTransicion) return;

    // Determinar si hay algún ítem que NO exista en Mercado Virtual y requiera cotizaciones
    const requiereCotizaciones = Object.values(itemStatuses).some(
      (st) => st === "NO_ENCONTRADO" || st === "PENDIENTE"
    );

    const transicionElegida = requiereCotizaciones ? transicionCotizaciones : transicionAdjudicarMV;

    if (!transicionElegida) return;

    setIsSubmitting(true);
    setFeedback(null);

    const summary = Object.entries(itemStatuses)
      .map(([idx, st]) => `Ítem ${Number(idx) + 1}: ${st}`)
      .join(", ");

    const res = await ejecutarTransicion(
      transicionElegida.idTransicion,
      `Revisión Mercado Virtual realizada. ${summary}`
    );
    setIsSubmitting(false);

    if (res.success) {
      setFeedback({
        type: "success",
        message: res.message || "Revisión en Mercado Virtual completada exitosamente.",
      });
    } else {
      setFeedback({ type: "error", message: res.message || "Error al registrar la revisión." });
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs ${
            feedback.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-900"
              : "bg-red-50 border border-red-200 text-red-900"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Tarjeta Principal */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-2xs space-y-6">
        <h2 className="text-lg font-bold text-[#001B47] text-center tracking-tight">
          Revisión Mercado Virtual
        </h2>

        {/* Tabla de Ítems */}
        <div className="border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[#001B47] font-extrabold border-b border-slate-200 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="p-3.5 pl-4">ÍTEM</th>
                <th className="p-3.5 text-center">CANT.</th>
                <th className="p-3.5 text-right">P/U</th>
                <th className="p-3.5 text-right">PRECIO REF.</th>
                <th className="p-3.5 text-center">MERCADO VIRTUAL</th>
                <th className="p-3.5 text-center">PROVEEDOR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {rawItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-400 text-xs italic">
                    Sin ítems registrados para este trámite.
                  </td>
                </tr>
              ) : (
                rawItems.map((item: any, idx: number) => {
                  const isExpanded = Boolean(expandedItems[idx]);
                  const status = itemStatuses[idx] || "PENDIENTE";
                  const provider = assignedProviders[idx];

                  return (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      {/* Ítem */}
                      <td className="p-3.5 pl-4 align-middle">
                        <button
                          onClick={() => toggleItem(idx)}
                          className="flex items-center gap-2 font-medium text-[#001B47] hover:text-[#002855] text-left"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          )}
                          <span>{item.descripcion || item.nombre}</span>
                        </button>
                        {isExpanded &&
                          (item.especificacion || item.especificacionesTecnicasTexto) && (
                            <div className="pl-5 pt-1 text-[10px] font-mono text-slate-500 leading-relaxed">
                              {item.especificacion || item.especificacionesTecnicasTexto}
                            </div>
                          )}
                      </td>

                      {/* Cant. */}
                      <td className="p-3.5 align-middle text-center font-medium">
                        {item.cantidad || 1}
                      </td>

                      {/* P/U */}
                      <td className="p-3.5 align-middle text-right font-mono">
                        {Number(item.precioUnitario || item.precioReferencial || 0).toLocaleString(
                          "es-BO",
                          {
                            minimumFractionDigits: 2,
                          }
                        )}{" "}
                        Bs
                      </td>

                      {/* Precio Ref */}
                      <td className="p-3.5 align-middle text-right font-mono font-medium">
                        {Number(
                          item.total ||
                            (item.cantidad || 1) *
                              (item.precioUnitario || item.precioReferencial || 0)
                        ).toLocaleString("es-BO", { minimumFractionDigits: 2 })}{" "}
                        Bs
                      </td>

                      {/* Mercado Virtual */}
                      <td className="p-3.5 align-middle text-center">
                        <select
                          value={status}
                          onChange={(e) =>
                            handleStatusChange(
                              idx,
                              e.target.value as "PENDIENTE" | "ENCONTRADO" | "NO_ENCONTRADO"
                            )
                          }
                          className={`text-xs font-bold px-3 py-1 rounded-full border focus:outline-none transition-colors cursor-pointer inline-flex items-center gap-1 ${
                            status === "ENCONTRADO"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                              : status === "NO_ENCONTRADO"
                                ? "bg-red-50 text-red-800 border-red-300"
                                : "bg-slate-100 text-slate-700 border-slate-300"
                          }`}
                        >
                          <option value="PENDIENTE">Pendiente ▾</option>
                          <option value="ENCONTRADO">Encontrado ▾</option>
                          <option value="NO_ENCONTRADO">No encontrado ▾</option>
                        </select>
                      </td>

                      {/* Proveedor */}
                      <td className="p-3.5 align-middle text-center">
                        {status === "ENCONTRADO" ? (
                          provider ? (
                            <div className="bg-white border border-slate-200 rounded-xl p-2.5 text-left flex items-center justify-between gap-3 min-w-[210px] mx-auto shadow-2xs">
                              <div className="truncate">
                                <p className="font-bold text-[11px] text-[#001B47] uppercase truncate">
                                  {provider.nombre}
                                </p>
                                <p className="text-[10px] text-slate-400 font-mono">
                                  NIT: {provider.nit}
                                </p>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => setViewProviderModalIdx(idx)}
                                  className="p-1 text-slate-500 hover:text-[#002855] hover:bg-slate-100 rounded-md transition-colors"
                                  title="Ver detalle del proveedor"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUnassignProvider(idx)}
                                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                                  title="Desasignar proveedor"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleOpenAssignModal(idx)}
                              className="px-3.5 py-1.5 bg-[#001B47] text-white text-[11px] font-bold rounded-lg hover:bg-[#002855] transition-colors shadow-2xs"
                            >
                              Asignar proveedor
                            </button>
                          )
                        ) : (
                          <span className="text-slate-400 text-xs italic">Sin asignar</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {rawItems.length > 0 && (
              <tfoot className="bg-white border-t border-slate-200 text-xs text-[#001B47]">
                <tr>
                  <td colSpan={3} className="p-3.5 text-right font-extrabold">
                    Total
                  </td>
                  <td className="p-3.5 text-right font-mono font-extrabold text-xs">
                    {totalGeneral.toLocaleString("es-BO", { minimumFractionDigits: 2 })} Bs
                  </td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Modal Registro de Proveedor SIGEP */}
      {activeModalItemIdx !== null && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-[#001B47]">
                {rawItems[activeModalItemIdx]?.descripcion || rawItems[activeModalItemIdx]?.nombre}
              </h3>
              <button
                onClick={() => setActiveModalItemIdx(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProvider} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  BUSCAR O CREAR PROVEEDOR
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setProviderForm((prev) => ({ ...prev, nombre: e.target.value }));
                  }}
                  placeholder="Escriba el nombre..."
                  className="w-full p-3 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001B47]"
                />
                {catalogSuggestions.length > 0 && (
                  <div className="mt-1 border border-slate-200 rounded-xl p-2 space-y-1.5 bg-white max-h-36 overflow-y-auto shadow-2xs">
                    {catalogSuggestions.map((s, sIdx) => (
                      <button
                        type="button"
                        key={sIdx}
                        onClick={() => handleSelectSuggestion(s)}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-50 transition-colors block"
                      >
                        <p className="font-extrabold text-[#001B47] text-xs uppercase truncate">
                          {s.nombre}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">NIT: {s.nit}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  NIT DEL PROVEEDOR
                </label>
                <input
                  type="text"
                  required
                  value={providerForm.nit}
                  onChange={(e) => setProviderForm({ ...providerForm, nit: e.target.value })}
                  placeholder="123456789"
                  className="w-full p-3 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001B47] font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    CANTIDAD DISPONIBLE
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={providerForm.cantidadDisponible}
                    onChange={(e) =>
                      setProviderForm({
                        ...providerForm,
                        cantidadDisponible: parseInt(e.target.value, 10) || 1,
                      })
                    }
                    className="w-full p-3 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001B47]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    PRECIO UNITARIO
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      value={providerForm.precioUnitario}
                      onChange={(e) =>
                        setProviderForm({
                          ...providerForm,
                          precioUnitario: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full p-3 pr-8 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001B47] font-mono"
                    />
                    <span className="absolute right-3 top-3 text-xs text-slate-400 font-medium">
                      Bs
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveModalItemIdx(null)}
                  className="text-xs font-bold text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#001B47] text-white font-bold text-xs rounded-xl hover:bg-[#002855] transition-colors shadow-sm"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Visualizar Proveedor */}
      {viewProviderModalIdx !== null && assignedProviders[viewProviderModalIdx] && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-5 border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-[#001B47]">
                {rawItems[viewProviderModalIdx]?.descripcion ||
                  rawItems[viewProviderModalIdx]?.nombre}
              </h3>
              <button
                onClick={() => setViewProviderModalIdx(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                  NOMBRE DEL PROVEEDOR
                </p>
                <p className="font-extrabold text-[#001B47] text-xs">
                  {assignedProviders[viewProviderModalIdx].nombre}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                  NIT DEL PROVEEDOR
                </p>
                <p className="font-bold text-[#001B47] text-xs font-mono">
                  {assignedProviders[viewProviderModalIdx].nit}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    CANTIDAD DISPONIBLE
                  </p>
                  <p className="font-bold text-[#001B47] text-xs">
                    {assignedProviders[viewProviderModalIdx].cantidadDisponible}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    PRECIO UNITARIO
                  </p>
                  <p className="font-bold text-[#001B47] text-xs font-mono">
                    {assignedProviders[viewProviderModalIdx].precioUnitario.toLocaleString(
                      "es-BO",
                      {
                        minimumFractionDigits: 2,
                      }
                    )}{" "}
                    Bs
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={handleFinalizarRevision}
          disabled={isSubmitting || acciones.length === 0}
          className="px-8 py-3 bg-[#001B47] text-white font-extrabold text-xs rounded-xl hover:bg-[#002855] transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Guardando...</span>
            </>
          ) : (
            <span>Revision realizada</span>
          )}
        </button>
      </div>
    </div>
  );
}
