import { NextResponse } from "next/server";
import { mockModificacionService } from "@/src/features/tramites/services/mockModificacionService";

export async function GET() {
  try {
    const list = mockModificacionService.getModificaciones();
    return NextResponse.json(list, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Error al obtener modificaciones" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.partidasAfectadas || !body.partidasBeneficiadas) {
      return NextResponse.json(
        { message: "Las partidas afectadas y beneficiadas son requeridas" },
        { status: 400 }
      );
    }

    const created = mockModificacionService.crearModificacion(body);
    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Error al crear modificación" },
      { status: 500 }
    );
  }
}
