# Rapix - Documentación Técnica

## 📋 Descripción General

Rapix es una plataforma integral de gestión de delivery (entrega a domicilio) diseñada para operar bajo un modelo de **recolección y redistribución por zonas geográficas**. Coordina vendedores, riders (repartidores), administradores y clientes, optimizando rutas mediante Mapbox y gestionando pedidos, pagos y cierres financieros diarios.

## 🎯 Objetivo del Proyecto

Construir una plataforma multi-aplicación que permita:

- Gestionar el ciclo completo de un envío: desde la creación del pedido hasta la entrega final.
- Asignar riders a **zonas específicas** (A, B, C, etc.) para optimizar la recolección.
- Centralizar los paquetes en un **punto de intercambio** y redistribuirlos según la zona de destino.
- Llevar un **control financiero diario** con validación de montos recaudados.
- Ofrecer un modelo flexible de cobro: **pago por envío** o **paquetes prepago**.

## 🧩 Módulos Principales

| # | Módulo | Descripción |
|---|--------|-------------|
| 1 | **Registro de Usuarios** | Vendedores, Riders, Administradores y Clientes |
| 2 | **Gestión de Pedidos** | Alta, edición, estados, tracking geográfico |
| 3 | **Asignación por Zonas** | Zonas geográficas con riders asignados |
| 4 | **Recolección y Redistribución** | Flujo en dos etapas (recolección + entrega) |
| 5 | **Estados de Pedido** | Pendiente, Recogido, En tránsito, Entregado |
| 6 | **Cierre Financiero Diario** | Conciliación de efectivo con foto de comprobante |
| 7 | **Mapas y Rutas** | Integración con Mapbox para visualización y optimización |
| 8 | **Modelo de Cobro** | Pago individual ($3) o paquetes prepago (100 por $250) |
| 9 | **Notificaciones** | Push, WhatsApp y Email |

## 🛠️ Stack Tecnológico

### Backend
- **NestJS** (TypeScript) - Framework del servidor
- **Prisma ORM 7.x** - Acceso a base de datos type-safe (rust-free, ESM, generator `prisma-client`, driver adapter `@prisma/adapter-pg`)
- **PostgreSQL 15+ con PostGIS** - Base de datos relacional con extensión geoespacial (zonas, polígonos, consultas `ST_Contains`)
- **JWT** - Autenticación basada en tokens
- **Redis** - Cache, sesiones y rate limiting (sin colas; los eventos de dominio se procesan in-process con `@nestjs/event-emitter`)

### Frontend
- **Angular** - Panel de Administración
- **Flutter** - Apps móviles (Riders y Clientes/Vendedores)

### Infraestructura y Servicios
- **Mapbox** - Mapas, geocoding y optimización de rutas
- **Firebase Cloud Messaging (FCM)** - Notificaciones push
- **WhatsApp Cloud API (Meta)** - Mensajería al cliente final
- **SMTP (nodemailer)** - Correo electrónico (proveedor configurable: Postfix propio, AWS SES, etc.)
- **MinIO** - Almacenamiento S3-compatible self-hosted (comprobantes, fotos de entrega)

## 📚 Estructura de la Documentación

Este repositorio contiene los siguientes documentos:

| Archivo | Contenido |
|---------|-----------|
| [`ARQUITECTURA.md`](./docs/ARQUITECTURA.md) | Arquitectura general del sistema |
| [`BASE_DE_DATOS.md`](./docs/BASE_DE_DATOS.md) | Schema completo de Prisma |
| [`API_ENDPOINTS.md`](./docs/API_ENDPOINTS.md) | Referencia de endpoints REST |
| [`MODELOS_DE_DATOS.md`](./docs/MODELOS_DE_DATOS.md) | DTOs y contratos de datos |
| [`FLUJOS_DE_TRABAJO.md`](./docs/FLUJOS_DE_TRABAJO.md) | Diagramas de flujos clave |
| [`PLAN_DE_TAREAS.md`](./docs/PLAN_DE_TAREAS.md) | Plan cronológico de desarrollo |
| [`GUIA_BACKEND.md`](./docs/GUIA_BACKEND.md) | Guía de desarrollo backend (NestJS) |
| [`GUIA_ADMIN.md`](./docs/GUIA_ADMIN.md) | Guía del panel Angular |
| [`GUIA_APP_RIDERS.md`](./docs/GUIA_APP_RIDERS.md) | Guía de la app Flutter (Riders) |
| [`GUIA_APP_CLIENTES.md`](./docs/GUIA_APP_CLIENTES.md) | Guía de la app Flutter (Clientes) |
| [`CONFIGURACION_INICIAL.md`](./docs/CONFIGURACION_INICIAL.md) | Setup inicial del entorno |
| [`NOTIFICACIONES.md`](./docs/NOTIFICACIONES.md) | Sistema de notificaciones |
| [`INTEGRACION_MAPBOX.md`](./docs/INTEGRACION_MAPBOX.md) | Uso e integración de Mapbox |

