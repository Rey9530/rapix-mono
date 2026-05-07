/**
 * Limitador token-bucket simple para envio de mensajes.
 *
 * - `tasaPorSegundo`: tokens que se generan por segundo.
 * - `capacidad`: tokens maximos acumulados (rafaga).
 *
 * `obtenerToken()` espera (con `await`) hasta que haya un token disponible
 * y lo consume. Se usa para serializar y suavizar rafagas de envio.
 */
export class LimitadorTasa {
  private tokens: number;
  private ultimoRefillEn: number;

  constructor(
    private readonly capacidad: number,
    private readonly tasaPorSegundo: number,
  ) {
    this.tokens = capacidad;
    this.ultimoRefillEn = Date.now();
  }

  async obtenerToken(): Promise<void> {
    while (true) {
      this.refill();
      if (this.tokens >= 1) {
        this.tokens -= 1;
        return;
      }
      const faltante = 1 - this.tokens;
      const esperaMs = Math.ceil((faltante / this.tasaPorSegundo) * 1000);
      await new Promise((resolve) => setTimeout(resolve, esperaMs));
    }
  }

  private refill(): void {
    const ahora = Date.now();
    const transcurridoSeg = (ahora - this.ultimoRefillEn) / 1000;
    if (transcurridoSeg <= 0) return;
    const nuevos = transcurridoSeg * this.tasaPorSegundo;
    this.tokens = Math.min(this.capacidad, this.tokens + nuevos);
    this.ultimoRefillEn = ahora;
  }
}
