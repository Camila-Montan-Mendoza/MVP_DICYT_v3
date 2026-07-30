import React from 'react';
import { Download, Printer } from 'lucide-react';

interface PrintExecutiveSummaryProps {
  onPrint?: () => void;
}

export function PrintExecutiveSummary({ onPrint }: PrintExecutiveSummaryProps) {
  const handlePrint = () => {
    if (onPrint) onPrint();
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#003770] bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors shadow-2xs"
      title="Exportar resumen ejecutivo en PDF o imprimir"
    >
      <Printer className="w-4 h-4" />
      <span className="hidden sm:inline">Exportar PDF</span>
    </button>
  );
}
