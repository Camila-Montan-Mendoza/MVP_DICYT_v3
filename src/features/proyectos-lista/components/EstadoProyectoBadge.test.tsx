import { describe, it, expect } from "vitest";
import { getEstadoVisualConfig } from "./EstadoProyectoBadge";
import { EstadoProyectoId } from "../types";

describe("EstadoProyectoBadge - distinción visual de los 4 estados", () => {
  it("cada uno de los 4 estadoId produce una combinación única de color e ícono", () => {
    const ids: EstadoProyectoId[] = [1, 2, 3, 4];
    const combos = ids.map((id) => {
      const { className, icon } = getEstadoVisualConfig(id);
      return `${className}::${icon.displayName ?? icon.name}`;
    });

    const uniqueCombos = new Set(combos);
    expect(uniqueCombos.size).toBe(ids.length);
  });

  it("usa íconos distintos entre sí para cada estado", () => {
    const icons = ([1, 2, 3, 4] as EstadoProyectoId[]).map((id) => getEstadoVisualConfig(id).icon);
    const uniqueIcons = new Set(icons);
    expect(uniqueIcons.size).toBe(4);
  });
});
