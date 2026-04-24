# Sistema de Notificaciones

## 🎯 Objetivo

Informar a los usuarios de manera oportuna sobre eventos del sistema usando **tres canales**: Push, WhatsApp y Email. El procesamiento es **in-process** vía `@nestjs/event-emitter` (sin colas BullMQ); cada envío queda registrado en la tabla `notificaciones` con su estado (`PENDIENTE`/`ENVIADO`/`FALLIDO`) para auditoría y reintento manual.

## 🧭 Arquitectura del Subsistema

```
Evento de dominio (PedidoEstadoCambiado, CierreEnviado, ...)
   │
   ▼
EventEmitter2 (@nestjs/event-emitter, in-process)
   │
   ▼
@OnEvent handler → Determina canales y destinatarios
   │
   ▼
NotificacionesServicio.enviar(...)
   │
   ├─ Crea fila en notificaciones (estado = PENDIENTE)
   │
   ├─▶ PushAdaptador      (FCM)
   ├─▶ WhatsAppAdaptador  (WhatsApp Cloud API — Meta Graph API)
   └─▶ EmailAdaptador     (SMTP via nodemailer)
   │
   ▼
Update notificaciones.estado = ENVIADO | FALLIDO
```

> **Sin colas**: si el envío falla, queda como `FALLIDO` con `mensajeError`. Reintento manual desde admin o con un job programado (no implementado en MVP). Si el volumen crece, migrar a una cola persistente sin cambiar la API de eventos.

## 📋 Canales Soportados

| Canal | Proveedor | Uso principal |
|-------|-----------|---------------|
| PUSH | Firebase Cloud Messaging (FCM) | Apps móviles (repartidor, vendedor) |
| WHATSAPP | **WhatsApp Cloud API** (Meta — Graph API v20+) | Cliente final, comunicación rica con plantillas aprobadas |
| EMAIL | **SMTP** vía `nodemailer` (Mailhog en dev; Postfix/SES/etc. en prod) | Comprobantes, reportes |

## 🗺️ Matriz de Notificaciones

| Evento | Vendedor | Repartidor | Cliente Final | Admin |
|--------|----------|------------|---------------|-------|
| `PEDIDO_CREADO` | EMAIL | — | WHATSAPP (link seguimiento) | — |
| `PEDIDO_ASIGNADO` | PUSH | PUSH | — | — |
| `PEDIDO_RECOGIDO` | PUSH | — | WHATSAPP + PUSH | — |
| `PEDIDO_EN_TRANSITO` | — | — | PUSH/WHATSAPP | — |
| `PEDIDO_EN_REPARTO` | PUSH | — | WHATSAPP + PUSH | — |
| `PEDIDO_ENTREGADO` | PUSH + EMAIL | — | EMAIL | — |
| `PEDIDO_FALLIDO` | PUSH | — | WHATSAPP | PUSH |
| `PEDIDO_CANCELADO` | PUSH | PUSH (si asignado) | WHATSAPP | — |
| `CIERRE_ENVIADO` | — | — | — | PUSH + EMAIL |
| `CIERRE_APROBADO` | — | PUSH | — | — |
| `CIERRE_RECHAZADO` | — | PUSH + EMAIL | — | — |
| `PAQUETE_SALDO_BAJO` (<10) | PUSH + EMAIL | — | — | — |
| `PAQUETE_AGOTADO` | PUSH + EMAIL | — | — | — |

## 💾 Modelos de Datos

Ver [`BASE_DE_DATOS.md`](./BASE_DE_DATOS.md):

- `Notificacion` — registra cada envío.
- `TokenDispositivo` — tokens FCM por usuario/dispositivo.

## 🧱 Implementación en NestJS

### Módulo

```typescript
// notificaciones.modulo.ts
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot({ wildcard: true, maxListeners: 20 }),
    ConfigModule,
  ],
  providers: [
    NotificacionesServicio,
    PushAdaptador,
    WhatsAppAdaptador,
    EmailAdaptador,
    PedidoEventosManejador,
  ],
  exports: [NotificacionesServicio],
})
export class NotificacionesModulo {}
```

> `EventEmitterModule.forRoot(...)` se declara una sola vez en `AppModule` — aquí se muestra para contexto.

### Servicio principal

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { CanalNotificacion } from '../generated/prisma/client';

@Injectable()
export class NotificacionesServicio {
  private readonly log = new Logger(NotificacionesServicio.name);

  constructor(
    private prisma: PrismaServicio,
    private push: PushAdaptador,
    private wa: WhatsAppAdaptador,
    private email: EmailAdaptador,
  ) {}

