import { BANCOS_EL_SALVADOR } from '../../src/modulos/cuentas-bancarias/bancos-el-salvador.constante.js';

describe('BANCOS_EL_SALVADOR (catálogo del seed)', () => {
  const ESPERADOS = [
    'AGRICOLA',
    'CUSCATLAN',
    'DAVIVIENDA',
    'PROMERICA',
    'BAC',
    'HIPOTECARIO',
    'ATLANTIDA',
    'AZUL',
    'INDUSTRIAL',
    'BFA',
    'ABANK',
    'FEDECREDITO',
    'CAJA_CREDITO',
  ];

  it('contiene los códigos esperados', () => {
    const codigos = BANCOS_EL_SALVADOR.map((b) => b.codigo);
    expect(new Set(codigos)).toEqual(new Set(ESPERADOS));
    expect(codigos).toHaveLength(ESPERADOS.length);
  });

  it('cada banco tiene código no vacío y nombre con sentido', () => {
    for (const b of BANCOS_EL_SALVADOR) {
      expect(b.codigo).toMatch(/^[A-Z_]+$/);
      expect(b.nombre.trim().length).toBeGreaterThan(2);
    }
  });

  it('los códigos son únicos', () => {
    const codigos = BANCOS_EL_SALVADOR.map((b) => b.codigo);
    expect(new Set(codigos).size).toBe(codigos.length);
  });
});
