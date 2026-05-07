import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
  ServiceUnavailableException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type { WASocket } from 'baileys';
import { Boom } from '@hapi/boom';
import baileys, {
  Browsers,
  DisconnectReason,
  fetchLatestBaileysVersion,
} from 'baileys';
import pino from 'pino';
import { EventosDominio } from '../../../eventos/eventos-dominio.js';
import type { SesionWhatsapp } from '../../../generated/prisma/client.js';
import { PrismaServicio } from '../../../prisma/prisma.servicio.js';
import { WhatsappAuthStateServicio } from './whatsapp-auth-state.servicio.js';

const SESION_ID = 'global';
const RECONEXION_BASE_MS = 2000;
const RECONEXION_MAX_MS = 60000;

/**
 * Servicio singleton que gestiona la unica conexion de Baileys del sistema.
 *
 * Responsabilidades:
 *   - Construir el `WASocket` con `makeWASocket` usando el auth state persistido en DB.
 *   - Manejar `connection.update`, `creds.update` y emitir eventos de dominio
 *     (`whatsapp.estado_cambiado`, `whatsapp.qr_disponible`).
 *   - Reconexion con backoff exponencial (excepto en `loggedOut`).
 *   - Cierre limpio en `OnModuleDestroy`.
 *
 * Otros servicios (eventos, mensajes) suscriben los eventos del socket via
 * `obtenerSocket()` o consumen los eventos de dominio.
 */
