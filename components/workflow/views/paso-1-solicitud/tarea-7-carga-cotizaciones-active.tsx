"use client";

import { useState, useMemo, useEffect } from "react";
import { TaskViewProps } from "../view-types";
import {
  Download,
  Plus,
  Edit2,
  Trash2,
  X,
  FileText,
  Building2,
  Truck,
  User,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { guardarCotizacionProforma } from "@/services/adjudicacionService";

interface ItemCotizacionState {
  idItem: number;
  nombre: string;
  unidad: string;
  cantidad: number;
  cantidadMaxSolicitada: number;
  detalle: string;
  precioUnitario: number;
  total: number;
  conExistencia: boolean;
  marca?: string;
  modelo?: string;
}

interface CotizacionRecord {
  id: string | number;
  nit: string;
  telefono: string;
  direccion: string;
  preparadaPor: string;
  proveedorNombre: string;
  tiempoEntrega: string;
  tiempoGarantia: string;
  validezOferta: string;
  totalBs: number;
  items: ItemCotizacionState[];
}

export default function Tarea7CargaCotizacionesActive({
  tarea,
  tramite,
  ejecutarTransicion,
}: TaskViewProps) {
  const rawItems = (tramite as any)?.items || [];

  // Registered proformas list
  const [proformas, setProformas] = useState<CotizacionRecord[]>([]);

  // Modal open state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Form State inside Modal
  const [nit, setNit] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [preparadaPor, setPreparadaPor] = useState("");
  const [proveedorNombre, setProveedorNombre] = useState("");
  const [tiempoEntrega, setTiempoEntrega] = useState("3 días");
  const [tiempoGarantia, setTiempoGarantia] = useState("1 año");
  const [validezOferta, setValidezOferta] = useState("30 días calendario");

  // Items transcribed in current modal
  const [modalItems, setModalItems] = useState<ItemCotizacionState[]>([]);

  // Alert message inside modal for quantity ceiling
  const [quantityAlert, setQuantityAlert] = useState<string | null>(null);

  // Feedback toast
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  // Load existing providers from Supabase when NIT changes for auto-fill
  useEffect(() => {
    if (!nit.trim()) return;
    const fetchProveedorByNit = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("proveedor")
          .select("*")
          .eq("nit", nit.trim())
          .single();
        if (data) {
          setProveedorNombre(data.nombre || "");
          if (data.telefono) setTelefono(data.telefono);
          if (data.direccion) setDireccion(data.direccion);
        }
      } catch {
        // Silently fail if not found
      }
    };
    fetchProveedorByNit();
  }, [nit]);

  // Pre-fill modal items when opening
  const handleOpenNewModal = () => {
    setEditingIndex(null);
    setNit("");
    setTelefono("");
    setDireccion("");
    setPreparadaPor("");
    setProveedorNombre("");
    setTiempoEntrega("3 días");
    setTiempoGarantia("1 año");
    setValidezOferta("30 días calendario");
    setQuantityAlert(null);

    // Initialize with original requested items
    const initial = rawItems.map((it: any) => ({
      idItem: it.id || 1,
      nombre: it.nombre || it.descripcion || "Ítem Solicitado",
      unidad: "1",
      cantidad: it.cantidad || 1,
      cantidadMaxSolicitada: it.cantidad || 1,
      detalle:
        it.especificacion || it.especificacionesTecnicasTexto || it.descripcion || it.nombre || "",
      precioUnitario: it.precioUnitario || it.precioReferencial || 0,
      total: (it.cantidad || 1) * (it.precioUnitario || it.precioReferencial || 0),
      conExistencia: true,
    }));

    setModalItems(initial);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (idx: number) => {
    const target = proformas[idx];
    if (!target) return;
    setEditingIndex(idx);
    setNit(target.nit);
    setTelefono(target.telefono);
    setDireccion(target.direccion);
    setPreparadaPor(target.preparadaPor);
    setProveedorNombre(target.proveedorNombre);
    setTiempoEntrega(target.tiempoEntrega);
    setTiempoGarantia(target.tiempoGarantia);
    setValidezOferta(target.validezOferta);
    setModalItems(target.items);
    setQuantityAlert(null);
    setIsModalOpen(true);
  };

  const handleItemQuantityChange = (idx: number, newQty: number) => {
    setQuantityAlert(null);
    const targetItem = modalItems[idx];
    if (!targetItem) return;

    if (newQty > targetItem.cantidadMaxSolicitada) {
      setQuantityAlert(
        `La cantidad cotizada no puede ser mayor a la cantidad solicitada (${targetItem.cantidadMaxSolicitada} unidades)`
      );
      return;
    }

    setModalItems((prev) =>
      prev.map((item, i) => {
        if (i !== idx) return item;
        const total = newQty * item.precioUnitario;
        return { ...item, cantidad: newQty, total };
      })
    );
  };

  const handleItemPriceChange = (idx: number, newPrice: number) => {
    setModalItems((prev) =>
      prev.map((item, i) => {
        if (i !== idx) return item;
        const total = item.cantidad * newPrice;
        return { ...item, precioUnitario: newPrice, total };
      })
    );
  };

  const handleItemToggleExistencia = (idx: number) => {
    setModalItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, conExistencia: !item.conExistencia } : item))
    );
  };

  const handleSaveProforma = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nit.trim()) return;

    const totalBs = modalItems.reduce((acc, it) => acc + (it.conExistencia ? it.total : 0), 0);
    const recordName = proveedorNombre.trim() || `Proveedor NIT: ${nit}`;

    const newRecord: CotizacionRecord = {
      id: Date.now(),
      nit,
      telefono,
      direccion,
      preparadaPor,
      proveedorNombre: recordName,
      tiempoEntrega,
      tiempoGarantia,
      validezOferta,
      totalBs,
      items: modalItems,
    };

    // Persistir directamente en Supabase (cotizacion, detalle_cotizacion, proveedor)
    const tramiteId = tramite?.id || 3;
    const res = await guardarCotizacionProforma({
      tramiteId,
      nit,
      proveedorNombre: recordName,
      telefono,
      direccion,
      tiempoEntregaDias: parseInt(tiempoEntrega, 10) || 3,
      validezOfertaDias: parseInt(validezOferta, 10) || 30,
      items: modalItems.map((it) => ({
        idItem: it.idItem,
        cantidad: it.cantidad,
        precioUnitario: it.precioUnitario,
        conExistencia: it.conExistencia,
        detalle: it.detalle,
      })),
    });

    if (res.success) {
      setFeedback({
        type: "success",
        message: `Proforma de ${recordName} guardada exitosamente en Supabase.`,
      });
    } else {
      console.warn("Advertencia guardando en Supabase:", res.error);
    }

    if (editingIndex !== null) {
      setProformas((prev) => prev.map((p, idx) => (idx === editingIndex ? newRecord : p)));
    } else {
      setProformas((prev) => [...prev, newRecord]);
    }

    setIsModalOpen(false);
  };

  const handleDeleteProforma = (idx: number) => {
    setProformas((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleDownloadPlantilla = () => {
    alert("Descargando Plantilla Oficial de Proforma en Blanco (PDF)...");
  };

  // Rule of Existences Check
  const proformasSinExistenciaCount = useMemo(() => {
    return proformas.filter((p) => p.items.some((it) => !it.conExistencia)).length;
  }, [proformas]);

  const acciones = tarea.accionesDisponibles || [];
  const transicionFinalizar =
    acciones.find(
      (a) => a.idEstadoDestino === 8 || a.nombreAccion.toLowerCase().includes("adjudic")
    ) || acciones[0];

  const handleFinalizarCotizaciones = async () => {
    if (!ejecutarTransicion || !transicionFinalizar) return;

    // Rule: If 2 of 3 proformas are "Sin Existencia", require 4th proforma
    if (proformas.length < 3) {
      setFeedback({
        type: "error",
        message: "Debe cargar al menos 3 cotizaciones para continuar.",
      });
      return;
    }

    if (proformasSinExistenciaCount >= 2 && proformas.length < 4) {
      setFeedback({
        type: "error",
        message:
          "2 de las cotizaciones presentan ítems 'Sin Existencia'. Se requiere registrar obligatoriamente una 4ta cotización con existencia para poder continuar.",
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    const res = await ejecutarTransicion(
      transicionFinalizar.idTransicion,
      `Transcripción de ${proformas.length} cotizaciones completada por el investigador.`
    );

    setIsSubmitting(false);

    if (res.success) {
      setFeedback({
        type: "success",
        message: res.message || "Cotizaciones registradas y guardadas exitosamente.",
      });
    } else {
      setFeedback({
        type: "error",
        message: res.message || "Error al avanzar la tarea de cotizaciones.",
      });
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

      {/* Main Container */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-2xs space-y-6">
        {/* Header & Top Buttons */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-lg font-extrabold text-[#001B47] tracking-tight">
            Cotizaciones Registradas
          </h2>

          <div className="flex items-center gap-3">
            {/* Download Proforma Button */}
            <button
              type="button"
              onClick={handleDownloadPlantilla}
              className="px-4 py-2.5 bg-white border border-slate-200 text-[#001B47] hover:bg-slate-50 text-xs font-extrabold rounded-xl transition-colors flex items-center gap-2 shadow-2xs"
            >
              <Download className="w-4 h-4 text-[#001B47]" />
              <span>Plantilla de proforma</span>
            </button>

            {/* New Quotation Button */}
            <button
              type="button"
              onClick={handleOpenNewModal}
              className="px-4 py-2.5 bg-[#001B47] text-white hover:bg-[#002855] text-xs font-extrabold rounded-xl transition-colors flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva cotizacion</span>
            </button>
          </div>
        </div>

        {/* Proformas Table */}
        <div className="border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[#001B47] font-extrabold border-b border-slate-200 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="p-3.5 pl-4">PROVEEDOR</th>
                <th className="p-3.5 text-left">TOTAL BS.</th>
                <th className="p-3.5 text-left">TIEMPO ENTREGA</th>
                <th className="p-3.5 text-center">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {proformas.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-400 text-xs">
                    Para comenzar, descarga la plantilla de proforma y complétala con la información
                    del proveedor.
                  </td>
                </tr>
              ) : (
                proformas.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3.5 pl-4 align-middle">
                      <p className="font-bold text-[#001B47] text-xs">{p.proveedorNombre}</p>
                      <p className="text-[10px] text-slate-400 font-mono">NIT: {p.nit}</p>
                    </td>
                    <td className="p-3.5 align-middle font-mono font-medium">
                      {p.totalBs.toLocaleString("es-BO", { minimumFractionDigits: 2 })} Bs.
                    </td>
                    <td className="p-3.5 align-middle text-slate-600">{p.tiempoEntrega}</td>
                    <td className="p-3.5 align-middle text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(idx)}
                          className="p-1.5 text-slate-600 hover:text-[#001B47] hover:bg-slate-100 rounded-lg transition-colors"
                          title="Editar proforma"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProforma(idx)}
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar proforma"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nueva Cotización - Proforma (Match Figma 1:1) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 my-6 max-h-[90vh] flex flex-col">
            {/* Modal Navy Header Bar */}
            <div className="bg-[#001B47] text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 font-extrabold text-sm">
                <FileText className="w-5 h-5 text-white" />
                <span>
                  {editingIndex !== null
                    ? "Editar Cotización - Proforma"
                    : "Nueva Cotización - Proforma"}
                </span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Content Body */}
            <form
              onSubmit={handleSaveProforma}
              className="p-6 overflow-y-auto space-y-6 flex-1 text-xs"
            >
              {/* Grid 2 Columns: DATOS DEL PROVEEDOR & CONDICIONES DEL PROVEEDOR */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Column 1: DATOS DEL PROVEEDOR */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-[#001B47] font-extrabold border-b border-slate-200 pb-2 uppercase text-[11px] tracking-wider">
                    <Building2 className="w-4 h-4 text-[#001B47]" />
                    <span>DATOS DEL PROVEEDOR</span>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-slate-600 text-[11px]">
                      No. de NIT *
                    </label>
                    <input
                      type="text"
                      required
                      value={nit}
                      onChange={(e) => setNit(e.target.value)}
                      placeholder="6505022017"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001B47] font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-slate-600 text-[11px]">Teléfono *</label>
                    <input
                      type="text"
                      required
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      placeholder="75497833"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001B47]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-slate-600 text-[11px]">
                      Dirección *
                    </label>
                    <input
                      type="text"
                      required
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                      placeholder="Blanco Galindo y Peru"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001B47]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-slate-600 text-[11px]">
                      Proforma preparada por *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={preparadaPor}
                        onChange={(e) => setPreparadaPor(e.target.value)}
                        placeholder="Abel Gutierrez Fernandez"
                        className="w-full p-2.5 pl-9 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001B47]"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>
                </div>

                {/* Column 2: CONDICIONES DEL PROVEEDOR */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-[#001B47] font-extrabold border-b border-slate-200 pb-2 uppercase text-[11px] tracking-wider">
                    <Truck className="w-4 h-4 text-[#001B47]" />
                    <span>CONDICIONES DEL PROVEEDOR</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-600 text-[11px]">
                        Tiempo Entrega (Días) *
                      </label>
                      <input
                        type="text"
                        required
                        value={tiempoEntrega}
                        onChange={(e) => setTiempoEntrega(e.target.value)}
                        placeholder="3 días"
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001B47]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block font-bold text-slate-600 text-[11px]">
                        Tiempo Garantía (Años) *
                      </label>
                      <input
                        type="text"
                        required
                        value={tiempoGarantia}
                        onChange={(e) => setTiempoGarantia(e.target.value)}
                        placeholder="1 año"
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001B47]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-slate-600 text-[11px]">
                      Validez de Oferta (Días) *
                    </label>
                    <input
                      type="text"
                      required
                      value={validezOferta}
                      onChange={(e) => setValidezOferta(e.target.value)}
                      placeholder="30 días calendario"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001B47]"
                    />
                  </div>
                </div>
              </div>

              {/* Items Section Container */}
              <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      /* All items pre-loaded */
                    }}
                    className="px-4 py-2 bg-[#001B47] text-white font-extrabold text-xs rounded-xl hover:bg-[#002855] transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar items</span>
                  </button>
                </div>

                {/* Quantity Ceiling Alert */}
                {quantityAlert && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                    <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{quantityAlert}</span>
                  </div>
                )}

                {/* Item List Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-[#001B47] font-extrabold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="p-2.5 text-center">Unidad</th>
                        <th className="p-2.5 text-center">Cant.</th>
                        <th className="p-2.5">Detalle</th>
                        <th className="p-2.5 text-right">P. Unit (Bs.)</th>
                        <th className="p-2.5 text-right">Total (Bs.)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {modalItems.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-2.5 align-top text-center text-slate-500 font-mono">
                            {item.unidad}
                          </td>
                          <td className="p-2.5 align-top text-center">
                            <input
                              type="number"
                              min={1}
                              value={item.cantidad}
                              onChange={(e) =>
                                handleItemQuantityChange(idx, parseInt(e.target.value, 10) || 1)
                              }
                              className="w-14 p-1.5 text-center bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001B47] font-bold"
                            />
                          </td>
                          <td className="p-2.5 align-top">
                            <textarea
                              rows={4}
                              value={item.detalle}
                              onChange={(e) =>
                                setModalItems((prev) =>
                                  prev.map((it, i) =>
                                    i === idx ? { ...it, detalle: e.target.value } : it
                                  )
                                )
                              }
                              className="w-full p-2 text-[11px] font-mono text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001B47]"
                            />
                          </td>
                          <td className="p-2.5 align-top text-right">
                            <div className="space-y-3">
                              <input
                                type="number"
                                step="0.01"
                                value={item.precioUnitario}
                                onChange={(e) =>
                                  handleItemPriceChange(idx, parseFloat(e.target.value) || 0)
                                }
                                className="w-28 p-1.5 text-right bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001B47] font-mono font-bold"
                              />

                              <div className="flex items-center justify-end gap-2 pt-1">
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={item.conExistencia}
                                    onChange={() => handleItemToggleExistencia(idx)}
                                    className="sr-only peer"
                                  />
                                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#001B47]"></div>
                                </label>
                                <span
                                  className={`text-[10px] font-extrabold ${
                                    item.conExistencia ? "text-[#001B47]" : "text-slate-400"
                                  }`}
                                >
                                  {item.conExistencia ? "Con existencia" : "Sin existencia"}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-2.5 align-top text-right font-mono font-extrabold text-[#001B47]">
                            <div className="p-2 bg-slate-100 rounded-lg border border-slate-200 text-right">
                              {item.total.toLocaleString("es-BO", { minimumFractionDigits: 2 })}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Modal Footer Buttons */}
              <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#001B47] text-white font-extrabold text-xs rounded-xl hover:bg-[#002855] transition-colors shadow-sm flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Guardar Proforma</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Action Button: Cotizacion realizada */}
      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={handleFinalizarCotizaciones}
          disabled={isSubmitting || !transicionFinalizar}
          className="px-8 py-3 bg-[#001B47] text-white font-extrabold text-xs rounded-xl hover:bg-[#002855] transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Guardando...</span>
            </>
          ) : (
            <span>Cotizacion realizada</span>
          )}
        </button>
      </div>
    </div>
  );
}
