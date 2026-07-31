import { createClient } from "@/lib/supabase/client";

export interface ItemDBItem {
  id: number;
  nombre: string;
  idPartidaConcreta: number;
  partidaCodigo: number;
  partidaNombre: string;
  categoria: "ACTIVO_FIJO" | "MATERIAL" | "SERVICIO";
}

export class ItemDBRepository {
  private supabase = createClient();

  /**
   * Fetch items catalog from real Supabase DB
   * JOIN item -> partida_concreta -> partida
   */
  public async getItems(): Promise<ItemDBItem[]> {
    try {
      const { data: items, error } = await this.supabase
        .from("item")
        .select(
          `
          id,
          nombre,
          id_partida,
          partida:partida!id_partida (
            id,
            codigo
          )
        `
        )
        .order("id", { ascending: true });

      if (error) {
        console.error("[Supabase Items Query Error]:", error.message, error.details);
        return [];
      }

      if (!items || items.length === 0) {
        return [];
      }

      return items.map((i: any) => {
        const p = i.partida || {};
        const codigoNum = p.codigo || 39500;
        const categoria: "ACTIVO_FIJO" | "MATERIAL" | "SERVICIO" =
          codigoNum >= 40000
            ? "ACTIVO_FIJO"
            : codigoNum >= 20000 && codigoNum < 30000
              ? "SERVICIO"
              : "MATERIAL";

        return {
          id: i.id,
          nombre: i.nombre,
          idPartidaConcreta: i.id_partida,
          partidaCodigo: codigoNum,
          partidaNombre: p.nombre || p.descripcion || `Partida ${codigoNum}`,
          categoria,
        };
      });
    } catch (err) {
      console.error("[ItemRepository Exception]:", err);
      return [];
    }
  }

  /**
   * Search items in DB by query string
   */
  public async searchItems(query: string): Promise<ItemDBItem[]> {
    const all = await this.getItems();
    if (!query.trim()) return all;
    const q = query.toLowerCase().trim();
    return all.filter(
      (item) =>
        item.nombre.toLowerCase().includes(q) ||
        String(item.partidaCodigo).includes(q) ||
        item.partidaNombre.toLowerCase().includes(q)
    );
  }
}

export const itemDBRepository = new ItemDBRepository();
