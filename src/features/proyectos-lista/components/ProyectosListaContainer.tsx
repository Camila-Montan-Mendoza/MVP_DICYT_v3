"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { useProyectosLista, resolveProyectoNavigationTarget } from "../hooks/useProyectosLista";
import { ProyectosTable } from "./ProyectosTable";
import { ProyectosFilters } from "./ProyectosFilters";
import { ProyectosEmptyState } from "./ProyectosEmptyState";
import { ProyectoListItem } from "../types";

export function ProyectosListaContainer() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    proyectos,
    total,
    page,
    pageSize,
    setPage,
    isLoading,
    error,
    search,
    setSearch,
    estadoId,
    setEstadoId,
    investigadorId,
    setInvestigadorId,
    clearFilters,
    hasActiveFilters,
  } = useProyectosLista();

  const handleSelectProyecto = (proyecto: ProyectoListItem) => {
    router.push(resolveProyectoNavigationTarget(proyecto, user?.rolActivo));
  };

  return (
    <div className="rounded-lg border border-[#e5e7eb] bg-white">
      <ProyectosFilters
        search={search}
        onSearchChange={setSearch}
        estadoId={estadoId}
        onEstadoIdChange={setEstadoId}
        investigadorId={investigadorId}
        onInvestigadorIdChange={setInvestigadorId}
        onClearFilters={clearFilters}
      />

      {isLoading ? (
        <p className="p-6 text-sm text-[#6b7280]">Cargando proyectos...</p>
      ) : error ? (
        <p className="p-6 text-sm text-red-700">{error}</p>
      ) : total === 0 ? (
        <ProyectosEmptyState variant={hasActiveFilters ? "sin-coincidencias" : "sin-proyectos"} />
      ) : (
        <ProyectosTable
          proyectos={proyectos}
          total={total}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onSelectProyecto={handleSelectProyecto}
        />
      )}
    </div>
  );
}
