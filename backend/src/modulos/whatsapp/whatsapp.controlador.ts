import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../comun/decoradores/roles.decorador.js';
import { ChatWhatsappDto } from './dto/chat-whatsapp.dto.js';
import { EnviarMensajeTextoDto } from './dto/enviar-mensaje-texto.dto.js';
import { FiltrosChatsDto } from './dto/filtros-chats.dto.js';
import { FiltrosMensajesDto } from './dto/filtros-mensajes.dto.js';
import { MensajeWhatsappDto } from './dto/mensaje-whatsapp.dto.js';
import { ReaccionarMensajeDto } from './dto/reaccionar-mensaje.dto.js';
import { SesionWhatsappDto } from './dto/sesion-whatsapp.dto.js';
import { WhatsappChatServicio } from './servicios/whatsapp-chat.servicio.js';
import { WhatsappConexionServicio } from './servicios/whatsapp-conexion.servicio.js';
import { WhatsappMensajeServicio } from './servicios/whatsapp-mensaje.servicio.js';
import { chatADto } from './transformadores/chat-a-dto.js';
import { mensajeADto } from './transformadores/mensaje-a-dto.js';
import { sesionADto } from './transformadores/sesion-a-dto.js';

interface ArchivoMultipart {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
  fieldname: string;
}

const TIPOS_MEDIA_VALIDOS = ['IMAGEN', 'VIDEO', 'AUDIO', 'DOCUMENTO'] as const;
type TipoMedia = (typeof TIPOS_MEDIA_VALIDOS)[number];

@ApiTags('WhatsApp')
@ApiBearerAuth('autenticacion-jwt')
@Roles('ADMIN')
@Controller('whatsapp')
export class WhatsappControlador {
  constructor(
    private readonly conexion: WhatsappConexionServicio,
    private readonly chats: WhatsappChatServicio,
    private readonly mensajes: WhatsappMensajeServicio,
  ) {}

  // ──────────────────────────────────────────────────
  // Sesion
  // ──────────────────────────────────────────────────

  @Get('sesion')
  @ApiOperation({ summary: 'Devuelve el estado actual de la sesion de WhatsApp' })
  async obtenerSesion(): Promise<SesionWhatsappDto> {
    const sesion = await this.conexion.obtenerEstadoActual();
    return sesionADto(sesion);
  }

  @Post('sesion/vincular')
  @HttpCode(202)
  @ApiOperation({
    summary:
      'Inicia la conexion a WhatsApp para generar un QR. El QR final llega por WebSocket (`sesion:estado`).',
  })
  async vincular(): Promise<SesionWhatsappDto> {
    await this.conexion.iniciar();
    const sesion = await this.conexion.obtenerEstadoActual();
    return sesionADto(sesion);
  }

  @Delete('sesion')
  @ApiOperation({ summary: 'Cierra la sesion (logout) y limpia el auth state' })
  async cerrarSesion(): Promise<SesionWhatsappDto> {
    const sesion = await this.conexion.cerrarSesion();
    return sesionADto(sesion);
  }

  // ──────────────────────────────────────────────────
  // Chats
  // ──────────────────────────────────────────────────

  @Get('chats')
  @ApiOperation({ summary: 'Lista los chats persistidos (paginado)' })
  async listarChats(@Query() filtros: FiltrosChatsDto): Promise<{
    datos: ChatWhatsappDto[];
    total: number;
    pagina: number;
    totalPaginas: number;
  }> {
    const resultado = await this.chats.listar(filtros);
    return {
      ...resultado,
      datos: resultado.datos.map(chatADto),
    };
  }

  @Get('chats/:chatId')
  @ApiOperation({ summary: 'Detalle de un chat' })
  async obtenerChat(
    @Param('chatId', ParseUUIDPipe) chatId: string,
  ): Promise<ChatWhatsappDto> {
    const chat = await this.chats.obtener(chatId);
    return chatADto(chat);
  }

