# Sistema de Delivery

Plataforma de delivery con recolección y redistribución por zonas. Coordina vendedores, repartidores, administradores y clientes.

## Stack

- **Backend**: NestJS + TypeScript, Prisma 7.x (ESM, `prisma-client`, adapter `@prisma/adapter-pg`), PostgreSQL 15 + PostGIS, JWT, Redis (cache/sesiones/rate-limit; eventos in-process con `@nestjs/event-emitter`, sin colas).
- **Frontend**: Angular (admin), Flutter (riders y clientes/vendedores).
- **Servicios**: Mapbox, FCM, WhatsApp Cloud API, SMTP (nodemailer), MinIO.

## Convenciones obligatorias

- **Idioma**: TODO en español — documentación, identificadores, enums, rutas, columnas, comentarios. Solo keywords/decoradores/APIs de frameworks en inglés (`class`, `@Injectable()`, `findUnique`).
- **Sin tildes en identificadores** (`Notificacion`, no `Notificación`). Strings de UI y comentarios sí llevan tildes.
- **Casing**: `PascalCase` (clases, modelos, enums) · `camelCase` (variables, métodos) · `SCREAMING_SNAKE_CASE` (valores enum, constantes) · `kebab-case` (rutas, archivos, carpetas).
- **Commits**: Conventional Commits en español (`feat: agregar endpoint de pedidos`).
- **Branching**: Gitflow simplificado (`main`, `develop`, `feature/*`, `hotfix/*`).
- **Glosario maestro** (inglés → español) es la fuente de verdad para traducciones de dominio: ver [`docs/README.md`](./docs/README.md).

## Roles

`ADMIN` · `VENDEDOR` · `REPARTIDOR` · `CLIENTE` (enum `RolUsuario`).

## Verificación de endpoints backend

Cuando se creen o modifiquen endpoints en [`backend/`](./backend/), es **obligatorio**:

1. Levantar el proyecto con `yarn start:dev` desde `backend/`.
2. Ejecutar peticiones HTTP reales contra los endpoints afectados (con `curl`, la UI de Swagger en `/api/docs`, o similar).
3. Verificar códigos de estado, forma de la respuesta, validaciones de DTO, guardias (JWT/roles) y los casos de error esperados.
4. No dar la tarea por terminada si el servidor no levanta o si alguna petición falla inesperadamente.

## Documentación

Toda la documentación técnica vive en [`docs/`](./docs/). Consultar [`docs/README.md`](./docs/README.md) para el detalle completo (descripción, módulos, glosario inglés→español, modelo de negocio, roles) y los demás archivos (`ARQUITECTURA.md`, `BASE_DE_DATOS.md`, `API_ENDPOINTS.md`, `MODELOS_DE_DATOS.md`, `FLUJOS_DE_TRABAJO.md`, `PLAN_DE_TAREAS.md`, guías por componente).

**Antes de escribir código nuevo**: revisar el glosario en `docs/README.md` para respetar las traducciones de modelos, enums, campos y rutas.

## Política de documentación por carpetas

Este repositorio lo consumen tanto **Claude Code** como **Gemini** (y eventualmente otros agentes de IA). Para que todos puedan leer la misma documentación, se aplica la siguiente regla:

- **Solo el archivo en la raíz del repositorio se llama `CLAUDE.md`** (este archivo). Es el punto de entrada global con convenciones, stack y enlaces.
- **Cualquier documentación dentro de una carpeta** (p. ej. `docs/`, `admin-template/`, `backend/`, `admin/`, futuros módulos, etc.) **debe llamarse `README.md`**. No crear archivos `CLAUDE.md` dentro de subcarpetas.
- Al **buscar o documentar** algo específico de una carpeta: leer/escribir el `README.md` de esa carpeta, nunca un `CLAUDE.md`.
- Motivo: `README.md` es el nombre estándar que entienden todos los agentes y herramientas (GitHub, Gemini, IDEs). `CLAUDE.md` solo sobrevive en la raíz porque es el archivo que Claude Code carga automáticamente como instrucciones del proyecto.
