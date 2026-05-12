import { jest } from '@jest/globals';
import { CanalNoConfiguradoError } from '../../src/modulos/notificaciones/canales/canal.adaptador.js';
import {
  enmascararEmail,
  MailgunAdaptador,
} from '../../src/modulos/notificaciones/canales/mailgun.adaptador.js';

// Fija el entorno minimo que el adaptador necesita para `onModuleInit`.
function configurarEnv(vars: Record<string, string | undefined>): void {
  for (const [clave, valor] of Object.entries(vars)) {
    if (valor === undefined) delete process.env[clave];
    else process.env[clave] = valor;
  }
}

function notificacionFake(extras: Record<string, unknown> = {}): any {
  return {
    id: 'notif-1',
    usuarioId: null,
    canal: 'EMAIL',
    estado: 'PENDIENTE',
    titulo: 'Asunto de prueba',
    cuerpo: 'Cuerpo\ncon salto',
    datos: { plantillaClave: 'PEDIDO_CREADO_VENDEDOR' },
    destino: 'cliente@example.com',
    enviadoEn: null,
    leidoEn: null,
    mensajeError: null,
    creadoEn: new Date(),
    actualizadoEn: new Date(),
    ...extras,
  };
}

function usuarioFake(extras: Record<string, unknown> = {}): any {
  return {
    id: 'usuario-1',
    email: 'vendedor@example.com',
    ...extras,
  };
}

