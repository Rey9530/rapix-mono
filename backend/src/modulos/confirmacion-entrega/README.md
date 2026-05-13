# Confirmacion de entrega por WhatsApp + IA

Modulo de dominio que, al pasar un pedido a `RECOGIDO`, contacta al cliente
final por WhatsApp con un bot conversacional (OpenAI) y registra en el pedido
si la entrega esta confirmada, mas una nota visible para el repartidor.

## Flujo

1. **Inicio (al estado `RECOGIDO`)**
   - El listener escucha `pedido.estado_cambiado`.
   - Si el telefono del cliente es invalido o la sesion Baileys esta
     desconectada: la conversacion nace `FALLIDA` y el vendedor recibe FCM
     inmediato.
   - Si todo OK: se envia un saludo determinista (sin tokens IA) preguntando
     disponibilidad. Se crea la conversacion `INICIADA`, se setea
     `Pedido.fechaContactoCliente` y se programa el vencimiento (default 60
     minutos).

2. **Respuesta del cliente**
   - El listener escucha `whatsapp.mensaje_entrante`. Filtra SALIENTES
     (criticisimo: evento se emite tambien para nuestros mensajes; sin filtro
     el bot reclasificaria su propio cierre y entraria en loop).
   - Toma la conversacion activa (`INICIADA` o `REPREGUNTADA`), aplica lock
     optimista cambiando a `PROCESANDO` y clasifica con OpenAI.
   - Resultados:
     - `CONFIRMA`     → `entregaConfirmada=true`, `notaRider="Cliente confirma..."`, conversacion `RESUELTA`.
     - `CONDICIONAL`  → `entregaConfirmada=true`, `notaRider=<instruccion>`, `RESUELTA`.
     - `RECHAZA`      → `entregaConfirmada=false`, `notaRider=<motivo>`, `RESUELTA`, FCM al vendedor.
     - `AMBIGUO` (1a) → `REPREGUNTADA`, IA emite una pregunta clara.
     - `AMBIGUO` (2a) → cierre definitivo: `entregaConfirmada=false`, nota neutra, **sin FCM** al vendedor.

3. **Timeout (1 hora sin respuesta)**
   - Cron cada minuto (`@nestjs/schedule`) detecta conversaciones vencidas no
     notificadas.
   - Envia FCM al vendedor (`PEDIDO_CLIENTE_SIN_RESPUESTA_VENDEDOR`).
   - Marca `Pedido.entregaConfirmada=false` y `notaRider="Cliente no
     respondio..."` **solo si** el pedido aun no fue actualizado por la IA
     (caso de respuesta tardia que llegue antes del proximo barrido).
   - La conversacion sigue `INICIADA` por si el cliente responde tarde — su
     respuesta sobrescribira la nota.

## Estructura

| Archivo | Rol |
|---|---|
| `confirmacion-entrega.modulo.ts` | Registra providers. Importa `WhatsappModulo` y `NotificacionesModulo`. |
| `confirmacion-entrega.servicio.ts` | Orquestador: `iniciarConversacion`, `procesarRespuesta`, `notificarTimeoutVendedor`. |
| `confirmacion-entrega.listener.ts` | `@OnEvent` para `pedido.estado_cambiado` y `whatsapp.mensaje_entrante`. |
| `confirmacion-entrega-cron.servicio.ts` | `@Cron(EVERY_MINUTE)` barre timeouts. |
| `ia-clasificador.servicio.ts` | Wrapper OpenAI. Valida salida con `class-validator`. Fallback a `AMBIGUO` si falla. |
| `prompts/prompt-confirmacion-entrega.ts` | Prompt del sistema + composicion de mensaje inicial + `formatearE164`. |
| `dto/clasificacion-ia.dto.ts` | Schema validado de la salida JSON de OpenAI. |
| `dto/contexto-conversacion.tipo.ts` | Tipos internos para pasar contexto a la IA. |

## Variables de entorno

```env
OPENAI_API_KEY=                                 # Opcional en dev/test
OPENAI_MODEL_CONFIRMACION_ENTREGA=gpt-4o-mini   # Configurable
CONFIRMACION_ENTREGA_TIMEOUT_MINUTOS=60         # Minutos hasta avisar vendedor
```

Sin `OPENAI_API_KEY`, el clasificador degrada a `AMBIGUO` con respuesta
generica. El backend levanta igual; util para entornos de desarrollo.

## Modelos Prisma

- `Pedido` (campos nuevos): `entregaConfirmada Boolean?`, `notaRider String?`,
  `fechaContactoCliente DateTime?`.
- `ConfirmacionEntregaConversacion` (1:1 con `Pedido`): estado de la sesion,
  vencimiento, flag de notificacion al vendedor.
- `ConfirmacionEntregaIntercambio` (N:1 con conversacion): turnos para
  auditoria y para alimentar contexto a la IA.

## Concurrencia

Estado intermedio `PROCESANDO` actua como lock optimista: si dos workers
intentan procesar respuestas simultaneas para el mismo chat, solo uno gana
el `updateMany(estado=PROCESANDO where estado=previo)`. El perdedor sale
silenciosamente; el ganador toma el ultimo mensaje no procesado del cliente.

## Verificacion

Probar despues de levantar `yarn start:dev`:

1. Crear pedido con `telefonoCliente` valido bajo tu control.
2. `POST /api/v1/pedidos/:id/recoger` con JWT de rider.
3. Inspeccionar `confirmaciones_entrega_conversacion` (debe estar `INICIADA`)
   y `mensajes_whatsapp` (debe haber un SALIENTE para el chat creado).
4. Responder desde el WhatsApp del cliente — verificar que
   `entregaConfirmada`, `notaRider`, `intencionFinal` se actualicen.
5. Para timeout: setear `CONFIRMACION_ENTREGA_TIMEOUT_MINUTOS=1`, recoger un
   pedido sin responder; en menos de 2 minutos el vendedor recibe FCM.
