import { describe, it, expect } from "vitest";
import { resolveProyectoNavigationTarget } from "./useProyectosLista";
import { ProyectoListItem } from "../types";

function makeProyecto(estadoId: ProyectoListItem["estado"]["id"]): Pick<ProyectoListItem, "id" | "estado"> {
  return { id: 42, estado: { id: estadoId, nombre: "" } };
}

describe("resolveProyectoNavigationTarget", () => {
  it("Investigador Principal + proyecto Pendiente de memoria de cálculo -> navega a memoria de cálculo", () => {
    const target = resolveProyectoNavigationTarget(makeProyecto(1), "Investigador Principal");
    expect(target).toBe("/proyectos/42/memoria-calculo");
  });

  it("Investigador Principal + proyecto Observado -> navega a memoria de cálculo", () => {
    const target = resolveProyectoNavigationTarget(makeProyecto(3), "Investigador Principal");
    expect(target).toBe("/proyectos/42/memoria-calculo");
  });

  it("Investigador Principal + proyecto Habilitado para ejecutar partidas -> navega al detalle genérico", () => {
    const target = resolveProyectoNavigationTarget(makeProyecto(4), "Investigador Principal");
    expect(target).toBe("/proyectos/42");
  });

  it("Administradora DICyT + proyecto Pendiente -> navega al detalle genérico (no aplica el atajo de IP)", () => {
    const target = resolveProyectoNavigationTarget(makeProyecto(1), "Administradora DICyT");
    expect(target).toBe("/proyectos/42");
  });
});