## 🚀 Cómo Empezar

1. Leer [`ARQUITECTURA.md`](./docs/ARQUITECTURA.md) para entender el panorama general.
2. Seguir [`CONFIGURACION_INICIAL.md`](./docs/CONFIGURACION_INICIAL.md) para levantar el entorno.
3. Revisar [`PLAN_DE_TAREAS.md`](./docs/PLAN_DE_TAREAS.md) para organizar el desarrollo.
4. Consultar las guías específicas según el componente que se vaya a desarrollar.

## 📐 Convenciones

- **Idioma**: TODO en español — documentación, identificadores de código (clases, variables, métodos, archivos, carpetas), valores de enums, rutas de API, claves JSON, columnas de BD y comentarios. **Solo las palabras reservadas, decoradores y APIs de frameworks/librerías quedan en inglés** (`class`, `const`, `await`, `@Injectable()`, `findUnique`, `where`, etc.).
- **Sin tildes en identificadores**: usar `Notificacion`, `Configuracion`, `EstadoPedido` (no `Notificación`). Los strings, mensajes de UI y comentarios sí llevan tildes.
- **Convención de casos**:
  - `PascalCase` para clases, modelos Prisma, enums y tipos: `Pedido`, `EstadoPedido`, `CrearZonaDto`.
  - `camelCase` para variables, propiedades y métodos: `crearPedido`, `latitudActual`, `nombreCompleto`.
  - `SCREAMING_SNAKE_CASE` para valores de enum y constantes: `PENDIENTE_ASIGNACION`, `EN_TRANSITO`.
  - `kebab-case` para rutas, archivos y carpetas: `pedidos.controller.ts`, `/api/v1/pedidos`, `/cierres-financieros`.
