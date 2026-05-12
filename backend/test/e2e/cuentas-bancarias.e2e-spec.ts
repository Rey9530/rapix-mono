import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { AppModule } from '../../src/app.module.js';
import { hashearContrasena } from '../../src/comun/utiles/contrasena.js';
import { BANCOS_EL_SALVADOR } from '../../src/modulos/cuentas-bancarias/bancos-el-salvador.constante.js';
import { PrismaServicio } from '../../src/prisma/prisma.servicio.js';

const BANCOS_ESPERADOS = BANCOS_EL_SALVADOR.map((b) => b.codigo);

async function crearUsuario(
  prisma: PrismaServicio,
  rol: 'VENDEDOR' | 'CLIENTE' | 'REPARTIDOR',
  { conPerfil = true }: { conPerfil?: boolean } = {},
) {
  const sufijo = randomUUID().slice(0, 8);
  const usuario = await prisma.usuario.create({
    data: {
      email: `${rol.toLowerCase()}.${sufijo}@test.com`,
      telefono: `+5037799${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0')}`,
      hashContrasena: await hashearContrasena('Secret123!'),
      nombreCompleto: `Test ${rol}`,
      rol,
      estado: 'ACTIVO',
    },
  });

  if (conPerfil && rol === 'VENDEDOR') {
    await prisma.perfilVendedor.create({
      data: {
        usuarioId: usuario.id,
        nombreNegocio: `Negocio ${sufijo}`,
        direccion: 'Test 123',
        latitud: 13.7,
        longitud: -89.2,
      },
    });
  }
  if (conPerfil && rol === 'REPARTIDOR') {
    await prisma.perfilRepartidor.create({
      data: {
        usuarioId: usuario.id,
        tipoVehiculo: 'moto',
        documentoIdentidad: sufijo,
      },
    });
  }
  return usuario;
}

async function login(app: INestApplication, email: string) {
  const r = await request(app.getHttpServer())
    .post('/api/v1/autenticacion/iniciar-sesion')
    .send({ email, contrasena: 'Secret123!' });
  expect(r.status).toBe(200);
  return r.body.tokenAcceso as string;
}

async function sembrarBancos(prisma: PrismaServicio) {
  for (const b of BANCOS_EL_SALVADOR) {
    await prisma.banco.upsert({
      where: { codigo: b.codigo },
      update: { nombre: b.nombre, activo: true },
      create: { codigo: b.codigo, nombre: b.nombre, activo: true },
    });
  }
}

