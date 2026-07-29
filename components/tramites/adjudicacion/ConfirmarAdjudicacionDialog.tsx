"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle, FileText, ArrowDownRight } from "lucide-react";

interface ConfirmarAdjudicacionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmar: (justificacion: string) => Promise<void>;
  isSubmitting: boolean;
  montoSolicitado: number;
  montoAdjudicado: number;
  montoLiberado: number;
  itemsAdjudicadosCount: number;
  itemsTotalCount: number;
  itemsSinStockCount: number;
}

export const ConfirmarAdjudicacionDialog: React.FC<ConfirmarAdjudicacionDialogProps> = ({
  isOpen,
  onClose,
  onConfirmar,
  isSubmitting,
  montoSolicitado,
  montoAdjudicado,
  montoLiberado,
  itemsAdjudicadosCount,
  itemsTotalCount,
  itemsSinStockCount,
}) => {
  const [justificacion, setJustificacion] = useState<string>("");
  const [attemptedSubmit, setAttemptedSubmit] = useState<boolean>(false);

  const esValido = justificacion.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAttemptedSubmit(true);

    if (!esValido) return;

    await onConfirmar(justificacion.trim());
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-card border border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
            <CheckCircle className="w-6 h-6 text-primary" />
            Confirmar Adjudicación del Trámite
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Revise los totales de adjudicación y proporcione el sustento técnico/económico
            obligatorio.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Tarjeta de Resumen Presupuestario */}
          <div className="grid grid-cols-3 gap-3 p-3.5 bg-muted/40 rounded-xl border border-border text-xs">
            <div>
              <span className="text-muted-foreground block font-medium">Monto Solicitado</span>
              <strong className="text-sm font-bold text-foreground">
                Bs. {montoSolicitado.toLocaleString("es-BO", { minimumFractionDigits: 2 })}
              </strong>
            </div>

            <div>
              <span className="text-muted-foreground block font-medium">Monto Adjudicado</span>
              <strong className="text-sm font-bold text-primary">
                Bs. {montoAdjudicado.toLocaleString("es-BO", { minimumFractionDigits: 2 })}
              </strong>
            </div>

            <div>
              <span className="text-muted-foreground block font-medium flex items-center gap-0.5">
                <ArrowDownRight className="w-3.5 h-3.5 text-emerald-600" />
                Monto Liberado
              </span>
              <strong className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                Bs. {montoLiberado.toLocaleString("es-BO", { minimumFractionDigits: 2 })}
              </strong>
            </div>
          </div>

          {/* Estadísticas de ítems */}
          <div className="text-xs text-muted-foreground flex items-center justify-between px-1">
            <span>
              Ítems adjudicados:{" "}
              <strong className="text-foreground">
                {itemsAdjudicadosCount} / {itemsTotalCount}
              </strong>
            </span>
            {itemsSinStockCount > 0 && (
              <span className="text-amber-600 dark:text-amber-400 font-semibold">
                {itemsSinStockCount} ítem(s) marcados sin stock
              </span>
            )}
          </div>

          {/* Campo obligatorio de Justificación General */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-primary" />
              Justificación General de Adjudicación <span className="text-rose-500">*</span>
            </label>
            <Textarea
              rows={4}
              value={justificacion}
              onChange={(e) => setJustificacion(e.target.value)}
              placeholder="Escriba aquí los fundamentos técnicos y económicos para la adjudicación de los ítems seleccionados..."
              className={`text-sm bg-background border-border ${
                attemptedSubmit && !esValido ? "border-rose-500 focus-visible:ring-rose-500" : ""
              }`}
            />
            {attemptedSubmit && !esValido && (
              <p className="text-xs text-rose-500 font-semibold flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                La justificación general es un requisito obligatorio antes de confirmar.
              </p>
            )}
          </div>

          {/* Alerta informativa sobre liberación de preventivo */}
          {montoLiberado > 0 && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-lg text-xs text-emerald-900 dark:text-emerald-300 flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Liberación Presupuestaria Automática:</strong> El saldo de{" "}
                <strong>
                  Bs. {montoLiberado.toLocaleString("es-BO", { minimumFractionDigits: 2 })}
                </strong>{" "}
                no adjudicado por falta de stock se desafectará del Preventivo y retornará de
                inmediato a la partida del proyecto.
              </div>
            </div>
          )}

          <DialogFooter className="pt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-5"
            >
              {isSubmitting ? "Guardando en Supabase..." : "Confirmar Adjudicación"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
