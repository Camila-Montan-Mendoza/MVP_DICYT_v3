import { NextResponse } from "next/server";
import { validateTramite } from "@/lib/requisitions/segregator";
import { TramiteSolicitud } from "@/types/requisitions";

export async function POST(req: Request) {
  try {
    const tramite: TramiteSolicitud = await req.json();

    const errors = validateTramite(tramite);
    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    const codigoSeguimiento = `TR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    return NextResponse.json({
      success: true,
      id: tramite.id,
      codigoSeguimiento,
      estado: "ENVIADO",
      fechaEnvio: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { success: false, errors: ["Error al procesar el envío del trámite"] },
      { status: 500 }
    );
  }
}
