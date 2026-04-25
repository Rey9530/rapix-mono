# Fase 1 — Backend base y Autenticación

> 📖 [← Volver al índice](../PLAN_DE_TAREAS_DETALLADO.md) · **Fase 1 de 10**

**Duración:** Semanas 2-3 · **Esfuerzo:** 9 p-d · **Entregable global:** API funcional con login, registro, creación de usuarios, roles, y protección por JWT.

---

### Tarea 1.1 — Inicializar NestJS + Prisma 7 + PostgreSQL

**Prioridad:** 🔴 P0 · **Estimación:** 0.5d · **Depende de:** 0.3, 0.4, 0.5

**Objetivo**
Crear la aplicación NestJS dentro de `backend/`, con Prisma 7 configurado (generator `prisma-client`, adapter `@prisma/adapter-pg`), conexión a la base de datos local en `docker-compose`, y health endpoint `/salud` respondiendo 200.

**Descripción detallada**
Se ejecuta `yarn create nest backend` (o equivalente manual), se configura `"type": "module"` en `package.json`, se instala Prisma 7 con sus dependencias (`prisma`, `@prisma/adapter-pg`, `pg`, `dotenv`), se crea `prisma/schema.prisma` con `generator client { provider = "prisma-client"; output = "../src/generated/prisma" }`, se define `datasource db { provider = "postgresql"; url = env("DATABASE_URL") }`, y se crea `src/prisma/prisma.servicio.ts` que expone un `PrismaClient` con driver adapter.

**Alcance**
- **Incluye:**
  - Proyecto NestJS ESM en `backend/`.
  - `prisma/schema.prisma` vacío (solo generator + datasource).
  - `PrismaServicio` + `PrismaModulo` globales.
  - `ConfigModule` con validación Joi (`src/config/esquema-validacion.ts`).
  - `HealthModule` con endpoint `GET /api/v1/salud` que retorna `{ estado: 'ok', tiempoActividad, bd, redis }`.
  - Configuración `prisma.config.ts` en la raíz de `backend/` (requerido por Prisma 7).
  - Script `yarn start:dev` funcional.
- **Excluye:**
  - Modelos Prisma de dominio → tarea 1.2.
  - Autenticación → tareas 1.3, 1.4.
  - Swagger → tarea 1.9.
  - Rate limiting / Helmet → tarea 1.10.

**Subtareas**
1. En `backend/`, ejecutar `yarn create nest . --package-manager=yarn --strict`.
2. Añadir `"type": "module"` en `package.json`.
3. Instalar Prisma 7: `yarn add prisma @prisma/adapter-pg pg dotenv` y `yarn add -D prisma`.
4. Ejecutar `yarn prisma init` y adaptar `prisma/schema.prisma` al generator moderno.
5. Crear `backend/prisma.config.ts` (raíz) — Prisma 7 lo requiere para TypeScript config.
6. Crear `src/prisma/prisma.servicio.ts` que instancia `PrismaClient` con `adapter: new PrismaPg(...)` y `onModuleInit`/`onModuleDestroy`.
7. Crear `src/prisma/prisma.modulo.ts` `@Global()` que exporta `PrismaServicio`.
8. Crear `src/config/esquema-validacion.ts` (Joi) con las variables críticas (DATABASE_URL, NODE_ENV, PORT).
9. Registrar `ConfigModule.forRoot({ isGlobal: true, validationSchema })` en `AppModule`.
10. Crear `src/modulos/salud/salud.controlador.ts` con `GET /salud` que haga `SELECT 1` en Prisma y `PING` en Redis (Redis lo añadimos en tarea 1.10; por ahora solo BD).
11. Configurar `main.ts` con `app.setGlobalPrefix('api/v1')` y lectura de `PORT` desde config.
12. Ejecutar `yarn start:dev` y verificar que levanta en http://localhost:3000/api/v1/salud.

**Entregables**
- `backend/package.json`, `backend/tsconfig.json`, `backend/nest-cli.json`.
- `backend/prisma/schema.prisma`, `backend/prisma.config.ts`.
- `backend/src/main.ts`, `backend/src/app.module.ts`.
- `backend/src/prisma/{prisma.servicio.ts, prisma.modulo.ts}`.
- `backend/src/config/esquema-validacion.ts`.
- `backend/src/modulos/salud/salud.controlador.ts`.
- Nuevas variables `.env`: `DATABASE_URL`, `NODE_ENV`, `PORT`, `API_PREFIX`.

