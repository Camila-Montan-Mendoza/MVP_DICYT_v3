"use client";

import { useState } from "react";
import { TramiteSolicitud, ItemSolicitud, EnvioLoteResultado } from "@/types/requisitions";
import { RequisitionCard } from "./requisition-card";
import { BatchSubmitBar } from "./batch-submit-bar";

interface RequisitionContainerProps {
  tramites: TramiteSolicitud[];
  onUpdateHeader: (id: string, updates: Partial<TramiteSolicitud>) => void;
  onUpdateItem: (tramiteId: string, itemId: string, updates: Partial<ItemSolicitud>) => void;
  onRemoveItem: (tramiteId: string, itemId: string) => void;
  onSingleSubmitSuccess: (tramiteId: string, codigoSeguimiento: string) => void;
  onBatchSubmitSuccess: (resultado: EnvioLoteResultado) => void;
}

export function RequisitionContainer({
  tramites,
  onUpdateHeader,
  onUpdateItem,
  onRemoveItem,
  onSingleSubmitSuccess,
  onBatchSubmitSuccess,
}: RequisitionContainerProps) {
  const [activeTab, setActiveTab] = useState<string>("ALL");

  if (tramites.length === 0) {
    return (
      <div className="p-8 text-center bg-card border border-border rounded-xl text-muted-foreground">
        <p className="font-medium text-sm">Aún no hay ítems agregados a la solicitud.</p>
        <p className="text-xs mt-1">Utilice el formulario de arriba para agregar ítems de Materiales, Activos Fijos o Servicios.</p>
      </div>
    );
  }

  const filteredTramites =
    activeTab === "ALL" ? tramites : tramites.filter((t) => t.categoria === activeTab);

  return (
    <div className="space-y-6">
      {/* Barra de envío masivo en lote */}
      <BatchSubmitBar tramites={tramites} onBatchSubmitSuccess={onBatchSubmitSuccess} />

      {/* Selector de Pestañas / Filtro por Categoría Homogénea */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("ALL")}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === "ALL"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          Todos los Trámites ({tramites.length})
        </button>

        {tramites.map((t) => (
          <button
            key={t.categoria}
            type="button"
            onClick={() => setActiveTab(t.categoria)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === t.categoria
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {t.categoria === "MATERIAL"
              ? "Materiales"
              : t.categoria === "ACTIVO_FIJO"
              ? "Activos Fijos"
              : "Servicios"}{" "}
            ({t.items.length})
          </button>
        ))}
      </div>

      {/* Renderizado de Tarjetas de Trámites Homogéneos */}
      <div className="space-y-6">
        {filteredTramites.map((tramite) => (
          <RequisitionCard
            key={tramite.id}
            tramite={tramite}
            onUpdateHeader={onUpdateHeader}
            onUpdateItem={onUpdateItem}
            onRemoveItem={onRemoveItem}
            onSingleSubmitSuccess={onSingleSubmitSuccess}
          />
        ))}
      </div>
    </div>
  );
}
