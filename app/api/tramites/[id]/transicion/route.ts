import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { WorkflowTransitionService } from "@/lib/workflow/transition-service";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const tramiteId = parseInt(id, 10);

    if (isNaN(tramiteId)) {
      return NextResponse.json(
        { success: false, message: "ID de trámite inválido." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { idTransicion, observaciones, datosExtra } = body;

    if (!idTransicion) {
      return NextResponse.json(
        { success: false, message: "Se requiere especificar 'idTransicion'." },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // ID del usuario responsable (del body si se envía explicitamente, de Supabase Auth, o 1 como fallback)
    const usuarioId = body.usuarioId || (user ? parseInt(user.id, 10) || 1 : 1);

    const result = await WorkflowTransitionService.ejecutarTransicion({
      idTramite: tramiteId,
      idTransicion: parseInt(idTransicion, 10),
      observaciones,
      datosExtra,
      usuarioId,
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Error interno del servidor." },
      { status: 500 }
    );
  }
}