**Criterios de aceptación**
- [ ] `yarn start:dev` levanta sin errores con `DATABASE_URL` válida.
- [ ] `curl http://localhost:3000/api/v1/salud` retorna 200 y `estado: "ok"`.
- [ ] `yarn prisma generate` crea el cliente en `src/generated/prisma/`.
- [ ] Sin `DATABASE_URL` en `.env`, el arranque falla con mensaje Joi claro.

**Referencias**
- `docs/GUIA_BACKEND.md` § Estructura, Prisma 7, Configuración
- `docs/CONFIGURACION_INICIAL.md` § Backend

---

### Tarea 1.2 — Schema Prisma: Usuario, TokenRefresco, PerfilAdmin

**Prioridad:** 🔴 P0 · **Estimación:** 1d · **Depende de:** 1.1

**Objetivo**
Modelar las tres entidades base de identidad y persistirlas en la BD mediante la primera migración Prisma, incluyendo los enums `RolUsuario` y `EstadoUsuario`.

**Descripción detallada**
Se añade al `schema.prisma` los modelos `Usuario`, `TokenRefresco`, `PerfilAdmin` y los enums asociados, siguiendo el glosario de `docs/README.md` y la especificación detallada de `BASE_DE_DATOS.md`. Se mapean los nombres de tabla a snake_case en español (`usuarios`, `tokens_refresco`, `perfiles_admin`). La migración también habilita las extensiones PostgreSQL `postgis` y `uuid-ossp` (adelantamos PostGIS aquí para no tener que crear una migración extra luego — aunque las tablas que la usan vienen en Fase 2).

**Alcance**
- **Incluye:**
  - Enums: `RolUsuario { ADMIN, VENDEDOR, REPARTIDOR, CLIENTE }`, `EstadoUsuario { ACTIVO, INACTIVO, SUSPENDIDO, PENDIENTE_VERIFICACION }`.
  - Modelo `Usuario` con campos: `id, email (unique), telefono (unique), hashContrasena, nombreCompleto, rol, estado, urlAvatar?, ultimoIngresoEn?, creadoEn, actualizadoEn`. Índice `(rol, estado)`.
  - Modelo `TokenRefresco` con campos: `id, usuarioId (FK CASCADE), token (unique), expiraEn, revocadoEn?, userAgent, direccionIp, creadoEn`.
  - Modelo `PerfilAdmin` con campos: `id, usuarioId (unique FK CASCADE), permisos (String[])`.
  - Migración `init` con SQL manual para `CREATE EXTENSION IF NOT EXISTS postgis` y `uuid-ossp`.
- **Excluye:**
  - Perfiles de Vendedor / Repartidor → tarea 2.1.
  - Zonas, puntos intercambio → tarea 2.1.
  - Pedidos y todo el resto → fases posteriores.

**Subtareas**
1. Añadir enums `RolUsuario` y `EstadoUsuario` al `schema.prisma`.
2. Añadir modelo `Usuario` con `@@map("usuarios")`, `@@index([rol, estado])`.
3. Añadir modelo `TokenRefresco` con `@@map("tokens_refresco")`, `@@index([usuarioId])`, relación `Usuario @relation(..., onDelete: Cascade)`.
4. Añadir modelo `PerfilAdmin` con `@@map("perfiles_admin")`.
5. Ejecutar `yarn prisma migrate dev --name init` para generar el SQL.
6. Abrir el SQL generado y **añadir manualmente** al inicio: `CREATE EXTENSION IF NOT EXISTS postgis;` y `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`.
7. Ejecutar `yarn prisma migrate reset` para aplicar la migración completa.
8. Ejecutar `yarn prisma generate` para actualizar el cliente.
9. Verificar con Adminer que las 3 tablas existen y la extensión PostGIS está habilitada (`SELECT PostGIS_Version();`).

**Entregables**
- `backend/prisma/schema.prisma` (sección Usuarios/Auth).
- `backend/prisma/migrations/<timestamp>_init/migration.sql`.
- Cliente Prisma regenerado en `src/generated/prisma/`.

