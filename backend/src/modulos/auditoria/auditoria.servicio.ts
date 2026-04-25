import { Injectable } from '@nestjs/common';
import { Prisma, type RegistroAuditoria } from '../../generated/prisma/client.js';
import { PrismaServicio } from '../../prisma/prisma.servicio.js';

export interface RegistroAuditoriaInput {
  usuarioId: string | null;
  accion: string;
  tipoEntidad: string;
  entidadId: string | null;
  metadatos?: Prisma.InputJsonValue;
}

@Injectable()
export class AuditoriaServicio {
  constructor(private readonly prisma: PrismaServicio) {}

  registrar(input: RegistroAuditoriaInput): Promise<RegistroAuditoria> {
    return this.prisma.registroAuditoria.create({
      data: {
        usuarioId: input.usuarioId,
        accion: input.accion,
        tipoEntidad: input.tipoEntidad,
        entidadId: input.entidadId,
        metadatos: input.metadatos ?? Prisma.JsonNull,
      },
    });
  }
}
