# Fase 6 — Notificaciones

> 📖 [← Volver al índice](../PLAN_DE_TAREAS_DETALLADO.md) · **Fase 6 de 10**

**Duración:** Semana 9 · **Esfuerzo:** 6 p-d · **Entregable global:** Notificaciones automáticas en cada cambio de estado relevante, por 3 canales (PUSH, WHATSAPP, EMAIL), dispatched in-process sin colas.

---

### Tarea 6.1 — Setup `@nestjs/event-emitter` (sin colas, eventos in-process)

**Prioridad:** 🔴 P0 · **Estimación:** 0.25d · **Depende de:** 1.1

**Objetivo**
Habilitar el bus de eventos de dominio de NestJS sobre el que se construyen todas las notificaciones.

**Descripción detallada**
Se instala `@nestjs/event-emitter` y se registra `EventEmitterModule.forRoot({ wildcard: true, maxListeners: 20 })` en `AppModule`. Se crea el directorio `src/eventos/` con la tipificación de los eventos (`PedidoCreadoEvento`, `PedidoEstadoCambiadoEvento`, `CierreEnviadoEvento`, etc.). Cualquier manejador que escuche un evento se decorará con `@OnEvent('nombre.del.evento', { async: true })` — así el handler corre fuera del path del request.

**Alcance**
- **Incluye:**
  - Instalación de `@nestjs/event-emitter`.
  - Registro global.
  - Clases tipadas de eventos en `src/eventos/`.
- **Excluye:**
  - Implementación de handlers → tarea 6.6.
  - Adapters de canales → 6.3, 6.4, 6.5.
  - Persistencia / retries en cola → explícitamente fuera de scope (decisión arquitectónica de ARQUITECTURA.md).

**Subtareas**
1. `yarn add @nestjs/event-emitter`.
2. Registrar módulo en `AppModule`.
3. Crear `src/eventos/pedido-creado.evento.ts` con constructor tipado.
4. Crear `src/eventos/pedido-estado-cambiado.evento.ts`.
5. Crear `src/eventos/cierre-enviado.evento.ts`, `cierre-aprobado.evento.ts`, `cierre-rechazado.evento.ts`, `paquete-comprado.evento.ts`, `paquete-agotado.evento.ts`, `paquete-saldo-bajo.evento.ts`.
6. Refactorizar los servicios que ya emiten (pedidos, cierres) para usar estos tipos.

**Entregables**
- `src/eventos/*.evento.ts`.
- `EventEmitterModule` registrado.

**Criterios de aceptación**
- [ ] Un test unitario emite `pedido.creado` y un listener lo recibe con el payload tipado.
- [ ] `maxListeners` permite al menos 20 handlers concurrentes sin warning.

**Referencias**
- `docs/ARQUITECTURA.md` § Eventos in-process
- `docs/NOTIFICACIONES.md` § Arquitectura

---

### Tarea 6.2 — Módulo `notificaciones` con 3 canales (PUSH/WHATSAPP/EMAIL)

**Prioridad:** 🔴 P0 · **Estimación:** 1d · **Depende de:** 6.1

**Objetivo**
Crear el módulo `notificaciones` con `NotificacionesServicio` (facade) que recibe `(usuarioId, canal, titulo, cuerpo, datos?)`, persiste `Notificacion` con estado `PENDIENTE`, despacha al adapter correspondiente y actualiza estado final.

**Descripción detallada**
Módulo en `src/modulos/notificaciones/`. El servicio expone `enviar(...)` y `enviarMulticanal(usuarioId, canales[], titulo, cuerpo, datos?)`. Internamente tiene 3 providers inyectados: `PushAdaptador`, `WhatsAppAdaptador`, `EmailAdaptador`. Los adapters viven en `notificaciones/canales/`. Si el canal falla, `mensajeError` queda poblado.

**Alcance**
- **Incluye:**
  - Schema `Notificacion` (si no estaba, agregar enums `CanalNotificacion`, `EstadoNotificacion` y modelo).
  - Schema `TokenDispositivo` (usuario ↔ token FCM).
  - Servicio facade.
  - Endpoints `GET /notificaciones/yo`, `PATCH /notificaciones/:id/leida`, `POST /tokens-dispositivo`, `DELETE /tokens-dispositivo/:token`.
  - Rate limit anti-spam: máximo 20 notificaciones por hora por usuario.
- **Excluye:**
  - Templates i18n → tarea 6.8.
  - Envío real a FCM/WhatsApp/SMTP → tareas 6.3, 6.4, 6.5.

**Subtareas**
1. Añadir al schema Prisma (si faltan): `Notificacion`, `TokenDispositivo`, enums. Migrar.
2. Crear módulo `notificaciones/`.
3. Crear `notificaciones.servicio.ts` con `enviar`, `enviarMulticanal`, `listarMisNotificaciones`, `marcarComoLeida`.
4. Crear stubs de adapters `PushAdaptador`, `WhatsAppAdaptador`, `EmailAdaptador` (interfaces + clase stub que solo loguea).
5. Crear `tokens-dispositivo.controlador.ts` con POST/DELETE.
6. Test e2e del endpoint `/notificaciones/yo`.