**Criterios de aceptación**
- [ ] `yarn prisma migrate deploy` sobre una BD limpia crea las 3 tablas sin errores.
- [ ] `SELECT * FROM usuarios LIMIT 1;` retorna 0 filas (pero la tabla existe).
- [ ] `SELECT PostGIS_Version();` retorna versión no-nula.
- [ ] El tipo `Usuario` es importable desde `src/generated/prisma` en TypeScript.

**Referencias**
- `docs/BASE_DE_DATOS.md` § Usuarios y Autenticación
- `docs/README.md` § Glosario maestro

---

### Tarea 1.3 — Módulo `autenticacion`: registrar, iniciar sesión, refrescar, cerrar sesión

**Prioridad:** 🔴 P0 · **Estimación:** 2d · **Depende de:** 1.2, 1.5

**Objetivo**
Exponer los 4 endpoints base de autenticación que emiten y gestionan pares `tokenAcceso` (JWT 15m) + `tokenRefresco` (7d), con persistencia del refresh en BD para poder revocar.

**Descripción detallada**
El módulo vive en `src/modulos/autenticacion/`. El servicio usa `JwtService` para firmar con `JWT_ACCESS_SECRET` y `JWT_REFRESH_SECRET` distintos, persiste cada `TokenRefresco` en BD al emitir y lo marca `revocadoEn` al cerrar sesión o refrescar (rotación). Los endpoints son públicos (decorados con `@Publico()`, creado en 1.4) y no requieren guard.

**Alcance**
- **Incluye:**
  - `POST /api/v1/autenticacion/registrar` (solo `VENDEDOR` y `CLIENTE`; repartidores y admin los crea un admin).
  - `POST /api/v1/autenticacion/iniciar-sesion`.
  - `POST /api/v1/autenticacion/refrescar`.
  - `POST /api/v1/autenticacion/cerrar-sesion` (requiere `tokenAcceso` válido).
  - DTOs: `RegistrarDto`, `IniciarSesionDto`, `RefrescarDto`, `RespuestaAutenticacionDto`, `UsuarioPublicoDto`.
  - Creación del `PerfilVendedor` en el mismo flujo si `rol = VENDEDOR` (solo con campos mínimos: `nombreNegocio`, `direccion?`, `latitud?`, `longitud?`).
- **Excluye:**
  - Olvidé mi contraseña / restablecer → puede dejarse para tarea posterior (no está en plan original como P0).
  - Verificación de email / OTP → fuera de MVP.
  - Creación de admin y repartidor desde endpoint de registro → tarea 1.6.

**Subtareas**
1. Crear `src/modulos/autenticacion/autenticacion.modulo.ts` que importa `JwtModule.registerAsync` con `JWT_ACCESS_SECRET`.
2. Crear DTOs con `class-validator`: `RegistrarDto` (email, telefono, contrasena, nombreCompleto, rol enum `VENDEDOR|CLIENTE`, nombreNegocio?, direccion?, latitud?, longitud?), `IniciarSesionDto`, `RefrescarDto`.
3. Crear `autenticacion.servicio.ts` con métodos: `registrar(dto)`, `iniciarSesion(email, contrasena)`, `refrescar(tokenRefresco)`, `cerrarSesion(usuarioId, tokenRefresco)`.
4. Implementar `registrar`: verifica email/telefono únicos, hashea contraseña con bcrypt cost 12, crea `Usuario` + `PerfilVendedor` si aplica, emite par de tokens, persiste `TokenRefresco`.
5. Implementar `iniciarSesion`: busca usuario por email, compara bcrypt, valida `estado ∈ {ACTIVO, PENDIENTE_VERIFICACION}`, emite tokens y persiste refresh.
6. Implementar `refrescar`: verifica firma del refresh, busca `TokenRefresco` en BD, valida `revocadoEn IS NULL` y `expiraEn > now()`, rota: marca revocado y emite nuevo par.
7. Implementar `cerrarSesion`: marca `revocadoEn = now()` del token actual.
8. Crear `autenticacion.controlador.ts` con los 4 endpoints + `@ApiTags('Autenticacion')`.
9. Marcar los 3 primeros con `@Publico()` (decorator de tarea 1.4); `cerrarSesion` usa `JwtAutenticacionGuardia`.
10. Añadir tests unitarios del servicio (mockeando PrismaServicio y JwtService).

