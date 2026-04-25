import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { AppModule } from '../../src/app.module.js';
import { PrismaServicio } from '../../src/prisma/prisma.servicio.js';
import { ZonasServicio } from '../../src/modulos/zonas/zonas.servicio.js';
import { hashearContrasena } from '../../src/comun/utiles/contrasena.js';

/**
 * e2e del flujo completo de un pedido. Crea la infra mínima (vendedor,
 * 2 repartidores con zonas asignadas, 2 zonas PostGIS) y ejecuta 5
 * escenarios cubriendo la máquina de estados.
 */

const POLIGONO_A = [
  { lat: 10, lng: 10 },
  { lat: 10, lng: 11 },
  { lat: 11, lng: 11 },
  { lat: 11, lng: 10 },
];
const POLIGONO_B = [
  { lat: 20, lng: 20 },
  { lat: 20, lng: 21 },
  { lat: 21, lng: 21 },
  { lat: 21, lng: 20 },
];

async function crearZona(prisma: PrismaServicio, codigo: string, poligono: typeof POLIGONO_A) {
  const id = randomUUID();
  const geo = ZonasServicio.convertirAPoligonoGeoJson(poligono);
  await prisma.$executeRawUnsafe(
    `INSERT INTO zonas (id, codigo, nombre, poligono, "latitudCentro", "longitudCentro", activa, "creadoEn", "actualizadoEn")
     VALUES ($1, $2, $3, ST_SetSRID(ST_GeomFromGeoJSON($4), 4326), $5, $6, true, NOW(), NOW())`,
    id,
    codigo,
    `Zona ${codigo}`,
    JSON.stringify(geo),
    poligono[0].lat,
    poligono[0].lng,
  );
  return id;
}

async function crearVendedor(prisma: PrismaServicio) {
  const hash = await hashearContrasena('Secret123!');
  const usuario = await prisma.usuario.create({
    data: {
      email: `v.${randomUUID()}@test.com`,
      telefono: `+5037700${String(Date.now()).slice(-4)}`,
      hashContrasena: hash,
      nombreCompleto: 'Vendedor E2E',
      rol: 'VENDEDOR',
      estado: 'ACTIVO',
    },
  });
  const perfil = await prisma.perfilVendedor.create({
    data: {
      usuarioId: usuario.id,
      nombreNegocio: 'Tienda E2E',
      direccion: 'Origen E2E',
      latitud: 10.5,
      longitud: 10.5,
    },
  });
  return { usuario, perfil };
}

async function crearRepartidor(prisma: PrismaServicio, sufijo: string, zonaId?: string) {
  const hash = await hashearContrasena('Secret123!');
  const usuario = await prisma.usuario.create({
    data: {
      email: `r.${sufijo}.${randomUUID()}@test.com`,
      telefono: `+5037788${String(Date.now()).slice(-4)}${sufijo[0]}`,
      hashContrasena: hash,
      nombreCompleto: `Repartidor ${sufijo}`,
      rol: 'REPARTIDOR',
      estado: 'ACTIVO',
    },
  });
  const perfil = await prisma.perfilRepartidor.create({
    data: { usuarioId: usuario.id, tipoVehiculo: 'moto', documentoIdentidad: `DOC-${sufijo}` },
  });
  if (zonaId) {
    await prisma.zonaRepartidor.create({
      data: { repartidorId: perfil.id, zonaId, esPrimaria: true },
    });
  }
  return { usuario, perfil };
}

async function login(app: INestApplication, email: string, contrasena = 'Secret123!') {
  const r = await request(app.getHttpServer())
    .post('/api/v1/autenticacion/iniciar-sesion')
    .send({ email, contrasena });
  if (r.status !== 200) {
    // eslint-disable-next-line no-console
    console.error(`login(${email}) -> ${r.status}`, r.body);
  }
  expect(r.status).toBe(200);
  return r.body.tokenAcceso as string;
}