  async enviar(params: {
    usuarioId: string;
    canal: CanalNotificacion;
    titulo: string;
    cuerpo: string;
    datos?: any;
  }) {
    const notif = await this.prisma.notificacion.create({
      data: { ...params, estado: 'PENDIENTE' },
      include: { usuario: true },
    });

    try {
      switch (notif.canal) {
        case 'PUSH':     await this.push.enviar(notif);  break;
        case 'WHATSAPP': await this.wa.enviar(notif);    break;
        case 'EMAIL':    await this.email.enviar(notif); break;
      }
      await this.prisma.notificacion.update({
        where: { id: notif.id },
        data: { estado: 'ENVIADO', enviadoEn: new Date() },
      });
    } catch (err) {
      this.log.error(`Notificación ${notif.id} falló`, err);
      await this.prisma.notificacion.update({
        where: { id: notif.id },
        data: { estado: 'FALLIDO', mensajeError: String(err) },
      });
      // No re-lanzar: los errores de un canal no deben tumbar el handler.
    }
    return notif;
  }
}
```

> **Sin colas**: la llamada al adaptador ocurre en el mismo tick. El handler de evento usa `await` y captura errores localmente (`estado = FALLIDO`) en vez de propagarlos. Para reintentar fallos, leer `notificaciones WHERE estado = 'FALLIDO'` desde admin.

### Manejador de eventos

```typescript
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class PedidoEventosManejador {
  constructor(private notif: NotificacionesServicio) {}

  @OnEvent('pedido.estado_cambiado', { async: true })
  async alCambiarEstado(evento: PedidoEstadoCambiadoEvento) {
    // ejemplo: ENTREGADO → notificar al vendedor (push) y al cliente (email)
    if (evento.hacia === 'ENTREGADO') {
      await this.notif.enviar({
        usuarioId: evento.vendedorUsuarioId,
        canal: 'PUSH',
        titulo: 'Pedido entregado',
        cuerpo: `Tu pedido ${evento.codigoSeguimiento} fue entregado.`,
        datos: { pedidoId: evento.pedidoId, tipo: 'PEDIDO_ENTREGADO' },
      });
      if (evento.emailCliente) {
        await this.notif.enviar({
          usuarioId: evento.usuarioSistemaId, // usuario virtual para logs
          canal: 'EMAIL',
          titulo: `Pedido ${evento.codigoSeguimiento} entregado`,
          cuerpo: `Tu paquete ha sido entregado. Gracias por tu compra.`,
          datos: { codigoSeguimiento: evento.codigoSeguimiento },
        });
      }
    }
  }
}
```

> El flag `{ async: true }` hace que el `EventEmitter2` no espere al handler — la response HTTP del endpoint que disparó el evento no queda bloqueada. Aun así, los `await` internos del handler garantizan que la fila `notificaciones` se actualice antes de soltar el contexto.

## 🔌 Adaptadores

### PushAdaptador (Firebase)

```typescript
import * as admin from 'firebase-admin';

@Injectable()
export class PushAdaptador implements OnModuleInit {
  onModuleInit() {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
  }

  async enviar(notificacion: any) {
    const tokens = await prisma.tokenDispositivo.findMany({
      where: { usuarioId: notificacion.usuarioId, activo: true },
    });
    if (tokens.length === 0) return;

    await admin.messaging().sendEachForMulticast({
      tokens: tokens.map(t => t.token),
      notification: {
        title: notificacion.titulo,
        body: notificacion.cuerpo,
      },
      data: notificacion.datos ?? {},
      android: { priority: 'high' },
      apns: { headers: { 'apns-priority': '10' } },
    });
  }
}
```

### WhatsAppAdaptador (WhatsApp Cloud API — Meta)

Usa la **Graph API oficial** de Meta. Los mensajes fuera de la ventana de servicio (24h) requieren **plantillas aprobadas** (`type: 'template'`); dentro de la ventana se pueden enviar mensajes libres (`type: 'text'`).

```typescript
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WhatsAppAdaptador {
  private readonly base = `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
  private readonly auth = { Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}` };

  async enviar(notificacion: any) {
    const destino = (notificacion.datos?.telefono ?? notificacion.usuario.telefono).replace(/^\+/, '');
    const plantilla = notificacion.datos?.plantilla;

    const cuerpo = plantilla
      ? {
          messaging_product: 'whatsapp',
          to: destino,
          type: 'template',
          template: {
            name: plantilla.nombre,
            language: { code: plantilla.idioma ?? 'es' },
            components: plantilla.componentes ?? [],
          },
        }
      : {
          messaging_product: 'whatsapp',
          to: destino,
          type: 'text',
          text: { body: notificacion.cuerpo },
        };

    await axios.post(this.base, cuerpo, { headers: this.auth });
  }
}
```

> **Plantillas**: para eventos transaccionales (PEDIDO_CREADO, PEDIDO_ENTREGADO, etc.) pre-aprobar plantillas en Meta Business Manager y referenciarlas vía `datos.plantilla`. Para mensajes dentro de ventana de 24h se puede usar `type: 'text'`.

### EmailAdaptador (SMTP via nodemailer)

```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import nodemailer, { Transporter } from 'nodemailer';

@Injectable()
export class EmailAdaptador implements OnModuleInit {
  private transportador!: Transporter;

