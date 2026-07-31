"use client";

import { useState, useMemo, useCallback } from "react";
import { PartidaCatalogo, PartidaMemoriaCalculo, ProyectoDetalle } from "../types";
import { mockProyectoService } from "../services/mockProyectoService";

export function useMemoriaCalculoEditor(
  proyecto: ProyectoDetalle,
  onProyectoUpdated?: (updated: ProyectoDetalle) => void
) {
  const [partidas, setPartidas] = useState<PartidaMemoriaCalculo[]>(proyecto.memoriaCalculo || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  const presupuestoTotal = proyecto.presupuestoTotal || 100000;

  const totalPartidas = useMemo(() => {
    return partidas.reduce((sum, p) => sum + (Number(p.monto) || 0), 0);
  }, [partidas]);

  const excedente = useMemo(() => {
    return Math.max(0, totalPartidas - presupuestoTotal);
  }, [totalPartidas, presupuestoTotal]);

  const esValidoParaEnviar = useMemo(() => {
    return partidas.length > 0 && excedente === 0 && totalPartidas <= presupuestoTotal;
  }, [partidas.length, excedente, totalPartidas, presupuestoTotal]);

  const updateMonto = useCallback((id: number, nuevoMonto: number) => {
    setPartidas((prev) =>
      prev.map((p) => (p.id === id ? { ...p, monto: isNaN(nuevoMonto) ? 0 : nuevoMonto } : p))
    );
  }, []);

  const removePartida = useCallback((id: number) => {
    setPartidas((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addPartidaFromCatalogo = useCallback((item: PartidaCatalogo) => {
    setPartidas((prev) => {
      if (prev.some((p) => p.id === item.id || String(p.codigoPartida) === item.codigo)) {
        return prev;
      }
      return [
        ...prev,
        {
          id: item.id,
          codigoPartida: item.codigo,
          nombrePartida: item.nombre,
          monto: 0,
        },
      ];
    });
    setIsSearchModalOpen(false);
  }, []);

  const saveMemoriaCalculo = useCallback(async () => {
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/proyectos/${proyecto.id}/memoria-calculo`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partidas }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al guardar");

      const updated =
        data.proyecto || mockProyectoService.updateMemoriaCalculo(proyecto.id, partidas);
      if (onProyectoUpdated) onProyectoUpdated(updated);

      setFeedback({ type: "success", message: "Memoria de cálculo guardada correctamente." });
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Error de red al guardar." });
    } finally {
      setIsSubmitting(false);
    }
  }, [proyecto.id, partidas, onProyectoUpdated]);

  const enviarARevision = useCallback(async () => {
    if (!esValidoParaEnviar) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      // First save current partidas
      await mockProyectoService.updateMemoriaCalculo(proyecto.id, partidas);

      const res = await fetch(`/api/proyectos/${proyecto.id}/enviar-revision`, {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al enviar a revisión");

      const updated = data.proyecto || mockProyectoService.enviarARevision(proyecto.id);
      if (onProyectoUpdated) onProyectoUpdated(updated);

      setFeedback({ type: "success", message: "Proyecto enviado a revisión exitosamente." });
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Error de red al enviar a revisión." });
    } finally {
      setIsSubmitting(false);
    }
  }, [proyecto.id, partidas, esValidoParaEnviar, onProyectoUpdated]);

  const catalogResults = useMemo(() => {
    return mockProyectoService.buscarCatalogoPartidas(searchQuery);
  }, [searchQuery]);

  return {
    partidas,
    totalPartidas,
    presupuestoTotal,
    excedente,
    esValidoParaEnviar,
    searchQuery,
    setSearchQuery,
    catalogResults,
    isSearchModalOpen,
    setIsSearchModalOpen,
    isSubmitting,
    feedback,
    updateMonto,
    removePartida,
    addPartidaFromCatalogo,
    saveMemoriaCalculo,
    enviarARevision,
  };
}
