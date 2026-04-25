import { Injectable } from '@nestjs/common';
import type { TokenDispositivo, Usuario } from '../../generated/prisma/client.js';
import { PrismaServicio } from '../../prisma/prisma.servicio.js';
import { RegistrarTokenDispositivoDto } from './dto/registrar-token-dispositivo.dto.js';

@Injectable()
export class TokensDispositivoServicio {
  constructor(private readonly prisma: PrismaServicio) {}

  /**
   * Upsert por `token`: si el token ya existe (otro usuario lo usaba),
   * se reasigna al usuario actual y se reactiva. Esto evita acumular
   * filas duplicadas cuando un dispositivo cambia de cuenta.
   */
  registrar(usuario: Usuario, dto: RegistrarTokenDispositivoDto): Promise<TokenDispositivo> {
    return this.prisma.tokenDispositivo.upsert({
      where: { token: dto.token },
      update: { usuarioId: usuario.id, plataforma: dto.plataforma, activo: true },
      create: {
        usuarioId: usuario.id,
        token: dto.token,
        plataforma: dto.plataforma,
        activo: true,
      },
    });
  }

  /**
   * Soft-delete: marca `activo = false` para preservar histórico
   * y permitir auditar tokens revocados.
   */
  async revocar(usuario: Usuario, token: string): Promise<{ revocados: number }> {
    const { count } = await this.prisma.tokenDispositivo.updateMany({
      where: { token, usuarioId: usuario.id },
      data: { activo: false },
    });
    return { revocados: count };
  }

  listarActivos(usuario: Usuario): Promise<TokenDispositivo[]> {
    return this.prisma.tokenDispositivo.findMany({
      where: { usuarioId: usuario.id, activo: true },
      orderBy: { creadoEn: 'desc' },
    });
  }
}
