# Arquitectura del Sistema

## 🏛️ Visión General

El sistema sigue una arquitectura **cliente-servidor distribuida** con un backend central (API REST) consumido por múltiples clientes (panel web y apps móviles). Se emplea un enfoque **modular monolítico** en el backend que puede evolucionar hacia microservicios en etapas posteriores.

## 🗺️ Diagrama de Arquitectura de Alto Nivel

```
┌────────────────────────────────────────────────────────────────────┐
│                         CLIENTES                                   │
├────────────────┬──────────────────┬────────────────┬───────────────┤
│  Panel Admin   │  App Riders      │  App Vendedor  │  App Cliente  │
│   (Angular)    │   (Flutter)      │   (Flutter)    │   (Flutter)   │
└────────┬───────┴────────┬─────────┴────────┬───────┴───────┬───────┘
         │                │                  │               │
         └────────────────┴─────HTTPS/WSS────┴───────────────┘
                                 │
                   ┌─────────────▼──────────────┐
                   │   API Gateway / Nginx      │
                   │   (TLS, Rate Limit, CORS)  │
                   └─────────────┬──────────────┘
                                 │
                   ┌─────────────▼──────────────┐
                   │   BACKEND NestJS           │
                   │  ┌──────────────────────┐  │
                   │  │  Módulos:            │  │
                   │  │  - Auth (JWT)        │  │
                   │  │  - Users             │  │
                   │  │  - Orders            │  │
                   │  │  - Zones             │  │
                   │  │  - Riders            │  │
                   │  │  - Financial         │  │
                   │  │  - Packages (prepago)│  │
                   │  │  - Notifications     │  │
                   │  │  - Maps (Mapbox)     │  │
                   │  └──────────────────────┘  │
                   └─────┬───────┬──────────────────┘
                         │       │
            ┌────────────▼─┐  ┌──▼──────────────────────┐
            │ PostgreSQL   │  │ Redis                   │
            │  + PostGIS   │  │ (cache + rate limiting) │
            │  + Prisma 7  │  │                         │
            └──────────────┘  └─────────────────────────┘

  Eventos de dominio (in-process, @nestjs/event-emitter — sin colas)
                         │
      ┌──────────────────┼──────────────────────┬───────────────────┐
      │                  │                      │                   │
┌─────▼──────┐   ┌───────▼────┐   ┌─────────────▼────────┐   ┌──────▼─────┐
│   Mapbox   │   │    FCM     │   │  WhatsApp Cloud API  │   │    SMTP    │
│ (rutas/geo)│   │   (Push)   │   │       (Meta)         │   │ nodemailer │
└────────────┘   └────────────┘   └──────────────────────┘   └────────────┘
                                                                   │
                                                          ┌────────▼───────┐
                                                          │     MinIO      │
                                                          │ (S3-compat,    │
                                                          │  comprobantes) │
                                                          └────────────────┘
```

## 🧱 Componentes

### 1. Backend (NestJS)
- Arquitectura **modular** con un módulo por dominio (Orders, Users, Zones, etc.).
- **Patrón Repository** mediante Prisma.
- **Controllers → Services → Repositories** (Prisma).
- **Guards** para autenticación/autorización (`JwtAuthGuard`, `RolesGuard`).
- **Interceptors** para logging, transformación y timeout.
- **Pipes** para validación con `class-validator`.
- **Eventos de dominio in-process** con `@nestjs/event-emitter` (notificaciones, recálculo de rutas, generación de reportes). _Sin colas BullMQ_ — si más adelante se requiere persistencia/retries automáticos, se podrá agregar una cola sin romper la API de eventos.

### 2. Panel Administrativo (Angular)
- SPA con **Angular 17+** (standalone components).
- **NgRx** o **Signals** para gestión de estado.
- **Angular Material** + **TailwindCSS** para UI.
- Autenticación con JWT almacenado en `localStorage` + interceptor HTTP.
- Visualización en **Mapbox GL JS**.

### 3. App Riders (Flutter)
- Cross-platform (Android/iOS).
- **Bloc / Riverpod** para estado.
- **Mapbox Maps SDK for Flutter** para navegación.
- **Background location tracking** (con permiso explícito).
- Captura de foto de comprobante y firma.

### 4. App Clientes / Vendedores (Flutter)
- Creación de pedidos con selector de ubicación en mapa.
- Consulta de estado en tiempo real (polling o WebSocket).
- Gestión de saldo prepago.

### 5. Base de Datos
- **PostgreSQL 15+** con extensión **PostGIS** (requerida) para almacenamiento de polígonos de zonas y consultas espaciales (`ST_Contains`, `ST_Intersects`).
- Prisma como ORM; migraciones versionadas en `prisma/migrations`.

