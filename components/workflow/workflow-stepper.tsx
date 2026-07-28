"use client";

import { PasoWorkflow } from "@/lib/workflow/stepper-service";
import { Check } from "lucide-react";

interface WorkflowStepperProps {
  pasos: PasoWorkflow[];
  activeStepId: string;
  onSelectStep: (stepId: string) => void;
}

export function WorkflowStepper({ pasos, activeStepId, onSelectStep }: WorkflowStepperProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-[#e5e7eb] shadow-2xs">
      <div className="flex items-center justify-between relative max-w-4xl mx-auto">
        {pasos.map((paso, idx) => {
          const isCompletado = paso.estado === "COMPLETADO";
          const isEnCurso = paso.estado === "EN_CURSO" || (paso.estado as string) === "EN CURSO";
          const isPendiente = paso.estado === "PENDIENTE";
          const isSelected = paso.id === activeStepId;
          const isLast = idx === pasos.length - 1;

          return (
            <div key={paso.id} className="flex-1 flex items-center relative">
              {/* Contenedor del Paso (Círculo + Etiqueta + Badge) */}
              <div
                onClick={() => {
                  if (!isPendiente) {
                    onSelectStep(paso.id);
                  }
                }}
                className={`flex flex-col items-center gap-2 z-10 mx-auto group transition-opacity ${
                  isPendiente ? "cursor-not-allowed opacity-50" : "cursor-pointer opacity-100"
                }`}
              >
                {/* Círculo Numerado del Paso */}
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center font-extrabold text-sm transition-all ${
                    isCompletado
                      ? "bg-[#002855] text-white shadow-md"
                      : isEnCurso
                        ? "border-2 border-[#002855] bg-white text-[#002855] ring-4 ring-[#002855]/10 shadow-md"
                        : "border-2 border-[#cbd5e1] bg-white text-[#9ca3af]"
                  }`}
                >
                  {isCompletado ? <Check className="w-5 h-5 stroke-[3]" /> : paso.numero}
                </div>

                {/* Nombre del Paso */}
                <span
                  className={`text-xs font-bold transition-colors ${
                    isSelected || isEnCurso || isCompletado ? "text-[#001B47]" : "text-[#9ca3af]"
                  }`}
                >
                  {paso.nombre}
                </span>

                {/* Badge de Estado del Paso */}
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                    isCompletado
                      ? "bg-[#e2e8f0] text-[#334155]"
                      : isEnCurso
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-[#f1f5f9] text-[#94a3b8]"
                  }`}
                >
                  {paso.estado.replace("_", " ")}
                </span>
              </div>

              {/* Línea Conectora Horizontal entre Pasos */}
              {!isLast && (
                <div
                  className={`absolute top-5 left-[50%] right-[-50%] h-[2px] -z-0 transition-colors ${
                    isCompletado ? "bg-[#002855]" : "bg-[#e2e8f0]"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
