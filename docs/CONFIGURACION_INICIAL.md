# Configuración Inicial de Rapix

## 🎯 Objetivo

Dejar un entorno de desarrollo funcional en **menos de 30 minutos** en cualquier máquina (macOS, Linux o Windows + WSL2).

## 📋 Requisitos Previos

| Herramienta | Versión mínima | Notas |
|-------------|---------------|-------|
| Git | 2.40+ | Control de versiones |
| Node.js | 24.10+ | Para backend y Angular (cumple requisitos de Prisma 7 y Angular) |
| Yarn | 4+ (Berry) | Gestor de paquetes — se activa vía `corepack` (incluido en Node 24) |
| Docker | 24+ | Para PostgreSQL/Redis locales |
| Docker Compose | v2 | Orquestación local |
| PostGIS | 3.6.3+ | Extensión geoespacial (incluida en imagen `postgis/postgis:15-3.4`) |
| Flutter SDK | 3.22+ | Apps móviles |
| Android Studio | Latest | Emulador + SDK Android |
| Xcode (solo macOS) | 15+ | iOS |
| VS Code | Latest | Editor recomendado |

### Instalación rápida

**macOS (Homebrew)**:
```bash
brew install node@24 docker git
brew install --cask docker flutter android-studio

# Yarn 4 vía corepack (ya viene con Node 24)
corepack enable && corepack prepare yarn@stable --activate
```

**Ubuntu / WSL2**:
```bash
# Node 24
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs

# Yarn 4 (Berry) vía corepack
corepack enable && corepack prepare yarn@stable --activate

# Docker
curl -fsSL https://get.docker.com | sh

# Flutter
sudo snap install flutter --classic
```

> Verificar: `node --version` debe mostrar `v24.10.x` o superior; `yarn --version` debe mostrar `4.x.x`.

## 📁 Estructura del Monorepo

```
delivery-system/
├── backend/            # NestJS
├── admin/              # Angular
├── app-repartidor/          # Flutter
├── app-cliente/         # Flutter
├── docs/               # Esta documentación
├── docker/
│   └── docker-compose.yml
├── .editorconfig
├── .gitignore
├── .github/
│   └── workflows/
│       ├── backend-ci.yml
│       ├── admin-ci.yml
│       └── mobile-ci.yml
├── README.md
└── package.json        # scripts de monorepo (opcional)
```

## 🐳 Servicios Locales con Docker

`docker/docker-compose.yml`:

```yaml
version: '3.9'

services:
  postgres:
    image: postgis/postgis:15-3.4
    container_name: delivery_postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: delivery
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: delivery_redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  adminer:
    image: adminer
    container_name: delivery_adminer
    ports:
      - "8080:8080"
    depends_on:
      - postgres

  mailhog:
    image: mailhog/mailhog
    container_name: delivery_mailhog
    ports:
      - "1025:1025"   # SMTP
      - "8025:8025"   # UI

  minio:
    image: minio/minio:latest
    container_name: delivery_minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    ports:
      - "9000:9000"   # API S3-compatible
      - "9001:9001"   # Consola web
    volumes:
      - minio_data:/data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 10s
      timeout: 5s
      retries: 3

volumes:
  postgres_data:
  redis_data:
  minio_data:
```

Levantar:

```bash
cd docker
docker compose up -d
```

Verificar:

```bash
docker compose ps
# Adminer UI:  http://localhost:8080  (server: postgres, user: postgres, pass: postgres)
# Mailhog UI:  http://localhost:8025
```

## 🧱 Setup del Backend

```bash
cd backend
cp .env.example .env
yarn install --immutable
# Prisma 7: migrate ya NO encadena generate ni seed, hay que invocarlos explícito.
yarn prisma migrate dev --name init
yarn prisma generate
yarn prisma db seed
yarn start:dev
```

> **Prisma 7**: el `package.json` debe tener `"type": "module"` y existir `prisma.config.ts` en la raíz del backend (ver `BASE_DE_DATOS.md` y `GUIA_BACKEND.md`). El cliente generado vive en `src/generated/prisma/` (no en `node_modules`).

