import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';
import { Publico } from '../../comun/decoradores/publico.decorador.js';
import { UsuarioActual } from '../../comun/decoradores/usuario-actual.decorador.js';
import type { Usuario } from '../../generated/prisma/client.js';
import { AutenticacionServicio } from './autenticacion.servicio.js';
import { CerrarSesionDto } from './dto/cerrar-sesion.dto.js';
import { CompletarRegistroDto } from './dto/completar-registro.dto.js';
import { ConfirmarRecuperacionContrasenaDto } from './dto/confirmar-recuperacion-contrasena.dto.js';
import { GoogleSignInDto } from './dto/google-sign-in.dto.js';
import { IniciarSesionDto } from './dto/iniciar-sesion.dto.js';
import { RefrescarDto } from './dto/refrescar.dto.js';
import { RegistrarDto } from './dto/registrar.dto.js';
import { RespuestaAutenticacionDto } from './dto/respuesta-autenticacion.dto.js';
import { SolicitarRecuperacionContrasenaDto } from './dto/solicitar-recuperacion-contrasena.dto.js';
import { UsuarioPublicoDto } from './dto/usuario-publico.dto.js';

@ApiTags('Autenticacion')
@Controller('autenticacion')
export class AutenticacionControlador {
  constructor(private readonly servicio: AutenticacionServicio) {}

  @Publico()
  @Post('registrar')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar un nuevo VENDEDOR o CLIENTE' })
  @ApiCreatedResponse({ type: RespuestaAutenticacionDto })
  registrar(
    @Body() dto: RegistrarDto,
    @Req() peticion: Request,
  ): Promise<RespuestaAutenticacionDto> {
    return this.servicio.registrar(dto, this.contextoDe(peticion));
  }

  @Publico()
  @Post('iniciar-sesion')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Autentica con email/contraseña y emite par de tokens' })
  @ApiOkResponse({ type: RespuestaAutenticacionDto })
  iniciarSesion(
    @Body() dto: IniciarSesionDto,
    @Req() peticion: Request,
  ): Promise<RespuestaAutenticacionDto> {
    return this.servicio.iniciarSesion(dto, this.contextoDe(peticion));
  }