  @Get('chats/:chatId/mensajes')
  @ApiOperation({ summary: 'Lista los mensajes de un chat (paginado por cursor)' })
  async listarMensajes(
    @Param('chatId', ParseUUIDPipe) chatId: string,
    @Query() filtros: FiltrosMensajesDto,
  ): Promise<{ datos: MensajeWhatsappDto[]; cursor: string | null }> {
    await this.chats.obtener(chatId);
    const antesDe = filtros.antesDe ? new Date(filtros.antesDe) : null;
    const limite = filtros.limite ?? 50;
    const mensajes = await this.mensajes.listarPorChat(chatId, antesDe, limite);
    const cursor =
      mensajes.length > 0
        ? mensajes[mensajes.length - 1].creadoEn.toISOString()
        : null;
    return {
      datos: mensajes.map(mensajeADto),
      cursor,
    };
  }

  // ──────────────────────────────────────────────────
  // Envio
  // ──────────────────────────────────────────────────

  @Post('chats/:chatId/mensajes/texto')
  @ApiOperation({ summary: 'Envia un mensaje de texto al chat' })
  async enviarTexto(
    @Param('chatId', ParseUUIDPipe) chatId: string,
    @Body() dto: EnviarMensajeTextoDto,
  ): Promise<MensajeWhatsappDto> {
    const mensaje = await this.mensajes.enviarTexto({
      chatId,
      texto: dto.texto,
      respondeAId: dto.respondeAId,
    });
    return mensajeADto(mensaje);
  }

  @Post('chats/:chatId/mensajes/media')
  @UseInterceptors(FileInterceptor('archivo'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        archivo: { type: 'string', format: 'binary' },
        tipo: { type: 'string', enum: ['IMAGEN', 'VIDEO', 'AUDIO', 'DOCUMENTO'] },
        caption: { type: 'string' },
        respondeAId: { type: 'string', format: 'uuid' },
      },
      required: ['archivo', 'tipo'],
    },
  })
  @ApiOperation({
    summary: 'Envia un mensaje multimedia (imagen/video/audio/documento)',
  })
  async enviarMedia(
    @Param('chatId', ParseUUIDPipe) chatId: string,
    @UploadedFile() archivo: ArchivoMultipart | undefined,
    @Body('tipo') tipo: TipoMedia,
    @Body('caption') caption?: string,
    @Body('respondeAId') respondeAId?: string,
  ): Promise<MensajeWhatsappDto> {
    if (!archivo) {
      throw new BadRequestException('ARCHIVO_REQUERIDO');
    }
    if (!TIPOS_MEDIA_VALIDOS.includes(tipo)) {
      throw new BadRequestException('TIPO_MEDIA_INVALIDO');
    }
    const mensaje = await this.mensajes.enviarMedia({
      chatId,
      tipo,
      caption,
      respondeAId,
      archivo: {
        buffer: archivo.buffer,
        mimetype: archivo.mimetype,
        nombreOriginal: archivo.originalname,
      },
    });
    return mensajeADto(mensaje);
  }

  @Post('chats/:chatId/mensajes/:mensajeId/reaccion')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Reacciona (o quita la reaccion) a un mensaje del chat',
  })
  async reaccionar(
    @Param('chatId', ParseUUIDPipe) chatId: string,
    @Param('mensajeId', ParseUUIDPipe) mensajeId: string,
    @Body() dto: ReaccionarMensajeDto,
  ): Promise<void> {
    const emoji = dto.emoji ?? null;
    await this.mensajes.reaccionarSaliente(
      chatId,
      mensajeId,
      emoji && emoji.trim() !== '' ? emoji : null,
    );
  }

  @Post('chats/:chatId/leido')
  @ApiOperation({ summary: 'Marca todos los mensajes del chat como leidos' })
  async marcarLeido(
    @Param('chatId', ParseUUIDPipe) chatId: string,
  ): Promise<{ noLeidos: number }> {
    return this.mensajes.marcarLeido(chatId);
  }
}
