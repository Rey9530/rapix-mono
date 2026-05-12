import { Injectable } from '@nestjs/common';
import { PrismaServicio } from '../../prisma/prisma.servicio.js';
import { BancoDto } from './dto/banco.dto.js';

@Injectable()
export class BancosServicio {
  constructor(private readonly prisma: PrismaServicio) {}

  async listarActivos(): Promise<BancoDto[]> {
    const bancos = await this.prisma.banco.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' },
    });
    return bancos.map((b) => BancoDto.desde(b));
  }
}
