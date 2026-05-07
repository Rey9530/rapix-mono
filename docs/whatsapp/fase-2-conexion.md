# Fase 2 — Conexion + sesion + QR

> Tracking de avance de la Fase 2 del plan en [`../plan-whatsapp-module.md`](../plan-whatsapp-module.md).

## Objetivo

Levantar el socket de Baileys, exponer los endpoints de sesion (estado, vincular, logout) y emitir el QR por WebSocket para que el panel admin lo renderee.

## Checklist

- [x] Crear este archivo de tracking.
- [x] Instalar dependencias backend: `@nestjs/websockets`, `@nestjs/platform-socket.io`, `socket.io`, `@hapi/boom`.
- [x] Instalar dependencias frontend: `socket.io-client`, `qrcode`, `@types/qrcode`.
- [x] Agregar variables de entorno `WHATSAPP_BAILEYS_*` y validarlas en `esquema-validacion.ts`.
- [x] Agregar eventos de dominio `WhatsappEstadoCambiado`, `WhatsappQrDisponible` y los demas previstos en `eventos-dominio.ts`.
- [x] Crear `WhatsappConexionServicio` (singleton: `makeWASocket`, mutex de reconexion, backoff, OnModuleInit/Destroy).
- [x] Crear `WhatsappControlador` con endpoints:
  - [x] `GET  /api/v1/whatsapp/sesion`
  - [x] `POST /api/v1/whatsapp/sesion/vincular`
  - [x] `DELETE /api/v1/whatsapp/sesion`
- [x] Crear `WhatsappGateway` (namespace `/whatsapp`, JWT en handshake, evento `sesion:estado`).
- [x] Registrar gateway, controlador y servicio en `WhatsappModulo`.
- [x] Frontend: `whatsapp-tiempo-real.servicio.ts` (socket.io-client + signals).
- [x] Frontend: `whatsapp.servicio.ts` (REST con HttpClient).
- [x] Frontend: componente `qr-login-panel`.
- [x] Frontend: componente `session-status-badge`.
- [x] Frontend: pagina contenedor `whatsapp-pagina` + `whatsapp.routes.ts`.
- [x] Frontend: agregar entrada al menu lateral y a `content.routes.ts`.
- [x] Verificar `yarn build` en backend (limpio).
- [x] Verificar `ng build` en admin (limpio, chunk `whatsapp-pagina` lazy 197 KB).
- [x] Verificar manualmente:
  - [x] Backend levanta y mapea los 3 endpoints `/whatsapp/...`.
  - [x] `GET /whatsapp/sesion` sin token devuelve 401.
  - [x] `GET /whatsapp/sesion` con token ADMIN devuelve `DESCONECTADA` por defecto.
  - [x] `POST /whatsapp/sesion/vincular` activa Baileys y la sesion pasa a `ESPERANDO_QR` con `qrActual` poblado.
  - [x] `DELETE /whatsapp/sesion` cierra y limpia el auth state.

## Notas operativas

- En `connection.update`:
  - `qr` → DB `ESPERANDO_QR` + `qrActual` + emit `whatsapp.qr_disponible` y `whatsapp.estado_cambiado`.
  - `connection==='open'` → `CONECTADA` + extrae `numeroPropio` del jid.
  - `connection==='close'` con `DisconnectReason.loggedOut` → `EXPIRADA`, limpia auth state, no reconecta.
  - `forbidden` → `BANEADA`.
  - Otro motivo → `DESCONECTADA` y reconexion con backoff `2s → 4s → 8s ... → 60s`.
- El gateway empuja `sesion:estado` al conectar y a cada `whatsapp.estado_cambiado` / `whatsapp.qr_disponible`.
- El frontend ahora muestra el menu "WhatsApp" entre "Cierres" y "Administracion".
- Falta UI de chats — corresponde a Fase 3.

## Verificacion ejecutada

```
GET /api/v1/whatsapp/sesion (sin auth)               → 401
GET /api/v1/whatsapp/sesion (con admin token)        → 200 estado=DESCONECTADA
POST /api/v1/whatsapp/sesion/vincular                → 202 estado=DESCONECTADA (transitorio)
+5s GET /api/v1/whatsapp/sesion                      → 200 estado=ESPERANDO_QR, qrActual presente
DELETE /api/v1/whatsapp/sesion                       → 200 estado=DESCONECTADA, auth_state_whatsapp vacio
```
