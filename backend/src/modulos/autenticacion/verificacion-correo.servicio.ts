import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { createHash, randomBytes } from 'node:crypto';
import { EventosDominio } from '../../eventos/eventos-dominio.js';
import { VerificacionCorreoSolicitadaEvento } from '../../eventos/verificacion-correo-solicitada.evento.js';
import type { Usuario } from '../../generated/prisma/client.js';
import { PrismaServicio } from '../../prisma/prisma.servicio.js';

@Injectable()
export class VerificacionCorreoServicio {
  private readonly logger = new Logger(VerificacionCorreoServicio.name);
  private readonly ttlHoras = Number(process.env.VERIFICACION_CORREO_TTL_HORAS ?? 24);

  constructor(
    private readonly prisma: PrismaServicio,
    private readonly eventos: EventEmitter2,
  ) {}

  async generarYEnviar(usuario: Usuario): Promise<void> {
    // Invalida tokens previos pendientes para evitar acumular válidos.
    await this.prisma.tokenVerificacionCorreo.updateMany({
      where: { usuarioId: usuario.id, usadoEn: null },
      data: { usadoEn: new Date() },
    });

    const tokenClaro = randomBytes(32).toString('hex');
    const tokenHash = this.hashear(tokenClaro);
    const expiraEn = new Date(Date.now() + this.ttlHoras * 60 * 60 * 1000);

    await this.prisma.tokenVerificacionCorreo.create({
      data: {
        usuarioId: usuario.id,
        tokenHash,
        expiraEn,
      },
    });

    // Desacoplado vía evento para evitar el ciclo de módulos
    // Autenticacion ↔ Notificaciones ↔ Whatsapp ↔ Autenticacion.
    this.eventos.emit(
      EventosDominio.VerificacionCorreoSolicitada,
      new VerificacionCorreoSolicitadaEvento(
        usuario.id,
        usuario.email,
        usuario.nombreCompleto,
        tokenClaro,
        expiraEn,
      ),
    );
  }

  async verificar(tokenClaro: string): Promise<void> {
    if (!tokenClaro || typeof tokenClaro !== 'string') {
      throw new BadRequestException('Token inválido o expirado');
    }
    const tokenHash = this.hashear(tokenClaro);
    const registro = await this.prisma.tokenVerificacionCorreo.findUnique({
      where: { tokenHash },
    });
    if (!registro || registro.usadoEn !== null || registro.expiraEn <= new Date()) {
      throw new BadRequestException('Token inválido o expirado');
    }

    const usuario = await this.prisma.usuario.findUnique({
      where: { id: registro.usuarioId },
    });
    if (!usuario) {
      throw new BadRequestException('Token inválido o expirado');
    }

    const ahora = new Date();
    await this.prisma.$transaction([
      this.prisma.tokenVerificacionCorreo.update({
        where: { id: registro.id },
        data: { usadoEn: ahora },
      }),
      this.prisma.usuario.update({
        where: { id: usuario.id },
        // Si la cuenta sigue PENDIENTE_VERIFICACION pasa a ACTIVO; otros
        // estados (SUSPENDIDO/INACTIVO) no se tocan.
        data: {
          correoVerificadoEn: ahora,
          ...(usuario.estado === 'PENDIENTE_VERIFICACION'
            ? { estado: 'ACTIVO' as const }
            : {}),
        },
      }),
    ]);
  }

  private hashear(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
