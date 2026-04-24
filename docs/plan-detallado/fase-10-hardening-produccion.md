# Fase 10 — Hardening y Producción

> 📖 [← Volver al índice](../PLAN_DE_TAREAS_DETALLADO.md) · **Fase 10 de 10**

**Duración:** Semana 14 · **Esfuerzo:** 10 p-d · **Entregable global:** Sistema en producción, estable, monitorizado y documentado.

---

### Tarea 10.1 — Pruebas de carga (k6 / Artillery)

**Prioridad:** 🟠 P1 · **Estimación:** 1d · **Depende de:** 3.2, 3.6

**Objetivo**
Identificar cuellos de botella en los endpoints críticos (crear pedido, tracking público, resolver zona) bajo carga sostenida.

**Alcance**
- **Incluye:**
  - Scripts k6 en `backend/test/carga/`.
  - Escenarios: 100 rps de creación de pedidos durante 5 min, 500 rps de tracking público durante 5 min, 200 rps de resolver zona.
  - Reporte con p50/p95/p99 y tasa de error.
- **Excluye:**
  - Pruebas chaos → post-MVP.

**Subtareas**
1. Instalar k6.
2. Escribir scripts con datos semilla.
3. Correr contra entorno staging.
4. Documentar resultados y ajustes (índices, connection pooling).

**Entregables**
- Scripts de carga y reporte.

**Criterios de aceptación**
- [ ] p95 de crear pedido < 500ms.
- [ ] Tracking público p95 < 150ms.
- [ ] 0 errores 5xx en 5 min de ejecución.

**Referencias**
- `docs/ARQUITECTURA.md` § Rendimiento

---

### Tarea 10.2 — Monitoreo (Sentry, Prometheus)

**Prioridad:** 🟠 P1 · **Estimación:** 1d · **Depende de:** 10.5

**Objetivo**
Detectar errores en producción y exponer métricas estándar.

**Alcance**
- **Incluye:**
  - Sentry en backend (`@sentry/node`) y frontend (admin `@sentry/angular`, apps `sentry_flutter`).
  - Métricas Prometheus en backend (`@willsoto/nestjs-prometheus`): latencia por endpoint, conteo de errores, cola de notificaciones fallidas.
  - Endpoint `GET /metrics`.
- **Excluye:**
  - Grafana dashboards → tarea 10.8.

**Subtareas**
1. Configurar Sentry SDK en cada app.
2. Instalar nestjs-prometheus y exponer `/metrics`.
3. Instrumentar contadores clave (pedidos creados, notificaciones fallidas).

**Entregables**
- Integración Sentry.
- Endpoint `/metrics`.

**Criterios de aceptación**
- [ ] Un error no capturado llega a Sentry con contexto.
- [ ] `curl /metrics` retorna formato Prometheus válido.

**Referencias**
- `docs/ARQUITECTURA.md` § Observabilidad

---

### Tarea 10.3 — Logs estructurados (Pino)

**Prioridad:** 🟠 P1 · **Estimación:** 0.5d · **Depende de:** 1.1

**Objetivo**
Todos los logs del backend salen como JSON con campos `timestamp, level, requestId, userId, route, msg`.

**Alcance**
- **Incluye:**
  - `nestjs-pino` configurado con `pino-http`.
  - Redacción de headers sensibles (`Authorization`).
  - Correlation ID por request.
- **Excluye:**
  - Agregación centralizada (ELK / Loki) → tarea 10.5 puede preparar destino.

**Subtareas**
1. `yarn add nestjs-pino pino-http pino-pretty`.
2. Configurar LoggerModule con redact.
3. Reemplazar `console.log` existentes.

**Entregables**
- Pino configurado.

**Criterios de aceptación**
- [ ] Todo log es JSON parseable con `jq`.
- [ ] `Authorization` aparece como `[Redacted]`.

**Referencias**
- `docs/ARQUITECTURA.md` § Logs

---

### Tarea 10.4 — Backups automáticos de PostgreSQL

**Prioridad:** 🔴 P0 · **Estimación:** 0.5d · **Depende de:** 10.5

**Objetivo**
Backups diarios automatizados con retención de 7 días diarios + 4 semanales + 3 mensuales, almacenados fuera del servidor de BD.

**Alcance**
- **Incluye:**
  - Script `pg_dump` cronizado.
  - Upload a MinIO o S3 externo con encripción.
  - Prueba de restauración mensual.
- **Excluye:**
  - PITR (WAL archiving) → considerar si el RPO lo exige (default 24h).

**Subtareas**
1. Crear script `scripts/backup-db.sh` con `pg_dump -Fc`.
2. Subir a bucket `delivery-backups` con `aws s3 cp`.
3. Configurar CronJob en el entorno de prod.
4. Script de restore `scripts/restore-db.sh` documentado.

**Entregables**
- Scripts y CronJob.

**Criterios de aceptación**
- [ ] Se genera un backup diario y aparece en el bucket.
- [ ] `scripts/restore-db.sh` recupera un backup en entorno de test.

**Referencias**
- `docs/ARQUITECTURA.md` § Backups

---

### Tarea 10.5 — Deploy en producción (Docker + Nginx / AWS ECS)

**Prioridad:** 🔴 P0 · **Estimación:** 2d · **Depende de:** 0.2, 10.3

