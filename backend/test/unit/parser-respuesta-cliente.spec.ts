import {
  clasificarSiNo,
  extraerUrlMaps,
} from '../../src/modulos/confirmacion-entrega/parser-respuesta-cliente.js';

describe('clasificarSiNo', () => {
  describe('respuestas afirmativas', () => {
    const positivas = [
      'si',
      'Sí',
      'SI',
      'sí, confirmo',
      'yes',
      'OK',
      'okay claro',
      'dale',
      'Confirmo',
      'asi es',
      'así es!',
      'correcto',
      'afirmativo',
    ];
    it.each(positivas)('"%s" se clasifica como SI', (texto) => {
      expect(clasificarSiNo(texto)).toBe('SI');
    });
  });

  describe('respuestas negativas', () => {
    const negativas = [
      'no',
      'NO',
      'Nope',
      'cancela',
      'cancelar por favor',
      'no puedo',
      'no podre hoy',
      'negativo',
    ];
    it.each(negativas)('"%s" se clasifica como NO', (texto) => {
      expect(clasificarSiNo(texto)).toBe('NO');
    });
  });

  describe('respuestas ambiguas', () => {
    const ambiguas = [
      '',
      '   ',
      'tal vez',
      'no se',
      'hola',
      'que tal',
      'gracias',
      'si o no, no se',
      'no, si quiero',
    ];
    it.each(ambiguas)('"%s" se clasifica como AMBIGUO', (texto) => {
      expect(clasificarSiNo(texto)).toBe('AMBIGUO');
    });
  });
});

describe('extraerUrlMaps', () => {
  it('extrae URL corta cuando viene sola', () => {
    expect(extraerUrlMaps('https://maps.app.goo.gl/abc123')).toBe(
      'https://maps.app.goo.gl/abc123',
    );
  });

  it('extrae URL corta embebida en texto', () => {
    expect(
      extraerUrlMaps('Mi direccion: Av. Siempre Viva 742 https://maps.app.goo.gl/Xy7z el portal verde'),
    ).toBe('https://maps.app.goo.gl/Xy7z');
  });

  it('retorna null si no hay URL valida', () => {
    expect(extraerUrlMaps('mi casa esta cerca del parque')).toBeNull();
  });

  it('retorna null para URLs de Google Maps largas (no soportadas aqui)', () => {
    expect(
      extraerUrlMaps('https://www.google.com/maps/@13.6929,-89.2182,15z'),
    ).toBeNull();
  });
});