  @Publico()
  @Post('google')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Autentica con un idToken de Google: crea o enlaza la cuenta y emite par de tokens. Si registroCompleto=false, la app debe llevar al usuario a completar registro.',
  })
  @ApiOkResponse({ type: RespuestaAutenticacionDto })
  iniciarSesionConGoogle(
    @Body() dto: GoogleSignInDto,
    @Req() peticion: Request,
  ): Promise<RespuestaAutenticacionDto> {
    return this.servicio.iniciarSesionConGoogle(dto, this.contextoDe(peticion));
  }

  @ApiBearerAuth('autenticacion-jwt')
  @Patch('completar-registro')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Completa el registro de un usuario creado vía OAuth: setea teléfono y datos del negocio (PerfilVendedor), marca registroCompleto=true.',
  })
  @ApiOkResponse({ type: UsuarioPublicoDto })
  completarRegistro(
    @UsuarioActual() usuario: Usuario,
    @Body() dto: CompletarRegistroDto,
  ): Promise<UsuarioPublicoDto> {
    return this.servicio.completarRegistro(usuario.id, dto);
  }

  @Publico()
  @Post('refrescar')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Rota el refresh token: revoca el anterior y emite uno nuevo',
  })
  @ApiOkResponse({ type: RespuestaAutenticacionDto })
  refrescar(
    @Body() dto: RefrescarDto,
    @Req() peticion: Request,
  ): Promise<RespuestaAutenticacionDto> {
    return this.servicio.refrescar(dto, this.contextoDe(peticion));
  }

  @ApiBearerAuth('autenticacion-jwt')
  @Post('cerrar-sesion')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Revoca el refresh token proporcionado' })
  @ApiNoContentResponse()
  async cerrarSesion(
    @UsuarioActual() usuario: Usuario,
    @Body() dto: CerrarSesionDto,
  ): Promise<void> {
    await this.servicio.cerrarSesion(usuario.id, dto);
  }

  @Publico()
  @Get('verificar-correo')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'text/html; charset=utf-8')
  @ApiOperation({
    summary:
      'Endpoint público que se abre desde el enlace del correo de verificación. Devuelve HTML.',
  })
  @ApiQuery({ name: 'token', required: true })
  async verificarCorreo(@Query('token') token: string): Promise<string> {
    try {
      await this.servicio.verificarCorreo(token);
      return paginaHtml(
        '¡Correo verificado!',
        'Tu correo electrónico ha sido verificado correctamente. Ya puedes volver a la aplicación.',
        true,
      );
    } catch {
      return paginaHtml(
        'Enlace inválido',
        'Este enlace de verificación es inválido o ha expirado. Solicita uno nuevo desde la aplicación.',
        false,
      );
    }
  }

  @ApiBearerAuth('autenticacion-jwt')
  @Post('reenviar-verificacion')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reenvía el correo de verificación al usuario autenticado',
  })
  async reenviarVerificacion(
    @UsuarioActual() usuario: Usuario,
  ): Promise<{ enviado: true }> {
    await this.servicio.reenviarVerificacionCorreo(usuario);
    return { enviado: true };
  }

  @Publico()
  @Throttle({ default: { limit: 5, ttl: 3_600_000 } })
  @Post('solicitar-recuperacion-contrasena')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Solicita un código de recuperación de contraseña por correo',
  })
  @ApiOkResponse({
    description:
      'Siempre responde 200 aunque el email no exista (anti-enumeración). El código solo se envía si la cuenta existe y está activa.',
  })
  async solicitarRecuperacionContrasena(
    @Body() dto: SolicitarRecuperacionContrasenaDto,
  ): Promise<{ enviado: true }> {
    await this.servicio.solicitarRecuperacionContrasena(dto.email);
    return { enviado: true };
  }

  @Publico()
  @Throttle({ default: { limit: 10, ttl: 600_000 } })
  @Post('confirmar-recuperacion-contrasena')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Confirma el código de recuperación y establece la nueva contraseña',
  })
  @ApiOkResponse({
    description: 'Contraseña actualizada y todas las sesiones revocadas',
  })
  async confirmarRecuperacionContrasena(
    @Body() dto: ConfirmarRecuperacionContrasenaDto,
  ): Promise<{ ok: true }> {
    await this.servicio.confirmarRecuperacionContrasena(
      dto.email,
      dto.codigo,
      dto.nuevaContrasena,
    );
    return { ok: true };
  }

  private contextoDe(peticion: Request) {
    return {
      userAgent: peticion.get('user-agent') ?? undefined,
      direccionIp: peticion.ip,
    };
  }
}

function paginaHtml(titulo: string, mensaje: string, exito: boolean): string {
  const color = exito ? '#16a34a' : '#dc2626';
  const icono = exito ? '✓' : '✕';
  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escaparHtml(titulo)} — Rapix</title>
  </head>
  <body style="font-family:Arial,sans-serif;background:#f7f7f7;margin:0;padding:24px;display:flex;align-items:center;justify-content:center;min-height:100vh;">
    <div style="max-width:480px;width:100%;background:#fff;border-radius:12px;padding:32px;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,0.05);">
      <div style="font-size:48px;color:${color};line-height:1;">${icono}</div>
      <h1 style="font-size:22px;margin:16px 0 8px;color:#222;">${escaparHtml(titulo)}</h1>
      <p style="font-size:15px;line-height:1.5;color:#555;margin:0;">${escaparHtml(mensaje)}</p>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
      <p style="font-size:12px;color:#999;margin:0;">Rapix</p>
    </div>
  </body>
</html>`;
}

function escaparHtml(texto: string): string {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
