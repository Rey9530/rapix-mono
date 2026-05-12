// TODO: features Mailgun no expuestas todavia porque ningun caller las
// necesita. Agregar (en otra tarea) cuando aparezca un caso real:
//   - cc/bcc, replyTo, from override por mensaje
//   - attachments (buffer + filename + contentType)
//   - webhooks Mailgun (delivered/bounced/complained)
//   - templates server-side de Mailgun
//   - suppressions list / bounce handling
// TODO: consolidar render HTML compartido con email.adaptador.ts cuando
// SMTP se elimine en la tarea de cleanup.
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import formData from 'form-data';
import Mailgun from 'mailgun.js';
import {
  CanalAdaptador,
  CanalNoConfiguradoError,
  ContextoEnvio,
} from './canal.adaptador.js';

// Tipo estructural del cliente Mailgun. Evitamos importar `IMailgunClient`
// desde un subpath de `mailgun.js` para no acoplarnos a internals del SDK.
interface ClienteMailgun {
  messages: {
    create(
      domain: string,
      data: Record<string, unknown>,
    ): Promise<{ id?: string; message?: string }>;
  };
}

interface ErrorMailgun extends Error {
  status?: number;
  details?: string;
}

@Injectable()
export class MailgunAdaptador implements CanalAdaptador, OnModuleInit {
  private readonly logger = new Logger(MailgunAdaptador.name);
  private cliente: ClienteMailgun | null = null;
  private dominio = '';
  private remitente = '';

  onModuleInit(): void {
    if (process.env.MAIL_DRIVER !== 'mailgun') {
      this.logger.log(
        `Mailgun deshabilitado (MAIL_DRIVER=${process.env.MAIL_DRIVER ?? 'undefined'}).`,
      );
      return;
    }
    const apiKey = process.env.MAILGUN_API_KEY;
    const dominio = process.env.MAILGUN_DOMAIN;
    const remitente = process.env.MAILGUN_FROM;
    // Defensa en profundidad: el esquema Joi ya aborta el arranque si faltan.
    if (!apiKey || !dominio || !remitente) {
      throw new Error(
        'Mailgun mal configurado: faltan MAILGUN_API_KEY / MAILGUN_DOMAIN / MAILGUN_FROM.',
      );
    }
    const region = process.env.MAILGUN_REGION ?? 'us';
    const url =
      region === 'eu' ? 'https://api.eu.mailgun.net' : 'https://api.mailgun.net';
    const mailgun = new Mailgun(formData);
    this.cliente = mailgun.client({
      username: 'api',
      key: apiKey,
      url,
    }) as unknown as ClienteMailgun;
    this.dominio = dominio;
    this.remitente = remitente;
    this.logger.log(
      `Cliente Mailgun configurado (dominio=${dominio}, region=${region}).`,
    );
  }

  disponible(): boolean {
    return this.cliente !== null;
  }

  async enviar(ctx: ContextoEnvio): Promise<void> {
    if (!this.disponible() || !this.cliente) {
      throw new CanalNoConfiguradoError('EMAIL');
    }
    const { notificacion, usuario } = ctx;
    const destino = usuario?.email ?? notificacion.destino;
    if (!destino) throw new Error('EMAIL_SIN_DESTINO');

    const datos = (notificacion.datos ?? {}) as Record<string, unknown>;
    const plantilla =
      typeof datos.plantillaClave === 'string' ? datos.plantillaClave : null;

    const tags: string[] = ['canal:EMAIL'];
    if (plantilla) tags.push(`plantilla:${plantilla}`);

    const payload: Record<string, unknown> = {
      from: this.remitente,
      to: destino,
      subject: notificacion.titulo,
      text: notificacion.cuerpo,
      html: this.renderizar(notificacion.titulo, notificacion.cuerpo),
      'o:tag': tags,
      'v:notificacion-id': notificacion.id,
    };
    if (usuario?.id) payload['v:usuario-id'] = usuario.id;
    if (plantilla) payload['v:plantilla'] = plantilla;

    try {
      const resultado = await this.cliente.messages.create(this.dominio, payload);
      this.logger.log(
        `email enviado dest=${enmascararEmail(destino)} subject="${notificacion.titulo}" mailgunId=${resultado.id ?? 'desconocido'}`,
      );
    } catch (error) {
      const err = error as ErrorMailgun;
      const status = err.status ?? 0;
      // Nunca incluir la API key ni el payload crudo en logs.
      this.logger.error(
        `email fallo dest=${enmascararEmail(destino)} status=${status} mensaje=${err.message ?? 'error desconocido'}`,
      );
      if (status === 401 || status === 403 || status === 404) {
        throw new CanalNoConfiguradoError('EMAIL');
      }
      throw new Error(`mailgun:${status || 'unknown'}`);
    }
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

export function enmascararEmail(email: string): string {
  if (process.env.NODE_ENV !== 'production') return email;
  const arroba = email.indexOf('@');
  if (arroba <= 0) return '***';
  const inicial = email.charAt(0);
  return `${inicial}***${email.slice(arroba)}`;
}
