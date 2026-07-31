import { NextResponse } from "next/server";
import { mockProyectoService } from "@/src/features/proyecto-detalle/services/mockProyectoService";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const proyectoId = parseInt(id, 10);

    if (isNaN(proyectoId)) {
      return NextResponse.json({ message: "Proyecto no encontrado" }, { status: 404 });
    }

    const body = await request.json();
    const { partidas } = body;

    if (!Array.isArray(partidas)) {
      return NextResponse.json({ message: "Se requiere un arreglo de 'partidas'" }, { status: 400 });
    }

    const updatedProyecto = mockProyectoService.updateMemoriaCalculo(proyectoId, partidas);

    return NextResponse.json(
      {
        success: true,
        message: "Memoria de cálculo guardada correctamente.",
        proyecto: updatedProyecto,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Error al actualizar la memoria de cálculo" },
      { status: 500 }
    );
  }
}
