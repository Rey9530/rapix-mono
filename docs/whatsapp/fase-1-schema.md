# Fase 1 — Schema + auth state

> Tracking de avance de la Fase 1 del plan en [`../plan-whatsapp-module.md`](../plan-whatsapp-module.md).

## Objetivo

Dejar listada la base de datos y la persistencia del `AuthenticationState` de Baileys (sin levantar todavia el socket ni endpoints).

## Checklist

- [x] Crear este archivo de tracking.
- [x] Agregar enums al `schema.prisma`:
  - [x] `EstadoSesionWhatsapp`
  - [x] `TipoChatWhatsapp`
  - [x] `DireccionMensajeWhatsapp`
  - [x] `TipoMensajeWhatsapp`
  - [x] `EstadoMensajeWhatsapp`
- [x] Agregar modelos al `schema.prisma`:
  - [x] `SesionWhatsapp`
  - [x] `AuthStateWhatsapp`
  - [x] `ContactoWhatsapp`
  - [x] `ChatWhatsapp`
  - [x] `ParticipanteGrupoWhatsapp`
  - [x] `MensajeWhatsapp`
  - [x] `ReaccionMensajeWhatsapp`
- [x] Generar migracion `fase_8_whatsapp` con `yarn prisma migrate dev`.
- [x] Regenerar cliente Prisma (`yarn prisma:generate`).
- [x] Crear `WhatsappAuthStateServicio` (implementacion `AuthenticationState` + `SignalKeyStore` sobre Postgres).
- [x] Crear `WhatsappModulo` minimo (solo provider del auth state, no controlador todavia).
- [x] Registrar `WhatsappModulo` en `app.module.ts`.
- [x] Instalar dependencia `baileys` (7.0.0-rc.9).
- [x] Verificar que `yarn build` compila sin errores.
- [x] Verificar que `yarn start:dev` levanta sin errores y responde `/api/v1/salud`.
- [x] Verificar en Postgres que las 7 tablas se crearon (`\dt *whatsapp*`).

## Notas operativas

- La tabla `auth_state_whatsapp` es key-value: `(sesionId, tipo, clave)` unico, valor `Json`.
- En MVP la fila de `SesionWhatsapp` siempre es `id = "global"`.
- No se modifica `Notificacion` ni `CanalNotificacion`.
- `BufferJSON` (de baileys) se usa para serializar `Buffer`/`Uint8Array` a JSONB en `valor`.
- Se permitio el git repo `whiskeysockets/libsignal-node` en `.yarnrc.yml` para que yarn 4 acepte el dep transitivo de `baileys`.
- Postgres del compose tenia un mismatch de collation (template viejo 2.31 vs OS 2.36). Resuelto con `ALTER DATABASE ... REFRESH COLLATION VERSION` en `template1`, `postgres` y `delivery`.

## Migracion generada

`backend/prisma/migrations/20260507041737_fase_8_whatsapp/migration.sql`