**Entregables**
- Directorio `src/modulos/autenticacion/` completo con módulo, controlador, servicio y `dto/`.
- 4 endpoints expuestos.
- Variables `.env`: `JWT_ACCESS_SECRET`, `JWT_ACCESS_EXPIRES=15m`, `JWT_REFRESH_SECRET`, `JWT_REFRESH_EXPIRES=7d`.

**Criterios de aceptación**
- [ ] `POST /autenticacion/registrar` con body válido devuelve 201 con `{ usuario, tokenAcceso, tokenRefresco }` y crea fila en `usuarios` + `tokens_refresco` (+ `perfiles_vendedor` si rol VENDEDOR).
- [ ] Registrar con email duplicado retorna 409.
- [ ] `POST /autenticacion/iniciar-sesion` con contraseña inválida retorna 401.
- [ ] `POST /autenticacion/refrescar` con token revocado retorna 401.
- [ ] Un refresh exitoso deja el antiguo como `revocadoEn NOT NULL`.
- [ ] `POST /autenticacion/cerrar-sesion` marca el refresh como revocado.

**Referencias**
- `docs/API_ENDPOINTS.md` § `/autenticacion`
- `docs/GUIA_BACKEND.md` § Autenticación
- `docs/MODELOS_DE_DATOS.md` § DTOs de autenticación

---

### Tarea 1.4 — JWT strategy + Guards (`JwtAutenticacionGuardia`, `RolesGuardia`)

**Prioridad:** 🔴 P0 · **Estimación:** 1d · **Depende de:** 1.3

**Objetivo**
Proteger endpoints con JWT y permitir RBAC declarativo con `@Roles(RolUsuario.ADMIN)`.

**Descripción detallada**
Se crean dos guards: `JwtAutenticacionGuardia` (extiende `AuthGuard('jwt')` de Passport con detección de decorador `@Publico()`) y `RolesGuardia` (lee metadata `roles` del handler y la contrasta con el `rol` del usuario autenticado). Se crean los decoradores auxiliares `@Roles(...)`, `@UsuarioActual()`, `@Publico()`. La estrategia JWT (`jwt.estrategia.ts`) decodifica el access token y carga el usuario desde BD para adjuntarlo a `request.user`.

**Alcance**
- **Incluye:**
  - `jwt.estrategia.ts` (passport-jwt).
  - Guards: `JwtAutenticacionGuardia`, `RolesGuardia`.
  - Decoradores: `@Roles(...roles)`, `@UsuarioActual()`, `@Publico()`.
  - Registro global de `JwtAutenticacionGuardia` en `AppModule` como `APP_GUARD`.
- **Excluye:**
  - Estrategia de refresh separada (`jwt-refresco.estrategia.ts`) — no es necesaria si el endpoint `/refrescar` valida manualmente el refresh token. Opcional; si se decide implementar, se hace aquí.

**Subtareas**
1. Crear `src/comun/decoradores/publico.decorador.ts` con `SetMetadata('esPublico', true)`.
2. Crear `src/comun/decoradores/roles.decorador.ts` con `SetMetadata('roles', roles)`.
3. Crear `src/comun/decoradores/usuario-actual.decorador.ts` (`createParamDecorator` que extrae `request.user`).
4. Crear `src/modulos/autenticacion/estrategias/jwt.estrategia.ts` extendiendo `PassportStrategy(Strategy, 'jwt')`. En `validate(payload)` busca el usuario en BD y lo retorna.
5. Crear `src/comun/guardias/jwt-autenticacion.guardia.ts` extendiendo `AuthGuard('jwt')` con override `canActivate` que lee `@Publico()` via `Reflector`.
6. Crear `src/comun/guardias/roles.guardia.ts` que lee `@Roles()` via `Reflector` y retorna `request.user.rol in rolesRequeridos`.
7. Registrar `JwtAutenticacionGuardia` y `RolesGuardia` como `APP_GUARD` globales en `AppModule`.
8. Probar: un endpoint nuevo sin `@Publico()` requiere Bearer token; con `@Roles(ADMIN)` rechaza a un VENDEDOR con 403.

