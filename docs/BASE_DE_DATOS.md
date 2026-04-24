# Base de Datos - Schema Prisma

## 🗄️ Motor y Configuración

- **Motor**: PostgreSQL 15+
- **Extensiones**: `postgis` (**requerida** — almacenamiento de polígonos de zonas y consultas `ST_Contains`/`ST_Intersects`), `uuid-ossp` (recomendada).
- **ORM**: **Prisma 7.x** (rust-free, ESM, con driver adapter `@prisma/adapter-pg`).
- **Node.js**: 24.10+ (alineado con backend y admin; cumple requisito de Prisma 7).
- **TypeScript**: 5.4+ (recomendado 5.9.x — requisito de Prisma 7).

### `prisma/schema.prisma` (archivo completo)

```prisma
// ============================================================
// SISTEMA DE DELIVERY - SCHEMA PRISMA
// ============================================================

// Generador Prisma 7: `prisma-client` (reemplaza `prisma-client-js`).
// `output` es OBLIGATORIO en v7 — el cliente ya no se genera en node_modules.
generator client {
  provider               = "prisma-client"
  output                 = "../src/generated/prisma"
  runtime                = "nodejs"
  moduleFormat           = "esm"
  generatedFileExtension = "ts"
  importFileExtension    = "ts"
  previewFeatures        = ["postgresqlExtensions"]
}

datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  extensions = [postgis, uuidOssp(map: "uuid-ossp")]
}

// Importar el cliente generado en código:
//   import { PrismaClient } from '../generated/prisma/client';
// Y construirlo SIEMPRE con un driver adapter (Prisma 7 ya no incluye motor Rust):
//   import { PrismaPg } from '@prisma/adapter-pg';
//   const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
//   export const prisma = new PrismaClient({ adapter });

// ============================================================
// ENUMS
// ============================================================

enum RolUsuario {
  ADMIN
  VENDEDOR
  REPARTIDOR
  CLIENTE
}

enum EstadoUsuario {
  ACTIVO
  INACTIVO
  SUSPENDIDO
  PENDIENTE_VERIFICACION
}

enum EstadoPedido {
  PENDIENTE_ASIGNACION    // Pendiente de asignar
  ASIGNADO                // Asignado a repartidor
  RECOGIDO                // Repartidor origen ya tiene el paquete
  EN_TRANSITO             // Repartidor origen en camino al punto de intercambio
  EN_PUNTO_INTERCAMBIO    // En punto de intercambio
  EN_REPARTO              // Repartidor destino haciendo entrega final
  ENTREGADO
  CANCELADO
  FALLIDO                 // Entrega fallida
  DEVUELTO                // Devuelto al vendedor
}

enum MetodoPago {
  CONTRA_ENTREGA
  PREPAGADO
  TARJETA
  TRANSFERENCIA
}

enum ModoFacturacion {
  POR_ENVIO               // Se cobra por cada envío
  PAQUETE                 // Descuenta de paquete recargado
}

enum EstadoPaquete {
  ACTIVO
  AGOTADO                 // Sin envíos restantes
  EXPIRADO
  CANCELADO
}

enum EstadoCierreFinanciero {
  PENDIENTE_REVISION
  APROBADO
  RECHAZADO
  CON_DISCREPANCIA
}

enum CanalNotificacion {
  PUSH
  WHATSAPP
  EMAIL
}

enum EstadoNotificacion {
  PENDIENTE
  ENVIADO
  ENTREGADO
  FALLIDO
}

// ============================================================
// USUARIOS Y AUTENTICACION
// ============================================================

model Usuario {
  id              String         @id @default(uuid())
  email           String         @unique
  telefono        String         @unique
  hashContrasena  String
  nombreCompleto  String
  rol             RolUsuario
  estado          EstadoUsuario  @default(PENDIENTE_VERIFICACION)
  urlAvatar       String?
  ultimoIngresoEn DateTime?
  creadoEn        DateTime       @default(now())
  actualizadoEn   DateTime       @updatedAt

  // Relaciones por rol (perfiles especializados)
  perfilVendedor    PerfilVendedor?
  perfilRepartidor  PerfilRepartidor?
  perfilAdmin       PerfilAdmin?

  // Relaciones transversales
  tokensRefresco  TokenRefresco[]
  registrosAuditoria RegistroAuditoria[]
  notificaciones  Notificacion[]

  @@index([rol, estado])
  @@map("usuarios")
}

model TokenRefresco {
  id          String    @id @default(uuid())
  usuarioId   String
  token       String    @unique
  expiraEn    DateTime
  revocadoEn  DateTime?
  userAgent   String?
  direccionIp String?
  creadoEn    DateTime  @default(now())

  usuario Usuario @relation(fields: [usuarioId], references: [id], onDelete: Cascade)

  @@index([usuarioId])
  @@map("tokens_refresco")
}

model PerfilAdmin {
  id        String   @id @default(uuid())
  usuarioId String   @unique
  permisos  String[] // permisos granulares adicionales
  usuario   Usuario  @relation(fields: [usuarioId], references: [id], onDelete: Cascade)

  @@map("perfiles_admin")
}

model PerfilVendedor {
  id              String   @id @default(uuid())
  usuarioId       String   @unique
  nombreNegocio   String
  rfc             String?
  direccion       String
  latitud         Float
  longitud        Float
  urlLogo         String?
  saldoRecargado  Int      @default(0)  // envíos disponibles en paquetes recargados
  limiteCredito   Decimal  @default(0) @db.Decimal(10, 2)
  creadoEn        DateTime @default(now())
  actualizadoEn   DateTime @updatedAt

  usuario   Usuario           @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  pedidos   Pedido[]
  paquetes  PaqueteRecargado[]

  @@map("perfiles_vendedor")
}

model PerfilRepartidor {
  id                  String    @id @default(uuid())
  usuarioId           String    @unique
  tipoVehiculo        String    // moto, bicicleta, auto, etc.
  placa               String?
  documentoIdentidad  String    // DPI/DNI
  telefonoEmergencia  String?
  disponible          Boolean   @default(true)
  latitudActual       Float?
  longitudActual      Float?
  ultimaUbicacionEn   DateTime?
  calificacion        Float     @default(5.0)
  totalEntregas       Int       @default(0)
  creadoEn            DateTime  @default(now())
  actualizadoEn       DateTime  @updatedAt

  usuario             Usuario             @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  zonas               ZonaRepartidor[]
  pedidosRecogida     Pedido[]            @relation("RepartidorRecogida")
  pedidosEntrega      Pedido[]            @relation("RepartidorEntrega")
  cierresFinancieros  CierreFinanciero[]

  @@map("perfiles_repartidor")
}

// ============================================================
// ZONAS GEOGRAFICAS
// ============================================================
//
// Requiere la extensión PostGIS habilitada. La migración inicial
// (`prisma/migrations/<timestamp>_init/migration.sql`) debe incluir:
//
//   CREATE EXTENSION IF NOT EXISTS postgis;
//   CREATE INDEX zonas_poligono_gist ON zonas USING GIST (poligono);
//
// Prisma no genera estas instrucciones automáticamente para tipos
// `Unsupported`, hay que añadirlas a mano al SQL de la migración.

model Zona {
  id                String   @id @default(uuid())
  codigo            String   @unique   // "A", "B", "C", etc.
  nombre            String
  descripcion       String?
  // Polígono geoespacial en SRID 4326 (WGS84). La API lo recibe/expone
  // como array [{lat, lng}, ...] y `ZonasServicio` lo convierte a/desde
  // geometría PostGIS con `ST_GeomFromGeoJSON` / `ST_AsGeoJSON`.
  poligono          Unsupported("geometry(Polygon, 4326)")
  latitudCentro     Float
  longitudCentro    Float
  puntoIntercambioId String?
  activa            Boolean  @default(true)
  creadoEn          DateTime @default(now())
  actualizadoEn     DateTime @updatedAt

  puntoIntercambio  PuntoIntercambio? @relation(fields: [puntoIntercambioId], references: [id])
  repartidores      ZonaRepartidor[]
  pedidosOrigen     Pedido[]          @relation("PedidoZonaOrigen")
  pedidosDestino    Pedido[]          @relation("PedidoZonaDestino")

  @@map("zonas")
  // Índice GIST sobre `poligono` se crea manualmente en la migración (ver bloque arriba).
}

model ZonaRepartidor {
  repartidorId String
  zonaId       String
  esPrimaria   Boolean  @default(false)
  creadoEn     DateTime @default(now())

  repartidor PerfilRepartidor @relation(fields: [repartidorId], references: [id], onDelete: Cascade)
  zona       Zona             @relation(fields: [zonaId], references: [id], onDelete: Cascade)

  @@id([repartidorId, zonaId])
  @@map("zonas_repartidor")
}

model PuntoIntercambio {
  id            String   @id @default(uuid())
  nombre        String
  direccion     String
  latitud       Float
  longitud      Float
  activo        Boolean  @default(true)
  creadoEn      DateTime @default(now())
  actualizadoEn DateTime @updatedAt

  zonas Zona[]

  @@map("puntos_intercambio")
}

// ============================================================
// PEDIDOS
// ============================================================

model Pedido {
  id                  String       @id @default(uuid())
  codigoSeguimiento   String       @unique  // Código humano: DEL-2025-00001
  vendedorId          String
  estado              EstadoPedido @default(PENDIENTE_ASIGNACION)

  // Datos del cliente final (snapshot, no se enlaza a Usuario)
  nombreCliente       String
  telefonoCliente     String
  emailCliente        String?

  // Origen (recolección)
  direccionOrigen     String
  latitudOrigen       Float
  longitudOrigen      Float
  zonaOrigenId        String?
  notasOrigen         String?

  // Destino (entrega)
  direccionDestino    String
  latitudDestino      Float
  longitudDestino     Float
  zonaDestinoId       String?
  notasDestino        String?

  // Paquete
  descripcionPaquete  String?
  pesoPaqueteKg       Decimal? @db.Decimal(6, 2)
  valorDeclarado      Decimal? @db.Decimal(10, 2)

  // Pagos
  metodoPago          MetodoPago
  modoFacturacion     ModoFacturacion
  costoEnvio          Decimal       @db.Decimal(10, 2)   // costo para el vendedor
  montoContraEntrega  Decimal?      @db.Decimal(10, 2)   // monto a cobrar al cliente
  paqueteRecargadoId  String?

  // Repartidores
  repartidorRecogidaId String?
  repartidorEntregaId  String?

  // Fechas relevantes
  programadoPara      DateTime?
  recogidoEn          DateTime?
  enIntercambioEn     DateTime?
  entregadoEn         DateTime?
  canceladoEn         DateTime?

  creadoEn            DateTime @default(now())
  actualizadoEn       DateTime @updatedAt

  // Relaciones
  vendedor            PerfilVendedor    @relation(fields: [vendedorId], references: [id])
  zonaOrigen          Zona?             @relation("PedidoZonaOrigen", fields: [zonaOrigenId], references: [id])
  zonaDestino         Zona?             @relation("PedidoZonaDestino", fields: [zonaDestinoId], references: [id])
  repartidorRecogida  PerfilRepartidor? @relation("RepartidorRecogida", fields: [repartidorRecogidaId], references: [id])
  repartidorEntrega   PerfilRepartidor? @relation("RepartidorEntrega", fields: [repartidorEntregaId], references: [id])
  paqueteRecargado    PaqueteRecargado? @relation(fields: [paqueteRecargadoId], references: [id])

  eventos             EventoPedido[]
  comprobantes        ComprobanteEntrega[]
  cierresFinancierosPedido CierreFinancieroPedido[]

  @@index([estado])
  @@index([vendedorId, creadoEn])
  @@index([repartidorRecogidaId])
  @@index([repartidorEntregaId])
  @@map("pedidos")
}

model EventoPedido {
  id         String       @id @default(uuid())
  pedidoId   String
  estado     EstadoPedido
  actorId    String?      // usuarioId que generó el evento
  latitud    Float?
  longitud   Float?
  notas      String?
  creadoEn   DateTime     @default(now())

  pedido Pedido @relation(fields: [pedidoId], references: [id], onDelete: Cascade)

  @@index([pedidoId, creadoEn])
  @@map("eventos_pedido")
}

model ComprobanteEntrega {
  id         String   @id @default(uuid())
  pedidoId   String
  urlFoto    String
  urlFirma   String?
  recibidoPor String?
  notas      String?
  latitud    Float?
  longitud   Float?
  creadoEn   DateTime @default(now())

  pedido Pedido @relation(fields: [pedidoId], references: [id], onDelete: Cascade)

  @@map("comprobantes_entrega")
}

// ============================================================
// PAQUETES RECARGADOS
// ============================================================

model PaqueteRecargado {
  id                String        @id @default(uuid())
  vendedorId        String
  nombre            String        // "Paquete 100 envíos"
  enviosTotales     Int
  enviosRestantes   Int
  precio            Decimal       @db.Decimal(10, 2)
  estado            EstadoPaquete @default(ACTIVO)
  compradoEn        DateTime      @default(now())
  expiraEn          DateTime?
  creadoEn          DateTime      @default(now())
  actualizadoEn     DateTime      @updatedAt

  vendedor PerfilVendedor @relation(fields: [vendedorId], references: [id])
  pedidos  Pedido[]

  @@index([vendedorId, estado])
  @@map("paquetes_recargados")
}

model ReglaTarifa {
  id                String          @id @default(uuid())
  nombre            String
  modoFacturacion   ModoFacturacion
  precioPorEnvio    Decimal?        @db.Decimal(10, 2)   // p.ej. $3
  tamanoPaquete     Int?                                  // p.ej. 100
  precioPaquete     Decimal?        @db.Decimal(10, 2)   // p.ej. $250
  activa            Boolean         @default(true)
  validaDesde       DateTime        @default(now())
  validaHasta       DateTime?

  @@map("reglas_tarifa")
}

// ============================================================
// CIERRE FINANCIERO DIARIO
// ============================================================

model CierreFinanciero {
  id                String                 @id @default(uuid())
  repartidorId      String
  fechaCierre       DateTime               @db.Date
  montoEsperado     Decimal                @db.Decimal(12, 2)
  montoReportado    Decimal                @db.Decimal(12, 2)
  diferencia        Decimal                @db.Decimal(12, 2)
  urlComprobanteFoto String
  notas             String?
  estado            EstadoCierreFinanciero @default(PENDIENTE_REVISION)
  revisadoPor       String?                // usuarioId admin
  revisadoEn        DateTime?
  creadoEn          DateTime               @default(now())
  actualizadoEn     DateTime               @updatedAt

  repartidor PerfilRepartidor          @relation(fields: [repartidorId], references: [id])
  pedidos    CierreFinancieroPedido[]

  @@unique([repartidorId, fechaCierre])
  @@index([fechaCierre, estado])
  @@map("cierres_financieros")
}

model CierreFinancieroPedido {
  cierreId String
  pedidoId String
  monto    Decimal @db.Decimal(10, 2)

  cierre CierreFinanciero @relation(fields: [cierreId], references: [id], onDelete: Cascade)
  pedido Pedido           @relation(fields: [pedidoId], references: [id])

  @@id([cierreId, pedidoId])
  @@map("cierres_financieros_pedidos")
}

// ============================================================
// NOTIFICACIONES
// ============================================================

model Notificacion {
  id            String              @id @default(uuid())
  usuarioId     String
  canal         CanalNotificacion
  titulo        String
  cuerpo        String
  datos         Json?
  estado        EstadoNotificacion  @default(PENDIENTE)
  enviadoEn     DateTime?
  mensajeError  String?
  creadoEn      DateTime            @default(now())

  usuario Usuario @relation(fields: [usuarioId], references: [id], onDelete: Cascade)

  @@index([usuarioId, estado])
  @@map("notificaciones")
}

model TokenDispositivo {
  id            String   @id @default(uuid())
  usuarioId     String
  token         String   @unique
  plataforma    String   // "ios" | "android" | "web"
  activo        Boolean  @default(true)
  creadoEn      DateTime @default(now())
  actualizadoEn DateTime @updatedAt

  @@index([usuarioId])
  @@map("tokens_dispositivo")
}

// ============================================================
// AUDITORIA
// ============================================================

model RegistroAuditoria {
  id          String   @id @default(uuid())
  usuarioId   String?
  accion      String   // "PEDIDO_CREADO", "CIERRE_APROBADO", etc.
  tipoEntidad String
  entidadId   String?
  metadatos   Json?
  direccionIp String?
  userAgent   String?
  creadoEn    DateTime @default(now())

  usuario Usuario? @relation(fields: [usuarioId], references: [id])

  @@index([tipoEntidad, entidadId])
  @@index([usuarioId, creadoEn])
  @@map("registros_auditoria")
}
```

