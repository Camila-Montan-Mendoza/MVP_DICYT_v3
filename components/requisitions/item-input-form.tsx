"use client";

import { useState } from "react";
import { ItemSolicitud, ItemCategoria } from "@/types/requisitions";
import { PlusCircle, ShoppingBag } from "lucide-react";

interface ItemInputFormProps {
  onAddItem: (item: ItemSolicitud) => void;
}

export function ItemInputForm({ onAddItem }: ItemInputFormProps) {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState<ItemCategoria>("MATERIAL");
  const [cantidad, setCantidad] = useState<number | "">(1);
  const [unidad, setUnidad] = useState("Unidad");
  const [precioUnitario, setPrecioUnitario] = useState<number | "">(100);
  const [detalleServicio, setDetalleServicio] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    const newItem: ItemSolicitud = {
      id: `item-${Date.now()}`,
      nombre: nombre.trim(),
      categoria,
      cantidad: categoria !== "SERVICIO" ? Number(cantidad) || 1 : undefined,
      unidad: categoria !== "SERVICIO" ? unidad : undefined,
      precioUnitario: categoria !== "SERVICIO" ? Number(precioUnitario) || 0 : undefined,
      precioReferencial:
        categoria !== "SERVICIO"
          ? (Number(cantidad) || 1) * (Number(precioUnitario) || 0)
          : Number(precioUnitario) || 100,
      detalleServicio: categoria === "SERVICIO" ? detalleServicio || nombre : undefined,
      partidaPresupuestaria: "Consultando...",
    };

    onAddItem(newItem);
    setNombre("");
    setDetalleServicio("");
  };

  return (
    <div className="bg-card text-card-foreground p-6 rounded-xl border border-border shadow-sm mb-6">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingBag className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Agregar Ítem a la Lista de Pedido</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Nombre del Ítem / Requerimiento *</label>
            <input
              type="text"
              required
              placeholder="ej. Reactivo A, Microscopio, Mantenimiento..."
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Tipo de Compra (Auto-Clasificación) *</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as ItemCategoria)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground font-medium"
            >
              <option value="MATERIAL">Material (Materiales y Suministros)</option>
              <option value="ACTIVO_FIJO">Activo Fijo (Maquinaria y Equipos)</option>
              <option value="SERVICIO">Servicio (Servicios de Terceros / TDR)</option>
            </select>
          </div>

          {categoria !== "SERVICIO" ? (
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">Cantidad</label>
                <input
                  type="number"
                  min="1"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">Unidad</label>
                <input
                  type="text"
                  value={unidad}
                  onChange={(e) => setUnidad(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">P. Unit (Bs)</label>
                <input
                  type="number"
                  min="0"
                  value={precioUnitario}
                  onChange={(e) => setPrecioUnitario(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Precio Referencial (Bs)</label>
              <input
                type="number"
                min="0"
                value={precioUnitario}
                onChange={(e) => setPrecioUnitario(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              />
            </div>
          )}
        </div>

        {categoria === "SERVICIO" && (
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Detalle del Servicio</label>
            <input
              type="text"
              placeholder="Descripción breve de los alcances requeridos..."
              value={detalleServicio}
              onChange={(e) => setDetalleServicio(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            />
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-medium text-sm rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Agregar a la Solicitud
          </button>
        </div>
      </form>
    </div>
  );
}