**Entregables**
- `src/comun/decoradores/{publico,roles,usuario-actual}.decorador.ts`.
- `src/comun/guardias/{jwt-autenticacion,roles}.guardia.ts`.
- `src/modulos/autenticacion/estrategias/jwt.estrategia.ts`.
- Registro global en `app.module.ts`.

**Criterios de aceptación**
- [ ] Endpoint sin `@Publico()` y sin header `Authorization` retorna 401.
- [ ] Endpoint con `@Roles(ADMIN)` accedido como VENDEDOR retorna 403.
- [ ] Endpoint con `@Publico()` responde 200 sin token.
- [ ] `@UsuarioActual()` en un controller inyecta el usuario autenticado con tipo `Usuario`.

**Referencias**
- `docs/GUIA_BACKEND.md` § Guards y Decoradores
- `docs/ARQUITECTURA.md` § Seguridad

---

### Tarea 1.5 — Hash de contraseñas (bcrypt) y validación global de DTOs

**Prioridad:** 🔴 P0 · **Estimación:** 0.5d · **Depende de:** 1.1

**Objetivo**
Preparar la base de seguridad transversal: bcrypt para contraseñas y `ValidationPipe` global con `class-validator`/`class-transformer`.

**Descripción detallada**
Se instala `bcrypt`, se crea un helper `src/comun/utiles/contrasena.ts` con `hashear(valor)` y `comparar(valor, hash)` usando cost 12. Se configura `ValidationPipe` global en `main.ts` con `whitelist: true, forbidNonWhitelisted: true, transform: true`. Las reglas de complejidad de contraseña (8-64 caracteres, mayúscula + número + símbolo) se encapsulan en un decorador `@EsContrasenaFuerte()` reutilizable.

**Alcance**
- **Incluye:**
  - Dependencia `bcrypt` + tipos.
  - Helpers `hashearContrasena` y `compararContrasena`.
  - `ValidationPipe` global.
  - Decorador `@EsContrasenaFuerte()`.
- **Excluye:**
  - Políticas de contraseña más avanzadas (historial, expiración) → fase posterior.

**Subtareas**
1. `yarn add bcrypt` y `yarn add -D @types/bcrypt`.
2. Crear `src/comun/utiles/contrasena.ts` con `export async function hashearContrasena(plano: string): Promise<string>` (cost 12) y `compararContrasena`.
3. En `main.ts`, añadir `app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))`.
4. Crear `src/comun/validadores/es-contrasena-fuerte.decorador.ts` con `@ValidatorConstraint` (regex: al menos una mayúscula, un número, un símbolo; longitud 8-64).
5. Usar `@EsContrasenaFuerte()` en `RegistrarDto.contrasena`.

**Entregables**
- `src/comun/utiles/contrasena.ts`.
- `src/comun/validadores/es-contrasena-fuerte.decorador.ts`.
- Pipe global registrado en `main.ts`.

**Criterios de aceptación**
- [ ] `hashearContrasena("test")` produce un hash con prefijo `$2b$12$`.
- [ ] Un DTO con campo extra no declarado es rechazado por `ValidationPipe`.
- [ ] Una contraseña "abc123" (sin mayúscula ni símbolo) es rechazada por `@EsContrasenaFuerte()`.

**Referencias**
- `docs/GUIA_BACKEND.md` § Seguridad, Validación

---

### Tarea 1.6 — Módulo `usuarios` (CRUD para admin)

**Prioridad:** 🔴 P0 · **Estimación:** 1.5d · **Depende de:** 1.4

**Objetivo**
Permitir al admin listar, crear, editar, consultar y suspender usuarios de cualquier rol, con especial foco en la creación de repartidores (que no se crean por el endpoint público de registro).

**Descripción detallada**
El módulo `src/modulos/usuarios/` expone los endpoints listados en `API_ENDPOINTS.md § /usuarios`. La creación de repartidor acepta `tipoVehiculo`, `placa`, `documentoIdentidad`, `telefonoEmergencia?`, `zonaIds[]`, `zonaPrimariaId?` y crea `Usuario` + `PerfilRepartidor` + relaciones `ZonaRepartidor` en transacción (el modelo `PerfilRepartidor` y `ZonaRepartidor` se crean en Fase 2; esta tarea solo implementa el CRUD básico de `Usuario` + `PerfilAdmin`, y la creación completa de repartidor se hace al cerrar Fase 2 o como ajuste).

