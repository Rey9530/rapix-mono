import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../src/app.module.js';
import { PrismaServicio } from '../../src/prisma/prisma.servicio.js';

describe('Autenticacion (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaServicio;

  const usuarioBase = {
    email: 'e2e@test.com',
    telefono: '+50370009999',
    contrasena: 'Secret123!',
    nombreCompleto: 'Usuario E2E',
    rol: 'CLIENTE' as const,
  };

  const vendedorBase = {
    email: 'vendedor.e2e@test.com',
    telefono: '+50370009988',
    contrasena: 'Secret123!',
    nombreCompleto: 'Vendedor E2E',
    rol: 'VENDEDOR' as const,
  };

  beforeAll(async () => {
    const modulo = await Test.createTestingModule({ imports: [AppModule] }).compile();
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
  });

  beforeEach(async () => {
    await prisma.$executeRawUnsafe(
      'TRUNCATE TABLE "perfiles_admin", "tokens_refresco", "usuarios" RESTART IDENTITY CASCADE',
    );
  });

  afterAll(async () => {
    await app.close();
  });

  it('registrar → iniciar-sesion emite tokens válidos', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/autenticacion/registrar')
      .send(usuarioBase)
      .expect(201);

    const respuesta = await request(app.getHttpServer())
      .post('/api/v1/autenticacion/iniciar-sesion')
      .send({ email: usuarioBase.email, contrasena: usuarioBase.contrasena })
      .expect(200);

    expect(respuesta.body.usuario.email).toBe(usuarioBase.email);
    expect(typeof respuesta.body.tokenAcceso).toBe('string');
    expect(typeof respuesta.body.tokenRefresco).toBe('string');
  });

  it('iniciar-sesion con credenciales inválidas → 401', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/autenticacion/registrar')
      .send(usuarioBase)
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/v1/autenticacion/iniciar-sesion')
      .send({ email: usuarioBase.email, contrasena: 'IncorrectPass!1' })
      .expect(401);
  });

  it('refrescar rota el par: el token previo queda inválido', async () => {
    const sesion = await request(app.getHttpServer())
      .post('/api/v1/autenticacion/registrar')
      .send(usuarioBase)
      .expect(201);

    const primero = sesion.body.tokenRefresco;

    const rotado = await request(app.getHttpServer())
      .post('/api/v1/autenticacion/refrescar')
      .send({ tokenRefresco: primero })
      .expect(200);

    expect(rotado.body.tokenRefresco).not.toBe(primero);

    await request(app.getHttpServer())
      .post('/api/v1/autenticacion/refrescar')
      .send({ tokenRefresco: primero })
      .expect(401);
  });

  it('GET /usuarios/yo sin token → 401', async () => {
    await request(app.getHttpServer()).get('/api/v1/usuarios/yo').expect(401);
  });

  it('GET /usuarios como VENDEDOR → 403', async () => {
    const sesion = await request(app.getHttpServer())
      .post('/api/v1/autenticacion/registrar')
      .send(vendedorBase)
      .expect(201);

    await request(app.getHttpServer())
      .get('/api/v1/usuarios')
      .set('Authorization', `Bearer ${sesion.body.tokenAcceso}`)
      .expect(403);
  });

  it('cerrar-sesion revoca el refresh token proporcionado', async () => {
    const sesion = await request(app.getHttpServer())
      .post('/api/v1/autenticacion/registrar')
      .send(usuarioBase)
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/v1/autenticacion/cerrar-sesion')
      .set('Authorization', `Bearer ${sesion.body.tokenAcceso}`)
      .send({ tokenRefresco: sesion.body.tokenRefresco })
      .expect(204);

    await request(app.getHttpServer())
      .post('/api/v1/autenticacion/refrescar')
      .send({ tokenRefresco: sesion.body.tokenRefresco })
      .expect(401);
  });
});
