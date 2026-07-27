"use client";

import { useState } from "react";
import { TramiteSolicitud, EnvioLoteResultado } from "@/types/requisitions";
import { Send, CheckCircle2, AlertOctagon, Info } from "lucide-react";

interface BatchSubmitBarProps {
  tramites: TramiteSolicitud[];
  onBatchSubmitSuccess: (resultado: EnvioLoteResultado) => void;
}

export function BatchSubmitBar({ tramites, onBatchSubmitSuccess }: BatchSubmitBarProps) {
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<EnvioLoteResultado | null>(null);

  const borradores = tramites.filter((t) => t.estado !== "ENVIADO");

  if (tramites.length === 0) return null;

  const handleBatchSubmit = async () => {
    if (borradores.length === 0) return;
    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/requisitions/submit-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tramites: borradores }),
      });

      const data = await res.json();
      if (data.success && data.resultado) {
        setFeedback(data.resultado);
        onBatchSubmitSuccess(data.resultado);
      }
    } catch (err) {
      console.error("Error en envío masivo:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="sticky top-4 z-20 mb-6 bg-card/95 backdrop-blur border border-border p-4 rounded-xl shadow-md space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-sm">Resumen de Trámites Generados ({tramites.length})</h3>
            <p className="text-xs text-muted-foreground">
              {borradores.length} trámite(s) pendiente(s) de envío | Normativa de Segregación Estricta Activa
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={submitting || borradores.length === 0}
          onClick={handleBatchSubmit}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-secondary text-secondary-foreground font-bold text-sm rounded-lg hover:bg-secondary/90 transition-colors shadow-sm disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          {submitting ? "Procesando Lote..." : "Enviar Todos los Trámites"}
        </button>
      </div>

      {/* Retroalimentación clara del envío en lote resiliente */}
      {feedback && (
        <div className="space-y-2 pt-2 border-t border-border/60 text-xs">
          {feedback.tramitesExitosos.length > 0 && (
            <div className="p-2.5 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 rounded-lg flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>
                {feedback.tramitesExitosos.length} trámite(s) enviado(s) exitosamente:{" "}
                {feedback.tramitesExitosos.map((t) => `${t.categoria} (${t.codigoSeguimiento})`).join(", ")}
              </span>
            </div>
          )}

          {feedback.tramitesFallidos.length > 0 && (
            <div className="p-2.5 bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-200 rounded-lg flex items-center gap-2 font-medium">
              <AlertOctagon className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                {feedback.tramitesFallidos.length} trámite(s) no se enviaron por datos pendientes. Revise las tarjetas en pantalla para corregir los campos señalados.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
