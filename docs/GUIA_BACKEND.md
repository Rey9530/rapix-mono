# Guía de Desarrollo - Backend (NestJS)

## 🎯 Objetivo

Construir una API REST modular, type-safe, escalable y testable siguiendo las mejores prácticas de NestJS. **Identificadores en español, sin tildes** (ver glosario maestro en `README.md`).

## 📦 Stack

- **Node.js** 24.10+ (gestionado vía `corepack`; cumple requisito de Prisma 7)
- **Yarn** 4+ (Berry) como gestor de paquetes — activado vía `corepack`
- **NestJS** 10+ (con `"type": "module"` en `package.json` para ESM)
- **TypeScript** 5.4+ (recomendado 5.9.x — requisito de Prisma 7)
- **Prisma** 7.x (generator `prisma-client`, ESM, driver adapter `@prisma/adapter-pg`)
- **PostgreSQL** 15+ con extensión PostGIS
- **Redis** 7+
- **`@nestjs/event-emitter`** para eventos de dominio in-process (sin colas)
- **Jest** para tests
- **Pino** para logs

## 🗂️ Estructura de Carpetas

```
backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── config/
│   │   ├── config.module.ts
│   │   ├── esquema-validacion.ts  # Joi
│   │   └── env.ts                 # tipos de env
│   ├── comun/
│   │   ├── decoradores/
│   │   │   ├── roles.decorador.ts
│   │   │   ├── usuario-actual.decorador.ts
│   │   │   └── publico.decorador.ts
│   │   ├── guardias/
│   │   │   ├── jwt-autenticacion.guardia.ts
│   │   │   └── roles.guardia.ts
│   │   ├── interceptores/
│   │   │   ├── registro.interceptor.ts
│   │   │   └── transformar.interceptor.ts
│   │   ├── filtros/
│   │   │   └── http-excepcion.filtro.ts
│   │   ├── tuberias/
│   │   └── utiles/
│   ├── prisma/
│   │   ├── prisma.modulo.ts
│   │   └── prisma.servicio.ts
│   ├── modulos/
│   │   ├── autenticacion/
│   │   │   ├── autenticacion.modulo.ts
│   │   │   ├── autenticacion.controlador.ts
│   │   │   ├── autenticacion.servicio.ts
│   │   │   ├── estrategias/
│   │   │   │   ├── jwt.estrategia.ts
│   │   │   │   └── jwt-refresco.estrategia.ts
│   │   │   └── dto/
│   │   ├── usuarios/
│   │   ├── zonas/
│   │   ├── pedidos/
│   │   │   ├── pedidos.controlador.ts
│   │   │   ├── pedidos.servicio.ts
│   │   │   ├── pedidos.repositorio.ts
│   │   │   ├── maquina-estados/
│   │   │   │   └── pedido-maquina-estados.ts
│   │   │   └── dto/
│   │   ├── repartidores/
│   │   ├── paquetes-recargados/
│   │   ├── cierres-financieros/
│   │   ├── notificaciones/
│   │   │   ├── canales/
│   │   │   │   ├── push.adaptador.ts
│   │   │   │   ├── whatsapp.adaptador.ts   # WhatsApp Cloud API (Meta)
│   │   │   │   └── email.adaptador.ts      # SMTP via nodemailer
│   │   │   └── manejadores/                # @OnEvent handlers (sin workers de cola)
│   │   ├── mapas/
│   │   ├── archivos/
│   │   └── reportes/
│   ├── eventos/
│   │   └── eventos-dominio.ts
│   ├── generated/
│   │   └── prisma/                # ← cliente Prisma 7 generado (en source, no en node_modules)
│   └── tipos/
│       └── express.d.ts
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── prisma.config.ts               # ← Prisma 7: requerido en raíz
├── test/
│   ├── e2e/
│   └── unit/
├── .env.example
├── Dockerfile
├── docker-compose.yml
├── nest-cli.json
├── tsconfig.json
└── package.json
```

## 🧰 Instalación y Setup

