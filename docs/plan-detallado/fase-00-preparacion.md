# Fase 0 — Preparación

> 📖 [← Volver al índice](../PLAN_DE_TAREAS_DETALLADO.md) · **Fase 0 de 10**

**Duración:** Semana 1 · **Esfuerzo:** 3 p-d · **Entregable global:** entorno de desarrollo replicable en cualquier máquina en menos de 15 minutos.

---

### Tarea 0.1 — Inicializar mono-repo Git

**Prioridad:** 🔴 P0 · **Estimación:** 0.5d · **Depende de:** Ninguna

**Objetivo**
Tener un único repositorio Git con las cuatro aplicaciones del sistema (`backend/`, `admin/`, `app-repartidor/`, `app-cliente/`) y la documentación ya presente (`docs/`), listo para recibir CI/CD y contribuciones.

**Descripción detallada**
Crear el repositorio raíz con la estructura de carpetas descrita en `CONFIGURACION_INICIAL.md`. No se inicializan todavía los proyectos (eso lo hacen las tareas 1.1, 7.1, 8.1, 9.1); esta tarea solo prepara el lienzo: `.gitignore` unificado, `README.md` raíz, `.editorconfig`, archivo `package.json` raíz con scripts de conveniencia (`yarn back`, `yarn admin`, etc.), y estructura de carpetas vacías con `.gitkeep`.

**Alcance**
- **Incluye:**
  - Estructura de carpetas raíz: `backend/`, `admin/`, `app-repartidor/`, `app-cliente/`, `docs/`, `docker/`, `.github/workflows/`.
  - `.gitignore` unificado (node_modules, dist, .env, build/, .dart_tool/, etc.).
  - `.editorconfig` con 2 espacios, UTF-8, LF, trimTrailingWhitespace.
  - `README.md` raíz con resumen y apuntando a `docs/ARQUITECTURA.md`.
  - `package.json` raíz (`private: true`) con scripts monorepo.
  - `packageManager: "yarn@4.x.x"` declarado.
  - Configuración inicial de ramas Gitflow simplificado (`main`, `develop`).
- **Excluye:**
  - Inicialización de cada proyecto (NestJS, Angular, Flutter) → fases 1.1, 7.1, 8.1, 9.1.
  - `docker-compose.yml` → tarea 0.3.
  - `.env.example` → tarea 0.4.
  - Linters y formateadores por proyecto → tarea 0.5.

**Subtareas**
1. `git init` en la carpeta raíz.
2. Crear estructura de carpetas vacías con archivos `.gitkeep`.
3. Escribir `.gitignore` raíz cubriendo artefactos de Node, Angular, Flutter, Prisma, Docker y editores.
4. Escribir `.editorconfig` con reglas de estilo base.
5. Escribir `README.md` raíz con: descripción, árbol de apps, link a `docs/ARQUITECTURA.md` y `docs/CONFIGURACION_INICIAL.md`.
6. Inicializar `package.json` raíz con `private: true`, `packageManager: "yarn@4.x.x"`, scripts `back`, `admin`, `rider`, `cliente`, `docs:lint`.
7. Ejecutar `corepack enable` y `corepack prepare yarn@4.x.x --activate`.
8. Crear rama `develop` a partir de `main`.
9. Hacer commit inicial `chore: bootstrap monorepo`.
10. Crear el remoto en GitHub/GitLab y hacer `push` de `main` y `develop`.

**Entregables**
- Repositorio Git con estructura descrita.
- Archivos raíz creados: `.gitignore`, `.editorconfig`, `README.md`, `package.json`.
- Dos ramas: `main`, `develop`.
- Ningún sub-proyecto inicializado todavía (solo carpetas).

**Criterios de aceptación**
- [ ] `git clone <repo>` seguido de `ls` muestra las 4 apps y `docs/`.
- [ ] `yarn --version` reporta 4.x dentro del repo.
- [ ] `git branch` muestra `main` y `develop`.
- [ ] `.gitignore` cubre `node_modules/`, `dist/`, `.env`, `.dart_tool/`, `build/`, `.idea/`, `.vscode/` (excepto archivos compartidos).

