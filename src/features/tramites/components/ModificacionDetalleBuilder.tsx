"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  MinusCircle,
  PlusCircle,
  XCircle,
  Check,
  List,
} from "lucide-react";
import { MovimientoPartidaItem } from "../types/modificacion";

interface ModificacionDetalleBuilderProps {
  initialAfectadas?: MovimientoPartidaItem[];
  initialBeneficiadas?: MovimientoPartidaItem[];
  onOpenListaPartidasModal?: () => void;
  onSavedSuccess?: () => void;
}

const DEFAULT_AFECTADAS: MovimientoPartidaItem[] = [
  {
    id: "af-1",
    partidaId: 31120,
    codigo: "31120",
    descripcion: "Alimentación y Similares",
    saldoActual: 2115.32,
    monto: 2115.32,
    tipo: "QUITAR",
  },
  {
    id: "af-2",
    partidaId: 32300,
    codigo: "32300",
    descripcion: "Libros y Manuales",
    saldoActual: 5.0,
    monto: 5.0,
    tipo: "QUITAR",
  },
  {
    id: "af-3",
    partidaId: 34600,
    codigo: "34600",
    descripcion: "Productos Metálicos",
    saldoActual: 190.0,
    monto: 100.0,
    tipo: "QUITAR",
  },
  {
    id: "af-4",
    partidaId: 39700,
    codigo: "39700",
    descripcion: "Material Eléctrico",
    saldoActual: 8.0,
    monto: 8.0,
    tipo: "QUITAR",
  },
  {
    id: "af-5",
    partidaId: 22120,
    codigo: "22120",
    descripcion: "Pasajes Exterior",
    saldoActual: 1020.0,
    monto: 1000.0,
    tipo: "QUITAR",
  },
];

const DEFAULT_BENEFICIADAS: MovimientoPartidaItem[] = [
  {
    id: "ben-1",
    partidaId: 39100,
    codigo: "39100",
    descripcion: "Material de Limpieza",
    saldoActual: 1000.0,
    monto: 2000.0,
    tipo: "AUMENTAR",
  },
  {
    id: "ben-2",
    partidaId: 39800,
    codigo: "39800",
    descripcion: "Repuestos y Accesorios",
    saldoActual: 1000.0,
    monto: 1500.0,
    tipo: "AUMENTAR",
  },
  {
    id: "ben-3",
    partidaId: 22110,
    codigo: "22110",
    descripcion: "Pasajes Interior",
    saldoActual: 2240.24,
    monto: 2500.0,
    tipo: "AUMENTAR",
  },
  {
    id: "ben-4",
    partidaId: 22210,
    codigo: "22210",
    descripcion: "Viáticos Interior",
    saldoActual: 5000.0,
    monto: 3240.24,
    tipo: "AUMENTAR",
  },
  {
    id: "ben-5",
    partidaId: 23200,
    codigo: "23200",
    descripcion: "Alquiler de equipos",
    saldoActual: 0.01,
    monto: 0.01,
    tipo: "AUMENTAR",
  },
];

