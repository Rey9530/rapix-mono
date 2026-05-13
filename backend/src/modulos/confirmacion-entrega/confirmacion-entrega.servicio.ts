import { Injectable, Logger } from '@nestjs/common';
import type {
  ConfirmacionEntregaConversacion,
  EstadoConfirmacionEntrega,
  EstadoPedido,
  IntencionConfirmacion,
} from '../../generated/prisma/client.js';
import { PrismaServicio } from '../../prisma/prisma.servicio.js';
import { NotificacionesServicio } from '../notificaciones/notificaciones.servicio.js';
import {
  ClavePlantilla,
  renderizarPlantilla,
} from '../notificaciones/plantillas/es.js';
import { WhatsappChatServicio } from '../whatsapp/servicios/whatsapp-chat.servicio.js';
import { WhatsappConexionServicio } from '../whatsapp/servicios/whatsapp-conexion.servicio.js';
import { WhatsappMensajeServicio } from '../whatsapp/servicios/whatsapp-mensaje.servicio.js';
import { IaClasificadorServicio } from './ia-clasificador.servicio.js';
import { formatearE164 } from './prompts/prompt-confirmacion-entrega.js';

type MotivoNotificacionVendedor =
  | 'TIMEOUT'
  | 'SIN_TELEFONO'
  | 'FALLO_ENVIO_INICIAL'
  | 'RECHAZADA';

const ESTADOS_VALIDOS_PARA_PROCESAR: ReadonlySet<EstadoPedido> = new Set([
  'RECOGIDO',
  'EN_TRANSITO',
  'EN_PUNTO_INTERCAMBIO',
  'EN_REPARTO',
]);

const ESTADOS_TOMABLES: ReadonlyArray<EstadoConfirmacionEntrega> = [
  'INICIADA',
  'REPREGUNTADA',
];

const MAX_TURNOS_CONTEXTO = 10;

@Injectable()
export class ConfirmacionEntregaServicio {
  private readonly logger = new Logger(ConfirmacionEntregaServicio.name);

  constructor(
    private readonly prisma: PrismaServicio,
    private readonly chats: WhatsappChatServicio,
    private readonly mensajes: WhatsappMensajeServicio,
    private readonly conexion: WhatsappConexionServicio,
    private readonly ia: IaClasificadorServicio,
    private readonly notif: NotificacionesServicio,
  ) {}

  // ───────────────────────────────────────────────────────────
  // 1) Inicio: se llama cuando un pedido pasa a RECOGIDO.
  // ───────────────────────────────────────────────────────────