**Referencias**
- `docs/CONFIGURACION_INICIAL.md` § Estructura del repositorio
- `CLAUDE.md` (raíz) § Convenciones y Branching

---

### Tarea 0.2 — Configurar CI en GitHub Actions

**Prioridad:** 🔴 P0 · **Estimación:** 1d · **Depende de:** 0.1

**Objetivo**
Ejecutar automáticamente `lint + build + tests unitarios` en cada Pull Request hacia `develop` y `main`, para backend, admin y ambas apps móviles.

**Descripción detallada**
Se crean tres workflows independientes (`backend-ci.yml`, `admin-ci.yml`, `mobile-ci.yml`) dentro de `.github/workflows/`. Cada workflow se activa con `paths:` filtros para correr solo cuando cambian archivos de esa app. Los jobs usan `actions/setup-node@v4` para Node 24 con caché Yarn 4, `subosito/flutter-action@v2` para Flutter 3.22, y servicios de PostgreSQL (con PostGIS) y Redis para los tests e2e del backend.

**Alcance**
- **Incluye:**
  - Workflow backend: `yarn install`, `yarn lint`, `yarn build`, `yarn test`, `yarn test:e2e`.
  - Workflow admin: `yarn install`, `yarn lint`, `yarn build:prod`, `yarn test --watch=false`.
  - Workflow Flutter (rider + cliente): `flutter pub get`, `dart analyze`, `flutter test`.
  - Cache de dependencias (Yarn 4 PnP, Pub cache).
  - Servicios `postgres:15` (con PostGIS) y `redis:7-alpine` para tests de integración del backend.
  - Status checks requeridos en reglas de rama `main` y `develop`.
- **Excluye:**
  - Despliegue automático → tarea 10.5.
  - Pruebas de carga → tarea 10.1.
  - Análisis de cobertura con servicio externo (Codecov, SonarCloud) → opcional en fase posterior.

**Subtareas**
1. Crear `.github/workflows/backend-ci.yml` con trigger `pull_request` y `paths: ['backend/**']`.
2. Definir services: `postgres` (imagen `postgis/postgis:15-3.4`), `redis`.
3. Pasos: checkout → setup-node 24 → corepack enable → yarn install --immutable → yarn lint → yarn build → yarn test → yarn prisma migrate deploy → yarn test:e2e.
4. Crear `.github/workflows/admin-ci.yml` con `paths: ['admin/**']`.
5. Crear `.github/workflows/mobile-ci.yml` con matriz por app (`app-repartidor`, `app-cliente`) y `paths: ['app-repartidor/**', 'app-cliente/**']`.
6. Configurar secrets necesarios en GitHub (`MAPBOX_TOKEN`, `FIREBASE_SA_JSON`, etc.) como placeholders — se rellenan cuando cada tarea los requiera.
7. Configurar branch protection: PRs a `main`/`develop` requieren que los 3 workflows pasen.
8. Probar abriendo un PR de prueba vacío.

**Entregables**
- `.github/workflows/backend-ci.yml`
- `.github/workflows/admin-ci.yml`
- `.github/workflows/mobile-ci.yml`
- Branch protection activa en `main` y `develop`.

**Criterios de aceptación**
- [ ] Un PR que solo cambia archivos de `backend/` dispara únicamente `backend-ci.yml`.
- [ ] Un PR con un error de lint rompe el workflow correspondiente.
- [ ] Los tests e2e del backend corren con PostGIS disponible (`SELECT PostGIS_Version()` responde).
- [ ] GitHub muestra checks como "required" antes de poder mergear.

**Referencias**
- `docs/CONFIGURACION_INICIAL.md` § CI (si existe)
- `docs/GUIA_BACKEND.md` § Testing

---

### Tarea 0.3 — Docker Compose local (Postgres+PostGIS, Redis, Adminer, Mailhog, MinIO)

**Prioridad:** 🔴 P0 · **Estimación:** 0.5d · **Depende de:** 0.1

**Objetivo**
Un comando (`docker compose up -d`) que levanta todas las dependencias externas del sistema en localhost, con datos persistentes en volúmenes, listas para que el backend se conecte sin configuración adicional.