- **Commits**: Convención [Conventional Commits](https://www.conventionalcommits.org/) con mensajes en español (`feat: agregar endpoint de pedidos`).
- **Branching**: Gitflow simplificado (`main`, `develop`, `feature/*`, `hotfix/*`).

### 📖 Glosario maestro (inglés → español)

Este glosario es la **fuente de verdad** para traducciones del dominio. Cualquier código nuevo debe seguirlo.

#### Modelos / entidades

| Inglés | Español |
|--------|---------|
| User | Usuario |
| AdminProfile | PerfilAdmin |
| SellerProfile | PerfilVendedor |
| RiderProfile | PerfilRepartidor |
| RefreshToken | TokenRefresco |
| Zone | Zona |
| RiderZone | ZonaRepartidor |
| ExchangePoint | PuntoIntercambio |
| Order | Pedido |
| OrderEvent | EventoPedido |
| PrepaidPackage | PaqueteRecargado |
| PricingRule | ReglaTarifa |
| FinancialClosure | CierreFinanciero |
| Notification | Notificacion |
| DeviceToken | TokenDispositivo |
| AuditLog | RegistroAuditoria |

#### Enums y valores

| Inglés | Español |
|--------|---------|
| `UserRole` { ADMIN, SELLER, RIDER, CUSTOMER } | `RolUsuario` { ADMIN, VENDEDOR, REPARTIDOR, CLIENTE } |
| `UserStatus` { PENDING_VERIFICATION, ACTIVE, SUSPENDED } | `EstadoUsuario` { PENDIENTE_VERIFICACION, ACTIVO, SUSPENDIDO } |
| `OrderStatus` { PENDING_ASSIGNMENT, ASSIGNED, PICKED_UP, IN_TRANSIT, AT_EXCHANGE_POINT, OUT_FOR_DELIVERY, DELIVERED, CANCELLED, FAILED, RETURNED } | `EstadoPedido` { PENDIENTE_ASIGNACION, ASIGNADO, RECOGIDO, EN_TRANSITO, EN_PUNTO_INTERCAMBIO, EN_REPARTO, ENTREGADO, CANCELADO, FALLIDO, DEVUELTO } |
| `BillingMode` { PER_SHIPMENT, PACKAGE } | `ModoFacturacion` { POR_ENVIO, PAQUETE } |
| `FinancialClosureStatus` { PENDING_REVIEW, APPROVED, REJECTED, WITH_DISCREPANCY } | `EstadoCierreFinanciero` { PENDIENTE_REVISION, APROBADO, RECHAZADO, CON_DISCREPANCIA } |
| `NotificationChannel` { PUSH, WHATSAPP, EMAIL } | `CanalNotificacion` { PUSH, WHATSAPP, EMAIL } |
| `NotificationStatus` { PENDING, SENT, FAILED, DELIVERED } | `EstadoNotificacion` { PENDIENTE, ENVIADO, FALLIDO, ENTREGADO } |

#### Campos comunes

| Inglés | Español |
|--------|---------|
| `createdAt`, `updatedAt` | `creadoEn`, `actualizadoEn` |
| `phone`, `passwordHash`, `fullName` | `telefono`, `hashContrasena`, `nombreCompleto` |
| `role`, `status`, `isActive` | `rol`, `estado`, `activo` |
| `userId`, `expiresAt`, `code`, `name`, `description` | `usuarioId`, `expiraEn`, `codigo`, `nombre`, `descripcion` |
| `polygon`, `latitude`, `longitude`, `address` | `poligono`, `latitud`, `longitud`, `direccion` |
| `exchangePointId`, `isPrimary`, `vehicleType`, `rating`, `isAvailable` | `puntoIntercambioId`, `esPrimaria`, `tipoVehiculo`, `calificacion`, `disponible` |
| `pickupRiderId`, `deliveryRiderId`, `originZoneId`, `destinationZoneId` | `repartidorRecogidaId`, `repartidorEntregaId`, `zonaOrigenId`, `zonaDestinoId` |
| `trackingCode`, `codAmount`, `shippingCost`, `billingMode` | `codigoSeguimiento`, `montoContraEntrega`, `costoEnvio`, `modoFacturacion` |
| `prepaidPackageId`, `pricingRuleId`, `packageSize`, `packagePrice` | `paqueteRecargadoId`, `reglaTarifaId`, `tamanoPaquete`, `precioPaquete` |
| `pricePerShipment`, `remainingShipments`, `purchasedAt` | `precioPorEnvio`, `enviosRestantes`, `compradoEn` |
| `closureDate`, `expectedAmount`, `reportedAmount`, `receiptUrl` | `fechaCierre`, `montoEsperado`, `montoReportado`, `urlComprobante` |
| `channel`, `title`, `body`, `payload`, `sentAt`, `errorMsg` | `canal`, `titulo`, `cuerpo`, `datos`, `enviadoEn`, `mensajeError` |
| `entityType`, `entityId`, `platform`, `preferredLocale` | `tipoEntidad`, `entidadId`, `plataforma`, `idiomaPreferido` |

#### Rutas de API

| Inglés | Español |
|--------|---------|
| `/auth/{login,register,refresh,logout}` | `/autenticacion/{iniciar-sesion,registrar,refrescar,cerrar-sesion}` |
| `/users` | `/usuarios` |
| `/zones` | `/zonas` |
| `/orders/{pickup,in-transit,arrive-exchange,take-for-delivery,deliver,fail}` | `/pedidos/{recoger,en-transito,llegar-intercambio,tomar-entrega,entregar,fallar}` |
| `/riders` | `/repartidores` |
| `/prepaid-packages` | `/paquetes-recargados` |
| `/financial-closures` | `/cierres-financieros` |
| `/notifications` | `/notificaciones` |
| `/maps` | `/mapas` |
| `/uploads` | `/archivos` |
| `/reports` | `/reportes` |

## 📦 Modelo de Negocio

### Tarifa por envío
- **$3 USD** por paquete individual.

### Paquetes prepago
- **100 envíos por $250 USD** (ejemplo, configurable).
- Descuento automático del saldo del vendedor al crear un pedido.
- Al agotarse el paquete, se factura por pedido individual o se requiere recarga.

## 🔐 Roles del Sistema

| Rol (`RolUsuario`) | Capacidades |
|-----|-------------|
| `ADMIN` | Gestión total: usuarios, zonas, tarifas, reportes, cierres. |
| `VENDEDOR` | Crea pedidos, consulta estado, gestiona su saldo prepago. |
| `REPARTIDOR` | Recoge y entrega paquetes, cambia estados, cierra caja diaria. |
| `CLIENTE` | Recibe notificaciones del estado del pedido. |

## 📄 Licencia

Documentación propietaria. Todos los derechos reservados.

---

> **Nota**: Esta documentación está pensada para ser consumida directamente por herramientas como **Claude Code** u otros agentes de IA durante el desarrollo guiado. Cada documento es autocontenido y referencia a los demás cuando es necesario.
