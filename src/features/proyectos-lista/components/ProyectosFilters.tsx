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

  // Determine if any filter is active to show "Limpiar" button
  const hasActiveFilters = search !== "" || estadoId !== "all" || investigadorId !== "all";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-[#e5e7eb]">
      <div className="relative flex-1 max-w-xs min-w-[200px]">
        {" "}
        {/* Añadido min-w para evitar que se colapse */}
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar proyecto por nombre o código..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-white border border-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#001B47] placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#003770] focus:border-[#003770] transition-colors"
        />
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {" "}
        {/* Flex-wrap para mejor responsividad */}
        {/* Los filtros de estado e investigador pueden necesitar un ajuste de estilo si no usan un componente común */}
        {/* Por ahora, se asume que son selects o inputs que se ajustarán al layout */}
        {canFilterByInvestigador && (
          <select
            value={investigadorId}
            onChange={(e) =>
              onInvestigadorIdChange(e.target.value === "all" ? "all" : Number(e.target.value))
            }
            className="bg-white border border-border rounded-lg px-3 py-1.5 text-xs text-[#001B47] focus:outline-none focus:ring-1 focus:ring-[#003770] focus:border-[#003770] transition-colors"
          >
            <option value="all">Todos los investigadores</option>
            {investigadores.map((inv) => (
              <option key={inv.id} value={inv.id}>
                {inv.nombre}
              </option>
            ))}
          </select>
        )}
        <select
          value={estadoId}
          onChange={(e) =>
            onEstadoIdChange(
              e.target.value === "all" ? "all" : (Number(e.target.value) as EstadoProyectoId)
            )
          }
          className="bg-white border border-border rounded-lg px-3 py-1.5 text-xs text-[#001B47] focus:outline-none focus:ring-1 focus:ring-[#003770] focus:border-[#003770] transition-colors w-50"
        >
          <option value="all">Todos los estados</option>
          {ESTADOS.map((estado) => (
            <option key={estado.id} value={estado.id}>
              {estado.nombre}
            </option>
          ))}
        </select>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-xs text-muted-foreground hover:text-[#001B47] px-2 py-1.5 rounded-md transition-colors"
          >
            Limpiar
          </button>
        )}
      </div>
    </div>
  );
}