  onModuleInit() {
    this.transportador = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
        : undefined,
    });
  }

  async enviar(notificacion: any) {
    await this.transportador.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: notificacion.usuario.email,
      subject: notificacion.titulo,
      html: this.renderizarPlantilla(notificacion),
    });
  }

  private renderizarPlantilla(n: any): string {
    // Usar Handlebars / MJML según el tipo
    return `<h1>${n.titulo}</h1><p>${n.cuerpo}</p>`;
  }
}
```

> En desarrollo, apuntar a **Mailhog** (`SMTP_HOST=localhost`, `SMTP_PORT=1025`, sin auth). En producción usar Postfix propio, AWS SES, Mailgun, o cualquier proveedor SMTP.

## 📑 Plantillas de Mensajes

### WhatsApp (plantillas aprobadas en Meta Business Manager)

| Evento | Nombre plantilla | Cuerpo (con variables `{{n}}`) |
|--------|------------------|--------------------------------|
| PEDIDO_CREADO | `pedido_creado` | `Tu pedido {{1}} ha sido creado. Sigue su estado en: {{2}}` |
| PEDIDO_RECOGIDO | `pedido_recogido` | `Tu pedido {{1}} ya fue recogido. Pronto será entregado.` |
| PEDIDO_EN_REPARTO | `pedido_en_reparto` | `{{1}}: El repartidor está en camino. Estimado: {{2}}.` |
| PEDIDO_ENTREGADO | `pedido_entregado` | `{{1}} entregado. Gracias por usar {{2}}.` |
| PEDIDO_FALLIDO | `pedido_fallido` | `{{1}}: No pudimos entregar. Motivo: {{2}}. Te contactaremos.` |

> Cada plantilla debe registrarse y aprobarse en Meta Business Manager antes de usarse fuera de la ventana de servicio de 24h.

### Email (HTML con MJML recomendado)

- **Asunto**: `[Delivery] Tu pedido {codigoSeguimiento} está {estado}`
- **Cuerpo**: Logo + resumen + timeline + botón de seguimiento.

### Push

- **Título**: corto (< 40 caracteres).
- **Cuerpo**: < 120 caracteres.
- **Datos**: `{ tipo, pedidoId, deepLink }` para navegación al tocar.

## 🌍 Internacionalización (i18n)

Estructura de plantillas por idioma:

```
notificaciones/
└── plantillas/
    ├── es/
    │   ├── pedido-creado.hbs
    │   └── pedido-entregado.hbs
    └── en/
        ├── pedido-creado.hbs
        └── pedido-entregado.hbs
```

Detección del idioma del usuario por campo `Usuario.idiomaPreferido` (añadir al schema si se requiere).

## 🛠️ Registro de Tokens de Dispositivo

```typescript
@Post('/tokens-dispositivo')
@UseGuards(JwtAutenticacionGuardia)
async registrar(@UsuarioActual() usuario, @Body() dto: RegistrarTokenDispositivoDto) {
  return this.prisma.tokenDispositivo.upsert({
    where: { token: dto.token },
    update: { usuarioId: usuario.id, activo: true, plataforma: dto.plataforma },
    create: { usuarioId: usuario.id, ...dto },
  });
}
```

Invalidar token si FCM retorna `registration-token-not-registered`:

```typescript
catch (err: any) {
  if (err.code === 'messaging/registration-token-not-registered') {
    await prisma.tokenDispositivo.update({
      where: { token },
      data: { activo: false },
    });
  }
}
```

## 🧪 Testing

- Mock de adaptadores en tests unitarios.
- Usar **MailHog** en dev para ver emails (incluido en `docker-compose.yml`).
- Para WhatsApp en dev: usar el **número de prueba** que provee Meta en WhatsApp Business Platform (no envía a usuarios reales).

## 🔐 Seguridad y Anti-Spam

- Rate limiting por usuario: **máximo 20 notificaciones/hora**.
- No enviar datos sensibles (tarjetas, claves) por WhatsApp/email.
- Incluir link de **dar de baja** en emails marketing (no transaccionales).
- Validar números E.164 antes de enviar por WhatsApp (Meta los rechaza si no están en ese formato).

## 📊 Métricas

- Tasa de entrega por canal.
- Tiempo promedio evento→entrega.
- Errores por proveedor (dashboard Grafana).
- Costos por día.

## 🧰 Configuración en Apps (Flutter)

```dart
// Solicitar permiso y registrar token
Future<void> configurarPush() async {
  await FirebaseMessaging.instance.requestPermission();
  final token = await FirebaseMessaging.instance.getToken();
  if (token != null) {
    await dio.post('/tokens-dispositivo', data: {
      'token': token,
      'plataforma': Platform.isAndroid ? 'android' : 'ios',
    });
  }

  FirebaseMessaging.instance.onTokenRefresh.listen((nuevoToken) async {
    await dio.post('/tokens-dispositivo', data: {
      'token': nuevoToken,
      'plataforma': Platform.isAndroid ? 'android' : 'ios',
    });
  });
}
```

---

> Ver también: [`FLUJOS_DE_TRABAJO.md`](./FLUJOS_DE_TRABAJO.md) sección "Flujo de Notificaciones".