**Entregables**
- Módulo completo con stubs.
- Schema actualizado.
- 4 endpoints.

**Criterios de aceptación**
- [ ] `NotificacionesServicio.enviar` persiste la fila en `notificaciones` con estado `PENDIENTE` y luego `ENVIADO` o `FALLIDO`.
- [ ] `POST /tokens-dispositivo` upsert.

**Referencias**
- `docs/NOTIFICACIONES.md`

---

### Tarea 6.3 — Adapter FCM (push)

**Prioridad:** 🔴 P0 · **Estimación:** 1d · **Depende de:** 6.2

**Objetivo**
Implementar `PushAdaptador` que envía notificaciones push vía Firebase Admin SDK (`admin.messaging().sendEachForMulticast`).

**Alcance**
- **Incluye:**
  - `firebase-admin` inicializado con credenciales env.
  - Obtención de `TokenDispositivo[]` activos del usuario.
  - Construcción de `MulticastMessage` con priority high (Android), apns-priority 10 (iOS).
  - Manejo de tokens inválidos (`registration-token-not-registered`): marca `activo = false`.
- **Excluye:**
  - Topics / grupos → post-MVP.

**Subtareas**
1. `yarn add firebase-admin`.
2. Inicializar admin SDK en el constructor (`initializeApp({ credential: cert({projectId, privateKey, clientEmail}) })`).
3. Implementar `enviar(usuarioId, titulo, cuerpo, datos)`:
   - Query tokens activos.
   - Construir mensaje.
   - `sendEachForMulticast`.
   - Por cada `responses[i]` con error `registration-token-not-registered`, marcar token inválido.
4. Variables env ya definidas en 0.4 (`FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`).
5. Test unitario con SDK mockeado.

**Entregables**
- `push.adaptador.ts`.

**Criterios de aceptación**
- [ ] Con 1 token activo, envía 1 push y deja notificación en `ENVIADO`.
- [ ] Token inválido: queda `activo = false` y la notificación `FALLIDO` si era el único token.

**Referencias**
- `docs/NOTIFICACIONES.md` § PushAdaptador
- `docs/CONFIGURACION_INICIAL.md` § FCM

---

### Tarea 6.4 — Adapter WhatsApp Cloud API (Meta Graph API v20+)

**Prioridad:** 🟠 P1 · **Estimación:** 1.5d · **Depende de:** 6.2

**Objetivo**
Implementar `WhatsAppAdaptador` que envía mensajes al cliente final vía Meta Graph API, con soporte para mensajes de texto libre (ventana 24h) y plantillas pre-aprobadas (fuera de ventana).

**Alcance**
- **Incluye:**
  - `axios.post(`https://graph.facebook.com/${WHATSAPP_API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`, payload, { Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}` })`.
  - Soporte `type: 'text'` y `type: 'template'`.
  - Formateo de teléfono a E.164.
  - Detección de errores (token expirado, plantilla no aprobada).
- **Excluye:**
  - Webhooks de entrega (status callbacks) → opcional fase posterior.

**Subtareas**
1. `yarn add axios` (si no está).
2. Implementar adapter con método `enviar(telefono, titulo, cuerpo, datos?)`.
3. Parámetro opcional `plantilla` para fuera de ventana.
4. Manejo de errores HTTP y body.
5. Tests con mock de axios.

**Entregables**
- `whatsapp.adaptador.ts`.

**Criterios de aceptación**
- [ ] Envío de texto al teléfono `+50241234567` retorna 200 y la notificación queda `ENVIADO`.
- [ ] Error 401 deja la notificación en `FALLIDO` con `mensajeError`.

**Referencias**
- `docs/NOTIFICACIONES.md` § WhatsAppAdaptador
- `docs/CONFIGURACION_INICIAL.md` § WhatsApp Cloud API

---

### Tarea 6.5 — Adapter SMTP con `nodemailer` (Mailhog/Postfix/SES)

**Prioridad:** 🟠 P1 · **Estimación:** 0.5d · **Depende de:** 6.2

**Objetivo**
Implementar `EmailAdaptador` que envía correos HTML vía nodemailer con SMTP configurable (Mailhog en dev, Postfix/SES en prod).

**Alcance**
- **Incluye:**
  - `nodemailer.createTransport` con env vars.
  - Envío de HTML + texto plano fallback.
  - From configurable (`SMTP_FROM_EMAIL`, `SMTP_FROM_NAME`).
- **Excluye:**
  - Rendering MJML → opcional post-MVP.

**Subtareas**
1. `yarn add nodemailer` y `yarn add -D @types/nodemailer`.
2. Crear `email.adaptador.ts` con `transport` singleton.
3. Implementar `enviar(emailDestino, titulo, cuerpoHtml)`.
4. Test integración contra Mailhog (`http://localhost:8025` verifica que llegó).

**Entregables**
- `email.adaptador.ts`.

**Criterios de aceptación**
- [ ] En dev, un correo enviado aparece en Mailhog UI.
- [ ] Error de conexión deja la notificación `FALLIDO`.