## 🔗 Diagrama Entidad-Relación (resumen)

```
Usuario 1─┬─1 PerfilAdmin
          ├─1 PerfilVendedor   ─┬─N Pedido
          │                     └─N PaqueteRecargado
          └─1 PerfilRepartidor ─┬─N ZonaRepartidor ── N Zona
                                ├─N Pedido (recogida)
                                ├─N Pedido (entrega)
                                └─N CierreFinanciero

Pedido ─N EventoPedido
Pedido ─N ComprobanteEntrega
Pedido ─N CierreFinancieroPedido ── CierreFinanciero

Zona ─N PuntoIntercambio (opcional)
```

## ⚡ Índices Críticos

| Tabla | Índice | Motivo |
|-------|--------|--------|
| `pedidos` | `(estado)` | Listados filtrados por estado |
| `pedidos` | `(vendedorId, creadoEn)` | Historial por vendedor |
| `pedidos` | `(repartidorRecogidaId)`, `(repartidorEntregaId)` | Pedidos del repartidor |
| `eventos_pedido` | `(pedidoId, creadoEn)` | Timeline del pedido |
| `zonas` | `polygon` (GIST) | Resolución `ST_Contains` por punto |
| `cierres_financieros` | `(repartidorId, fechaCierre)` UNIQUE | 1 cierre por día por repartidor |
| `users` | `(role, status)` | Filtros del admin |
| `notifications` | `(userId, status)` | Bandeja de notificaciones |