**Descripción detallada**
Archivo `docker/docker-compose.yml` con 5 servicios: `postgres` (imagen `postgis/postgis:15-3.4`), `redis` (imagen `redis:7-alpine`), `adminer` (UI de base de datos), `mailhog` (SMTP capture en dev), `minio` (S3-compatible) más un bucket auto-creado con `mc`. Volúmenes nombrados para Postgres y MinIO, red interna, healthchecks.

**Alcance**
- **Incluye:**
  - Servicio `postgres:15` con PostGIS 3.x, usuario `postgres`, password `postgres`, DB `delivery`, puerto 5432.
  - Servicio `redis:7-alpine` en puerto 6379.
  - Servicio `adminer` (o `dpage/pgadmin4`) en puerto 8080.
  - Servicio `mailhog` SMTP 1025 + UI 8025.
  - Servicio `minio` API 9000 + consola 9001, usuario `minioadmin` / `minioadmin`.
  - Servicio `minio-setup` (one-shot `mc`) que crea el bucket `delivery-uploads` y le aplica policy `download`.
  - Healthchecks en todos los servicios principales.
- **Excluye:**
  - Backend/Admin/Apps dockerizados (eso es tarea 10.5 para producción).
  - Producción con HA → tarea 10.5.

**Subtareas**
1. Crear `docker/docker-compose.yml`.
2. Definir servicio `postgres` con imagen `postgis/postgis:15-3.4`, variables `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, volumen `postgres_data`.
3. Definir servicio `redis` con imagen `redis:7-alpine` y volumen `redis_data`.
4. Definir servicio `adminer`.
5. Definir servicio `mailhog` con puertos 1025 (SMTP) y 8025 (UI).
6. Definir servicio `minio` con imagen `minio/minio`, argumentos `server /data --console-address :9001`, volumen `minio_data`.
7. Definir servicio `minio-setup` que depende de `minio`, usa imagen `minio/mc`, ejecuta `mc alias set local http://minio:9000 minioadmin minioadmin`, `mc mb --ignore-existing local/delivery-uploads`, `mc anonymous set download local/delivery-uploads`.
8. Añadir healthchecks (`pg_isready`, `redis-cli ping`, `curl` a MinIO).
9. Documentar comandos en `docs/CONFIGURACION_INICIAL.md` (verificar que ya están).
10. Probar end-to-end: `docker compose up -d` + conectarse a cada servicio.

**Entregables**
- `docker/docker-compose.yml`
- Bucket `delivery-uploads` creado automáticamente en MinIO.
- Scripts npm/yarn raíz de conveniencia: `yarn infra:up`, `yarn infra:down`, `yarn infra:logs`.

**Criterios de aceptación**
- [ ] `docker compose up -d` levanta los 5 servicios en < 30s (primera vez excluida).
- [ ] `psql -h localhost -U postgres -d delivery -c "SELECT PostGIS_Version();"` retorna versión.
- [ ] `redis-cli ping` retorna `PONG`.
- [ ] http://localhost:8080 muestra Adminer.
- [ ] http://localhost:8025 muestra Mailhog UI.
- [ ] http://localhost:9001 muestra MinIO y el bucket `delivery-uploads` existe.
- [ ] `docker compose down` no pierde datos (volúmenes persisten).

**Referencias**
- `docs/CONFIGURACION_INICIAL.md` § Docker local
- `docs/ARQUITECTURA.md` § Infraestructura

---

### Tarea 0.4 — Template de `.env` y gestión de secretos

**Prioridad:** 🔴 P0 · **Estimación:** 0.5d · **Depende de:** 0.3

**Objetivo**
Definir y versionar un `backend/.env.example` exhaustivo que cualquier dev pueda copiar a `.env`, y establecer la política de gestión de secretos para entornos mayores.