```bash
# 0. Activar Yarn 4 vía corepack (viene con Node 24)
corepack enable
corepack prepare yarn@stable --activate

# 1. Crear proyecto
nest new backend --package-manager yarn

cd backend

# Fijar versión de Yarn en el repo (genera `.yarnrc.yml` y commiteará `.yarn/`)
yarn set version stable

# 2. Dependencias principales
yarn add @nestjs/config @nestjs/jwt @nestjs/passport passport passport-jwt \
  @nestjs/throttler @nestjs/swagger @nestjs/event-emitter \
  ioredis \
  prisma @prisma/adapter-pg pg \
  dotenv \
  nodemailer \
  @aws-sdk/client-s3 \
  axios \
  class-validator class-transformer \
  bcrypt helmet compression \
  nestjs-pino pino-http pino-pretty \
  joi

# 3. Dev dependencies
yarn add -D @types/bcrypt @types/passport-jwt @types/pg @types/nodemailer tsx

# 4. Prisma 7
yarn dlx prisma init
# Editar `prisma/schema.prisma` con generator `prisma-client` (ver BASE_DE_DATOS.md)
# Crear `prisma.config.ts` en la raíz (ver BASE_DE_DATOS.md sección Comandos Prisma)
# En package.json añadir: "type": "module" y "packageManager": "yarn@4.x.x"

# 5. Generar schema y migrar (Prisma 7: generate ya no es automático)
# (copiar schema desde BASE_DE_DATOS.md)
yarn prisma migrate dev --name init
yarn prisma generate
yarn prisma db seed
```

> **Yarn 4 (Berry)**: fija la versión en `package.json#packageManager` (`"yarn@4.x.x"`) para que `corepack` use la misma en todos los entornos. Usa `nodeLinker: node-modules` en `.yarnrc.yml` para compatibilidad con Prisma/NestJS (PnP puede dar problemas con generación de tipos).

> **Nota Prisma 7**: el paquete `@prisma/client` ya **no se instala** — el cliente se genera en `src/generated/prisma/` directamente desde `prisma`. Tampoco se usa `prisma.$use(...)` (middleware removido); para interceptar queries usar **Client Extensions** (`prisma.$extends({ query: { ... } })`).

## ⚙️ Variables de Entorno

`.env.example`:

```env
# App
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1
FRONTEND_URL=http://localhost:4200

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/delivery?schema=public"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_ACCESS_SECRET=change-me-access
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_SECRET=change-me-refresh
JWT_REFRESH_EXPIRES=7d

# Mapbox
MAPBOX_TOKEN=pk.xxxxx

# WhatsApp Cloud API (Meta) — https://developers.facebook.com/docs/whatsapp/cloud-api
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_BUSINESS_ACCOUNT_ID=
WHATSAPP_WEBHOOK_VERIFY_TOKEN=
WHATSAPP_API_VERSION=v20.0

# SMTP (nodemailer) — Mailhog en dev, SES/Postfix/etc. en prod
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_SECURE=false
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM_EMAIL=no-reply@delivery.com
SMTP_FROM_NAME="Rapix"

# Firebase (FCM)
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=

# MinIO (S3-compatible, self-hosted)
MINIO_ENDPOINT=http://localhost:9000
MINIO_REGION=us-east-1
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_UPLOADS=delivery-uploads
MINIO_PUBLIC_URL=http://localhost:9000/delivery-uploads

# Throttle
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

### Validación de env con Joi

`src/config/esquema-validacion.ts`:

```typescript
import * as Joi from 'joi';

export const esquemaValidacionEnv = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'staging', 'production').required(),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().required(),
  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
  MAPBOX_TOKEN: Joi.string().required(),
});
```

## 🧱 `main.ts` Base

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { HttpExcepcionFiltro } from './comun/filtros/http-excepcion.filtro';

async function arrancar() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));

  app.setGlobalPrefix(process.env.API_PREFIX ?? 'api/v1');
  app.use(helmet());
  app.use(compression());
  app.enableCors({
    origin: process.env.FRONTEND_URL?.split(','),
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  app.useGlobalFilters(new HttpExcepcionFiltro());

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Rapix API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, config));

  await app.listen(process.env.PORT ?? 3000);
}
arrancar();
```