## 🌱 Datos Semilla Recomendados

- 1 Administrador raíz.
- Zonas A, B, C con polígonos de ejemplo.
- 1 Punto de intercambio central.
- 1 `ReglaTarifa` con `precioPorEnvio = 3.00` y otra con `tamanoPaquete=100, precioPaquete=250`.

### Archivo `prisma/seed.ts` (ejemplo, Prisma 7)

```typescript
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, RolUsuario, ModoFacturacion } from '../src/generated/prisma/client';
import * as bcrypt from 'bcrypt';

const adaptador = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter: adaptador });

async function principal() {
  const hashContrasena = await bcrypt.hash('Admin123!', 12);

  await prisma.usuario.upsert({
    where: { email: 'admin@delivery.com' },
    update: {},
    create: {
      email: 'admin@delivery.com',
      telefono: '+50200000000',
      hashContrasena,
      nombreCompleto: 'Administrador Raíz',
      rol: RolUsuario.ADMIN,
      estado: 'ACTIVO',
      perfilAdmin: { create: { permisos: ['*'] } },
    },
  });

  await prisma.reglaTarifa.createMany({
    data: [
      {
        nombre: 'Tarifa estándar',
        modoFacturacion: ModoFacturacion.POR_ENVIO,
        precioPorEnvio: 3.0,
        activa: true,
      },
      {
        nombre: 'Paquete 100 envíos',
        modoFacturacion: ModoFacturacion.PAQUETE,
        tamanoPaquete: 100,
        precioPaquete: 250.0,
        activa: true,
      },
    ],
    skipDuplicates: true,
  });
}

principal().finally(() => prisma.$disconnect());
```