**Descripción detallada**
El `.env.example` contiene **todas** las variables del stack (APP, DB, Redis, JWT, Mapbox, WhatsApp, SMTP, Firebase, MinIO, Throttle) con valores placeholder y comentarios explicando su uso. Se acompaña de documentación en `docs/CONFIGURACION_INICIAL.md` sobre cómo obtener los valores reales. Para `staging` / `production`, los secretos van en el gestor de secretos de la plataforma (GitHub Actions Secrets en CI, AWS SSM/Vault en prod).

**Alcance**
- **Incluye:**
  - `backend/.env.example` con todas las variables listadas en `GUIA_BACKEND.md` § Variables de entorno.
  - `admin/src/environments/environment.ts` con placeholders `apiUrl`, `mapboxToken`, `wsUrl`.
  - `app-repartidor/` y `app-cliente/`: archivo `scripts/run-dev.sh` con comando `flutter run --dart-define=...`.
  - Sección en `README.md` raíz con referencia al `.env.example`.
  - Política de secretos: nunca commitear `.env`, usar `git secrets` o similar en hook pre-commit.
- **Excluye:**
  - Gestor de secretos en producción (AWS SSM/Vault) → tarea 10.5.
  - Rotación automática de secretos → fase posterior.

**Subtareas**
1. Crear `backend/.env.example` con todas las variables, agrupadas por sección y comentadas.
2. Escribir cada variable con un valor placeholder seguro (no real): ej. `JWT_ACCESS_SECRET=change-me-access-min-32-chars`.
3. Añadir al `.gitignore` raíz: `.env`, `.env.local`, `.env.*.local`.
4. Crear `admin/src/environments/environment.ts` y `environment.prod.ts` con placeholders.
5. Crear `app-repartidor/scripts/run-dev.sh` y `app-cliente/scripts/run-dev.sh` con el comando `flutter run --dart-define=API_URL=... --dart-define=MAPBOX_TOKEN=...`.
6. Actualizar `docs/CONFIGURACION_INICIAL.md` § Variables (si ya está, verificar; si no, añadir).
7. Instalar `git-secrets` o configurar hook `pre-commit` que rechaza patrones de secrets.

**Entregables**
- `backend/.env.example`
- `admin/src/environments/environment.ts`, `environment.prod.ts`
- `app-repartidor/scripts/run-dev.sh`, `app-cliente/scripts/run-dev.sh`
- Hook `pre-commit` configurado.

**Criterios de aceptación**
- [ ] `cp backend/.env.example backend/.env && yarn start:dev` arranca sin errores de validación Joi (usando Mailhog/MinIO locales).
- [ ] `git commit` con un `.env` en el stage queda rechazado por el hook.
- [ ] `docs/CONFIGURACION_INICIAL.md` lista todas las variables con su proveedor y scope.

**Referencias**
- `docs/GUIA_BACKEND.md` § Variables de entorno
- `docs/CONFIGURACION_INICIAL.md` § Configuración de servicios externos

---

### Tarea 0.5 — Convenciones de código (ESLint, Prettier, analysis_options.yaml)

**Prioridad:** 🟠 P1 · **Estimación:** 0.5d · **Depende de:** 0.1

**Objetivo**
Estandarizar el estilo de código en los 4 sub-proyectos para que el lint sea determinístico en local y en CI.

**Descripción detallada**
Configurar ESLint + Prettier en backend y admin con la misma base (`@typescript-eslint`, reglas estrictas, Prettier integrado). Para Flutter, configurar `analysis_options.yaml` con `package:flutter_lints/flutter.yaml` + reglas adicionales. Añadir scripts `yarn lint`, `yarn lint:fix`, `yarn format` en cada sub-proyecto. Hook `lint-staged` + Husky en backend y admin para lintear archivos modificados antes de commit.

**Alcance**
- **Incluye:**
  - `backend/.eslintrc.cjs`, `backend/.prettierrc`, `backend/.prettierignore`.
  - `admin/eslint.config.js` (Angular usa `@angular-eslint`), `admin/.prettierrc`.
  - `app-repartidor/analysis_options.yaml`, `app-cliente/analysis_options.yaml`.
  - Scripts `yarn lint`, `yarn lint:fix`, `yarn format` en cada `package.json`.
  - Husky + lint-staged en backend y admin.
