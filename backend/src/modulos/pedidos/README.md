# Módulo `pedidos` (backend)

Gestiona el ciclo de vida de un pedido: creación por el vendedor, asignación,
recogida, intercambio, reparto, entrega, fallo, devolución y cancelación.
También expone helpers de **preview de costo de envío** y **contexto del
vendedor** para que la app del vendedor pueda construir la pantalla de creación
sin depender de cache local.

> Stack: NestJS + Prisma 7 (`prisma-client` + `@prisma/adapter-pg`),
> PostgreSQL 15 + PostGIS, JWT, EventEmitter2 in-process (sin colas), MinIO
> para fotos de paquete y comprobantes de entrega.

---

## Contenido del módulo

```
backend/src/modulos/pedidos/
├── README.md                       ← este archivo
├── pedidos.modulo.ts               ← NestModule, imports y providers
├── pedidos.controlador.ts          ← rutas REST
├── pedidos.servicio.ts             ← reglas de negocio
├── asignacion.servicio.ts          ← asignación manual / batch a riders
├── codigo-seguimiento.servicio.ts  ← generación de DEL-AAAA-NNNNN
├── google-maps.servicio.ts         ← expansión de URLs maps.app.goo.gl
├── maquina-estados/                ← validación de transiciones
└── dto/
    ├── crear-pedido.dto.ts
    ├── actualizar-pedido.dto.ts
    ├── cancelar-pedido.dto.ts
    ├── asignar-pedido.dto.ts
    ├── asignar-multiple-pedidos.dto.ts
    ├── filtros-pedido.dto.ts
    ├── transiciones-rider.dto.ts
    └── contexto-vendedor.dto.ts    ← nuevo (mayo 2026)
```

El módulo importa `ZonasModulo` y `PaquetesRecargadosModulo`. De este último
inyecta `FacturacionServicio`, que es donde vive la lógica de cobro
(paquete vs regla de tarifa vs fallback).

---

## Endpoints

Prefijo global: `/api/v1` (configurado en `src/main.ts` con
`app.setGlobalPrefix(process.env.API_PREFIX ?? 'api/v1')`).

| Método | Ruta | Auth | Rol |
|---|---|---|---|
| GET  | `/pedidos/seguimiento/:codigo` | Público (throttled 30/min) | — |
| POST | `/pedidos/asignar-automatico`  | JWT | `ADMIN` |
| POST | `/pedidos/asignar-multiple`    | JWT | `ADMIN` |
| **GET**  | **`/pedidos/preview-costo-envio`** | **JWT** | **`VENDEDOR`** |
| **GET**  | **`/pedidos/contexto-vendedor`**   | **JWT** | **`VENDEDOR`** |
| POST | `/pedidos`                     | JWT | `VENDEDOR` |
| GET  | `/pedidos`                     | JWT | (scoping por rol) |
| GET  | `/pedidos/:id`                 | JWT | (scoping por rol) |
| GET  | `/pedidos/:id/eventos`         | JWT | (scoping por rol) |
| PATCH| `/pedidos/:id`                 | JWT | `VENDEDOR`, `ADMIN` |
| POST | `/pedidos/:id/cancelar`        | JWT | `VENDEDOR`, `ADMIN` |
| POST | `/pedidos/:id/asignar`         | JWT | `ADMIN` |
| POST | `/pedidos/:id/recoger`         | JWT | `REPARTIDOR` |
| POST | `/pedidos/:id/en-transito`     | JWT | `REPARTIDOR` |
| POST | `/pedidos/:id/llegar-intercambio` | JWT | `REPARTIDOR` |
| POST | `/pedidos/:id/tomar-entrega`   | JWT | `REPARTIDOR` |
| POST | `/pedidos/:id/entregar`        | JWT | `REPARTIDOR` |
| POST | `/pedidos/:id/fallar`          | JWT | `REPARTIDOR` |
| POST | `/pedidos/:id/reintentar`      | JWT | `REPARTIDOR` |
| POST | `/pedidos/:id/devolver`        | JWT | `REPARTIDOR` |

