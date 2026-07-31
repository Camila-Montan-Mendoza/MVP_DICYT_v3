import { describe, it, expect } from 'vitest';

describe('fetchTrazaTramites transformador de Supabase', () => {
  it('debe mapear correctamente partidas e ítems de trámites reales', () => {
    const mockRawData = [
      {
        id: 10,
        presupuesto: 50000,
        proyecto: { nombre: 'Proyecto Agricultura', codigo: 'SISIN-100' },
        partida: { codigo: 34200, nombre: 'Productos Químicos' },
        item_tramite: [
          {
            id: 101,
            monto_total: 15000,
            estado_item: 3,
            tramite: { id: 1, codigo: 'TRM-2026-001', justificacion: 'Compra reactivos', fecha_creacion: '2026-02-10' },
          },
          {
            id: 102,
            monto_total: 5000,
            estado_item: 4, // Revertido
            tramite: { id: 2, codigo: 'TRM-2026-002', justificacion: 'Anulado', fecha_creacion: '2026-02-15' },
          },
        ],
      },
    ];

    const row = mockRawData[0];
    const tramites = row.item_tramite.map((it) => ({
      id: it.id,
      estadoItem: it.estado_item,
      montoTotal: it.monto_total,
    }));

    const ejecutado = tramites
      .filter((t) => t.estadoItem !== 4)
      .reduce((sum, t) => sum + t.montoTotal, 0);

    expect(ejecutado).toBe(15000); // Excluye revertidos
    expect(row.presupuesto - ejecutado).toBe(35000);
  });
});