function formatMonto(monto: number): string {
  return `${monto.toLocaleString("es-BO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function ModificacionDetalleBuilder({
  initialAfectadas = DEFAULT_AFECTADAS,
  initialBeneficiadas = DEFAULT_BENEFICIADAS,
  onOpenListaPartidasModal,
  onSavedSuccess,
}: ModificacionDetalleBuilderProps) {
  const router = useRouter();

  const [afectadas, setAfectadas] = useState<MovimientoPartidaItem[]>(initialAfectadas);
  const [beneficiadas, setBeneficiadas] = useState<MovimientoPartidaItem[]>(initialBeneficiadas);

  const [searchAfectadas, setSearchAfectadas] = useState("");
  const [searchBeneficiadas, setSearchBeneficiadas] = useState("");

  const [justificacionTexto, setJustificacionTexto] = useState(
    "Con estas modificaciones, no se afectarán a los objetivos del proyecto y más bien se dará más incidencia a la difusión de resultados de investigación, permitiendo la adquisición de insumos críticos para la fase experimental y garantizando la movilidad del equipo técnico a las estaciones regionales."
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Totales
  const totalQuitado = useMemo(() => {
    return afectadas.reduce((sum, item) => sum + (item.monto || 0), 0);
  }, [afectadas]);

  const totalAumentado = useMemo(() => {
    return beneficiadas.reduce((sum, item) => sum + (item.monto || 0), 0);
  }, [beneficiadas]);

  const balance = Math.abs(totalQuitado - totalAumentado);
  const esValido = balance < 0.01 && totalQuitado > 0;

  // Auto Codigos Justificacion (Ordenados de menor a mayor)
  const codigosDeOrdenados = useMemo(() => {
    return [...afectadas]
      .map((p) => p.codigo)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .join(", ");
  }, [afectadas]);

  const codigosAOrdenados = useMemo(() => {
    return [...beneficiadas]
      .map((p) => p.codigo)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .join(", ");
  }, [beneficiadas]);

  // Handlers para Afectadas
  const handleUpdateMontoAfectada = (id: string, newMontoStr: string) => {
    const val = parseFloat(newMontoStr) || 0;
    setAfectadas((prev) => prev.map((item) => (item.id === id ? { ...item, monto: val } : item)));
  };

  const handleRemoveAfectada = (id: string) => {
    setAfectadas((prev) => prev.filter((item) => item.id !== id));
  };

  // Handlers para Beneficiadas
  const handleUpdateMontoBeneficiada = (id: string, newMontoStr: string) => {
    const val = parseFloat(newMontoStr) || 0;
    setBeneficiadas((prev) =>
      prev.map((item) => (item.id === id ? { ...item, monto: val } : item))
    );
  };

  const handleRemoveBeneficiada = (id: string) => {
    setBeneficiadas((prev) => prev.filter((item) => item.id !== id));
  };

  const handleConfirmarModificacion = async () => {
    if (!esValido) {
      setErrorMessage(
        "El presupuesto no está cuadrado. El Total Quitado debe ser igual al Total Aumentado."
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/tramites/modificaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proyectoId: 2,
          proyectoNombre: "Implementación de Inteligencia Artificial en Procesos Agrícolas",
          proyectoCodigo: "PT09FC001",
          solicitanteNombre: "Ing. Iván Méndez Velásquez",
          partidasAfectadas: afectadas,
          partidasBeneficiadas: beneficiadas,
          justificacionTexto,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al registrar la modificación");
      }

      if (onSavedSuccess) {
        onSavedSuccess();
      } else {
        router.push("/tramites");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Error de comunicación con el servidor");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAfectadas = afectadas.filter((item) => {
    const q = searchAfectadas.toLowerCase().trim();
    return (
      !q || item.codigo.toLowerCase().includes(q) || item.descripcion.toLowerCase().includes(q)
    );
  });

  const filteredBeneficiadas = beneficiadas.filter((item) => {
    const q = searchBeneficiadas.toLowerCase().trim();
    return (
      !q || item.codigo.toLowerCase().includes(q) || item.descripcion.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-slate-500">
            Trámites / Detalle de Trámite{" "}
            <span className="font-bold text-slate-700">#TR-2026-0089</span>
          </p>
          <h1 className="text-xl font-extrabold text-[#001B47] mt-0.5">
            Modificación Presupuestaria
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Proyecto <span className="font-bold text-[#001B47]">PT09FC001</span> | Solicitante:{" "}
            <span className="font-bold text-slate-700">Ing. Iván Méndez Velásquez</span>
          </p>
        </div>

        {onOpenListaPartidasModal && (
          <button
            type="button"
            onClick={onOpenListaPartidasModal}
            className="px-6 py-2.5 bg-white border border-slate-300 text-[#001B47] font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors shadow-2xs flex items-center justify-center gap-2 self-start sm:self-auto uppercase tracking-wider"
          >
            <List className="w-4 h-4 text-[#001B47]" />
            <span>LISTA PARTIDAS</span>
          </button>
        )}
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Grid 2 Paneles de Partidas (Afectadas vs Beneficiadas) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel Izquierdo: Partidas Afectadas (De) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
          <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <MinusCircle className="w-4 h-4 text-[#BC000C]" />
              <h3 className="text-xs font-bold text-[#001B47]">Partidas Afectadas (De)</h3>
            </div>
            <div className="relative w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar partidas..."
                value={searchAfectadas}
                onChange={(e) => setSearchAfectadas(e.target.value)}
                className="w-full pl-8 pr-2 py-1 text-[11px] bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#001B47]"
              />
            </div>
          </div>

          <div className="p-4 flex-1 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 w-8"></th>
                  <th className="py-2.5 px-2">PARTIDA</th>
                  <th className="py-2.5 px-2">DESCRIPCIÓN</th>
                  <th className="py-2.5 px-2 text-right">SALDO ACTUAL</th>
                  <th className="py-2.5 px-2 text-center w-28">QUITAR (-)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredAfectadas.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 pr-2">
                      <button
                        type="button"
                        onClick={() => handleRemoveAfectada(item.id)}
                        className="text-slate-400 hover:text-red-600 transition-colors p-1"
                        title="Eliminar partida"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                    <td className="py-3 px-2 font-bold font-mono text-[#001B47]">{item.codigo}</td>
                    <td className="py-3 px-2 text-slate-800">{item.descripcion}</td>
                    <td className="py-3 px-2 text-right font-mono text-slate-600">
                      {formatMonto(item.saldoActual)}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <input
                        type="number"
                        min={0}
                        max={item.saldoActual}
                        value={item.monto}
                        onChange={(e) => handleUpdateMontoAfectada(item.id, e.target.value)}
                        className="w-24 text-center py-1 text-xs border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-red-700 font-extrabold"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Panel Derecho: Partidas Beneficiadas (A) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
          <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-[#003770]" />
              <h3 className="text-xs font-bold text-[#001B47]">Partidas Beneficiadas (A)</h3>
            </div>
            <div className="relative w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar partidas..."
                value={searchBeneficiadas}
                onChange={(e) => setSearchBeneficiadas(e.target.value)}
                className="w-full pl-8 pr-2 py-1 text-[11px] bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#001B47]"
              />
            </div>
          </div>

          <div className="p-4 flex-1 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 w-8"></th>
                  <th className="py-2.5 px-2">PARTIDA</th>
                  <th className="py-2.5 px-2">DESCRIPCIÓN</th>
                  <th className="py-2.5 px-2 text-right">SALDO ACTUAL</th>
                  <th className="py-2.5 px-2 text-center w-28">AUMENTAR (+)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredBeneficiadas.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 pr-2">
                      <button
                        type="button"
                        onClick={() => handleRemoveBeneficiada(item.id)}
                        className="text-slate-400 hover:text-red-600 transition-colors p-1"
                        title="Eliminar partida"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                    <td className="py-3 px-2 font-bold font-mono text-[#001B47]">{item.codigo}</td>
                    <td className="py-3 px-2 text-slate-800">{item.descripcion}</td>
                    <td className="py-3 px-2 text-right font-mono text-slate-600">
                      {formatMonto(item.saldoActual)}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <input
                        type="number"
                        min={0}
                        value={item.monto}
                        onChange={(e) => handleUpdateMontoBeneficiada(item.id, e.target.value)}
                        className="w-24 text-center py-1 text-xs border-2 border-indigo-200 bg-slate-50/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001B47] text-[#001B47] font-extrabold"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Card de Estado de Validación de Balance */}
      <div
        className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
          esValido
            ? "bg-emerald-50/60 border-emerald-200 text-emerald-900"
            : "bg-red-50/80 border-red-200 text-red-900"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
              esValido ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
            }`}
          >
            {esValido ? <Check className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider">
              ESTADO DE VALIDACIÓN
            </h4>
            <p className="text-xs font-semibold mt-0.5">
              {esValido
                ? "Balance: 0.00 Bs — Montos Validados"
                : `Diferencia de Balance: ${formatMonto(balance)} Bs — Corrija los montos antes de confirmar.`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-8 text-right self-end sm:self-auto font-mono">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              TOTAL QUITADO
            </span>
            <span className="text-base font-extrabold text-[#BC000C]">
              - {formatMonto(totalQuitado)} Bs
            </span>
          </div>

          <div className="border-l border-slate-200/80 pl-8">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              TOTAL AUMENTADO
            </span>
            <span className="text-base font-extrabold text-emerald-600">
              + {formatMonto(totalAumentado)} Bs
            </span>
          </div>
        </div>
      </div>

      {/* Caja de Justificación */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <label className="block text-xs font-extrabold text-[#001B47] uppercase tracking-wider">
          JUSTIFICACIÓN DE LA MODIFICACIÓN
        </label>

        {/* Códigos Automáticos en 2 cajas paralelas ordenadas de menor a mayor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl">
            <span className="text-[#BC000C] font-extrabold block text-[10px] uppercase tracking-wider mb-0.5">
              De (Partidas Afectadas - Origen):
            </span>
            <span className="font-extrabold text-slate-800 text-xs">
              {codigosDeOrdenados || "N/A"}
            </span>
          </div>

          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
            <span className="text-[#002855] font-extrabold block text-[10px] uppercase tracking-wider mb-0.5">
              A (Partidas Beneficiadas - Destino):
            </span>
            <span className="font-extrabold text-slate-800 text-xs">
              {codigosAOrdenados || "N/A"}
            </span>
          </div>
        </div>

        <textarea
          rows={4}
          value={justificacionTexto}
          onChange={(e) => setJustificacionTexto(e.target.value)}
          placeholder="Escriba el motivo justificativo complementario de la modificación..."
          className="w-full text-xs p-3.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001B47] text-slate-800 bg-white font-normal"
        />
      </div>

      {/* Botones de Acción */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.push("/tramites")}
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-2xs"
        >
          <XCircle className="w-4 h-4 text-slate-400" />
          <span>Cancelar</span>
        </button>

        <button
          type="button"
          onClick={handleConfirmarModificacion}
          disabled={!esValido || isSubmitting}
          className="px-6 py-2.5 bg-[#001B47] text-white font-bold text-xs rounded-xl hover:bg-[#002855] transition-all shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{isSubmitting ? "Procesando..." : "Confirmar Modificación"}</span>
        </button>
      </div>
    </div>
  );
}