  async iniciarConversacion(pedidoId: string): Promise<void> {
    // Idempotencia: si ya existe conversacion para el pedido, no recrear.
    const previa = await this.prisma.confirmacionEntregaConversacion.findUnique({
      where: { pedidoId },
      select: { id: true },
    });
    if (previa) {
      this.logger.debug(`Pedido ${pedidoId} ya tiene conversacion (${previa.id}); omito inicio.`);
      return;
    }

    const pedido = await this.prisma.pedido.findUnique({
      where: { id: pedidoId },
      select: {
        id: true,
        codigoSeguimiento: true,
        nombreCliente: true,
        telefonoCliente: true,
        vendedor: {
          select: {
            nombreNegocio: true,
            usuario: { select: { id: true } },
          },
        },
      },
    });
    if (!pedido) {
      this.logger.warn(`Pedido ${pedidoId} no existe; abortando inicio.`);
      return;
    }

    const vencimientoEn = this.calcularVencimiento();

    // 1) Validar telefono.
    const numero = formatearE164(pedido.telefonoCliente);
    if (!numero) {
      const conv = await this.crearConversacionFallida(
        pedidoId,
        null,
        vencimientoEn,
        'WHATSAPP_TELEFONO_INVALIDO',
        'Sin WhatsApp registrado',
      );
      await this.notificarTimeoutVendedor(conv.id, 'SIN_TELEFONO');
      return;
    }

    // 2) Sesion Baileys debe estar conectada.
    if (!this.conexion.estaConectada()) {
      const conv = await this.crearConversacionFallida(
        pedidoId,
        null,
        vencimientoEn,
        'WHATSAPP_SESION_DESCONECTADA',
        'WhatsApp no conectado; coordinar manualmente',
      );
      await this.notificarTimeoutVendedor(conv.id, 'FALLO_ENVIO_INICIAL');
      return;
    }

    // 3) Asegurar chat + componer mensaje inicial.
    const jid = `${numero}@s.whatsapp.net`;
    const chat = await this.chats.asegurarPorJid(jid, pedido.nombreCliente);
    const textoInicial = this.ia.componerMensajeInicial({
      nombreCliente: pedido.nombreCliente,
      nombreNegocio: pedido.vendedor.nombreNegocio,
      codigoSeguimiento: pedido.codigoSeguimiento,
    });

    // 4) Enviar el mensaje. Si falla, conversacion FALLIDA + aviso al vendedor.
    let mensajeSaliente;
    try {
      mensajeSaliente = await this.mensajes.enviarTexto({
        chatId: chat.id,
        texto: textoInicial,
      });
    } catch (error) {
      const mensaje = (error as Error).message ?? 'desconocido';
      this.logger.error(
        `Fallo envio inicial WhatsApp para pedido ${pedidoId}: ${mensaje}`,
      );
      const conv = await this.crearConversacionFallida(
        pedidoId,
        chat.id,
        vencimientoEn,
        mensaje.slice(0, 200),
        'No se pudo contactar al cliente por WhatsApp',
      );
      await this.notificarTimeoutVendedor(conv.id, 'FALLO_ENVIO_INICIAL');
      return;
    }

    // 5) Persistir conversacion INICIADA + intercambio BOT + actualizar pedido.
    const ahora = new Date();
    await this.prisma.$transaction([
      this.prisma.confirmacionEntregaConversacion.create({
        data: {
          pedidoId,
          chatId: chat.id,
          estado: 'INICIADA',
          iniciadaEn: ahora,
          vencimientoNotificacionEn: vencimientoEn,
        },
      }),
      this.prisma.pedido.update({
        where: { id: pedidoId },
        data: { fechaContactoCliente: ahora },
      }),
    ]);

    const conv = await this.prisma.confirmacionEntregaConversacion.findUniqueOrThrow({
      where: { pedidoId },
      select: { id: true },
    });

    await this.prisma.confirmacionEntregaIntercambio.create({
      data: {
        conversacionId: conv.id,
        rol: 'BOT',
        texto: textoInicial,
        mensajeWhatsappId: mensajeSaliente.id,
      },
    });

    this.logger.log(
      `Conversacion ${conv.id} iniciada para pedido ${pedidoId} (chat ${chat.id}).`,
    );
  }

  // ───────────────────────────────────────────────────────────
  // 2) Procesar respuesta entrante del cliente.
  // ───────────────────────────────────────────────────────────