**Alcance**
- **Incluye:**
  - `GET /usuarios/yo` y `PATCH /usuarios/yo` (cualquier usuario autenticado).
  - `GET /usuarios?rol=&estado=&busqueda=&pagina=&limite=` (solo ADMIN, paginado).
  - `POST /usuarios` (crear usuario de cualquier rol, solo ADMIN).
  - `GET /usuarios/:id`, `PATCH /usuarios/:id`, `DELETE /usuarios/:id` (solo ADMIN, borrado lógico → `estado = INACTIVO`).
  - `PATCH /usuarios/:id/estado` (cambiar estado con motivo, solo ADMIN).
  - DTOs: `CrearUsuarioDto`, `CrearRepartidorDto`, `ActualizarUsuarioDto`, `ActualizarEstadoUsuarioDto`.
  - Utilidad de paginación `RespuestaPaginada<T>`.
- **Excluye:**
  - Creación de `PerfilRepartidor` con zonas completas → tarea 2.4 lo completa (dependencia circular blanda; aquí se deja placeholder).

**Subtareas**
1. Crear `usuarios.modulo.ts`, `usuarios.controlador.ts`, `usuarios.servicio.ts`.
2. Crear DTOs con validaciones (`CrearUsuarioDto` con enum `RolUsuario`, `ActualizarEstadoUsuarioDto` con motivo opcional).
3. Implementar `listar(filtros)` con `skip/take` y `where` dinámico.
4. Implementar `crear(dto)` con hasheo de contraseña, validación de email único, creación condicional de perfil según rol.
5. Implementar `obtenerPorId`, `actualizar`, `eliminar` (soft delete: `estado = INACTIVO`).
6. Implementar `cambiarEstado` con validación de transiciones (`PENDIENTE_VERIFICACION → ACTIVO → SUSPENDIDO ↔ INACTIVO`).
7. Añadir Swagger tags y DTOs decorados.
8. Tests unitarios del servicio.

**Entregables**
- Módulo completo `usuarios/`.
- 8 endpoints listados arriba.
- `src/comun/dto/paginacion.dto.ts` y `respuesta-paginada.ts`.

**Criterios de aceptación**
- [ ] `GET /usuarios` como VENDEDOR retorna 403.
- [ ] `GET /usuarios/yo` retorna el usuario autenticado.
- [ ] Crear usuario con email existente retorna 409.
- [ ] `DELETE /usuarios/:id` no borra la fila; actualiza `estado = INACTIVO`.
- [ ] Paginación con `pagina=2, limite=5` retorna `meta.pagina = 2`.

**Referencias**
- `docs/API_ENDPOINTS.md` § `/usuarios`
- `docs/MODELOS_DE_DATOS.md` § DTOs Usuario

---

### Tarea 1.7 — Seed inicial (admin raíz, reglas de tarifa)

**Prioridad:** 🔴 P0 · **Estimación:** 0.5d · **Depende de:** 1.6

**Objetivo**
Poblar la BD de dev/staging con un admin raíz funcional, usuarios de prueba (vendedores y repartidores) y las reglas de tarifa base, ejecutable con `yarn prisma db seed`.

**Descripción detallada**
Se configura el seed en `package.json#prisma.seed: "tsx prisma/seed.ts"` y se escribe `prisma/seed.ts` que usa `PrismaClient` directamente para insertar los datos de prueba listados en `CONFIGURACION_INICIAL.md § Credenciales de prueba`. Se usa `upsert` para que el seed sea idempotente.

**Alcance**
- **Incluye:**
  - Admin raíz: `admin@delivery.com` / `Admin123!`.
  - 2 vendedores de prueba.
  - 3 repartidores de prueba (sin zonas asignadas todavía; eso en seed de fase 2).
  - 2 reglas de tarifa: `POR_ENVIO` ($3.00) y `PAQUETE` (100 envíos por $250).
- **Excluye:**
  - Zonas, puntos intercambio, pedidos de prueba → seeds adicionales en Fase 2/3.

