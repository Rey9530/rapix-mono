import { Injectable } from '@nestjs/common';
import type { ContactoWhatsapp } from '../../../generated/prisma/client.js';
import { PrismaServicio } from '../../../prisma/prisma.servicio.js';
import {
  ContactoNormalizado,
  extraerNumeroDeJid,
} from '../transformadores/baileys-a-dto.js';

@Injectable()
export class WhatsappContactoServicio {
  constructor(private readonly prisma: PrismaServicio) {}

  async upsertPorJid(datos: ContactoNormalizado): Promise<ContactoWhatsapp> {
    return this.prisma.contactoWhatsapp.upsert({
      where: { jid: datos.jid },
      create: {
        jid: datos.jid,
        numero: datos.numero ?? extraerNumeroDeJid(datos.jid),
        nombre: datos.nombre,
      },
      update: {
        numero: datos.numero ?? extraerNumeroDeJid(datos.jid),
        nombre: datos.nombre ?? undefined,
      },
    });
  }

  async asegurarPorJid(jid: string, nombre?: string | null): Promise<ContactoWhatsapp> {
    return this.prisma.contactoWhatsapp.upsert({
      where: { jid },
      create: {
        jid,
        numero: extraerNumeroDeJid(jid),
        nombre: nombre ?? null,
      },
      update: nombre ? { nombre } : {},
    });
  }
}
