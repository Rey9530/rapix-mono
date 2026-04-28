# Plan de Tareas Detallado — Rapix

> Documento complementario de [`PLAN_DE_TAREAS.md`](./PLAN_DE_TAREAS.md). Mientras ese documento funciona como índice calendario (fase → tarea → prioridad → estimación), **este índice apunta a un archivo por fase** con el manual de ejecución detallado: cada tarea trae objetivo, alcance, subtareas, entregables, criterios de aceptación, dependencias y referencias cruzadas.

## 📖 Tabla de contenido

1. [Cómo leer estos documentos](#-cómo-leer-estos-documentos)
2. [Prerrequisitos globales del proyecto](#-prerrequisitos-globales-del-proyecto)
3. [Mapa de dependencias entre fases](#-mapa-de-dependencias-entre-fases)
4. [Fases (un archivo por fase)](#-fases)
5. [Roadmap Post-MVP](#-roadmap-post-mvp)
6. [Definition of Done](#-definition-of-done)
7. [Anexo A — Matriz de endpoints por fase](#-anexo-a--matriz-de-endpoints-por-fase)
8. [Anexo B — Matriz de eventos de dominio y notificaciones](#-anexo-b--matriz-de-eventos-de-dominio-y-notificaciones)

---

## 🧭 Cómo leer estos documentos

Cada archivo de fase contiene una ficha por tarea con 7 secciones fijas, en este orden:

| Sección | Para qué sirve |
|---------|----------------|
| **Objetivo** | Qué capacidad queda habilitada cuando se termina la tarea. |
| **Descripción detallada** | Cómo se implementa y cómo encaja con el resto del sistema. |
| **Alcance** | Lista explícita de qué incluye y qué excluye (evita solapamiento con tareas vecinas). |
| **Subtareas** | Pasos accionables; un dev los puede seguir sin contexto extra. |
| **Entregables** | Archivos, endpoints, migraciones, eventos, variables `.env`. |
| **Criterios de aceptación** | Checklist binaria (pasa / no pasa) para cerrar la tarea. |
| **Referencias** | Secciones relevantes en los otros `.md` del repo. |

**Leyenda de prioridad:**

| Prioridad | Significado |
|-----------|-------------|
| 🔴 **P0** | Bloqueante, imprescindible para MVP |
| 🟠 **P1** | Imprescindible para producción |
| 🟡 **P2** | Mejora importante, no crítica |
| 🟢 **P3** | Nice to have, fase posterior |

**Convenciones de nombrado** (definidas en `CLAUDE.md`):

- Todo identificador de código (clase, variable, método, archivo, carpeta, valor de enum, ruta de API, columna de BD) está en **español**, sin tildes.
- `PascalCase` para clases, modelos Prisma, enums y tipos.
- `camelCase` para variables, propiedades y métodos.
- `SCREAMING_SNAKE_CASE` para valores de enum y constantes.
- `kebab-case` para archivos, carpetas y rutas de API.

---

## 🧱 Prerrequisitos globales del proyecto

Deben estar disponibles antes de empezar la Fase 0. Si alguno falta, abrir un ticket de bloqueo.

### Herramientas locales del desarrollador

| Herramienta | Versión mínima | Notas |
|-------------|----------------|-------|
| Node.js | 24.10+ | Requerido por Prisma 7 y Angular 17+ (ver `GUIA_BACKEND.md`). |
| Yarn | 4.x (Berry) | Instalado vía `corepack enable`. Declarar `packageManager: "yarn@4.x.x"` en `package.json`. |
| Docker Desktop | 24+ | Para `docker compose` local. |
| Flutter SDK | 3.22+ | Con Dart 3.4+. |
| Angular CLI | 17+ | `yarn dlx @angular/cli`. |
| Git | 2.40+ | |
| VS Code / Cursor | último estable | Extensiones recomendadas en `.vscode/extensions.json`. |

### Accesos y cuentas externas

| Servicio | Uso | Cómo obtener |
|----------|-----|--------------|
| Mapbox | Mapas, geocoding, optimización de rutas | Cuenta en `account.mapbox.com`, crear Public Token (`pk.xxx`) con scopes `styles:read`, `fonts:read`, `datasets:read`. |
| Firebase | FCM para notificaciones push | Proyecto en `console.firebase.google.com`, descargar `google-services.json` / `GoogleService-Info.plist`, generar JSON de cuenta de servicio. |
| Meta (WhatsApp Cloud API) | Notificaciones WhatsApp al cliente | App en `developers.facebook.com` con producto WhatsApp, Business Account vinculada, plantillas pre-aprobadas. |
| SMTP | Email (dev: Mailhog; prod: Postfix / SES / Mailgun) | En dev viene en el `docker-compose`. |
| MinIO | Almacenamiento S3-compatible self-hosted | En dev viene en el `docker-compose`; en prod cluster propio o Backblaze / Wasabi / R2. |

### Stack confirmado

- **Backend:** NestJS 10+, Prisma 7 (con driver adapter `@prisma/adapter-pg`, cliente generado en `src/generated/prisma/`), PostgreSQL 15+ con PostGIS 3.x, Redis 7+, `@nestjs/event-emitter` (in-process, sin colas).
- **Admin:** Angular 17+ standalone components, Tailwind, Angular Material, NgRx Signals, Mapbox GL JS + Mapbox GL Draw, Socket.IO client.
- **Mobile:** Flutter 3.22+, Riverpod, go_router, Dio, `flutter_secure_storage`, `mapbox_maps_flutter`, `geolocator`, `flutter_background_geolocation`, `image_picker`, `signature`, `firebase_messaging`.
- **Servicios:** Mapbox, FCM, WhatsApp Cloud API (Meta Graph API v20+), SMTP (nodemailer), MinIO (`@aws-sdk/client-s3`).

---

## 🕸️ Mapa de dependencias entre fases

```
Fase 0 (infra)
   │
   ▼
Fase 1 (auth, usuarios) ──────────┐
   │                              │
   ▼                              │
Fase 2 (zonas, PostGIS) ──────┐   │
   │                          │   │
   ▼                          ▼   │
Fase 3 (pedidos + estados) ◄──┘   │
   │                              │
   ▼                              │
Fase 4 (paquetes)   Fase 5 (cierre financiero)
   │                              │
   └──────────────┬───────────────┘
                  ▼
              Fase 6 (notificaciones)
                  │
   ┌──────────────┼──────────────┐
   ▼              ▼              ▼
Fase 7 Admin  Fase 8 App Rider  Fase 9 App Cliente
                                    │
                                    ▼
                           Fase 10 (hardening + prod)
```

Las fases 7, 8 y 9 se pueden paralelizar una vez que el backend tiene los módulos que consumen. La fase 10 requiere que las apps y el admin estén desplegables.

---

## 📅 Fases

Cada fase vive en su propio archivo dentro de [`plan-detallado/`](./plan-detallado/).

| Fase | Archivo | Duración | Esfuerzo | Entregable global |
|------|---------|----------|----------|-------------------|
| **0** — Preparación | [`fase-00-preparacion.md`](./plan-detallado/fase-00-preparacion.md) | Sem 1 | 3 p-d | Entorno de desarrollo replicable (< 15 min). |
| **1** — Backend base y Autenticación | [`fase-01-backend-base-autenticacion.md`](./plan-detallado/fase-01-backend-base-autenticacion.md) | Sem 2-3 | 9 p-d | API con login, registro, usuarios, JWT. |
| **2** — Zonas, Vendedores y Repartidores | [`fase-02-zonas-vendedores-repartidores.md`](./plan-detallado/fase-02-zonas-vendedores-repartidores.md) | Sem 4 | 5 p-d | PostGIS activo, zonas + `ST_Contains`. |
| **3** — Pedidos y Máquina de Estados | [`fase-03-pedidos-maquina-estados.md`](./plan-detallado/fase-03-pedidos-maquina-estados.md) | Sem 5-6 | 11 p-d | Ciclo de vida completo del pedido end-to-end. |
| **4** — Paquetes Prepago y Pricing | [`fase-04-paquetes-prepago-pricing.md`](./plan-detallado/fase-04-paquetes-prepago-pricing.md) | Sem 7 | 4 p-d | Compra de paquetes y descuento automático. |
| **5** — Cierre Financiero Diario | [`fase-05-cierre-financiero-diario.md`](./plan-detallado/fase-05-cierre-financiero-diario.md) | Sem 8 | 5 p-d | Cierre diario funcionando end-to-end. |
| **6** — Notificaciones | [`fase-06-notificaciones.md`](./plan-detallado/fase-06-notificaciones.md) | Sem 9 | 6 p-d | Notif automáticas por PUSH, WHATSAPP, EMAIL. |
| **7** — Panel Admin (Angular) | [`fase-07-panel-admin-angular.md`](./plan-detallado/fase-07-panel-admin-angular.md) | Sem 10-11 | 14 p-d | Panel web completo para operar el negocio. |
| **8** — App Repartidor (Flutter) | [`fase-08-app-repartidor-flutter.md`](./plan-detallado/fase-08-app-repartidor-flutter.md) | Sem 12 | 10 p-d | Rider opera 100% desde la app móvil. |
| **9** — App Vendedor/Cliente (Flutter) | [`fase-09-app-vendedor-cliente-flutter.md`](./plan-detallado/fase-09-app-vendedor-cliente-flutter.md) | Sem 13 | 8 p-d | Vendedor en móvil + seguimiento público. |
| **10** — Hardening y Producción | [`fase-10-hardening-produccion.md`](./plan-detallado/fase-10-hardening-produccion.md) | Sem 14 | 10 p-d | Sistema en producción, estable y monitorizado. |

**Total:** ~85 p-d · 14 semanas calendario con 3-4 desarrolladores.

---

## 🗺️ Roadmap Post-MVP

Las siguientes features no se detallan a nivel de ficha porque su diseño y prioridad se decide tras medir el MVP en producción. Se listan aquí para mantener la trazabilidad con el plan calendario original.

| Feature | Prioridad | Justificación |
|---------|-----------|--------------|
| Chat en vivo rider-cliente | 🟡 P2 | Reduce llamadas externas |
| Pago integrado con pasarela (Stripe/local) | 🟡 P2 | Evita contra-entrega |
| Múltiples puntos de intercambio | 🟡 P2 | Escalabilidad geográfica |
| Asignación por ML (carga + histórico) | 🟢 P3 | Optimización de rutas |
| Seguimiento WebSocket en lugar de polling | 🟡 P2 | UX y reducción de costos |
| Calificación rider↔cliente | 🟡 P2 | Control de calidad |
| Programación de recolecciones recurrentes | 🟢 P3 | Fidelización |
| API pública para integraciones (e-commerce) | 🟡 P2 | Expansión |
| Soporte multi-ciudad / multi-país | 🟢 P3 | Escalabilidad |
| Geofencing y alertas de desvío de rider | 🟢 P3 | Seguridad/operación |
| OCR en fotos de comprobantes | 🟢 P3 | Automatización |

---

## ✅ Definition of Done

Una tarea se considera terminada cuando **todos** estos criterios se cumplen (además de los "Criterios de aceptación" específicos de la ficha):

- [ ] Código mergeado a `develop` vía Pull Request revisado.
- [ ] Lint y tests unitarios pasan en CI.
- [ ] Tests e2e (cuando aplican) pasan en CI.
- [ ] Cobertura de tests > 70% en módulos críticos (`autenticacion`, `pedidos`, `cierres-financieros`, `paquetes-recargados`, `notificaciones`).
- [ ] Documentación actualizada: Swagger refleja los endpoints nuevos; si el cambio es arquitectónico, se actualiza el `.md` relevante en `docs/`.
- [ ] Al menos 1 aprobación en el PR.
- [ ] Probado manualmente en entorno `dev` siguiendo los criterios de aceptación.
- [ ] Variables de entorno nuevas documentadas en `backend/.env.example` y `docs/CONFIGURACION_INICIAL.md`.
- [ ] Sin secrets commiteados.
- [ ] Sin `TODO`/`FIXME` pendientes relacionados con la tarea (si los hay, crear nueva tarea).

---

## 📎 Anexo A — Matriz de endpoints por fase

Resume en qué tarea se expone cada endpoint del sistema. Útil para verificar cobertura y dependencias.

| Endpoint | Método | Tarea | Rol |
|----------|--------|-------|-----|
| `/salud` | GET | 1.1 | Público |
| `/autenticacion/registrar` | POST | 1.3 | Público |
| `/autenticacion/iniciar-sesion` | POST | 1.3 | Público |
| `/autenticacion/refrescar` | POST | 1.3 | Público |
| `/autenticacion/cerrar-sesion` | POST | 1.3 | Autenticado |
| `/usuarios/yo` | GET/PATCH | 1.6 | Autenticado |
| `/usuarios` | GET/POST | 1.6 | ADMIN |
| `/usuarios/:id` | GET/PATCH/DELETE | 1.6 | ADMIN |
| `/usuarios/:id/estado` | PATCH | 1.6 | ADMIN |
| `/zonas` | GET | 2.2 | Autenticado |
| `/zonas` | POST | 2.2 | ADMIN |
| `/zonas/:id` | GET/PATCH/DELETE | 2.2 | ADMIN (write) |
| `/zonas/:id/repartidores` | POST | 2.2 | ADMIN |
| `/zonas/resolver` | GET | 2.3 | Autenticado |
| `/repartidores` | GET | 2.4 | ADMIN |
| `/repartidores/:id/desempeno` | GET | 2.4 | ADMIN |
| `/repartidores/:id/ubicacion` | GET | 2.4 | ADMIN |
| `/repartidores/yo/disponibilidad` | PATCH | 2.4 | REPARTIDOR |
| `/repartidores/yo/ubicacion` | POST | 2.5 | REPARTIDOR |
| `/repartidores/yo/pedidos` | GET | 3.2 | REPARTIDOR |
| `/repartidores/yo/recogidas-pendientes` | GET | 3.2 | REPARTIDOR |
| `/repartidores/yo/entregas-pendientes` | GET | 3.2 | REPARTIDOR |
| `/pedidos` | POST | 3.2 | VENDEDOR |
| `/pedidos` | GET | 3.2 | Autenticado |
| `/pedidos/:id` | GET/PATCH | 3.2 | Autenticado |
| `/pedidos/:id/cancelar` | POST | 3.2 | VENDEDOR/ADMIN |
| `/pedidos/:id/eventos` | GET | 3.2 | Autenticado |
| `/pedidos/:id/asignar` | POST | 3.9 | ADMIN |
| `/pedidos/asignar-automatico` | POST | 3.9 | ADMIN |
| `/pedidos/:id/recoger` | POST | 3.6 | REPARTIDOR |
| `/pedidos/:id/en-transito` | POST | 3.6 | REPARTIDOR |
| `/pedidos/:id/llegar-intercambio` | POST | 3.6 | REPARTIDOR |
| `/pedidos/:id/tomar-entrega` | POST | 3.6 | REPARTIDOR |
| `/pedidos/:id/entregar` | POST | 3.6 | REPARTIDOR |
| `/pedidos/:id/fallar` | POST | 3.6 | REPARTIDOR |
| `/pedidos/seguimiento/:codigo` | GET | 3.8 | Público |
| `/paquetes-recargados/disponibles` | GET | 4.2 | Autenticado |
| `/paquetes-recargados/comprar` | POST | 4.2 | VENDEDOR |
| `/paquetes-recargados/yo` | GET | 4.2 | VENDEDOR |
| `/paquetes-recargados/yo/saldo` | GET | 4.2 | VENDEDOR |
| `/paquetes-recargados` | GET | 4.2 | ADMIN |
| `/paquetes-recargados/:id` | PATCH | 4.2 | ADMIN |
| `/cierres-financieros/yo/hoy` | GET | 5.2 | REPARTIDOR |
| `/cierres-financieros` | POST | 5.3 | REPARTIDOR |
| `/cierres-financieros` | GET | 5.5 | ADMIN |
| `/cierres-financieros/:id` | GET | 5.5 | ADMIN/REPARTIDOR |
| `/cierres-financieros/:id/aprobar` | POST | 5.5 | ADMIN |
| `/cierres-financieros/:id/rechazar` | POST | 5.5 | ADMIN |
| `/notificaciones/yo` | GET | 6.2 | Autenticado |
| `/notificaciones/:id/leida` | PATCH | 6.2 | Autenticado |
| `/tokens-dispositivo` | POST | 6.7 | Autenticado |
| `/tokens-dispositivo/:token` | DELETE | 6.7 | Autenticado |
| `/mapas/geocodificar` | GET | (proxy) | Autenticado |
| `/mapas/optimizar-ruta` | POST | 8.4 (backend previo) | Autenticado |
| `/reportes/resumen-pedidos` | GET | 4.6 / 7.9 | ADMIN |
| `/reportes/consumo-paquetes` | GET | 4.6 | ADMIN |
| `/reportes/desempeno-repartidores` | GET | 7.9 | ADMIN |
| `/metrics` | GET | 10.2 | Interno |

---

## 📎 Anexo B — Matriz de eventos de dominio y notificaciones

Resume qué evento dispara qué notificación por canal a qué rol. Fuente primaria: `NOTIFICACIONES.md`. Implementado en tarea 6.6.

| Evento | Emitido en tarea | VENDEDOR | REPARTIDOR | CLIENTE | ADMIN |
|--------|-------|----------|------------|---------|-------|
| `pedido.creado` | 3.2 | EMAIL | — | WHATSAPP (link) | — |
| `pedido.estado_cambiado` (→ ASIGNADO) | 3.9 | PUSH | PUSH | — | — |
| `pedido.estado_cambiado` (→ RECOGIDO) | 3.6 | PUSH | — | WHATSAPP + PUSH | — |
| `pedido.estado_cambiado` (→ EN_TRANSITO) | 3.6 | — | — | PUSH / WHATSAPP | — |
| `pedido.estado_cambiado` (→ EN_REPARTO) | 3.6 | PUSH | — | WHATSAPP + PUSH | — |
| `pedido.estado_cambiado` (→ ENTREGADO) | 3.6 | PUSH + EMAIL | — | EMAIL | — |
| `pedido.estado_cambiado` (→ FALLIDO) | 3.6 | PUSH | — | WHATSAPP | PUSH |
| `pedido.estado_cambiado` (→ CANCELADO) | 3.2 | PUSH | PUSH (si asignado) | WHATSAPP | — |
| `cierre.enviado` | 5.4 | — | — | — | PUSH + EMAIL |
| `cierre.aprobado` | 5.5 | — | PUSH | — | — |
| `cierre.rechazado` | 5.5 | — | PUSH + EMAIL | — | — |
| `paquete.saldo_bajo` | 4.x (cron / lógica) | PUSH + EMAIL | — | — | — |
| `paquete.agotado` | 4.4 | PUSH + EMAIL | — | — | — |
| `repartidor.ubicacion_actualizada` | 2.5 | (WebSocket opcional al admin mapa) | — | (tracking público) | (admin mapa vivo) |

Handlers implementados: `PedidoEventosManejador`, `CierreEventosManejador`, `PaqueteEventosManejador` (tarea 6.6).