**Subtareas**
1. Añadir en `backend/package.json`: `"prisma": { "seed": "tsx prisma/seed.ts" }`.
2. Crear `backend/prisma/seed.ts` que lee `.env`, conecta Prisma y ejecuta upserts.
3. Hashear contraseñas con el helper de tarea 1.5.
4. Insertar admin raíz + perfil admin con permisos `["*"]`.
5. Insertar vendedores + perfiles vendedor con `saldoRecargado: 0`.
6. Insertar repartidores + perfiles repartidor con placa dummy.
7. Insertar 2 reglas de tarifa (`ReglaTarifa` — el modelo vendrá en tarea 4.1; por ahora el seed puede fallar gracefully si no existe, o la inserción de tarifas se pospone a Fase 4).
8. Ejecutar `yarn prisma db seed` y verificar en Adminer.

**Entregables**
- `backend/prisma/seed.ts`.
- `package.json` actualizado.

**Criterios de aceptación**
- [ ] `yarn prisma db seed` no falla (ignora o ejecuta según fase).
- [ ] Tras el seed, `POST /autenticacion/iniciar-sesion` con `admin@delivery.com / Admin123!` retorna tokens.
- [ ] Ejecutar el seed dos veces no duplica filas (idempotencia).

**Referencias**
- `docs/CONFIGURACION_INICIAL.md` § Credenciales de prueba

---

### Tarea 1.8 — Tests e2e de autenticación

**Prioridad:** 🟠 P1 · **Estimación:** 1d · **Depende de:** 1.3, 1.4

**Objetivo**
Garantizar con tests e2e que el flujo completo `registrar → iniciar sesión → consumir endpoint protegido → refrescar → cerrar sesión` funciona sin regresiones.

**Descripción detallada**
Tests con `@nestjs/testing` y `supertest` en `backend/test/e2e/autenticacion.e2e-spec.ts`. Setup/teardown de BD usando Prisma: `yarn prisma migrate deploy` sobre una BD de test (distinta de la dev) y truncado al final. Alternativamente, cada test abre una transacción y hace rollback.

**Alcance**
- **Incluye:**
  - Test `registrar → iniciar sesión`.
  - Test `iniciar sesión con credenciales inválidas → 401`.
  - Test `refrescar token → invalida el anterior`.
  - Test `acceder a GET /usuarios/yo sin token → 401`.
  - Test `acceder a GET /usuarios como VENDEDOR → 403`.
  - Test `cerrar sesión invalida el refresh token`.
- **Excluye:**
  - Tests de carga → tarea 10.1.

**Subtareas**
1. Crear archivo `backend/test/e2e/autenticacion.e2e-spec.ts`.
2. Configurar `jest-e2e.json` con `DATABASE_URL=postgresql://.../delivery_test`.
3. Script `yarn test:e2e` que hace `prisma migrate deploy` antes de correr.
4. Escribir los 6 tests listados arriba.
5. Añadir `yarn test:e2e` al workflow `backend-ci.yml`.

**Entregables**
- `backend/test/e2e/autenticacion.e2e-spec.ts`.
- `backend/test/jest-e2e.json`.

**Criterios de aceptación**
- [ ] `yarn test:e2e autenticacion` pasa 100% en local.
- [ ] En CI, los tests e2e de auth corren con Postgres+PostGIS disponibles.

**Referencias**
- `docs/GUIA_BACKEND.md` § Testing

---

### Tarea 1.9 — Swagger/OpenAPI en `/docs`

**Prioridad:** 🟠 P1 · **Estimación:** 0.5d · **Depende de:** 1.3

**Objetivo**
Exponer documentación interactiva en `GET /docs` con todos los endpoints y DTOs anotados, descargable como `openapi.json`.

**Descripción detallada**
Se instala `@nestjs/swagger`, se configura `SwaggerModule.setup('docs', app, document)` en `main.ts` con OpenAPI 3.x. Se anotan controladores con `@ApiTags`, `@ApiOperation`, `@ApiResponse`, y DTOs con `@ApiProperty`. Autenticación Bearer JWT se configura globalmente para que el botón "Authorize" funcione.

