/**
 * Parsers deterministas para etapas conversacionales nuevas:
 * - Doble confirmacion de rechazo (SI/NO).
 * - Oferta de ubicacion alternativa (SI/NO/URL).
 * - Extraccion de URL corta de Google Maps.
 *
 * La etapa CONFIRMACION_INICIAL sigue usando el clasificador IA. Las nuevas
 * etapas usan estos parsers porque (a) el formato esperado es muy acotado y
 * (b) las falsas clasificaciones de IA aqui pueden marcar pedidos como
 * FALLIDO incorrectamente.
 */

const TOKENS_SI = [
  'si',
  'sí',
  'yes',
  'ok',
  'okay',
  'dale',
  'confirmo',
  'confirmado',
  'asi es',
  'así es',
  'correcto',
  'afirmativo',
  'claro',
];

const TOKENS_NO = [
  'no',
  'nop',
  'nope',
  'cancela',
  'cancelar',
  'cancelado',
  'negativo',
  'no puedo',
  'no podre',
  'no podré',
  'no quiero',
];

const REGEX_URL_MAPS = /https?:\/\/maps\.app\.goo\.gl\/[A-Za-z0-9_\-?=&]+/i;

export type DecisionSiNo = 'SI' | 'NO' | 'AMBIGUO';

function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

function contieneToken(texto: string, tokens: string[]): boolean {
  for (const t of tokens) {
    const tNorm = normalizar(t);
    // Match exacto o como palabra (rodeada de inicio/fin/espacio/puntuacion).
    const re = new RegExp(
      `(^|[\\s.,!?¡¿;:])${tNorm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([\\s.,!?¡¿;:]|$)`,
    );
    if (re.test(texto)) return true;
  }
  return false;
}

/**
 * Clasifica una respuesta del cliente como SI / NO / AMBIGUO. Si encuentra
 * tokens de ambas categorias en el mismo mensaje, devuelve AMBIGUO para evitar
 * decisiones erroneas.
 */
export function clasificarSiNo(texto: string): DecisionSiNo {
  const norm = normalizar(texto);
  if (!norm) return 'AMBIGUO';
  const tieneSi = contieneToken(norm, TOKENS_SI);
  const tieneNo = contieneToken(norm, TOKENS_NO);
  if (tieneSi && !tieneNo) return 'SI';
  if (tieneNo && !tieneSi) return 'NO';
  return 'AMBIGUO';
}

/**
 * Extrae la primera URL corta de Google Maps (`https://maps.app.goo.gl/...`)
 * que aparezca en el texto. Retorna null si no encuentra ninguna.
 */
export function extraerUrlMaps(texto: string): string | null {
  const match = texto.match(REGEX_URL_MAPS);
  return match ? match[0] : null;
}
