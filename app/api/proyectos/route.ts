import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { resolveServerAuthContext } from "@/lib/auth/server-auth-service";
import { listProyectosParaUsuario } from "@/lib/db/proyecto-repository";

export async function GET(request: Request) {
  const supabase = await createClient();

  const authContext = await resolveServerAuthContext(supabase);

  if (!authContext) {
    return NextResponse.json({ message: "No autenticado" }, { status: 401 });
  }

  if (!authContext.scope) {
    return NextResponse.json(
      { message: "Rol sin acceso a la lista de proyectos" },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? undefined;
  const estadoIdParam = searchParams.get("estadoId");
  const investigadorIdParam = searchParams.get("investigadorId");
  const pageParam = searchParams.get("page");
  const pageSizeParam = searchParams.get("pageSize");

  try {
    const { proyectos, total, page, pageSize } = await listProyectosParaUsuario(supabase, {
      usuarioId: authContext.usuarioId,
      scope: authContext.scope,
      q: q || undefined,
      estadoId: estadoIdParam ? parseInt(estadoIdParam, 10) : undefined,
      investigadorId: investigadorIdParam ? parseInt(investigadorIdParam, 10) : undefined,
      page: pageParam ? parseInt(pageParam, 10) : undefined,
      pageSize: pageSizeParam ? parseInt(pageSizeParam, 10) : undefined,
    });

    return NextResponse.json(
      { proyectos, total, page, pageSize, scope: authContext.scope },
      { status: 200 }
    );
  } catch (err) {
    console.error("[GET /api/proyectos]", err);
    return NextResponse.json({ message: "Error al consultar proyectos" }, { status: 500 });
  }
}
