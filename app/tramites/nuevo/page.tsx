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
  Layers,
  AlertTriangle,
  ExternalLink,
  FileCode
} from "lucide-react";
import { uploadAttachmentFile } from "@/lib/supabase/storage";
import {
  CLASIFICADOR_OBJETO_GASTO,
  PartidaObjetoGasto,
} from "@/lib/requisitions/clasificador-objeto-gasto";
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
  especificacionesTecnicasTexto?: string; // ET is TEXT for Materiales/Activos Fijos!
  partidaPresupuestaria: string;
  partidaNombre?: string;
  documentotecnicoNombre?: string; // TDR is PDF for Servicios!
  documentotecnicoPath?: string;
}

// Requisition Draft Model
interface TramiteBorrador {
  categoria: ItemCategoria;
  titulo: string;
  justificacion: string;
  custodioNombre: string;
  custodioUbicacion: string;
  proformas: Array<{ id: string; nombre: string }>;
  estado: "BORRADOR" | "ENVIADO" | "ERROR_VALIDACION" | "SALDO_INSUFICIENTE";
  codigoSeguimiento?: string;
  errores: string[];
}

// Modal Saldo Insuficiente Data
interface SaldoInsuficienteData {
  partidaCodigo: string;
  partidaNombre: string;
  montoRequerido: number;
  saldoDisponible: number;
  deficit: number;
}

