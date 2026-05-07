# Fase 5 — Reemplazo del adaptador Cloud API y pulido

> Tracking de avance de la Fase 5 del plan en [`../plan-whatsapp-module.md`](../plan-whatsapp-module.md).

## Objetivo

Sustituir el adaptador `WhatsAppAdaptador` (Meta Cloud API) por uno construido sobre Baileys. Las notificaciones automaticas que usaban canal `WHATSAPP` salen ahora por la sesion vinculada en el panel.

## Checklist

- [x] Crear este archivo de tracking.
- [x] Backend: agregar `estaConectada()` sincrono a `WhatsappConexionServicio` (flag en memoria refrescado en `connection.update`/`cerrarSesion`).
- [x] Backend: crear `WhatsappBaileysAdaptador` en `whatsapp/adaptadores/` que implementa `CanalAdaptador`.
- [x] Backend: registrarlo como provider/export en `WhatsappModulo`.
- [x] Backend: importar `WhatsappModulo` en `NotificacionesModulo` y reemplazar el binding de `WHATSAPP` en `NotificacionesServicio`.
- [x] Backend: eliminar `whatsapp.adaptador.ts` (Cloud API viejo).
- [x] Backend: marcar deprecadas las env vars `WHATSAPP_API_VERSION`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_ACCESS_TOKEN` en `.env.example` y en `esquema-validacion.ts` (no eliminadas todavia).
- [x] Verificar `yarn build` backend (limpio).
- [x] Verificar `ng build` admin (limpio).
- [x] Verificar manualmente:
  - [x] Backend levanta y `WhatsappModulo dependencies initialized` carga ANTES que `NotificacionesModulo dependencies initialized` (orden por imports).
  - [x] `GET /api/v1/salud` responde 200 (`bd: arriba, redis: arriba`).
  - [x] `GET /api/v1/whatsapp/sesion` responde con la fila global persistida.
  - [x] Notificaciones WhatsApp sin sesion vinculada caen como `FALLIDO` con `mensajeError = CANAL_NO_CONFIGURADO:WHATSAPP` (verificado en tabla `notificaciones`).

## Implementacion

### `WhatsappBaileysAdaptador`

```
disponible() → conexion.estaConectada()

enviar(ctx) →
  1. extraer telefono de:
     - datos.telefono (override explicito)
     - usuario.telefono
     - notificacion.destino
  2. formatearE164 → numero
  3. jid = `${numero}@s.whatsapp.net`
  4. contactos.asegurarPorJid(jid, usuario.nombreCompleto)
  5. chat = chats.asegurarPorJid(jid, usuario.nombreCompleto)
  6. mensajes.enviarTexto({ chatId: chat.id, texto: `${titulo}\n\n${cuerpo}` })
```

### Wiring

- `WhatsappModulo` exporta `WhatsappBaileysAdaptador`.
- `NotificacionesModulo` importa `WhatsappModulo`.
- `NotificacionesServicio` cambia el constructor: `whatsapp: WhatsAppAdaptador` → `whatsapp: WhatsappBaileysAdaptador`. El `switch` en `adaptadorPara('WHATSAPP')` no necesita cambio (`return this.whatsapp`).

### Archivos modificados / eliminados

**Eliminados**
- `backend/src/modulos/notificaciones/canales/whatsapp.adaptador.ts` (Cloud API).

**Modificados**
- `backend/src/modulos/whatsapp/servicios/whatsapp-conexion.servicio.ts` — flag `conectada` y getter `estaConectada()`.
- `backend/src/modulos/whatsapp/whatsapp.modulo.ts` — provider/export del nuevo adaptador.
- `backend/src/modulos/notificaciones/notificaciones.modulo.ts` — importa `WhatsappModulo`, quita `WhatsAppAdaptador`.
- `backend/src/modulos/notificaciones/notificaciones.servicio.ts` — cambia el tipo del adaptador inyectado.
- `backend/.env.example` y `backend/src/config/esquema-validacion.ts` — comentarios DEPRECADO sobre las env vars Cloud API.

**Creados**
- `backend/src/modulos/whatsapp/adaptadores/whatsapp-baileys.adaptador.ts`.

## Pulido pendiente fuera de Fase 5 (mejoras sugeridas, no en MVP)

- Indicador visual "X esta escribiendo" entre admins (G.7 del plan).
- Optimistic UI en composer.
- Job de limpieza de media >90 dias (G.3 del plan; con `@nestjs/schedule`).
- Documentar en `docs/ARQUITECTURA.md` la restriccion operativa de **una sola replica** del backend (G.2 del plan).
- Avatares de chats: descargar `profile picture` con `sock.profilePictureUrl(jid)` y persistir.
- Eliminar definitivamente las env vars `WHATSAPP_PHONE_NUMBER_ID` / `WHATSAPP_ACCESS_TOKEN` / `WHATSAPP_API_VERSION` cuando todos los entornos hayan migrado (PR posterior).

## Notas de diseno

- **Riesgo de baneo (G.1 del plan)**: las notificaciones automaticas pasan por el throttling del `WhatsappMensajeServicio` (token bucket). Las plantillas existentes en `pedido-eventos.manejador.ts` y demas no se tocan — solo cambia la implementacion del canal.
- **Sin fallback a Cloud API**: decision D2 del plan (reemplazo total). Si el numero global se banea, las notificaciones WhatsApp empezaran a fallar con `CANAL_NO_CONFIGURADO`; queda como deuda futura considerar un fallback (mantener el adaptador Cloud API y orquestar entre ambos).
- **Forma del mensaje**: texto plano `${titulo}\n\n${cuerpo}` (mismo formato que la rama "texto" del adaptador Cloud API). Las plantillas Cloud API parametrizadas con buttons/header no aplican con Baileys.
- **Telefono → jid**: `formatearE164(...)` valida 8-15 digitos y produce `<numero>@s.whatsapp.net`.
