"use client";

import React, { useState, useEffect } from "react";
import { ItemTramite, AsignacionProveedorItem } from "@/types/adjudicacion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Split } from "lucide-react";

interface CotizacionProveedorOption {
  cotizacionId: number;
  proveedorId: number;
  nombreProveedor: string;
  precioUnitario: number;
  stockDisponible: number;
}

interface AdjudicacionDivididaModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeItem: ItemTramite | null;
  cotizacionesOptions: CotizacionProveedorOption[];
  asignacionesActuales: AsignacionProveedorItem[];
  onGuardarAsignaciones: (asignaciones: AsignacionProveedorItem[]) => void;
}

export const AdjudicacionDivididaModal: React.FC<AdjudicacionDivididaModalProps> = ({
  isOpen,
  onClose,
  activeItem,
  cotizacionesOptions,
  asignacionesActuales,
  onGuardarAsignaciones,
}) => {
  // Estado local para editar las cantidades por proveedor: Map<proveedorId, cantidad>
  const [cantidadesState, setCantidadesState] = useState<Record<number, number>>({});

  useEffect(() => {
    if (isOpen && activeItem) {
      const initialRecord: Record<number, number> = {};
      cotizacionesOptions.forEach((opt) => {
        const asig = asignacionesActuales.find((a) => a.idProveedor === opt.proveedorId);
        initialRecord[opt.proveedorId] = asig ? asig.cantidadAdjudicada : 0;
      });
      setCantidadesState(initialRecord);
    }
  }, [isOpen, activeItem, cotizacionesOptions, asignacionesActuales]);

  if (!activeItem) return null;

  const cantidadSolicitada = activeItem.cantidad_solicitada;

  // Calcular la suma de cantidades asignadas
  const sumaCantidades = Object.values(cantidadesState).reduce((a, b) => a + Number(b || 0), 0);
  const excedeCantidad = sumaCantidades > cantidadSolicitada;
  const esIncompleta = sumaCantidades < cantidadSolicitada;

  const handleCantidadChange = (proveedorId: number, val: string) => {
    const num = Math.max(0, parseInt(val, 10) || 0);
    setCantidadesState((prev) => ({
      ...prev,
      [proveedorId]: num,
    }));
  };

  const handleConfirmar = () => {
    if (excedeCantidad) return;

    const resultAsignaciones: AsignacionProveedorItem[] = [];
    cotizacionesOptions.forEach((opt) => {
      const cant = cantidadesState[opt.proveedorId] || 0;
      if (cant > 0) {
        resultAsignaciones.push({
          idProveedor: opt.proveedorId,
          nombreProveedor: opt.nombreProveedor,
          cantidadAdjudicada: cant,
          precioUnitario: opt.precioUnitario,
        });
      }
    });

    onGuardarAsignaciones(resultAsignaciones);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border border-border">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
            <Split className="w-5 h-5 text-primary" />
            Adjudicación Dividida por Cantidades
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Insumo:{" "}
            <strong className="text-foreground">
              {activeItem.item?.nombre || activeItem.especificacion}
            </strong>
          </p>
          <p className="text-xs text-muted-foreground">
            Cantidad Solicitada Total:{" "}
            <span className="font-bold text-foreground">{cantidadSolicitada} Unidades</span>
          </p>
        </DialogHeader>

        <div className="py-3 space-y-3 max-h-[300px] overflow-y-auto pr-1">
          {cotizacionesOptions.length === 0 ? (
            <div className="p-4 text-center text-xs text-muted-foreground border border-dashed rounded-md">
              No hay proveedores con stock disponible y dentro del precio referencial para dividir
              este ítem.
            </div>
          ) : (
            cotizacionesOptions.map((opt) => {
              const val = cantidadesState[opt.proveedorId] || 0;
              return (
                <div
                  key={opt.proveedorId}
                  className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/20"
                >
                  <div className="flex-1 pr-3">
                    <h5 className="text-sm font-semibold text-foreground">{opt.nombreProveedor}</h5>
                    <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                      <span>
                        Bs.{" "}
                        {opt.precioUnitario.toLocaleString("es-BO", { minimumFractionDigits: 2 })}{" "}
                        /u
                      </span>
                      <span>•</span>
                      <span>Stock: {opt.stockDisponible} u.</span>
                    </div>
                  </div>

                  <div className="w-24 shrink-0">
                    <label className="text-[10px] text-muted-foreground block mb-0.5">
                      Cantidad
                    </label>
                    <Input
                      type="number"
                      min={0}
                      max={Math.min(cantidadSolicitada, opt.stockDisponible)}
                      value={val === 0 ? "" : val}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleCantidadChange(opt.proveedorId, e.target.value)
                      }
                      placeholder="0"
                      className="text-sm h-8 text-center font-bold"
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Resumen numérico y alerta si excede */}
        <div className="pt-2 border-t border-border flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-muted-foreground">Suma Total Asignada:</span>
            <span className={`font-bold ${excedeCantidad ? "text-rose-600" : "text-foreground"}`}>
              {sumaCantidades} / {cantidadSolicitada} Unidades
            </span>
          </div>

          {excedeCantidad && (
            <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1 bg-rose-50 dark:bg-rose-950/50 p-2 rounded-md">
              <AlertCircle className="w-4 h-4 shrink-0" />
              La cantidad asignada ({sumaCantidades}) excede el total solicitado (
              {cantidadSolicitada}).
            </p>
          )}

          {esIncompleta && sumaCantidades > 0 && (
            <p className="text-xs text-amber-700 dark:text-amber-300 font-medium bg-amber-50 dark:bg-amber-950/50 p-2 rounded-md">
              Atención: Se están asignando solo {sumaCantidades} de {cantidadSolicitada} unidades.
              Las {cantidadSolicitada - sumaCantidades} sobrantes no se adjudicarán por falta de
              stock.
            </p>
          )}
        </div>

        <DialogFooter className="mt-3 gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={excedeCantidad || sumaCantidades === 0}
            onClick={handleConfirmar}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Guardar Asignación Dividida
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
