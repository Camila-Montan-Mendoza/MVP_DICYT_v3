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
  FileText
} from "lucide-react";
import { uploadAttachmentFile } from "@/lib/supabase/storage";

interface ItemData {
  id: string;
  nombre: string;
  categoria: "ACTIVO_FIJO" | "MATERIAL" | "SERVICIO";
  cantidad: number;
  unidad?: string;
  precioUnitario?: number;
  precioReferencial: number;
  detalleServicio?: string;
  partidaPresupuestaria: string;
  documentotecnicoNombre?: string;
  documentotecnicoPath?: string;
}

export default function FormulacionRequerimientosPage() {
  const router = useRouter();

  const [proyecto, setProyecto] = useState("Implementacion de IA para la agricultura");
  const [searchTerm, setSearchTerm] = useState("");

  // Toggles for expanding/collapsing category sections
  const [activosExpanded, setActivosExpanded] = useState(true);
  const [materialesExpanded, setMaterialesExpanded] = useState(false);
  const [serviciosExpanded, setServiciosExpanded] = useState(true);

  // Items state
  const [items, setItems] = useState<ItemData[]>([
    {
      id: "srv-1",
      nombre: "SERVICIO 1 | SERVICIO DE AUDITORÍA EXTERNA",
      categoria: "SERVICIO",
      cantidad: 1,
      precioReferencial: 5000,
      detalleServicio: "Auditoría financiera externa para fondos de investigación DICYT",
      partidaPresupuestaria: "25200",
      documentotecnicoNombre: "TDR_Auditoria.pdf",
      documentotecnicoPath: "mock_storage/tdr/tdr.pdf",
    },
    {
      id: "af-1",
      nombre: "EQUIPO 1 | SERVIDOR GPU PARA ENTRENAMIENTO IA",
      categoria: "ACTIVO_FIJO",
      cantidad: 1,
      unidad: "Equipo",
      precioUnitario: 25000,
      precioReferencial: 25000,
      partidaPresupuestaria: "43110",
      documentotecnicoNombre: "ET_ServidorGPU.pdf",
      documentotecnicoPath: "mock_storage/et/et_gpu.pdf",
    },
    {
      id: "af-2",
      nombre: "EQUIPO 2 | SENSOR DE HUMEDAD DE SUELO DE ALTA PRECISIÓN",
      categoria: "ACTIVO_FIJO",
      cantidad: 2,
      unidad: "Unidad",
      precioUnitario: 3500,
      precioReferencial: 7000,
      partidaPresupuestaria: "43500",
    },
  ]);

  // General Headers & Backup files
  const [justificacion, setJustificacion] = useState("Requerimientos técnicos indispensables para el proyecto de IA agrícola DICYT.");
  const [proformas, setProformas] = useState<Array<{ id: string; nombre: string }>>([
    { id: "prof-1", nombre: "Proforma_Cotizacion_Global.pdf" },
  ]);
  const [custodioNombre, setCustodioNombre] = useState("Dr. Marcelino Pérez");
  const [custodioUbicacion, setCustodioUbicacion] = useState("Laboratorio de Inteligencia Artificial - Edificio DICYT");

  // Modal / Overlay State for item editing
  const [selectedItem, setSelectedItem] = useState<ItemData | null>(null);

  // Submitting state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const activosItems = items.filter((i) => i.categoria === "ACTIVO_FIJO");
  const materialesItems = items.filter((i) => i.categoria === "MATERIAL");
  const serviciosItems = items.filter((i) => i.categoria === "SERVICIO");

  const removeItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleSaveModal = (updated: ItemData) => {
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    setSelectedItem(null);
  };

  const handleProformaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const res = await uploadAttachmentFile(file, "proformas");
    setProformas((prev) => [...prev, { id: `prof-${Date.now()}`, nombre: res.name }]);
  };

  const handleEnviarAll = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessToast(true);
      setTimeout(() => {
        router.push("/tramites");
      }, 1500);
    }, 1000);
  };

  return (
    <SigefiShell>
      <div className="space-y-6 max-w-4xl mx-auto">
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
            <option value="Implementacion de IA para la agricultura">
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

        {/* Campo de Búsqueda de Ítem */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#9ca3af] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs bg-[#eef2f6] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#002855] text-[#2c3e50]"
          />
        </div>

        {/* Bloque 1: Activos Fijos */}
        <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden shadow-2xs">
          <div
            onClick={() => setActivosExpanded(!activosExpanded)}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#f8fafc] transition-colors"
          >
            <div className="flex items-center gap-3">
              {/* Toggle Switch */}
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
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#f1f5f9] text-[#64748b]">
                {activosItems.length}
              </span>
            </div>
            {activosExpanded ? <ChevronUp className="w-4 h-4 text-[#64748b]" /> : <ChevronDown className="w-4 h-4 text-[#64748b]" />}
          </div>

          {activosExpanded && (
            <div className="p-4 border-t border-[#e5e7eb] space-y-3 bg-[#f8fafc]/50">
              {activosItems.length === 0 ? (
                <p className="text-xs text-[#9ca3af] italic">No hay ítems de activos fijos agregados.</p>
              ) : (
                activosItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="p-3.5 bg-white border border-[#e5e7eb] hover:border-[#002855] rounded-xl flex items-center justify-between cursor-pointer transition-all shadow-2xs group"
                  >
                    <div className="flex items-center gap-3">
                      <ChevronDown className="w-4 h-4 text-[#9ca3af] group-hover:text-[#002855]" />
                      <div>
                        <div className="font-bold text-xs text-[#BC000C] flex items-center gap-2">
                          {item.nombre}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-[11px] text-[#64748b]">
                          <span className="px-2 py-0.5 bg-[#BC000C]/10 text-[#BC000C] rounded font-bold uppercase">
                            ACTIVO FIJO
                          </span>
                          <span>Cantidad: {item.cantidad}</span>
                          <span>P. Ref: {item.precioReferencial} Bs</span>
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
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#f1f5f9] text-[#64748b]">
                {materialesItems.length}
              </span>
            </div>
            {materialesExpanded ? <ChevronUp className="w-4 h-4 text-[#64748b]" /> : <ChevronDown className="w-4 h-4 text-[#64748b]" />}
          </div>

          {materialesExpanded && (
            <div className="p-4 border-t border-[#e5e7eb] space-y-3 bg-[#f8fafc]/50">
              {materialesItems.length === 0 ? (
                <p className="text-xs text-[#9ca3af] italic">No hay ítems de materiales agregados.</p>
              ) : (
                materialesItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="p-3.5 bg-white border border-[#e5e7eb] hover:border-[#002855] rounded-xl flex items-center justify-between cursor-pointer transition-all shadow-2xs group"
                  >
                    <div className="flex items-center gap-3">
                      <ChevronDown className="w-4 h-4 text-[#9ca3af] group-hover:text-[#002855]" />
                      <div>
                        <div className="font-bold text-xs text-[#BC000C] flex items-center gap-2">
                          {item.nombre}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-[11px] text-[#64748b]">
                          <span className="px-2 py-0.5 bg-[#002855]/10 text-[#002855] rounded font-bold uppercase">
                            MATERIAL
                          </span>
                          <span>Cantidad: {item.cantidad}</span>
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
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#f1f5f9] text-[#64748b]">
                {serviciosItems.length}
              </span>
            </div>
            {serviciosExpanded ? <ChevronUp className="w-4 h-4 text-[#64748b]" /> : <ChevronDown className="w-4 h-4 text-[#64748b]" />}
          </div>

          {serviciosExpanded && (
            <div className="p-4 border-t border-[#e5e7eb] space-y-3 bg-[#f8fafc]/50">
              {serviciosItems.length === 0 ? (
                <p className="text-xs text-[#9ca3af] italic">No hay ítems de servicios agregados.</p>
              ) : (
                serviciosItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="p-3.5 bg-white border-2 border-[#BC000C] rounded-xl flex items-center justify-between cursor-pointer shadow-xs transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <ChevronDown className="w-4 h-4 text-[#9ca3af]" />
                      <div>
                        <div className="font-bold text-xs text-[#BC000C]">
                          {item.nombre}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-[11px] text-[#64748b]">
                          <span className="px-2 py-0.5 bg-[#BC000C]/10 text-[#BC000C] rounded font-bold uppercase text-[10px]">
                            SERVICIO
                          </span>
                          <span>Cantidad: {item.cantidad}</span>
                          {item.documentotecnicoNombre && (
                            <span className="text-emerald-600 font-medium">✓ TDR Adjuntado</span>
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

        {/* Sección de Cabecera General del Trámite & Archivos de Respaldo */}
        <div className="bg-white p-5 rounded-xl border border-[#e5e7eb] shadow-2xs space-y-4">
          <h3 className="font-bold text-sm text-[#001B47] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#002855]" />
            Datos Generales y Proformas de Respaldo del Trámite
          </h3>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#2c3e50]">Justificación del Trámite *</label>
            <textarea
              rows={2}
              value={justificacion}
              onChange={(e) => setJustificacion(e.target.value)}
              className="w-full p-2.5 text-xs bg-white border border-[#e5e7eb] rounded-lg text-[#2c3e50]"
            />
          </div>

          {activosItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#2c3e50] flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-[#002855]" />
                  Nombre del Custodio (Activos Fijos) *
                </label>
                <input
                  type="text"
                  value={custodioNombre}
                  onChange={(e) => setCustodioNombre(e.target.value)}
                  className="w-full p-2 text-xs bg-white border border-[#e5e7eb] rounded-lg"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#2c3e50] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#002855]" />
                  Lugar / Laboratorio de Ubicación *
                </label>
                <input
                  type="text"
                  value={custodioUbicacion}
                  onChange={(e) => setCustodioUbicacion(e.target.value)}
                  className="w-full p-2 text-xs bg-white border border-[#e5e7eb] rounded-lg"
                />
              </div>
            </div>
          )}

          <div className="space-y-1 pt-2">
            <label className="text-xs font-semibold text-[#2c3e50]">Archivos de Respaldo (Proformas / Cotizaciones) *</label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept=".pdf,.png,.jpg"
                onChange={handleProformaUpload}
                className="text-xs text-[#6b7280] file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#002855] file:text-white cursor-pointer"
              />
            </div>
            {proformas.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {proformas.map((p) => (
                  <span key={p.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-[#f8fafc] border border-[#e5e7eb] rounded-md font-medium text-[#001B47]">
                    <Paperclip className="w-3 h-3 text-[#64748b]" />
                    {p.nombre}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Botón Principal ENVIAR en la parte inferior */}
        <div className="pt-4">
          <button
            type="button"
            disabled={isSubmitting || items.length === 0}
            onClick={handleEnviarAll}
            className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white transition-all shadow-md ${
              items.length > 0 ? "bg-[#002855] hover:bg-[#001B47]" : "bg-[#64748b] cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "Enviando Trámite..." : "Enviar"}
          </button>
        </div>

        {/* Toast de Confirmación */}
        {showSuccessToast && (
          <div className="fixed bottom-6 right-6 bg-emerald-600 text-white p-4 rounded-xl shadow-xl flex items-center gap-3 z-50 animate-bounce">
            <CheckCircle2 className="w-6 h-6" />
            <div>
              <p className="font-bold text-sm">Trámite Enviado Exitosamente</p>
              <p className="text-xs opacity-90">Código asignado: TR-2026-0042</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal / Overlay de Detalle del Requerimiento (OVERLAY & MODAL.png) */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-[#e5e7eb] overflow-hidden space-y-4 p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-3">
              <h3 className="font-bold text-base text-[#001B47]">Detalle del Requerimiento</h3>
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
