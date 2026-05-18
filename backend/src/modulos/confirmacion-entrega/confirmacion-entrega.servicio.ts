import { Injectable, Logger } from '@nestjs/common';
import type {
  ConfirmacionEntregaConversacion,
  EstadoConfirmacionEntrega,
  EstadoPedido,
  EtapaConversacionEntrega,
  IntencionConfirmacion,
} from '../../generated/prisma/client.js';
import { PrismaServicio } from '../../prisma/prisma.servicio.js';
import { NotificacionesServicio } from '../notificaciones/notificaciones.servicio.js';
import {
  ClavePlantilla,
  renderizarPlantilla,
} from '../notificaciones/plantillas/es.js';
import { GoogleMapsServicio } from '../pedidos/google-maps.servicio.js';
import { PedidosServicio } from '../pedidos/pedidos.servicio.js';
import { WhatsappChatServicio } from '../whatsapp/servicios/whatsapp-chat.servicio.js';
import { WhatsappConexionServicio } from '../whatsapp/servicios/whatsapp-conexion.servicio.js';
import { WhatsappMensajeServicio } from '../whatsapp/servicios/whatsapp-mensaje.servicio.js';
import { GeoServicio } from '../zonas/geo.servicio.js';
import { IaClasificadorServicio } from './ia-clasificador.servicio.js';
import {
  clasificarSiNo,
  extraerUrlMaps,
} from './parser-respuesta-cliente.js';
import {
  componerMensajePedirDireccion,
  componerNuevaUbicacionLejos,
  formatearE164,
  MSG_DIRECCION_CONFIRMADA_PEDIR_DISPONIBILIDAD,
  MSG_DIRECCION_FUERA_DE_ZONA,
  MSG_DIRECCION_SIN_URL,
  MSG_DOBLE_CONFIRMACION_AMBIGUA,
  MSG_DOBLE_CONFIRMACION_RETOMA,
  MSG_NUEVA_UBICACION_FUERA_DE_ZONA,
  MSG_OFERTA_AMBIGUA,
  MSG_OFRECER_UBICACION_ALTERNATIVA,
  MSG_PEDIR_DOBLE_CONFIRMACION,
  MSG_PEDIR_NUEVA_UBICACION,
  MSG_RECHAZO_TOTAL,
  MSG_RELOCALIZACION_EXITOSA,
  MSG_URL_INVALIDA,
} from './prompts/prompt-confirmacion-entrega.js';

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
    private readonly googleMaps: GoogleMapsServicio,
    private readonly geo: GeoServicio,
    private readonly pedidos: PedidosServicio,
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
        latitudDestino: true,
        longitudDestino: true,
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

    const necesitaDireccion =
      pedido.latitudDestino == null || pedido.longitudDestino == null;
    const etapaInicial: EtapaConversacionEntrega = necesitaDireccion
      ? 'ESPERANDO_DIRECCION_ORIGINAL'
      : 'CONFIRMACION_INICIAL';
    const vencimientoEn = this.calcularVencimiento(etapaInicial);

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
    const textoInicial = necesitaDireccion
      ? componerMensajePedirDireccion({
          nombreCliente: pedido.nombreCliente,
          nombreNegocio: pedido.vendedor.nombreNegocio,
        })
      : this.ia.componerMensajeInicial({
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
    // Antes de crear la nueva conversacion, marcamos como EXPIRADA cualquier
    // otra conversacion activa en el mismo chat: si el cliente tiene varios
    // pedidos en curso al mismo numero, el findFirst en el listener podria
    // engancharse a una conv vieja y procesar mal la respuesta.
    const ahora = new Date();
    await this.prisma.$transaction([
      this.prisma.confirmacionEntregaConversacion.updateMany({
        where: {
          chatId: chat.id,
          estado: { in: ['INICIADA', 'REPREGUNTADA'] },
        },
        data: { estado: 'EXPIRADA', resueltaEn: ahora },
      }),
      this.prisma.confirmacionEntregaConversacion.create({
        data: {
          pedidoId,
          chatId: chat.id,
          estado: 'INICIADA',
          etapa: etapaInicial,
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

    // Si el cliente tiene varias conversaciones activas en el mismo chat,
    // procesamos la mas reciente. Ver justificacion en el listener.
    const conv = await this.prisma.confirmacionEntregaConversacion.findFirst({
      where: { chatId: mensaje.chatId, estado: { in: [...ESTADOS_TOMABLES] } },
      orderBy: { iniciadaEn: 'desc' },
      select: {
        id: true,
        estado: true,
        etapa: true,
        iniciadaEn: true,
        pedido: { select: { id: true, estado: true } },
      },
    });
    if (!conv) {
      this.logger.debug(
        `Mensaje entrante ${mensajeWhatsappId} (chat ${mensaje.chatId}) sin conversacion activa.`,
      );
      return;
    }

    this.logger.log(
      `Procesando mensaje entrante: conv=${conv.id} pedido=${conv.pedido.id} etapa=${conv.etapa} estado=${conv.estado} pedidoEstado=${conv.pedido.estado}`,
    );

    if (!ESTADOS_VALIDOS_PARA_PROCESAR.has(conv.pedido.estado)) {
      this.logger.debug(
        `Pedido ${conv.pedido.id} en estado ${conv.pedido.estado}; descarto respuesta tardia.`,
      );
      return;
    }

    const estadoPrevio: EstadoConfirmacionEntrega = conv.estado;
    const etapaPrevia: EtapaConversacionEntrega = conv.etapa;
    const repreguntaPrevia = estadoPrevio === 'REPREGUNTADA';

    // Lock optimista: si otro worker ya tomo, salimos.
    const lock = await this.prisma.confirmacionEntregaConversacion.updateMany({
      where: { id: conv.id, estado: estadoPrevio },
      data: { estado: 'PROCESANDO' },
    });
    if (lock.count === 0) {
      this.logger.debug(`Lock perdido en conv ${conv.id}; otro worker la tomo.`);
      return;
    }

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

      // Persistir el turno del cliente (con clasificacion pendiente).
      await this.prisma.confirmacionEntregaIntercambio.create({
        data: {
          conversacionId: conv.id,
          rol: 'CLIENTE',
          texto: textoCliente || '(mensaje no-texto o vacio)',
          mensajeWhatsappId: mensajeAProcesarId,
        },
      });

      // Despachar al handler de la etapa actual.
      const resultado = await this.despacharPorEtapa({
        conversacionId: conv.id,
        pedidoId: conv.pedido.id,
        etapa: etapaPrevia,
        repreguntaPrevia,
        textoCliente,
        mensajeAProcesarId,
      });

      // Anotar intencion clasificada (si el handler la determino).
      if (resultado.intencionClasificada) {
        await this.prisma.confirmacionEntregaIntercambio.updateMany({
          where: { mensajeWhatsappId: mensajeAProcesarId, rol: 'CLIENTE' },
          data: { intencionClasificada: resultado.intencionClasificada },
        });
      }

      // Enviar respuesta al cliente.
      let mensajeBot;
      try {
        mensajeBot = await this.mensajes.enviarTexto({
          chatId: mensaje.chatId,
          texto: resultado.respuesta,
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
          texto: resultado.respuesta,
          mensajeWhatsappId: mensajeBot?.id ?? null,
        },
      });

      // Notificar al vendedor si el handler lo solicita.
      if (resultado.notificarVendedor) {
        await this.notificarTimeoutVendedor(conv.id, resultado.notificarVendedor);
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

  private async despacharPorEtapa(params: {
    conversacionId: string;
    pedidoId: string;
    etapa: EtapaConversacionEntrega;
    repreguntaPrevia: boolean;
    textoCliente: string;
    mensajeAProcesarId: string;
  }): Promise<ResultadoHandlerEtapa> {
    switch (params.etapa) {
      case 'CONFIRMACION_INICIAL':
        return this.procesarConfirmacionInicial(params);
      case 'ESPERANDO_DIRECCION_ORIGINAL':
        return this.procesarDireccionOriginal(params);
      case 'CONFIRMANDO_RECHAZO':
        return this.procesarConfirmacionRechazo(params);
      case 'OFRECIENDO_UBICACION_ALTERNATIVA':
        return this.procesarOfertaAlternativa(params);
      case 'ESPERANDO_NUEVA_UBICACION':
        return this.procesarNuevaUbicacion(params);
    }
  }

  // ───────────────────────────────────────────────────────────
  // 3) Handlers por etapa.
  // ───────────────────────────────────────────────────────────

  private async procesarConfirmacionInicial(params: {
    conversacionId: string;
    pedidoId: string;
    repreguntaPrevia: boolean;
    textoCliente: string;
  }): Promise<ResultadoHandlerEtapa> {
    // Cargar contexto (turnos previos para alimentar IA).
    const ctx = await this.prisma.confirmacionEntregaConversacion.findUniqueOrThrow({
      where: { id: params.conversacionId },
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

    const resultado = await this.ia.clasificarRespuesta({
      pedido: {
        nombreCliente: ctx.pedido.nombreCliente,
        nombreNegocio: ctx.pedido.vendedor.nombreNegocio,
        codigoSeguimiento: ctx.pedido.codigoSeguimiento,
      },
      turnosPrevios,
      mensajeCliente: params.textoCliente || '(sin texto)',
      repreguntaPrevia: params.repreguntaPrevia,
    });

    const ahora = new Date();

    if (resultado.intencion === 'CONFIRMA' || resultado.intencion === 'CONDICIONAL') {
      const intencionFinal: IntencionConfirmacion = resultado.intencion;
      const notaDefault =
        intencionFinal === 'CONFIRMA'
          ? 'Cliente confirma disponibilidad'
          : 'Cliente acepta con condiciones';
      await this.prisma.$transaction([
        this.prisma.pedido.update({
          where: { id: params.pedidoId },
          data: {
            entregaConfirmada: true,
            notaRider: (resultado.notaRider ?? notaDefault).slice(0, 200),
          },
        }),
        this.prisma.confirmacionEntregaConversacion.update({
          where: { id: params.conversacionId },
          data: {
            estado: 'RESUELTA',
            intencionFinal,
            resueltaEn: ahora,
          },
        }),
      ]);
      return {
        respuesta: resultado.respuestaCliente,
        intencionClasificada: intencionFinal,
      };
    }

    if (resultado.intencion === 'RECHAZA') {
      // Cambio respecto al flujo previo: el RECHAZA ya no cierra de inmediato.
      // Pasamos a etapa CONFIRMANDO_RECHAZO y pedimos doble confirmacion SI/NO.
      // Snapshot de la ubicacion original para una futura validacion de
      // distancia en relocalizacion.
      const pedidoActual = await this.prisma.pedido.findUniqueOrThrow({
        where: { id: params.pedidoId },
        select: { latitudDestino: true, longitudDestino: true },
      });
      await this.prisma.confirmacionEntregaConversacion.update({
        where: { id: params.conversacionId },
        data: {
          estado: 'INICIADA',
          etapa: 'CONFIRMANDO_RECHAZO',
          vencimientoNotificacionEn: this.calcularVencimiento('CONFIRMANDO_RECHAZO'),
          notificacionVendedorEnviada: false,
          latitudOriginal: pedidoActual.latitudDestino,
          longitudOriginal: pedidoActual.longitudDestino,
        },
      });
      return {
        respuesta: MSG_PEDIR_DOBLE_CONFIRMACION,
        intencionClasificada: 'RECHAZA',
      };
    }

    // AMBIGUO
    if (params.repreguntaPrevia) {
      await this.prisma.$transaction([
        this.prisma.pedido.update({
          where: { id: params.pedidoId },
          data: {
            entregaConfirmada: false,
            notaRider: 'Cliente respondio sin claridad sobre disponibilidad',
          },
        }),
        this.prisma.confirmacionEntregaConversacion.update({
          where: { id: params.conversacionId },
          data: {
            estado: 'RESUELTA',
            intencionFinal: 'AMBIGUO',
            resueltaEn: ahora,
          },
        }),
      ]);
      return {
        respuesta: resultado.respuestaCliente,
        intencionClasificada: 'AMBIGUO',
      };
    }
    await this.prisma.confirmacionEntregaConversacion.update({
      where: { id: params.conversacionId },
      data: { estado: 'REPREGUNTADA' },
    });
    return {
      respuesta: resultado.respuestaCliente,
      intencionClasificada: 'AMBIGUO',
    };
  }

  private async procesarDireccionOriginal(params: {
    conversacionId: string;
    pedidoId: string;
    textoCliente: string;
  }): Promise<ResultadoHandlerEtapa> {
    this.logger.log(
      `procesarDireccionOriginal: conv=${params.conversacionId} texto="${params.textoCliente.slice(0, 200)}"`,
    );
    const url = extraerUrlMaps(params.textoCliente);
    if (!url) {
      this.logger.warn(
        `procesarDireccionOriginal: no se detecto URL de Maps en el texto del cliente.`,
      );
      await this.prisma.confirmacionEntregaConversacion.update({
        where: { id: params.conversacionId },
        data: {
          estado: 'INICIADA',
          vencimientoNotificacionEn: this.calcularVencimiento('ESPERANDO_DIRECCION_ORIGINAL'),
        },
      });
      return { respuesta: MSG_DIRECCION_SIN_URL };
    }
    this.logger.log(`procesarDireccionOriginal: URL detectada=${url}`);

    let coords: { lat: number; lng: number };
    try {
      coords = await this.googleMaps.resolverCoordenadas(url);
    } catch (error) {
      this.logger.warn(
        `URL de Maps invalida (conv ${params.conversacionId}): ${(error as Error).message}`,
      );
      await this.prisma.confirmacionEntregaConversacion.update({
        where: { id: params.conversacionId },
        data: {
          estado: 'INICIADA',
          vencimientoNotificacionEn: this.calcularVencimiento('ESPERANDO_DIRECCION_ORIGINAL'),
        },
      });
      return { respuesta: MSG_URL_INVALIDA };
    }
    this.logger.log(
      `procesarDireccionOriginal: coords resueltas lat=${coords.lat} lng=${coords.lng}`,
    );

    const zona = await this.geo.resolverZona(coords.lat, coords.lng);
    if (!zona) {
      this.logger.warn(
        `procesarDireccionOriginal: coords (${coords.lat},${coords.lng}) fuera de zonas activas; marcando FALLIDO.`,
      );
      await this.pedidos.marcarFallidoPorSistema(
        params.pedidoId,
        'Direccion del cliente fuera de zona de entrega',
      );
      await this.prisma.confirmacionEntregaConversacion.update({
        where: { id: params.conversacionId },
        data: {
          estado: 'RESUELTA',
          intencionFinal: 'RECHAZA',
          resueltaEn: new Date(),
        },
      });
      return { respuesta: MSG_DIRECCION_FUERA_DE_ZONA };
    }

    // Conservar la direccion escrita por el cliente como referencia (sin URL).
    const direccionEscrita = params.textoCliente.replace(url, '').replace(/[,;\s]+$/, '').trim();

    await this.prisma.$transaction([
      this.prisma.pedido.update({
        where: { id: params.pedidoId },
        data: {
          latitudDestino: coords.lat,
          longitudDestino: coords.lng,
          zonaDestinoId: zona.id,
          ...(direccionEscrita.length > 0
            ? { direccionDestino: direccionEscrita.slice(0, 500) }
            : {}),
        },
      }),
      this.prisma.confirmacionEntregaConversacion.update({
        where: { id: params.conversacionId },
        data: {
          estado: 'INICIADA',
          etapa: 'CONFIRMACION_INICIAL',
          vencimientoNotificacionEn: this.calcularVencimiento('CONFIRMACION_INICIAL'),
        },
      }),
    ]);
    this.logger.log(
      `procesarDireccionOriginal: pedido ${params.pedidoId} actualizado con coords (${coords.lat},${coords.lng}) zona=${zona.codigo}; conv pasa a CONFIRMACION_INICIAL.`,
    );
    return { respuesta: MSG_DIRECCION_CONFIRMADA_PEDIR_DISPONIBILIDAD };
  }

  private async procesarConfirmacionRechazo(params: {
    conversacionId: string;
    pedidoId: string;
    repreguntaPrevia: boolean;
    textoCliente: string;
  }): Promise<ResultadoHandlerEtapa> {
    const decision = clasificarSiNo(params.textoCliente);

    if (decision === 'SI') {
      // Confirma que NO puede recibir → pasar a ofrecer ubicacion alternativa.
      await this.prisma.confirmacionEntregaConversacion.update({
        where: { id: params.conversacionId },
        data: {
          estado: 'INICIADA',
          etapa: 'OFRECIENDO_UBICACION_ALTERNATIVA',
          vencimientoNotificacionEn: this.calcularVencimiento(
            'OFRECIENDO_UBICACION_ALTERNATIVA',
          ),
        },
      });
      return {
        respuesta: MSG_OFRECER_UBICACION_ALTERNATIVA,
        intencionClasificada: 'RECHAZA',
      };
    }

    if (decision === 'NO') {
      // Retracta el rechazo: vuelve a confirmacion inicial sin tocar pedido.
      await this.prisma.confirmacionEntregaConversacion.update({
        where: { id: params.conversacionId },
        data: {
          estado: 'INICIADA',
          etapa: 'CONFIRMACION_INICIAL',
          vencimientoNotificacionEn: this.calcularVencimiento('CONFIRMACION_INICIAL'),
          latitudOriginal: null,
          longitudOriginal: null,
        },
      });
      return {
        respuesta: MSG_DOBLE_CONFIRMACION_RETOMA,
        intencionClasificada: 'CONFIRMA',
      };
    }

    // AMBIGUO: solo permitimos una repregunta. Si vuelve a ser ambiguo
    // dejamos la conversacion abierta hasta timeout (decisione del rider).
    if (params.repreguntaPrevia) {
      await this.prisma.confirmacionEntregaConversacion.update({
        where: { id: params.conversacionId },
        data: { estado: 'INICIADA' },
      });
    } else {
      await this.prisma.confirmacionEntregaConversacion.update({
        where: { id: params.conversacionId },
        data: { estado: 'REPREGUNTADA' },
      });
    }
    return {
      respuesta: MSG_DOBLE_CONFIRMACION_AMBIGUA,
      intencionClasificada: 'AMBIGUO',
    };
  }

  private async procesarOfertaAlternativa(params: {
    conversacionId: string;
    pedidoId: string;
    textoCliente: string;
    mensajeAProcesarId: string;
  }): Promise<ResultadoHandlerEtapa> {
    const url = extraerUrlMaps(params.textoCliente);
    if (url) {
      // Atajo: viene SI + URL en el mismo mensaje. Procesamos como nueva
      // ubicacion directamente.
      return this.validarYAplicarNuevaUbicacion(params.conversacionId, params.pedidoId, url);
    }

    const decision = clasificarSiNo(params.textoCliente);
    if (decision === 'NO') {
      await this.pedidos.marcarFallidoPorSistema(
        params.pedidoId,
        'Cliente rechazo entrega y rechazo ubicacion alternativa',
      );
      await this.prisma.confirmacionEntregaConversacion.update({
        where: { id: params.conversacionId },
        data: {
          estado: 'RESUELTA',
          intencionFinal: 'RECHAZA',
          resueltaEn: new Date(),
        },
      });
      return {
        respuesta: MSG_RECHAZO_TOTAL,
        intencionClasificada: 'RECHAZA',
      };
    }

    if (decision === 'SI') {
      // SI sin URL: pasar a etapa de esperar URL.
      await this.prisma.confirmacionEntregaConversacion.update({
        where: { id: params.conversacionId },
        data: {
          estado: 'INICIADA',
          etapa: 'ESPERANDO_NUEVA_UBICACION',
          vencimientoNotificacionEn: this.calcularVencimiento('ESPERANDO_NUEVA_UBICACION'),
        },
      });
      return { respuesta: MSG_PEDIR_NUEVA_UBICACION };
    }

    // AMBIGUO: repreguntar (sin avanzar de etapa).
    await this.prisma.confirmacionEntregaConversacion.update({
      where: { id: params.conversacionId },
      data: { estado: 'INICIADA' },
    });
    return {
      respuesta: MSG_OFERTA_AMBIGUA,
      intencionClasificada: 'AMBIGUO',
    };
  }

  private async procesarNuevaUbicacion(params: {
    conversacionId: string;
    pedidoId: string;
    textoCliente: string;
  }): Promise<ResultadoHandlerEtapa> {
    const url = extraerUrlMaps(params.textoCliente);
    if (!url) {
      await this.prisma.confirmacionEntregaConversacion.update({
        where: { id: params.conversacionId },
        data: {
          estado: 'INICIADA',
          vencimientoNotificacionEn: this.calcularVencimiento('ESPERANDO_NUEVA_UBICACION'),
        },
      });
      return { respuesta: MSG_DIRECCION_SIN_URL };
    }
    return this.validarYAplicarNuevaUbicacion(params.conversacionId, params.pedidoId, url);
  }

  /**
   * Valida una nueva ubicacion (URL de Maps → coords) contra zona y umbral
   * de distancia. Si pasa: actualiza el pedido y cierra la conversacion como
   * CONDICIONAL. Si falla: marca el pedido FALLIDO y cierra como RECHAZA.
   */
  private async validarYAplicarNuevaUbicacion(
    conversacionId: string,
    pedidoId: string,
    url: string,
  ): Promise<ResultadoHandlerEtapa> {
    let coords: { lat: number; lng: number };
    try {
      coords = await this.googleMaps.resolverCoordenadas(url);
    } catch (error) {
      this.logger.warn(
        `URL de Maps invalida en relocalizacion (conv ${conversacionId}): ${(error as Error).message}`,
      );
      await this.prisma.confirmacionEntregaConversacion.update({
        where: { id: conversacionId },
        data: {
          estado: 'INICIADA',
          etapa: 'ESPERANDO_NUEVA_UBICACION',
          vencimientoNotificacionEn: this.calcularVencimiento('ESPERANDO_NUEVA_UBICACION'),
        },
      });
      return { respuesta: MSG_URL_INVALIDA };
    }

    // Snapshot guardado al entrar a CONFIRMANDO_RECHAZO. Si no lo tenemos
    // (caso raro: reanudacion desde una etapa intermedia), cargamos del
    // pedido en ese instante para no romper.
    const conv = await this.prisma.confirmacionEntregaConversacion.findUniqueOrThrow({
      where: { id: conversacionId },
      select: {
        latitudOriginal: true,
        longitudOriginal: true,
        pedido: { select: { zonaDestinoId: true, latitudDestino: true, longitudDestino: true } },
      },
    });
    const latOrig = conv.latitudOriginal ?? conv.pedido.latitudDestino;
    const lngOrig = conv.longitudOriginal ?? conv.pedido.longitudDestino;
    const zonaOriginalId = conv.pedido.zonaDestinoId;

    // Validacion A: nueva ubicacion debe caer en la zona original del pedido.
    const zonaNueva = await this.geo.resolverZona(coords.lat, coords.lng);
    if (!zonaNueva || (zonaOriginalId && zonaNueva.id !== zonaOriginalId)) {
      await this.pedidos.marcarFallidoPorSistema(
        pedidoId,
        'Nueva ubicacion del cliente fuera de la zona de entrega',
      );
      await this.prisma.$transaction([
        this.prisma.confirmacionEntregaConversacion.update({
          where: { id: conversacionId },
          data: {
            estado: 'RESUELTA',
            intencionFinal: 'RECHAZA',
            resueltaEn: new Date(),
            latitudPropuesta: coords.lat,
            longitudPropuesta: coords.lng,
          },
        }),
      ]);
      return {
        respuesta: MSG_NUEVA_UBICACION_FUERA_DE_ZONA,
        intencionClasificada: 'RECHAZA',
      };
    }

    // Validacion B: distancia Haversine bajo umbral.
    if (latOrig != null && lngOrig != null) {
      const distancia = this.geo.distanciaHaversineMetros(
        { lat: latOrig, lng: lngOrig },
        coords,
      );
      const limite = await this.resolverLimiteDistancia(zonaNueva.id);
      if (distancia > limite) {
        await this.pedidos.marcarFallidoPorSistema(
          pedidoId,
          `Nueva ubicacion a ${Math.round(distancia)} m, supera el limite de ${limite} m`,
        );
        await this.prisma.confirmacionEntregaConversacion.update({
          where: { id: conversacionId },
          data: {
            estado: 'RESUELTA',
            intencionFinal: 'RECHAZA',
            resueltaEn: new Date(),
            latitudPropuesta: coords.lat,
            longitudPropuesta: coords.lng,
          },
        });
        return {
          respuesta: componerNuevaUbicacionLejos({
            distanciaMetros: distancia,
            limiteMetros: limite,
          }),
          intencionClasificada: 'RECHAZA',
        };
      }
    }

    // Aplicar relocalizacion.
    await this.prisma.$transaction([
      this.prisma.pedido.update({
        where: { id: pedidoId },
        data: {
          latitudDestino: coords.lat,
          longitudDestino: coords.lng,
          zonaDestinoId: zonaNueva.id,
          entregaConfirmada: true,
          notaRider: 'Cliente solicito relocalizacion; nueva ubicacion validada',
        },
      }),
      this.prisma.confirmacionEntregaConversacion.update({
        where: { id: conversacionId },
        data: {
          estado: 'RESUELTA',
          intencionFinal: 'CONDICIONAL',
          resueltaEn: new Date(),
          latitudPropuesta: coords.lat,
          longitudPropuesta: coords.lng,
        },
      }),
    ]);
    return {
      respuesta: MSG_RELOCALIZACION_EXITOSA,
      intencionClasificada: 'CONDICIONAL',
    };
  }

  private async resolverLimiteDistancia(zonaId: string): Promise<number> {
    const zona = await this.prisma.zona.findUnique({
      where: { id: zonaId },
      select: { radioMaxRelocalizacionMetros: true },
    });
    if (zona?.radioMaxRelocalizacionMetros != null) {
      return zona.radioMaxRelocalizacionMetros;
    }
    const env = Number(process.env.RELOCALIZACION_RADIO_MAX_METROS);
    return Number.isFinite(env) && env > 0 ? env : 1500;
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

  private calcularVencimiento(etapa: EtapaConversacionEntrega): Date {
    const minutos = this.minutosTimeoutPorEtapa(etapa);
    return new Date(Date.now() + Math.max(1, minutos) * 60_000);
  }

  private minutosTimeoutPorEtapa(etapa: EtapaConversacionEntrega): number {
    const fallback = Number(process.env.CONFIRMACION_ENTREGA_TIMEOUT_MINUTOS ?? 60);
    const envPorEtapa: Record<EtapaConversacionEntrega, string> = {
      CONFIRMACION_INICIAL: 'CONFIRMACION_ENTREGA_TIMEOUT_MINUTOS',
      ESPERANDO_DIRECCION_ORIGINAL: 'CONFIRMACION_ENTREGA_TIMEOUT_DIRECCION_MIN',
      CONFIRMANDO_RECHAZO: 'CONFIRMACION_ENTREGA_TIMEOUT_DOBLE_CONFIRMACION_MIN',
      OFRECIENDO_UBICACION_ALTERNATIVA: 'CONFIRMACION_ENTREGA_TIMEOUT_OFERTA_MIN',
      ESPERANDO_NUEVA_UBICACION: 'CONFIRMACION_ENTREGA_TIMEOUT_NUEVA_UBICACION_MIN',
    };
    const defaults: Record<EtapaConversacionEntrega, number> = {
      CONFIRMACION_INICIAL: fallback,
      ESPERANDO_DIRECCION_ORIGINAL: 60,
      CONFIRMANDO_RECHAZO: 15,
      OFRECIENDO_UBICACION_ALTERNATIVA: 30,
      ESPERANDO_NUEVA_UBICACION: 30,
    };
    const raw = process.env[envPorEtapa[etapa]];
    if (raw != null) {
      const n = Number(raw);
      if (Number.isFinite(n) && n > 0) return n;
    }
    return defaults[etapa];
  }
}

interface ResultadoHandlerEtapa {
  respuesta: string;
  intencionClasificada?: IntencionConfirmacion;
  notificarVendedor?: 'TIMEOUT' | 'SIN_TELEFONO' | 'FALLO_ENVIO_INICIAL' | 'RECHAZADA';
}
