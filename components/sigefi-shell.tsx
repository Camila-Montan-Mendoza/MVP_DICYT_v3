"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Folder, FileText, LogOut, Bell, User, Menu } from "lucide-react";

interface SigefiShellProps {
  children: React.ReactNode;
}

export function SigefiShell({ children }: SigefiShellProps) {
  const pathname = usePathname();

  const isTramitesActive = pathname.startsWith("/tramites");
  const isProyectosActive = pathname.startsWith("/proyectos");

  return (
    <div className="min-h-screen bg-[#f4f6f9] flex flex-col text-[#2c3e50]">
      {/* Header Superior Institucional */}
      <header className="bg-white border-b border-[#e5e7eb] h-14 px-4 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-4">
          <button className="text-[#6b7280] hover:text-[#002855] transition-colors p-1">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-xs md:text-sm text-[#001B47] uppercase tracking-wider">
            Universidad Mayor de San Simón
          </span>
        </div>

        <div className="flex items-center gap-5">
          <button className="relative text-[#6b7280] hover:text-[#002855] transition-colors p-1">
            <Bell className="w-4 h-4" />
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#BC000C] rounded-full" />
          </button>

          <div className="flex items-center gap-2 pl-3 border-l border-[#e5e7eb]">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-[#001B47] leading-none">Investigador</p>
              <p className="text-[11px] text-[#6b7280]">Marcelino Perez</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#002855] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <User className="w-4 h-4" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Body con Sidebar Izquierdo */}
      <div className="flex-1 flex">
        {/* Sidebar Izquierdo */}
        <aside className="w-64 bg-white border-r border-[#e5e7eb] flex flex-col justify-between p-4 hidden md:flex">
          <div className="space-y-6">
            {/* Logo DICYT */}
            <div className="flex items-center gap-3 px-2 py-1">
              <div className="w-10 h-10 rounded-full bg-[#002855]/10 flex items-center justify-center text-[#BC000C] font-black text-xs border border-[#002855]/20">
                ⚛️
              </div>
              <div>
                <h2 className="font-extrabold text-sm text-[#001B47] leading-none">SIGEFI DICYT</h2>
                <p className="text-[10px] font-bold text-[#BC000C] tracking-wider uppercase">SAN SIMON</p>
              </div>
            </div>

            {/* Menú de Navegación */}
            <nav className="space-y-1.5">
              <Link
                href="/proyectos"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  isProyectosActive
                    ? "bg-[#002855] text-white shadow-xs"
                    : "text-[#6b7280] hover:bg-[#f0f4f8] hover:text-[#002855]"
                }`}
              >
                <Folder className="w-4 h-4" />
                Proyectos
              </Link>

              <Link
                href="/tramites"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  isTramitesActive
                    ? "bg-[#002855] text-white shadow-xs"
                    : "text-[#6b7280] hover:bg-[#f0f4f8] hover:text-[#002855]"
                }`}
              >
                <FileText className="w-4 h-4" />
                Trámites
              </Link>
            </nav>
          </div>

          {/* Bottom Sidebar Logout */}
          <div className="pt-4 border-t border-[#e5e7eb]">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-[#6b7280] hover:text-[#BC000C] transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </Link>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 md:p-8 flex flex-col justify-between min-h-[calc(100vh-3.5rem)]">
          <div className="max-w-5xl mx-auto w-full">{children}</div>

          {/* Footer del contenido */}
          <footer className="mt-12 pt-4 border-t border-[#e5e7eb]/80 text-center text-[11px] text-[#9ca3af]">
            © 2024 UNIVERSIDAD MAYOR DE SAN SIMÓN • DPA - SISTEMA DE GESTIÓN
          </footer>
        </main>
      </div>
    </div>
  );
}
