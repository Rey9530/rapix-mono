import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventosDominio } from '../../../eventos/eventos-dominio.js';
import { PaqueteAgotadoEvento } from '../../../eventos/paquete-agotado.evento.js';
import { PaqueteCompradoEvento } from '../../../eventos/paquete-comprado.evento.js';
import { PaqueteSaldoBajoEvento } from '../../../eventos/paquete-saldo-bajo.evento.js';
import { PrismaServicio } from '../../../prisma/prisma.servicio.js';
import { NotificacionesServicio } from '../notificaciones.servicio.js';
import { ClavePlantilla, renderizarPlantilla } from '../plantillas/es.js';

@Injectable()
export class PaqueteEventosManejador {
  private readonly logger = new Logger(PaqueteEventosManejador.name);

  constructor(
    private readonly notif: NotificacionesServicio,
    private readonly prisma: PrismaServicio,
  ) {}

  @OnEvent(EventosDominio.PaqueteComprado, { async: true })
  async alComprar(evento: PaqueteCompradoEvento): Promise<void> {
    if (evento.estado !== 'ACTIVO') return;
    const usuarioId = await this.usuarioVendedor(evento.vendedorId);
    if (!usuarioId) return;
    await this.enviarPlantilla('PAQUETE_COMPRADO_VENDEDOR', usuarioId, ['PUSH', 'EMAIL'], [
      evento.enviosTotales,
      evento.precio,
    ]);
  }

  @OnEvent(EventosDominio.PaqueteAgotado, { async: true })
  async alAgotar(evento: PaqueteAgotadoEvento): Promise<void> {
    const usuarioId = await this.usuarioVendedor(evento.vendedorId);
    if (!usuarioId) return;
    await this.enviarPlantilla('PAQUETE_AGOTADO_VENDEDOR', usuarioId, ['PUSH', 'EMAIL'], []);
  }

  @OnEvent(EventosDominio.PaqueteSaldoBajo, { async: true })
  async alSaldoBajo(evento: PaqueteSaldoBajoEvento): Promise<void> {
    const usuarioId = await this.usuarioVendedor(evento.vendedorId);
    if (!usuarioId) return;
    await this.enviarPlantilla('PAQUETE_SALDO_BAJO_VENDEDOR', usuarioId, ['PUSH', 'EMAIL'], [
      evento.enviosRestantes,
    ]);
  }

  // ──────────────────────────────────────────────────
  // Helpers
  // ──────────────────────────────────────────────────

  private async usuarioVendedor(perfilVendedorId: string): Promise<string | null> {
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
  ): Promise<void> {
    const { titulo, cuerpo } = renderizarPlantilla(clave, params);
    await this.notif.enviarMulticanal(usuarioId, canales, titulo, cuerpo, {
      plantillaClave: clave,
    });
  }
}
