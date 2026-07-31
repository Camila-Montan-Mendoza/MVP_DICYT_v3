import { NextResponse } from "next/server";
import { mockProyectoService } from "@/src/features/proyecto-detalle/services/mockProyectoService";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const proyectoId = parseInt(id, 10);

    if (isNaN(proyectoId)) {
      return NextResponse.json({ message: "Proyecto no encontrado" }, { status: 404 });
    }

    const updatedProyecto = mockProyectoService.enviarARevision(proyectoId);

    return NextResponse.json(
      {
        success: true,
        message: "Proyecto enviado a revisión exitosamente.",
        proyecto: updatedProyecto,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Error al enviar el proyecto a revisión" },
      { status: 500 }
    );
  }
}