**Objetivo**
Empaquetar el backend en imagen Docker, desplegar en la plataforma elegida (AWS ECS, DigitalOcean, self-hosted con Docker Compose + Nginx), con SSL y variables de entorno gestionadas.

**Alcance**
- **Incluye:**
  - `backend/Dockerfile` multi-stage (builder + slim runtime).
  - Compose de producción con Nginx como reverse proxy.
  - Pipeline de deploy en GitHub Actions (al mergear a `main`).
  - Variables de entorno gestionadas en secrets manager de la plataforma.
  - Admin desplegado como estático en CDN (Cloudflare Pages / S3+CloudFront).
- **Excluye:**
  - Apps móviles → tarea 10.7.

**Subtareas**
1. Escribir `Dockerfile` optimizado.
2. Docker Compose de producción.
3. Pipeline CD en GitHub Actions con job `deploy` condicional a rama `main`.
4. Configurar secrets en la plataforma.
5. Probar deploy completo.

**Entregables**
- Dockerfile y compose prod.
- Pipeline CD.

**Criterios de aceptación**
- [ ] Un merge a `main` despliega backend a staging automáticamente.
- [ ] Backend en prod responde en dominio público con HTTPS.

**Referencias**
- `docs/ARQUITECTURA.md` § Despliegue
- `docs/GUIA_BACKEND.md` § Dockerfile

---

### Tarea 10.6 — SSL/HTTPS, dominio, DNS

**Prioridad:** 🔴 P0 · **Estimación:** 0.5d · **Depende de:** 10.5

**Objetivo**
Asegurar todos los dominios (`api.delivery.com`, `admin.delivery.com`, `track.delivery.com`) con HTTPS y certificados renovables.

**Alcance**
- **Incluye:**
  - Certificados Let's Encrypt (certbot) o del cloud provider.
  - HSTS habilitado.
  - Redirect `http → https`.
  - DNS A/AAAA/CNAME configurados.
- **Excluye:**
  - Preload HSTS list → opcional.

**Subtareas**
1. Registrar/configurar dominios.
2. Emitir certificados.
3. Configurar Nginx / ALB con cert.
4. Renovación automática.

**Entregables**
- Dominios HTTPS operativos.

**Criterios de aceptación**
- [ ] `ssllabs.com` rating A+ en los 3 dominios.

**Referencias**
- `docs/ARQUITECTURA.md` § Seguridad

---

### Tarea 10.7 — Publicación de apps: Play Store / App Store

**Prioridad:** 🔴 P0 · **Estimación:** 2d · **Depende de:** 8.x y 9.x completas

**Objetivo**
Publicar las 2 apps (rider y cliente) en closed beta inicialmente, luego producción.

**Alcance**
- **Incluye:**
  - Íconos, splash, política de privacidad.
  - Build release firmada (Android bundle, iOS IPA).
  - Screenshots y textos del store.
  - TestFlight + Internal Testing.
- **Excluye:**
  - ASO avanzado → post-MVP.

**Subtareas**
1. Crear cuentas de developer.
2. Firmar apps (keystore Android, cert iOS).
3. Subir primer build.
4. Configurar closed beta.

**Entregables**
- Apps en beta cerrada.

**Criterios de aceptación**
- [ ] Tester interno puede instalar desde TestFlight / Internal Testing.

**Referencias**
- `docs/GUIA_APP_RIDERS.md` § Publicación (si está)
- `docs/GUIA_APP_CLIENTES.md` § Publicación

---

### Tarea 10.8 — Documentación de operación (runbooks)

**Prioridad:** 🟠 P1 · **Estimación:** 1d · **Depende de:** 10.2, 10.5

**Objetivo**
Escribir runbooks en `docs/OPERACION.md` para los incidentes más comunes: BD caída, Redis caído, cola de notificaciones con alta tasa de fallos, disco lleno en MinIO, rotación de secretos.

**Alcance**
- **Incluye:**
  - 8-10 runbooks cortos.
  - Diagramas básicos.
  - Contactos de escalado.
- **Excluye:**
  - SLA formal → contrato de operación.

**Subtareas**
1. Identificar incidentes típicos.
2. Escribir cada runbook.
3. Revisar con el equipo.

**Entregables**
- `docs/OPERACION.md`.

**Criterios de aceptación**
- [ ] Un dev junior puede resolver "BD caída" siguiendo el runbook sin ayuda.

**Referencias**
- `docs/ARQUITECTURA.md` § Operación

---

### Tarea 10.9 — Capacitación al equipo operativo

**Prioridad:** 🟠 P1 · **Estimación:** 1d · **Depende de:** 10.8

**Objetivo**
Formar al equipo de ops / soporte en el panel admin, las apps y los runbooks.

**Alcance**
- **Incluye:**
  - 2 sesiones de 2h.
  - Material de apoyo (presentación, video).
- **Excluye:**
  - Certificaciones formales → post-MVP.

**Subtareas**
1. Preparar material.
2. Ejecutar sesiones.
3. Q&A y ajustes al admin UI si hay feedback.

**Entregables**
- Sesiones realizadas.
- Material archivado.

**Criterios de aceptación**
- [ ] Cada asistente completa un checklist de tareas prácticas sin supervisor.

**Referencias**
- `docs/GUIA_ADMIN.md`

---

**Navegación:** [← Fase 9 — App Vendedor/Cliente (Flutter)](./fase-09-app-vendedor-cliente-flutter.md) · [Índice](../PLAN_DE_TAREAS_DETALLADO.md)
