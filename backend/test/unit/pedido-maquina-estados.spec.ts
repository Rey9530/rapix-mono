import {
  PedidoMaquinaEstados,
  TRANSICIONES,
} from '../../src/modulos/pedidos/maquina-estados/pedido-maquina-estados.js';
import { TransicionInvalidaException } from '../../src/modulos/pedidos/maquina-estados/transicion-invalida.excepcion.js';

describe('PedidoMaquinaEstados', () => {
  describe('transiciones válidas', () => {
    const validas: Array<[keyof typeof TRANSICIONES, keyof typeof TRANSICIONES]> = [
      ['PENDIENTE_ASIGNACION', 'ASIGNADO'],
      ['PENDIENTE_ASIGNACION', 'CANCELADO'],
      ['ASIGNADO', 'RECOGIDO'],
      ['ASIGNADO', 'CANCELADO'],
      ['RECOGIDO', 'EN_TRANSITO'],
      ['EN_TRANSITO', 'EN_PUNTO_INTERCAMBIO'],
      ['EN_PUNTO_INTERCAMBIO', 'EN_REPARTO'],
      ['EN_REPARTO', 'ENTREGADO'],
      ['EN_REPARTO', 'FALLIDO'],
      ['FALLIDO', 'EN_REPARTO'],
      ['FALLIDO', 'DEVUELTO'],
    ];
    it.each(validas)('%s → %s es válida', (desde, hacia) => {
      expect(() => PedidoMaquinaEstados.validarTransicion(desde, hacia)).not.toThrow();
    });
  });

  describe('transiciones inválidas', () => {
    const invalidas: Array<[keyof typeof TRANSICIONES, keyof typeof TRANSICIONES]> = [
      ['PENDIENTE_ASIGNACION', 'RECOGIDO'],
      ['ASIGNADO', 'EN_TRANSITO'],
      ['RECOGIDO', 'ENTREGADO'],
      ['ENTREGADO', 'EN_REPARTO'],
      ['CANCELADO', 'ASIGNADO'],
      ['DEVUELTO', 'EN_REPARTO'],
    ];
    it.each(invalidas)('%s → %s lanza TransicionInvalidaException', (desde, hacia) => {
      expect(() => PedidoMaquinaEstados.validarTransicion(desde, hacia)).toThrow(
        TransicionInvalidaException,
      );
    });
  });

  it('transicionesPosibles(ENTREGADO) retorna array vacío', () => {
    expect(PedidoMaquinaEstados.transicionesPosibles('ENTREGADO')).toEqual([]);
  });

  it('transicionesPosibles(EN_REPARTO) incluye ENTREGADO y FALLIDO', () => {
    const posibles = PedidoMaquinaEstados.transicionesPosibles('EN_REPARTO');
    expect(posibles).toContain('ENTREGADO');
    expect(posibles).toContain('FALLIDO');
  });

  it('esTerminal detecta ENTREGADO / CANCELADO / DEVUELTO', () => {
    expect(PedidoMaquinaEstados.esTerminal('ENTREGADO')).toBe(true);
    expect(PedidoMaquinaEstados.esTerminal('CANCELADO')).toBe(true);
    expect(PedidoMaquinaEstados.esTerminal('DEVUELTO')).toBe(true);
    expect(PedidoMaquinaEstados.esTerminal('EN_REPARTO')).toBe(false);
  });
});