- **Excluye:**
  - Reglas de commits (Commitlint) → opcional fase posterior.

**Subtareas**
1. Instalar `eslint`, `@typescript-eslint/*`, `prettier`, `eslint-config-prettier`, `eslint-plugin-prettier` en backend.
2. Crear `backend/.eslintrc.cjs` con extends `plugin:@typescript-eslint/recommended` y reglas del proyecto.
3. Crear `backend/.prettierrc` con `singleQuote: true, trailingComma: 'all', printWidth: 100`.
4. En admin: `yarn ng add @angular-eslint/schematics` + `yarn add -D prettier eslint-config-prettier`.
5. Unificar `.prettierrc` en admin con el de backend.
6. En Flutter: crear `analysis_options.yaml` con `include: package:flutter_lints/flutter.yaml` y reglas extra (`prefer_const_constructors`, `prefer_single_quotes`, etc.).
7. Instalar Husky + lint-staged en raíz y configurar hook `pre-commit` para los archivos TS.
8. Añadir scripts npm en todos los `package.json`.

**Entregables**
- Archivos de config listados arriba.
- Hook `.husky/pre-commit` que corre `lint-staged`.

**Criterios de aceptación**
- [ ] `yarn lint` pasa en cada sub-proyecto sobre código vacío (scaffold).
- [ ] Un archivo con comillas dobles en backend (si la regla es simples) se auto-corrige con `yarn lint:fix`.
- [ ] `git commit` con código mal formateado es bloqueado por el hook.
- [ ] Flutter `dart analyze` reporta 0 issues en el scaffold.

**Referencias**
- `docs/GUIA_BACKEND.md` § Linting
- `docs/GUIA_ADMIN.md` § Tooling
- `docs/README.md` § Convenciones

---

### Tarea 0.6 — Board de tareas (Jira / Linear / GitHub Projects)

**Prioridad:** 🟠 P1 · **Estimación:** 0.5d · **Depende de:** Ninguna

**Objetivo**
Tener un tablero donde cargar todas las tareas de este plan detallado, con columnas estándar y ownership claro.

**Descripción detallada**
Se elige una herramienta (GitHub Projects por defecto si no hay preferencia) y se crean: un proyecto `Rapix MVP`, columnas (`Backlog`, `Ready`, `In Progress`, `In Review`, `Done`), etiquetas por prioridad (🔴P0, 🟠P1, 🟡P2) y por fase (`fase-0` … `fase-10`). Se cargan las tareas de este documento una-a-una con link al ID (ej. `Tarea 3.6`).

**Alcance**
- **Incluye:**
  - Proyecto creado y configurado.
  - Todas las ~80 tareas P0–P2 cargadas con título, prioridad, fase y estimación.
  - Asignación de responsable por fase (Lead, Backend, Frontend, Mobile).
- **Excluye:**
  - Automación avanzada (sync con CI, burndown charts) → fase posterior.

**Subtareas**
1. Crear proyecto en la herramienta elegida.
2. Crear columnas `Backlog`, `Ready`, `In Progress`, `In Review`, `Done`.
3. Crear etiquetas de prioridad y de fase.
4. Cargar cada tarea con `### Tarea X.Y` como título y link a este documento (sección).
5. Priorizar el Backlog con lo que toca en la Fase 0/1.
6. Definir ceremonia: daily stand-up, weekly demo al cierre de cada fase.

**Entregables**
- Board poblado con las tareas del plan.
- Documento interno (pinned en el canal del equipo) con responsables por fase.

**Criterios de aceptación**
- [ ] Las ~80 tareas están en el board con etiquetas correctas.
- [ ] Cada tarea del board enlaza a la sección correspondiente de `PLAN_DE_TAREAS_DETALLADO.md`.
- [ ] Hay al menos un responsable por fase asignado.

**Referencias**
- `docs/PLAN_DE_TAREAS.md` (plan calendario base)
- Este documento (ficha por tarea)

---

**Navegación:** [Índice](../PLAN_DE_TAREAS_DETALLADO.md) · [Fase 1 — Backend base y Autenticación →](./fase-01-backend-base-autenticacion.md)
