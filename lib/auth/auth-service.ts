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

// Seeded users mapped to schema roles
export const MOCK_USUARIOS: UsuarioSchema[] = [
  {
    id: 1,
    username: "marcelino",
    nombreCompleto: "Dr. Marcelino Pérez",
    email: "marcelino.perez@umss.edu.bo",
    roles: [
      { id: 1, nombre: "Investigador Principal" },
      { id: 2, nombre: "Solicitante" },
    ],
    rolActivo: "Investigador Principal",
  },
  {
    id: 2,
    username: "alan",
    nombreCompleto: "Lic. Alan Salazar",
    email: "alan.salazar@umss.edu.bo",
    roles: [
      { id: 3, nombre: "Responsable de Presupuestos" },
    ],
    rolActivo: "Responsable de Presupuestos",
  },
  {
    id: 3,
    username: "grober",
    nombreCompleto: "Ing. Grober Villarroel",
    email: "grober.villarroel@umss.edu.bo",
    roles: [
      { id: 4, nombre: "Compras y Contrataciones" },
    ],
    rolActivo: "Compras y Contrataciones",
  },
  {
    id: 4,
    username: "admin",
    nombreCompleto: "Fernando Ramírez",
    email: "fernando.ramirez@umss.edu.bo",
    roles: [
      { id: 5, nombre: "Administrador DICYT" },
    ],
    rolActivo: "Administrador DICYT",
  },
];

export function getStoredUser(): UsuarioSchema | null {
  if (typeof window === "undefined") return MOCK_USUARIOS[0];
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      // Default initial session for Marcelino
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
