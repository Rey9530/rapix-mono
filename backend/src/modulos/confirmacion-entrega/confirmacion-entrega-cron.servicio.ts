import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PedidosServicio } from '../pedidos/pedidos.servicio.js';
import { PrismaServicio } from '../../prisma/prisma.servicio.js';
import { ConfirmacionEntregaServicio } from './confirmacion-entrega.servicio.js';

const LOTE_MAX = 50;

/**
 * Etapas en las que un timeout sin respuesta cancela el pedido (FALLIDO).
 * Las demas etapas mantienen el flujo normal y solo avisan al vendedor.
 */
const ETAPAS_QUE_FALLAN_EN_TIMEOUT = new Set([
  'OFRECIENDO_UBICACION_ALTERNATIVA',
  'ESPERANDO_NUEVA_UBICACION',
]);

@Injectable()
export class ConfirmacionEntregaCronServicio {
  private readonly logger = new Logger(ConfirmacionEntregaCronServicio.name);

  constructor(
    private readonly prisma: PrismaServicio,
    private readonly servicio: ConfirmacionEntregaServicio,
    private readonly pedidos: PedidosServicio,
  ) {}

  /**
   * Barre conversaciones vencidas (sin respuesta del cliente dentro del
   * timeout de su etapa) y dispara la notificacion FCM al vendedor. En las
   * etapas de relocalizacion (OFRECIENDO_UBICACION_ALTERNATIVA y
   * ESPERANDO_NUEVA_UBICACION) tambien marca el pedido como FALLIDO.
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
      select: { id: true, etapa: true, pedidoId: true },
      take: LOTE_MAX,
    });
    if (vencidas.length === 0) return;

    this.logger.log(
      `Procesando ${vencidas.length} conversaciones vencidas sin respuesta.`,
    );
    for (const conv of vencidas) {
      try {
        if (ETAPAS_QUE_FALLAN_EN_TIMEOUT.has(conv.etapa)) {
          await this.pedidos.marcarFallidoPorSistema(
            conv.pedidoId,
            'Cliente no proporciono ubicacion alternativa a tiempo',
          );
          await this.prisma.confirmacionEntregaConversacion.update({
            where: { id: conv.id },
            data: {
              estado: 'RESUELTA',
              intencionFinal: 'RECHAZA',
              resueltaEn: new Date(),
            },
          });
        }
        await this.servicio.notificarTimeoutVendedor(conv.id, 'TIMEOUT');
      } catch (error) {
        this.logger.error(
          `Fallo notificando timeout para conversacion ${conv.id}: ${(error as Error).message}`,
        );
      }
    }
  }
}
