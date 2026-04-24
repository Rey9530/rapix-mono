# Plan de Tareas - Cronograma de Desarrollo

## 🎯 Enfoque

Desarrollo **iterativo incremental** dividido en **fases** (milestones). Cada fase entrega valor funcional y puede ser validada. Total estimado: **12-14 semanas** con un equipo de 3-4 desarrolladores.

## 🏷️ Priorización

| Prioridad | Significado |
|-----------|-------------|
| 🔴 **P0** | Bloqueante, imprescindible para MVP |
| 🟠 **P1** | Imprescindible para producción |
| 🟡 **P2** | Mejora importante, no crítica |
| 🟢 **P3** | Nice to have, fase posterior |

---

## 📅 Fase 0 — Preparación (Semana 1)

| # | Tarea | Prioridad | Responsable | Estimación |
|---|-------|-----------|-------------|------------|
| 0.1 | Repositorio mono-repo (git) con `backend/`, `admin/`, `app-repartidor/`, `app-cliente/` | 🔴 P0 | Lead | 0.5d |
| 0.2 | Configurar CI (GitHub Actions): lint + test en PR | 🔴 P0 | Lead | 1d |
| 0.3 | Docker Compose local (PostgreSQL + Redis + Adminer) | 🔴 P0 | Backend | 0.5d |
| 0.4 | Template de `.env` y gestión de secretos | 🔴 P0 | Lead | 0.5d |
| 0.5 | Convenciones de código (ESLint, Prettier, analysis_options.yaml) | 🟠 P1 | Lead | 0.5d |
| 0.6 | Board de tareas (Jira / Linear / GitHub Projects) | 🟠 P1 | Lead | 0.5d |

**Entregable**: Entorno de desarrollo replicable en cualquier máquina en < 15 min.

---

## 📅 Fase 1 — Backend Base y Autenticación (Semanas 2-3)

| # | Tarea | Prioridad | Estimación |
|---|-------|-----------|------------|
| 1.1 | Inicializar NestJS + Prisma + PostgreSQL | 🔴 P0 | 0.5d |
| 1.2 | Schema Prisma: User, RefreshToken, AdminProfile | 🔴 P0 | 1d |
| 1.3 | Módulo `auth` (register, login, refresh, logout) | 🔴 P0 | 2d |
| 1.4 | JWT strategy + Guards (JwtAuthGuard, RolesGuard) | 🔴 P0 | 1d |
| 1.5 | Hash de contraseñas (bcrypt) y validación de DTOs | 🔴 P0 | 0.5d |
| 1.6 | Módulo `users` (CRUD para admin) | 🔴 P0 | 1.5d |
| 1.7 | Seed inicial (admin raíz, pricing rules) | 🔴 P0 | 0.5d |
| 1.8 | Tests e2e de auth | 🟠 P1 | 1d |
| 1.9 | Swagger/OpenAPI en `/docs` | 🟠 P1 | 0.5d |
| 1.10 | Rate limiting + Helmet + CORS | 🟠 P1 | 0.5d |

**Entregable**: API funcional con login, creación de usuarios y protección por roles.

---

## 📅 Fase 2 — Zonas, Vendedores y Repartidores (Semana 4)

| # | Tarea | Prioridad | Estimación |
|---|-------|-----------|------------|
| 2.0 | Migración inicial: `CREATE EXTENSION postgis` + columna `geometry(Polygon, 4326)` + índice GIST en `zones` | 🔴 P0 | 0.5d |
| 2.1 | Schema: Zona, ZonaRepartidor, PuntoIntercambio, PerfilVendedor, PerfilRepartidor | 🔴 P0 | 1d |
| 2.2 | Módulo `zones` (CRUD + asignar riders) con conversión GeoJSON ↔ PostGIS | 🔴 P0 | 1.5d |
| 2.3 | Servicio `GeoServicio.resolverZona(lat,lng)` con `ST_Contains` (PostGIS, vía `$queryRaw`) | 🔴 P0 | 1d |
| 2.4 | Módulo `riders` (consultas, ubicación, disponibilidad) | 🔴 P0 | 1d |
| 2.5 | Endpoint actualización ubicación de riders | 🔴 P0 | 0.5d |
| 2.6 | Tests unitarios e integración de `resolverZona` (con BD PostGIS) | 🟠 P1 | 0.5d |

