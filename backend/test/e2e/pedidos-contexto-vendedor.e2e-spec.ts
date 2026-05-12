import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { AppModule } from '../../src/app.module.js';
import { PrismaServicio } from '../../src/prisma/prisma.servicio.js';
import { hashearContrasena } from '../../src/comun/utiles/contrasena.js';

/**
 * e2e de GET /api/v1/pedidos/contexto-vendedor.
 * Cubre los 3 escenarios del endpoint: perfil completo, vendedor sin
 * PerfilVendedor (caso edge), y falta de token (401).
 */

async function crearVendedorConPerfil(prisma: PrismaServicio) {
  const hash = await hashearContrasena('Secret123!');
  const usuario = await prisma.usuario.create({
    data: {
      email: `vcp.${randomUUID()}@test.com`,
      telefono: `+5037711${String(Date.now()).slice(-4)}`,
      hashContrasena: hash,
      nombreCompleto: 'Vendedor Con Perfil',
      rol: 'VENDEDOR',
      estado: 'ACTIVO',
    },
  });
  const perfil = await prisma.perfilVendedor.create({
    data: {
      usuarioId: usuario.id,
      nombreNegocio: 'Tienda Contexto E2E',
      direccion: 'Av. Test 123',
      latitud: 13.7,
      longitud: -89.2,
      urlLogo: 'https://cdn.test/logo.png',
    },
  });
  return { usuario, perfil };
}

async function crearVendedorSinPerfil(prisma: PrismaServicio) {
  const hash = await hashearContrasena('Secret123!');
  const usuario = await prisma.usuario.create({
    data: {
      email: `vsp.${randomUUID()}@test.com`,
      telefono: `+5037722${String(Date.now()).slice(-4)}`,
      hashContrasena: hash,
      nombreCompleto: 'Vendedor Sin Perfil',
      rol: 'VENDEDOR',
      estado: 'ACTIVO',
    },
  });
  return { usuario };
}

async function login(app: INestApplication, email: string, contrasena = 'Secret123!') {
  const r = await request(app.getHttpServer())
    .post('/api/v1/autenticacion/iniciar-sesion')
    .send({ email, contrasena });
  expect(r.status).toBe(200);
  return r.body.tokenAcceso as string;
}

describe('GET /pedidos/contexto-vendedor (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaServicio;
  let tokenConPerfil: string;
  let tokenSinPerfil: string;
  let perfilId: string;

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
      'TRUNCATE TABLE "comprobantes_entrega", "eventos_pedido", "pedidos", "zonas_repartidor", "zonas", "perfiles_vendedor", "perfiles_repartidor", "perfiles_admin", "tokens_refresco", "usuarios" RESTART IDENTITY CASCADE',
    );

    const conPerfil = await crearVendedorConPerfil(prisma);
    perfilId = conPerfil.perfil.id;
    const sinPerfil = await crearVendedorSinPerfil(prisma);

    tokenConPerfil = await login(app, conPerfil.usuario.email);
    tokenSinPerfil = await login(app, sinPerfil.usuario.email);
  });

  afterAll(async () => {
    await app.close();
  });

  it('vendedor con PerfilVendedor → 200 tieneUbicacion=true con datos completos', async () => {
    const r = await request(app.getHttpServer())
      .get('/api/v1/pedidos/contexto-vendedor')
      .set('Authorization', `Bearer ${tokenConPerfil}`);

    expect(r.status).toBe(200);
    expect(r.body).toEqual({
      tieneUbicacion: true,
      vendedorId: perfilId,
      nombreNegocio: 'Tienda Contexto E2E',
      direccion: 'Av. Test 123',
      latitud: 13.7,
      longitud: -89.2,
      urlLogo: 'https://cdn.test/logo.png',
    });
  });

  it('vendedor sin PerfilVendedor → 200 tieneUbicacion=false con campos null', async () => {
    const r = await request(app.getHttpServer())
      .get('/api/v1/pedidos/contexto-vendedor')
      .set('Authorization', `Bearer ${tokenSinPerfil}`);

    expect(r.status).toBe(200);
    expect(r.body).toEqual({
      tieneUbicacion: false,
      vendedorId: null,
      nombreNegocio: null,
      direccion: null,
      latitud: null,
      longitud: null,
      urlLogo: null,
    });
  });

  it('sin token → 401', async () => {
    const r = await request(app.getHttpServer()).get(
      '/api/v1/pedidos/contexto-vendedor',
    );
    expect(r.status).toBe(401);
  });
});