> **PostGIS**: la migración inicial debe habilitar la extensión añadiendo `CREATE EXTENSION IF NOT EXISTS postgis;` y `CREATE INDEX zones_polygon_gist ON zones USING GIST (polygon);` al SQL de `prisma/migrations/<timestamp>_init/migration.sql` (Prisma no las genera para tipos `Unsupported`). La imagen `postgis/postgis:15-3.4` ya trae la extensión instalada; con otra imagen de Postgres habría que instalarla manualmente.

Verificar:
- API: http://localhost:3000/api/v1/health
- Swagger: http://localhost:3000/docs
- PostGIS: `docker compose exec postgres psql -U postgres -d delivery -c "SELECT PostGIS_Version();"` debe responder con la versión.

### Crear primer admin (si no hay seed)

```bash
yarn tsx scripts/create-admin.ts \
  --email admin@delivery.com --contrasena Admin123!
```

## 🖥️ Setup del Panel Admin

```bash
cd admin
cp src/environments/environment.example.ts src/environments/environment.ts
# Editar apiUrl y mapboxToken
yarn install --immutable
yarn start   # alias de `ng serve`
```

Abrir: http://localhost:4200

## 📱 Setup de las Apps Flutter

### Configurar SDKs

```bash
flutter doctor
# Resolver todos los ítems en rojo
```

### App Repartidor

```bash
cd app-repartidor
flutter pub get
flutter pub run build_runner build --delete-conflicting-outputs

# Correr en emulador Android
flutter run --dart-define=API_URL=http://10.0.2.2:3000/api/v1 \
            --dart-define=MAPBOX_TOKEN=pk.xxxxx
```

### App Cliente

```bash
cd app-cliente
flutter pub get
flutter pub run build_runner build --delete-conflicting-outputs
flutter run --dart-define=API_URL=http://10.0.2.2:3000/api/v1 \
            --dart-define=MAPBOX_TOKEN=pk.xxxxx
```

> **Nota**: En emulador Android, `localhost` de tu máquina es `10.0.2.2`. En iOS es `localhost`. En dispositivo físico, usa la IP local de tu PC.

## 🔑 Obtener Credenciales Externas

### 1. Mapbox
1. Registrarse en https://account.mapbox.com/
2. Crear un **Public Token** (`pk.xxx`) con los scopes:
   - `styles:read`, `fonts:read`, `datasets:read`, `vision:read`
3. Copiarlo a `.env` y a las apps.

### 2. Firebase Cloud Messaging (FCM)
1. Crear proyecto en https://console.firebase.google.com/
2. Añadir app Android + iOS.
3. Descargar `google-services.json` → `android/app/`
4. Descargar `GoogleService-Info.plist` → `ios/Runner/`
5. En **Configuración del proyecto → Cuentas de servicio**, generar JSON y extraer:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_PRIVATE_KEY`
   - `FIREBASE_CLIENT_EMAIL`

### 3. WhatsApp Cloud API (Meta)
1. Crear app en https://developers.facebook.com/ → producto **WhatsApp**.
2. Vincular un **Business Account** (Meta Business Manager).
3. En **API Setup** copiar:
   - `Phone number ID` → `WHATSAPP_PHONE_NUMBER_ID`
   - `Temporary access token` (para dev) → `WHATSAPP_ACCESS_TOKEN`
   - `WhatsApp Business Account ID` → `WHATSAPP_BUSINESS_ACCOUNT_ID`
4. Para producción: generar un **System User** en Business Manager y un token permanente con permisos `whatsapp_business_messaging` + `whatsapp_business_management`.
5. Pre-aprobar las plantillas listadas en `NOTIFICACIONES.md` (Meta Business Manager → WhatsApp Manager → Plantillas de mensaje).
6. Configurar webhook de entrega/lectura (opcional para MVP) con `WHATSAPP_WEBHOOK_VERIFY_TOKEN`.

### 4. SMTP (correo)
- **Desarrollo**: ya viene listo con **Mailhog** del `docker-compose.yml` (`SMTP_HOST=localhost`, `SMTP_PORT=1025`, sin auth). UI en http://localhost:8025.
- **Producción**: cualquier proveedor SMTP — Postfix propio, AWS SES, Mailgun, etc. Configurar:
  - `SMTP_HOST`, `SMTP_PORT` (587 con STARTTLS o 465 con TLS)
  - `SMTP_SECURE=true` si puerto 465
  - `SMTP_USER` + `SMTP_PASSWORD`
  - `SMTP_FROM_EMAIL` (verificar SPF/DKIM/DMARC en el dominio)

### 5. MinIO (almacenamiento de archivos)
- **Desarrollo**: ya viene listo con el servicio `minio` en `docker-compose.yml`. Consola web en http://localhost:9001 (user/pass: `minioadmin`/`minioadmin`).
- Crear el bucket inicial:
  ```bash
  docker run --rm --network host minio/mc \
    mc alias set local http://localhost:9000 minioadmin minioadmin && \
    mc mb local/delivery-uploads && \
    mc anonymous set download local/delivery-uploads
  ```
  (o desde la consola web → Buckets → Create bucket).
- **Producción**: desplegar MinIO en cluster propio (Helm/Operator) o usar otro proveedor S3-compatible (Backblaze B2, Wasabi, R2). Cambiar `MINIO_ENDPOINT`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY` y `MINIO_PUBLIC_URL` (puede ser un CDN delante).

