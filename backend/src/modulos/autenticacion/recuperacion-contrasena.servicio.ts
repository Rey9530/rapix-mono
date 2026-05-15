import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { createHash, randomInt } from 'node:crypto';
import { hashearContrasena } from '../../comun/utiles/contrasena.js';
import { EventosDominio } from '../../eventos/eventos-dominio.js';
import { RecuperacionContrasenaSolicitadaEvento } from '../../eventos/recuperacion-contrasena-solicitada.evento.js';
import { PrismaServicio } from '../../prisma/prisma.servicio.js';

@Injectable()
export class RecuperacionContrasenaServicio {
  private readonly logger = new Logger(RecuperacionContrasenaServicio.name);
  private readonly ttlMinutos = Number(
    process.env.RECUPERACION_CONTRASENA_TTL_MINUTOS ?? 15,
  );
  private readonly maxIntentos = Number(
    process.env.RECUPERACION_CONTRASENA_MAX_INTENTOS ?? 5,
  );

  constructor(
    private readonly prisma: PrismaServicio,
    private readonly eventos: EventEmitter2,
  ) {}

  // Genera código y lo envía. Silencioso si el email no existe o la cuenta
  // no está activa: el endpoint público responde 200 sin revelar enumeración.
  async solicitar(email: string): Promise<void> {
    const usuario = await this.prisma.usuario.findUnique({ where: { email } });
    if (!usuario) return;
    if (usuario.estado === 'SUSPENDIDO' || usuario.estado === 'INACTIVO') {
      return;
    }

    // Invalida códigos previos pendientes para que solo uno esté activo a la vez.
    await this.prisma.tokenRecuperacionContrasena.updateMany({
      where: { usuarioId: usuario.id, usadoEn: null },
      data: { usadoEn: new Date() },
    });

    const codigo = randomInt(0, 1_000_000).toString().padStart(6, '0');
    const tokenHash = this.hashear(codigo);
    const expiraEn = new Date(Date.now() + this.ttlMinutos * 60 * 1000);

    await this.prisma.tokenRecuperacionContrasena.create({
      data: { usuarioId: usuario.id, tokenHash, expiraEn },
    });

    this.eventos.emit(
      EventosDominio.RecuperacionContrasenaSolicitada,
      new RecuperacionContrasenaSolicitadaEvento(
        usuario.id,
        usuario.email,
        usuario.nombreCompleto,
        codigo,
        expiraEn,
      ),
    );
  }

  // Valida código + cambia contraseña + revoca todos los refresh tokens.
  async confirmar(
    email: string,
    codigo: string,
    nuevaContrasena: string,
  ): Promise<void> {
    const usuario = await this.prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
      throw new BadRequestException('Código inválido o expirado');
    }

    const registro = await this.prisma.tokenRecuperacionContrasena.findFirst({
      where: { usuarioId: usuario.id, usadoEn: null },
      orderBy: { creadoEn: 'desc' },
    });
    if (!registro || registro.expiraEn <= new Date()) {
      throw new BadRequestException('Código inválido o expirado');
    }
    if (registro.intentos >= this.maxIntentos) {
      // Bloquea el código para forzar al usuario a solicitar uno nuevo.
      await this.prisma.tokenRecuperacionContrasena.update({
        where: { id: registro.id },
        data: { usadoEn: new Date() },
      });
      throw new BadRequestException(
        'Código bloqueado por demasiados intentos. Solicita uno nuevo.',
      );
    }

    const tokenHash = this.hashear(codigo);
    if (registro.tokenHash !== tokenHash) {
      await this.prisma.tokenRecuperacionContrasena.update({
        where: { id: registro.id },
        data: { intentos: { increment: 1 } },
      });
      throw new BadRequestException('Código inválido o expirado');
    }

    const hash = await hashearContrasena(nuevaContrasena);
    const ahora = new Date();
    await this.prisma.$transaction([
      this.prisma.tokenRecuperacionContrasena.update({
        where: { id: registro.id },
        data: { usadoEn: ahora },
      }),
      this.prisma.usuario.update({
        where: { id: usuario.id },
        data: { hashContrasena: hash },
      }),
      // Cierra todas las sesiones activas: si la cuenta fue comprometida,
      // invalida cualquier refresh token secuestrado.
      this.prisma.tokenRefresco.updateMany({
        where: { usuarioId: usuario.id, revocadoEn: null },
        data: { revocadoEn: ahora },
      }),
    ]);
  }

  private hashear(valor: string): string {
    return createHash('sha256').update(valor).digest('hex');
  }
}
