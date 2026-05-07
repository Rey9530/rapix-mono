import { Injectable, Logger } from '@nestjs/common';
import type {
  AuthenticationCreds,
  AuthenticationState,
  SignalDataTypeMap,
  SignalKeyStore,
} from 'baileys';
import { initAuthCreds, BufferJSON, proto } from 'baileys';
import type { Prisma } from '../../../generated/prisma/client.js';
import { PrismaServicio } from '../../../prisma/prisma.servicio.js';

/**
 * Persistencia del AuthenticationState de Baileys en Postgres.
 *
 * Reemplaza a `useMultiFileAuthState` (filesystem) para que el backend
 * pueda escalar/redeplooyarse sin perder la sesion. La tabla
 * `auth_state_whatsapp` es key-value:
 *   - `tipo='creds'`, `clave='global'` → AuthenticationCreds serializadas
 *   - `tipo='pre-key'|'session'|...`, `clave=<id>` → SignalDataTypeMap[tipo]
 *
 * Se serializa con `BufferJSON` (de baileys) para preservar
 * `Uint8Array`/`Buffer` dentro de JSONB.
 */
@Injectable()
export class WhatsappAuthStateServicio {
  private static readonly SESION_ID = 'global';
  private static readonly TIPO_CREDS = 'creds';
  private static readonly CLAVE_CREDS = 'global';

  private readonly logger = new Logger(WhatsappAuthStateServicio.name);

  constructor(private readonly prisma: PrismaServicio) {}

  /**
   * Devuelve el `AuthenticationState` y `saveCreds` para pasar a `makeWASocket`.
   * Si no hay creds previas en DB, las inicializa via `initAuthCreds()`.
   */
  async obtener(): Promise<{
    state: AuthenticationState;
    saveCreds: () => Promise<void>;
  }> {
    const creds = (await this.leerCreds()) ?? initAuthCreds();

    const keys: SignalKeyStore = {
      get: async <T extends keyof SignalDataTypeMap>(
        tipo: T,
        ids: string[],
      ): Promise<{ [id: string]: SignalDataTypeMap[T] }> => {
        const filas = await this.prisma.authStateWhatsapp.findMany({
          where: {
            sesionId: WhatsappAuthStateServicio.SESION_ID,
            tipo,
            clave: { in: ids },
          },
        });

        const resultado: { [id: string]: SignalDataTypeMap[T] } = {};
        for (const fila of filas) {
          let valor = this.deserializar(fila.valor);
          if (tipo === 'app-state-sync-key' && valor) {
            valor = proto.Message.AppStateSyncKeyData.fromObject(
              valor as proto.Message.IAppStateSyncKeyData,
            );
          }
          resultado[fila.clave] = valor as SignalDataTypeMap[T];
        }
        return resultado;
      },

      set: async (data) => {
        const tareas: Promise<unknown>[] = [];
        for (const tipo in data) {
          const tipoTipado = tipo as keyof SignalDataTypeMap;
          const grupo = data[tipoTipado];
          if (!grupo) continue;
          for (const clave in grupo) {
            const valor = grupo[clave];
            if (valor === null || valor === undefined) {
              tareas.push(this.borrar(tipoTipado, clave));
            } else {
              tareas.push(this.upsert(tipoTipado, clave, valor));
            }
          }
        }
        await Promise.all(tareas);
      },

      clear: async () => {
        await this.prisma.authStateWhatsapp.deleteMany({
          where: {
            sesionId: WhatsappAuthStateServicio.SESION_ID,
            tipo: { not: WhatsappAuthStateServicio.TIPO_CREDS },
          },
        });
      },
    };

    const saveCreds = async (): Promise<void> => {
      await this.upsertCreds(creds);
    };

    return {
      state: { creds, keys },
      saveCreds,
    };
  }

  /**
   * Borra TODO el auth state (creds + keys). Usar al hacer logout.
   */
  async limpiar(): Promise<void> {
    await this.prisma.authStateWhatsapp.deleteMany({
      where: { sesionId: WhatsappAuthStateServicio.SESION_ID },
    });
    this.logger.log('Auth state de WhatsApp limpiado');
  }

  /**
   * Indica si existe una credencial registrada (sesion previa).
   */
  async tieneCredenciales(): Promise<boolean> {
    const fila = await this.prisma.authStateWhatsapp.findFirst({
      where: {
        sesionId: WhatsappAuthStateServicio.SESION_ID,
        tipo: WhatsappAuthStateServicio.TIPO_CREDS,
        clave: WhatsappAuthStateServicio.CLAVE_CREDS,
      },
      select: { id: true },
    });
    return fila !== null;
  }

  // ──────────────────────────────────────────────────
  // Internos
  // ──────────────────────────────────────────────────

  private async leerCreds(): Promise<AuthenticationCreds | null> {
    const fila = await this.prisma.authStateWhatsapp.findUnique({
      where: {
        sesionId_tipo_clave: {
          sesionId: WhatsappAuthStateServicio.SESION_ID,
          tipo: WhatsappAuthStateServicio.TIPO_CREDS,
          clave: WhatsappAuthStateServicio.CLAVE_CREDS,
        },
      },
    });
    if (!fila) return null;
    return this.deserializar(fila.valor) as AuthenticationCreds;
  }

  private async upsertCreds(creds: AuthenticationCreds): Promise<void> {
    await this.upsert(
      WhatsappAuthStateServicio.TIPO_CREDS,
      WhatsappAuthStateServicio.CLAVE_CREDS,
      creds,
    );
  }

  private async upsert(
    tipo: string,
    clave: string,
    valor: unknown,
  ): Promise<void> {
    const serializado = this.serializar(valor) as Prisma.InputJsonValue;
    await this.prisma.authStateWhatsapp.upsert({
      where: {
        sesionId_tipo_clave: {
          sesionId: WhatsappAuthStateServicio.SESION_ID,
          tipo,
          clave,
        },
      },
      create: {
        sesionId: WhatsappAuthStateServicio.SESION_ID,
        tipo,
        clave,
        valor: serializado,
      },
      update: { valor: serializado },
    });
  }

  private async borrar(tipo: string, clave: string): Promise<void> {
    await this.prisma.authStateWhatsapp.deleteMany({
      where: {
        sesionId: WhatsappAuthStateServicio.SESION_ID,
        tipo,
        clave,
      },
    });
  }

  /**
   * Serializa a JSONB usando `BufferJSON.replacer` para preservar Buffers/Uint8Array.
   * `BufferJSON.replacer` produce strings como `{ "type": "Buffer", "data": "base64..." }`
   * que sobreviven al round-trip JSON → JSONB → JSON.
   */
  private serializar(valor: unknown): unknown {
    return JSON.parse(JSON.stringify(valor, BufferJSON.replacer));
  }

  private deserializar(valor: unknown): unknown {
    // Postgres devuelve el JSONB ya parseado. Hacemos round-trip por el reviver
    // para reconstruir Buffers que fueron serializados como `{type:'Buffer',data:...}`.
    return JSON.parse(JSON.stringify(valor), BufferJSON.reviver);
  }
}
