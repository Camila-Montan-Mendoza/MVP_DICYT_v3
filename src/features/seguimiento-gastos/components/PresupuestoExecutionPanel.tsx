import React from 'react';
import { Wallet, PiggyBank, Clock, FileCheck, CheckCircle2 } from 'lucide-react';
import { DashboardMetrics } from '../types';
import { formatBolivianos } from '../utils/metrics-calculator';

interface PresupuestoExecutionPanelProps {
  metrics: DashboardMetrics;
  isLoading?: boolean;
}

export function PresupuestoExecutionPanel({ metrics, isLoading }: PresupuestoExecutionPanelProps) {
  const {
    presupuestoVigenteTotal,
    preventivoReservado,
    comprometido,
    gastadoDevengado,
    saldoDisponibleGlobal,
  } = metrics;

  const total = presupuestoVigenteTotal || 1;

  const items = [
    {
      name: 'Saldo Disponible',
      amount: saldoDisponibleGlobal,
      color: '#003770',
      bgColor: 'bg-blue-50 border-blue-200',
      textColor: 'text-[#003770]',
      icon: PiggyBank,
    },
    {
      name: 'Preventivo',
      amount: preventivoReservado,
      color: '#f59e0b',
      bgColor: 'bg-amber-50 border-amber-200',
      textColor: 'text-amber-800',
      icon: Clock,
    },
    {
      name: 'Comprometido',
      amount: comprometido,
      color: '#0284c7',
      bgColor: 'bg-sky-50 border-sky-200',
      textColor: 'text-sky-800',
      icon: FileCheck,
    },
    {
      name: 'Gastado',
      amount: gastadoDevengado,
      color: '#059669',
      bgColor: 'bg-emerald-50 border-emerald-200',
      textColor: 'text-emerald-800',
      icon: CheckCircle2,
    },
  ];

  if (isLoading) {
    return (
      <div className="bg-white border border-border rounded-xl p-6 shadow-sm animate-pulse h-64 flex items-center justify-center">
        <div className="h-6 bg-muted rounded w-1/3" />
      </div>
    );
  }

  // Parámetros para Donut SVG
  const size = 170;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
      {/* Cabecera del Panel con Presupuesto Vigente Total */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h2 className="text-lg font-bold text-[#001B47]">Ejecución Presupuestaria</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Distribución consolidada del presupuesto según su estado
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 flex items-center gap-3">
          <div className="p-2 bg-[#003770] rounded-lg text-white">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Presupuesto
            </span>
            <span className="text-lg font-extrabold text-[#003770]">
              {formatBolivianos(presupuestoVigenteTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* Cuerpo del Panel: Donut SVG + Tarjetas de los 4 Rubros */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Gráfico Donut SVG */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center py-2">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
              {items.map((item, idx) => {
                const pct = (item.amount / total) * 100;
                const strokeDasharray = `${(pct * circumference) / 100} ${circumference}`;
                const strokeDashoffset = -((accumulatedPercent * circumference) / 100);
                accumulatedPercent += pct;

                return (
                  <circle
                    key={idx}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke={item.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-500 hover:opacity-85"
                  />
                );
              })}
            </svg>
            <div className="absolute text-center">
              <span className="text-[10px] text-muted-foreground font-semibold uppercase block">
                Disponible
              </span>
              <span className="text-base font-extrabold text-[#001B47]">
                {Math.round((saldoDisponibleGlobal / total) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* 4 Rubros Explicativos */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((item, idx) => {
            const IconComp = item.icon;
            const pct = Math.round((item.amount / total) * 100);

            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border ${item.bgColor} flex items-start justify-between transition-all hover:shadow-xs`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <IconComp className={`w-4 h-4 ${item.textColor}`} />
                    <span className={`text-xs font-bold ${item.textColor}`}>{item.name}</span>
                  </div>
                  <div className="text-lg font-extrabold text-[#001B47]">
                    {formatBolivianos(item.amount)}
                  </div>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white border border-border ${item.textColor}`}>
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