## 🧪 Comandos Prisma Útiles (Prisma 7)

> **Cambios respecto a v5/v6**:
> - `prisma migrate dev` y `prisma db push` **ya NO ejecutan** `prisma generate` ni `db seed` automáticamente — hay que invocarlos manualmente.
> - La configuración (schema path, seed, datasource) ahora vive en **`prisma.config.ts`** (raíz del proyecto). Ya no se usa `package.json#prisma`.
> - Las variables de entorno **ya no se autocargan**: el `prisma.config.ts` debe hacer `import 'dotenv/config'`.

```bash
# Generar cliente (obligatorio tras cambios de schema; ya no es automático)
npx prisma generate

# Crear migración (NO genera ni siembra automáticamente)
npx prisma migrate dev --name init
npx prisma generate

# Aplicar migración en producción
npx prisma migrate deploy

# Seed (manual, configurado en prisma.config.ts → migrations.seed)
npx prisma db seed

# Abrir Prisma Studio
npx prisma studio
```

### `prisma.config.ts` (raíz del proyecto, Prisma 7 lo requiere)

```typescript
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
```

## 🧮 Políticas de Retención

- `eventos_pedido`: conservar 2 años.
- `registros_auditoria`: conservar 5 años (requisitos legales).
- `notificaciones`: archivar > 90 días.
- `tokens_refresco`: eliminar los revocados/expirados con cron diario.

---

> Ver también: [`MODELOS_DE_DATOS.md`](./MODELOS_DE_DATOS.md) para los DTOs correspondientes.