**Referencias**
- `docs/NOTIFICACIONES.md` § EmailAdaptador

---

### Tarea 6.6 — Event handlers `@OnEvent('...')` → enviar

**Prioridad:** 🔴 P0 · **Estimación:** 1d · **Depende de:** 6.2, 6.3, 6.4, 6.5

**Objetivo**
Conectar los eventos de dominio con el envío efectivo de notificaciones, siguiendo la matriz de `NOTIFICACIONES.md § Matriz eventos × canales`.

**Descripción detallada**
Clase `PedidoEventosManejador` en `src/modulos/notificaciones/manejadores/` con múltiples métodos `@OnEvent('pedido.creado')`, `@OnEvent('pedido.estado_cambiado')`, etc. Cada handler llama a `NotificacionesServicio.enviarMulticanal` con los canales apropiados por rol. Idem `CierreEventosManejador` y `PaqueteEventosManejador`.

**Alcance**
- **Incluye:**
  - 3 clases manejador: pedido, cierre, paquete.
  - Mapeo completo de la matriz descrita en `NOTIFICACIONES.md`.
  - Uso de plantillas simples (strings) — i18n se añade en 6.8.
- **Excluye:**
  - I18n → 6.8.

**Subtareas**
1. Crear `pedido-eventos.manejador.ts` con handlers para: `pedido.creado`, `pedido.estado_cambiado`. Dentro del segundo, switch por `hacia` (estado destino) para decidir canales.
2. Crear `cierre-eventos.manejador.ts` con handlers para `cierre.enviado`, `cierre.aprobado`, `cierre.rechazado`.
3. Crear `paquete-eventos.manejador.ts` con `paquete.comprado`, `paquete.agotado`, `paquete.saldo_bajo`.
4. Registrar los 3 manejadores como providers en `NotificacionesModulo`.
5. Test e2e: mockear adapters y verificar que al emitir un evento se llama `NotificacionesServicio.enviar` con los canales correctos.

**Entregables**
- 3 archivos manejador.

**Criterios de aceptación**
- [ ] Emitir `pedido.estado_cambiado` con `hacia = ENTREGADO` dispara EMAIL+PUSH al vendedor y EMAIL al cliente.
- [ ] Emitir `cierre.enviado` dispara PUSH+EMAIL al admin.

**Referencias**
- `docs/NOTIFICACIONES.md` § Matriz eventos × canales

---

### Tarea 6.7 — Registro de DeviceToken

**Prioridad:** 🔴 P0 · **Estimación:** 0.5d · **Depende de:** 6.2

**Objetivo**
Endpoints para que la app móvil registre y desregistre su `DeviceToken` FCM.

**Alcance**
- **Incluye:**
  - `POST /api/v1/tokens-dispositivo` (upsert por `token`): `{ token, plataforma }`.
  - `DELETE /api/v1/tokens-dispositivo/:token`.
  - Al registrar, buscar si el token existe (otro usuario lo usaba) y reasignarlo.
- **Excluye:**
  - Rotación automática → manejada por app móvil (FCM refresh).

**Subtareas**
1. Implementar controlador + servicio.
2. Lógica upsert.
3. Tests e2e.

**Entregables**
- Endpoints.

**Criterios de aceptación**
- [ ] Llamar 2 veces POST con el mismo token no duplica filas.
- [ ] DELETE marca `activo = false` (no borra).

**Referencias**
- `docs/NOTIFICACIONES.md` § Registro de tokens

---

### Tarea 6.8 — Plantillas de mensajes (i18n)

**Prioridad:** 🟡 P2 · **Estimación:** 1d · **Depende de:** 6.6

**Objetivo**
Centralizar textos de notificaciones en un diccionario por idioma (inicialmente sólo `es`), con soporte para interpolación (`{{1}}`, `{{2}}`).

**Alcance**
- **Incluye:**
  - `src/modulos/notificaciones/plantillas/es.ts` con map `[evento] → { titulo, cuerpo }`.
  - Helper `renderizarPlantilla(clave, idioma, params)`.
  - Lectura de `preferredLocale` del usuario (default `es`).
- **Excluye:**
  - Otros idiomas → fácil de añadir después.
  - Plantillas WhatsApp pre-aprobadas en Meta (se listan en `NOTIFICACIONES.md` pero se pre-aprueban en Meta BM fuera del código).

**Subtareas**
1. Crear estructura de plantillas.
2. Renderizar con simple replace.
3. Usar en los manejadores de 6.6.

**Entregables**
- `plantillas/es.ts`.

**Criterios de aceptación**
- [ ] Un cambio de texto solo requiere editar `es.ts` (no los manejadores).

**Referencias**
- `docs/NOTIFICACIONES.md` § Plantillas

---

**Navegación:** [← Fase 5 — Cierre Financiero Diario](./fase-05-cierre-financiero-diario.md) · [Índice](../PLAN_DE_TAREAS_DETALLADO.md) · [Fase 7 — Panel Admin (Angular) →](./fase-07-panel-admin-angular.md)
