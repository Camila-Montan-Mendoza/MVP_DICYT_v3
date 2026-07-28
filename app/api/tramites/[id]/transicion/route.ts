import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { WorkflowTransitionService } from "@/lib/workflow/transition-service";
import { LOGIN_OPTIONS } from "@/lib/auth/auth-service";

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
      data: { user: authUser },
    } = await supabase.auth.getUser();

    let usuarioId = body.usuarioId ? parseInt(String(body.usuarioId), 10) : undefined;

    if ((!usuarioId || isNaN(usuarioId)) && authUser) {
      const { data: userRow } = await supabase
        .from("usuario")
        .select("id")
        .or(`auth_user_id.eq.${authUser.id},email.eq.${authUser.email}`)
        .maybeSingle();

      if (userRow?.id) {
        usuarioId = userRow.id;
      }
    }

    if ((!usuarioId || isNaN(usuarioId)) && authUser?.email) {
      const email = authUser.email.toLowerCase();
      const matchIndex = LOGIN_OPTIONS.findIndex(
        (o) => o.email.toLowerCase() === email || email.includes(o.username.toLowerCase())
      );
      if (matchIndex !== -1) {
        usuarioId = matchIndex + 1;
      }
    }

    if (!usuarioId || isNaN(usuarioId)) {
      usuarioId = 1;
    }

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