## 🗄️ PrismaServicio (Prisma 7 + driver adapter)

`src/prisma/prisma.servicio.ts`:

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class PrismaServicio extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // Prisma 7: SIEMPRE construir con un driver adapter (no hay motor Rust embebido).
    super({
      adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
      log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
    });
  }

  async onModuleInit()    { await this.$connect(); }
  async onModuleDestroy() { await this.$disconnect(); }
}
```

`src/prisma/prisma.modulo.ts`:

```typescript
import { Global, Module } from '@nestjs/common';
import { PrismaServicio } from './prisma.servicio';

@Global()
@Module({ providers: [PrismaServicio], exports: [PrismaServicio] })
export class PrismaModulo {}
```

> **Cambios respecto a Prisma 5/6**:
> - El cliente se importa de `'../generated/prisma/client'` (no de `'@prisma/client'`).
> - Es **obligatorio** pasar un `adapter` al constructor — el driver SQL ahora es responsabilidad del proyecto (`pg` para PostgreSQL).
> - `prisma.$use(...)` (middleware) **fue removido**. Para interceptar queries usar `prisma.$extends({ query: { ... } })` (Client Extensions).
> - `package.json` debe declarar `"type": "module"`.

## 🔐 Autenticación (ejemplo)

### `autenticacion.servicio.ts`

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaServicio } from '../../prisma/prisma.servicio';

@Injectable()
export class AutenticacionServicio {
  constructor(
    private prisma: PrismaServicio,
    private jwt: JwtService,
  ) {}

  async iniciarSesion(email: string, contrasena: string) {
    const usuario = await this.prisma.usuario.findUnique({ where: { email } });
    if (!usuario) throw new UnauthorizedException('AUTH_CREDENCIALES_INVALIDAS');

    const ok = await bcrypt.compare(contrasena, usuario.hashContrasena);
    if (!ok) throw new UnauthorizedException('AUTH_CREDENCIALES_INVALIDAS');

    return this.emitirTokens(usuario.id, usuario.rol);
  }

  private async emitirTokens(usuarioId: string, rol: string) {
    const carga = { sub: usuarioId, rol };
    const tokenAcceso = await this.jwt.signAsync(carga, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRES,
    });
    const tokenRefresco = await this.jwt.signAsync(carga, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES,
    });

    await this.prisma.tokenRefresco.create({
      data: {
        usuarioId,
        token: tokenRefresco,
        expiraEn: new Date(Date.now() + 7 * 24 * 3600 * 1000),
      },
    });

    return { tokenAcceso, tokenRefresco };
  }
}
```

### Guardias por rol

```typescript
// roles.decorador.ts
import { SetMetadata } from '@nestjs/common';
import { RolUsuario } from '../../generated/prisma/client';
export const ROLES_KEY = 'roles';
export const Roles = (...roles: RolUsuario[]) => SetMetadata(ROLES_KEY, roles);

// roles.guardia.ts
@Injectable()
export class RolesGuardia implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requeridos = this.reflector.getAllAndOverride<RolUsuario[]>(ROLES_KEY, [
      context.getHandler(), context.getClass(),
    ]);
    if (!requeridos) return true;
    const { usuario } = context.switchToHttp().getRequest();
    return requeridos.includes(usuario.rol);
  }
}
```

Uso:

```typescript
@UseGuards(JwtAutenticacionGuardia, RolesGuardia)
@Roles(RolUsuario.ADMIN)
@Post('zonas')
crearZona(@Body() dto: CrearZonaDto) { ... }
```

## 🎯 Máquina de Estados de Pedido

`src/modulos/pedidos/maquina-estados/pedido-maquina-estados.ts`:

```typescript
import { EstadoPedido } from '../../../generated/prisma/client';

const transiciones: Record<EstadoPedido, EstadoPedido[]> = {
  PENDIENTE_ASIGNACION:  ['ASIGNADO', 'CANCELADO'],
  ASIGNADO:              ['RECOGIDO', 'CANCELADO'],
  RECOGIDO:              ['EN_TRANSITO'],
  EN_TRANSITO:           ['EN_PUNTO_INTERCAMBIO'],
  EN_PUNTO_INTERCAMBIO:  ['EN_REPARTO'],
  EN_REPARTO:            ['ENTREGADO', 'FALLIDO'],
  FALLIDO:               ['EN_REPARTO', 'DEVUELTO'],
  ENTREGADO:             [],
  CANCELADO:             [],
  DEVUELTO:              [],
};

export function puedeTransicionar(desde: EstadoPedido, hacia: EstadoPedido): boolean {
  return transiciones[desde]?.includes(hacia) ?? false;
}

export function asegurarTransicion(desde: EstadoPedido, hacia: EstadoPedido) {
  if (!puedeTransicionar(desde, hacia)) {
    throw new BadRequestException({
      codigo: 'PEDIDO_TRANSICION_INVALIDA',
      mensaje: `No se puede pasar de ${desde} a ${hacia}`,
    });
  }
}
```

## 🗺️ Resolución de Zona (PostGIS)

La columna `zonas.poligono` es `geometry(Polygon, 4326)` con índice GIST. La resolución se hace en BD con `ST_Contains`, vía `$queryRaw` de Prisma (Prisma no soporta tipos PostGIS nativamente).

```typescript
// geo.servicio.ts
@Injectable()
export class GeoServicio {
  constructor(private prisma: PrismaServicio) {}

  async resolverZona(lat: number, lng: number): Promise<{ id: string; codigo: string } | null> {
    const filas = await this.prisma.$queryRaw<{ id: string; codigo: string }[]>`
      SELECT id, codigo
      FROM zonas
      WHERE activa = true
        AND ST_Contains(poligono, ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326))
      LIMIT 1
    `;
    return filas[0] ?? null;
  }
}
```

**Notas**:
- SRID **4326** (WGS84) — el mismo que usan Mapbox y los clientes.
- En `ST_MakePoint` el orden es `(lng, lat)`, no `(lat, lng)`.
- El índice GIST sobre `poligono` (creado en la migración inicial) hace que la consulta sea O(log n) sobre el número de zonas.

### Persistir un polígono

El editor Mapbox del admin envía un array `[{lat, lng}, ...]`; el servicio lo convierte a GeoJSON y lo inserta con `ST_GeomFromGeoJSON`:

```typescript
async crearZona(dto: CrearZonaDto): Promise<{ id: string }> {
  // GeoJSON Polygon: anillo cerrado con [lng, lat]
  const anillo = [...dto.poligono, dto.poligono[0]].map(p => [p.lng, p.lat]);
  const geojson = JSON.stringify({ type: 'Polygon', coordinates: [anillo] });

  const filas = await this.prisma.$queryRaw<{ id: string }[]>`
    INSERT INTO zonas (id, codigo, nombre, descripcion, poligono, latitud_centro, longitud_centro, punto_intercambio_id, activa, creado_en, actualizado_en)
    VALUES (gen_random_uuid(), ${dto.codigo}, ${dto.nombre}, ${dto.descripcion ?? null},
            ST_SetSRID(ST_GeomFromGeoJSON(${geojson}), 4326),
            ${centroide(dto.poligono).lat}, ${centroide(dto.poligono).lng},
            ${dto.puntoIntercambioId ?? null}, true, now(), now())
    RETURNING id
  `;
  return filas[0];
}
```

## 📤 Subida de Archivos (MinIO, S3-compatible)

MinIO expone una API S3-compatible, así que se usa el mismo SDK de AWS apuntando al endpoint propio. `forcePathStyle: true` es necesario porque MinIO usa rutas tipo `endpoint/bucket/key` (no virtual-hosted).