@Injectable()
export class WhatsappConexionServicio implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(WhatsappConexionServicio.name);
  private socket: WASocket | null = null;
  private reconectandoEnMs: number = RECONEXION_BASE_MS;
  private timerReconexion: NodeJS.Timeout | null = null;
  private cerrando = false;
  private iniciandoMutex: Promise<void> | null = null;
  private conectada = false;

  constructor(
    private readonly authState: WhatsappAuthStateServicio,
    private readonly prisma: PrismaServicio,
    private readonly eventos: EventEmitter2,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.asegurarFilaSesion();
    if (process.env.WHATSAPP_BAILEYS_HABILITADO === 'false') {
      this.logger.warn(
        'WHATSAPP_BAILEYS_HABILITADO=false; el modulo no levantara la conexion.',
      );
      return;
    }
    if (await this.authState.tieneCredenciales()) {
      this.logger.log(
        'Credenciales previas encontradas; intentando reconectar a WhatsApp.',
      );
      await this.iniciar().catch((error) => {
        this.logger.error(
          `Falla al iniciar conexion al arranque: ${this.mensajeError(error)}`,
        );
      });
    } else {
      this.logger.log(
        'Sin credenciales previas; la sesion queda DESCONECTADA hasta vincular.',
      );
    }
  }

  async onModuleDestroy(): Promise<void> {
    this.cerrando = true;
    if (this.timerReconexion) {
      clearTimeout(this.timerReconexion);
      this.timerReconexion = null;
    }
    if (this.socket) {
      try {
        this.socket.end(undefined);
      } catch {
        // mejor esfuerzo
      }
      this.socket = null;
    }
  }

  /**
   * Inicia (o re-inicia) la conexion. Idempotente: si ya hay socket conectado,
   * cierra el actual antes de levantar uno nuevo. Protegido por mutex.
   */
  async iniciar(): Promise<void> {
    if (this.iniciandoMutex) {
      await this.iniciandoMutex;
      return;
    }
    this.iniciandoMutex = this.iniciarInterno();
    try {
      await this.iniciandoMutex;
    } finally {
      this.iniciandoMutex = null;
    }
  }

  private async iniciarInterno(): Promise<void> {
    this.cerrando = false;
    if (this.timerReconexion) {
      clearTimeout(this.timerReconexion);
      this.timerReconexion = null;
    }
    if (this.socket) {
      try {
        this.socket.end(undefined);
      } catch {
        // mejor esfuerzo
      }
      this.socket = null;
    }

    const { state, saveCreds } = await this.authState.obtener();
    const { version } = await fetchLatestBaileysVersion();

    const navegador = process.env.WHATSAPP_BAILEYS_NAVEGADOR_NOMBRE ?? 'Rapix';
    const nivelLog =
      (process.env.WHATSAPP_BAILEYS_LOG_LEVEL as pino.LevelWithSilent) ?? 'warn';

    const logger = pino({ level: nivelLog });

    this.socket = baileys({
      version,
      auth: state,
      logger,
      browser: Browsers.appropriate(navegador),
      printQRInTerminal: false,
      syncFullHistory: false,
      markOnlineOnConnect: false,
      generateHighQualityLinkPreview: false,
    });

    this.socket.ev.on('creds.update', () => {
      void saveCreds();
    });

    this.socket.ev.on('connection.update', (update) => {
      void this.alActualizarConexion(update).catch((error) => {
        this.logger.error(
          `Falla procesando connection.update: ${this.mensajeError(error)}`,
        );
      });
    });

    // Notifica a otros servicios (`WhatsappEventoServicio`) que se re-suscriban
    // a los eventos del socket recien creado. Es un evento interno; no se
    // propaga al frontend.
    this.eventos.emit(EventosDominio.WhatsappSocketCreado, {
      socket: this.socket,
    });
  }

  /**
   * Devuelve el socket activo o lanza un error si no hay conexion.
   * Lo usaran `WhatsappEventoServicio` y `WhatsappMensajeServicio`.
   */
  obtenerSocket(): WASocket {
    if (!this.socket || !this.conectada) {
      throw new ServiceUnavailableException({
        codigo: 'WHATSAPP_NO_CONECTADO',
        mensaje:
          'La sesion de WhatsApp no esta conectada. Vincula un telefono desde el panel y vuelve a intentar.',
      });
    }
    return this.socket;
  }

  obtenerSocketOpcional(): WASocket | null {
    return this.socket;
  }

  /**
   * Indica si la sesion esta `CONECTADA` segun el ultimo `connection.update`.
   * Lectura sincrona (sin tocar DB) — util para chequeos rapidos como
   * `CanalAdaptador.disponible()`.
   */
  estaConectada(): boolean {
    return this.conectada;
  }

  /**
   * Estado actual persistido en DB.
   */
  async obtenerEstadoActual(): Promise<SesionWhatsapp> {
    return this.asegurarFilaSesion();
  }

  /**
   * Cierra la sesion (logout en WhatsApp), limpia el auth state y marca DESCONECTADA.
   */
  async cerrarSesion(): Promise<SesionWhatsapp> {
    this.cerrando = true;
    this.conectada = false;
    if (this.timerReconexion) {
      clearTimeout(this.timerReconexion);
      this.timerReconexion = null;
    }
    if (this.socket) {
      try {
        await this.socket.logout();
      } catch (error) {
        this.logger.warn(
          `logout() lanzo error (ignorado): ${this.mensajeError(error)}`,
        );
      }
      try {
        this.socket.end(undefined);
      } catch {
        // mejor esfuerzo
      }
      this.socket = null;
    }
    await this.authState.limpiar();
    const sesion = await this.prisma.sesionWhatsapp.update({
      where: { id: SESION_ID },
      data: {
        estado: 'DESCONECTADA',
        qrActual: null,
        qrExpiraEn: null,
        jidPropio: null,
        numeroPropio: null,
        nombrePropio: null,
        desconectadoEn: new Date(),
      },
    });
    this.cerrando = false;
    this.eventos.emit(EventosDominio.WhatsappEstadoCambiado, {
      sesion,
    });
    return sesion;
  }

  // ──────────────────────────────────────────────────
  // Internos
  // ──────────────────────────────────────────────────

  private async alActualizarConexion(update: {
    connection?: 'open' | 'close' | 'connecting';
    qr?: string;
    lastDisconnect?: { error?: Error | undefined };
    isNewLogin?: boolean;
  }): Promise<void> {
    const { connection, qr, lastDisconnect } = update;

    if (qr) {
      this.reconectandoEnMs = RECONEXION_BASE_MS;
      const sesion = await this.prisma.sesionWhatsapp.update({
        where: { id: SESION_ID },
        data: {
          estado: 'ESPERANDO_QR',
          qrActual: qr,
          qrExpiraEn: new Date(Date.now() + 60_000),
        },
      });
      this.logger.log('QR generado, esperando escaneo.');
      this.eventos.emit(EventosDominio.WhatsappQrDisponible, { sesion });
      this.eventos.emit(EventosDominio.WhatsappEstadoCambiado, { sesion });
    }

    if (connection === 'open') {
      this.conectada = true;
      this.reconectandoEnMs = RECONEXION_BASE_MS;
      const socket = this.socket;
      const me = socket?.user;
      const jid = me?.id;
      const numero = jid ? extraerNumero(jid) : null;
      const sesion = await this.prisma.sesionWhatsapp.update({
        where: { id: SESION_ID },
        data: {
          estado: 'CONECTADA',
          jidPropio: jid ?? null,
          numeroPropio: numero,
          nombrePropio: me?.name ?? null,
          qrActual: null,
          qrExpiraEn: null,
          ultimoError: null,
          ultimoErrorEn: null,
          conectadoEn: new Date(),
        },
      });
      this.logger.log(`Conectado a WhatsApp como ${numero ?? jid ?? '?'}.`);
      this.eventos.emit(EventosDominio.WhatsappEstadoCambiado, { sesion });
    }

    if (connection === 'close') {
      this.conectada = false;
      const error = lastDisconnect?.error;
      const codigo =
        error instanceof Boom ? error.output?.statusCode : undefined;
      const mensaje = this.mensajeError(error);
      this.logger.warn(
        `Conexion cerrada (codigo=${codigo ?? 'n/a'}): ${mensaje}`,
      );

      if (codigo === DisconnectReason.loggedOut) {
        await this.authState.limpiar();
        const sesion = await this.prisma.sesionWhatsapp.update({
          where: { id: SESION_ID },
          data: {
            estado: 'EXPIRADA',
            qrActual: null,
            qrExpiraEn: null,
            jidPropio: null,
            numeroPropio: null,
            nombrePropio: null,
            ultimoError: mensaje,
            ultimoErrorEn: new Date(),
            desconectadoEn: new Date(),
          },
        });
        this.eventos.emit(EventosDominio.WhatsappEstadoCambiado, { sesion });
        return;
      }

      if (codigo === DisconnectReason.forbidden) {
        const sesion = await this.prisma.sesionWhatsapp.update({
          where: { id: SESION_ID },
          data: {
            estado: 'BANEADA',
            ultimoError: mensaje,
            ultimoErrorEn: new Date(),
            desconectadoEn: new Date(),
          },
        });
        this.eventos.emit(EventosDominio.WhatsappEstadoCambiado, { sesion });
        return;
      }

      const sesion = await this.prisma.sesionWhatsapp.update({
        where: { id: SESION_ID },
        data: {
          estado: 'DESCONECTADA',
          ultimoError: mensaje,
          ultimoErrorEn: new Date(),
          desconectadoEn: new Date(),
        },
      });
      this.eventos.emit(EventosDominio.WhatsappEstadoCambiado, { sesion });

      if (this.cerrando) return;

      // `restartRequired` (515): WhatsApp pide reiniciar la conexion ya. Es lo
      // tipico justo despues de escanear el QR — si esperamos el backoff, la
      // sesion recien creada se invalida y caemos en `loggedOut`. Reconectar
      // inmediatamente.
      if (codigo === DisconnectReason.restartRequired) {
        this.logger.log('Reinicio requerido por WhatsApp; reconectando ya.');
        this.reconectandoEnMs = RECONEXION_BASE_MS;
        void this.iniciar().catch((error) => {
          this.logger.error(
            `Falla reiniciando conexion tras 515: ${this.mensajeError(error)}`,
          );
        });
        return;
      }

      this.programarReconexion();
    }
  }

  private programarReconexion(): void {
    if (this.timerReconexion) return;
    const espera = this.reconectandoEnMs;
    this.logger.log(`Reintentando conexion en ${espera}ms.`);
    this.timerReconexion = setTimeout(() => {
      this.timerReconexion = null;
      void this.iniciar().catch((error) => {
        this.logger.error(
          `Falla en reconexion: ${this.mensajeError(error)}`,
        );
      });
    }, espera);
    this.reconectandoEnMs = Math.min(espera * 2, RECONEXION_MAX_MS);
  }

  private async asegurarFilaSesion(): Promise<SesionWhatsapp> {
    return this.prisma.sesionWhatsapp.upsert({
      where: { id: SESION_ID },
      create: { id: SESION_ID, estado: 'DESCONECTADA' },
      update: {},
    });
  }

  private mensajeError(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return JSON.stringify(error);
  }
}

function extraerNumero(jid: string): string | null {
  const partes = jid.split('@');
  if (partes.length !== 2) return null;
  const numero = partes[0].split(':')[0];
  return /^\d+$/.test(numero) ? numero : null;
}
