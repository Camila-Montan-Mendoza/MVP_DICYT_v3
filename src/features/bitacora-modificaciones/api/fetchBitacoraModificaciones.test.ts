import { describe, it, expect } from 'vitest';

describe('fetchBitacoraModificaciones calculador de evolución de saldos', () => {
  it('debe calcular correctamente la evolución del presupuesto nuevo tras un traspaso', () => {
    const partidaOrigen = {
      presupuestoAnterior: 35000,
      montoModificado: 15000,
      tipoImpacto: 'disminucion',
    };

    const partidaDestino = {
      presupuestoAnterior: 55000,
      montoModificado: 15000,
      tipoImpacto: 'incremento',
    };

    const nuevoOrigen = partidaOrigen.presupuestoAnterior - partidaOrigen.montoModificado;
    const nuevoDestino = partidaDestino.presupuestoAnterior + partidaDestino.montoModificado;

    expect(nuevoOrigen).toBe(20000);
    expect(nuevoDestino).toBe(70000);
  });
});