En negrita los endpoints incorporados en mayo 2026 para soportar la nueva
pantalla de creación de pedido en `app_clientes`.

Swagger interactivo: `http://localhost:3000/api/docs` (al levantar con
`yarn start:dev` desde `backend/`).

---

## Endpoints nuevos / modificados (mayo 2026)

### `GET /pedidos/preview-costo-envio`

Devuelve el costo de envío que se cobraría al vendedor si creara un pedido en
este momento, **sin crear ningún registro**. La pantalla de "Nuevo pedido" en
la app móvil del vendedor lo consume al abrirse para mostrar el monto en la
barra inferior junto al botón "Crear pedido".

- **Auth:** JWT con rol `VENDEDOR`.
- **Body:** ninguno.
- **Response 200:**
  ```json
  {
    "modoFacturacion": "POR_ENVIO" | "PAQUETE",
    "costoEnvio": 0 | 2.5 | 3,
    "fuente": "PAQUETE" | "REGLA" | "FALLBACK"
  }
  ```
- **Errores:** `400 USUARIO_SIN_PERFIL` si el usuario VENDEDOR no tiene
  `PerfilVendedor` asociado.

**Semántica de `fuente`:**
- `"PAQUETE"` → el vendedor tiene al menos un `PaqueteRecargado` con
  `estado='ACTIVO'` y `enviosRestantes > 0`. `costoEnvio` = `0`. La app
  oculta el monto y muestra "Cubierto por tu paquete activo".
- `"REGLA"` → no hay paquete; existe al menos una `ReglaTarifa` con
  `modoFacturacion='POR_ENVIO'`, `activa=true`, `validaDesde <= now` y
  (`validaHasta IS NULL` o `validaHasta >= now`). `costoEnvio` = el
  `precioPorEnvio` de la última de esas reglas ordenadas por `creadoEn DESC`.
- `"FALLBACK"` → no hay paquete ni regla vigente. `costoEnvio` = `3.00`
  (constante `COSTO_ENVIO_FALLBACK` en `FacturacionServicio`). Decisión de
  producto: en lugar de devolver 500 (lo que hacía antes), el sistema cobra
  $3.00 para que el vendedor pueda seguir operando aunque la configuración
  esté incompleta.

Implementación en `pedidos.servicio.ts:previewCostoEnvio()`, delega a
`FacturacionServicio.previewParaVendedor(perfilVendedor.id)`.

### `GET /pedidos/contexto-vendedor`

Devuelve los datos de tienda del vendedor autenticado. Sustituye la lectura
desde `flutter_secure_storage` que la app hacía antes (esa cache puede quedar
stale tras un cold start o registro reciente).

- **Auth:** JWT con rol `VENDEDOR`.
- **Body:** ninguno.
- **Response 200 (ContextoVendedorDto):**
  ```json
  {
    "tieneUbicacion": true,
    "vendedorId": "cacfb621-9433-436e-8725-5778cd5b2fe9",
    "nombreNegocio": "Tienda Uno Renombrada",
    "direccion": "Col Escalón #123, San Salvador",
    "latitud": 13.6929,
    "longitud": -89.2182,
    "urlLogo": "http://localhost:9000/delivery-uploads/vendedores/.../logo.png"
  }
  ```
- **Response 200 (sin perfil):** `tieneUbicacion: false`, resto nullable. La
  app interpreta esto como "el usuario es VENDEDOR pero un admin aún no le
  creó el `PerfilVendedor`" y muestra al usuario "Actualiza tu perfil" sin
  romper la pantalla.
- **Errores:** ninguno propio. JWT inválido → 401.

> ⚠️ Contraste con `previewCostoEnvio`: este endpoint **no lanza 400** si
> falta `PerfilVendedor`. La decisión es deliberada — la pantalla de crear
> pedido necesita un fallback graceful, no una excepción. El flag
> `tieneUbicacion` es la señal contractual.

### `POST /pedidos` — `programadoPara` ahora obligatorio

El campo `programadoPara` en `CrearPedidoDto` cambió de `@IsOptional()` a
**requerido** (`@IsDateString()` + `@IsNotEmpty()`). La app móvil lo
pre-llena con `DateTime.now()` y solo permite elegir fechas desde hoy en
adelante (límite de 365 días).

