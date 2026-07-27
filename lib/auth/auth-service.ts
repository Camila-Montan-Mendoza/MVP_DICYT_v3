export interface RolSchema {
  id: number;
  nombre: string;
}

export interface UsuarioSchema {
  id: number;
  username: string;
  nombreCompleto: string;
  email: string;
  roles: RolSchema[];
  rolActivo: string;
}

const AUTH_STORAGE_KEY = "sigefi_dicyt_auth_user_v1";

// 7 Operational Actors mapped to official DICYT SIGEFI definition
export const MOCK_USUARIOS: UsuarioSchema[] = [
  {
    id: 1,
    username: "daniel",
    nombreCompleto: "Dr. Daniel Pérez (Investigador Principal)",
    email: "daniel.perez@umss.edu.bo",
    roles: [{ id: 1, nombre: "Investigador Principal" }],
    rolActivo: "Investigador Principal",
  },
  {
    id: 2,
    username: "winsor",
    nombreCompleto: "Ing. Winsor (Investigador de Apoyo)",
    email: "winsor@umss.edu.bo",
    roles: [{ id: 2, nombre: "Investigador de Apoyo" }],
    rolActivo: "Investigador de Apoyo",
  },
  {
    id: 3,
    username: "alan",
    nombreCompleto: "Lic. Alan Salazar (Resp. Presupuestos)",
    email: "alan.salazar@umss.edu.bo",
    roles: [{ id: 3, nombre: "Responsable de Presupuestos" }],
    rolActivo: "Responsable de Presupuestos",
  },
  {
    id: 4,
    username: "grober",
    nombreCompleto: "Ing. Grover Villarroel (Compras y Contrataciones)",
    email: "grover.villarroel@umss.edu.bo",
    roles: [{ id: 4, nombre: "Compras y Contrataciones" }],
    rolActivo: "Compras y Contrataciones",
  },
  {
    id: 5,
    username: "eva",
    nombreCompleto: "Dra. Eva (Administradora DICYT)",
    email: "eva.dicyt@umss.edu.bo",
    roles: [{ id: 5, nombre: "Administradora DICYT" }],
    rolActivo: "Administradora DICYT",
  },
  {
    id: 6,
    username: "sergio",
    nombreCompleto: "Lic. Sergio (Caja Chica y Fondos)",
    email: "sergio.fondos@umss.edu.bo",
    roles: [{ id: 6, nombre: "Caja Chica y Fondos" }],
    rolActivo: "Caja Chica y Fondos",
  },
  {
    id: 7,
    username: "carlos",
    nombreCompleto: "Ing. Carlos (Administrador del Sistema)",
    email: "carlos.admin@umss.edu.bo",
    roles: [{ id: 7, nombre: "Administrador del Sistema SIGEFI" }],
    rolActivo: "Administrador del Sistema SIGEFI",
  },
];

export function getStoredUser(): UsuarioSchema | null {
  if (typeof window === "undefined") return MOCK_USUARIOS[0];
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(MOCK_USUARIOS[0]));
      return MOCK_USUARIOS[0];
    }
    return JSON.parse(raw);
  } catch {
    return MOCK_USUARIOS[0];
  }
}

export function loginWithUsername(username: string): UsuarioSchema | null {
  const found = MOCK_USUARIOS.find(
    (u) => u.username.toLowerCase() === username.toLowerCase().trim()
  );
  if (!found) return null;

  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(found));
  }
  return found;
}

export function logoutSession(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

export function setSessionUser(user: UsuarioSchema): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  }
}
