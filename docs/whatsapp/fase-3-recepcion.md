# Fase 3 — Recepcion y persistencia

> Tracking de avance de la Fase 3 del plan en [`../plan-whatsapp-module.md`](../plan-whatsapp-module.md).

## Objetivo

Recibir eventos de Baileys (mensajes, chats, contactos, reacciones, ack de estado), persistirlos en Postgres y empujar actualizaciones por WebSocket al panel admin. UI de chats y ventana de mensajes en modo lectura.

## Checklist

- [x] Crear este archivo de tracking.
- [x] Backend: transformador `baileys-a-dto.ts` (funciones puras).
- [x] Backend: `WhatsappContactoServicio` (upsert por jid).
- [x] Backend: `WhatsappChatServicio` (upsert por jid, listar, detalle).
- [x] Backend: `WhatsappMensajeServicio` (persistencia entrante/saliente, listar paginado por cursor, upsert reacciones, actualizar estado).
- [x] Backend: `WhatsappEventoServicio` con handlers:
  - [x] `messages.upsert` (mensajes nuevos / historial)
  - [x] `messages.update` (estado ack)
  - [x] `messages.reaction`
  - [x] `chats.upsert`
  - [x] `contacts.upsert`
- [x] Backend: emitir evento interno `WhatsappSocketCreado` desde `WhatsappConexionServicio` para que el evento servicio se re-suscriba en cada reconexion.
- [x] Backend: extender gateway con eventos `chat:upsert`, `mensaje:nuevo`, `mensaje:estado`, `mensaje:reaccion`.
- [x] Backend: endpoints REST adicionales:
  - [x] `GET /api/v1/whatsapp/chats`
  - [x] `GET /api/v1/whatsapp/chats/:id`
  - [x] `GET /api/v1/whatsapp/chats/:id/mensajes`
- [x] Backend: registrar todos los servicios nuevos en `WhatsappModulo`.
- [x] Frontend: extender `WhatsappTiempoRealServicio` con signals de chats (Map ordenado por ultimoMensajeEn) y mensajes por chat (Map<chatId, MensajeWhatsapp[]>).
- [x] Frontend: extender `WhatsappServicio` con metodos `listarChats`, `obtenerChat`, `listarMensajes`.
- [x] Frontend: componente `chat-list` con busqueda local.
- [x] Frontend: componente `chat-window` con scroll, paginacion historica y `message-bubble`.
- [x] Frontend: layout 2 paneles en `whatsapp-pagina` cuando la sesion este `CONECTADA`.
- [x] Verificar `yarn build` backend (limpio).
- [x] Verificar `ng build` admin (limpio, chunk `whatsapp-pagina` lazy 239 KB).
- [x] Verificar manualmente con `yarn start:dev`:
  - [x] Backend levanta y mapea los 6 endpoints `/whatsapp/...`.
  - [x] `GET /chats` devuelve lista vacia con paginacion correcta.
  - [x] `GET /chats?tipo=GRUPO` filtra (devuelve vacio).
  - [x] `GET /chats?tipo=INVALIDO` devuelve 400 (validacion DTO).
  - [x] `GET /chats/<uuid>/mensajes` 404 si el chat no existe.

## Notas de diseno

- Los mensajes se persisten con `(chatId, externoId)` UNIQUE → idempotencia ante reemision del historial cuando reconecta.
- `WhatsappEventoServicio.suscribir()` se llama en cada `whatsapp.socket_creado`. Como reasignamos `socketSuscrito` cada vez, los listeners nuevos quedan colgados solo del socket nuevo (el viejo ya fue cerrado por `WhatsappConexionServicio`).
- En Fase 3 NO se descarga media de mensajes entrantes — solo se guarda `tipo`, `mimeMedia`, `caption`, `bytesMedia`, `duracionSeg`, `nombreArchivo`. La descarga real es opcional y puede agregarse despues; el envio de media saliente es Fase 4.
- El campo `remitenteId` es `null` cuando `direccion = SALIENTE` (somos nosotros) y apunta al `ContactoWhatsapp` cuando `direccion = ENTRANTE`.
- Chats `@g.us` → `TipoChatWhatsapp.GRUPO`, todo lo demas → `INDIVIDUAL`.
- `messages.update.status` numerico de baileys mapeado:
  - 1 → FALLIDO, 2 → PENDIENTE, 3 → ENVIADO, 4 → ENTREGADO, 5/6 → LEIDO.
- `chats.upsert` y `contacts.upsert` reciben tipos `Chat`/`Contact` con `id?: string | null`. Suavizamos las firmas en el handler para aceptar `unknown` y validar antes de procesar.

## Flujo end-to-end de un mensaje entrante (descripcion)

1. Telefono envia mensaje al numero vinculado.
2. Baileys recibe `messages.upsert` con un `WAMessage`.
3. `WhatsappEventoServicio.alRecibirMensajes`:
   1. `normalizarMensaje(wa)` → `MensajeNormalizado`.
   2. `chats.asegurarPorJid(remoteJid, pushName)` → upsert chat.
   3. Si `direccion === ENTRANTE`: `contactos.asegurarPorJid(remitenteJid)` → upsert contacto.
   4. `mensajes.persistirEntrante(...)` → insert idempotente.
   5. Si es nuevo: `chats.actualizarUltimoMensaje(...)` → mueve el chat al tope, suma `noLeidos`.
   6. Emite `whatsapp.chat_actualizado` y `whatsapp.mensaje_entrante`.
4. `WhatsappGateway` re-emite por WebSocket: `chat:upsert` y `mensaje:nuevo`.
5. Frontend (`WhatsappTiempoRealServicio`) actualiza signals → componente chat-list/chat-window se re-renderea.

## Pendiente para Fase 4

- Composer (envio de texto/media/reacciones).
- `WhatsappMensajeServicio.enviarTexto/enviarMedia/reaccionar/marcarLeido`.
- Throttling de envios.
- Endpoints POST `/chats/:id/mensajes/...`.