- **Antes:** request sin `programadoPara` → pedido creado con `programadoPara:
  null`.
- **Ahora:** request sin `programadoPara` → `400 Bad Request`:
  ```json
  {
    "message": [
      "programadoPara should not be empty",
      "programadoPara must be a valid ISO 8601 date string"
    ],
    "error": "Bad Request",
    "statusCode": 400
  }
  ```

> ⚠️ **Breaking change**: cualquier otro cliente (admin Angular, scripts,
> integraciones) que crease pedidos sin esta fecha romperá. Verificar
> compatibilidad antes de mergear a `main`.

---

## DTO de creación (`CrearPedidoDto`)

Archivo: `dto/crear-pedido.dto.ts`.

| Campo | Tipo | Requerido | Validación |
|---|---|---|---|
| `nombreCliente` | string | ✅ | `@MaxLength(120)` |
| `telefonoCliente` | string | ✅ | `@Matches(/^\+?[0-9]{8,15}$/)` |
| `emailCliente` | string | — | `@IsEmail()` |
| `direccionOrigen` | string | ✅ | `@MaxLength(240)` |
| `latitudOrigen` | number | ✅ | `@IsLatitude()` |
| `longitudOrigen` | number | ✅ | `@IsLongitude()` |
| `notasOrigen` | string | — | `@MaxLength(240)` |
| `direccionDestino` | string | ✅ | `@MaxLength(240)` |
| `urlMapasDestino` | string | — | regex `https://maps\.app\.goo\.gl/...` |
| `latitudDestino` | number | — | `@IsLatitude()` (tiene prioridad sobre URL) |
| `longitudDestino` | number | — | `@IsLongitude()` |
| `notasDestino` | string | — | `@MaxLength(240)` |
| `descripcionPaquete` | string | — | `@MaxLength(240)` |
| `pesoPaqueteKg` | number | — | `@IsPositive()` |
| `valorDeclarado` | number | — | `@IsPositive()` |
| `metodoPago` | enum | ✅ | `CONTRA_ENTREGA \| PREPAGADO \| TARJETA \| TRANSFERENCIA` |
| `montoContraEntrega` | number | condicional | obligatorio si `metodoPago=CONTRA_ENTREGA` (validación cruzada en el servicio) |
| **`programadoPara`** | **string ISO 8601** | **✅ (nuevo)** | `@IsDateString()` + `@IsNotEmpty()` |

Body adicional: campo multipart `foto` (opcional). Si viene, se valida
mimetype/tamaño antes de crear el pedido para no dejar huérfanos.

---

## Lógica de creación (`PedidosServicio.crear`)

Orden de operaciones (`pedidos.servicio.ts:136-`):

1. Buscar `PerfilVendedor` del usuario autenticado. Si no existe →
   `400` ("admin debe crearlo").
2. **Resolver zona de origen** vía `GeoServicio.resolverZona(lat, lng)`.
   Si no hay zona activa → `400 PEDIDO_ZONA_INVALIDA_ORIGEN`.
3. **Coordenadas de destino** con prioridad:
   1. Si vienen `latitudDestino`+`longitudDestino` → se usan tal cual.
   2. Si no, pero viene `urlMapasDestino` → expande con
      `GoogleMapsServicio.resolverCoordenadas(url)`.
   3. Si no viene nada → el pedido se crea sin coordenadas y `zonaDestino`
      queda en `null` (el admin/rider las asigna después).
4. Si hay coordenadas de destino, resolver zona destino. Si no hay zona →
   `400 PEDIDO_ZONA_INVALIDA_DESTINO`.
5. Validación cruzada: `metodoPago='CONTRA_ENTREGA'` requiere
   `montoContraEntrega`. Si falta → `400`.
