import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CierreAprobadoEvento } from '../../../eventos/cierre-aprobado.evento.js';
import { CierreEnviadoEvento } from '../../../eventos/cierre-enviado.evento.js';
import { CierreRechazadoEvento } from '../../../eventos/cierre-rechazado.evento.js';
import { EventosDominio } from '../../../eventos/eventos-dominio.js';
import { PrismaServicio } from '../../../prisma/prisma.servicio.js';
import { NotificacionesServicio } from '../notificaciones.servicio.js';
import { ClavePlantilla, renderizarPlantilla } from '../plantillas/es.js';

@Injectable()
export class CierreEventosManejador {
  private readonly logger = new Logger(CierreEventosManejador.name);

  constructor(
    private readonly notif: NotificacionesServicio,
    private readonly prisma: PrismaServicio,
  ) {}

  @OnEvent(EventosDominio.CierreEnviado, { async: true })
  async alEnviar(evento: CierreEnviadoEvento): Promise<void> {
    const sufijo = evento.conDiscrepancia ? ' con discrepancia' : '';
    await this.enviarAdmins('CIERRE_ENVIADO_ADMIN', ['PUSH', 'EMAIL'], [
      evento.fechaCierre,
      sufijo,
    ]);
  }

  @OnEvent(EventosDominio.CierreAprobado, { async: true })
  async alAprobar(evento: CierreAprobadoEvento): Promise<void> {
    const usuarioId = await this.usuarioRepartidor(evento.repartidorId);
    if (!usuarioId) return;
    const cierre = await this.prisma.cierreFinanciero.findUnique({
      where: { id: evento.cierreId },
      select: { fechaCierre: true },
    });
    const fecha = cierre ? formatearFecha(cierre.fechaCierre) : '—';
    await this.enviarPlantilla('CIERRE_APROBADO_REPARTIDOR', usuarioId, ['PUSH'], [fecha]);
  }

  @OnEvent(EventosDominio.CierreRechazado, { async: true })
  async alRechazar(evento: CierreRechazadoEvento): Promise<void> {
    const usuarioId = await this.usuarioRepartidor(evento.repartidorId);
    if (!usuarioId) return;
    const cierre = await this.prisma.cierreFinanciero.findUnique({
      where: { id: evento.cierreId },
      select: { fechaCierre: true },
    });
    const fecha = cierre ? formatearFecha(cierre.fechaCierre) : '—';
    await this.enviarPlantilla(
      'CIERRE_RECHAZADO_REPARTIDOR',
      usuarioId,
      ['PUSH', 'EMAIL'],
      [fecha, evento.motivo ?? 'sin detalle'],
    );
  }

  // ──────────────────────────────────────────────────
  // Helpers
  // ──────────────────────────────────────────────────

  private async usuarioRepartidor(perfilRepartidorId: string): Promise<string | null> {
    const perfil = await this.prisma.perfilRepartidor.findUnique({
      where: { id: perfilRepartidorId },
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

  private async enviarAdmins(
    clave: ClavePlantilla,
    canales: ('PUSH' | 'WHATSAPP' | 'EMAIL')[],
    params: Array<string | number>,
  ): Promise<void> {
    const admins = await this.prisma.usuario.findMany({
      where: { rol: 'ADMIN', estado: 'ACTIVO' },
      select: { id: true },
    });
    for (const admin of admins) {
      await this.enviarPlantilla(clave, admin.id, canales, params);
    }
  }
}

function formatearFecha(fecha: Date): string {
  const yyyy = fecha.getUTCFullYear();
  const mm = String(fecha.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(fecha.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