describe('Cuentas bancarias (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaServicio;
  let tokenVendedor: string;
  let tokenCliente: string;
  let tokenRepartidor: string;
  let bancoAgricolaId: string;
  let bancoCuscatlanId: string;

  beforeAll(async () => {
    const modulo = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = modulo.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
    prisma = app.get(PrismaServicio);

    await prisma.$executeRawUnsafe(
      'TRUNCATE TABLE "cuentas_bancarias", "bancos", "comprobantes_entrega", "eventos_pedido", "pedidos", "zonas_repartidor", "zonas", "perfiles_vendedor", "perfiles_repartidor", "perfiles_admin", "tokens_refresco", "usuarios" RESTART IDENTITY CASCADE',
    );

    await sembrarBancos(prisma);
    const agricola = await prisma.banco.findUniqueOrThrow({
      where: { codigo: 'AGRICOLA' },
    });
    const cuscatlan = await prisma.banco.findUniqueOrThrow({
      where: { codigo: 'CUSCATLAN' },
    });
    bancoAgricolaId = agricola.id;
    bancoCuscatlanId = cuscatlan.id;

    const vendedor = await crearUsuario(prisma, 'VENDEDOR');
    const cliente = await crearUsuario(prisma, 'CLIENTE');
    const repartidor = await crearUsuario(prisma, 'REPARTIDOR');

    tokenVendedor = await login(app, vendedor.email);
    tokenCliente = await login(app, cliente.email);
    tokenRepartidor = await login(app, repartidor.email);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /bancos', () => {
    it('devuelve los 13 bancos sembrados ordenados alfabéticamente', async () => {
      const r = await request(app.getHttpServer())
        .get('/api/v1/bancos')
        .set('Authorization', `Bearer ${tokenVendedor}`);
      expect(r.status).toBe(200);
      expect(r.body).toHaveLength(BANCOS_ESPERADOS.length);
      const codigos = r.body.map((b: { codigo: string }) => b.codigo);
      expect(new Set(codigos)).toEqual(new Set(BANCOS_ESPERADOS));
      const nombres = r.body.map((b: { nombre: string }) => b.nombre);
      const ordenados = [...nombres].sort((a, b) => a.localeCompare(b));
      expect(nombres).toEqual(ordenados);
    });
  });

  describe('Autorización', () => {
    it('CLIENTE → 403 al listar cuentas', async () => {
      const r = await request(app.getHttpServer())
        .get('/api/v1/usuarios/yo/cuentas-bancarias')
        .set('Authorization', `Bearer ${tokenCliente}`);
      expect(r.status).toBe(403);
    });

    it('REPARTIDOR → 403 al crear cuenta', async () => {
      const r = await request(app.getHttpServer())
        .post('/api/v1/usuarios/yo/cuentas-bancarias')
        .set('Authorization', `Bearer ${tokenRepartidor}`)
        .send({
          bancoId: bancoAgricolaId,
          tipoCuenta: 'AHORRO',
          numeroCuenta: '12345678',
        });
      expect(r.status).toBe(403);
    });

    it('sin token → 401', async () => {
      const r = await request(app.getHttpServer()).get(
        '/api/v1/usuarios/yo/cuentas-bancarias',
      );
      expect(r.status).toBe(401);
    });
  });

  describe('CRUD vendedor', () => {
    let primeraCuentaId: string;
    let segundaCuentaId: string;

    it('crea la primera cuenta y la marca principal automáticamente', async () => {
      const r = await request(app.getHttpServer())
        .post('/api/v1/usuarios/yo/cuentas-bancarias')
        .set('Authorization', `Bearer ${tokenVendedor}`)
        .send({
          bancoId: bancoAgricolaId,
          tipoCuenta: 'AHORRO',
          numeroCuenta: '12345678',
          alias: 'Negocio',
        });
      expect(r.status).toBe(201);
      expect(r.body.esPrincipal).toBe(true);
      expect(r.body.numeroCuenta).toBe('12345678');
      primeraCuentaId = r.body.id;
    });

    it('lista las cuentas con número completo (dueño)', async () => {
      const r = await request(app.getHttpServer())
        .get('/api/v1/usuarios/yo/cuentas-bancarias')
        .set('Authorization', `Bearer ${tokenVendedor}`);
      expect(r.status).toBe(200);
      expect(r.body).toHaveLength(1);
      expect(r.body[0].numeroCuenta).toBe('12345678');
    });

    it('valida formato del número de cuenta (regex)', async () => {
      const r = await request(app.getHttpServer())
        .post('/api/v1/usuarios/yo/cuentas-bancarias')
        .set('Authorization', `Bearer ${tokenVendedor}`)
        .send({
          bancoId: bancoAgricolaId,
          tipoCuenta: 'AHORRO',
          numeroCuenta: '123',
        });
      expect(r.status).toBe(400);
    });

    it('rechaza duplicado mismo banco + mismo número', async () => {
      const r = await request(app.getHttpServer())
        .post('/api/v1/usuarios/yo/cuentas-bancarias')
        .set('Authorization', `Bearer ${tokenVendedor}`)
        .send({
          bancoId: bancoAgricolaId,
          tipoCuenta: 'AHORRO',
          numeroCuenta: '12345678',
        });
      expect(r.status).toBe(409);
      expect(r.body.codigo).toBe('CUENTA_DUPLICADA');
    });

    it('crea segunda cuenta con esPrincipal=true y desmarca la anterior', async () => {
      const r = await request(app.getHttpServer())
        .post('/api/v1/usuarios/yo/cuentas-bancarias')
        .set('Authorization', `Bearer ${tokenVendedor}`)
        .send({
          bancoId: bancoCuscatlanId,
          tipoCuenta: 'CORRIENTE',
          numeroCuenta: '99887766',
          esPrincipal: true,
        });
      expect(r.status).toBe(201);
      expect(r.body.esPrincipal).toBe(true);
      segundaCuentaId = r.body.id;

      const listado = await request(app.getHttpServer())
        .get('/api/v1/usuarios/yo/cuentas-bancarias')
        .set('Authorization', `Bearer ${tokenVendedor}`);
      const previas = listado.body.filter(
        (c: { id: string }) => c.id === primeraCuentaId,
      );
      expect(previas[0].esPrincipal).toBe(false);
    });

    it('PATCH ignora bancoId/numeroCuenta (whitelist)', async () => {
      const r = await request(app.getHttpServer())
        .patch(`/api/v1/usuarios/yo/cuentas-bancarias/${primeraCuentaId}`)
        .set('Authorization', `Bearer ${tokenVendedor}`)
        .send({
          bancoId: bancoCuscatlanId,
          numeroCuenta: '00000000',
          alias: 'renombrado',
        });
      // forbidNonWhitelisted devuelve 400 ante propiedades extra.
      expect(r.status).toBe(400);
    });

    it('PATCH actualiza alias y tipoCuenta', async () => {
      const r = await request(app.getHttpServer())
        .patch(`/api/v1/usuarios/yo/cuentas-bancarias/${primeraCuentaId}`)
        .set('Authorization', `Bearer ${tokenVendedor}`)
        .send({ alias: 'Renombrada', tipoCuenta: 'CORRIENTE' });
      expect(r.status).toBe(200);
      expect(r.body.alias).toBe('Renombrada');
      expect(r.body.tipoCuenta).toBe('CORRIENTE');
    });

    it('no permite eliminar la principal si hay otras cuentas', async () => {
      const r = await request(app.getHttpServer())
        .delete(`/api/v1/usuarios/yo/cuentas-bancarias/${segundaCuentaId}`)
        .set('Authorization', `Bearer ${tokenVendedor}`);
      expect(r.status).toBe(400);
      expect(r.body.codigo).toBe('REASIGNAR_PRINCIPAL_PRIMERO');
    });

    it('reasigna principal y luego permite eliminar la anterior (soft-delete)', async () => {
      const reasignar = await request(app.getHttpServer())
        .patch(`/api/v1/usuarios/yo/cuentas-bancarias/${primeraCuentaId}`)
        .set('Authorization', `Bearer ${tokenVendedor}`)
        .send({ esPrincipal: true });
      expect(reasignar.status).toBe(200);
      expect(reasignar.body.esPrincipal).toBe(true);

      const eliminar = await request(app.getHttpServer())
        .delete(`/api/v1/usuarios/yo/cuentas-bancarias/${segundaCuentaId}`)
        .set('Authorization', `Bearer ${tokenVendedor}`);
      expect(eliminar.status).toBe(204);

      // El soft-delete preserva el registro en DB.
      const fila = await prisma.cuentaBancaria.findUnique({
        where: { id: segundaCuentaId },
      });
      expect(fila).not.toBeNull();
      expect(fila!.activa).toBe(false);

      const listado = await request(app.getHttpServer())
        .get('/api/v1/usuarios/yo/cuentas-bancarias')
        .set('Authorization', `Bearer ${tokenVendedor}`);
      expect(listado.body).toHaveLength(1);
      expect(listado.body[0].id).toBe(primeraCuentaId);
    });
  });
});
