"use client";

import { useEffect } from "react";
import { ItemSolicitud } from "@/types/requisitions";
import { lookupBudgetLine } from "@/lib/requisitions/budget-service";
import { uploadAttachmentFile } from "@/lib/supabase/storage";
import { FileUp, Trash2, CheckCircle2, AlertCircle } from "lucide-react";

interface TramiteItemRowProps {
  item: ItemSolicitud;
  onUpdateItem: (itemId: string, updates: Partial<ItemSolicitud>) => void;
  onRemoveItem: (itemId: string) => void;
}

export function TramiteItemRow({ item, onUpdateItem, onRemoveItem }: TramiteItemRowProps) {
  // Budget line lookup on initial load or description change
  useEffect(() => {
    if (item.partidaPresupuestaria === "Consultando..." || !item.partidaPresupuestaria) {
      lookupBudgetLine(item.nombre, item.categoria).then((res) => {
        onUpdateItem(item.id, { partidaPresupuestaria: res.partidaCode });
      });
    }
  }, [item.nombre, item.categoria]);

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const folder = item.categoria === "SERVICIO" ? "tdr" : "et";

    const res = await uploadAttachmentFile(file, folder);
    onUpdateItem(item.id, {
      documentotecnicoPath: res.path,
      documentotecnicoNombre: res.name,
    });
  };

  const isServicio = item.categoria === "SERVICIO";

  return (
    <div className="p-4 bg-background rounded-lg border border-border space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-sm text-foreground flex items-center gap-2">
          {item.nombre}
          <span className="text-xs px-2 py-0.5 rounded font-mono bg-muted text-muted-foreground">
            {item.partidaPresupuestaria}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onRemoveItem(item.id)}
          className="text-muted-foreground hover:text-destructive transition-colors p-1"
          title="Eliminar Ítem"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
        {!isServicio ? (
          <>
            <div>
              <label className="text-muted-foreground block mb-0.5">Cantidad</label>
              <input
                type="number"
                min="1"
                value={item.cantidad || 1}
                onChange={(e) => {
                  const cant = Number(e.target.value) || 1;
                  onUpdateItem(item.id, {
                    cantidad: cant,
                    precioReferencial: cant * (item.precioUnitario || 0),
                  });
                }}
                className="w-full p-1.5 bg-background border border-border rounded text-foreground text-xs"
              />
            </div>
            <div>
              <label className="text-muted-foreground block mb-0.5">Unidad</label>
              <input
                type="text"
                value={item.unidad || "Unidad"}
                onChange={(e) => onUpdateItem(item.id, { unidad: e.target.value })}
                className="w-full p-1.5 bg-background border border-border rounded text-foreground text-xs"
              />
            </div>
            <div>
              <label className="text-muted-foreground block mb-0.5">P. Unitario (Bs)</label>
              <input
                type="number"
                min="0"
                value={item.precioUnitario || 0}
                onChange={(e) => {
                  const pu = Number(e.target.value) || 0;
                  onUpdateItem(item.id, {
                    precioUnitario: pu,
                    precioReferencial: (item.cantidad || 1) * pu,
                  });
                }}
                className="w-full p-1.5 bg-background border border-border rounded text-foreground text-xs"
              />
            </div>
          </>
        ) : (
          <div className="md:col-span-3">
            <label className="text-muted-foreground block mb-0.5">Detalle del Servicio</label>
            <input
              type="text"
              value={item.detalleServicio || ""}
              onChange={(e) => onUpdateItem(item.id, { detalleServicio: e.target.value })}
              placeholder="Detalle técnico de alcances requeridos..."
              className="w-full p-1.5 bg-background border border-border rounded text-foreground text-xs"
            />
          </div>
        )}

        <div>
          <label className="text-muted-foreground block mb-0.5">Precio Ref. Total (Bs)</label>
          <input
            type="number"
            disabled={!isServicio}
            value={item.precioReferencial || 0}
            onChange={(e) => onUpdateItem(item.id, { precioReferencial: Number(e.target.value) || 0 })}
            className="w-full p-1.5 bg-muted border border-border rounded text-foreground font-semibold text-xs"
          />
        </div>
      </div>

      {/* Carga de Documento Técnico (ET para Materiales/Activos, TDR para Servicios) */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">
            {isServicio ? "Documento TDR (PDF Obligatorio):" : "Especificación Técnica ET (PDF Obligatorio):"}
          </span>
          {item.documentotecnicoNombre ? (
            <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {item.documentotecnicoNombre}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-amber-600 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              Documento faltante
            </span>
          )}
        </div>

        <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-muted hover:bg-muted/80 text-foreground text-xs font-medium rounded border border-border cursor-pointer transition-colors">
          <FileUp className="w-3.5 h-3.5 text-primary" />
          {item.documentotecnicoNombre ? "Cambiar Archivo" : "Subir Documento"}
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleDocUpload}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}