6. Validar foto (`ArchivosServicio.validar`) antes de crear.
7. Generar `codigoSeguimiento` único (`CodigoSeguimientoServicio.generar`).
8. **Transacción Prisma:**
   1. `FacturacionServicio.resolveBilling(vendedorId, tx)` decide modo:
      - Si hay `PaqueteRecargado` ACTIVO con saldo (FIFO por `compradoEn`)
        → `{ modoFacturacion: 'PAQUETE', costoEnvio: 0, paqueteRecargadoId }`.
      - Si no, busca `ReglaTarifa` POR_ENVIO vigente ordenada por
        `creadoEn DESC` → costo de la regla.
      - Si tampoco hay regla → fallback `$3.00`.
   2. Si hay paquete, **decremento atómico** vía
      `updateMany({ where: { enviosRestantes: { gt: 0 }, ... } })`. Si
      `count === 0` → `PaqueteAgotadoException`.
   3. Si tras decrementar `enviosRestantes === 0` → marcar paquete
      `estado='AGOTADO'` y guardar flag para emitir evento.
   4. `tx.pedido.create({ ... })` con `modoFacturacion`, `costoEnvio`,
      `paqueteRecargadoId`, `programadoPara: new Date(dto.programadoPara)`,
      `estado: 'PENDIENTE_ASIGNACION'`.
   5. `tx.eventoPedido.create({ estado: 'PENDIENTE_ASIGNACION' })`.
9. Emitir `EventosDominio.PedidoCreado` (in-process EventEmitter2).
10. Si el paquete quedó agotado → emitir `EventosDominio.PaqueteAgotado`.
11. **Fuera de la transacción**: subir foto a MinIO. Si falla, se loguea
    warning y el pedido sigue creado (la foto es opcional).
12. Retornar el `Pedido` completo (con `urlFotoPaquete` actualizado si la
    subida fue exitosa).

---

## Resolución de facturación (`FacturacionServicio`)

Archivo: `backend/src/modulos/paquetes-recargados/facturacion.servicio.ts`.

Constante: `COSTO_ENVIO_FALLBACK = 3`.

### `resolveBilling(vendedorId, tx?)` — usado por la creación real

```ts
// 1. ¿Tiene paquete activo con saldo?
const paquete = await cliente.paqueteRecargado.findFirst({
  where: { vendedorId, estado: 'ACTIVO', enviosRestantes: { gt: 0 } },
  orderBy: { compradoEn: 'asc' },        // FIFO
  select: { id: true },
});
if (paquete) return { modoFacturacion: 'PAQUETE', costoEnvio: 0, paqueteRecargadoId: paquete.id };

// 2. ¿Hay regla POR_ENVIO vigente?
const regla = await this.buscarReglaPorEnvioVigente(cliente);
// where: modoFacturacion='POR_ENVIO', activa=true,
//        validaDesde<=now, (validaHasta IS NULL OR validaHasta>=now)
// orderBy: { creadoEn: 'desc' }            ← criterio acordado

// 3. Sin regla → fallback
if (!regla || regla.precioPorEnvio == null) {
  return { modoFacturacion: 'POR_ENVIO', costoEnvio: 3, paqueteRecargadoId: null };
}

return { modoFacturacion: 'POR_ENVIO', costoEnvio: regla.precioPorEnvio, paqueteRecargadoId: null };
```

### `previewParaVendedor(vendedorId)` — usado por el endpoint preview

Misma lógica pero **fuera de transacción**, no toca el saldo y devuelve
`fuente` para que el frontend sepa qué mensaje pintar. Normaliza
`Decimal → number` con `Number(regla.precioPorEnvio)`.

### Decisiones clave

- **Orden de selección de regla = `creadoEn DESC`** (no `validaDesde DESC`).
  Acordado con producto: la "última regla creada" gana, incluso si su
  `validaDesde` es más vieja que otra que también está activa.
- **Fallback en lugar de excepción**: antes el método tiraba
  `InternalServerErrorException('REGLA_TARIFA_POR_ENVIO_FALTANTE')`. Ahora
  devuelve `$3.00` para no bloquear creación de pedidos por una mala
  configuración del admin.
- **Decremento atómico con lock por UPDATE**: el `updateMany({ where:
  enviosRestantes: { gt: 0 } })` actúa como compare-and-swap y evita race
  conditions de doble cobro contra el mismo paquete.

