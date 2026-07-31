"use client";

import { useState, useMemo } from "react";
import { Search, X, Plus, AlertTriangle } from "lucide-react";
import { MovimientoPartidaItem } from "../types/modificacion";

interface PartidaModalItem {
  id: number;
  codigo: string;
  nombre: string;
  saldoActual: number;
  esDeficitaria?: boolean;
}

const PARTIDAS_PROYECTO_DEFAULT: PartidaModalItem[] = [
  { id: 31120, codigo: "31120", nombre: "Alimentación y Similares", saldoActual: 2115.32 },
  { id: 32300, codigo: "32300", nombre: "Libros y Manuales", saldoActual: 5.0 },
  {
    id: 39700,
    codigo: "39700",
    nombre: "Material Eléctrico",
    saldoActual: 8.0,
    esDeficitaria: true,
  },
  { id: 22120, codigo: "22120", nombre: "Pasajes Exterior", saldoActual: 1020.0 },
  { id: 34600, codigo: "34600", nombre: "Productos Metálicos", saldoActual: 450.0 },
  { id: 39100, codigo: "39100", nombre: "Material de Limpieza", saldoActual: 1000.0 },
  { id: 39800, codigo: "39800", nombre: "Repuestos y Accesorios", saldoActual: 1000.0 },
  { id: 22110, codigo: "22110", nombre: "Pasajes Interior", saldoActual: 2240.24 },
  { id: 22210, codigo: "22210", nombre: "Viáticos Interior", saldoActual: 5000.0 },
  { id: 23200, codigo: "23200", nombre: "Alquiler de equipos", saldoActual: 0.01 },
];

interface ModificarPresupuestoModalProps {
  isOpen: boolean;
  montoDeficitario?: number;
  onClose: () => void;
  onConfirmAgregar: (
    partidasAfectadas: MovimientoPartidaItem[],
    partidasBeneficiadas: MovimientoPartidaItem[]
  ) => void;
}

function formatMonto(monto: number): string {
  return `${monto.toLocaleString("es-BO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs`;
}

