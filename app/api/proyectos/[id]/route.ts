import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { resolveServerAuthContext } from "@/lib/auth/server-auth-service";
import { usuarioTieneAccesoAProyecto, getProyectoDetalle } from "@/lib/db/proyecto-repository";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const proyectoId = parseInt(id, 10);

  if (isNaN(proyectoId)) {
    return NextResponse.json({ message: "Proyecto no encontrado" }, { status: 404 });
  }

  const supabase = await createClient();
  const authContext = await resolveServerAuthContext(supabase);

  if (!authContext) {
    return NextResponse.json({ message: "No autenticado" }, { status: 401 });
  }

  try {
    const autorizado = await usuarioTieneAccesoAProyecto(supabase, {
      proyectoId,
      usuarioId: authContext.usuarioId,
      rolActivo: authContext.rolActivo,
    });

    if (!autorizado) {
      return NextResponse.json({ message: "No tiene acceso a este proyecto" }, { status: 403 });
    }

    const proyecto = await getProyectoDetalle(supabase, {
      proyectoId,
      rolActivo: authContext.rolActivo,
    });

    if (!proyecto) {
      return NextResponse.json({ message: "Proyecto no encontrado" }, { status: 404 });
    }

    return NextResponse.json(proyecto, { status: 200 });
  } catch (err) {
    console.error("[GET /api/proyectos/[id]]", err);
    return NextResponse.json({ message: "Error al consultar el proyecto" }, { status: 500 });
  }
}
