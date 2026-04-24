import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { AppModule } from '../../src/app.module.js';
import { PrismaServicio } from '../../src/prisma/prisma.servicio.js';
import { ZonasServicio } from '../../src/modulos/zonas/zonas.servicio.js';

/** Inserta una zona directamente en BD usando raw SQL (evita ir por HTTP). */
async function insertarZona(
  prisma: PrismaServicio,
  codigo: string,
  poligono: Array<{ lat: number; lng: number }>,
  opciones: { activa?: boolean } = {},
): Promise<string> {
  const id = randomUUID();
  const geo = ZonasServicio.convertirAPoligonoGeoJson(poligono);
  await prisma.$executeRawUnsafe(
    `INSERT INTO zonas (id, codigo, nombre, poligono, "latitudCentro", "longitudCentro", activa, "creadoEn", "actualizadoEn")
     VALUES ($1, $2, $3, ST_SetSRID(ST_GeomFromGeoJSON($4), 4326), $5, $6, $7, NOW(), NOW())`,
    id,
    codigo,
    `Zona ${codigo}`,
    JSON.stringify(geo),
    poligono[0].lat,
    poligono[0].lng,
    opciones.activa ?? true,
  );
  return id;
}

describe('Geo / resolverZona (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaServicio;

  // Zona A: cuadrado pequeño alrededor de (10, 10).
  // Zona B: cuadrado que solapa con A en la esquina (punto 10.5, 10.5 está en ambos).
  // Zona C: lejos, para probar "fuera de zonas".
  // Zona D: inactiva, alrededor de (50, 50).
  const poligonoA = [
    { lat: 10, lng: 10 }, { lat: 10, lng: 11 },
    { lat: 11, lng: 11 }, { lat: 11, lng: 10 },
  ];
  const poligonoB = [
    { lat: 10.5, lng: 10.5 }, { lat: 10.5, lng: 12 },
    { lat: 12, lng: 12 }, { lat: 12, lng: 10.5 },
  ];
  const poligonoD = [
    { lat: 50, lng: 50 }, { lat: 50, lng: 51 },
    { lat: 51, lng: 51 }, { lat: 51, lng: 50 },
  ];

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

    await prisma.$executeRawUnsafe(
      'TRUNCATE TABLE "zonas_repartidor", "zonas" RESTART IDENTITY CASCADE',
    );
    await insertarZona(prisma, 'A', poligonoA);
    await insertarZona(prisma, 'B', poligonoB);
    await insertarZona(prisma, 'D', poligonoD, { activa: false });
  });

  afterAll(async () => {
    await prisma.$executeRawUnsafe(
      'TRUNCATE TABLE "zonas_repartidor", "zonas" RESTART IDENTITY CASCADE',
    );
    await app.close();
  });

  it('punto dentro de zona A (y fuera de B) → retorna A', async () => {
    const r = await request(app.getHttpServer())
      .get('/api/v1/zonas/resolver?lat=10.2&lng=10.2')
      .expect(200);
    expect(r.body.codigo).toBe('A');
  });

  it('punto fuera de todas → 404 PUNTO_FUERA_DE_ZONA', async () => {
    const r = await request(app.getHttpServer())
      .get('/api/v1/zonas/resolver?lat=20&lng=20')
      .expect(404);
    expect(r.body.codigo).toBe('PUNTO_FUERA_DE_ZONA');
  });

  it('punto en la intersección de A y B → retorna una de las dos', async () => {
    const r = await request(app.getHttpServer())
      .get('/api/v1/zonas/resolver?lat=10.75&lng=10.75')
      .expect(200);
    expect(['A', 'B']).toContain(r.body.codigo);
  });

  it('punto dentro de zona inactiva (D) → 404', async () => {
    const r = await request(app.getHttpServer())
      .get('/api/v1/zonas/resolver?lat=50.5&lng=50.5')
      .expect(404);
    expect(r.body.codigo).toBe('PUNTO_FUERA_DE_ZONA');
  });

  it('EXPLAIN ANALYZE de la consulta usa zonas_poligono_gist', async () => {
    const plan = await prisma.$queryRawUnsafe<Array<{ 'QUERY PLAN': string }>>(
      `EXPLAIN ANALYZE
       SELECT id FROM zonas
       WHERE activa = true
         AND ST_Contains(poligono, ST_SetSRID(ST_MakePoint(10.2, 10.2), 4326))
       LIMIT 1`,
    );
    const textoPlan = plan.map((f) => f['QUERY PLAN']).join('\n');
    expect(textoPlan).toMatch(/zonas_poligono_gist/);
  });
});

describe('Zonas / convertirAPoligonoGeoJson (unit)', () => {
  it('cierra el anillo si no viene cerrado', () => {
    const poligono = [
      { lat: 0, lng: 0 },
      { lat: 0, lng: 1 },
      { lat: 1, lng: 1 },
    ];
    const geo: any = ZonasServicio.convertirAPoligonoGeoJson(poligono);
    const anillo = geo.coordinates[0];
    expect(anillo.length).toBe(4); // 3 puntos + cierre
    expect(anillo[0]).toEqual(anillo[anillo.length - 1]);
  });

  it('rechaza polígono con menos de 3 puntos', () => {
    expect(() =>
      ZonasServicio.convertirAPoligonoGeoJson([
        { lat: 0, lng: 0 },
        { lat: 0, lng: 1 },
      ]),
    ).toThrow();
  });

  it('mantiene orden [lng, lat] en GeoJSON', () => {
    const poligono = [
      { lat: 10, lng: 20 },
      { lat: 30, lng: 40 },
      { lat: 50, lng: 60 },
    ];
    const geo: any = ZonasServicio.convertirAPoligonoGeoJson(poligono);
    expect(geo.coordinates[0][0]).toEqual([20, 10]); // [lng, lat]
  });
});
