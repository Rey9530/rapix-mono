import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import admin from 'firebase-admin';
import { PrismaServicio } from '../../../prisma/prisma.servicio.js';
import {
  CanalAdaptador,
  CanalNoConfiguradoError,
  ContextoEnvio,
} from './canal.adaptador.js';

@Injectable()
export class PushAdaptador implements CanalAdaptador, OnModuleInit {
  private readonly logger = new Logger(PushAdaptador.name);
  private app: admin.app.App | null = null;

  constructor(private readonly prisma: PrismaServicio) {}

  onModuleInit(): void {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    if (!projectId || !privateKey || !clientEmail) {
      this.logger.warn(
        'FCM no configurado (falta FIREBASE_PROJECT_ID/FIREBASE_PRIVATE_KEY/FIREBASE_CLIENT_EMAIL); push deshabilitado.',
      );
      return;
    }
    try {
      this.app = admin.apps.length
        ? admin.app()
        : admin.initializeApp({
            credential: admin.credential.cert({ projectId, privateKey, clientEmail }),
          });
      this.logger.log('Firebase Admin SDK inicializado.');
    } catch (error) {
      this.logger.error(`No se pudo inicializar Firebase: ${(error as Error).message}`);
    }
  }

  disponible(): boolean {
    return this.app !== null;
  }

  async enviar(ctx: ContextoEnvio): Promise<void> {
    if (!this.disponible() || !this.app) {
      throw new CanalNoConfiguradoError('PUSH');
    }
    const { notificacion } = ctx;
    if (!notificacion.usuarioId) {
      throw new Error('PUSH requiere usuarioId para resolver tokens');
    }

    const tokens = await this.prisma.tokenDispositivo.findMany({
      where: { usuarioId: notificacion.usuarioId, activo: true },
    });
    if (tokens.length === 0) {
      throw new Error('PUSH_SIN_TOKENS_ACTIVOS');
    }

    const datos = aplanarDatos(notificacion.datos);
    const respuesta = await this.app.messaging().sendEachForMulticast({
      tokens: tokens.map((t) => t.token),
      notification: {
        title: notificacion.titulo,
        body: notificacion.cuerpo,
      },
      data: datos,
      android: { priority: 'high' },
      apns: { headers: { 'apns-priority': '10' } },
    });

    // Marcar tokens inválidos como inactivos.
    const tokensInvalidos: string[] = [];
    respuesta.responses.forEach((r, i) => {
      if (r.success) return;
      const code = r.error?.code;
      if (
        code === 'messaging/registration-token-not-registered' ||
        code === 'messaging/invalid-registration-token'
      ) {
        tokensInvalidos.push(tokens[i].token);
      }
    });
    if (tokensInvalidos.length > 0) {
      await this.prisma.tokenDispositivo.updateMany({
        where: { token: { in: tokensInvalidos } },
        data: { activo: false },
      });
      this.logger.log(`${tokensInvalidos.length} tokens FCM invalidados.`);
    }

    if (respuesta.successCount === 0) {
      throw new Error(
        `PUSH_TODOS_FALLARON: ${respuesta.responses
          .map((r) => r.error?.code ?? 'unknown')
          .join(',')}`,
      );
    }
  }
}

function aplanarDatos(datos: unknown): Record<string, string> {
  if (datos === null || datos === undefined || typeof datos !== 'object') return {};
  const salida: Record<string, string> = {};
  for (const [k, v] of Object.entries(datos as Record<string, unknown>)) {
    salida[k] = typeof v === 'string' ? v : JSON.stringify(v);
  }
  return salida;
}
