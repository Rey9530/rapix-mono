import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { RespuestaPaginada } from '../../comun/dto/respuesta-paginada.js';
import {
  CanalNotificacion,
  Notificacion,
  Prisma,
  Usuario,
} from '../../generated/prisma/client.js';
import { PrismaServicio } from '../../prisma/prisma.servicio.js';
import { RedisServicio } from '../../redis/redis.servicio.js';
import { CanalAdaptador } from './canales/canal.adaptador.js';
import { EmailAdaptador } from './canales/email.adaptador.js';
import { PushAdaptador } from './canales/push.adaptador.js';
import { WhatsAppAdaptador } from './canales/whatsapp.adaptador.js';
import { FiltrosNotificacionDto } from './dto/filtros-notificacion.dto.js';

export interface ParamsEnviarNotificacion {
  usuarioId: string | null;
  canal: CanalNotificacion;
  titulo: string;
  cuerpo: string;
  datos?: Record<string, unknown> | null;
  destino?: string | null;
}

@Injectable()
export class NotificacionesServicio {
  private readonly logger = new Logger(NotificacionesServicio.name);
  private readonly limiteHora = Number(process.env.NOTIFICACIONES_LIMITE_HORA ?? 20);

  constructor(
    private readonly prisma: PrismaServicio,
    private readonly redis: RedisServicio,
    private readonly push: PushAdaptador,
    private readonly whatsapp: WhatsAppAdaptador,
    private readonly email: EmailAdaptador,
  ) {}

  // ──────────────────────────────────────────────────
  // Envío
  // ──────────────────────────────────────────────────

  /**
   * Envía una notificación por un solo canal. Persiste la fila como
   * PENDIENTE, intenta el envío y actualiza a ENVIADO o FALLIDO.
   * Nunca lanza: los errores quedan capturados en `mensajeError`.
   */
  async enviar(params: ParamsEnviarNotificacion): Promise<Notificacion> {
    if (!(await this.intentarConsumirCuota(params.usuarioId))) {
      this.logger.warn(
        `Notificación descartada por rate limit (usuario ${params.usuarioId ?? 'anon'}).`,
      );
      // Devolvemos una fila persistida marcada como FALLIDO para auditoría.
      return this.prisma.notificacion.create({
        data: {
          usuarioId: params.usuarioId ?? null,
          canal: params.canal,
          titulo: params.titulo,
          cuerpo: params.cuerpo,
          datos: params.datos ? (params.datos as Prisma.InputJsonValue) : Prisma.JsonNull,
          destino: params.destino ?? null,
          estado: 'FALLIDO',
          mensajeError: 'RATE_LIMIT_EXCEDIDO',
        },
      });
    }

    const notificacion = await this.prisma.notificacion.create({
      data: {
        usuarioId: params.usuarioId ?? null,
        canal: params.canal,
        titulo: params.titulo,
        cuerpo: params.cuerpo,
        datos: params.datos ? (params.datos as Prisma.InputJsonValue) : Prisma.JsonNull,
        destino: params.destino ?? null,
        estado: 'PENDIENTE',
      },
    });

    const usuario = params.usuarioId
      ? await this.prisma.usuario.findUnique({ where: { id: params.usuarioId } })
      : null;

    try {
      const adaptador = this.adaptadorPara(params.canal);
      await adaptador.enviar({ notificacion, usuario });
      return this.prisma.notificacion.update({
        where: { id: notificacion.id },
        data: { estado: 'ENVIADO', enviadoEn: new Date() },
      });
    } catch (error) {
      const mensaje = (error as Error).message ?? String(error);
      this.logger.error(
        `Notificación ${notificacion.id} (${params.canal}) falló: ${mensaje}`,
      );
      return this.prisma.notificacion.update({
        where: { id: notificacion.id },
        data: { estado: 'FALLIDO', mensajeError: mensaje.slice(0, 500) },
      });
    }
  }

  /**
   * Conveniencia: envía la misma notificación por varios canales.
   * Cada canal se intenta independientemente; el error en uno no aborta los demás.
   */
  async enviarMulticanal(
    usuarioId: string | null,
    canales: CanalNotificacion[],
    titulo: string,
    cuerpo: string,
    datos?: Record<string, unknown> | null,
    destino?: string | null,
  ): Promise<Notificacion[]> {
    const resultados: Notificacion[] = [];
    for (const canal of canales) {
      resultados.push(
        await this.enviar({ usuarioId, canal, titulo, cuerpo, datos, destino }),
      );
    }
    return resultados;
  }

  // ──────────────────────────────────────────────────
  // Listado / lectura por el usuario autenticado
  // ──────────────────────────────────────────────────

  async listarMisNotificaciones(
    usuario: Usuario,
    filtros: FiltrosNotificacionDto,
  ): Promise<RespuestaPaginada<Notificacion>> {
    const where: Prisma.NotificacionWhereInput = { usuarioId: usuario.id };
    if (filtros.estado) where.estado = filtros.estado;
    if (filtros.canal) where.canal = filtros.canal;
    if (filtros.soloNoLeidas === 'true') where.leidoEn = null;

    const skip = (filtros.pagina - 1) * filtros.limite;
    const [filas, total] = await Promise.all([
      this.prisma.notificacion.findMany({
        where,
        skip,
        take: filtros.limite,
        orderBy: { creadoEn: 'desc' },
      }),
      this.prisma.notificacion.count({ where }),
    ]);
    return RespuestaPaginada.de(filas, total, filtros.pagina, filtros.limite);
  }

  async marcarComoLeida(usuario: Usuario, id: string): Promise<Notificacion> {
    const notif = await this.prisma.notificacion.findUnique({ where: { id } });
    if (!notif) throw new NotFoundException({ codigo: 'NOTIFICACION_NO_ENCONTRADA' });
    if (notif.usuarioId !== usuario.id) {
      throw new ForbiddenException({ codigo: 'NOTIFICACION_NO_AUTORIZADA' });
    }
    if (notif.leidoEn) return notif;
    return this.prisma.notificacion.update({
      where: { id },
      data: { leidoEn: new Date(), estado: 'LEIDO' },
    });
  }

  // ──────────────────────────────────────────────────
  // Helpers
  // ──────────────────────────────────────────────────

  private adaptadorPara(canal: CanalNotificacion): CanalAdaptador {
    switch (canal) {
      case 'PUSH':
        return this.push;
      case 'WHATSAPP':
        return this.whatsapp;
      case 'EMAIL':
        return this.email;
    }
  }

  /**
   * Cuota anti-spam: máximo `NOTIFICACIONES_LIMITE_HORA` (default 20)
   * notificaciones por usuario por hora. Implementado con INCR + EXPIRE
   * en Redis sobre clave `notif:cuota:<usuarioId>`. Si Redis no está
   * disponible, deja pasar (fail-open) y registra warning.
   */
  private async intentarConsumirCuota(usuarioId: string | null): Promise<boolean> {
    if (!usuarioId) return true;
    try {
      const clave = `notif:cuota:${usuarioId}`;
      const total = await this.redis.instancia.incr(clave);
      if (total === 1) {
        await this.redis.instancia.expire(clave, 3600);
      }
      return total <= this.limiteHora;
    } catch (error) {
      this.logger.warn(
        `Rate limit no aplicable (Redis caído): ${(error as Error).message}`,
      );
      return true;
    }
  }
}
