import { NextResponse } from "next/server";
import { mockProyectoService } from "@/src/features/proyecto-detalle/services/mockProyectoService";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const proyectoId = parseInt(id, 10);

  if (isNaN(proyectoId)) {
    return NextResponse.json({ message: "ID de proyecto inválido" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { decision, motivoObservacion } = body;

    if (!decision || (decision !== "aprobar" && decision !== "observar")) {
      return NextResponse.json(
        { message: "Decisión inválida. Debe ser 'aprobar' u 'observar'." },
        { status: 400 }
      );
    }

    if (decision === "observar" && (!motivoObservacion || !motivoObservacion.trim())) {
      return NextResponse.json(
        { message: "El motivo de la observación es obligatorio y no puede estar vacío." },
        { status: 400 }
      );
    }

    const updated = mockProyectoService.evaluarMemoriaCalculo(
      proyectoId,
      decision,
      motivoObservacion?.trim()
    );

    return NextResponse.json(
      {
        success: true,
        message:
          decision === "aprobar"
            ? "Memoria de cálculo aprobada exitosamente."
            : "Memoria de cálculo observada correctamente.",
        proyecto: updated,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[POST /api/proyectos/[id]/evaluar]", err);
    return NextResponse.json(
      { message: err.message || "Error al procesar la evaluación de la memoria de cálculo" },
      { status: 500 }
    );
  }
}