### 6. Cache
- **Redis** para cache de zonas, sesiones y rate limiting (`@nestjs/throttler` con storage Redis).
- _Sin colas_: el procesamiento asíncrono se hace con `@nestjs/event-emitter` (in-process). Cualquier fallo de envío queda registrado en `notifications.status = FAILED`.

## 🔐 Seguridad

- **JWT** con rotación de `accessToken` (15 min) y `refreshToken` (7 días).
- **bcrypt** para hash de contraseñas (cost ≥ 12).
- **RBAC** (Role Based Access Control) con `@Roles()` decorator.
- **Rate limiting** por IP y por usuario (`@nestjs/throttler`).
- **Helmet** + **CORS** configurado por entorno.
- Validación estricta de DTOs (`class-validator`, `class-transformer`).
- Secretos en variables de entorno (`.env`) + **HashiCorp Vault** (o Doppler) en producción.
- Auditoría de acciones sensibles en tabla `audit_log`.

## 🌐 Comunicación en Tiempo Real

- **WebSockets** (Socket.IO) para:
  - Actualización de posición del repartidor en el mapa del admin.
  - Cambios de estado del pedido hacia vendedor/cliente.
- Canales por rol y por pedido.

## 📦 Flujo de Datos Principal (Pedido)

```
Vendedor crea pedido
   │
   ▼
[API] Valida saldo prepago o calcula costo
   │
   ▼
[DB] Inserta pedido → estado = PENDIENTE_ASIGNAR
   │
   ▼
[Geo] Determina zona de origen según coordenadas
   │
   ▼
[Asignacion] Asigna repartidor de esa zona
   │
   ▼
Notifica al Repartidor (Push)
   │
   ▼
Repartidor recoge → estado = RECOGIDO
   │
   ▼
Repartidor llega a punto de intercambio → estado = EN_PUNTO_INTERCAMBIO
   │
   ▼
Redistribución: repartidor de zona destino toma el paquete
   │
   ▼
Entrega al cliente final → estado = ENTREGADO
   │
   ▼
Notifica a Vendedor y Cliente
```

## 🧭 Estrategia de Zonas

- Cada **zona** se define por un **polígono geográfico** persistido en PostGIS como `geometry(Polygon, 4326)` (SRID WGS84).
- La tabla `zones` tiene un índice **GIST** sobre la columna `polygon` para consultas O(log n).
- Al crear un pedido, el backend ejecuta `ST_Contains(polygon, ST_SetSRID(ST_MakePoint(lng, lat), 4326))` para determinar la zona.
- La API recibe/expone el polígono como array `[{lat, lng}, ...]` (compatible con el editor Mapbox); la conversión a geometría PostGIS se hace en `ZonasServicio` con `ST_GeomFromGeoJSON`.
- Los repartidores se asignan a una o varias zonas (relación N:M).

## 💰 Cierre Financiero

Al final del día:

1. El repartidor ingresa el monto total recaudado.
2. Sube **foto del comprobante** (depósito/efectivo).
3. El sistema compara contra el **total esperado** (sumatoria de pedidos COD entregados).
4. Si hay diferencia → se registra como **discrepancia** y queda pendiente de revisión por admin.
5. Admin aprueba o rechaza el cierre.

## 🔄 Entornos

| Entorno | Descripción | Base de datos |
|---------|-------------|---------------|
| `local` | Desarrollo local con Docker | PostgreSQL local |
| `dev` | Servidor de desarrollo compartido | PostgreSQL dev |
| `staging` | Pre-producción, QA | PostgreSQL staging |
| `production` | Producción | PostgreSQL prod (HA) |

## 📈 Escalabilidad

- Backend **stateless** → se puede escalar horizontalmente tras un load balancer.
- Sesiones en Redis (no en memoria de Node).
- Si los handlers de eventos saturan el proceso principal, migrar a una cola persistente (BullMQ u otra) y separar workers en procesos independientes.
- Lecturas intensivas → réplicas de PostgreSQL.
- CDN para assets estáticos y fotos de comprobantes.

## 🔍 Observabilidad

- **Logs estructurados** con Pino.
- **Métricas** con Prometheus + Grafana.
- **APM** con Sentry (errores en frontend y backend).
- **Tracing** con OpenTelemetry (opcional fase 2).

## 🧩 Patrones Aplicados

- Repository Pattern (via Prisma).
- Dependency Injection (nativo de NestJS).
- CQRS ligero para reportes (fase 2).
- Event-Driven con eventos de dominio (`PedidoCreadoEvento`, `PedidoEntregadoEvento`).
- Saga Pattern para flujos de redistribución (fase 2).

---

> Ver también: [`BASE_DE_DATOS.md`](./BASE_DE_DATOS.md), [`API_ENDPOINTS.md`](./API_ENDPOINTS.md), [`FLUJOS_DE_TRABAJO.md`](./FLUJOS_DE_TRABAJO.md).