```typescript
// archivos.servicio.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class ArchivosServicio {
  private s3 = new S3Client({
    endpoint: process.env.MINIO_ENDPOINT,
    region: process.env.MINIO_REGION,
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.MINIO_ACCESS_KEY!,
      secretAccessKey: process.env.MINIO_SECRET_KEY!,
    },
  });

  async subir(archivo: Express.Multer.File, carpeta: string): Promise<string> {
    const llave = `${carpeta}/${Date.now()}-${archivo.originalname}`;
    await this.s3.send(new PutObjectCommand({
      Bucket: process.env.MINIO_BUCKET_UPLOADS,
      Key: llave,
      Body: archivo.buffer,
      ContentType: archivo.mimetype,
    }));
    return `${process.env.MINIO_PUBLIC_URL}/${llave}`;
  }
}
```

## 🧪 Testing

```bash
yarn test           # unit
yarn test:e2e       # end-to-end
yarn test:cov       # cobertura
```

Ejemplo e2e:

```typescript
describe('AutenticacionControlador (e2e)', () => {
  it('/autenticacion/iniciar-sesion (POST) 200', () =>
    request(app.getHttpServer())
      .post('/api/v1/autenticacion/iniciar-sesion')
      .send({ email: 'admin@delivery.com', contrasena: 'Admin123!' })
      .expect(200)
      .expect(res => {
        expect(res.body).toHaveProperty('tokenAcceso');
      }));
});
```

## 🐳 Dockerfile

```dockerfile
# Prisma 7 + stack requieren Node 24.10+.
FROM node:24.10-alpine AS builder
WORKDIR /app
# Corepack trae Yarn 4; respeta la versión declarada en package.json#packageManager
RUN corepack enable
COPY package.json yarn.lock .yarnrc.yml prisma.config.ts ./
COPY .yarn ./.yarn
COPY prisma ./prisma
RUN yarn install --immutable
COPY . .
# Prisma 7: generate ya no es automático tras instalar; hay que invocarlo explícito.
RUN yarn prisma generate && yarn build

FROM node:24.10-alpine
WORKDIR /app
RUN corepack enable
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/package.json /app/yarn.lock /app/.yarnrc.yml ./
COPY --from=builder /app/.yarn ./.yarn
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

## 📜 Scripts NPM Recomendados

```json
{
  "type": "module",
  "packageManager": "yarn@4.5.0",
  "engines": {
    "node": ">=24.10.0"
  },
  "scripts": {
    "start:dev": "nest start --watch",
    "build": "nest build",
    "start:prod": "node dist/main.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate":  "prisma migrate dev && prisma generate",
    "prisma:deploy":   "prisma migrate deploy && prisma generate",
    "prisma:seed":     "tsx prisma/seed.ts",
    "test": "jest",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "lint": "eslint \"src/**/*.ts\" --fix"
  }
}
```

> **Prisma 7**: `"type": "module"` es obligatorio (cliente generado en ESM). `prisma migrate dev` ya no encadena `generate` ni `db seed`, por eso los scripts los componen explícitamente. Se usa `tsx` (no `ts-node`) para correr el seed por compatibilidad ESM.
>
> **Yarn 4**: `packageManager` se declara en `package.json` para que `corepack` garantice la misma versión de Yarn en dev, CI y Docker. `engines.node` asegura que el proyecto solo arranca con Node 24.10+.

## ✅ Checklist del Backend

- [ ] Todas las rutas con validación de DTO.
- [ ] Todas las rutas protegidas excepto las públicas (`@Publico()`).
- [ ] Swagger disponible en `/docs`.
- [ ] Health check en `/salud`.
- [ ] Logs con `correlationId` por request.
- [ ] Transacciones Prisma en operaciones que tocan múltiples tablas.
- [ ] Tests de los flujos críticos.
- [ ] Variables sensibles fuera del repo.
- [ ] Identificadores en español sin tildes (ver glosario en `README.md`).

---

> Ver [`BASE_DE_DATOS.md`](./BASE_DE_DATOS.md) y [`API_ENDPOINTS.md`](./API_ENDPOINTS.md).
