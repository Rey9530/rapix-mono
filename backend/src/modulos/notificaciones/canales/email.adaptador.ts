import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import nodemailer, { Transporter } from 'nodemailer';
import {
  CanalAdaptador,
  CanalNoConfiguradoError,
  ContextoEnvio,
} from './canal.adaptador.js';

@Injectable()
export class EmailAdaptador implements CanalAdaptador, OnModuleInit {
  private readonly logger = new Logger(EmailAdaptador.name);
  private transportador: Transporter | null = null;

  onModuleInit(): void {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT ?? 1025);
    if (!host) {
      this.logger.warn('SMTP no configurado (falta SMTP_HOST); email deshabilitado.');
      return;
    }
    const usuario = process.env.SMTP_USER;
    const contrasena = process.env.SMTP_PASSWORD;
    this.transportador = nodemailer.createTransport({
      host,
      port,
      secure: process.env.SMTP_SECURE === 'true',
      auth: usuario ? { user: usuario, pass: contrasena } : undefined,
    });
    this.logger.log(`Transporter SMTP configurado contra ${host}:${port}.`);
  }

  disponible(): boolean {
    return this.transportador !== null;
  }

  async enviar(ctx: ContextoEnvio): Promise<void> {
    if (!this.disponible() || !this.transportador) {
      throw new CanalNoConfiguradoError('EMAIL');
    }
    const { notificacion, usuario } = ctx;
    const destino = usuario?.email ?? notificacion.destino;
    if (!destino) throw new Error('EMAIL_SIN_DESTINO');

    const fromEmail = process.env.SMTP_FROM_EMAIL ?? 'no-reply@delivery.com';
    const fromName = process.env.SMTP_FROM_NAME ?? 'Rapix';

    await this.transportador.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: destino,
      subject: notificacion.titulo,
      text: notificacion.cuerpo,
      html: this.renderizar(notificacion.titulo, notificacion.cuerpo),
    });
  }

  private renderizar(titulo: string, cuerpo: string): string {
    const cuerpoHtml = cuerpo.replace(/\n/g, '<br/>');
    return `<!doctype html>
<html lang="es">
  <body style="font-family:Arial,sans-serif;background:#f7f7f7;padding:24px;">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:8px;padding:24px;">
      <h1 style="font-size:20px;margin:0 0 16px;color:#222;">${escaparHtml(titulo)}</h1>
      <p style="font-size:15px;line-height:1.5;color:#333;margin:0;">${cuerpoHtml}</p>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0;"/>
      <p style="font-size:12px;color:#999;margin:0;">Rapix — notificación automática</p>
    </div>
  </body>
</html>`;
  }
}

function escaparHtml(texto: string): string {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
