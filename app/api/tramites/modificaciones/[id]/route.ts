import { NextResponse } from "next/server";
import { mockModificacionService } from "@/src/features/tramites/services/mockModificacionService";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const mod = mockModificacionService.getModificacionById(id);

  if (!mod) {
    return NextResponse.json(
      { message: "Modificación presupuestaria no encontrada" },
      { status: 404 }
    );
  }

  return NextResponse.json(mod, { status: 200 });
}
