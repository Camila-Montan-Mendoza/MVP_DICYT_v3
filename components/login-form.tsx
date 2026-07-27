"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginWithUsername, LOGIN_OPTIONS } from "@/lib/auth/auth-service";
import { UserCheck, Lock, LogIn, AlertCircle, Shield } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("daniel");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const loginError = await loginWithUsername(username, password);
    setIsLoading(false);
    if (loginError) {
      setError(loginError);
      return;
    }
    router.push("/tramites");
  };

  const handleQuickLogin = async (presetUsername: string) => {
    setUsername(presetUsername);
    setPassword("123456");
    setError(null);
    setIsLoading(true);

    const loginError = await loginWithUsername(presetUsername, "123456");
    setIsLoading(false);
    if (loginError) {
      setError(loginError);
      return;
    }
    router.push("/tramites");
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl border border-[#e5e7eb] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
      {/* Header Institucional de Login */}
      <div className="bg-[#002855] text-white p-6 text-center space-y-2 relative overflow-hidden">
        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto border border-white/20 shadow-inner">
          <Shield className="w-9 h-9 text-white" />
        </div>
        <h2 className="font-extrabold text-xl tracking-tight">SIGEFI DICYT</h2>
        <p className="text-xs text-blue-100/80 max-w-xs mx-auto">
          Sistema de Gestión Financiera y Trámites — Universidad Mayor de San Simón
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Accesos Rápidos por Rol (Para Validación Ágil del MVP) */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider block">
            ACCESO RÁPIDO PARA VALIDACIÓN DEL MVP:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold">
            {LOGIN_OPTIONS.map((u) => (
              <button
                key={u.username}
                type="button"
                onClick={() => handleQuickLogin(u.username)}
                className="p-2.5 bg-[#f8fafc] border border-[#e5e7eb] rounded-xl hover:bg-blue-50 hover:border-blue-300 text-left transition-all flex items-center gap-2 group"
              >
                <div className="w-7 h-7 rounded-lg bg-[#002855] text-white flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-105 transition-transform">
                  {u.nombreCompleto.charAt(0)}
                </div>
                <div className="truncate">
                  <p className="font-extrabold text-[#001B47] text-[11px] truncate leading-tight">
                    {u.nombreCompleto.split(" ")[1] || u.nombreCompleto}
                  </p>
                  <p className="text-[10px] text-[#6b7280] truncate font-mono">
                    {u.rolLabel}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-[#e5e7eb]"></div>
          <span className="flex-shrink mx-3 text-[11px] text-[#9ca3af] font-semibold uppercase">
            o ingrese sus credenciales
          </span>
          <div className="flex-grow border-t border-[#e5e7eb]"></div>
        </div>

        {/* Formulario de Login Estándar */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#001B47] block">
              Nombre de Usuario
            </label>
            <div className="relative">
              <UserCheck className="w-4 h-4 text-[#9ca3af] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Ej: daniel, alan, grober"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-[#e5e7eb] rounded-xl text-[#2c3e50] font-medium focus:outline-none focus:ring-2 focus:ring-[#002855]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#001B47] block">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#9ca3af] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-[#e5e7eb] rounded-xl text-[#2c3e50] font-medium focus:outline-none focus:ring-2 focus:ring-[#002855]"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#002855] text-white font-bold text-xs rounded-xl hover:bg-[#001B47] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>

        <p className="text-[11px] text-center text-[#9ca3af] font-mono">
          Control de Acceso basado en Roles (RBAC) — DPA UMSS 2026
        </p>
      </div>
    </div>
  );
}
