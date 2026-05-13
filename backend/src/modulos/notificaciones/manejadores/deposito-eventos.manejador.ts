import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DepositoCreadoEvento } from '../../../eventos/deposito-creado.evento.js';
import { EventosDominio } from '../../../eventos/eventos-dominio.js';
import { PrismaServicio } from '../../../prisma/prisma.servicio.js';
import { NotificacionesServicio } from '../notificaciones.servicio.js';
import { ClavePlantilla, renderizarPlantilla } from '../plantillas/es.js';

@Injectable()
export class DepositoEventosManejador {
  private readonly logger = new Logger(DepositoEventosManejador.name);

  constructor(
    private readonly notif: NotificacionesServicio,
    private readonly prisma: PrismaServicio,
  ) {}

  @OnEvent(EventosDominio.DepositoCreado, { async: true })
  async alCrear(evento: DepositoCreadoEvento): Promise<void> {
    const usuarioId = await this.usuarioVendedor(evento.vendedorId);
    if (!usuarioId) {
      this.logger.warn(
        `No se encontró usuario para vendedorId=${evento.vendedorId}; no se envía push de depósito.`,
      );
      return;
    }
    await this.enviarPlantilla(
      'DEPOSITO_REGISTRADO_VENDEDOR',
      usuarioId,
      ['PUSH'],
      [evento.monto, evento.cantidadPaquetes],
      { depositoId: evento.depositoId },
    );
  }

  private async usuarioVendedor(
    perfilVendedorId: string,
  ): Promise<string | null> {
    const perfil = await this.prisma.perfilVendedor.findUnique({
      where: { id: perfilVendedorId },
      select: { usuarioId: true },
    });
    return perfil?.usuarioId ?? null;
  }

  private async enviarPlantilla(
    clave: ClavePlantilla,
    usuarioId: string,
    canales: ('PUSH' | 'WHATSAPP' | 'EMAIL')[],
    params: Array<string | number>,
    datosExtra: Record<string, string | number | boolean> = {},
  ): Promise<void> {
    const { titulo, cuerpo } = renderizarPlantilla(clave, params);
    await this.notif.enviarMulticanal(usuarioId, canales, titulo, cuerpo, {
      plantillaClave: clave,
      ...datosExtra,
    });
  }
}
