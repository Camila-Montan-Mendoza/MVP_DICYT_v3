"use client";

import { useState } from "react";
import { ItemSolicitud, TramiteSolicitud, EnvioLoteResultado } from "@/types/requisitions";
import { segregateItemsToRequisitions, validateTramite } from "@/lib/requisitions/segregator";
import { ItemInputForm } from "@/components/requisitions/item-input-form";
import { RequisitionContainer } from "@/components/requisitions/requisition-container";
import { ShieldCheck, FileSpreadsheet, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RequisitionsPage() {
  const [rawItems, setRawItems] = useState<ItemSolicitud[]>([]);
  const [tramites, setTramites] = useState<TramiteSolicitud[]>([]);

  // Handler for adding new items and triggering auto-classification
  const handleAddItem = (item: ItemSolicitud) => {
    const updatedItems = [...rawItems, item];
    setRawItems(updatedItems);

    // Auto-classify and segregate into homogeneous requisitions
    const segregated = segregateItemsToRequisitions(updatedItems, tramites);
    setTramites(segregated);
  };

  // Handler for header updates
  const handleUpdateHeader = (tramiteId: string, updates: Partial<TramiteSolicitud>) => {
    setTramites((prev) =>
      prev.map((t) => (t.id === tramiteId ? { ...t, ...updates } : t))
    );
  };

  // Handler for item updates
  const handleUpdateItem = (tramiteId: string, itemId: string, updates: Partial<ItemSolicitud>) => {
    setTramites((prev) =>
      prev.map((t) => {
        if (t.id !== tramiteId) return t;
        return {
          ...t,
          items: t.items.map((i) => (i.id === itemId ? { ...i, ...updates } : i)),
        };
      })
    );
  };

  // Handler for removing item
  const handleRemoveItem = (tramiteId: string, itemId: string) => {
    const updatedRaw = rawItems.filter((i) => i.id !== itemId);
    setRawItems(updatedRaw);

    const segregated = segregateItemsToRequisitions(updatedRaw, tramites);
    setTramites(segregated);
  };

  // Handler for single submit success
  const handleSingleSubmitSuccess = (tramiteId: string, codigoSeguimiento: string) => {
    setTramites((prev) =>
      prev.map((t) =>
        t.id === tramiteId
          ? { ...t, estado: "ENVIADO", codigoSeguimiento, erroresValidacion: [] }
          : t
      )
    );
  };

  // Handler for batch submit success
  const handleBatchSubmitSuccess = (resultado: EnvioLoteResultado) => {
    setTramites((prev) =>
      prev.map((t) => {
        const exito = resultado.tramitesExitosos.find((e) => e.id === t.id);
        if (exito) {
          return { ...t, estado: "ENVIADO", codigoSeguimiento: exito.codigoSeguimiento, erroresValidacion: [] };
        }
        const fallo = resultado.tramitesFallidos.find((f) => f.id === t.id);
        if (fallo) {
          return { ...t, estado: "CON_ERRORES", erroresValidacion: fallo.errores };
        }
        return t;
      })
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      {/* Header Institucional DICYT UMSS */}
      <header className="bg-primary text-primary-foreground py-6 px-4 md:px-8 border-b border-primary/20 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link href="/" className="inline-flex items-center gap-1 text-xs opacity-80 hover:opacity-100 transition-opacity">
                <ArrowLeft className="w-3.5 h-3.5" /> Volver al Inicio
              </Link>
              <span className="text-xs opacity-50">•</span>
              <span className="text-xs font-semibold uppercase tracking-wider bg-secondary/80 px-2 py-0.5 rounded text-secondary-foreground">
                SIGEFI DICYT UMSS
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              Creación y Envío de Trámites de Adquisición
            </h1>
            <p className="text-xs opacity-90 mt-1 max-w-2xl">
              Sistema automático de auto-clasificación por tipo de compra (Materiales, Activos Fijos y Servicios) con regla de segregación estricta 100% homogénea y envío resiliente.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur rounded-lg border border-white/20 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Segregación Estricta Activa</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 pt-8 space-y-8">
        {/* Formulario de Adición de Ítems */}
        <ItemInputForm onAddItem={handleAddItem} />

        {/* Contenedor de Trámites Segregados */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">
              Trámites Generados Automáticamente por Categoría
            </h2>
          </div>

          <RequisitionContainer
            tramites={tramites}
            onUpdateHeader={handleUpdateHeader}
            onUpdateItem={handleUpdateItem}
            onRemoveItem={handleRemoveItem}
            onSingleSubmitSuccess={handleSingleSubmitSuccess}
            onBatchSubmitSuccess={handleBatchSubmitSuccess}
          />
        </div>
      </main>
    </div>
  );
}