**Alcance**
- **Incluye:**
  - Instalación y setup de Swagger.
  - Anotaciones en todos los endpoints existentes (autenticacion, usuarios, salud).
  - Configuración del bearer JWT en el schema.
  - Persistencia del `openapi.json` descargable en `/docs-json`.
- **Excluye:**
  - Generación automática de SDK cliente (puede venir después).

**Subtareas**
1. `yarn add @nestjs/swagger`.
2. En `main.ts`, construir `DocumentBuilder` con `.setTitle('Delivery System API').setVersion('1.0').addBearerAuth()`.
3. Anotar controladores con `@ApiTags('Autenticacion')`, `@ApiTags('Usuarios')`, etc.
4. Anotar DTOs con `@ApiProperty({ description, example })`.
5. En endpoints protegidos, añadir `@ApiBearerAuth()`.
6. Probar http://localhost:3000/docs.

**Entregables**
- `main.ts` con Swagger configurado.
- DTOs y controladores anotados.

**Criterios de aceptación**
- [ ] `GET /docs` muestra la UI de Swagger.
- [ ] El botón "Authorize" permite pegar un JWT y probar endpoints protegidos.
- [ ] `GET /docs-json` devuelve un OpenAPI 3.x válido.

**Referencias**
- `docs/GUIA_BACKEND.md` § Swagger

---

### Tarea 1.10 — Rate limiting + Helmet + CORS

**Prioridad:** 🟠 P1 · **Estimación:** 0.5d · **Depende de:** 1.1

**Objetivo**
Cerrar el hardening base del backend: protección de cabeceras (Helmet), límite de requests por IP/usuario (Throttler con Redis), y CORS controlado.

**Descripción detallada**
Se instalan `@nestjs/throttler`, `helmet` (middleware Express) e `ioredis` para el storage del throttler. Redis se usa también para caché en fases posteriores; aquí nace la conexión. CORS se configura con lista blanca leída de `FRONTEND_URL` + URLs de apps móviles.

**Alcance**
- **Incluye:**
  - Módulo `RedisModulo` (global) exponiendo `RedisServicio` (wrapper de `ioredis`).
  - Throttler configurado con `ttl: 60s`, `limit: 100` por defecto, storage Redis.
  - Helmet registrado en `main.ts`.
  - CORS configurado con origen específico (no `*`) y `credentials: true`.
- **Excluye:**
  - Rate limiting específico por endpoint (p.ej. auth más estricto) → puede hacerse en fase 10.

**Subtareas**
1. `yarn add @nestjs/throttler ioredis helmet`.
2. Crear `src/redis/redis.modulo.ts` y `redis.servicio.ts` con `new Redis({ host, port })`.
3. Extender `salud.controlador.ts` con check de Redis.
4. Configurar `ThrottlerModule.forRootAsync` con storage Redis (si se quiere distribuido) o in-memory (simple).
5. Registrar `ThrottlerGuard` global en `AppModule`.
6. En `main.ts`: `app.use(helmet())`, `app.enableCors({ origin: ..., credentials: true })`.
7. Añadir variables `REDIS_HOST`, `REDIS_PORT`, `THROTTLE_TTL`, `THROTTLE_LIMIT`, `FRONTEND_URL` al `.env` y al esquema Joi.

**Entregables**
- `src/redis/{redis.modulo.ts, redis.servicio.ts}`.
- Helmet y CORS en `main.ts`.
- Throttler registrado global.

**Criterios de aceptación**
- [ ] Tras 100 requests en 60s desde la misma IP, el siguiente request retorna 429.
- [ ] `curl -I http://localhost:3000/api/v1/salud` incluye cabeceras `X-DNS-Prefetch-Control`, `X-Frame-Options`, etc.
- [ ] CORS rechaza peticiones desde un origen no autorizado.
- [ ] `GET /salud` ahora también verifica Redis (`PING`).

**Referencias**
- `docs/GUIA_BACKEND.md` § Seguridad, Rate limiting

---

**Navegación:** [← Fase 0 — Preparación](./fase-00-preparacion.md) · [Índice](../PLAN_DE_TAREAS_DETALLADO.md) · [Fase 2 — Zonas, Vendedores y Repartidores →](./fase-02-zonas-vendedores-repartidores.md)