**Entregable**: Extensión PostGIS habilitada, admin puede crear zonas (polígonos almacenados como `geometry(Polygon, 4326)`), asignar riders, y cualquier punto se resuelve a zona vía `ST_Contains`.

---

## 📅 Fase 3 — Pedidos y Máquina de Estados (Semanas 5-6)

| # | Tarea | Prioridad | Estimación |
|---|-------|-----------|------------|
| 3.1 | Schema: Pedido, EventoPedido, ComprobanteEntrega | 🔴 P0 | 0.5d |
| 3.2 | Módulo `orders`: crear, listar, consultar | 🔴 P0 | 2d |
| 3.3 | Generador de `trackingCode` | 🔴 P0 | 0.5d |
| 3.4 | Resolución automática de zona origen/destino | 🔴 P0 | 0.5d |
| 3.5 | Máquina de estados con validación de transiciones | 🔴 P0 | 1.5d |
| 3.6 | Endpoints de rider: pickup, in-transit, arrive-exchange, take-for-delivery, deliver, fail | 🔴 P0 | 2d |
| 3.7 | Upload de foto de entrega (Multer + MinIO vía `@aws-sdk/client-s3`) | 🔴 P0 | 1d |
| 3.8 | Endpoint público de tracking | 🟠 P1 | 0.5d |
| 3.9 | Asignación automática de riders por zona | 🟠 P1 | 1.5d |
| 3.10 | Tests e2e de flujo completo de pedido | 🟠 P1 | 1d |

**Entregable**: Flujo completo de un pedido end-to-end desde API.

---

## 📅 Fase 4 — Paquetes Prepago y Pricing (Semana 7)

| # | Tarea | Prioridad | Estimación |
|---|-------|-----------|------------|
| 4.1 | Schema: PaqueteRecargado, ReglaTarifa | 🔴 P0 | 0.5d |
| 4.2 | Módulo `prepaid-packages` (compra, balance, historial) | 🔴 P0 | 1.5d |
| 4.3 | Lógica de `resolveBilling` al crear pedido | 🔴 P0 | 1d |
| 4.4 | Descuento automático al crear pedido (transacción) | 🔴 P0 | 1d |
| 4.5 | Expiración de paquetes (job diario) | 🟡 P2 | 0.5d |
| 4.6 | Reporte de consumo de paquetes | 🟡 P2 | 0.5d |

**Entregable**: Vendedores pueden comprar paquetes y el sistema descuenta automáticamente.

---

## 📅 Fase 5 — Cierre Financiero Diario (Semana 8)

| # | Tarea | Prioridad | Estimación |
|---|-------|-----------|------------|
| 5.1 | Schema: CierreFinanciero, CierreFinancieroPedido | 🔴 P0 | 0.5d |
| 5.2 | Endpoint resumen del día (expected) | 🔴 P0 | 1d |
| 5.3 | Endpoint crear cierre (con foto) | 🔴 P0 | 1d |
| 5.4 | Cálculo automático de diferencia | 🔴 P0 | 0.5d |
| 5.5 | Endpoints admin: aprobar / rechazar | 🔴 P0 | 1d |
| 5.6 | Validación: un cierre por rider por día | 🔴 P0 | 0.5d |
| 5.7 | Audit log de aprobaciones | 🟠 P1 | 0.5d |

**Entregable**: Ciclo financiero diario funcionando end-to-end.

---

## 📅 Fase 6 — Notificaciones (Semana 9)