  async procesarRespuesta(mensajeWhatsappId: string): Promise<void> {
    const mensaje = await this.prisma.mensajeWhatsapp.findUnique({
      where: { id: mensajeWhatsappId },
      select: {
        id: true,
        chatId: true,
        direccion: true,
        texto: true,
        creadoEn: true,
      },
    });
    if (!mensaje || mensaje.direccion !== 'ENTRANTE') return;

    const conv = await this.prisma.confirmacionEntregaConversacion.findFirst({
      where: { chatId: mensaje.chatId, estado: { in: [...ESTADOS_TOMABLES] } },
      select: {
        id: true,
        estado: true,
        iniciadaEn: true,
        pedido: { select: { id: true, estado: true } },
      },
    });
    if (!conv) return;

    if (!ESTADOS_VALIDOS_PARA_PROCESAR.has(conv.pedido.estado)) {
      this.logger.debug(
        `Pedido ${conv.pedido.id} en estado ${conv.pedido.estado}; descarto respuesta tardia.`,
      );
      return;
    }

    const estadoPrevio: EstadoConfirmacionEntrega = conv.estado;
    const repreguntaPrevia = estadoPrevio === 'REPREGUNTADA';

    // Lock optimista: si otro worker ya tomo, salimos.
    const lock = await this.prisma.confirmacionEntregaConversacion.updateMany({
      where: { id: conv.id, estado: estadoPrevio },
      data: { estado: 'PROCESANDO' },
    });
    if (lock.count === 0) return;

    try {
      // Tomar el ultimo mensaje del cliente sin intercambio asociado (puede
      // haber llegado uno mas reciente entre el findFirst y el lock).
      const ultimoSinProcesar = await this.prisma.mensajeWhatsapp.findFirst({
        where: {
          chatId: mensaje.chatId,
          direccion: 'ENTRANTE',
          creadoEn: { gte: conv.iniciadaEn },
          intercambiosConfirmacion: { none: {} },
        },
        orderBy: { creadoEn: 'desc' },
        select: { id: true, texto: true },
      });
      const mensajeAProcesarId = ultimoSinProcesar?.id ?? mensaje.id;
      const textoCliente = (ultimoSinProcesar?.texto ?? mensaje.texto ?? '').trim();

      // Cargar contexto del pedido + turnos previos.
      const ctx = await this.prisma.confirmacionEntregaConversacion.findUniqueOrThrow({
        where: { id: conv.id },
        select: {
          pedido: {
            select: {
              codigoSeguimiento: true,
              nombreCliente: true,
              vendedor: { select: { nombreNegocio: true } },
            },
          },
          intercambios: {
            orderBy: { creadoEn: 'asc' },
            take: MAX_TURNOS_CONTEXTO,
            select: { rol: true, texto: true },
          },
        },
      });
      const turnosPrevios = ctx.intercambios
        .filter((t) => t.rol === 'BOT' || t.rol === 'CLIENTE')
        .map((t) => ({
          rol: t.rol === 'BOT' ? ('BOT' as const) : ('CLIENTE' as const),
          texto: t.texto,
        }));

      // Persistir el turno del cliente (con clasificacion pendiente).
      await this.prisma.confirmacionEntregaIntercambio.create({
        data: {
          conversacionId: conv.id,
          rol: 'CLIENTE',
          texto: textoCliente || '(mensaje no-texto o vacio)',
          mensajeWhatsappId: mensajeAProcesarId,
        },
      });

      // Clasificar con IA.
      const resultado = await this.ia.clasificarRespuesta({
        pedido: {
          nombreCliente: ctx.pedido.nombreCliente,
          nombreNegocio: ctx.pedido.vendedor.nombreNegocio,
          codigoSeguimiento: ctx.pedido.codigoSeguimiento,
        },
        turnosPrevios,
        mensajeCliente: textoCliente || '(sin texto)',
        repreguntaPrevia,
      });

      // Actualizar el intercambio del cliente con la intencion clasificada.
      await this.prisma.confirmacionEntregaIntercambio.updateMany({
        where: { mensajeWhatsappId: mensajeAProcesarId, rol: 'CLIENTE' },
        data: { intencionClasificada: resultado.intencion },
      });

      // Aplicar decision: actualizar pedido + cerrar/repreguntar.
      await this.aplicarDecision(
        conv.id,
        conv.pedido.id,
        resultado.intencion,
        resultado.notaRider,
        repreguntaPrevia,
      );

      // Enviar respuesta al cliente.
      let mensajeBot;
      try {
        mensajeBot = await this.mensajes.enviarTexto({
          chatId: mensaje.chatId,
          texto: resultado.respuestaCliente,
        });
      } catch (error) {
        this.logger.error(
          `Fallo envio de respuesta al cliente (conv ${conv.id}): ${(error as Error).message}`,
        );
        mensajeBot = null;
      }
      await this.prisma.confirmacionEntregaIntercambio.create({
        data: {
          conversacionId: conv.id,
          rol: 'BOT',
          texto: resultado.respuestaCliente,
          mensajeWhatsappId: mensajeBot?.id ?? null,
        },
      });

      // Notificar al vendedor solo en RECHAZA.
      if (resultado.intencion === 'RECHAZA') {
        await this.notificarTimeoutVendedor(conv.id, 'RECHAZADA');
      }
    } catch (error) {
      this.logger.error(
        `Error procesando respuesta de conversacion ${conv.id}: ${(error as Error).message}`,
      );
      // Restaurar estado previo para permitir reintento.
      await this.prisma.confirmacionEntregaConversacion.update({
        where: { id: conv.id },
        data: { estado: estadoPrevio },
      });
      throw error;
    }
  }

