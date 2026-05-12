// Catálogo de bancos comerciales y entidades financieras de El Salvador.
// Se usa tanto en el seed (prisma/seed.ts) como en los tests para garantizar
// que la lista nunca diverja entre ambos.
export interface BancoSeed {
  codigo: string;
  nombre: string;
}

export const BANCOS_EL_SALVADOR: readonly BancoSeed[] = Object.freeze([
  { codigo: 'AGRICOLA', nombre: 'Banco Agrícola' },
  { codigo: 'CUSCATLAN', nombre: 'Banco Cuscatlán' },
  { codigo: 'DAVIVIENDA', nombre: 'Banco Davivienda' },
  { codigo: 'PROMERICA', nombre: 'Banco Promerica' },
  { codigo: 'BAC', nombre: 'BAC Credomatic' },
  { codigo: 'HIPOTECARIO', nombre: 'Banco Hipotecario' },
  { codigo: 'ATLANTIDA', nombre: 'Banco Atlántida' },
  { codigo: 'AZUL', nombre: 'Banco Azul' },
  { codigo: 'INDUSTRIAL', nombre: 'Banco Industrial' },
  { codigo: 'BFA', nombre: 'Banco de Fomento Agropecuario' },
  { codigo: 'ABANK', nombre: 'Banco Abank' },
  { codigo: 'FEDECREDITO', nombre: 'FEDECRÉDITO' },
  { codigo: 'CAJA_CREDITO', nombre: 'Caja de Crédito' },
]);
