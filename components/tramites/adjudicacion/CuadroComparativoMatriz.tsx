"use client";

import React from "react";
import { ItemTramite, AsignacionProveedorItem } from "@/types/adjudicacion";
import { Award, Clock, AlertTriangle, PackageX, Check, Split } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CotizacionConDetalle {
  cotizacionId: number;
  proveedor?: {
    id: number;
    nombre: string;
    nit?: string | null;
  } | null;
  tiempoEntregaDias: number;
  validezOfertaDias?: number | null;
  detalle: {
    id: number;
    id_cotizacion: number;
    id_tramite_item: number;
    cantidad_existencias: number;
    precio: number;
    especificacion: string;
  } | null;
}

interface CuadroComparativoMatrizProps {
  activeItem: ItemTramite | null;
  cotizaciones: CotizacionConDetalle[];
  idProveedorAhorroMaximo: number | null;
  asignacionesMap: Map<number, AsignacionProveedorItem[]>;
  onAdjudicarSimple: (
    idProveedor: number,
    nombreProveedor: string,
    precioUnitario: number,
    cantidad: number
  ) => void;
  onDesmarcar: () => void;
  onAbrirModalDividido: () => void;
}

export const CuadroComparativoMatriz: React.FC<CuadroComparativoMatrizProps> = ({
  activeItem,
  cotizaciones,
  idProveedorAhorroMaximo,
  asignacionesMap,
  onAdjudicarSimple,
  onDesmarcar,
  onAbrirModalDividido,
}) => {
  if (!activeItem) {
    return (
      <div className="flex items-center justify-center h-full p-8 text-center text-muted-foreground bg-card rounded-xl border border-border">
        Seleccione un insumo de la lista para evaluar sus propuestas económicas.
      </div>
    );
  }

  const asignacionesActuales = asignacionesMap.get(activeItem.id) || [];
  const esAdjudicado = asignacionesActuales.length > 0;

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-xl shadow-xs overflow-hidden">
      {/* Encabezado del insumo evaluado */}
      <div className="p-5 border-b border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span>Insumo seleccionado</span>
            <span>•</span>
            <span>
              Ref: Bs. {activeItem.precio.toLocaleString("es-BO", { minimumFractionDigits: 2 })} / u
            </span>
          </div>
          <h3 className="text-xl font-bold text-foreground">
            {activeItem.item?.nombre || activeItem.especificacion}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Solicitado:{" "}
            <strong className="text-foreground font-semibold">
              {activeItem.cantidad_solicitada} Unidades
            </strong>{" "}
            ({activeItem.especificacion})
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeItem.cantidad_solicitada > 1 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onAbrirModalDividido}
              className="text-xs gap-1.5 border-border hover:bg-muted"
            >
              <Split className="w-3.5 h-3.5" />
              Adjudicación Dividida
            </Button>
          )}

          {esAdjudicado && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onDesmarcar}
              className="text-xs text-secondary hover:text-secondary hover:bg-secondary/10"
            >
              Desmarcar Selección
            </Button>
          )}
        </div>
      </div>

      {/* Sección principal: Tarjetas comparativas de proveedores */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-semibold text-foreground">Comparativa de Proveedores</h4>
          <span className="text-xs text-muted-foreground">
            {cotizaciones.length} propuesta(s) recibida(s)
          </span>
        </div>

        {cotizaciones.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-border rounded-lg text-sm text-muted-foreground">
            No se registraron cotizaciones para este ítem.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {cotizaciones.map((cot) => {
              const det = cot.detalle;
              if (!det) return null;

              const provId = cot.proveedor?.id || 0;
              const provNombre = cot.proveedor?.nombre || "Proveedor Desconocido";

              // Validaciones de reglas de negocio
              const sinStock = det.cantidad_existencias === 0;
              const excedePrecioReferencial = det.precio > activeItem.precio;
              const esAhorroMaximo = provId === idProveedorAhorroMaximo;

              // Estado de asignación actual para este proveedor
              const asignacionProv = asignacionesActuales.find((a) => a.idProveedor === provId);
              const estaSeleccionado = (asignacionProv?.cantidadAdjudicada || 0) > 0;
              const esSeleccionTotal =
                asignacionProv?.cantidadAdjudicada === activeItem.cantidad_solicitada;

              // Cálculo de precios
              const precioTotalCotizado = det.precio * activeItem.cantidad_solicitada;

              return (
                <div
                  key={cot.cotizacionId}
                  className={`p-5 rounded-xl border transition-all relative ${
                    estaSeleccionado
                      ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary"
                      : sinStock || excedePrecioReferencial
                        ? "border-border bg-muted/40 opacity-75"
                        : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  {/* Etiqueta / Badge superior de estado */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h5 className="text-base font-bold text-foreground">{provNombre}</h5>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                        <Clock className="w-3 h-3" />
                        Entrega: {cot.tiempoEntregaDias} días
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {esAhorroMaximo && !sinStock && !excedePrecioReferencial && (
                        <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                          <Award className="w-3.5 h-3.5" />
                          AHORRO MÁXIMO
                        </span>
                      )}

                      {sinStock && (
                        <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                          <PackageX className="w-3.5 h-3.5" />
                          SIN STOCK
                        </span>
                      )}

                      {excedePrecioReferencial && !sinStock && (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          EXCEDE PRECIO REF.
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Cuerpo: Precios y Stock disponible */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3 p-3 bg-muted/30 rounded-lg text-sm">
                    <div>
                      <span className="text-xs text-muted-foreground block font-medium">
                        PRECIO TOTAL
                      </span>
                      <strong className="text-base text-foreground font-bold">
                        Bs.{" "}
                        {precioTotalCotizado.toLocaleString("es-BO", { minimumFractionDigits: 2 })}
                      </strong>
                    </div>

                    <div>
                      <span className="text-xs text-muted-foreground block font-medium">
                        PRECIO UNITARIO
                      </span>
                      <strong
                        className={`text-sm font-semibold ${
                          excedePrecioReferencial
                            ? "text-rose-600 dark:text-rose-400"
                            : "text-foreground"
                        }`}
                      >
                        Bs. {det.precio.toLocaleString("es-BO", { minimumFractionDigits: 2 })}
                      </strong>
                    </div>

                    <div>
                      <span className="text-xs text-muted-foreground block font-medium">
                        STOCK DISPONIBLE
                      </span>
                      <strong
                        className={`text-sm font-semibold ${
                          sinStock ? "text-rose-600 font-bold" : "text-foreground"
                        }`}
                      >
                        {det.cantidad_existencias} UND.
                      </strong>
                    </div>
                  </div>

                  {/* Mensaje de advertencia si la oferta excede precio referencial */}
                  {excedePrecioReferencial && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mb-3 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      El precio cotizado (Bs. {det.precio}) supera el precio referencial inicial
                      (Bs. {activeItem.precio}).
                    </p>
                  )}

                  {/* Botón de acción */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
                    {estaSeleccionado ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-4 h-4" />
                          {esSeleccionTotal
                            ? "Seleccionado (Total)"
                            : `Asignado: ${asignacionProv?.cantidadAdjudicada} unidades`}
                        </span>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() =>
                            onAdjudicarSimple(
                              provId,
                              provNombre,
                              det.precio,
                              activeItem.cantidad_solicitada
                            )
                          }
                          className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs"
                        >
                          Confirmado
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        disabled={sinStock || excedePrecioReferencial}
                        onClick={() =>
                          onAdjudicarSimple(
                            provId,
                            provNombre,
                            det.precio,
                            activeItem.cantidad_solicitada
                          )
                        }
                        className={`text-xs font-semibold px-4 ${
                          sinStock || excedePrecioReferencial
                            ? "opacity-50 cursor-not-allowed"
                            : "bg-primary text-primary-foreground hover:bg-primary/90"
                        }`}
                      >
                        {sinStock ? "Sin Stock" : "Seleccionar"}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
