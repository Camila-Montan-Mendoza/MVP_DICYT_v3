import type { SupabaseClient } from "@supabase/supabase-js";
import { LOGIN_OPTIONS } from "@/lib/auth/auth-service";

export type RolActivoScope = "own" | "all";

export interface ServerAuthContext {
  usuarioId: number;
  rolActivo: string;
  scope: RolActivoScope | null;
}

const ROLES_CON_ACCESO_TOTAL = [
  "Administradora DICyT",
  "Administrador del Sistema SIGEFI",
  "Resp. de Presupuestos",
];

function resolveScope(rolActivo: string): RolActivoScope | null {
  if (rolActivo === "Investigador Principal") return "own";
  if (ROLES_CON_ACCESO_TOTAL.includes(rolActivo)) return "all";
  return null;
}

/**
 * Resuelve { usuarioId, rolActivo, scope } exclusivamente a partir de la sesión
 * Supabase del request. Nunca acepta un rol/usuario indicado por el cliente:
 * el resultado de esta función es la única fuente de verdad de RBAC para los
 * Route Handlers de `app/api/`.
 */
export async function resolveServerAuthContext(
  supabase: SupabaseClient
): Promise<ServerAuthContext | null> {
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  let usuarioId: number | undefined;

  const { data: userRow } = await supabase
    .from("usuario")
    .select("id")
    .or(`auth_user_id.eq.${authUser.id},email.eq.${authUser.email}`)
    .maybeSingle();

  if (userRow?.id) {
    usuarioId = userRow.id;
  }

  const loginOptionMatch = authUser.email
    ? LOGIN_OPTIONS.find(
        (o) =>
          o.email.toLowerCase() === authUser.email!.toLowerCase() ||
          authUser.email!.toLowerCase().includes(o.username.toLowerCase())
      )
    : undefined;

  if (!usuarioId && loginOptionMatch) {
    const idx = LOGIN_OPTIONS.findIndex((o) => o.username === loginOptionMatch.username);
    if (idx !== -1) usuarioId = idx + 1;
  }

  if (!usuarioId) return null;

  let rolActivo: string | undefined;

  const { data: rolRows } = await supabase
    .from("rol_usuario")
    .select("rol(nombre)")
    .eq("id_usuario", usuarioId);

  const primerRol = (rolRows as unknown as { rol: { nombre: string } | null }[] | null)?.find(
    (r) => r.rol?.nombre
  );

  if (primerRol?.rol?.nombre) {
    rolActivo = primerRol.rol.nombre;
  } else if (loginOptionMatch) {
    rolActivo = loginOptionMatch.rolLabel;
  }

  if (!rolActivo) return null;

  return {
    usuarioId,
    rolActivo,
    scope: resolveScope(rolActivo),
  };
}
