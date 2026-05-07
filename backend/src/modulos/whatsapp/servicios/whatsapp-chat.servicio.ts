import { Injectable, NotFoundException } from '@nestjs/common';
import type { ChatWhatsapp } from '../../../generated/prisma/client.js';
import { PrismaServicio } from '../../../prisma/prisma.servicio.js';
import {
  ChatNormalizado,
  tipoChatDeJid,
} from '../transformadores/baileys-a-dto.js';

interface FiltrosChat {
  busqueda?: string;
  tipo?: 'INDIVIDUAL' | 'GRUPO';
  pagina?: number;
  limite?: number;
}

@Injectable()
export class WhatsappChatServicio {
  constructor(private readonly prisma: PrismaServicio) {}

  async upsertPorJid(datos: ChatNormalizado): Promise<ChatWhatsapp> {
    return this.prisma.chatWhatsapp.upsert({
      where: { jid: datos.jid },
      create: {
        jid: datos.jid,
        tipo: datos.tipo,
        nombre: datos.nombre,
        ultimoMensajeEn: datos.ultimoMensajeEn,
        noLeidos: datos.noLeidos ?? 0,
      },
      update: {
        nombre: datos.nombre ?? undefined,
        ultimoMensajeEn: datos.ultimoMensajeEn ?? undefined,
        noLeidos: datos.noLeidos ?? undefined,
      },
    });
  }

  async asegurarPorJid(
    jid: string,
    nombre?: string | null,
  ): Promise<ChatWhatsapp> {
    return this.prisma.chatWhatsapp.upsert({
      where: { jid },
      create: {
        jid,
        tipo: tipoChatDeJid(jid),
        nombre: nombre ?? null,
      },
      update: nombre ? { nombre } : {},
    });
  }

  async actualizarUltimoMensaje(
    chatId: string,
    fecha: Date,
    mensajeId: string,
    incrementarNoLeidos: boolean,
  ): Promise<ChatWhatsapp> {
    return this.prisma.chatWhatsapp.update({
      where: { id: chatId },
      data: {
        ultimoMensajeEn: fecha,
        ultimoMensajeId: mensajeId,
        noLeidos: incrementarNoLeidos ? { increment: 1 } : undefined,
      },
    });
  }

  async listar(filtros: FiltrosChat): Promise<{
    datos: ChatWhatsapp[];
    total: number;
    pagina: number;
    totalPaginas: number;
  }> {
    const pagina = Math.max(1, Math.floor(filtros.pagina ?? 1));
    const limite = Math.min(100, Math.max(1, Math.floor(filtros.limite ?? 30)));

    const where = {
      ...(filtros.tipo ? { tipo: filtros.tipo } : {}),
      ...(filtros.busqueda
        ? {
            OR: [
              { nombre: { contains: filtros.busqueda, mode: 'insensitive' as const } },
              { jid: { contains: filtros.busqueda, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };

    const [datos, total] = await Promise.all([
      this.prisma.chatWhatsapp.findMany({
        where,
        orderBy: [
          { ultimoMensajeEn: { sort: 'desc', nulls: 'last' } },
          { creadoEn: 'desc' },
        ],
        skip: (pagina - 1) * limite,
        take: limite,
      }),
      this.prisma.chatWhatsapp.count({ where }),
    ]);

    return {
      datos,
      total,
      pagina,
      totalPaginas: Math.ceil(total / limite) || 1,
    };
  }

  async obtener(chatId: string): Promise<ChatWhatsapp> {
    const chat = await this.prisma.chatWhatsapp.findUnique({
      where: { id: chatId },
    });
    if (!chat) {
      throw new NotFoundException('CHAT_NO_ENCONTRADO');
    }
    return chat;
  }
}