async function crearPedidoValido(app: INestApplication, token: string, origen = [10.5, 10.5], destino = [20.5, 20.5]) {
  return request(app.getHttpServer())
    .post('/api/v1/pedidos')
    .set('Authorization', `Bearer ${token}`)
    .send({
      nombreCliente: 'Cliente E2E',
      telefonoCliente: '+50370001234',
      direccionOrigen: 'Origen',
      latitudOrigen: origen[0],
      longitudOrigen: origen[1],
      direccionDestino: 'Destino',
      latitudDestino: destino[0],
      longitudDestino: destino[1],
      metodoPago: 'PREPAGADO',
    });
}

describe('Pedido (flujo completo, e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaServicio;
  let tokenVendedor: string;
  let tokenRider1: string;
  let tokenRider2: string;
  let tokenAdmin: string;
  let zonaAId: string;
  let zonaBId: string;
  let rider1PerfilId: string;
  let rider2PerfilId: string;

  beforeAll(async () => {
    const modulo = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = modulo.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();
    prisma = app.get(PrismaServicio);

    // Reset
    await prisma.$executeRawUnsafe(
      'TRUNCATE TABLE "comprobantes_entrega", "eventos_pedido", "pedidos", "zonas_repartidor", "zonas", "perfiles_vendedor", "perfiles_repartidor", "perfiles_admin", "tokens_refresco", "usuarios" RESTART IDENTITY CASCADE',
    );

    zonaAId = await crearZona(prisma, 'A', POLIGONO_A);
    zonaBId = await crearZona(prisma, 'B', POLIGONO_B);

    const vendedor = await crearVendedor(prisma);
    // Rider 1: zona A (origen) — hace recogidas
    const r1 = await crearRepartidor(prisma, '1', zonaAId);
    // Rider 2: zona B (destino) — hace entregas finales
    const r2 = await crearRepartidor(prisma, '2', zonaBId);
    rider1PerfilId = r1.perfil.id;
    rider2PerfilId = r2.perfil.id;

    // Admin
    const adminHash = await hashearContrasena('Admin123!');
    const admin = await prisma.usuario.create({
      data: {
        email: 'admin.e2e@test.com',
        telefono: '+50300000001',
        hashContrasena: adminHash,
        nombreCompleto: 'Admin E2E',
        rol: 'ADMIN',
        estado: 'ACTIVO',
      },
    });
    await prisma.perfilAdmin.create({ data: { usuarioId: admin.id, permisos: ['*'] } });

    tokenVendedor = await login(app, vendedor.usuario.email);
    tokenRider1 = await login(app, r1.usuario.email);
    tokenRider2 = await login(app, r2.usuario.email);
    tokenAdmin = await login(app, admin.email, 'Admin123!');
  });

  afterAll(async () => {
    await app.close();
  });

  it('camino feliz: crear → asignar → recoger → en_transito → intercambio → tomar-entrega → entregar', async () => {
    const crear = await crearPedidoValido(app, tokenVendedor);
    expect(crear.status).toBe(201);
    const pedidoId = crear.body.id;
    expect(crear.body.codigoSeguimiento).toMatch(/^DEL-\d{4}-\d{5}$/);
    expect(crear.body.estado).toBe('PENDIENTE_ASIGNACION');
    expect(crear.body.zonaOrigenId).toBe(zonaAId);
    expect(crear.body.zonaDestinoId).toBe(zonaBId);

    // Asignar automáticamente (debe elegir Rider 1 porque está en zona A)
    const asignar = await request(app.getHttpServer())
      .post(`/api/v1/pedidos/asignar-automatico`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .expect(200);
    expect(asignar.body.asignados).toBe(1);

    const tras = await prisma.pedido.findUnique({ where: { id: pedidoId } });
    expect(tras?.estado).toBe('ASIGNADO');
    expect(tras?.repartidorRecogidaId).toBe(rider1PerfilId);

    // Rider 1: recoger
    await request(app.getHttpServer())
      .post(`/api/v1/pedidos/${pedidoId}/recoger`)
      .set('Authorization', `Bearer ${tokenRider1}`)
      .send({}).expect(200);

    // Rider 1: en-transito
    await request(app.getHttpServer())
      .post(`/api/v1/pedidos/${pedidoId}/en-transito`)
      .set('Authorization', `Bearer ${tokenRider1}`)
      .send({}).expect(200);

    // Rider 1: llegar-intercambio
    await request(app.getHttpServer())
      .post(`/api/v1/pedidos/${pedidoId}/llegar-intercambio`)
      .set('Authorization', `Bearer ${tokenRider1}`)
      .send({}).expect(200);

    // Rider 2: tomar-entrega (se auto-asigna como repartidorEntrega)
    await request(app.getHttpServer())
      .post(`/api/v1/pedidos/${pedidoId}/tomar-entrega`)
      .set('Authorization', `Bearer ${tokenRider2}`)
      .send({}).expect(200);

    // Rider 2: entregar (multipart con foto)
    const foto = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0x10, 0x4a, 0x46]); // mini JPEG header
    await request(app.getHttpServer())
      .post(`/api/v1/pedidos/${pedidoId}/entregar`)
      .set('Authorization', `Bearer ${tokenRider2}`)
      .attach('foto', foto, { filename: 'f.jpg', contentType: 'image/jpeg' })
      .field('recibidoPor', 'Cliente')
      .expect(200);

    const final = await prisma.pedido.findUnique({ where: { id: pedidoId } });
    expect(final?.estado).toBe('ENTREGADO');
    expect(final?.entregadoEn).not.toBeNull();

    const eventos = await prisma.eventoPedido.count({ where: { pedidoId } });
    expect(eventos).toBeGreaterThanOrEqual(6); // creado + asignado + 4 transiciones + entregado

    const comprobantes = await prisma.comprobanteEntrega.count({ where: { pedidoId } });
    expect(comprobantes).toBe(1);
  });

  it('cancelar desde PENDIENTE_ASIGNACION → 200', async () => {
    const crear = await crearPedidoValido(app, tokenVendedor);
    const pedidoId = crear.body.id;
    await request(app.getHttpServer())
      .post(`/api/v1/pedidos/${pedidoId}/cancelar`)
      .set('Authorization', `Bearer ${tokenVendedor}`)
      .send({ motivo: 'cambio de planes' }).expect(200);
    const tras = await prisma.pedido.findUnique({ where: { id: pedidoId } });
    expect(tras?.estado).toBe('CANCELADO');
  });

  it('transición inválida: RECOGIDO → CANCELADO → 409', async () => {
    const crear = await crearPedidoValido(app, tokenVendedor);
    const pedidoId = crear.body.id;
    await request(app.getHttpServer())
      .post(`/api/v1/pedidos/asignar-automatico`)
      .set('Authorization', `Bearer ${tokenAdmin}`).expect(200);
    await request(app.getHttpServer())
      .post(`/api/v1/pedidos/${pedidoId}/recoger`)
      .set('Authorization', `Bearer ${tokenRider1}`).send({}).expect(200);
    const r = await request(app.getHttpServer())
      .post(`/api/v1/pedidos/${pedidoId}/cancelar`)
      .set('Authorization', `Bearer ${tokenVendedor}`).send({});
    expect(r.status).toBe(409);
    expect(r.body.codigo).toBe('PEDIDO_TRANSICION_INVALIDA');
  });

  it('EN_REPARTO → FALLIDO → EN_REPARTO (reintentar) → ENTREGADO', async () => {
    const crear = await crearPedidoValido(app, tokenVendedor);
    const pedidoId = crear.body.id;
    await request(app.getHttpServer()).post(`/api/v1/pedidos/asignar-automatico`)
      .set('Authorization', `Bearer ${tokenAdmin}`).expect(200);
    await request(app.getHttpServer()).post(`/api/v1/pedidos/${pedidoId}/recoger`)
      .set('Authorization', `Bearer ${tokenRider1}`).send({}).expect(200);
    await request(app.getHttpServer()).post(`/api/v1/pedidos/${pedidoId}/en-transito`)
      .set('Authorization', `Bearer ${tokenRider1}`).send({}).expect(200);
    await request(app.getHttpServer()).post(`/api/v1/pedidos/${pedidoId}/llegar-intercambio`)
      .set('Authorization', `Bearer ${tokenRider1}`).send({}).expect(200);
    await request(app.getHttpServer()).post(`/api/v1/pedidos/${pedidoId}/tomar-entrega`)
      .set('Authorization', `Bearer ${tokenRider2}`).send({}).expect(200);
    await request(app.getHttpServer()).post(`/api/v1/pedidos/${pedidoId}/fallar`)
      .set('Authorization', `Bearer ${tokenRider2}`).send({ motivo: 'cliente ausente' }).expect(200);
    await request(app.getHttpServer()).post(`/api/v1/pedidos/${pedidoId}/reintentar`)
      .set('Authorization', `Bearer ${tokenRider2}`).send({}).expect(200);

    const foto = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0x10]);
    await request(app.getHttpServer())
      .post(`/api/v1/pedidos/${pedidoId}/entregar`)
      .set('Authorization', `Bearer ${tokenRider2}`)
      .attach('foto', foto, { filename: 'f.jpg', contentType: 'image/jpeg' })
      .expect(200);

    const final = await prisma.pedido.findUnique({ where: { id: pedidoId } });
    expect(final?.estado).toBe('ENTREGADO');
  });

  it('EN_REPARTO → FALLIDO → DEVUELTO', async () => {
    const crear = await crearPedidoValido(app, tokenVendedor);
    const pedidoId = crear.body.id;
    await request(app.getHttpServer()).post(`/api/v1/pedidos/asignar-automatico`)
      .set('Authorization', `Bearer ${tokenAdmin}`).expect(200);
    await request(app.getHttpServer()).post(`/api/v1/pedidos/${pedidoId}/recoger`)
      .set('Authorization', `Bearer ${tokenRider1}`).send({}).expect(200);
    await request(app.getHttpServer()).post(`/api/v1/pedidos/${pedidoId}/en-transito`)
      .set('Authorization', `Bearer ${tokenRider1}`).send({}).expect(200);
    await request(app.getHttpServer()).post(`/api/v1/pedidos/${pedidoId}/llegar-intercambio`)
      .set('Authorization', `Bearer ${tokenRider1}`).send({}).expect(200);
    await request(app.getHttpServer()).post(`/api/v1/pedidos/${pedidoId}/tomar-entrega`)
      .set('Authorization', `Bearer ${tokenRider2}`).send({}).expect(200);
    await request(app.getHttpServer()).post(`/api/v1/pedidos/${pedidoId}/fallar`)
      .set('Authorization', `Bearer ${tokenRider2}`).send({ motivo: 'segundo intento fallido' }).expect(200);
    await request(app.getHttpServer()).post(`/api/v1/pedidos/${pedidoId}/devolver`)
      .set('Authorization', `Bearer ${tokenRider2}`).send({}).expect(200);

    const final = await prisma.pedido.findUnique({ where: { id: pedidoId } });
    expect(final?.estado).toBe('DEVUELTO');
  });

  it('tracking público no expone email ni teléfono del cliente', async () => {
    const crear = await crearPedidoValido(app, tokenVendedor);
    const codigo = crear.body.codigoSeguimiento;
    const r = await request(app.getHttpServer())
      .get(`/api/v1/pedidos/seguimiento/${codigo}`)
      .expect(200);
    expect(r.body.codigoSeguimiento).toBe(codigo);
    expect(r.body.cliente).toEqual({ nombre: 'Cliente E2E' });
    expect(r.body.cliente.email).toBeUndefined();
    expect(r.body.cliente.telefono).toBeUndefined();
    expect(r.body.siguientePaso).toBeTruthy();
  });
});
