import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import {
  CanalAdaptador,
  CanalNoConfiguradoError,
  ContextoEnvio,
} from './canal.adaptador.js';

interface DatosPlantillaWhatsapp {
  nombre: string;
  idioma?: string;
  componentes?: unknown[];
}

@Injectable()
export class WhatsAppAdaptador implements CanalAdaptador {
  private readonly logger = new Logger(WhatsAppAdaptador.name);

  disponible(): boolean {
    return Boolean(
      process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_ACCESS_TOKEN,
    );
  }

  async enviar(ctx: ContextoEnvio): Promise<void> {
    if (!this.disponible()) {
      throw new CanalNoConfiguradoError('WHATSAPP');
    }
    const { notificacion, usuario } = ctx;
    const datos = (notificacion.datos as Record<string, unknown> | null) ?? {};
    const telefonoCrudo =
      (datos.telefono as string | undefined) ?? usuario?.telefono ?? notificacion.destino;
    if (!telefonoCrudo) {
      throw new Error('WHATSAPP_SIN_TELEFONO');
    }

    const destino = formatearE164(telefonoCrudo);
    const plantilla = datos.plantilla as DatosPlantillaWhatsapp | undefined;

    const cuerpo = plantilla
      ? {
          messaging_product: 'whatsapp',
          to: destino,
          type: 'template',
          template: {
            name: plantilla.nombre,
            language: { code: plantilla.idioma ?? 'es' },
            components: plantilla.componentes ?? [],
          },
        }
      : {
          messaging_product: 'whatsapp',
          to: destino,
          type: 'text',
          text: { body: `${notificacion.titulo}\n\n${notificacion.cuerpo}` },
        };

    const version = process.env.WHATSAPP_API_VERSION ?? 'v20.0';
    const url = `https://graph.facebook.com/${version}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

    try {
      await axios.post(url, cuerpo, {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const detalle = error.response?.data
          ? JSON.stringify(error.response.data)
          : error.message;
        throw new Error(`WHATSAPP_ERROR_${error.response?.status ?? 'NETWORK'}: ${detalle}`);
      }
      throw error;
    }
  }
}

function formatearE164(telefono: string): string {
  const limpio = telefono.replace(/[^\d+]/g, '');
  return limpio.startsWith('+') ? limpio.slice(1) : limpio;
}
