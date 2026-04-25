import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaServicio } from '../../prisma/prisma.servicio.js';

@Injectable()
export class PaquetesCronServicio {
  private readonly logger = new Logger(PaquetesCronServicio.name);

  constructor(private readonly prisma: PrismaServicio) {}

  /**
   * 03:00 AM diario — marca como EXPIRADO los paquetes ACTIVO con expiraEn < now.
   */
  @Cron('0 3 * * *', { name: 'expirar-paquetes' })
  async expirarPaquetes(): Promise<{ expirados: number }> {
    const { count } = await this.prisma.paqueteRecargado.updateMany({
      where: {
        estado: 'ACTIVO',
        expiraEn: { not: null, lt: new Date() },
      },
      data: { estado: 'EXPIRADO' },
    });
    this.logger.log(`paquetes expirados: ${count}`);
    return { expirados: count };
  }
}
