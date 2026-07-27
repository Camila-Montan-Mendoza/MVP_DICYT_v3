import { createClient } from "@/lib/supabase/client";

export interface ProyectoDBItem {
  id: number;
  nombre: string;
}

export class ProyectoDBRepository {
  private supabase = createClient();

  /**
   * Fetch projects from real Supabase DB (tabla "proyecto", atributo "nombre")
   */
  public async getProyectos(): Promise<ProyectoDBItem[]> {
    try {
      const { data, error } = await this.supabase
        .from("proyecto")
        .select("id, nombre")
        .order("nombre", { ascending: true });

      if (error) {
        console.error("[Supabase Proyectos Query Error]:", error.message, error.details);
        return [];
      }

      return data ?? [];
    } catch (err) {
      console.error("[ProyectoRepository Exception]:", err);
      return [];
    }
  }
}

export const proyectoDBRepository = new ProyectoDBRepository();
