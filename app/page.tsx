"use client";

import Link from "next/link";
import { FileText, ArrowRight, ShieldCheck, FolderKanban } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#2c3e50] flex flex-col justify-between">
      {/* Top Bar Institucional UMSS */}
      <header className="bg-white border-b border-[#e5e7eb] px-6 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#002855] text-white flex items-center justify-center font-bold text-xs">
            UMSS
          </div>
          <span className="font-bold text-sm text-[#002855] tracking-wide uppercase">
            Universidad Mayor de San Simón
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-[#6b7280]">
          <span>Sistema de Gestión de Fideicomisos e Investigación (SIGEFI)</span>
        </div>
      </header>

      {/* Main Home Hero */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-16 flex flex-col items-center justify-center text-center space-y-8">
        <div className="p-4 bg-[#002855]/10 rounded-2xl border border-[#002855]/20">
          <ShieldCheck className="w-12 h-12 text-[#002855]" />
        </div>

        <div className="space-y-3 max-w-2xl">
          <span className="inline-block px-3 py-1 bg-[#BC000C]/10 text-[#BC000C] text-xs font-bold rounded-full uppercase tracking-wider">
            Portal DICYT UMSS
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#001B47] tracking-tight">
            Plataforma de Trámites y Adquisiciones
          </h1>
          <p className="text-sm text-[#6b7280] leading-relaxed">
            Bienvenido al módulo de formulación y seguimiento de requerimientos de investigación.
            Administre sus proyectos y organice trámites segregados por categoría de compra.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg pt-4">
          <Link
            href="/tramites"
            className="flex items-center justify-between p-5 bg-white border border-[#e5e7eb] rounded-xl hover:border-[#002855] hover:shadow-md transition-all group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#002855] text-white rounded-lg group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#001B47]">
                  Lista de Compras/Contrataciones
                </h3>
                <p className="text-xs text-[#6b7280]">Ver estado de solicitudes</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#002855] group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/tramites/nuevo"
            className="flex items-center justify-between p-5 bg-white border border-[#e5e7eb] rounded-xl hover:border-[#BC000C] hover:shadow-md transition-all group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#BC000C] text-white rounded-lg group-hover:scale-105 transition-transform">
                <FolderKanban className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#001B47]">Formular Requerimiento</h3>
                <p className="text-xs text-[#6b7280]">Crear nuevo trámite</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#BC000C] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </main>
    </div>
  );
}
