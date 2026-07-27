"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SigefiShell } from "@/components/sigefi-shell";
import {
  Search,
  Monitor,
  Settings,
  Package,
  Trash2,
  ChevronDown,
  ChevronUp,
  FileUp,
  X,
  CheckCircle2,
  Paperclip,
  UserCheck,
  MapPin,
  FileText,
  Plus,
  Send,
  AlertCircle,
  Clock,
  Layers
} from "lucide-react";
import { uploadAttachmentFile } from "@/lib/supabase/storage";
import { CLASIFICADOR_OBJETO_GASTO, PartidaObjetoGasto } from "@/lib/requisitions/clasificador-objeto-gasto";
import { ItemCategoria } from "@/types/requisitions";

// Item model
interface ItemData {
  id: string;
  nombre: string;
  categoria: ItemCategoria;
  cantidad: number;
  unidad?: string;
  precioUnitario?: number;
  precioReferencial: number;
  detalleServicio?: string;
  partidaPresupuestaria: string;
  partidaNombre?: string;
  documentotecnicoNombre?: string;
  documentotecnicoPath?: string;
}

// Requisition Draft Model (Each category has its OWN independent header, justification, and submit state)
interface TramiteBorrador {
  categoria: ItemCategoria;
  titulo: string;
  justificacion: string;
  custodioNombre: string;
  custodioUbicacion: string;
  proformas: Array<{ id: string; nombre: string }>;
  estado: "BORRADOR" | "ENVIADO" | "ERROR_VALIDACION";
  codigoSeguimiento?: string;
  errores: string[];
}

