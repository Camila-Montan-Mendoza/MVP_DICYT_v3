"use client";

import { TramiteSolicitud, ArchivoRespaldo } from "@/types/requisitions";
import { uploadAttachmentFile } from "@/lib/supabase/storage";
import { FileText, Paperclip, UserCheck, MapPin } from "lucide-react";

interface TramiteCardHeaderProps {
  tramite: TramiteSolicitud;
  onUpdateHeader: (id: string, updates: Partial<TramiteSolicitud>) => void;
}

export function TramiteCardHeader({ tramite, onUpdateHeader }: TramiteCardHeaderProps) {
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);

    const uploaded: ArchivoRespaldo[] = [];
    for (const f of files) {
      const res = await uploadAttachmentFile(f, "proformas");
      uploaded.push({
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        nombre: res.name,
        path: res.path,
      });
    }

    onUpdateHeader(tramite.id, {
      archivosRespaldo: [...tramite.archivosRespaldo, ...uploaded],
    });
  };

  const removeFile = (fileId: string) => {
    onUpdateHeader(tramite.id, {
      archivosRespaldo: tramite.archivosRespaldo.filter((f) => f.id !== fileId),
    });
  };

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border/60 mb-4">
      {/* Justificación obligatoria */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-primary" />
          Justificación del Trámite *
        </label>
        <textarea
          rows={2}
          required
          placeholder={`Describa la necesidad y objetivo de la compra para este trámite de ${tramite.categoria.toLowerCase()}...`}
          value={tramite.justificacion}
          onChange={(e) => onUpdateHeader(tramite.id, { justificacion: e.target.value })}
          className="w-full p-2.5 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
        />
      </div>

      {/* Custodio y Ubicación condicional para Activos Fijos */}
      {tramite.categoria === "ACTIVO_FIJO" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-secondary/5 border border-secondary/20 rounded-md">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-secondary" />
              Nombre del Custodio *
            </label>
            <input
              type="text"
              required
              placeholder="Nombre del responsable del activo"
              value={tramite.custodioNombre || ""}
              onChange={(e) => onUpdateHeader(tramite.id, { custodioNombre: e.target.value })}
              className="w-full px-2.5 py-1.5 text-sm bg-background border border-border rounded-md text-foreground"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-secondary" />
              Lugar / Laboratorio de Ubicación *
            </label>
            <input
              type="text"
              required
              placeholder="ej. Laboratorio 3 - Edificio DICYT"
              value={tramite.custodioUbicacion || ""}
              onChange={(e) => onUpdateHeader(tramite.id, { custodioUbicacion: e.target.value })}
              className="w-full px-2.5 py-1.5 text-sm bg-background border border-border rounded-md text-foreground"
            />
          </div>
        </div>
      )}

      {/* Adjuntos de Respaldos / Proformas */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Paperclip className="w-3.5 h-3.5 text-primary" />
          Archivos de Respaldo (Proformas / Cotizaciones en PDF o Imagen) *
        </label>

        <div className="flex items-center gap-3">
          <input
            type="file"
            multiple
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileUpload}
            className="text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
          />
        </div>

        {tramite.archivosRespaldo.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {tramite.archivosRespaldo.map((file) => (
              <span
                key={file.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-background border border-border rounded-md text-foreground"
              >
                <Paperclip className="w-3 h-3 text-muted-foreground" />
                {file.nombre}
                <button
                  type="button"
                  onClick={() => removeFile(file.id)}
                  className="text-destructive hover:text-destructive/80 font-bold ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
