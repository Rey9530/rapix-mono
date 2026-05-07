# Plan: Módulo de WhatsApp con Baileys

> **Destino final del documento:** `docs/plan-whatsapp-module.md` (se copiará al salir de plan mode).
> **Archivos de tracking de avance por fase:** `docs/whatsapp/fase-{n}-{slug}.md` (creados al iniciar cada fase).

---

## Contexto

El panel admin de Rapix necesita un módulo de WhatsApp basado en la librería [`baileys`](https://www.npmjs.com/package/baileys) que permita a los administradores: (1) vincular una cuenta vía QR, (2) cerrar sesión, y (3) ver e interactuar con chats (lista de conversaciones, ventana de mensajes y composer).

Actualmente el repo solo emite mensajes salientes vía **Meta WhatsApp Cloud API** (`backend/src/modulos/notificaciones/canales/whatsapp.adaptador.ts`) para notificaciones transaccionales — no hay UI conversacional ni recepción de mensajes entrantes.

---

## Decisiones fijadas por el usuario (Phase 3 — clarificaciones)

| # | Decisión | Implicación |
|---|----------|-------------|
| D1 | **Sesión única global de Rapix** (un solo número representa al negocio; cualquier ADMIN puede operar el chat compartido) | Hay UNA sola instancia de socket Baileys en el backend. Schema sin columna `usuarioId` en `SesionWhatsApp` (solo una fila activa). |
| D2 | **Reemplazar la Cloud API por Baileys en todos lados** (notificaciones automáticas también van por Baileys) | El `WhatsAppAdaptador` actual se reescribe sobre Baileys; las plantillas existentes siguen igual. Riesgo de baneo se acepta y mitiga (ver §E). |
| D3 | **MVP completo**: chats 1:1 + grupos, envío texto/imagen/audio/documento, reacciones, leído/no leído | Schema más amplio (participantes de grupo, reacciones, receipts). Alcance de 5 fases. |

---

## Discovery — Hallazgos

### Baileys (lib externa)
- **Paquete oficial:** `baileys` (sin scope; `@whiskeysockets/baileys` es alias histórico). Versión actual `7.0.0-rc.x` (Nov 2025) con breaking changes; usaremos la última estable.
- **Inicio de sesión:** `makeWASocket({ auth, logger, browser, printQRInTerminal: false, syncFullHistory: false })`. Soporta Node, Bun y Deno; logger Pino requerido (ya tenemos `nestjs-pino`).
- **QR:** llega como string en el evento `connection.update` cuando `update.qr` está presente. Se renderea como datauri/PNG en el frontend.
- **Auth state:** `useMultiFileAuthState(carpeta)` persiste en filesystem (`creds.json` + `keys/*.json`) y expone `{ state, saveCreds }`. Es **reemplazable** por implementación custom que devuelva el mismo contrato (`state.creds`, `state.keys.get/set`) — esto permite guardar en DB.
- **Eventos clave:** `connection.update`, `creds.update`, `messages.upsert`, `messages.update`, `messages.reaction`, `chats.upsert`, `chats.update`, `contacts.upsert`, `presence.update`, `message-receipt.update`, `messaging-history.set`, `groups.upsert`.
- **Envío:** `sock.sendMessage(jid, payload)` con payloads para `text`, `image`, `video`, `audio`, `document`, reacciones (`react: { text, key }`), respuestas y reenvíos.
- **Media entrante:** `downloadMediaMessage(msg, 'buffer'|'stream', {}, { reuploadRequest: sock.updateMediaMessage })`.
- **Logout:** `sock.logout()` notifica a WhatsApp y dispara `connection.update` con `DisconnectReason.loggedOut`. Hay que limpiar el auth state después.
- **Reconexión:** chequear `lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut` para decidir si reconectar.
- **Multi-session:** soportado (cada `makeWASocket` es independiente). En este MVP solo necesitamos UNA por D1.
- **`makeInMemoryStore`:** sigue disponible pero lo evitamos — persistimos directo en Postgres.

### Backend (`backend/`)
- **NestJS 11** ESM, Prisma 7 con `prisma-client` ESM (`backend/src/generated/prisma`), adapter `@prisma/adapter-pg`. `PrismaModulo` es `@Global()`.
- **Auth global:** `JwtAutenticacionGuardia` y `RolesGuardia` registrados como `APP_GUARD` en `backend/src/app.module.ts:59-65`. Decoradores: `@UsuarioActual()`, `@Roles('ADMIN')`, `@Publico()`.
- **Eventos in-process:** `EventEmitter2` (`@nestjs/event-emitter` v3) con eventos en `backend/src/eventos/eventos-dominio.ts` y manejadores en `notificaciones/manejadores/*.manejador.ts` con `@OnEvent`.
- **Adaptador WhatsApp actual:** interfaz `CanalAdaptador` (`notificaciones/canales/canal.adaptador.ts`) con método `enviar(ctx)` y `disponible()`. Lo respetaremos.
- **Archivos:** `ArchivosServicio` (S3/MinIO) ya tiene `armarKey*` helpers; añadiremos `armarKeyWhatsapp(...)`.
- **Sin WebSockets ni gateways.** Hay que introducir `@nestjs/websockets` + `@nestjs/platform-socket.io`.
- **`.env`:** validado con Joi en `backend/src/config/esquema-validacion.ts`. Las variables nuevas se añaden ahí.

### Frontend (`admin/`)
- **Angular 21** standalone, signals + RxJS, ng-bootstrap, Bootstrap 5 + SCSS, ngx-toastr, feather-icons. Sin estado global (servicios singleton). **Sin tiempo real** — hay que añadir `socket.io-client`.
- **Servicios HTTP:** `admin/src/app/nucleo/datos/*.servicio.ts` con `HttpClient` y `environment.urlApi`.
- **Auth:** `AutenticacionServicio` (`admin/src/app/nucleo/autenticacion/autenticacion.servicio.ts`) expone `usuarioActual()`, `esAdmin()` (signals).
- **Menú lateral:** `admin/src/app/shared/data/menu.ts` (BehaviorSubject `items`). Agregar item ahí.
- **Routing del shell:** `admin/src/app/shared/routes/content.routes.ts` (lazy `loadChildren`).
- **Modales:** `NgbModal.open()` con componentes standalone.

### Prisma
- **Convenciones:** modelos PascalCase en español sin tildes; tablas snake_case con `@@map`; campos camelCase; PK `String @id @default(uuid())`; timestamps `creadoEn`/`actualizadoEn`; sin soft delete; enums SCREAMING_SNAKE_CASE.
- **Enum existente reutilizable:** `CanalNotificacion { PUSH WHATSAPP EMAIL }` (no se modifica).

---

## A. Arquitectura propuesta

### Diagrama del flujo

```
┌────────────────────┐  ┌────────────────────────────────────────────────────────────┐  ┌──────────────┐
│  Admin (Angular)   │  │                       Backend (NestJS)                    │  │   WhatsApp   │
│                    │  │                                                            │  │              │
│ ┌────────────────┐ │  │  ┌──────────────────┐    ┌──────────────────────────────┐ │  │              │
│ │ QrLoginPanel   │◄┼──┼─► WhatsappGateway   │    │ WhatsappConexionServicio     │ │  │              │
│ │ ChatList       │ │WS│  (socket.io)        │◄──►│ - makeWASocket + reconexión │◄┼──┼──► Baileys ──►│
│ │ ChatWindow     │ │  │  ◄──── eventos ─────│    │ - emite eventos de dominio   │ │  │   (WebSocket)│
│ │ MessageComposer│◄┼──┼─► WhatsappController │    └──────────┬───────────────────┘ │  │              │
│ └────────────────┘ │REST│  /api/v1/whatsapp │               │                     │  │              │
│                    │  │  └──────────────────┘    ┌──────────▼───────────────────┐ │  │              │
│                    │  │                          │ EventEmitter2 (@OnEvent)     │ │  │              │
│                    │  │  ┌──────────────────┐    └──┬─────────────┬─────────────┘ │  │              │
│                    │  │  │ NotificacionesSvc│       │             │               │  │              │
│                    │  │  │ (usa Baileys     │◄──────┘             │               │  │              │
│                    │  │  │  como canal)     │                     │               │  │              │
│                    │  │  └──────────────────┘    ┌────────────────▼─────────────┐ │  │              │
│                    │  │                          │ ChatServicio / MensajeServicio│ │  │              │
│                    │  │                          │ (persisten en Postgres)       │ │  │              │
│                    │  │                          └───────────────────────────────┘ │  │              │
│                    │  │  ┌──────────────────┐                                      │  │              │
│                    │  │  │ MinIO (media)    │◄─── upload media saliente            │  │              │
│                    │  │  │                  │◄─── downloadMediaMessage entrante    │  │              │
│                    │  │  └──────────────────┘                                      │  │              │
└────────────────────┘  └────────────────────────────────────────────────────────────┘  └──────────────┘
```

### Decisiones arquitectónicas

| Tema | Decisión | Justificación |
|------|----------|---------------|
| **Sesiones** | Una sola sesión global (D1) | Decidido por usuario. Singleton holder en el módulo. |
| **Transporte tiempo real admin↔backend** | **WebSocket con `@nestjs/websockets` + `@nestjs/platform-socket.io`** + `socket.io-client` en Angular. | Bidireccional (necesario para presencia/typing en futuro), reconexión automática built-in, namespaces para aislar `/whatsapp` del resto, ya hay clientes maduros para Angular. SSE descartado por ser unidireccional. |
| **Persistencia auth state Baileys** | **Tabla Postgres `auth_state_whatsapp`** con implementación custom de `AuthenticationState` (no `useMultiFileAuthState`). | El backend puede escalar a varias réplicas o ser redeployado en contenedores efímeros; filesystem no sobrevive. Postgres ya está en el stack. La implementación custom es estándar (~80 líneas) y deja `creds` y `keys` en una tabla key-value. |
| **Almacenamiento de media** | **MinIO** vía `ArchivosServicio` existente. Las URLs se guardan en `MensajeWhatsapp.urlMedia`. | Reusa pipeline existente; misma política de tamaño/MIME. |
| **Identidad de la sesión global** | Fila única en tabla `SesionWhatsapp` con `id = "global"` (constante). Estado: `DESCONECTADA / ESPERANDO_QR / CONECTADA / EXPIRADA / BANEADA`. | Modelo simple sin foreign key a usuario; cualquier ADMIN ve la misma fila. |
| **Reemplazo del adaptador Cloud API** (D2) | El nuevo `WhatsappBaileysAdaptador` implementa `CanalAdaptador` y reemplaza el binding actual de `WHATSAPP` en `NotificacionesModulo`. El archivo viejo `whatsapp.adaptador.ts` se elimina. | Decisión D2. |
| **Concurrencia de la conexión** | El servicio `WhatsappConexionServicio` es `@Injectable({ scope: Scope.DEFAULT })` (singleton) con un único `WASocket` y un mutex async para reconexión. Implementa `OnModuleInit` (auto-arranque si hay creds) y `OnModuleDestroy` (cierre limpio). | Una sola sesión activa, evita race conditions en reconexión. |

---

## B. Cambios en `schema.prisma`

Una migración nueva: `20260506000000_fase_8_whatsapp` (sigue convención `fase_N_descripcion`).

```prisma
// ───────────────── Enums ─────────────────

enum EstadoSesionWhatsapp {
  DESCONECTADA
  ESPERANDO_QR
  CONECTADA
  EXPIRADA
  BANEADA
}

enum TipoChatWhatsapp {
  INDIVIDUAL
  GRUPO
}

enum DireccionMensajeWhatsapp {
  ENTRANTE
  SALIENTE
}

enum TipoMensajeWhatsapp {
  TEXTO
  IMAGEN
  VIDEO
  AUDIO
  DOCUMENTO
  STICKER
  UBICACION
  CONTACTO
  SISTEMA
}

enum EstadoMensajeWhatsapp {
  PENDIENTE     // creado en DB, aún no enviado a Baileys
  ENVIADO       // ack 1 (server)
  ENTREGADO     // ack 2 (device)
  LEIDO         // ack 3 (read)
  FALLIDO
}

// ───────────────── Modelos ─────────────────

/// Fila única (id="global") con el estado de la sesión Baileys.
model SesionWhatsapp {
  id            String                @id              // siempre "global" en MVP
  estado        EstadoSesionWhatsapp  @default(DESCONECTADA)
  jidPropio     String?                                // ej. 50312345678@s.whatsapp.net
  numeroPropio  String?                                // E.164 sin '+'
  nombrePropio  String?
  qrActual      String?                                // string crudo del QR vigente
  qrExpiraEn    DateTime?
  ultimoErrorAt DateTime?
  ultimoError   String?
  conectadoEn   DateTime?
  desconectadoEn DateTime?
  creadoEn      DateTime              @default(now())
  actualizadoEn DateTime              @updatedAt

  @@map("sesiones_whatsapp")
}

/// Tabla key-value para auth state custom (reemplaza useMultiFileAuthState).
/// kind = 'creds' | 'pre-key' | 'session' | 'sender-key' | 'app-state-sync-key' | etc.
model AuthStateWhatsapp {
  id            String   @id @default(uuid())
  sesionId      String                            // "global"
  tipo          String                            // kind de baileys
  clave         String                            // id dentro del tipo
  valor         Json                              // serialización del objeto
  creadoEn      DateTime @default(now())
  actualizadoEn DateTime @updatedAt

  @@unique([sesionId, tipo, clave])
  @@index([sesionId, tipo])
  @@map("auth_state_whatsapp")
}

/// Contacto sincronizado de WhatsApp.
model ContactoWhatsapp {
  id           String   @id @default(uuid())
  jid          String   @unique                   // ej. 50312345678@s.whatsapp.net
  numero       String?                            // E.164 sin '+'
  nombre       String?                            // pushName o verifiedName
  urlAvatar    String?
  bloqueado    Boolean  @default(false)
  visto        DateTime?                          // último presence/last seen
  creadoEn     DateTime @default(now())
  actualizadoEn DateTime @updatedAt

  participaciones ParticipanteGrupoWhatsapp[]
  mensajes        MensajeWhatsapp[]               @relation("MensajesPorContacto")

  @@index([numero])
  @@map("contactos_whatsapp")
}

/// Chat (1:1 o grupo).
model ChatWhatsapp {
  id              String            @id @default(uuid())
  jid             String            @unique        // 1:1 ...@s.whatsapp.net | grupo ...@g.us
  tipo            TipoChatWhatsapp
  nombre          String?                          // pushName del contacto o nombre del grupo
  urlAvatar       String?
  ultimoMensajeEn DateTime?
  ultimoMensajeId String?
  noLeidos        Int               @default(0)
  archivado       Boolean           @default(false)
  silenciadoHasta DateTime?
  creadoEn        DateTime          @default(now())
  actualizadoEn   DateTime          @updatedAt

  mensajes      MensajeWhatsapp[]
  participantes ParticipanteGrupoWhatsapp[]

  @@index([tipo, ultimoMensajeEn])
  @@index([archivado, ultimoMensajeEn])
  @@map("chats_whatsapp")
}

/// Participantes de un chat de grupo (snapshot derivado de baileys).
model ParticipanteGrupoWhatsapp {
  id          String   @id @default(uuid())
  chatId      String
  contactoId  String
  esAdmin     Boolean  @default(false)
  esSuperAdmin Boolean @default(false)
  creadoEn    DateTime @default(now())

  chat     ChatWhatsapp     @relation(fields: [chatId], references: [id], onDelete: Cascade)
  contacto ContactoWhatsapp @relation(fields: [contactoId], references: [id], onDelete: Cascade)

  @@unique([chatId, contactoId])
  @@index([chatId])
  @@map("participantes_grupo_whatsapp")
}

/// Mensaje individual.
model MensajeWhatsapp {
  id            String                  @id @default(uuid())
  /// `key.id` que asigna baileys (único dentro del chat). Permite idempotencia.
  externoId     String
  chatId        String
  /// Contacto remitente (en grupos puede ser distinto al chat). En SALIENTE = null (somos nosotros).
  remitenteId   String?
  direccion     DireccionMensajeWhatsapp
  tipo          TipoMensajeWhatsapp
  estado        EstadoMensajeWhatsapp   @default(PENDIENTE)

  texto         String?
  caption       String?
  urlMedia      String?                  // URL pública en MinIO
  mimeMedia     String?
  bytesMedia    Int?
  duracionSeg   Int?                     // audio/video
  nombreArchivo String?                  // documentos
  miniatura     String?                  // datauri o URL

  /// Mensaje al que responde (replyTo). Self-relation opcional.
  respondeAId   String?
  reenviado     Boolean                  @default(false)

  enviadoEn     DateTime?
  entregadoEn   DateTime?
  leidoEn       DateTime?
  fallaError    String?

  /// Payload original de baileys por si se necesita re-procesar.
  payloadCrudo  Json?

  creadoEn      DateTime @default(now())
  actualizadoEn DateTime @updatedAt

  chat       ChatWhatsapp        @relation(fields: [chatId], references: [id], onDelete: Cascade)
  remitente  ContactoWhatsapp?   @relation("MensajesPorContacto", fields: [remitenteId], references: [id], onDelete: SetNull)
  respondeA  MensajeWhatsapp?    @relation("RespuestaMensaje", fields: [respondeAId], references: [id], onDelete: SetNull)
  respuestas MensajeWhatsapp[]   @relation("RespuestaMensaje")
  reacciones ReaccionMensajeWhatsapp[]

  @@unique([chatId, externoId])
  @@index([chatId, creadoEn])
  @@index([direccion, estado])
  @@map("mensajes_whatsapp")
}

/// Reacciones a mensajes (un contacto puede reaccionar a un mensaje con un emoji; última gana).
model ReaccionMensajeWhatsapp {
  id          String   @id @default(uuid())
  mensajeId   String
  /// jid de quien reacciona (puede ser nuestro propio jid).
  jidAutor    String
  emoji       String?                              // null = quitar reacción
  reaccionadoEn DateTime @default(now())

  mensaje MensajeWhatsapp @relation(fields: [mensajeId], references: [id], onDelete: Cascade)

  @@unique([mensajeId, jidAutor])
  @@index([mensajeId])
  @@map("reacciones_mensaje_whatsapp")
}
```

**Notas:**
- No se modifica `Notificacion`: las notificaciones que pasan por canal `WHATSAPP` siguen registrándose ahí (auditoría), pero el envío real ahora va por Baileys vía `WhatsappBaileysAdaptador` que delega en `MensajeServicio.enviarTexto/Media`.
- No se modifica `CanalNotificacion`.

---

## C. Backend — `backend/src/modulos/whatsapp/`

Estructura siguiendo el patrón de `modulos/pedidos/` y `modulos/notificaciones/`:

```
backend/src/modulos/whatsapp/
├── whatsapp.modulo.ts
├── whatsapp.controlador.ts            # endpoints REST de sesión y chats
├── whatsapp.gateway.ts                # @WebSocketGateway namespace '/whatsapp'
├── servicios/
│   ├── whatsapp-conexion.servicio.ts  # singleton: makeWASocket, reconexión, QR, logout
│   ├── whatsapp-auth-state.servicio.ts# implementación custom de AuthenticationState (DB)
│   ├── whatsapp-chat.servicio.ts      # listar, marcar leído, archivar
│   ├── whatsapp-mensaje.servicio.ts   # listar mensajes, enviar texto, enviar media
│   ├── whatsapp-contacto.servicio.ts  # sync de contactos
│   └── whatsapp-evento.servicio.ts    # mapea eventos baileys → DB + emite eventos dominio
├── adaptadores/
│   └── whatsapp-baileys.adaptador.ts  # implementa CanalAdaptador (reemplaza el viejo)
├── dto/
│   ├── enviar-mensaje-texto.dto.ts
│   ├── enviar-mensaje-media.dto.ts
│   ├── reaccionar-mensaje.dto.ts
│   ├── filtros-chats.dto.ts
│   └── filtros-mensajes.dto.ts
└── transformadores/
    └── baileys-a-dto.ts               # funciones puras: convierte WAMessage → MensajeWhatsapp
```

### Servicios

**`WhatsappAuthStateServicio`**
- Implementa el contrato de Baileys `AuthenticationState` y `SignalKeyStore`.
- Métodos: `obtener(): Promise<{ state, saveCreds }>`, `limpiar(): Promise<void>`.
- Lee/escribe la tabla `AuthStateWhatsapp`. `saveCreds` hace upsert en Postgres.

**`WhatsappConexionServicio` (singleton)**
- Estado interno: `socket: WASocket | null`, `estado: EstadoSesionWhatsapp`, `mutex` para reconexión.
- API pública:
  - `iniciar()`: si no hay creds → genera QR; si hay → reconecta. Llamado desde `OnModuleInit` y desde el endpoint de "vincular".
  - `obtenerSocket(): WASocket` (throws si no conectado).
  - `cerrarSesion()`: `sock.logout()` + limpia `AuthStateWhatsapp` + actualiza `SesionWhatsapp`.
  - `obtenerEstadoActual(): SesionWhatsapp` (lee de DB).
- Listeners internos:
  - `connection.update` → actualiza `SesionWhatsapp` + emite `whatsapp.estado_cambiado`, `whatsapp.qr_disponible`.
  - `creds.update` → delega a `saveCreds`.
- Reconexión: backoff exponencial empezando en 2s hasta 60s; salvo `DisconnectReason.loggedOut` (no reconecta, marca `EXPIRADA`).

**`WhatsappEventoServicio`**
- Suscrito a eventos baileys del socket; cada handler:
  - Convierte el payload con `transformadores/baileys-a-dto.ts`.
  - Persiste en DB (upsert por `chatJid + externoId`).
  - Emite evento de dominio (`whatsapp.mensaje_entrante`, `whatsapp.mensaje_estado_actualizado`, etc.).

**`WhatsappMensajeServicio`**
- `listar(chatId, paginacion)`: query Prisma con orden `creadoEn desc`.
- `enviarTexto(chatId|jid, texto, respondeA?)`: crea registro en DB con estado `PENDIENTE` → llama `sock.sendMessage` → actualiza con `key.id` y estado `ENVIADO`.
- `enviarMedia(chatId|jid, archivo, tipo, caption?)`: sube a MinIO (`ArchivosServicio.armarKeyWhatsapp`), crea registro `PENDIENTE`, envía con `sock.sendMessage({ image|video|audio|document })`, actualiza.
- `reaccionar(mensajeId, emoji|null)`: `sock.sendMessage(jid, { react: { text: emoji ?? '', key } })` y upsert en `ReaccionMensajeWhatsapp`.
- `marcarLeido(chatIdOrJid)`: `sock.readMessages(keys)` + actualiza `noLeidos` del chat.

**`WhatsappBaileysAdaptador`** (reemplaza el adaptador Cloud API)
- Implementa `CanalAdaptador.enviar(ctx)`.
- Lógica: localiza/crea `ContactoWhatsapp` por número E.164, localiza/crea `ChatWhatsapp` 1:1, llama a `WhatsappMensajeServicio.enviarTexto`.
- `disponible()`: `sesion.estado === CONECTADA`.

### Endpoints REST — `whatsapp.controlador.ts`

Todos requieren JWT y rol `ADMIN` (`@Roles('ADMIN')`).

| Método | Ruta | Descripción | Body / Query | Respuesta |
|--------|------|-------------|--------------|-----------|
| `GET` | `/api/v1/whatsapp/sesion` | Estado actual de la sesión | — | `{ estado, jidPropio?, numeroPropio?, nombrePropio?, qrActual?, qrExpiraEn? }` |
| `POST` | `/api/v1/whatsapp/sesion/vincular` | Inicia conexión / fuerza nuevo QR | — | `{ estado, qrActual? }` (el QR final llega por WS) |
| `DELETE` | `/api/v1/whatsapp/sesion` | Cierra sesión y limpia auth state | — | `{ estado: 'DESCONECTADA' }` |
| `GET` | `/api/v1/whatsapp/chats` | Lista chats paginada | `?busqueda&tipo&pagina&limite` | `{ datos: ChatWhatsappDto[], total, pagina, totalPaginas }` |
| `GET` | `/api/v1/whatsapp/chats/:chatId` | Detalle de un chat | — | `ChatWhatsappDto` |
| `GET` | `/api/v1/whatsapp/chats/:chatId/mensajes` | Mensajes de un chat | `?antesDe&limite` (cursor por `creadoEn`) | `{ datos: MensajeWhatsappDto[], cursor }` |
| `POST` | `/api/v1/whatsapp/chats/:chatId/mensajes/texto` | Envía texto | `{ texto, respondeAId? }` | `MensajeWhatsappDto` |
| `POST` | `/api/v1/whatsapp/chats/:chatId/mensajes/media` | Envía media | multipart: `archivo`, `tipo`, `caption?`, `respondeAId?` | `MensajeWhatsappDto` |
| `POST` | `/api/v1/whatsapp/chats/:chatId/mensajes/:mensajeId/reaccion` | Reacciona | `{ emoji: string\|null }` | `ReaccionDto` |
| `POST` | `/api/v1/whatsapp/chats/:chatId/leido` | Marca chat como leído | — | `{ noLeidos: 0 }` |
| `GET` | `/api/v1/whatsapp/contactos` | Búsqueda de contactos para iniciar chat | `?busqueda&limite` | `ContactoWhatsappDto[]` |

DTOs validados con `class-validator` siguiendo el patrón de `dto/crear-pedido.dto.ts`. Documentados con `@ApiTags('WhatsApp')`, `@ApiOperation`, `@ApiBearerAuth`.

### WebSocket Gateway — `whatsapp.gateway.ts`

- Namespace: `/whatsapp` (socket.io). Auth: JWT por `handshake.auth.token` validado contra `JwtService` reutilizando la lógica de `JwtEstrategia`. Solo admins.
- Eventos servidor → cliente:
  - `sesion:estado` → `{ estado, qrActual? }`
  - `chat:upsert` → `ChatWhatsappDto`
  - `mensaje:nuevo` → `MensajeWhatsappDto`
  - `mensaje:estado` → `{ mensajeId, estado, leidoEn?, entregadoEn? }`
  - `mensaje:reaccion` → `ReaccionDto`
- Eventos cliente → servidor: ninguno en MVP (todo lo iniciado por el cliente va por REST). Esto simplifica autorización y validación.
- Implementación: el gateway suscribe `EventEmitter2` a eventos `whatsapp.*` y reemite a las salas (todos los admins están en una única sala `admins`).

### Eventos de dominio

Añadir a `backend/src/eventos/eventos-dominio.ts`:

```typescript
export const EventosDominio = {
  // ... existentes
  WhatsappEstadoCambiado:    'whatsapp.estado_cambiado',
  WhatsappQrDisponible:      'whatsapp.qr_disponible',
  WhatsappMensajeEntrante:   'whatsapp.mensaje_entrante',
  WhatsappMensajeEstado:     'whatsapp.mensaje_estado_actualizado',
  WhatsappMensajeReaccion:   'whatsapp.mensaje_reaccion',
  WhatsappChatActualizado:   'whatsapp.chat_actualizado',
} as const;
```

### Cierre limpio de sesión

`cerrarSesion()`:
1. `await sock.logout()` (mejor esfuerzo, atrapar errores).
2. `await sock.end(undefined)` para liberar el WebSocket.
3. `await prisma.authStateWhatsapp.deleteMany({ where: { sesionId: 'global' } })`.
4. Update `SesionWhatsapp` → estado `DESCONECTADA`, `desconectadoEn = now()`, limpia `qrActual`, `jidPropio`, etc.
5. Emite `whatsapp.estado_cambiado`.

---

## D. Frontend — `admin/src/app/components/whatsapp/`

### Estructura

```
admin/src/app/components/whatsapp/
├── whatsapp.routes.ts                       # /whatsapp (lazy)
├── whatsapp-pagina.ts                       # contenedor: layout 2-paneles + estado sesión
├── whatsapp-pagina.html
├── whatsapp-pagina.scss
├── qr-login-panel/
│   ├── qr-login-panel.ts
│   ├── qr-login-panel.html
│   └── qr-login-panel.scss
├── session-status-badge/
│   ├── session-status-badge.ts
│   └── session-status-badge.html
├── chat-list/
│   ├── chat-list.ts
│   ├── chat-list.html
│   └── chat-list.scss
├── chat-window/
│   ├── chat-window.ts
│   ├── chat-window.html
│   └── chat-window.scss
├── message-composer/
│   ├── message-composer.ts
│   ├── message-composer.html
│   └── message-composer.scss
├── message-bubble/
│   ├── message-bubble.ts
│   └── message-bubble.html
├── confirmar-logout.modal.ts
└── confirmar-logout.modal.html
```

### Servicios y estado

`admin/src/app/nucleo/datos/whatsapp.servicio.ts` — REST con `HttpClient` (mismo patrón que `usuarios.servicio.ts`).

`admin/src/app/nucleo/whatsapp/whatsapp-tiempo-real.servicio.ts` — singleton:
- Inyecta `AutenticacionServicio` para token.
- Mantiene un `Socket` (`socket.io-client`) al namespace `/whatsapp` con `auth: { token }`.
- Expone signals: `estadoSesion`, `qrActual`, `chats` (Map), `mensajesPorChat` (Map<chatId, signal<Mensaje[]>>), `noLeidosTotal`.
- Suscribe los eventos del gateway y muta los signals (idempotente).
- Reconexión automática del socket (config de `socket.io-client`).
- Método `inicializar()` se llama al entrar a `/whatsapp` por primera vez.

### Flujos UX

1. **Primera vinculación con QR**
   - Usuario navega a `/whatsapp`. Si `estadoSesion !== CONECTADA`, se muestra `<qr-login-panel>` a pantalla completa.
   - Click "Vincular" → POST `/sesion/vincular`. El QR llega por WS (`sesion:estado` con `qrActual`). Se renderea con `qrcode` (lib npm) en `<canvas>`.
   - Cuando el estado pasa a `CONECTADA`, se oculta el panel y aparece la UI de 2 paneles (lista + ventana).

2. **Reconexión automática**
   - El socket.io-client reconecta solo. El backend (singleton de Baileys) ya gestiona su propia reconexión. La UI muestra `<session-status-badge>` con color según estado.

3. **Logout con confirmación**
   - Botón "Desvincular" en `<session-status-badge>` (solo visible si `CONECTADA`) → `<confirmar-logout.modal>` → DELETE `/sesion` → vuelve al `<qr-login-panel>`.

4. **Envío de mensaje**
   - `<message-composer>`: textarea + botones (📎 adjuntar, 🎤 audio).
   - Texto: enter envía → POST `/texto`. Se hace optimistic update agregando burbuja con estado `PENDIENTE` (reloj). Cuando llega `mensaje:estado` con `ENVIADO`, se actualiza el ✓.
   - Adjunto: input file → POST `/media` (multipart). Mismo patrón.
   - Reacción: long-press / hover en `<message-bubble>` → emoji picker → POST `/:mensajeId/reaccion`.

### Routing y menú

- `admin/src/app/shared/routes/content.routes.ts`: agregar `{ path: 'whatsapp', loadChildren: () => import('../../components/whatsapp/whatsapp.routes')... }`.
- `admin/src/app/shared/data/menu.ts`: agregar item `{ title: 'WhatsApp', icon: 'message-circle', type: 'link', path: '/whatsapp', level: 1 }` después de "Pedidos".

---

## E. Consideraciones operativas

1. **Errores y desconexiones de Baileys**
   - `DisconnectReason.loggedOut` → marcar `EXPIRADA`, limpiar auth state, esperar acción del admin.
   - `DisconnectReason.restartRequired` → reconectar inmediatamente.
   - `connectionLost`, `connectionClosed`, `timedOut` → backoff exponencial 2s→60s.
   - `badSession` → limpiar auth state y forzar nuevo QR.
   - QR expirado (sin escanear en 60s) → Baileys emite uno nuevo automáticamente; el último vigente se guarda en `SesionWhatsapp.qrActual`.
   - Banneo (status code específico) → marcar `BANEADA` y notificar a admins.

2. **Mensajes entrantes con backend offline**
   - Cuando el backend reinicia y la sesión se reconecta, Baileys solicita `messaging-history.set` (con `syncFullHistory: false` solo trae el más reciente; suficiente para nuestro caso).
   - Como cada mensaje se persiste en DB con `chatId + externoId` único, los mensajes no se duplican aunque baileys los reemita.

3. **Rate limiting y riesgo de baneo (D2 — usar Baileys también para notificaciones)**
   - Implementar throttling en `WhatsappMensajeServicio`: máx N mensajes/segundo configurable (default 1 msg/s, máx ráfagas de 5).
   - Variar contenido (las plantillas ya tienen parámetros), evitar enviar idéntico texto a muchos contactos seguidos.
   - Documentar en `docs/whatsapp/operacion.md` que el riesgo de baneo es real y la mitigación es comportamental, no técnica.

4. **Variables de entorno nuevas** (añadir a `backend/.env` y a `esquema-validacion.ts`):
   ```env
   WHATSAPP_BAILEYS_HABILITADO=true
   WHATSAPP_BAILEYS_NAVEGADOR_NOMBRE=Rapix
   WHATSAPP_BAILEYS_TASA_MAX_POR_SEG=1
   WHATSAPP_BAILEYS_RAFAGA_MAX=5
   WHATSAPP_BAILEYS_LOG_LEVEL=warn
   ```
   Las variables actuales `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_BUSINESS_ACCOUNT_ID` quedan obsoletas; **no eliminar en la misma PR** sino marcar deprecadas y eliminar en una PR posterior una vez verificado en producción.

5. **Despliegue**
   - El backend mantiene una conexión WebSocket persistente con WhatsApp. Esto **es incompatible con scaling horizontal naive** (varias réplicas competirían por la misma sesión).
   - **Restricción operativa:** una sola réplica del backend para el módulo de WhatsApp. Si en el futuro se necesita HA, hay que extraer el módulo a un microservicio dedicado con leader election.

6. **Persistencia de media saliente**
   - Subir primero a MinIO con `ArchivosServicio.armarKeyWhatsapp(chatId, ext)`.
   - Pasar a Baileys el buffer (no la URL) para evitar dependencia de que MinIO sea públicamente accesible.

---

## F. Plan de entrega por fases

Cada fase = 1 PR. Al iniciar cada fase se crea/actualiza `docs/whatsapp/fase-{n}-{slug}.md` con un checklist marcable; al finalizarla se commitea el archivo con todo en `[x]`.

| # | Fase | Descripción | Archivos clave | Complejidad |
|---|------|-------------|----------------|-------------|
| **1** | **Schema + auth state** | Migración Prisma con todos los modelos. `WhatsappAuthStateServicio` standalone (sin socket aún). Test unitario del auth state contra Postgres real. Tracking: `docs/whatsapp/fase-1-schema.md`. | `prisma/schema.prisma`, `src/modulos/whatsapp/servicios/whatsapp-auth-state.servicio.ts` | **M** |
| **2** | **Conexión + sesión + QR** | `WhatsappConexionServicio`, `WhatsappModulo`, endpoints `/sesion` y `/sesion/vincular`, `/sesion` DELETE. Gateway con evento `sesion:estado`. Componente `qr-login-panel` y `session-status-badge` en frontend. Tracking: `docs/whatsapp/fase-2-conexion.md`. | `whatsapp-conexion.servicio.ts`, `whatsapp.controlador.ts`, `whatsapp.gateway.ts`, `qr-login-panel.ts` | **L** |
| **3** | **Recepción y persistencia** | `WhatsappEventoServicio` con todos los handlers de Baileys (`messages.upsert`, `chats.upsert`, `contacts.upsert`, `messages.update`, `message-receipt.update`, `messages.reaction`, `messaging-history.set`, `groups.upsert`). Persistencia en DB. Eventos del gateway `chat:upsert`, `mensaje:nuevo`, `mensaje:estado`, `mensaje:reaccion`. UI: `chat-list` + `chat-window` lectura-only. Tracking: `docs/whatsapp/fase-3-recepcion.md`. | `whatsapp-evento.servicio.ts`, `transformadores/baileys-a-dto.ts`, `chat-list.ts`, `chat-window.ts`, `message-bubble.ts` | **L** |
| **4** | **Envío de mensajes** | Endpoints de envío (texto, media, reaccionar, marcar leído). `WhatsappMensajeServicio` completo. UI: `message-composer` con texto, adjuntar imagen/video/audio/documento, emoji picker para reacciones. Throttling configurable. Tracking: `docs/whatsapp/fase-4-envio.md`. | `whatsapp-mensaje.servicio.ts`, `dto/*`, `message-composer.ts` | **M** |
| **5** | **Reemplazo del adaptador Cloud API y pulido** | `WhatsappBaileysAdaptador` reemplaza el binding de `WHATSAPP` en `NotificacionesModulo`. Eliminar archivo viejo `whatsapp.adaptador.ts` (Cloud API). Marcar deprecadas las env vars de Cloud API. Pulido UX: paginación de mensajes con scroll infinito, indicadores de estado, manejo de errores en composer, accesibilidad básica, breadcrumbs. Tracking: `docs/whatsapp/fase-5-pulido.md`. | `whatsapp-baileys.adaptador.ts`, `notificaciones.modulo.ts` | **M** |

---

## G. Riesgos y preguntas abiertas

1. **Riesgo de baneo de la sesión global por enviar notificaciones automáticas (D2)**. Si WhatsApp banea el número, perdemos a la vez el chat manual y las notificaciones automáticas — quedamos peor que ahora. **Mitigación:** throttling estricto en fase 4; **opción a discutir:** mantener el `WhatsAppCloudApiAdaptador` viejo como fallback (`disponible()` → falso si baileys está conectado, verdadero si baneado) en lugar de eliminarlo. Se mantiene en el plan eliminarlo, pero **flag esto al usuario antes de la fase 5**.

2. **Despliegue: una sola réplica obligatoria** mientras el módulo viva en el monolito. ¿El equipo de infra sabe esto? ¿Hay que documentarlo en `docs/ARQUITECTURA.md`?

3. **Política de retención de mensajes**: ¿se guardan indefinidamente? ¿Cumplimiento legal (LGPD/GDPR/datos sensibles)? El MVP guarda todo; convendría agregar un job de limpieza de media >90 días.

4. **Versión de Baileys**: la rama `7.0.0-rc` introduce breaking changes. Recomiendo congelar versión exacta y subir solo con PRs dedicados, dado que la lib es agresiva con cambios.

5. **`syncFullHistory`**: el plan asume `false` (solo mensajes recientes). Si se quiere migrar el historial completo del WhatsApp al Postgres, hay que activarlo y tolerar tiempos de sincronización iniciales largos. ¿Confirmar?

6. **Audio del composer**: ¿grabar audio in-browser (MediaRecorder + opus) o solo permitir adjuntar archivo de audio? El plan asume **solo adjuntar archivo** en MVP; grabación en navegador queda fuera del alcance. ¿Aceptable?

7. **Múltiples ADMIN viendo el mismo chat**: dos admins escribiendo a la vez no tienen lock. ¿Aceptable comportamiento "el último envía"? El plan asume sí; si no, hay que añadir indicador de "Fulano está escribiendo" entre admins (fácil con WS pero out of MVP).

---

## Verificación end-to-end

Pruebas manuales obligatorias en cada fase, ejecutadas con `yarn start:dev` desde `backend/` (regla CLAUDE.md):

1. **Vinculación QR (fase 2):** levantar backend, navegar a `/whatsapp` en admin, escanear QR con un teléfono de prueba, verificar que `SesionWhatsapp.estado = CONECTADA` en DB y que el badge cambia.
2. **Recepción (fase 3):** desde el teléfono enviar un mensaje al número vinculado; verificar que aparece en `chats_whatsapp`, `mensajes_whatsapp` y se renderea en `chat-window` sin recargar.
3. **Envío de texto (fase 4):** enviar desde el composer, verificar burbuja con `PENDIENTE` → `ENVIADO` → `ENTREGADO` → `LEIDO` cuando el teléfono lo abre.
4. **Envío de media (fase 4):** adjuntar imagen, audio, documento; verificar que se sube a MinIO, llega al teléfono, y la URL guardada en DB es accesible.
5. **Reacción (fase 4):** reaccionar a un mensaje desde admin y desde teléfono; verificar bidireccional.
6. **Logout (fase 2):** click "Desvincular", confirmar; verificar que `auth_state_whatsapp` queda vacío y el QR vuelve a aparecer.
7. **Reconexión (fase 2):** reiniciar backend con la sesión vinculada; verificar que reconecta solo y los mensajes nuevos siguen llegando.
8. **Reemplazo de notificaciones (fase 5):** crear un pedido (que dispara `PEDIDO_CREADO`); verificar que la notificación llega al teléfono del vendedor por Baileys (no por Cloud API).
9. **Swagger:** todos los endpoints documentados en `/api/docs` con DTOs y respuestas, según convención del repo.
10. **Tipo y compilación:** `yarn build` en backend y `ng build` en admin sin errores.

### Archivos críticos a tocar (recordatorio)

**Crear**
- `backend/prisma/migrations/20260506xxx_fase_8_whatsapp/migration.sql`
- `backend/src/modulos/whatsapp/**` (toda la estructura listada en §C)
- `admin/src/app/components/whatsapp/**` (toda la estructura listada en §D)
- `admin/src/app/nucleo/datos/whatsapp.servicio.ts`
- `admin/src/app/nucleo/whatsapp/whatsapp-tiempo-real.servicio.ts`
- `docs/plan-whatsapp-module.md` (este plan)
- `docs/whatsapp/fase-{1..5}-*.md` (tracking)

**Modificar**
- `backend/prisma/schema.prisma` — añadir 5 enums + 6 modelos
- `backend/package.json` — añadir `baileys`, `qrcode` (opcional para PNG server-side), `@nestjs/websockets`, `@nestjs/platform-socket.io`, `socket.io`
- `backend/src/app.module.ts` — registrar `WhatsappModulo`
- `backend/src/eventos/eventos-dominio.ts` — añadir constantes
- `backend/src/config/esquema-validacion.ts` — añadir env vars Joi
- `backend/.env` y `backend/.env.example` — variables nuevas
- `backend/src/modulos/notificaciones/notificaciones.modulo.ts` — cambiar binding de `WhatsAppAdaptador` por `WhatsappBaileysAdaptador` (fase 5)
- `admin/package.json` — añadir `socket.io-client`, `qrcode`
- `admin/src/app/shared/routes/content.routes.ts` — ruta `whatsapp`
- `admin/src/app/shared/data/menu.ts` — item de menú

**Eliminar (fase 5)**
- `backend/src/modulos/notificaciones/canales/whatsapp.adaptador.ts` (Cloud API)