export function ModificarPresupuestoModal({
  isOpen,
  montoDeficitario = 1234.0,
  onClose,
  onConfirmAgregar,
}: ModificarPresupuestoModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"TODAS" | "CON_SALDO" | "DEFICITARIA">("TODAS");
  const [showDeficitAlert, setShowDeficitAlert] = useState(true);

  // Inputs por partidaId: { [id]: { quitado: number, aumentado: number } }
  const [montosInput, setMontosInput] = useState<{
    [id: number]: { quitado: string; aumentado: string };
  }>({});

  const handleInputChange = (id: number, field: "quitado" | "aumentado", value: string) => {
    const partida = PARTIDAS_PROYECTO_DEFAULT.find((p) => p.id === id);
    let finalValue = value;

    // Validación en el Quitar: Solo > 0 y <= saldoActual
    if (field === "quitado" && partida && value !== "") {
      const valNum = parseFloat(value);
      if (!isNaN(valNum)) {
        if (valNum > partida.saldoActual) {
          finalValue = partida.saldoActual.toString();
        } else if (valNum < 0) {
          finalValue = "0";
        }
      }
    }

    if (field === "aumentado" && value !== "") {
      const valNum = parseFloat(value);
      if (!isNaN(valNum) && valNum < 0) {
        finalValue = "0";
      }
    }

    setMontosInput((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: finalValue,
      },
    }));
  };

  const filteredPartidas = PARTIDAS_PROYECTO_DEFAULT.filter((p) => {
    const q = searchTerm.toLowerCase().trim();
    const matchSearch =
      !q || p.codigo.toLowerCase().includes(q) || p.nombre.toLowerCase().includes(q);

    if (!matchSearch) return false;

    if (filterType === "CON_SALDO") return p.saldoActual > 0;
    if (filterType === "DEFICITARIA") return Boolean(p.esDeficitaria);

    return true;
  });

  // Calculados
  const { totalQuitar, totalAumentar, afectadas, beneficiadas } = useMemo(() => {
    let tQuitar = 0;
    let tAumentar = 0;
    const afec: MovimientoPartidaItem[] = [];
    const ben: MovimientoPartidaItem[] = [];

    PARTIDAS_PROYECTO_DEFAULT.forEach((p) => {
      const inp = montosInput[p.id];
      if (inp) {
        const valQuit = parseFloat(inp.quitado) || 0;
        const valAum = parseFloat(inp.aumentado) || 0;

        if (valQuit > 0) {
          tQuitar += valQuit;
          afec.push({
            id: `de-${p.id}`,
            partidaId: p.id,
            codigo: p.codigo,
            descripcion: p.nombre,
            saldoActual: p.saldoActual,
            monto: valQuit,
            tipo: "QUITAR",
          });
        }

        if (valAum > 0) {
          tAumentar += valAum;
          ben.push({
            id: `a-${p.id}`,
            partidaId: p.id,
            codigo: p.codigo,
            descripcion: p.nombre,
            saldoActual: p.saldoActual,
            monto: valAum,
            tipo: "AUMENTAR",
          });
        }
      }
    });

    return { totalQuitar: tQuitar, totalAumentar: tAumentar, afectadas: afec, beneficiadas: ben };
  }, [montosInput]);

  // Regla: Total Aumentado debe ser EXACTAMENTE IGUAL a Total Quitado
  const desbalance = Math.abs(totalQuitar - totalAumentar);
  const esDesbalanceado = (totalQuitar > 0 || totalAumentar > 0) && desbalance > 0.009;
  const isFormInvalid = esDesbalanceado || (totalQuitar === 0 && totalAumentar === 0);

  const handleConfirm = () => {
    if (isFormInvalid) return;
    onConfirmAgregar(afectadas, beneficiadas);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in-50 zoom-in-95">
        {/* Header Modal */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#001B47]">Modificar Presupuesto</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Proyecto <span className="font-bold text-[#001B47]">PT09FC001</span> | Selecciona
              partidas origen (-) y destino (+)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Floating Red Deficit Banner */}
        {showDeficitAlert && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-red-100 text-[#BC000C] flex items-center justify-center font-bold text-xs shrink-0">
                !
              </div>
              <div>
                <span className="text-[11px] font-extrabold text-[#BC000C] uppercase tracking-wider block">
                  DÉFICIT DETECTADO
                </span>
                <p className="text-xs font-bold text-red-950">
                  Partida 39700 requiere {formatMonto(montoDeficitario)} adicionales para proceder
                  con la compra.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowDeficitAlert(false)}
              className="text-xs font-bold text-[#BC000C] hover:underline px-2 py-1"
            >
              Ignorar
            </button>
          </div>
        )}

        {/* Bar Search + Filters */}
        <div className="p-6 pb-2 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por código o descripción de partida..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001B47] text-slate-800 font-medium"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setFilterType("TODAS")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  filterType === "TODAS"
                    ? "bg-white text-[#001B47] shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Todas las Partidas
              </button>
              <button
                type="button"
                onClick={() => setFilterType("CON_SALDO")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  filterType === "CON_SALDO"
                    ? "bg-white text-[#001B47] shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Con Saldo
              </button>
              <button
                type="button"
                onClick={() => setFilterType("DEFICITARIA")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  filterType === "DEFICITARIA"
                    ? "bg-red-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Deficitarias
              </button>
            </div>
          </div>
        </div>

        {/* Table View */}
        <div className="px-6 py-2 flex-1 overflow-y-auto min-h-[220px]">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-500 font-bold border-y border-slate-200 sticky top-0">
              <tr>
                <th className="px-4 py-3 w-20">Código</th>
                <th className="px-4 py-3">Descripción</th>
                <th className="px-4 py-3 text-right w-32">SALDO ACTUAL</th>
                <th className="px-4 py-3 text-center w-28">Quitar (-)</th>
                <th className="px-4 py-3 text-center w-28">Aumentar (+)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredPartidas.map((partida) => {
                const isDeficitaria = partida.esDeficitaria;
                const inp = montosInput[partida.id] || { quitado: "", aumentado: "" };
                const valQuitNum = parseFloat(inp.quitado) || 0;
                const isExceeding = valQuitNum > partida.saldoActual;

                return (
                  <tr
                    key={partida.id}
                    className={`hover:bg-slate-50/70 transition-colors ${
                      isDeficitaria ? "bg-red-50/30" : ""
                    }`}
                  >
                    <td className="px-4 py-3 font-bold font-mono text-[#001B47]">
                      {partida.codigo}
                    </td>
                    <td
                      className={`px-4 py-3 ${
                        isDeficitaria ? "font-bold text-[#BC000C]" : "text-slate-800"
                      }`}
                    >
                      {partida.nombre}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-700">
                      {formatMonto(partida.saldoActual)}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <input
                        type="number"
                        min={0}
                        max={partida.saldoActual}
                        placeholder="0"
                        value={inp.quitado}
                        onChange={(e) => handleInputChange(partida.id, "quitado", e.target.value)}
                        className={`w-20 text-center py-1 text-xs border rounded-lg focus:outline-none font-bold ${
                          isExceeding
                            ? "border-red-500 bg-red-50 text-red-700 focus:ring-2 focus:ring-red-500"
                            : "border-slate-300 focus:ring-2 focus:ring-[#001B47] text-slate-800"
                        }`}
                      />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <input
                        type="number"
                        min={0}
                        placeholder="0"
                        value={inp.aumentado}
                        onChange={(e) => handleInputChange(partida.id, "aumentado", e.target.value)}
                        className="w-20 text-center py-1 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-800 font-bold"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Metrics & Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-8 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                TOTAL QUITAR
              </span>
              <span className="text-base font-extrabold font-mono text-[#BC000C]">
                {formatMonto(totalQuitar)}
              </span>
            </div>

            <div className="border-l border-slate-300 pl-8">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                TOTAL AUMENTAR
              </span>
              <span className="text-base font-extrabold font-mono text-emerald-700">
                {formatMonto(totalAumentar)}
              </span>
            </div>

            {esDesbalanceado && (
              <div className="flex items-center gap-1.5 text-xs text-[#BC000C] bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>
                  El Total Aumentado debe ser igual al Total Quitado (Diferencia:{" "}
                  {formatMonto(desbalance)})
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="button"
              disabled={isFormInvalid}
              onClick={handleConfirm}
              className="px-6 py-2.5 bg-[#001B47] text-white font-bold text-xs rounded-xl hover:bg-[#002855] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar movimientos</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