export default function FormulacionRequerimientosPage() {
  const router = useRouter();

  const [proyecto, setProyecto] = useState("Implementación de IA para la Agricultura");

  // Items list starts EMPTY per user request (items = [])
  const [items, setItems] = useState<ItemData[]>([]);

  // Search & Autocomplete catalog
  const [catalogSearch, setCatalogSearch] = useState("");
  const [showCatalogDropdown, setShowCatalogDropdown] = useState(false);

  // Independent Requisition Headers by Category
  const [headers, setHeaders] = useState<Record<ItemCategoria, TramiteBorrador>>({
    ACTIVO_FIJO: {
      categoria: "ACTIVO_FIJO",
      titulo: "Trámite de Activos Fijos",
      justificacion: "",
      custodioNombre: "",
      custodioUbicacion: "",
      proformas: [],
      estado: "BORRADOR",
      errores: [],
    },
    MATERIAL: {
      categoria: "MATERIAL",
      titulo: "Trámite de Materiales y Suministros",
      justificacion: "",
      custodioNombre: "",
      custodioUbicacion: "",
      proformas: [],
      estado: "BORRADOR",
      errores: [],
    },
    SERVICIO: {
      categoria: "SERVICIO",
      titulo: "Trámite de Servicios No Personales",
      justificacion: "",
      custodioNombre: "",
      custodioUbicacion: "",
      proformas: [],
      estado: "BORRADOR",
      errores: [],
    },
  });

  // Modal / Overlay State for item editing
  const [selectedItem, setSelectedItem] = useState<ItemData | null>(null);

  // Toast / Feedback State
  const [batchSubmitting, setBatchSubmitting] = useState(false);
  const [lastSubmittedCode, setLastSubmittedCode] = useState<string | null>(null);

  // Categorized items
  const activosItems = items.filter((i) => i.categoria === "ACTIVO_FIJO");
  const materialesItems = items.filter((i) => i.categoria === "MATERIAL");
  const serviciosItems = items.filter((i) => i.categoria === "SERVICIO");

  // Determine active categories (Only categories WITH items will be rendered!)
  const activeCategories: ItemCategoria[] = [];
  if (activosItems.length > 0) activeCategories.push("ACTIVO_FIJO");
  if (materialesItems.length > 0) activeCategories.push("MATERIAL");
  if (serviciosItems.length > 0) activeCategories.push("SERVICIO");

  // Filter catalog items for search dropdown
  const filteredCatalog = CLASIFICADOR_OBJETO_GASTO.flatMap((p) =>
    p.ejemplosInsumos
      .filter((ej) => ej.toLowerCase().includes(catalogSearch.toLowerCase()) || p.denominacion.toLowerCase().includes(catalogSearch.toLowerCase()))
      .map((ejem) => ({
        ejemploNombre: ejem,
        partida: p,
      }))
  );

  const handleAddFromCatalog = (ejemploNombre: string, partida: PartidaObjetoGasto) => {
    const newItem: ItemData = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      nombre: `${partida.categoria === "SERVICIO" ? "SERVICIO" : partida.categoria === "ACTIVO_FIJO" ? "EQUIPO" : "MATERIAL"} | ${ejemploNombre.toUpperCase()}`,
      categoria: partida.categoria,
      cantidad: 1,
      unidad: partida.categoria === "SERVICIO" ? "Servicio" : "Unidad",
      precioUnitario: partida.categoria === "SERVICIO" ? 0 : 500,
      precioReferencial: partida.categoria === "SERVICIO" ? 0 : 500,
      partidaPresupuestaria: partida.codigo, // 5-digit deep code
      partidaNombre: partida.denominacion,
    };

    setItems((prev) => [...prev, newItem]);
    setCatalogSearch("");
    setShowCatalogDropdown(false);
  };

  const handleAddCustomItem = () => {
    if (!catalogSearch.trim()) return;
    const newItem: ItemData = {
      id: `item-${Date.now()}`,
      nombre: catalogSearch.toUpperCase(),
      categoria: "MATERIAL",
      cantidad: 1,
      unidad: "Unidad",
      precioUnitario: 100,
      precioReferencial: 100,
      partidaPresupuestaria: "39500",
      partidaNombre: "Útiles de Escritorio y Oficina",
    };
    setItems((prev) => [...prev, newItem]);
    setCatalogSearch("");
    setShowCatalogDropdown(false);
  };

  const removeItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleSaveModal = (updated: ItemData) => {
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    setSelectedItem(null);
  };

  const handleProformaUpload = async (cat: ItemCategoria, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const res = await uploadAttachmentFile(file, "proformas");
    setHeaders((prev) => ({
      ...prev,
      [cat]: {
        ...prev[cat],
        proformas: [...prev[cat].proformas, { id: `prof-${Date.now()}`, nombre: res.name }],
      },
    }));
  };

  // Validate a specific requisition
  const validateSingleRequisition = (cat: ItemCategoria): string[] => {
    const h = headers[cat];
    const catItems = items.filter((i) => i.categoria === cat);
    const errs: string[] = [];

    if (!h.justificacion.trim()) {
      errs.push("Debe ingresar la Justificación del Trámite.");
    }
    if (h.proformas.length === 0) {
      errs.push("Debe adjuntar al menos una proforma o cotización de respaldo.");
    }
    if (cat === "ACTIVO_FIJO") {
      if (!h.custodioNombre.trim()) {
        errs.push("Debe ingresar el Nombre del Custodio para Activos Fijos.");
      }
      if (!h.custodioUbicacion.trim()) {
        errs.push("Debe ingresar el Lugar / Laboratorio de Ubicación.");
      }
    }

    // Check item technical documents (ET / TDR)
    catItems.forEach((it) => {
      if (!it.documentotecnicoNombre) {
        errs.push(`El ítem '${it.nombre}' no tiene adjunto su documento obligatorio (${cat === "SERVICIO" ? "TDR PDF" : "ET PDF"}).`);
      }
    });

    return errs;
  };

  // Submit a Single Requisition independently
  const handleSubmitSingle = (cat: ItemCategoria) => {
    const errs = validateSingleRequisition(cat);
    if (errs.length > 0) {
      setHeaders((prev) => ({
        ...prev,
        [cat]: { ...prev[cat], estado: "ERROR_VALIDACION", errores: errs },
      }));
      return;
    }

    const trackingCode = `TR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setHeaders((prev) => ({
      ...prev,
      [cat]: {
        ...prev[cat],
        estado: "ENVIADO",
        codigoSeguimiento: trackingCode,
        errores: [],
      },
    }));

    setLastSubmittedCode(trackingCode);
    setTimeout(() => setLastSubmittedCode(null), 4000);
  };

  // Resilient Batch Submit ("Enviar Todos los Trámites") using Promise.allSettled
  const handleBatchSubmit = async () => {
    setBatchSubmitting(true);

    await Promise.allSettled(
      activeCategories.map(async (cat) => {
        if (headers[cat].estado === "ENVIADO") return;

        const errs = validateSingleRequisition(cat);
        if (errs.length > 0) {
          setHeaders((prev) => ({
            ...prev,
            [cat]: { ...prev[cat], estado: "ERROR_VALIDACION", errores: errs },
          }));
        } else {
          const trackingCode = `TR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
          setHeaders((prev) => ({
            ...prev,
            [cat]: {
              ...prev[cat],
              estado: "ENVIADO",
              codigoSeguimiento: trackingCode,
              errores: [],
            },
          }));
        }
      })
    );

    setBatchSubmitting(false);
  };

  return (
    <SigefiShell>
      <div className="space-y-6 max-w-4xl mx-auto pb-24">
        {/* Título de Formulación de Requerimientos */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#001B47] tracking-tight">
            Formulación de Requerimientos
          </h1>
          <p className="text-xs text-[#6b7280]">
            Agregue los ítems requeridos. El sistema generará dinámicamente trámites homogéneos separados por categoría de compra (Objeto del Gasto de 5 dígitos).
          </p>
        </div>

        {/* Dropdown de Selección de Proyecto */}
        <div className="space-y-1 bg-white p-4 rounded-xl border border-[#e5e7eb] shadow-2xs">
          <label className="text-xs font-bold text-[#001B47]">Proyecto:</label>
          <select
            value={proyecto}
            onChange={(e) => setProyecto(e.target.value)}
            className="w-full p-2.5 text-xs bg-white border border-[#e5e7eb] rounded-lg text-[#2c3e50] font-medium focus:outline-none focus:ring-1 focus:ring-[#002855]"
          >
            <option value="Implementación de IA para la Agricultura">
              Implementación de IA para la Agricultura
            </option>
            <option value="Sistema de Riego Inteligente">
              Sistema de Riego Inteligente
            </option>
            <option value="Laboratorio de Biotecnología">
              Laboratorio de Biotecnología
            </option>
          </select>
        </div>

        {/* Buscador de Ítems del Clasificador Objeto del Gasto */}
        <div className="relative">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#9ca3af] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar o escribir item (ej: Servidor GPU, Microscopio, Auditoría, Reactivos Químicos)..."
                value={catalogSearch}
                onFocus={() => setShowCatalogDropdown(true)}
                onChange={(e) => {
                  setCatalogSearch(e.target.value);
                  setShowCatalogDropdown(true);
                }}
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#002855] text-[#2c3e50] shadow-2xs"
              />
            </div>
            {catalogSearch && (
              <button
                type="button"
                onClick={handleAddCustomItem}
                className="px-3.5 py-2.5 bg-[#002855] text-white text-xs font-bold rounded-lg hover:bg-[#001B47] transition-colors flex items-center gap-1 shadow-2xs"
              >
                <Plus className="w-4 h-4" /> Agregar
              </button>
            )}
          </div>

          {/* Autocompletado del Clasificador */}
          {showCatalogDropdown && catalogSearch && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e5e7eb] rounded-xl shadow-xl z-40 max-h-64 overflow-y-auto divide-y divide-[#e5e7eb]">
              {filteredCatalog.length === 0 ? (
                <div className="p-3 text-xs text-[#6b7280] flex justify-between items-center">
                  <span>Sin coincidencia directa. Presione &quot;Agregar&quot; para registrar ítem libre.</span>
                </div>
              ) : (
                filteredCatalog.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleAddFromCatalog(item.ejemploNombre, item.partida)}
                    className="p-3 hover:bg-[#f8fafc] cursor-pointer flex items-center justify-between text-xs transition-colors"
                  >
                    <div>
                      <p className="font-bold text-[#001B47]">{item.ejemploNombre}</p>
                      <p className="text-[11px] text-[#6b7280]">
                        Partida 5 dígitos: <strong className="text-[#BC000C]">{item.partida.codigo}</strong> - {item.partida.denominacion}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        item.partida.categoria === "ACTIVO_FIJO"
                          ? "bg-blue-100 text-blue-800"
                          : item.partida.categoria === "SERVICIO"
                          ? "bg-red-100 text-red-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {item.partida.categoria}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Estado Vacío Informativo (NO se muestran tarjetas antes de agregar ítems!) */}
        {activeCategories.length === 0 && (
          <div className="p-10 border-2 border-dashed border-[#cbd5e1] rounded-2xl bg-white text-center space-y-3 shadow-2xs">
            <div className="w-12 h-12 bg-[#002855]/10 text-[#002855] rounded-full flex items-center justify-center mx-auto font-bold text-lg">
              ✨
            </div>
            <h3 className="font-bold text-sm text-[#001B47]">Ningún Trámite Generado Aún</h3>
            <p className="text-xs text-[#6b7280] max-w-md mx-auto leading-relaxed">
              Use el buscador para agregar ítems a su pedido inicial. Tan pronto agregue un ítem, el sistema creará dinámicamente la tarjeta de trámite correspondiente a esa categoría con su propia justificación y formulario de envío.
            </p>
          </div>
        )}

        {/* ========================================================================= */}
        {/* RENDERIZADO DINÁMICO DE TRÁMITES (Solo se muestran las categorías con ítems) */}
        {/* ========================================================================= */}
        {activeCategories.map((cat) => {
          const catHeader = headers[cat];
          const catItems = items.filter((i) => i.categoria === cat);
          const isActivo = cat === "ACTIVO_FIJO";
          const isServicio = cat === "SERVICIO";

          return (
            <div
              key={cat}
              className={`bg-white rounded-2xl border-2 transition-all shadow-md overflow-hidden space-y-4 p-5 ${
                catHeader.estado === "ERROR_VALIDACION"
                  ? "border-red-500 bg-red-50/10"
                  : catHeader.estado === "ENVIADO"
                  ? "border-emerald-500 bg-emerald-50/10"
                  : "border-[#002855]"
              }`}
            >
              {/* Encabezado del Trámite Generado */}
              <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#002855] text-white rounded-lg">
                    {isActivo ? <Monitor className="w-5 h-5" /> : isServicio ? <Package className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
                  </div>
                  <div>
                    <h2 className="font-bold text-base text-[#001B47] flex items-center gap-2">
                      {catHeader.titulo}
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {catItems.length} {catItems.length === 1 ? "ítem" : "ítems"}
                      </span>
                    </h2>
                    <p className="text-[11px] text-[#6b7280]">Trámite 100% Homogéneo • Normativa DICYT</p>
                  </div>
                </div>

                {/* Badge de Estado del Trámite */}
                <div>
                  {catHeader.estado === "ENVIADO" ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Enviado ({catHeader.codigoSeguimiento})
                    </span>
                  ) : catHeader.estado === "ERROR_VALIDACION" ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full border border-red-200">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Error en Datos
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-full border border-amber-200">
                      <Clock className="w-3.5 h-3.5" />
                      Borrador
                    </span>
                  )}
                </div>
              </div>

              {/* Mensajes de Error de Validación Destacados */}
              {catHeader.estado === "ERROR_VALIDACION" && catHeader.errores.length > 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-1 text-xs text-red-700 font-medium">
                  <p className="font-bold flex items-center gap-1.5 text-red-800">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    Complete los siguientes campos obligatorios para enviar este trámite:
                  </p>
                  <ul className="list-disc pl-5 space-y-0.5 text-[11px]">
                    {catHeader.errores.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Justificación y Datos Generales ÚNICOS de este Trámite */}
              <div className="p-4 bg-[#f8fafc] rounded-xl border border-[#e5e7eb] space-y-3">
                <h4 className="font-bold text-xs text-[#001B47] flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#002855]" />
                  Cabecera del Trámite: Justificación y Cotizaciones de Respaldo
                </h4>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#2c3e50]">
                    Justificación del Trámite ({catHeader.titulo}) *
                  </label>
                  <textarea
                    rows={2}
                    disabled={catHeader.estado === "ENVIADO"}
                    placeholder="Escriba la justificación técnica específica para esta solicitud de compra..."
                    value={catHeader.justificacion}
                    onChange={(e) =>
                      setHeaders((prev) => ({
                        ...prev,
                        [cat]: { ...prev[cat], justificacion: e.target.value },
                      }))
                    }
                    className={`w-full p-2.5 text-xs bg-white border rounded-lg text-[#2c3e50] ${
                      catHeader.estado === "ERROR_VALIDACION" && !catHeader.justificacion.trim()
                        ? "border-red-500 ring-1 ring-red-500"
                        : "border-[#e5e7eb]"
                    }`}
                  />
                </div>

                {/* Campos de Custodio para Activos Fijos */}
                {isActivo && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#2c3e50] flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-[#002855]" />
                        Nombre del Custodio *
                      </label>
                      <input
                        type="text"
                        disabled={catHeader.estado === "ENVIADO"}
                        placeholder="Ej: Dr. Marcelino Pérez"
                        value={catHeader.custodioNombre}
                        onChange={(e) =>
                          setHeaders((prev) => ({
                            ...prev,
                            [cat]: { ...prev[cat], custodioNombre: e.target.value },
                          }))
                        }
                        className={`w-full p-2 text-xs bg-white border rounded-lg ${
                          catHeader.estado === "ERROR_VALIDACION" && !catHeader.custodioNombre.trim()
                            ? "border-red-500 ring-1 ring-red-500"
                            : "border-[#e5e7eb]"
                        }`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#2c3e50] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#002855]" />
                        Lugar / Laboratorio de Ubicación *
                      </label>
                      <input
                        type="text"
                        disabled={catHeader.estado === "ENVIADO"}
                        placeholder="Ej: Lab. de IA - Edificio DICYT"
                        value={catHeader.custodioUbicacion}
                        onChange={(e) =>
                          setHeaders((prev) => ({
                            ...prev,
                            [cat]: { ...prev[cat], custodioUbicacion: e.target.value },
                          }))
                        }
                        className={`w-full p-2 text-xs bg-white border rounded-lg ${
                          catHeader.estado === "ERROR_VALIDACION" && !catHeader.custodioUbicacion.trim()
                            ? "border-red-500 ring-1 ring-red-500"
                            : "border-[#e5e7eb]"
                        }`}
                      />
                    </div>
                  </div>
                )}

                {/* Carga de Proformas / Cotizaciones específicas de este trámite */}
                <div className="space-y-1 pt-1">
                  <label className="text-xs font-semibold text-[#2c3e50]">
                    Archivos de Respaldo (Proformas / Cotizaciones en PDF) *
                  </label>
                  {catHeader.estado !== "ENVIADO" && (
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg"
                        onChange={(e) => handleProformaUpload(cat, e)}
                        className="text-xs text-[#6b7280] file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#002855] file:text-white cursor-pointer"
                      />
                    </div>
                  )}
                  {catHeader.proformas.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1.5">
                      {catHeader.proformas.map((p) => (
                        <span key={p.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-white border border-[#e5e7eb] rounded-md font-medium text-[#001B47]">
                          <Paperclip className="w-3 h-3 text-[#64748b]" />
                          {p.nombre}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Lista de Ítems dentro del Trámite */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs text-[#001B47]">Ítems del Trámite:</h4>
                {catItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => catHeader.estado !== "ENVIADO" && setSelectedItem(item)}
                    className={`p-3.5 bg-white border rounded-xl flex items-center justify-between cursor-pointer transition-all shadow-2xs group ${
                      !item.documentotecnicoNombre ? "border-amber-300 hover:border-amber-500" : "border-[#e5e7eb] hover:border-[#002855]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <ChevronDown className="w-4 h-4 text-[#9ca3af] group-hover:text-[#002855]" />
                      <div>
                        <div className="font-bold text-xs text-[#BC000C]">
                          {item.nombre}
                        </div>
                        <div className="flex flex-wrap items-center gap-2.5 mt-1 text-[11px] text-[#64748b]">
                          <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-bold text-[#001B47]">
                            Partida: {item.partidaPresupuestaria}
                          </span>
                          <span>Cant: {item.cantidad}</span>
                          <span>P. Ref: {item.precioReferencial} Bs</span>
                          {item.documentotecnicoNombre ? (
                            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold text-[10px]">
                              ✓ {isServicio ? "TDR PDF" : "ET PDF"} Adjuntado
                            </span>
                          ) : (
                            <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-bold text-[10px]">
                              ⚠ Clic para adjuntar {isServicio ? "TDR PDF" : "ET PDF"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {catHeader.estado !== "ENVIADO" && (
                      <button
                        type="button"
                        onClick={(e) => removeItem(item.id, e)}
                        className="text-[#9ca3af] hover:text-[#BC000C] transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Botón de Envío INDIVIDUAL por Trámite */}
              {catHeader.estado !== "ENVIADO" && (
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleSubmitSingle(cat)}
                    className="px-5 py-2.5 bg-[#002855] text-white text-xs font-bold rounded-xl hover:bg-[#001B47] transition-all flex items-center gap-2 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Enviar Trámite ({catHeader.titulo})
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* ========================================================================= */}
        {/* BARRA DE ACCIÓN: ENVÍO EN LOTE RESILIENTE ("Enviar Todos los Trámites") */}
        {/* ========================================================================= */}
        {activeCategories.length >= 2 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#e5e7eb] p-4 shadow-xl z-30">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-[#001B47] font-bold">
                <Layers className="w-5 h-5 text-[#002855]" />
                <span>Existen {activeCategories.length} trámites independientes generados en pantalla</span>
              </div>

              <button
                type="button"
                disabled={batchSubmitting}
                onClick={handleBatchSubmit}
                className="w-full sm:w-auto px-6 py-3 bg-[#BC000C] text-white text-xs font-extrabold rounded-xl hover:bg-red-800 transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {batchSubmitting ? "Procesando Lote..." : "Enviar Todos los Trámites"}
              </button>
            </div>
          </div>
        )}

        {/* Toast Notificación de Éxito */}
        {lastSubmittedCode && (
          <div className="fixed bottom-20 right-6 bg-emerald-600 text-white p-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-bounce">
            <CheckCircle2 className="w-6 h-6" />
            <div>
              <p className="font-bold text-sm">Trámite Enviado Exitosamente</p>
              <p className="text-xs opacity-90">Código de seguimiento: {lastSubmittedCode}</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal / Overlay de Detalle del Requerimiento (OVERLAY & MODAL.png) */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-[#e5e7eb] overflow-hidden space-y-4 p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-3">
              <div>
                <h3 className="font-bold text-base text-[#001B47]">Detalle del Requerimiento</h3>
                <p className="text-[11px] text-[#6b7280]">
                  Partida 5 dígitos: <strong className="text-[#BC000C]">{selectedItem.partidaPresupuestaria}</strong> - {selectedItem.partidaNombre}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="text-[#9ca3af] hover:text-[#2c3e50] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#2c3e50] block mb-1">Nombre / Descripción del Ítem</label>
                <input
                  type="text"
                  value={selectedItem.nombre}
                  onChange={(e) => setSelectedItem({ ...selectedItem, nombre: e.target.value })}
                  className="w-full p-2 bg-[#f8fafc] border border-[#e5e7eb] rounded-lg font-bold text-[#BC000C]"
                />
              </div>

              {selectedItem.categoria !== "SERVICIO" ? (
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="font-semibold text-[#2c3e50] block mb-1">Cantidad</label>
                    <input
                      type="number"
                      min="1"
                      value={selectedItem.cantidad}
                      onChange={(e) =>
                        setSelectedItem({
                          ...selectedItem,
                          cantidad: Number(e.target.value) || 1,
                          precioReferencial: (Number(e.target.value) || 1) * (selectedItem.precioUnitario || 0),
                        })
                      }
                      className="w-full p-2 bg-white border border-[#e5e7eb] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-[#2c3e50] block mb-1">Unidad</label>
                    <input
                      type="text"
                      value={selectedItem.unidad || "Unidad"}
                      onChange={(e) => setSelectedItem({ ...selectedItem, unidad: e.target.value })}
                      className="w-full p-2 bg-white border border-[#e5e7eb] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-[#2c3e50] block mb-1">P. Unitario (Bs)</label>
                    <input
                      type="number"
                      min="0"
                      value={selectedItem.precioUnitario || 0}
                      onChange={(e) =>
                        setSelectedItem({
                          ...selectedItem,
                          precioUnitario: Number(e.target.value) || 0,
                          precioReferencial: (selectedItem.cantidad || 1) * (Number(e.target.value) || 0),
                        })
                      }
                      className="w-full p-2 bg-white border border-[#e5e7eb] rounded-lg"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="font-semibold text-[#2c3e50] block mb-1">Detalle del Servicio</label>
                  <textarea
                    rows={2}
                    value={selectedItem.detalleServicio || ""}
                    onChange={(e) => setSelectedItem({ ...selectedItem, detalleServicio: e.target.value })}
                    className="w-full p-2 bg-white border border-[#e5e7eb] rounded-lg"
                  />
                </div>
              )}

              <div>
                <label className="font-semibold text-[#2c3e50] block mb-1">Precio Referencial Total (Bs)</label>
                <input
                  type="number"
                  disabled={selectedItem.categoria !== "SERVICIO"}
                  value={selectedItem.precioReferencial}
                  onChange={(e) => setSelectedItem({ ...selectedItem, precioReferencial: Number(e.target.value) || 0 })}
                  className="w-full p-2 bg-[#f1f5f9] border border-[#e5e7eb] rounded-lg font-bold text-[#001B47]"
                />
              </div>

              {/* Adjunto ET / TDR */}
              <div className="pt-2 border-t border-[#e5e7eb] space-y-2">
                <label className="font-semibold text-[#2c3e50] block">
                  {selectedItem.categoria === "SERVICIO"
                    ? "Documento TDR (Términos de Referencia en PDF) *"
                    : "Documento ET (Especificación Técnica en PDF) *"}
                </label>

                <div className="flex items-center justify-between bg-[#f8fafc] p-2.5 border border-[#e5e7eb] rounded-lg">
                  <span className="text-xs text-[#64748b] truncate max-w-[240px]">
                    {selectedItem.documentotecnicoNombre || "Ningún archivo adjuntado"}
                  </span>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#002855] text-white text-xs font-semibold rounded cursor-pointer hover:bg-[#001B47]">
                    <FileUp className="w-3.5 h-3.5" />
                    Subir PDF
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={async (e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          const res = await uploadAttachmentFile(e.target.files[0], "docs");
                          setSelectedItem({
                            ...selectedItem,
                            documentotecnicoNombre: res.name,
                            documentotecnicoPath: res.path,
                          });
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#e5e7eb]">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 text-xs font-medium text-[#64748b] bg-white border border-[#e5e7eb] rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleSaveModal(selectedItem)}
                className="px-5 py-2 text-xs font-bold text-white bg-[#002855] rounded-lg hover:bg-[#001B47]"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </SigefiShell>
  );
}