describe('MailgunAdaptador', () => {
  const ENV_ORIGINAL = { ...process.env };

  afterEach(() => {
    process.env = { ...ENV_ORIGINAL };
    jest.restoreAllMocks();
  });

  describe('onModuleInit / disponible', () => {
    it('queda inactivo cuando MAIL_DRIVER no es mailgun', () => {
      configurarEnv({
        MAIL_DRIVER: 'smtp',
        MAILGUN_API_KEY: undefined,
        MAILGUN_DOMAIN: undefined,
        MAILGUN_FROM: undefined,
      });
      const adaptador = new MailgunAdaptador();
      adaptador.onModuleInit();
      expect(adaptador.disponible()).toBe(false);
    });

    it('queda activo cuando MAIL_DRIVER=mailgun y la config esta completa', () => {
      configurarEnv({
        MAIL_DRIVER: 'mailgun',
        MAILGUN_API_KEY: 'key-test',
        MAILGUN_DOMAIN: 'mg.test.com',
        MAILGUN_FROM: 'Rapix <no-reply@mg.test.com>',
        MAILGUN_REGION: 'us',
      });
      const adaptador = new MailgunAdaptador();
      adaptador.onModuleInit();
      expect(adaptador.disponible()).toBe(true);
    });

    it('lanza si MAIL_DRIVER=mailgun pero faltan vars (defensa en profundidad)', () => {
      configurarEnv({
        MAIL_DRIVER: 'mailgun',
        MAILGUN_API_KEY: undefined,
        MAILGUN_DOMAIN: 'mg.test.com',
        MAILGUN_FROM: 'Rapix <x@y.com>',
      });
      const adaptador = new MailgunAdaptador();
      expect(() => adaptador.onModuleInit()).toThrow(/Mailgun mal configurado/);
    });
  });

  describe('enviar', () => {
    function montarAdaptadorActivo() {
      configurarEnv({
        MAIL_DRIVER: 'mailgun',
        MAILGUN_API_KEY: 'key-secreta-no-loguear',
        MAILGUN_DOMAIN: 'mg.test.com',
        MAILGUN_FROM: 'Rapix <no-reply@mg.test.com>',
        MAILGUN_REGION: 'us',
        NODE_ENV: 'development',
      });
      const adaptador = new MailgunAdaptador();
      adaptador.onModuleInit();
      const create = jest
        .fn<(d: string, p: Record<string, unknown>) => Promise<{ id: string }>>()
        .mockResolvedValue({ id: 'mg-msg-123' });
      (adaptador as any).cliente = { messages: { create } };
      return { adaptador, create };
    }

    it('lanza CanalNoConfiguradoError si el cliente no esta inicializado', async () => {
      configurarEnv({ MAIL_DRIVER: 'smtp' });
      const adaptador = new MailgunAdaptador();
      adaptador.onModuleInit();
      await expect(
        adaptador.enviar({ notificacion: notificacionFake(), usuario: null }),
      ).rejects.toBeInstanceOf(CanalNoConfiguradoError);
    });

    it('lanza EMAIL_SIN_DESTINO si no hay usuario ni destino', async () => {
      const { adaptador } = montarAdaptadorActivo();
      const notif = notificacionFake({ destino: null });
      await expect(
        adaptador.enviar({ notificacion: notif, usuario: null }),
      ).rejects.toThrow('EMAIL_SIN_DESTINO');
    });

    it('arma el payload con tags, custom variables y dominio correcto', async () => {
      const { adaptador, create } = montarAdaptadorActivo();
      const notif = notificacionFake();
      const usuario = usuarioFake();
      await adaptador.enviar({ notificacion: notif, usuario });

      expect(create).toHaveBeenCalledTimes(1);
      const [dominio, payload] = create.mock.calls[0];
      expect(dominio).toBe('mg.test.com');
      expect(payload.from).toBe('Rapix <no-reply@mg.test.com>');
      expect(payload.to).toBe('vendedor@example.com');
      expect(payload.subject).toBe('Asunto de prueba');
      expect(payload.text).toBe('Cuerpo\ncon salto');
      expect(payload.html).toContain('<h1');
      expect(payload['o:tag']).toEqual([
        'canal:EMAIL',
        'plantilla:PEDIDO_CREADO_VENDEDOR',
      ]);
      expect(payload['v:notificacion-id']).toBe('notif-1');
      expect(payload['v:usuario-id']).toBe('usuario-1');
      expect(payload['v:plantilla']).toBe('PEDIDO_CREADO_VENDEDOR');
    });

    it('omite tag de plantilla y v:usuario-id cuando los datos no los traen', async () => {
      const { adaptador, create } = montarAdaptadorActivo();
      const notif = notificacionFake({ datos: null });
      await adaptador.enviar({ notificacion: notif, usuario: null });

      const [, payload] = create.mock.calls[0];
      expect(payload['o:tag']).toEqual(['canal:EMAIL']);
      expect(payload['v:usuario-id']).toBeUndefined();
      expect(payload['v:plantilla']).toBeUndefined();
    });

    it('prefiere usuario.email sobre notificacion.destino', async () => {
      const { adaptador, create } = montarAdaptadorActivo();
      const notif = notificacionFake({ destino: 'fallback@example.com' });
      const usuario = usuarioFake({ email: 'preferido@example.com' });
      await adaptador.enviar({ notificacion: notif, usuario });
      expect(create.mock.calls[0][1].to).toBe('preferido@example.com');
    });

    it('mapea errores 401/403/404 del SDK a CanalNoConfiguradoError', async () => {
      const { adaptador } = montarAdaptadorActivo();
      const errorAuth: any = new Error('Unauthorized');
      errorAuth.status = 401;
      (adaptador as any).cliente.messages.create = jest
        .fn<(d: string, p: Record<string, unknown>) => Promise<unknown>>()
        .mockRejectedValue(errorAuth);
      await expect(
        adaptador.enviar({
          notificacion: notificacionFake(),
          usuario: usuarioFake(),
        }),
      ).rejects.toBeInstanceOf(CanalNoConfiguradoError);
    });

    it('mapea otros errores del SDK a Error("mailgun:<status>")', async () => {
      const { adaptador } = montarAdaptadorActivo();
      const error500: any = new Error('Bad Gateway');
      error500.status = 502;
      (adaptador as any).cliente.messages.create = jest
        .fn<(d: string, p: Record<string, unknown>) => Promise<unknown>>()
        .mockRejectedValue(error500);
      await expect(
        adaptador.enviar({
          notificacion: notificacionFake(),
          usuario: usuarioFake(),
        }),
      ).rejects.toThrow('mailgun:502');
    });

    it('nunca registra la MAILGUN_API_KEY en los logs', async () => {
      const { adaptador, create } = montarAdaptadorActivo();
      const logger = (adaptador as any).logger as { log: jest.Mock; error: jest.Mock };
      const spyLog = jest.spyOn(logger, 'log');
      const spyError = jest.spyOn(logger, 'error');

      await adaptador.enviar({
        notificacion: notificacionFake(),
        usuario: usuarioFake(),
      });

      const error500: any = new Error('Bad Gateway');
      error500.status = 502;
      (create as jest.Mock).mockRejectedValueOnce(error500);
      await expect(
        adaptador.enviar({
          notificacion: notificacionFake(),
          usuario: usuarioFake(),
        }),
      ).rejects.toThrow();

      const todosLosLogs = [
        ...spyLog.mock.calls,
        ...spyError.mock.calls,
      ]
        .flat()
        .map(String)
        .join(' | ');
      expect(todosLosLogs).not.toContain('key-secreta-no-loguear');
    });
  });

  describe('enmascararEmail', () => {
    it('no enmascara fuera de produccion', () => {
      configurarEnv({ NODE_ENV: 'development' });
      expect(enmascararEmail('juan.perez@example.com')).toBe(
        'juan.perez@example.com',
      );
    });

    it('enmascara dejando primera letra + dominio en produccion', () => {
      configurarEnv({ NODE_ENV: 'production' });
      expect(enmascararEmail('juan.perez@example.com')).toBe(
        'j***@example.com',
      );
    });

    it('retorna *** si el string no parece email', () => {
      configurarEnv({ NODE_ENV: 'production' });
      expect(enmascararEmail('sin-arroba')).toBe('***');
    });
  });
});
