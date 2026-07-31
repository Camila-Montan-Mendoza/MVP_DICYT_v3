import { describe, it, expect } from "vitest";
import { listProyectosParaUsuario } from "./proyecto-repository";

type TableResponse = { data: any[] | null; error: any; count?: number };
type RecordedCall = { table: string; method: string; args: any[] };

function createFakeSupabase(tableResponses: Record<string, TableResponse[]>) {
  const callIndexByTable: Record<string, number> = {};
  const calls: RecordedCall[] = [];

  function makeBuilder(table: string): any {
    const record = (method: string) => (...args: any[]) => {
      calls.push({ table, method, args });
      return builder;
    };
    const builder: any = {
      select: record("select"),
      eq: record("eq"),
      or: record("or"),
      in: record("in"),
      order: record("order"),
      range: record("range"),
      then: (resolve: any, reject: any) => {
        const responses = tableResponses[table] ?? [];
        const idx = callIndexByTable[table] ?? 0;
        callIndexByTable[table] = idx + 1;
        const response = responses[idx] ?? { data: [], error: null, count: 0 };
        return Promise.resolve(response).then(resolve, reject);
      },
    };
    return builder;
  }

  return { from: (table: string) => makeBuilder(table), calls } as any;
}

describe("listProyectosParaUsuario - alcance por rol", () => {
  it("scope 'own': solo consulta los proyectos donde el usuario es Investigador Principal", async () => {
    const fakeSupabase = createFakeSupabase({
      proyecto_usuario: [
        { data: [{ id_proyecto: 1 }, { id_proyecto: 3 }], error: null }, // proyectos propios de Daniel
        {
          data: [{ id_proyecto: 1, usuario: { id: 1, username: "daniel.perez" } }],
          error: null,
        }, // investigador principal por proyecto
      ],
      proyecto: [
        {
          data: [
            {
              id: 1,
              nombre: "Implementación de IA para la Agricultura de Precisión",
              codigo: "SISIN-89301294",
              presupuesto: 450000,
              estado_proyecto: { id: 1, nombre: "Pendiente de memoria de cálculo" },
            },
          ],
          error: null,
          count: 1,
        },
      ],
    });

    const result = await listProyectosParaUsuario(fakeSupabase, {
      usuarioId: 1,
      scope: "own",
    });

    expect(result.total).toBe(1);
    expect(result.proyectos).toHaveLength(1);
    expect(result.proyectos[0].id).toBe(1);
    expect(result.proyectos[0].investigadorPrincipal?.nombre).toBe("daniel.perez");
  });

  it("scope 'own' sin proyectos propios: retorna vacío sin consultar la tabla proyecto", async () => {
    const fakeSupabase = createFakeSupabase({
      proyecto_usuario: [{ data: [], error: null }],
    });

    const result = await listProyectosParaUsuario(fakeSupabase, {
      usuarioId: 99,
      scope: "own",
    });

    expect(result.total).toBe(0);
    expect(result.proyectos).toEqual([]);
  });

  it("scope 'all': no restringe por usuario, devuelve todos los proyectos del catálogo", async () => {
    const fakeSupabase = createFakeSupabase({
      proyecto: [
        {
          data: [
            {
              id: 1,
              nombre: "Proyecto A",
              codigo: "SISIN-001",
              presupuesto: 100000,
              estado_proyecto: { id: 4, nombre: "Habilitado para ejecutar partidas" },
            },
            {
              id: 2,
              nombre: "Proyecto B",
              codigo: "SISIN-002",
              presupuesto: 200000,
              estado_proyecto: { id: 2, nombre: "En revisión de memoria de cálculo" },
            },
          ],
          error: null,
          count: 2,
        },
      ],
      proyecto_usuario: [{ data: [], error: null }],
    });

    const result = await listProyectosParaUsuario(fakeSupabase, {
      usuarioId: 5,
      scope: "all",
    });

    expect(result.total).toBe(2);
    expect(result.proyectos.map((p) => p.id)).toEqual([1, 2]);
  });
});

describe("listProyectosParaUsuario - combinación de filtros", () => {
  it("scope 'own': el investigadorId enviado por un Investigador Principal se ignora", async () => {
    const fakeSupabase = createFakeSupabase({
      proyecto_usuario: [
        { data: [{ id_proyecto: 1 }], error: null }, // proyectos propios del usuario 1 (Daniel)
        { data: [{ id_proyecto: 1, usuario: { id: 1, username: "daniel.perez" } }], error: null },
      ],
      proyecto: [
        {
          data: [
            {
              id: 1,
              nombre: "Proyecto de Daniel",
              codigo: "SISIN-001",
              presupuesto: 100000,
              estado_proyecto: { id: 1, nombre: "Pendiente de memoria de cálculo" },
            },
          ],
          error: null,
          count: 1,
        },
      ],
    });

    // usuario 1 (Daniel, scope "own") intenta forzar investigadorId=2 (Winsor) por query string
    const result = await listProyectosParaUsuario(fakeSupabase, {
      usuarioId: 1,
      scope: "own",
      investigadorId: 2,
    });

    // La consulta de alcance sigue siendo por el propio usuarioId (1), no por investigadorId (2)
    const propiosCall = fakeSupabase.calls.find(
      (c: RecordedCall) => c.table === "proyecto_usuario" && c.method === "eq" && c.args[0] === "id_usuario"
    );
    expect(propiosCall?.args[1]).toBe(1);
    expect(result.proyectos).toHaveLength(1);
    expect(result.proyectos[0].id).toBe(1);
  });

  it("scope 'all' + investigadorId: restringe la consulta por el investigador principal indicado", async () => {
    const fakeSupabase = createFakeSupabase({
      proyecto_usuario: [
        { data: [{ id_proyecto: 2 }], error: null }, // proyectos donde investigadorId=2 es IP
        { data: [{ id_proyecto: 2, usuario: { id: 2, username: "winsor.soliz" } }], error: null },
      ],
      proyecto: [
        {
          data: [
            {
              id: 2,
              nombre: "Proyecto de Winsor",
              codigo: "SISIN-002",
              presupuesto: 200000,
              estado_proyecto: { id: 4, nombre: "Habilitado para ejecutar partidas" },
            },
          ],
          error: null,
          count: 1,
        },
      ],
    });

    const result = await listProyectosParaUsuario(fakeSupabase, {
      usuarioId: 5,
      scope: "all",
      investigadorId: 2,
    });

    expect(result.proyectos).toHaveLength(1);
    expect(result.proyectos[0].id).toBe(2);
  });

  it("combina búsqueda por texto y filtro de estado en la misma consulta a 'proyecto'", async () => {
    const fakeSupabase = createFakeSupabase({
      proyecto: [{ data: [], error: null, count: 0 }],
    });

    await listProyectosParaUsuario(fakeSupabase, {
      usuarioId: 5,
      scope: "all",
      q: "forestal",
      estadoId: 2,
    });

    const orCall = fakeSupabase.calls.find(
      (c: RecordedCall) => c.table === "proyecto" && c.method === "or"
    );
    const eqCall = fakeSupabase.calls.find(
      (c: RecordedCall) => c.table === "proyecto" && c.method === "eq" && c.args[0] === "id_estado_proyecto"
    );

    expect(orCall?.args[0]).toContain("forestal");
    expect(eqCall?.args[1]).toBe(2);
  });
});