---

## Modelos Prisma involucrados

Schema: `backend/prisma/schema.prisma`.

```prisma
model Pedido {
  id                  String          @id @default(uuid())
  codigoSeguimiento   String          @unique
  vendedorId          String
  estado              EstadoPedido    @default(PENDIENTE_ASIGNACION)

  // Cliente
  nombreCliente       String
  telefonoCliente     String
  emailCliente        String?

  // Origen / destino
  direccionOrigen     String
  latitudOrigen       Float
  longitudOrigen      Float
  zonaOrigenId        String?
  notasOrigen         String?
  direccionDestino    String
  latitudDestino      Float?
  longitudDestino     Float?
  zonaDestinoId       String?
  notasDestino        String?

  // Paquete
  descripcionPaquete  String?
  pesoPaqueteKg       Decimal? @db.Decimal(6, 2)
  valorDeclarado      Decimal? @db.Decimal(10, 2)
  urlFotoPaquete      String?

  // Facturación
  metodoPago          MetodoPago
  modoFacturacion     ModoFacturacion
  costoEnvio          Decimal  @db.Decimal(10, 2)
  paqueteRecargadoId  String?
  montoContraEntrega  Decimal? @db.Decimal(10, 2)

  // Asignaciones
  repartidorRecogidaId String?
  repartidorEntregaId  String?

  // Timeline
  programadoPara      DateTime?          // nullable en DB pero
                                         // ahora siempre llega desde el DTO
  recogidoEn          DateTime?
  enIntercambioEn     DateTime?
  entregadoEn         DateTime?
  canceladoEn         DateTime?
  motivoCancelado     String?
  motivoFallo         String?

  creadoEn            DateTime           @default(now())
  actualizadoEn       DateTime           @updatedAt
}

model ReglaTarifa {
  id              String          @id @default(uuid())
  nombre          String
  modoFacturacion ModoFacturacion
  precioPorEnvio  Decimal?        @db.Decimal(10, 2)
  tamanoPaquete   Int?
  precioPaquete   Decimal?        @db.Decimal(10, 2)
  activa          Boolean         @default(true)
  validaDesde     DateTime        @default(now())
  validaHasta     DateTime?
  creadoEn        DateTime        @default(now())
  actualizadoEn   DateTime        @updatedAt
}

model PaqueteRecargado {
  id              String        @id @default(uuid())
  vendedorId      String
  reglaTarifaId   String
  nombre          String
  enviosTotales   Int
  enviosRestantes Int
  precio          Decimal       @db.Decimal(10, 2)
  estado          EstadoPaquete @default(ACTIVO)
  compradoEn      DateTime      @default(now())
  expiraEn        DateTime?
}

enum ModoFacturacion { POR_ENVIO PAQUETE }
enum EstadoPaquete   { ACTIVO PENDIENTE_PAGO AGOTADO EXPIRADO CANCELADO }
enum EstadoPedido    {
  PENDIENTE_ASIGNACION ASIGNADO RECOGIDO EN_TRANSITO EN_PUNTO_INTERCAMBIO
  EN_REPARTO ENTREGADO FALLIDO CANCELADO DEVUELTO
}
```

> Nota: `Pedido.programadoPara` sigue siendo `nullable` en BD por razones
> históricas, aunque el DTO ya obliga el campo. No se hace migración para no
> requerir backfill — los pedidos viejos pueden tener la columna en `null`.

---

## Eventos de dominio emitidos

In-process vía `EventEmitter2` (no Redis, sin colas). Se definen en
`src/eventos/eventos-dominio.ts`.

| Evento | Cuándo | Payload |
|---|---|---|
| `PedidoCreado` | tras `tx.pedido.create` | `{ pedidoId, codigoSeguimiento, vendedorId }` |
| `PedidoEstadoCambiado` | en cada transición | `{ pedidoId, desde, hacia, actorId, ocurridoEn }` |
| `PaqueteAgotado` | cuando un paquete pasa a `AGOTADO` | `{ paqueteRecargadoId, vendedorId }` |

