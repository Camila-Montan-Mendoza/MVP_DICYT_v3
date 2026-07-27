import { NextResponse } from "next/server";
import { validateTramite } from "@/lib/requisitions/segregator";
import { TramiteSolicitud, EnvioLoteResultado } from "@/types/requisitions";

export async function POST(req: Request) {
  try {
    const { tramites }: { tramites: TramiteSolicitud[] } = await req.json();

    if (!tramites || tramites.length === 0) {
      return NextResponse.json(
        { success: false, error: "No se proporcionaron trámites para enviar." },
        { status: 400 }
      );
    }

    const resultado: EnvioLoteResultado = {
      tramitesExitosos: [],
      tramitesFallidos: [],
    };

    // Process each tramite independently using Promise.allSettled for resilience
    const promises = tramites.map(async (t) => {
      const errors = validateTramite(t);
      if (errors.length > 0) {
        throw { id: t.id, categoria: t.categoria, errores: errors };
      }

      const codigoSeguimiento = `TR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      return { id: t.id, codigoSeguimiento, categoria: t.categoria };
    });

    const settled = await Promise.allSettled(promises);

    for (const res of settled) {
      if (res.status === "fulfilled") {
        resultado.tramitesExitosos.push(res.value);
      } else {
        resultado.tramitesFallidos.push(res.reason);
      }
    }

    return NextResponse.json({
      success: true,
      resultado,
    });
  } catch (_err: unknown) {
    return NextResponse.json(
      { success: false, error: "Error en el procesamiento en lote" },
      { status: 500 }
    );
  }
}
