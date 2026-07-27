"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Folder,
  FileText,
  LogOut,
  Bell,
  User,
  Menu,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import {
  getCurrentUser,
  logoutSession,
  UsuarioSchema,
} from "@/lib/auth/auth-service";

interface SigefiShellProps {
  children: React.ReactNode;
}

export function SigefiShell({ children }: SigefiShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<UsuarioSchema | null>(null);

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  const isDashboardActive = pathname === "/dashboard";
  const isProyectosActive = pathname.startsWith("/proyectos");
  const isTramitesActive = pathname.startsWith("/tramites");
  const isConfigActive = pathname.startsWith("/configuracion");

  const handleLogout = async () => {
    await logoutSession();
    router.push("/auth/login");
  };

  const currentUser = user ?? {
    nombreCompleto: "Cargando...",
    rolActivo: "",
  };

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

        <div className="flex items-center gap-4">
          <button className="relative text-[#6b7280] hover:text-[#002855] transition-colors p-1">
            <Bell className="w-4 h-4" />
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#BC000C] rounded-full" />
          </button>

          {/* Perfil Fijo del Usuario Autenticado */}
          <div className="flex items-center gap-3 pl-3 border-l border-[#e5e7eb]">
            <div className="text-right">
              <p className="text-xs font-extrabold text-[#001B47] leading-none">
                {currentUser.nombreCompleto}
              </p>
              <p className="text-[10px] text-[#6b7280] font-mono mt-0.5">
                Rol:{" "}
                <strong className="text-[#002855]">
                  {currentUser.rolActivo}
                </strong>
              </p>
            </div>

            <div className="w-8 h-8 rounded-full bg-[#002855] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <User className="w-4 h-4" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar and Content */}
      <div className="flex flex-1">
        {/* Sidebar Left Navigation */}
        <aside className="w-64 bg-white border-r border-[#e5e7eb] hidden lg:flex flex-col justify-between p-4 min-h-[calc(100vh-3.5rem)]">
          <div className="space-y-6">
            {/* Logo Marca DICYT */}
            <div className="flex items-center gap-3 px-2 py-1">
              <div className="w-9 h-9 rounded-full bg-[#002855] text-white flex items-center justify-center font-extrabold text-xs tracking-tighter border-2 border-[#BC000C]">
                DICYT
              </div>
              <div>
                <h2 className="font-extrabold text-sm text-[#001B47] tracking-tight leading-none">
                  SIGEFI DICYT
                </h2>
                <span className="text-[10px] text-[#BC000C] font-bold tracking-widest uppercase">
                  SAN SIMÓN
                </span>
              </div>
            </div>

            {/* Menú Principal de Navegación */}
            <nav className="space-y-1 text-xs">
              <Link
                href="/proyectos"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all ${
                  isProyectosActive
                    ? "bg-[#002855] text-white shadow-xs"
                    : "text-[#475569] hover:bg-[#f1f5f9] hover:text-[#002855]"
                }`}
              >
                <Folder className="w-4 h-4" />
                Proyectos
              </Link>

              <Link
                href="/tramites"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all ${
                  isTramitesActive
                    ? "bg-[#002855] text-white shadow-xs"
                    : "text-[#475569] hover:bg-[#f1f5f9] hover:text-[#002855]"
                }`}
              >
                <FileText className="w-4 h-4" />
                Trámites
              </Link>
            </nav>
          </div>

          {/* Bottom Sidebar Logout */}
          <div className="pt-4 border-t border-[#e5e7eb]">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-[#6b7280] hover:text-[#BC000C] transition-colors text-left"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 md:p-8 flex flex-col justify-between min-h-[calc(100vh-3.5rem)]">
          <div className="max-w-6xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