export default function FormulacionRequerimientosPage() {
  const router = useRouter();

  const [proyecto, setProyecto] = useState("Implementacion de IA para la agricultura");

  // Items list starts EMPTY per user request (items = [])
  const [items, setItems] = useState<ItemData[]>([]);

  // Search & Autocomplete catalog
  const [catalogSearch, setCatalogSearch] = useState("");
  const [showCatalogDropdown, setShowCatalogDropdown] = useState(false);

  // Accordion Expand/Collapse States
  const [activosExpanded, setActivosExpanded] = useState(true);
  const [materialesExpanded, setMaterialesExpanded] = useState(true);
  const [serviciosExpanded, setServiciosExpanded] = useState(true);

  // Independent Requisition Headers by Category
  const [headers, setHeaders] = useState<Record<ItemCategoria, TramiteBorrador>>({
    ACTIVO_FIJO: {
      categoria: "ACTIVO_FIJO",
      titulo: "Activos Fijos",
      justificacion: "",
      custodioNombre: "",
      custodioUbicacion: "",
      proformas: [],
      estado: "BORRADOR",
      errores: [],
    },
    MATERIAL: {
      categoria: "MATERIAL",
      titulo: "Materiales",
      justificacion: "",
      custodioNombre: "",
      custodioUbicacion: "",
      proformas: [],
      estado: "BORRADOR",
      errores: [],
    },
    SERVICIO: {
      categoria: "SERVICIO",
      titulo: "Servicios contratados",
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

  // Modal Saldo Insuficiente State
  const [saldoModalData, setSaldoModalData] = useState<SaldoInsuficienteData | null>(null);

  // Toast / Feedback State
  const [batchSubmitting, setBatchSubmitting] = useState(false);
  const [lastSubmittedCode, setLastSubmittedCode] = useState<string | null>(null);

  // Categorized items
  const activosItems = items.filter((i) => i.categoria === "ACTIVO_FIJO");
  const materialesItems = items.filter((i) => i.categoria === "MATERIAL");
  const serviciosItems = items.filter((i) => i.categoria === "SERVICIO");

  // Filter catalog items for search dropdown
  const filteredCatalog = CLASIFICADOR_OBJETO_GASTO.flatMap((p) =>
    p.ejemplosInsumos
      .filter(
        (ej) =>
          ej.toLowerCase().includes(catalogSearch.toLowerCase()) ||
          p.denominacion.toLowerCase().includes(catalogSearch.toLowerCase())
      )
      .map((ejem) => ({
        ejemploNombre: ejem,
        partida: p,
      }))
  );

  const handleAddFromCatalog = (ejemploNombre: string, partida: PartidaObjetoGasto) => {
    const newItem: ItemData = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      nombre: ejemploNombre.toUpperCase(), // Clean item name
      categoria: partida.categoria,
      cantidad: 1,
      unidad: partida.categoria === "SERVICIO" ? "Servicio" : "Unidad",
      precioUnitario: partida.categoria === "SERVICIO" ? 0 : 500,
      precioReferencial: partida.categoria === "SERVICIO" ? 0 : 500,
      especificacionesTecnicasTexto: partida.categoria !== "SERVICIO" ? "Especificación técnica detallada del bien según catálogo DICYT." : undefined,
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
      especificacionesTecnicasTexto: "Especificaciones del material.",
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
      errs.push("Debe adjuntar al menos una proforma o cotización de respaldo (Imagen o PDF).");
    }
    if (cat === "ACTIVO_FIJO") {
      if (!h.custodioNombre.trim()) {
        errs.push("Debe ingresar el Nombre del Custodio para Activos Fijos.");
      }
      if (!h.custodioUbicacion.trim()) {
        errs.push("Debe ingresar el Lugar / Laboratorio de Ubicación.");
      }
    }

    // Check item details
    catItems.forEach((it) => {
      if (cat === "SERVICIO" && !it.documentotecnicoNombre) {
        errs.push(`El servicio '${it.nombre}' no tiene adjunto su documento obligatorio de TDR en PDF.`);
      }
      if (cat !== "SERVICIO" && (!it.especificacionesTecnicasTexto || !it.especificacionesTecnicasTexto.trim())) {
        errs.push(`El ítem '${it.nombre}' debe contar con sus Especificaciones Técnicas (ET) en texto.`);
      }
    });

    return errs;
  };

  // Submit Single Requisition
  const handleSubmitSingle = (cat: ItemCategoria) => {
    const catItems = items.filter((i) => i.categoria === cat);
    const totalAmount = catItems.reduce((acc, curr) => acc + (curr.precioReferencial || 0), 0);

    // Simulation of Saldo Insuficiente check (e.g. if category is ACTIVO_FIJO and amount > 5000 Bs)
    if (cat === "ACTIVO_FIJO" && totalAmount > 5000) {
      const firstItem = catItems[0] || { partidaPresupuestaria: "43120", partidaNombre: "Equipo de Computación" };
      setSaldoModalData({
        partidaCodigo: firstItem.partidaPresupuestaria,
        partidaNombre: firstItem.partidaNombre || "Equipo de Computación",
        montoRequerido: totalAmount || 8500,
        saldoDisponible: 1250,
        deficit: (totalAmount || 8500) - 1250,
      });

      setHeaders((prev) => ({
        ...prev,
        [cat]: { ...prev[cat], estado: "SALDO_INSUFICIENTE" },
      }));
      return;
    }

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

  // Resilient Batch Submit ("Enviar Todos los Trámites" / "Enviar")
  const handleBatchSubmit = async () => {
    setBatchSubmitting(true);

    if (activosItems.length > 0 && activosItems.reduce((acc, curr) => acc + curr.precioReferencial, 0) > 5000) {
      setBatchSubmitting(false);
      const firstItem = activosItems[0];
      setSaldoModalData({
        partidaCodigo: firstItem.partidaPresupuestaria,
        partidaNombre: firstItem.partidaNombre || "Equipo de Computación",
        montoRequerido: 8500,
        saldoDisponible: 1250,
        deficit: 7250,
      });
      return;
    }

    const activeCats: ItemCategoria[] = [];
    if (activosItems.length > 0) activeCats.push("ACTIVO_FIJO");
    if (materialesItems.length > 0) activeCats.push("MATERIAL");
    if (serviciosItems.length > 0) activeCats.push("SERVICIO");

    await Promise.allSettled(
      activeCats.map(async (cat) => {
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
              Implementacion de IA para la agricultura
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
                placeholder="Buscar item..."
                value={catalogSearch}
                onFocus={() => setShowCatalogDropdown(true)}
                onChange={(e) => {
                  setCatalogSearch(e.target.value);
                  setShowCatalogDropdown(true);
                }}
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-[#eef2f6] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#002855] text-[#2c3e50]"
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
                <div className="p-3 text-xs text-[#6b7280]">
                  Sin coincidencia exacta. Presione &quot;Agregar&quot; para registrar el ítem.
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

        {/* Bloque 1: Activos Fijos */}
        <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden shadow-2xs">
          <div
            onClick={() => setActivosExpanded(!activosExpanded)}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#f8fafc] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  activosExpanded ? "bg-[#002855]" : "bg-[#cbd5e1]"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    activosExpanded ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </div>
              <Monitor className="w-5 h-5 text-[#002855]" />
              <span className="font-bold text-sm text-[#001B47]">Activos Fijos</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#f1f5f9] text-[#002855]">
                {activosItems.length}
              </span>
            </div>
            {activosExpanded ? <ChevronUp className="w-4 h-4 text-[#64748b]" /> : <ChevronDown className="w-4 h-4 text-[#64748b]" />}
          </div>

          {activosExpanded && (
            <div className="p-4 border-t border-[#e5e7eb] space-y-3 bg-[#f8fafc]/50">
              {activosItems.length === 0 ? (
                <p className="text-xs text-[#9ca3af] italic">0 ítems agregados en Activos Fijos.</p>
              ) : (
                activosItems.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="p-3.5 bg-white border border-[#002855] rounded-xl flex items-center justify-between cursor-pointer transition-all shadow-2xs group"
                  >
                    <div className="flex items-center gap-3">
                      <ChevronDown className="w-4 h-4 text-[#9ca3af]" />
                      <div>
                        <div className="font-bold text-xs text-[#001B47] uppercase">
                          ITEM {idx + 1} | {item.nombre}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-[11px] text-[#64748b]">
                          <span className="px-2 py-0.5 bg-[#002855]/10 text-[#002855] rounded font-bold text-[10px] uppercase">
                            CATÁLOGO
                          </span>
                          <span>Cantidad: {item.cantidad}</span>
                          <span className="font-mono text-[10px]">Partida: {item.partidaPresupuestaria}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => removeItem(item.id, e)}
                      className="text-[#9ca3af] hover:text-[#BC000C] transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Bloque 2: Materiales */}
        <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden shadow-2xs">
          <div
            onClick={() => setMaterialesExpanded(!materialesExpanded)}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#f8fafc] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  materialesExpanded ? "bg-[#002855]" : "bg-[#cbd5e1]"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    materialesExpanded ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </div>
              <Settings className="w-5 h-5 text-[#002855]" />
              <span className="font-bold text-sm text-[#001B47]">Materiales</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#f1f5f9] text-[#002855]">
                {materialesItems.length}
              </span>
            </div>
            {materialesExpanded ? <ChevronUp className="w-4 h-4 text-[#64748b]" /> : <ChevronDown className="w-4 h-4 text-[#64748b]" />}
          </div>

          {materialesExpanded && (
            <div className="p-4 border-t border-[#e5e7eb] space-y-3 bg-[#f8fafc]/50">
              {materialesItems.length === 0 ? (
                <p className="text-xs text-[#9ca3af] italic">0 ítems agregados en Materiales.</p>
              ) : (
                materialesItems.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="p-3.5 bg-white border border-[#e5e7eb] rounded-xl flex items-center justify-between cursor-pointer transition-all shadow-2xs group"
                  >
                    <div className="flex items-center gap-3">
                      <ChevronDown className="w-4 h-4 text-[#9ca3af]" />
                      <div>
                        <div className="font-bold text-xs text-[#001B47] uppercase">
                          ITEM {idx + 1} | {item.nombre}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-[11px] text-[#64748b]">
                          <span className="px-2 py-0.5 bg-[#002855]/10 text-[#002855] rounded font-bold text-[10px] uppercase">
                            MATERIAL
                          </span>
                          <span>Cantidad: {item.cantidad}</span>
                          <span className="font-mono text-[10px]">Partida: {item.partidaPresupuestaria}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => removeItem(item.id, e)}
                      className="text-[#9ca3af] hover:text-[#BC000C] transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Bloque 3: Servicios */}
        <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden shadow-2xs">
          <div
            onClick={() => setServiciosExpanded(!serviciosExpanded)}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#f8fafc] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  serviciosExpanded ? "bg-[#002855]" : "bg-[#cbd5e1]"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    serviciosExpanded ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </div>
              <Package className="w-5 h-5 text-[#002855]" />
              <span className="font-bold text-sm text-[#001B47]">Servicios</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#f1f5f9] text-[#002855]">
                {serviciosItems.length}
              </span>
            </div>
            {serviciosExpanded ? <ChevronUp className="w-4 h-4 text-[#64748b]" /> : <ChevronDown className="w-4 h-4 text-[#64748b]" />}
          </div>

          {serviciosExpanded && (
            <div className="p-4 border-t border-[#e5e7eb] space-y-3 bg-[#f8fafc]/50">
              {serviciosItems.length === 0 ? (
                <p className="text-xs text-[#9ca3af] italic">0 ítems agregados en Servicios.</p>
              ) : (
                serviciosItems.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="p-3.5 bg-white border-2 border-[#BC000C] rounded-xl flex items-center justify-between cursor-pointer shadow-xs transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <ChevronDown className="w-4 h-4 text-[#9ca3af]" />
                      <div>
                        <div className="font-bold text-xs text-[#BC000C] uppercase">
                          SERVICIO {idx + 1} | {item.nombre}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-[11px] text-[#64748b]">
                          <span className="px-2 py-0.5 bg-[#BC000C]/10 text-[#BC000C] rounded font-bold uppercase text-[10px]">
                            SERVICIO
                          </span>
                          <span>Cantidad: {item.cantidad}</span>
                          {item.documentotecnicoNombre && (
                            <span className="text-emerald-700 font-bold">✓ TDR PDF Adjuntado</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => removeItem(item.id, e)}
                      className="text-[#9ca3af] hover:text-[#BC000C] transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Sección de Cabecera General del Trámite & Cotizaciones de Respaldo (Acepta Imagen o PDF) */}
        <div className="bg-white p-5 rounded-xl border border-[#e5e7eb] shadow-2xs space-y-4">
          <h3 className="font-bold text-sm text-[#001B47] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#002855]" />
            Datos Generales y Cotizaciones de Respaldo (Proformas)
          </h3>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#2c3e50]">Justificación del Trámite *</label>
            <textarea
              rows={2}
              placeholder="Describa brevemente la justificación y necesidad del trámite..."
              value={headers.ACTIVO_FIJO.justificacion || headers.MATERIAL.justificacion || headers.SERVICIO.justificacion}
              onChange={(e) => {
                const val = e.target.value;
                setHeaders((prev) => ({
                  ACTIVO_FIJO: { ...prev.ACTIVO_FIJO, justificacion: val },
                  MATERIAL: { ...prev.MATERIAL, justificacion: val },
                  SERVICIO: { ...prev.SERVICIO, justificacion: val },
                }));
              }}
              className="w-full p-2.5 text-xs bg-white border border-[#e5e7eb] rounded-lg text-[#2c3e50]"
            />
          </div>

          <div className="space-y-1 pt-1">
            <label className="text-xs font-semibold text-[#2c3e50]">
              Archivos de Respaldo (Proformas / Cotizaciones en Imagen o PDF) *
            </label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.webp"
                onChange={(e) => handleProformaUpload("ACTIVO_FIJO", e)}
                className="text-xs text-[#6b7280] file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#002855] file:text-white cursor-pointer"
              />
            </div>
            {headers.ACTIVO_FIJO.proformas.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {headers.ACTIVO_FIJO.proformas.map((p) => (
                  <span key={p.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-[#f8fafc] border border-[#e5e7eb] rounded-md font-medium text-[#001B47]">
                    <Paperclip className="w-3 h-3 text-[#64748b]" />
                    {p.nombre}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Botón Principal ENVIAR a lo ancho en la parte inferior */}
        <div className="pt-4">
          <button
            type="button"
            disabled={batchSubmitting || items.length === 0}
            onClick={handleBatchSubmit}
            className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white transition-all shadow-md ${
              items.length > 0 ? "bg-[#002855] hover:bg-[#001B47]" : "bg-[#64748b] cursor-not-allowed"
            }`}
          >
            {batchSubmitting ? "Procesando Envío..." : "Enviar"}
          </button>
        </div>

        {/* Toast Notificación */}
        {lastSubmittedCode && (
          <div className="fixed bottom-6 right-6 bg-emerald-600 text-white p-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-bounce">
            <CheckCircle2 className="w-6 h-6" />
            <div>
              <p className="font-bold text-sm">Trámite Enviado Exitosamente</p>
              <p className="text-xs opacity-90">Código asignado: {lastSubmittedCode}</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal EDITAR SERVICIO / ITEM (Fiel al mockup EDITAR SERVICIO) */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border-t-4 border-t-[#BC000C] border-[#e5e7eb] overflow-hidden space-y-4 p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-3">
              <div>
                <h3 className="font-bold text-base text-[#001B47] uppercase tracking-wide">
                  EDITAR {selectedItem.categoria === "SERVICIO" ? "SERVICIO" : "REQUERIMIENTO"}
                </h3>
                <p className="text-xs text-[#64748b] capitalize">{selectedItem.nombre.toLowerCase()}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="text-[#9ca3af] hover:text-[#2c3e50] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Campo Nombre del Ítem - SOLO LECTURA (Inalterable) */}
              <div>
                <label className="font-bold text-xs text-[#2c3e50] block mb-1">DETALLE *</label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={selectedItem.nombre}
                  className="w-full p-2.5 bg-[#f8fafc] border border-[#e5e7eb] rounded-lg font-bold text-[#001B47] cursor-not-allowed opacity-90"
                />
                <span className="text-[10px] text-[#6b7280] italic mt-0.5 block">
                  * El nombre del ítem del catálogo es de solo lectura y no puede modificarse.
                </span>
              </div>

              {/* Fila de Cantidad, Precio y Total */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-xs text-[#2c3e50] block mb-1">PRECIO REFERENCIAL (BS.) *</label>
                  <input
                    type="number"
                    min="0"
                    value={selectedItem.precioReferencial}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        precioReferencial: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full p-2 bg-white border border-[#e5e7eb] rounded-lg text-[#2c3e50]"
                  />
                </div>
                <div>
                  <label className="font-bold text-xs text-[#2c3e50] block mb-1">CANTIDAD *</label>
                  <input
                    type="number"
                    min="1"
                    value={selectedItem.cantidad}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        cantidad: Number(e.target.value) || 1,
                      })
                    }
                    className="w-full p-2 bg-white border border-[#e5e7eb] rounded-lg text-[#2c3e50]"
                  />
                </div>
                <div>
                  <label className="font-bold text-xs text-[#2c3e50] block mb-1">TOTAL (BS.)</label>
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={`${(selectedItem.precioReferencial * selectedItem.cantidad).toLocaleString("es-BO")},00 Bs.`}
                    className="w-full p-2 bg-[#f1f5f9] border border-[#e5e7eb] rounded-lg font-bold text-[#001B47] cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Justificación o Especificaciones Técnicas Texto vs PDF */}
              {selectedItem.categoria === "SERVICIO" ? (
                <>
                  <div>
                    <label className="font-bold text-xs text-[#2c3e50] block mb-1">JUSTIFICACIÓN *</label>
                    <textarea
                      rows={3}
                      placeholder="DESCRIBA BREVEMENTE LA JUSTIFICACIÓN Y NECESIDAD DE ESTE SERVICIO..."
                      value={selectedItem.detalleServicio || ""}
                      onChange={(e) => setSelectedItem({ ...selectedItem, detalleServicio: e.target.value })}
                      className="w-full p-2.5 bg-white border border-[#e5e7eb] rounded-lg text-[#2c3e50] uppercase text-xs"
                    />
                  </div>

                  <div className="pt-2 border-t border-[#e5e7eb] space-y-2">
                    <label className="font-bold text-xs text-[#2c3e50] block">DOCUMENTO TDR (Términos de Referencia en PDF) *</label>
                    <div className="flex items-center justify-between bg-[#f8fafc] p-2.5 border border-[#e5e7eb] rounded-lg">
                      <span className="text-xs text-[#64748b] truncate max-w-[260px]">
                        {selectedItem.documentotecnicoNombre || "Ningún archivo TDR adjuntado"}
                      </span>
                      <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#002855] text-white text-xs font-semibold rounded cursor-pointer hover:bg-[#001B47]">
                        <FileUp className="w-3.5 h-3.5" />
                        Subir TDR PDF
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
                </>
              ) : (
                <div>
                  <label className="font-bold text-xs text-[#2c3e50] block mb-1">ESPECIFICACIONES TÉCNICAS (ET) *</label>
                  <textarea
                    rows={3}
                    placeholder="Escriba las especificaciones técnicas del bien o material (dimensiones, características)..."
                    value={selectedItem.especificacionesTecnicasTexto || ""}
                    onChange={(e) => setSelectedItem({ ...selectedItem, especificacionesTecnicasTexto: e.target.value })}
                    className="w-full p-2.5 bg-white border border-[#e5e7eb] rounded-lg text-[#2c3e50] text-xs"
                  />
                </div>
              )}
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

      {/* Modal SALDO INSUFICIENTE (Fiel al mockup Saldo Insuficiente) */}
      {saldoModalData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#e5e7eb] overflow-hidden p-6 space-y-5 animate-in fade-in zoom-in-95 text-center">
            {/* Red Alert Icon */}
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            {/* Title & Description */}
            <div className="space-y-1.5">
              <h3 className="font-extrabold text-lg text-[#001B47]">Saldo Insuficiente</h3>
              <p className="text-xs text-[#6b7280] leading-relaxed">
                No se puede procesar el envío. La partida <strong className="text-[#001B47] font-mono">{saldoModalData.partidaCodigo} - {saldoModalData.partidaNombre}</strong> no cuenta con el saldo disponible requerido para los activos seleccionados.
              </p>
            </div>

            {/* Table Desglose */}
            <div className="bg-[#f8fafc] rounded-xl border border-[#e5e7eb] p-3 text-xs divide-y divide-[#e5e7eb]">
              <div className="flex justify-between py-1 text-[11px] font-bold text-[#6b7280] uppercase">
                <span>CONCEPTO</span>
                <span>MONTO (BS.)</span>
              </div>
              <div className="flex justify-between py-2">
                <div className="text-left">
                  <p className="font-bold text-[#001B47]">Monto Requerido</p>
                  <p className="text-[10px] text-[#6b7280]">Partida {saldoModalData.partidaCodigo}</p>
                </div>
                <span className="font-bold text-[#001B47]">{saldoModalData.montoRequerido.toLocaleString("es-BO")},00</span>
              </div>
              <div className="flex justify-between py-2 text-[#2c3e50]">
                <span>Saldo Disponible</span>
                <span className="font-semibold">{saldoModalData.saldoDisponible.toLocaleString("es-BO")},00</span>
              </div>
              <div className="flex justify-between py-2 text-[#BC000C] font-bold">
                <span>Déficit</span>
                <span>{saldoModalData.deficit.toLocaleString("es-BO")},00</span>
              </div>
            </div>

            {/* Subtext info box */}
            <div className="p-3 bg-[#f1f5f9] rounded-lg text-[11px] text-[#64748b] flex items-center gap-2 text-left">
              <FileCode className="w-4 h-4 shrink-0 text-[#002855]" />
              <span>Su solicitud se ha guardado automáticamente como <em>Borrador (Pendiente de Modificación Presupuestaria)</em>.</span>
            </div>

            {/* Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  alert("Redirigiendo a la pantalla de Modificación Presupuestaria...");
                  setSaldoModalData(null);
                }}
                className="w-full py-3 bg-[#002855] text-white text-xs font-bold rounded-xl hover:bg-[#001B47] transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <ExternalLink className="w-4 h-4" />
                Iniciar Modificación Presupuestaria
              </button>

              <button
                type="button"
                onClick={() => {
                  setSaldoModalData(null);
                  router.push("/tramites");
                }}
                className="w-full py-2.5 bg-white border border-[#e5e7eb] text-[#2c3e50] text-xs font-semibold rounded-xl hover:bg-gray-50 transition-all"
              >
                Volver a Mis Trámites
              </button>
            </div>
          </div>
        </div>
      )}
    </SigefiShell>
  );
}