Listeners típicos: notificaciones FCM/WhatsApp, métricas, scoreboard.

---

## Verificación

Por convención del repo, todo cambio en endpoints **debe verificarse contra
un servidor real** antes de mergear. Desde `backend/`:

```bash
yarn start:dev          # levanta NestJS en :3000 con hot reload
```

Swagger: `http://localhost:3000/api/docs`.

### Smoke tests reproducibles

```bash
# 1. Login VENDEDOR
TOKEN=$(curl -sS -X POST http://localhost:3000/api/v1/autenticacion/iniciar-sesion \
  -H "Content-Type: application/json" \
  -d '{"email":"vendedor1@delivery.com","contrasena":"Vendedor123!"}' \
  | sed -n 's/.*"tokenAcceso":"\([^"]*\)".*/\1/p')

# 2. Preview de costo de envío
curl -sS http://localhost:3000/api/v1/pedidos/preview-costo-envio \
  -H "Authorization: Bearer $TOKEN"
# => {"modoFacturacion":"POR_ENVIO","costoEnvio":3,"fuente":"REGLA"}

# 3. Contexto del vendedor
curl -sS http://localhost:3000/api/v1/pedidos/contexto-vendedor \
  -H "Authorization: Bearer $TOKEN"
# => {"tieneUbicacion":true,"vendedorId":"...","nombreNegocio":"Tienda Uno Renombrada",...}

# 4. POST sin programadoPara → 400
curl -sS -X POST http://localhost:3000/api/v1/pedidos \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"nombreCliente":"X","telefonoCliente":"+50370001234",
       "direccionOrigen":"T","latitudOrigen":13.6929,"longitudOrigen":-89.2182,
       "direccionDestino":"D","metodoPago":"PREPAGADO"}' \
  -w "\nHTTP %{http_code}\n"
# => HTTP 400 — "programadoPara should not be empty"

# 5. POST válido → 201 con costoEnvio
curl -sS -X POST http://localhost:3000/api/v1/pedidos \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"nombreCliente":"Cliente","telefonoCliente":"+50370001234",
       "direccionOrigen":"Col Escalón #123","latitudOrigen":13.6929,"longitudOrigen":-89.2182,
       "direccionDestino":"Av. Reforma 456","latitudDestino":13.6935,"longitudDestino":-89.2185,
       "metodoPago":"CONTRA_ENTREGA","montoContraEntrega":75,
       "programadoPara":"2026-05-13T15:00:00.000Z"}' \
  -w "\nHTTP %{http_code}\n"
# => HTTP 201 — costoEnvio:"3", modoFacturacion:"POR_ENVIO"
```

### Cobertura de ramas del preview

| Escenario | Setup | Esperado |
|---|---|---|
| **PAQUETE** | Vendedor con `PaqueteRecargado.estado='ACTIVO'`, `enviosRestantes > 0` | `{costoEnvio:0, fuente:'PAQUETE'}` |
| **REGLA** | Vendedor sin paquete + al menos una `ReglaTarifa` POR_ENVIO vigente | `costoEnvio = precioPorEnvio` de la más reciente por `creadoEn`, `fuente:'REGLA'` |
| **FALLBACK** | Vendedor sin paquete + todas las reglas POR_ENVIO desactivadas o fuera de vigencia | `{costoEnvio:3, fuente:'FALLBACK'}` |

---

## Cliente que consume estos endpoints

La app móvil de vendedores (`app_clientes/`, Flutter) consume los tres
endpoints nuevos desde:

- `lib/datos/repositorios/pedidos_repositorio.dart`
  → clases `PreviewCostoEnvio`, `ContextoVendedor` y métodos
    `previewCostoEnvio()`, `obtenerContextoVendedor()`.
- `lib/caracteristicas/pedidos/crear_pedido_pantalla.dart`
  → la pantalla que orquesta todo el flujo.

Ver `app_clientes/lib/caracteristicas/pedidos/README.md` para el detalle de
cómo se cablea en la UI (pre-llenado de fecha, AlertDialog de confirmación,
barra inferior dinámica, manejo de error/reintento del contexto).
