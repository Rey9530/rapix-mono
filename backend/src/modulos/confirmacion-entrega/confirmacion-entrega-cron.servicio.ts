import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaServicio } from '../../prisma/prisma.servicio.js';
import { ConfirmacionEntregaServicio } from './confirmacion-entrega.servicio.js';

const LOTE_MAX = 50;

@Injectable()
export class ConfirmacionEntregaCronServicio {
  private readonly logger = new Logger(ConfirmacionEntregaCronServicio.name);

  constructor(
    private readonly prisma: PrismaServicio,
    private readonly servicio: ConfirmacionEntregaServicio,
  ) {}

  /**
   * Barre conversaciones vencidas (sin respuesta del cliente en
   * CONFIRMACION_ENTREGA_TIMEOUT_MINUTOS) y dispara la notificacion FCM al
   * vendedor. La conversacion sigue ACTIVA por si el cliente responde tarde:
   * la nota del rider se sobrescribira si llega una intencion clasificable.
   */
  @Cron(CronExpression.EVERY_MINUTE, {
    name: 'confirmacion-entrega-timeouts',
  })
  async barrerTimeouts(): Promise<void> {
    const ahora = new Date();
    const vencidas = await this.prisma.confirmacionEntregaConversacion.findMany({
      where: {
        estado: { in: ['INICIADA', 'REPREGUNTADA'] },
        notificacionVendedorEnviada: false,
        vencimientoNotificacionEn: { lte: ahora },
      },
      select: { id: true },
      take: LOTE_MAX,
    });
    if (vencidas.length === 0) return;

    this.logger.log(
      `Procesando ${vencidas.length} conversaciones vencidas sin respuesta.`,
    );
    for (const conv of vencidas) {
      try {
        await this.servicio.notificarTimeoutVendedor(conv.id, 'TIMEOUT');
      } catch (error) {
        this.logger.error(
          `Fallo notificando timeout para conversacion ${conv.id}: ${(error as Error).message}`,
        );
      }
    }
  }
}