  // ───────────────────────────────────────────────────────────
  // 3) Aplicar decision tras clasificacion.
  // ───────────────────────────────────────────────────────────

  private async aplicarDecision(
    conversacionId: string,
    pedidoId: string,
    intencion: IntencionConfirmacion,
    notaRiderIa: string | null,
    repreguntaPrevia: boolean,
  ): Promise<void> {
    const ahora = new Date();

    if (intencion === 'CONFIRMA') {
      await this.prisma.$transaction([
        this.prisma.pedido.update({
          where: { id: pedidoId },
          data: {
            entregaConfirmada: true,
            notaRider: notaRiderIa ?? 'Cliente confirma disponibilidad',
          },
        }),
        this.prisma.confirmacionEntregaConversacion.update({
          where: { id: conversacionId },
          data: {
            estado: 'RESUELTA',
            intencionFinal: 'CONFIRMA',
            resueltaEn: ahora,
          },
        }),
      ]);
      return;
    }

    if (intencion === 'CONDICIONAL') {
      await this.prisma.$transaction([
        this.prisma.pedido.update({
          where: { id: pedidoId },
          data: {
            entregaConfirmada: true,
            notaRider:
              (notaRiderIa ?? 'Cliente acepta con condiciones').slice(0, 200),
          },
        }),
        this.prisma.confirmacionEntregaConversacion.update({
          where: { id: conversacionId },
          data: {
            estado: 'RESUELTA',
            intencionFinal: 'CONDICIONAL',
            resueltaEn: ahora,
          },
        }),
      ]);
      return;
    }

    if (intencion === 'RECHAZA') {
      await this.prisma.$transaction([
        this.prisma.pedido.update({
          where: { id: pedidoId },
          data: {
            entregaConfirmada: false,
            notaRider: (notaRiderIa ?? 'Cliente NO puede recibir').slice(0, 200),
          },
        }),
        this.prisma.confirmacionEntregaConversacion.update({
          where: { id: conversacionId },
          data: {
            estado: 'RESUELTA',
            intencionFinal: 'RECHAZA',
            resueltaEn: ahora,
          },
        }),
      ]);
      return;
    }

    // AMBIGUO
    if (repreguntaPrevia) {
      // Ya repregunto antes: cierre definitivo, no notifica vendedor.
      await this.prisma.$transaction([
        this.prisma.pedido.update({
          where: { id: pedidoId },
          data: {
            entregaConfirmada: false,
            notaRider: 'Cliente respondio sin claridad sobre disponibilidad',
          },
        }),
        this.prisma.confirmacionEntregaConversacion.update({
          where: { id: conversacionId },
          data: {
            estado: 'RESUELTA',
            intencionFinal: 'AMBIGUO',
            resueltaEn: ahora,
          },
        }),
      ]);
      return;
    }
    // Primera ambiguedad: repreguntar (volver a estado REPREGUNTADA).
    await this.prisma.confirmacionEntregaConversacion.update({
      where: { id: conversacionId },
      data: { estado: 'REPREGUNTADA' },
    });
  }

  // ───────────────────────────────────────────────────────────
  // 4) Notificacion al vendedor (FCM).
  // ───────────────────────────────────────────────────────────

