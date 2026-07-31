"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/auth-context";
import { createClient } from "@/lib/supabase/client";
import { EstadoProyectoId } from "../types";

const ESTADOS: { id: EstadoProyectoId; nombre: string }[] = [
  { id: 1, nombre: "Pendiente de memoria de cálculo" },
  { id: 2, nombre: "En revisión de memoria de cálculo" },
  { id: 3, nombre: "Observado" },
  { id: 4, nombre: "Habilitado para ejecutar partidas" },
];

const ID_ROL_INVESTIGADOR_PRINCIPAL = 1;

interface InvestigadorOption {
  id: number;
  nombre: string;
}

interface ProyectosFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  estadoId: EstadoProyectoId | "all";
  onEstadoIdChange: (value: EstadoProyectoId | "all") => void;
  investigadorId: number | "all";
  onInvestigadorIdChange: (value: number | "all") => void;
  onClearFilters: () => void;
}

export function ProyectosFilters({
  search,
  onSearchChange,
  estadoId,
  onEstadoIdChange,
  investigadorId,
  onInvestigadorIdChange,
  onClearFilters,
}: ProyectosFiltersProps) {
  const { user } = useAuth();
  const canFilterByInvestigador = user?.rolActivo !== "Investigador Principal";

  const [investigadores, setInvestigadores] = useState<InvestigadorOption[]>([]);

  useEffect(() => {
    if (!canFilterByInvestigador) return;

    let cancelled = false;
    const supabase = createClient();

    supabase
      .from("rol_usuario")
      .select("usuario(id, username)")
      .eq("id_rol", ID_ROL_INVESTIGADOR_PRINCIPAL)
      .then(({ data }) => {
        if (cancelled || !data) return;
        const options = (data as any[])
          .filter((row) => row.usuario)
          .map((row) => ({ id: row.usuario.id, nombre: row.usuario.username }));
        setInvestigadores(options);
      });

    return () => {
      cancelled = true;
    };
  }, [canFilterByInvestigador]);

  return (
    <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-1 flex-col gap-4 sm:flex-row">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase text-muted-foreground">Buscar</label>
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Proyecto, código..."
              className="pl-8"
            />
          </div>
        </div>

        {canFilterByInvestigador && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase text-muted-foreground">
              Investigador
            </label>
            <Select
              className="sm:w-56"
              value={investigadorId}
              onChange={(e) =>
                onInvestigadorIdChange(e.target.value === "all" ? "all" : Number(e.target.value))
              }
            >
              <option value="all">Todos</option>
              {investigadores.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.nombre}
                </option>
              ))}
            </Select>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase text-muted-foreground">Estado</label>
          <Select
            className="sm:w-64"
            value={estadoId}
            onChange={(e) =>
              onEstadoIdChange(e.target.value === "all" ? "all" : (Number(e.target.value) as EstadoProyectoId))
            }
          >
            <option value="all">Todos</option>
            {ESTADOS.map((estado) => (
              <option key={estado.id} value={estado.id}>
                {estado.nombre}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <Button variant="outline" size="sm" onClick={onClearFilters} className="gap-1.5">
        <X className="h-3.5 w-3.5" />
        Limpiar filtros
      </Button>
    </div>
  );
}
