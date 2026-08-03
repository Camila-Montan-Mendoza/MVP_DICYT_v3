import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationControls,
  PaginationInfo,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { EstadoProyectoBadge } from "./EstadoProyectoBadge";
import { ProyectoListItem } from "../types";
import React from "react";
import { Tag } from "lucide-react"; // Importar Tag para el icono

interface ProyectosTableProps {
  proyectos: ProyectoListItem[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onSelectProyecto: (proyecto: ProyectoListItem) => void;
}

function formatPresupuesto(monto: number): string {
  return `${monto.toLocaleString("es-BO")} Bs`;
}

export function ProyectosTable({
  proyectos,
  total,
  page,
  pageSize,
  onPageChange,
  onSelectProyecto,
}: ProyectosTableProps) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="p-4"> {/* Padding alrededor del contenedor de la tabla */}
      <div className="bg-white border border-border rounded-lg overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-border text-muted-foreground uppercase text-[11px] font-semibold tracking-wider">
                <th className="py-2.5 px-3.5 w-32">Código</th>
                <th className="py-2.5 px-3.5">Nombre del Proyecto</th>
                <th className="py-2.5 px-3.5 w-40">Estado</th>
                <th className="py-2.5 px-3.5 w-48">Investigador Principal</th>
                <th className="py-2.5 px-3.5 text-right w-24">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {proyectos.map((proyecto) => (
                <tr
                  key={proyecto.id}
                  className="hover:bg-blue-50/40 transition-colors cursor-pointer"
                  onClick={() => onSelectProyecto(proyecto)}
                >
                  <td className="py-2.5 px-3.5 font-bold text-[#003770]">
                    {proyecto.numero || 'N/A'} {/* Usar proyecto.codigo si existe */}
                  </td>
                  <td className="py-2.5 px-3.5 font-medium text-[#001B47]">
                    {proyecto.nombre}
                  </td>
                  <td className="py-2.5 px-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${proyecto.estado
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-orange-100 text-orange-800"
                        }`}
                    >
                      {proyecto.estado.nombre}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 text-[#001B47]">
                    {proyecto.investigadorPrincipal?.nombre ?? "N/A"}
                  </td>
                  <td className="py-2.5 px-3.5 text-right">
                    <button className="text-[#003770] hover:underline text-xs">
                      Ver Detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination component goes here, ensure its styling is consistent */}
      {/* ... existing pagination ... */}
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Anterior
          </button>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page * pageSize >= total}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Siguiente
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Mostrando <span className="font-medium">{(page - 1) * pageSize + 1}</span> a{" "}
              <span className="font-medium">{Math.min(page * pageSize, total)}</span> de{" "}
              <span className="font-medium">{total}</span> resultados
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12.79 5.23a.75.75 0 010 1.06L9.46 10l3.33 3.71a.75.75 0 11-1.06 1.06l-4-4a.75.75 0 010-1.06l4-4a.75.75 0 011.06 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {/* Renderizar números de página si es necesario */}
              {Array.from({ length: Math.ceil(total / pageSize) }, (_, i) => i + 1).map((pNum) => (
                <button
                  key={pNum}
                  onClick={() => onPageChange(pNum)}
                  aria-current={pNum === page ? "page" : undefined}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${pNum === page
                    ? "z-10 bg-[#003770] text-white focus:outline-offset-0"
                    : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    }`}
                >
                  {pNum}
                </button>
              ))}
              <button
                onClick={() => onPageChange(page + 1)}
                disabled={page * pageSize >= total}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 010-1.06L10.54 10 7.21 6.29a.75.75 0 111.06-1.06l4 4a.75.75 0 010 1.06l-4 4a.75.75 0 01-1.06 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
      {/* ... end existing pagination ... */}
    </div>
  );
}