  async notificarTimeoutVendedor(
    conversacionId: string,
    motivo: MotivoNotificacionVendedor,
  ): Promise<void> {
    const conv = await this.prisma.confirmacionEntregaConversacion.findUnique({
      where: { id: conversacionId },
      select: {
        id: true,
        notificacionVendedorEnviada: true,
        pedido: {
          select: {
            id: true,
            codigoSeguimiento: true,
            nombreCliente: true,
            notaRider: true,
            vendedor: { select: { usuario: { select: { id: true } } } },
          },
        },
      },
    });
    if (!conv) {
      this.logger.warn(`Conversacion ${conversacionId} no existe; sin FCM.`);
      return;
    }
    if (conv.notificacionVendedorEnviada) {
      this.logger.debug(`Conversacion ${conv.id} ya notifico al vendedor; omito.`);
      return;
    }

    const cs = conv.pedido.codigoSeguimiento;
    const { clave, params } = this.resolverPlantillaVendedor(motivo, {
      codigoSeguimiento: cs,
      nombreCliente: conv.pedido.nombreCliente,
      notaRider: conv.pedido.notaRider,
    });
    const { titulo, cuerpo } = renderizarPlantilla(clave, params);

    await this.notif.enviar({
      usuarioId: conv.pedido.vendedor.usuario.id,
      canal: 'PUSH',
      titulo,
      cuerpo,
      datos: {
        plantillaClave: clave,
        pedidoId: conv.pedido.id,
        codigoSeguimiento: cs,
        motivo,
      },
    });

    // Para los motivos que implican falta de respuesta (TIMEOUT/SIN_TELEFONO/FALLO_ENVIO_INICIAL)
    // marcamos el pedido si todavia no se habia actualizado por la IA.
    if (motivo !== 'RECHAZADA') {
      await this.prisma.pedido.updateMany({
        where: { id: conv.pedido.id, entregaConfirmada: null },
        data: {
          entregaConfirmada: false,
          notaRider: this.notaPedidoPorMotivo(motivo),
        },
      });
    }

    await this.prisma.confirmacionEntregaConversacion.update({
      where: { id: conv.id },
      data: { notificacionVendedorEnviada: true },
    });
  }

  // ───────────────────────────────────────────────────────────
  // Helpers
  // ───────────────────────────────────────────────────────────

  private resolverPlantillaVendedor(
    motivo: MotivoNotificacionVendedor,
    ctx: { codigoSeguimiento: string; nombreCliente: string; notaRider: string | null },
  ): { clave: ClavePlantilla; params: Array<string | number> } {
    switch (motivo) {
      case 'TIMEOUT':
        return {
          clave: 'PEDIDO_CLIENTE_SIN_RESPUESTA_VENDEDOR',
          params: [ctx.codigoSeguimiento, ctx.nombreCliente],
        };
      case 'SIN_TELEFONO':
        return {
          clave: 'PEDIDO_CLIENTE_SIN_CONTACTO_VENDEDOR',
          params: [ctx.codigoSeguimiento, 'Sin WhatsApp registrado'],
        };
      case 'FALLO_ENVIO_INICIAL':
        return {
          clave: 'PEDIDO_CLIENTE_SIN_CONTACTO_VENDEDOR',
          params: [ctx.codigoSeguimiento, 'No se pudo enviar mensaje por WhatsApp'],
        };
      case 'RECHAZADA':
        return {
          clave: 'PEDIDO_CLIENTE_RECHAZO_VENDEDOR',
          params: [ctx.codigoSeguimiento, ctx.notaRider ?? 'sin detalle'],
        };
    }
  }

  private notaPedidoPorMotivo(
    motivo: Exclude<MotivoNotificacionVendedor, 'RECHAZADA'>,
  ): string {
    switch (motivo) {
      case 'TIMEOUT':
        return 'Cliente no respondio a la confirmacion';
      case 'SIN_TELEFONO':
        return 'Sin WhatsApp registrado';
      case 'FALLO_ENVIO_INICIAL':
        return 'No se pudo contactar al cliente por WhatsApp';
    }
  }

  private async crearConversacionFallida(
    pedidoId: string,
    chatId: string | null,
    vencimientoEn: Date,
    motivoFalla: string,
    notaPedido: string,
  ): Promise<ConfirmacionEntregaConversacion> {
    const ahora = new Date();
    const [conv] = await this.prisma.$transaction([
      this.prisma.confirmacionEntregaConversacion.create({
        data: {
          pedidoId,
          chatId,
          estado: 'FALLIDA',
          iniciadaEn: ahora,
          vencimientoNotificacionEn: vencimientoEn,
          motivoFalla,
        },
      }),
      this.prisma.pedido.update({
        where: { id: pedidoId },
        data: {
          fechaContactoCliente: ahora,
          entregaConfirmada: false,
          notaRider: notaPedido,
        },
      }),
    ]);
    return conv;
  }

  private calcularVencimiento(): Date {
    const minutos = Number(process.env.CONFIRMACION_ENTREGA_TIMEOUT_MINUTOS ?? 60);
    return new Date(Date.now() + Math.max(1, minutos) * 60_000);
  }
}
