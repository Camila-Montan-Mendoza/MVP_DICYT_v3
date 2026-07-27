import { createClient } from "@/lib/supabase/client";

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

interface LoginOption {
  username: string;
  email: string;
  nombreCompleto: string;
  rolLabel: string;
}

// Directorio de acceso rápido para el MVP (SIGEFI DICYT, 7 actores operativos).
// Solo resuelve username -> email y aporta el nombre para mostrar en la UI;
// la identidad y el rol reales se leen siempre de Supabase (auth.users +
// usuario/rol_usuario) después de iniciar sesión.
export const LOGIN_OPTIONS: LoginOption[] = [
  { username: "daniel", email: "daniel.perez@umss.edu.bo", nombreCompleto: "Dr. Daniel Pérez", rolLabel: "Investigador Principal" },
  { username: "winsor", email: "winsor@umss.edu.bo", nombreCompleto: "Ing. Winsor", rolLabel: "Investigador de Apoyo" },
  { username: "alan", email: "alan.salazar@umss.edu.bo", nombreCompleto: "Lic. Alan Salazar", rolLabel: "Responsable de Presupuestos" },
  { username: "grober", email: "grover.villarroel@umss.edu.bo", nombreCompleto: "Ing. Grover Villarroel", rolLabel: "Compras y Contrataciones" },
  { username: "eva", email: "eva.dicyt@umss.edu.bo", nombreCompleto: "Dra. Eva", rolLabel: "Administradora DICYT" },
  { username: "sergio", email: "sergio.fondos@umss.edu.bo", nombreCompleto: "Lic. Sergio", rolLabel: "Caja Chica y Fondos" },
  { username: "carlos", email: "carlos.admin@umss.edu.bo", nombreCompleto: "Ing. Carlos", rolLabel: "Administrador del Sistema SIGEFI" },
];

function resolveLoginEmail(usernameOrEmail: string): string {
  const trimmed = usernameOrEmail.trim().toLowerCase();
  const match = LOGIN_OPTIONS.find((o) => o.username === trimmed);
  return match ? match.email : usernameOrEmail.trim();
}

export async function loginWithUsername(
  usernameOrEmail: string,
  password: string
): Promise<string | null> {
  const supabase = createClient();
  const email = resolveLoginEmail(usernameOrEmail);
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return error ? error.message : null;
}

export async function getCurrentUser(): Promise<UsuarioSchema | null> {
  try {
    const supabase = createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    if (!authUser) return null;

    const { data, error } = await supabase
      .from("usuario")
      .select("id, username, rol_usuario(rol(id, nombre))")
      .eq("auth_user_id", authUser.id)
      .maybeSingle();

    if (error || !data) return null;

    const roles: RolSchema[] =
      (data.rol_usuario as unknown as { rol: RolSchema }[] | null)?.map((ru) => ru.rol) ?? [];
    const option = LOGIN_OPTIONS.find((o) => o.username === data.username);

    return {
      id: data.id,
      username: data.username,
      nombreCompleto: option?.nombreCompleto ?? data.username,
      email: authUser.email ?? "",
      roles,
      rolActivo: roles[0]?.nombre ?? option?.rolLabel ?? "",
    };
  } catch {
    return null;
  }
}

export async function logoutSession(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
}