| # | Tarea | Prioridad | Estimación |
|---|-------|-----------|------------|
| 6.1 | Setup `@nestjs/event-emitter` (sin colas; eventos in-process) | 🔴 P0 | 0.25d |
| 6.2 | Módulo `notifications` con 3 canales (PUSH/WHATSAPP/EMAIL) | 🔴 P0 | 1d |
| 6.3 | Adapter FCM (push) | 🔴 P0 | 1d |
| 6.4 | Adapter WhatsApp Cloud API (Meta — Graph API v20+) | 🟠 P1 | 1.5d |
| 6.5 | Adapter SMTP con `nodemailer` (Postfix/SES/Mailhog) | 🟠 P1 | 0.5d |
| 6.6 | Event handlers (`@OnEvent('order.status_changed')` → enviar) | 🔴 P0 | 1d |
| 6.7 | Registro de DeviceToken | 🔴 P0 | 0.5d |
| 6.8 | Plantillas de mensajes (i18n) | 🟡 P2 | 1d |

**Entregable**: Notificaciones automáticas en cada cambio de estado relevante.

---

## 📅 Fase 7 — Panel Admin (Angular) (Semanas 10-11)

| # | Tarea | Prioridad | Estimación |
|---|-------|-----------|------------|
| 7.1 | Scaffold Angular + Tailwind + Material | 🔴 P0 | 0.5d |
| 7.2 | Login + guard + interceptor HTTP | 🔴 P0 | 1d |
| 7.3 | Módulo Usuarios (lista, crear, editar, suspender) | 🔴 P0 | 2d |
| 7.4 | Módulo Zonas con editor de polígonos en Mapbox | 🔴 P0 | 2.5d |
| 7.5 | Módulo Pedidos (lista, detalle, filtros, asignar) | 🔴 P0 | 2.5d |
| 7.6 | Módulo Repartidores (lista + mapa en vivo) | 🔴 P0 | 1.5d |
| 7.7 | Módulo Cierres Financieros | 🔴 P0 | 1.5d |
| 7.8 | Módulo Paquetes Prepago y Pricing | 🟠 P1 | 1d |
| 7.9 | Dashboard con KPIs | 🟠 P1 | 1.5d |
| 7.10 | Reportes exportables (CSV/XLSX) | 🟡 P2 | 1d |

**Entregable**: Panel completo para operar el negocio.

---

## 📅 Fase 8 — App Repartidor (Flutter) (Semana 12)

| # | Tarea | Prioridad | Estimación |
|---|-------|-----------|------------|
| 8.1 | Scaffold Flutter + Riverpod + go_router | 🔴 P0 | 0.5d |
| 8.2 | Login + almacenamiento seguro de tokens | 🔴 P0 | 1d |
| 8.3 | Lista de pedidos asignados (recolección/entrega) | 🔴 P0 | 1.5d |
| 8.4 | Mapa con Mapbox + ruta óptima | 🔴 P0 | 1.5d |
| 8.5 | Acciones: recoger, llegar al punto, entregar | 🔴 P0 | 1d |
| 8.6 | Captura de foto + firma | 🔴 P0 | 1d |
| 8.7 | Pantalla de cierre diario | 🔴 P0 | 1d |
| 8.8 | Ubicación en background | 🟠 P1 | 1d |
| 8.9 | Notificaciones push (FCM) | 🔴 P0 | 0.5d |
| 8.10 | Modo offline básico (cola de cambios) | 🟡 P2 | 1.5d |

**Entregable**: Repartidor opera 100% desde la app móvil.

---

## 📅 Fase 9 — App Vendedor/Cliente (Flutter) (Semana 13)

