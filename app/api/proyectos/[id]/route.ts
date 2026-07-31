import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { resolveServerAuthContext } from "@/lib/auth/server-auth-service";
import { usuarioTieneAccesoAProyecto, getProyectoDetalle } from "@/lib/db/proyecto-repository";
import { mockProyectoService } from "@/src/features/proyecto-detalle/services/mockProyectoService";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const proyectoId = parseInt(id, 10);

  if (isNaN(proyectoId)) {
    return NextResponse.json({ message: "Proyecto no encontrado" }, { status: 404 });
  }

  try {
    const supabase = await createClient();
    const authContext = await resolveServerAuthContext(supabase);

    if (authContext) {
      const autorizado = await usuarioTieneAccesoAProyecto(supabase, {
        proyectoId,
        usuarioId: authContext.usuarioId,
        rolActivo: authContext.rolActivo,
      });

      if (!autorizado) {
        return NextResponse.json({ message: "No tiene acceso a este proyecto" }, { status: 403 });
      }

      const proyectoDB = await getProyectoDetalle(supabase, {
        proyectoId,
        rolActivo: authContext.rolActivo,
      });

      if (proyectoDB) {
        return NextResponse.json(proyectoDB, { status: 200 });
      }
    }
  } catch (err) {
    console.warn("[GET /api/proyectos/[id] DB Warning - using mock fallback]:", err);
  }

  // Fallback a Mock Service para funcionamiento robusto offline / demo
  const mockProyecto = mockProyectoService.getProyecto(proyectoId);
  return NextResponse.json(mockProyecto, { status: 200 });
}