## 🔐 Gestión de Secretos

### Desarrollo
- Archivo `.env` en cada subproyecto (NO se commitea).
- Template `.env.example` versionado.

### Producción
- HashiCorp Vault, Doppler o secrets del proveedor (Render/Railway/Fly).
- O variables de entorno del servicio (ECS/Render/Railway).
- Rotación cada 90 días.

## 🧪 Verificación Final

Ejecutar desde la raíz del monorepo:

```bash
# Backend
cd backend && yarn test && yarn test:e2e

# Admin
cd ../admin && yarn lint && yarn test --watch=false

# Apps
cd ../app-repartidor && flutter analyze && flutter test
cd ../app-cliente && flutter analyze && flutter test
```

Todo debe pasar en verde.

## 🌱 Datos de Prueba

Ejecutar seed extendido (opcional):

```bash
cd backend
yarn tsx scripts/seed-dev.ts
```

Crea:
- 1 admin
- 3 zonas (A, B, C) con polígonos de ejemplo
- 1 punto de intercambio central
- 3 riders (uno por zona)
- 2 vendedores con saldo prepago
- 10 pedidos en diferentes estados

Credenciales de prueba:

| Rol | Email | Password |
|-----|-------|----------|
| Admin | admin@delivery.com | Admin123! |
| Vendedor 1 | shop1@delivery.com | Shop123! |
| Vendedor 2 | shop2@delivery.com | Shop123! |
| Repartidor A | repartidorA@delivery.com | Rider123! |
| Repartidor B | repartidorB@delivery.com | Rider123! |
| Repartidor C | repartidorC@delivery.com | Rider123! |

## 🧩 Extensiones Recomendadas (VS Code)

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "prisma.prisma",
    "angular.ng-template",
    "dart-code.dart-code",
    "dart-code.flutter",
    "ms-azuretools.vscode-docker",
    "eamodio.gitlens",
    "bradlc.vscode-tailwindcss"
  ]
}
```

## 🚀 Scripts del Monorepo

`package.json` raíz (Yarn workspaces):

```json
{
  "name": "delivery-monorepo",
  "private": true,
  "packageManager": "yarn@4.5.0",
  "engines": {
    "node": ">=24.10.0"
  },
  "workspaces": [
    "backend",
    "admin"
  ],
  "scripts": {
    "dev:docker":  "docker compose -f docker/docker-compose.yml up -d",
    "dev:backend": "yarn workspace backend start:dev",
    "dev:admin":   "yarn workspace admin start",
    "lint":        "yarn workspaces foreach -A run lint",
    "test":        "yarn workspaces foreach -A run test"
  }
}
```

> Las apps Flutter (`app-repartidor`, `app-cliente`) no entran en `workspaces` — se gestionan con `pub`/`flutter pub get` aparte.

## 🏗️ Pipeline CI/CD (resumen)

- **PR a `develop`**: Lint + tests.
- **Merge a `develop`**: Deploy automático a entorno `dev`.
- **Merge a `main`**: Deploy manual a `staging` → `production` con aprobación.
- **Release**: Tag `vX.Y.Z` + changelog.

---

> Una vez completada la configuración, continuar con la fase correspondiente en [`PLAN_DE_TAREAS.md`](./PLAN_DE_TAREAS.md).