| # | Tarea | Prioridad | Estimación |
|---|-------|-----------|------------|
| 9.1 | Registro e inicio de sesión | 🔴 P0 | 1d |
| 9.2 | Crear pedido con selector de ubicación en mapa | 🔴 P0 | 1.5d |
| 9.3 | Lista de pedidos con estado | 🔴 P0 | 1d |
| 9.4 | Detalle con tracking en vivo | 🔴 P0 | 1d |
| 9.5 | Comprar paquete prepago | 🔴 P0 | 1d |
| 9.6 | Ver saldo y consumo | 🔴 P0 | 0.5d |
| 9.7 | Notificaciones push | 🟠 P1 | 0.5d |
| 9.8 | Historial / reportes propios | 🟡 P2 | 1d |

**Entregable**: Vendedor opera desde móvil; cliente final recibe link público.

---

## 📅 Fase 10 — Hardening y Producción (Semana 14)

| # | Tarea | Prioridad | Estimación |
|---|-------|-----------|------------|
| 10.1 | Pruebas de carga (k6 / Artillery) | 🟠 P1 | 1d |
| 10.2 | Monitoreo (Sentry, Prometheus) | 🟠 P1 | 1d |
| 10.3 | Logs estructurados (Pino) | 🟠 P1 | 0.5d |
| 10.4 | Backups automáticos de PostgreSQL | 🔴 P0 | 0.5d |
| 10.5 | Deploy en producción (Docker + Nginx / AWS ECS) | 🔴 P0 | 2d |
| 10.6 | SSL/HTTPS, dominio, DNS | 🔴 P0 | 0.5d |
| 10.7 | Publicación apps: Play Store / App Store | 🔴 P0 | 2d |
| 10.8 | Documentación de operación (runbooks) | 🟠 P1 | 1d |
| 10.9 | Capacitación al equipo operativo | 🟠 P1 | 1d |

**Entregable**: Sistema en producción, estable y monitorizado.

---

## 🗺️ Roadmap Post-MVP (Fase 2 del proyecto)

| Feature | Prioridad | Justificación |
|---------|-----------|--------------|
| Chat en vivo rider-cliente | 🟡 P2 | Reduce llamadas externas |
| Pago integrado con pasarela (Stripe/local) | 🟡 P2 | Evita cash on delivery |
| Múltiples puntos de intercambio | 🟡 P2 | Escalabilidad geográfica |
| Asignación por ML (carga + histórico) | 🟢 P3 | Optimización |
| Seguimiento WebSocket en lugar de polling | 🟡 P2 | UX y costos |
| Calificación rider↔cliente | 🟡 P2 | Control de calidad |
| Programación de recolecciones recurrentes | 🟢 P3 | Fidelización |
| API pública para integraciones (e-commerce) | 🟡 P2 | Expansión |
| Soporte multi-ciudad / multi-país | 🟢 P3 | Escalabilidad |

---

## 🧮 Estimación Total

| Fase | Semanas | Esfuerzo (persona-día) |
|------|---------|------------------------|
| 0. Preparación | 1 | 3 |
| 1. Backend base + Auth | 2 | 9 |
| 2. Zonas | 1 | 5 |
| 3. Pedidos | 2 | 11 |
| 4. Paquetes prepago | 1 | 4 |
| 5. Cierre financiero | 1 | 5 |
| 6. Notificaciones | 1 | 6 |
| 7. Panel Admin | 2 | 14 |
| 8. App Repartidor | 1 | 10 |
| 9. App Vendedor | 1 | 8 |
| 10. Hardening | 1 | 10 |
| **Total** | **14** | **~85 p-d** |

Con 3 desarrolladores en paralelo: **~12-14 semanas calendario**.

---

## ✅ Definition of Done (DoD)

Una tarea está "terminada" si:

- [ ] Código mergeado a `develop`.
- [ ] Lint y tests pasan en CI.
- [ ] Cobertura > 70% en módulos críticos.
- [ ] Documentación actualizada (README/Swagger).
- [ ] Revisión por pares (al menos 1 aprobación).
- [ ] Tested manualmente en `dev`.
- [ ] Variables de entorno documentadas.

---

> Ajustar plan según feedback de stakeholders tras cada fase (demo semanal recomendada).
