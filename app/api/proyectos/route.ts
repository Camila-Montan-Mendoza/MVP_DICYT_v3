import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { resolveServerAuthContext } from "@/lib/auth/server-auth-service";
import { listProyectosParaUsuario } from "@/lib/db/proyecto-repository";
import { mockProyectoService } from "@/src/features/proyecto-detalle/services/mockProyectoService";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? undefined;
  const estadoIdParam = searchParams.get("estadoId");
  const investigadorIdParam = searchParams.get("investigadorId");
  const pageParam = searchParams.get("page");
  const pageSizeParam = searchParams.get("pageSize");

  try {
    const supabase = await createClient();
    const authContext = await resolveServerAuthContext(supabase);

    if (authContext && authContext.scope) {
      const { proyectos, total, page, pageSize } = await listProyectosParaUsuario(supabase, {
        usuarioId: authContext.usuarioId,
        scope: authContext.scope,
        q: q || undefined,
        estadoId: estadoIdParam ? parseInt(estadoIdParam, 10) : undefined,
        investigadorId: investigadorIdParam ? parseInt(investigadorIdParam, 10) : undefined,
        page: pageParam ? parseInt(pageParam, 10) : undefined,
        pageSize: pageSizeParam ? parseInt(pageSizeParam, 10) : undefined,
      });

      if (proyectos && proyectos.length > 0) {
        return NextResponse.json(
          { proyectos, total, page, pageSize, scope: authContext.scope },
          { status: 200 }
        );
      }
    }
  } catch (err) {
    console.warn("[GET /api/proyectos DB Warning - using mock fallback]:", err);
  }

  // Fallback a Mock Service para proyectos de prueba en todos los estados (Spec 19)
  const mockProyectos = mockProyectoService.getProyectosList();
  let filtrados = mockProyectos;

  if (estadoIdParam) {
    const estId = parseInt(estadoIdParam, 10);
    filtrados = filtrados.filter((p) => p.estado.id === estId);
  }

  if (q) {
    const query = q.toLowerCase();
    filtrados = filtrados.filter(
      (p) => p.nombre.toLowerCase().includes(query) || p.codigo.toLowerCase().includes(query)
    );
  }

  return NextResponse.json(
    {
      proyectos: filtrados,
      total: filtrados.length,
      page: 1,
      pageSize: 10,
      scope: "all",
    },
    { status: 200 }
  );
}
