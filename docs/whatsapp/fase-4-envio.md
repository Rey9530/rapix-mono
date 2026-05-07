# Fase 4 — Envio de mensajes

> Tracking de avance de la Fase 4 del plan en [`../plan-whatsapp-module.md`](../plan-whatsapp-module.md).

## Objetivo

Permitir al admin enviar mensajes desde el panel: texto, imagen, video, audio, documento y reacciones a mensajes existentes. Incluir throttling configurable (riesgo de baneo) y marcar chats como leidos.

## Checklist

- [x] Crear este archivo de tracking.
- [x] Backend: agregar `armarKeyWhatsapp(chatId, ext)` y `subirParaWhatsapp(buffer, key, ct)` a `ArchivosServicio` (MIMEs ampliados, hasta 16 MB, bloquea ejecutables).
- [x] Backend: utilidad `LimitadorTasa` (token bucket) para throttling de envios.
- [x] Backend: extender `WhatsappMensajeServicio` con:
  - [x] `enviarTexto(chatId, texto, respondeAId?)`
  - [x] `enviarMedia({ chatId, archivo, tipo, caption?, respondeAId? })`
  - [x] `reaccionarSaliente(chatId, mensajeId, emoji|null)`
  - [x] `marcarLeido(chatId)`
- [x] Backend: DTOs:
  - [x] `EnviarMensajeTextoDto` (texto requerido, max 4096, `respondeAId` UUID opcional).
  - [x] `ReaccionarMensajeDto` (emoji opcional, max 8 chars).
- [x] Backend: endpoints REST:
  - [x] `POST /api/v1/whatsapp/chats/:chatId/mensajes/texto`
  - [x] `POST /api/v1/whatsapp/chats/:chatId/mensajes/media` (multipart)
  - [x] `POST /api/v1/whatsapp/chats/:chatId/mensajes/:mensajeId/reaccion`
  - [x] `POST /api/v1/whatsapp/chats/:chatId/leido`
- [x] Backend: emite `whatsapp.mensaje_entrante` y `whatsapp.chat_actualizado` al enviar (gateway re-emite por WS).
- [x] Frontend: extender `WhatsappServicio` con metodos `enviarTexto`, `enviarMedia`, `reaccionar`, `marcarLeido`.
- [x] Frontend: componente `message-composer` (texto + adjuntar archivo, Enter envia, Shift+Enter nueva linea).
- [x] Frontend: integrar composer en `chat-window`.
- [x] Frontend: `chat-window` marca `chat.leido` al abrir si `noLeidos > 0`.
- [x] Frontend: reaccion en `message-bubble` con popover de 6 emojis comunes (👍❤️😂😮😢🙏) + boton para quitar.
- [x] Verificar `yarn build` backend (limpio).
- [x] Verificar `ng build` admin (limpio, chunk `whatsapp-pagina` 256 KB).
- [x] Verificar manualmente:
  - [x] Backend levanta y mapea los 10 endpoints `/whatsapp/...`.
  - [x] `POST /chats/<uuid>/mensajes/texto` sin body → 400 (DTO vacio).
  - [x] `POST /chats/<uuid>/mensajes/texto` con texto pero chat inexistente → 404.
  - [x] `POST /chats/<uuid>/leido` con chat inexistente → 404.
  - [x] `POST /chats/<uuid>/mensajes/<uuid>/reaccion` con emoji >8 chars → 400 (validacion DTO).

## Notas de diseno

- **Throttling**: token bucket (`LimitadorTasa`) con tasa `WHATSAPP_BAILEYS_TASA_MAX_POR_SEG` y rafaga `WHATSAPP_BAILEYS_RAFAGA_MAX`. Cada envio (texto, media, reaccion) toma un token; si no hay, espera (`await`) sin rechazar.
- **Optimistic UI**: por simplicidad, el composer NO hace optimistic update — espera la respuesta REST y la nueva burbuja llega por el evento `mensaje:nuevo` del WS. Si se quiere optimistic en una iteracion futura, hay que manejar la conciliacion con el `externoId` real.
- **Media**: el archivo se sube a MinIO bajo `armarKeyWhatsapp(chatId, ext)`. La URL se persiste en `MensajeWhatsapp.urlMedia`. A baileys se le pasa el `Buffer` directamente (no la URL) para evitar dependencia de que MinIO sea publicamente accesible. Se infiere el tipo (IMAGEN/VIDEO/AUDIO/DOCUMENTO) en el frontend desde `mimetype`.
- **Reaccion**: el backend reconstruye la `WAMessageKey` desde `payloadCrudo` (guardado en Fase 3); si por alguna razon no esta, fallback a `{ id: externoId, remoteJid: chatJid, fromMe }`.
- **Marcar leido**: invoca `socket.readMessages(keys)` con keys de los mensajes ENTRANTES no leidos del chat, actualiza `leidoEn`/`estado=LEIDO` y resetea `chat.noLeidos = 0`.
- **Reply**: si `respondeAId` se pasa, se reconstruye el `WAMessage` original como `quoted` desde `payloadCrudo`.
- **Audio**: se envia como audio normal; si el mimetype incluye `opus` u `ogg` se marca `ptt=true` (voice note). No grabamos audio en navegador en MVP — solo permitir adjuntar archivo, segun decision G.6 del plan.

## Pendiente para Fase 5

- Reescribir `WhatsappBaileysAdaptador` que implementa `CanalAdaptador` y reemplaza el adaptador Cloud API en `NotificacionesModulo`.
- Eliminar `whatsapp.adaptador.ts` (Cloud API) y marcar deprecadas las env vars `WHATSAPP_PHONE_NUMBER_ID`/`WHATSAPP_ACCESS_TOKEN`.
- Pulido UX del panel.
