"use client";

import { useState } from "react";
import { TramiteSolicitud, ItemSolicitud } from "@/types/requisitions";
import { TramiteCardHeader } from "./tramite-card-header";
import { TramiteItemRow } from "./tramite-item-row";
import { validateTramite } from "@/lib/requisitions/segregator";
import { Send, CheckCircle2, AlertTriangle, Package, Wrench, ShieldCheck } from "lucide-react";

interface RequisitionCardProps {
  tramite: TramiteSolicitud;
  onUpdateHeader: (id: string, updates: Partial<TramiteSolicitud>) => void;
  onUpdateItem: (tramiteId: string, itemId: string, updates: Partial<ItemSolicitud>) => void;
  onRemoveItem: (tramiteId: string, itemId: string) => void;
  onSingleSubmitSuccess: (tramiteId: string, codigoSeguimiento: string) => void;
}

export function RequisitionCard({
  tramite,
  onUpdateHeader,
  onUpdateItem,
  onRemoveItem,
  onSingleSubmitSuccess,
}: RequisitionCardProps) {
  const [submitting, setSubmitting] = useState(false);
  const [localErrors, setLocalErrors] = useState<string[]>(tramite.erroresValidacion || []);

  const getCategoryIcon = () => {
    switch (tramite.categoria) {
      case "MATERIAL":
        return <Package className="w-5 h-5 text-primary" />;
      case "ACTIVO_FIJO":
        return <ShieldCheck className="w-5 h-5 text-secondary" />;
      case "SERVICIO":
        return <Wrench className="w-5 h-5 text-amber-600" />;
    }
  };

  const getCategoryTitle = () => {
    switch (tramite.categoria) {
      case "MATERIAL":
        return "Trámite de Materiales";
      case "ACTIVO_FIJO":
        return "Trámite de Activos Fijos y Maquinaria";
      case "SERVICIO":
        return "Trámite de Servicios de Terceros";
    }
  };

  const handleSingleSubmit = async () => {
    setSubmitting(true);
    const errors = validateTramite(tramite);
    if (errors.length > 0) {
      setLocalErrors(errors);
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/requisitions/submit-single", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tramite),
      });

      const data = await res.json();
      if (data.success) {
        setLocalErrors([]);
        onSingleSubmitSuccess(tramite.id, data.codigoSeguimiento);
      } else {
        setLocalErrors(data.errors || ["Error al enviar el trámite"]);
      }
    } catch {
      setLocalErrors(["Error de conexión al enviar el trámite"]);
    } finally {
      setSubmitting(false);
    }
  };

  const isEnviado = tramite.estado === "ENVIADO";

  return (
    <div
      className={`bg-card text-card-foreground rounded-xl border transition-all ${
        localErrors.length > 0
          ? "border-destructive/80 shadow-md ring-1 ring-destructive/30"
          : "border-border shadow-sm"
      }`}
    >
      {/* Banner de Cabecera por Trámite */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20">
        <div className="flex items-center gap-3">
          {getCategoryIcon()}
          <div>
            <h4 className="font-bold text-foreground text-base">{getCategoryTitle()}</h4>
            <p className="text-xs text-muted-foreground">
              {tramite.items.length} ítem(s) en este número de trámite (Categoría 100% Homogénea)
            </p>
          </div>
        </div>

        {isEnviado ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Enviado: {tramite.codigoSeguimiento}
          </span>
        ) : (
          <button
            type="button"
            disabled={submitting}
            onClick={handleSingleSubmit}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium text-xs rounded-lg hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            {submitting ? "Enviando..." : "Enviar Solo Este Trámite"}
          </button>
        )}
      </div>

      <div className="p-5 space-y-4">
        {/* Banner de Errores Visuales */}
        {localErrors.length > 0 && !isEnviado && (
          <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-destructive">
              <AlertTriangle className="w-4 h-4" />
              Acciones requeridas para completar este trámite:
            </div>
            <ul className="list-disc list-inside text-xs text-destructive/90 space-y-0.5 pl-1">
              {localErrors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Sección de Cabecera del Trámite */}
        <TramiteCardHeader tramite={tramite} onUpdateHeader={onUpdateHeader} />

        {/* Lista de Ítems del Trámite */}
        <div className="space-y-3 pt-2">
          <h5 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Ítems Solicitados ({tramite.items.length})
          </h5>

          {tramite.items.map((item) => (
            <TramiteItemRow
              key={item.id}
              item={item}
              onUpdateItem={(itemId, updates) => onUpdateItem(tramite.id, itemId, updates)}
              onRemoveItem={(itemId) => onRemoveItem(tramite.id, itemId)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
