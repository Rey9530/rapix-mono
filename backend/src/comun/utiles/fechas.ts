// El Salvador opera en UTC-6 todo el año (sin horario de verano).
const OFFSET_EL_SALVADOR_MIN = -6 * 60;

/**
 * Rango UTC [inicio, fin] que cubre el día calendario actual en El Salvador.
 * inicio = 00:00:00.000 SV (06:00:00 UTC del mismo día)
 * fin    = 23:59:59.999 SV (05:59:59.999 UTC del día siguiente)
 */
export function rangoDelDiaElSalvador(ahora: Date = new Date()): {
  inicio: Date;
  fin: Date;
} {
  const offsetMs = OFFSET_EL_SALVADOR_MIN * 60 * 1000;
  // El instante actual visto como "hora de pared" de El Salvador.
  const local = new Date(ahora.getTime() + offsetMs);
  const y = local.getUTCFullYear();
  const m = local.getUTCMonth();
  const d = local.getUTCDate();
  // Límites del día SV convertidos de vuelta a UTC.
  const inicio = new Date(Date.UTC(y, m, d, 0, 0, 0, 0) - offsetMs);
  const fin = new Date(Date.UTC(y, m, d, 23, 59, 59, 999) - offsetMs);
  return { inicio, fin };
}
