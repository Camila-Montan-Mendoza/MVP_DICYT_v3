import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PartidaMemoriaCalculo } from "../types";

interface MemoriaCalculoTableProps {
  partidas: PartidaMemoriaCalculo[];
  total: number;
}

function formatMonto(monto: number): string {
  return monto.toLocaleString("es-BO", { minimumFractionDigits: 2 });
}

export function MemoriaCalculoTable({ partidas, total }: MemoriaCalculoTableProps) {
  if (partidas.length === 0) {
    return (
      <p className="p-6 text-center text-sm text-[#6b7280]">
        Este proyecto todavía no tiene partidas registradas en su memoria de cálculo.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Nombre de Partida</TableHead>
          <TableHead className="text-right">Monto (Bs.)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {partidas.map((partida) => (
          <TableRow key={partida.id}>
            <TableCell className="text-[#6b7280]">{partida.codigoPartida}</TableCell>
            <TableCell className="font-semibold text-[#001B47]">{partida.nombrePartida}</TableCell>
            <TableCell className="text-right">{formatMonto(partida.monto)}</TableCell>
          </TableRow>
        ))}
        <TableRow className="bg-[#f0f4f8] hover:bg-[#f0f4f8]">
          <TableCell />
          <TableCell className="font-bold text-[#001B47]">Total Consolidado</TableCell>
          <TableCell className="text-right font-bold text-[#001B47]">{formatMonto(total)}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
