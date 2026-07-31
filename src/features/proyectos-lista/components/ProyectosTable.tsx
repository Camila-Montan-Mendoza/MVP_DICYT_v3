import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Pagination,
  PaginationControls,
  PaginationInfo,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { EstadoProyectoBadge } from "./EstadoProyectoBadge";
import { ProyectoListItem } from "../types";

interface ProyectosTableProps {
  proyectos: ProyectoListItem[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onSelectProyecto?: (proyecto: ProyectoListItem) => void;
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
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>N°</TableHead>
            <TableHead>Proyecto</TableHead>
            <TableHead>Presupuesto</TableHead>
            <TableHead>Estado Actual</TableHead>
            <TableHead>Investigador Principal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {proyectos.map((proyecto) => (
            <TableRow
              key={proyecto.id}
              onClick={onSelectProyecto ? () => onSelectProyecto(proyecto) : undefined}
              className={onSelectProyecto ? "cursor-pointer" : undefined}
            >
              <TableCell className="text-muted-foreground">
                {String(proyecto.numero).padStart(2, "0")}
              </TableCell>
              <TableCell className="font-semibold text-[#001B47]">{proyecto.nombre}</TableCell>
              <TableCell>{formatPresupuesto(proyecto.presupuesto)}</TableCell>
              <TableCell>
                <EstadoProyectoBadge estadoId={proyecto.estado.id} nombre={proyecto.estado.nombre} />
              </TableCell>
              <TableCell>{proyecto.investigadorPrincipal?.nombre ?? "Sin asignar"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {total > 0 && (
        <Pagination className="px-4 py-3">
          <PaginationInfo>
            Mostrando {from}-{to} de {total} proyectos
          </PaginationInfo>
          <PaginationControls>
            <PaginationPrevious
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
            />
            <PaginationNext
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
            />
          </PaginationControls>
        </Pagination>
      )}
    </div>
  );
}
