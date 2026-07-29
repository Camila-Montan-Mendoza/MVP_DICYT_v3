"use client";

import React from "react";
import { ItemTramite, AsignacionProveedorItem } from "@/types/adjudicacion";
import { Search, CheckCircle2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ItemListaSeleccionProps {
  items: ItemTramite[];
  selectedItemId: number | null;
  onSelectItem: (id: number) => void;
  searchFilter: string;
  onSearchChange: (val: string) => void;
  asignacionesMap: Map<number, AsignacionProveedorItem[]>;
}

export const ItemListaSeleccion: React.FC<ItemListaSeleccionProps> = ({
  items,
  selectedItemId,
  onSelectItem,
  searchFilter,
  onSearchChange,
  asignacionesMap,
}) => {
  const filteredItems = items.filter((i) => {
    const nombre = i.item?.nombre || i.especificacion || "";
    return nombre.toLowerCase().includes(searchFilter.toLowerCase());
  });

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-xl shadow-xs overflow-hidden">
      {/* Barra de búsqueda de insumos */}
      <div className="p-3 border-b border-border bg-muted/30">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar insumo..."
            value={searchFilter}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
            className="pl-9 bg-background border-border text-sm h-9"
          />
        </div>
      </div>

      {/* Lista de ítems del trámite */}
      <div className="flex-1 overflow-y-auto divide-y divide-border">
        {filteredItems.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            No se encontraron insumos.
          </div>
        ) : (
          filteredItems.map((item) => {
            const isSelected = item.id === selectedItemId;
            const asignaciones = asignacionesMap.get(item.id) || [];
            const esAdjudicado = asignaciones.length > 0;
            const totalCantAdjudicada = asignaciones.reduce((a, b) => a + b.cantidadAdjudicada, 0);

            // Nombre del proveedor o texto consolidado
            let proveedorLabel = "Sin proveedor —";
            if (asignaciones.length === 1) {
              proveedorLabel = asignaciones[0].nombreProveedor;
            } else if (asignaciones.length > 1) {
              proveedorLabel = `Dividido en ${asignaciones.length} proveedores`;
            }

            // Subtotal adjudicado o referencial
            const subtotalAdjudicado = asignaciones.reduce(
              (acc, a) => acc + a.cantidadAdjudicada * a.precioUnitario,
              0
            );

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectItem(item.id)}
                className={`w-full text-left p-4 transition-colors flex flex-col gap-2 relative ${
                  isSelected
                    ? "bg-primary/5 border-l-4 border-l-primary"
                    : "hover:bg-muted/40 border-l-4 border-l-transparent"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {esAdjudicado ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <CheckCircle2 className="w-3 h-3" />
                        ADJUDICADO
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        <AlertCircle className="w-3 h-3" />
                        PENDIENTE
                      </span>
                    )}
                  </div>

                  {esAdjudicado && (
                    <span className="text-xs font-bold text-foreground">
                      Bs. {subtotalAdjudicado.toLocaleString("es-BO", { minimumFractionDigits: 2 })}
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-foreground line-clamp-1">
                    {item.item?.nombre || item.especificacion}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Cantidad: {item.cantidad_solicitada} Unidades
                    {totalCantAdjudicada > 0 && totalCantAdjudicada < item.cantidad_solicitada && (
                      <span className="text-amber-600 font-medium ml-1">
                        ({totalCantAdjudicada} adj.)
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/50">
                  <span className="truncate max-w-[170px] font-medium">{proveedorLabel}</span>
                  {!esAdjudicado && (
                    <span className="text-xs text-muted-foreground font-mono">
                      Ref: Bs. {item.precio.toLocaleString("es-BO", { minimumFractionDigits: 2 })}
                    </span>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
