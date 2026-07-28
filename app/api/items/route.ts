import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    let req = supabase
      .from("item")
      .select(
        `
        id,
        nombre,
        id_partida_concreta,
        partida_concreta (
          id,
          id_proyecto,
          id_partida,
          presupuesto,
          partida ( id, codigo, nombre, descripcion )
        )
      `
      )
      .order("id", { ascending: true });

    if (query) {
      req = req.ilike("nombre", `%${query}%`);
    }

    const { data: items, error } = await req;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, count: items.length, data: items });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
