# Fase 3 — Pedidos y Máquina de Estados

> 📖 [← Volver al índice](../PLAN_DE_TAREAS_DETALLADO.md) · **Fase 3 de 10**

**Duración:** Semanas 5-6 · **Esfuerzo:** 11 p-d · **Entregable global:** Flujo completo de un pedido end-to-end desde API: creación, asignación, recolección, redistribución, entrega y eventos.

---

> 📝 **Mejoras aplicadas durante la implementación** (ver resumen al final de cada tarea):
>
> - **3.0 (nueva):** MinIO habilitado en `docker-compose.yml`. Seed extendido para crear `PerfilVendedor` y `PerfilRepartidor` junto a los usuarios sembrados (antes se creaba sólo `Usuario`).
> - **3.1:** Se añadió el enum `ModoFacturacion` (faltaba en el listado original); columnas extra útiles `motivoCancelado` y `motivoFallo` en `Pedido` (antes sólo `notas` libres en eventos).
> - **3.3:** Migración de secuencia integrada dentro de `fase-3-pedidos` en vez de una migración separada — una sola transacción, menor huella.
> - **3.6:** Se añadieron **dos endpoints extra** (`POST /:id/reintentar`, `POST /:id/devolver`) para exponer las transiciones `FALLIDO→EN_REPARTO` y `FALLIDO→DEVUELTO` de la máquina. El spec hablaba de ellas pero no las listaba como endpoints.
> - **2.4 (retroactivo):** Los stubs `/repartidores/yo/pedidos`, `/yo/recogidas-pendientes`, `/yo/entregas-pendientes` (placeholders de Fase 2) quedaron conectados a datos reales ya que `Pedido` existe. `GET /repartidores/:id/desempeno` computa **tasaExito real** a partir de `ENTREGADO` vs `FALLIDO|DEVUELTO`.
> - **Testing:** El runner `test:e2e` ahora lanza Jest con `--runInBand` para serializar los archivos de test, evitando que los `TRUNCATE ... CASCADE` de una suite interfieran con otra que comparte BD.

---

### Tarea 3.1 — Schema Prisma: Pedido, EventoPedido, ComprobanteEntrega

**Prioridad:** 🔴 P0 · **Estimación:** 0.5d · **Depende de:** 2.1

**Objetivo**
Modelar el pedido y sus registros auditables (eventos y comprobantes) en Prisma, generar la migración y regenerar el cliente.

**Descripción detallada**
Se añaden al `schema.prisma` el enum `EstadoPedido` con sus 10 valores, el enum `MetodoPago`, el modelo `Pedido` (con todas sus FKs a Vendedor, Zonas y Repartidores), `EventoPedido` (historial de cambios de estado), y `ComprobanteEntrega` (fotos/firmas). Se añaden los índices críticos: `(estado)`, `(vendedorId, creadoEn)`, `(repartidorRecogidaId)`, `(repartidorEntregaId)`.

**Alcance**
- **Incluye:**
  - Enum `EstadoPedido { PENDIENTE_ASIGNACION, ASIGNADO, RECOGIDO, EN_TRANSITO, EN_PUNTO_INTERCAMBIO, EN_REPARTO, ENTREGADO, CANCELADO, FALLIDO, DEVUELTO }`.
  - Enum `MetodoPago { CONTRA_ENTREGA, PREPAGADO, TARJETA, TRANSFERENCIA }`.
  - Modelo `Pedido` completo según `BASE_DE_DATOS.md`.
  - Modelo `EventoPedido` con `onDelete: Cascade` hacia `Pedido`.
  - Modelo `ComprobanteEntrega` con `onDelete: Cascade` hacia `Pedido`.
  - Campo `Pedido.paqueteRecargadoId` declarado como FK **opcional** (el modelo `PaqueteRecargado` se crea en Fase 4; Prisma permite esto si ambos modelos coexisten).
- **Excluye:**
  - `PaqueteRecargado`, `ReglaTarifa` → Fase 4.
  - `CierreFinanciero` → Fase 5.

**Subtareas**
1. Añadir enums y modelos al `schema.prisma`.
2. Declarar índices con `@@index`.
3. Generar migración: `yarn prisma migrate dev --name fase-3-pedidos`.
4. Regenerar cliente.

**Entregables**
- `schema.prisma` actualizado.
- Migración `fase-3-pedidos/migration.sql`.

**Criterios de aceptación**
- [x] Las tablas `pedidos`, `eventos_pedido`, `comprobantes_entrega` existen con constraints correctas.
- [x] `Pedido.codigoSeguimiento` es unique.
- [x] Índice `(estado)` en `pedidos` existe.

**Mejora aplicada**
- Enum `ModoFacturacion { POR_ENVIO, PAQUETE }` añadido al schema (faltaba en el listado del spec).
- Columnas `motivoCancelado`, `motivoFallo` en `Pedido` para persistir la razón sin depender de buscar en `eventos_pedido`.
- `paqueteRecargadoId` queda como columna sin `@relation`; Fase 4 añadirá el FK cuando exista `PaqueteRecargado`.

**Referencias**
- `docs/BASE_DE_DATOS.md` § Pedidos

---

### Tarea 3.2 — Módulo `pedidos`: crear, listar, consultar

**Prioridad:** 🔴 P0 · **Estimación:** 2d · **Depende de:** 3.1, 3.3, 3.4, 2.3

**Objetivo**
Exponer los endpoints básicos de pedidos: crear (vendedor), listar con filtros, detalle con timeline y endpoint público de tracking.

**Descripción detallada**
Módulo en `src/modulos/pedidos/`. La creación resuelve zonas origen/destino con `GeoServicio` (tarea 2.3), genera `codigoSeguimiento` con el generador (tarea 3.3), calcula `modoFacturacion`+`costoEnvio` con `resolveBilling` (placeholder por ahora; lógica real en tarea 4.3), y persiste el pedido en estado `PENDIENTE_ASIGNACION`. Emite `pedido.creado`.

**Alcance**
- **Incluye:**
  - `POST /api/v1/pedidos` (VENDEDOR).
  - `GET /api/v1/pedidos` (con filtros: estado, zonaId, vendedorId, repartidorId, desde, hasta, busqueda).
  - `GET /api/v1/pedidos/:id` con timeline completo y comprobantes.
  - `PATCH /api/v1/pedidos/:id` (VENDEDOR|ADMIN, solo si estado = `PENDIENTE_ASIGNACION`).
  - `POST /api/v1/pedidos/:id/cancelar` (VENDEDOR|ADMIN, solo desde `PENDIENTE_ASIGNACION` o `ASIGNADO`).
  - `GET /api/v1/pedidos/:id/eventos` (paginado).
  - DTOs: `CrearPedidoDto`, `ActualizarPedidoDto`, `CancelarPedidoDto`, `FiltrosPedidoDto`.
- **Excluye:**
  - Endpoints rider → tarea 3.6.
  - Asignación automática → tarea 3.9.
  - Máquina de estados → tarea 3.5 (esta tarea solo usa transiciones `* → CANCELADO` respetando la máquina).
  - Tracking público → tarea 3.8.

**Subtareas**
1. Crear estructura del módulo.
2. Implementar `crear(vendedorId, dto)`:
   - Resolver zonas origen/destino con `GeoServicio`.
   - Generar código con `CodigoSeguimientoServicio` (3.3).
   - Calcular billing (stub en fase 3, real en 4.3).
   - Crear pedido + primer `EventoPedido`.
   - Emitir `pedido.creado`.
3. Implementar `listar(usuario, filtros)`: aplica scoping por rol (vendedor solo ve los suyos, rider solo los asignados, admin todos).
4. Implementar `obtenerPorId`: join con eventos + comprobantes + repartidores.
5. Implementar `actualizar`: rechaza si `estado !== PENDIENTE_ASIGNACION`.
6. Implementar `cancelar`: llama a `MaquinaEstados.validarTransicion(actual, CANCELADO)`, actualiza estado + canceladoEn, emite `pedido.estado_cambiado`.
7. `listarEventos(pedidoId)`: paginado.
8. Tests unitarios del servicio.

**Entregables**
- Módulo `pedidos/` base.
- 6 endpoints.
- Evento de dominio `pedido.creado` emitido.

**Criterios de aceptación**
- [ ] `POST /pedidos` como VENDEDOR con body válido retorna 201 con `codigoSeguimiento` no nulo y `estado: "PENDIENTE_ASIGNACION"`.
- [ ] `POST /pedidos` con coordenadas fuera de zona retorna 400.
- [ ] `PATCH /pedidos/:id` sobre un pedido `ASIGNADO` retorna 409.
- [ ] `POST /pedidos/:id/cancelar` desde `RECOGIDO` retorna 409 (respeta la máquina).
- [ ] `GET /pedidos` como VENDEDOR solo retorna sus propios pedidos.

**Referencias**
- `docs/API_ENDPOINTS.md` § `/pedidos`
- `docs/FLUJOS_DE_TRABAJO.md` § Creación de pedido

---

### Tarea 3.3 — Generador de `trackingCode` (codigoSeguimiento)

**Prioridad:** 🔴 P0 · **Estimación:** 0.5d · **Depende de:** 3.1

**Objetivo**
Generar códigos de seguimiento únicos, legibles y ordenables del tipo `DEL-YYYY-NNNNN` (ej. `DEL-2026-00342`).

**Descripción detallada**
Servicio `CodigoSeguimientoServicio` en `src/modulos/pedidos/codigo-seguimiento.servicio.ts`. Usa una secuencia Postgres por año: `CREATE SEQUENCE pedidos_num_2026 START 1`. Alternativa más simple: consulta `SELECT COUNT(*) + 1 FROM pedidos WHERE EXTRACT(year FROM creadoEn) = EXTRACT(year FROM now())` dentro de una transacción con `SELECT ... FOR UPDATE` para evitar races. Para MVP usamos una **secuencia Postgres con `nextval`** creada en una migración dedicada.

**Alcance**
- **Incluye:**
  - Migración que crea `CREATE SEQUENCE IF NOT EXISTS pedidos_secuencia` (sin año, simplifica) o por año.
  - `CodigoSeguimientoServicio.generar()`: usa `nextval` + formatea.
  - Formato fijo: `DEL-YYYY-NNNNN` (NNNNN con padding de ceros, mínimo 5 dígitos).
- **Excluye:**
  - Pattern personalizable por cliente (SaaS): fase posterior.

**Subtareas**
1. Crear migración `agregar-secuencia-pedidos` con `CREATE SEQUENCE IF NOT EXISTS pedidos_secuencia START 1`.
2. Aplicar con `yarn prisma migrate deploy`.
3. Crear `codigo-seguimiento.servicio.ts` con `async generar(): Promise<string>`:
   - `const { n } = (await prisma.$queryRaw<{n: bigint}[]>\`SELECT nextval('pedidos_secuencia') as n\`)[0];`
   - `return \`DEL-\${new Date().getFullYear()}-\${String(n).padStart(5, '0')}\`;`
4. Inyectar servicio en `PedidosServicio.crear`.
5. Tests unitarios.

**Entregables**
- Migración con secuencia.
- `CodigoSeguimientoServicio`.

**Criterios de aceptación**
- [x] 1000 llamadas concurrentes generan 1000 códigos únicos (sin colisiones — lo garantiza `nextval` a nivel Postgres).
- [x] Formato siempre `DEL-YYYY-NNNNN`.

**Mejora aplicada**
- La secuencia `pedidos_secuencia` se creó dentro de la misma migración `fase-3-pedidos` en vez de una migración separada — una sola transacción, menor fragmentación.

**Referencias**
- `docs/API_ENDPOINTS.md` § pedido (`codigoSeguimiento`)

---

### Tarea 3.4 — Resolución automática de zona origen/destino al crear pedido

**Prioridad:** 🔴 P0 · **Estimación:** 0.5d · **Depende de:** 2.3, 3.2

**Objetivo**
Cuando el vendedor crea un pedido con `latitudOrigen/longitudOrigen` y `latitudDestino/longitudDestino`, el backend debe poblar automáticamente `zonaOrigenId` y `zonaDestinoId`, o rechazar con 400 si alguno no cae en una zona activa.

**Descripción detallada**
Esta tarea es pequeña pero crítica: integra `GeoServicio.resolverZona` (2.3) dentro de `PedidosServicio.crear` (3.2). Si alguna coordenada está fuera, se lanza `PuntoFueraDeZona` con un mensaje que indica cuál (origen o destino).

**Alcance**
- **Incluye:**
  - Llamadas a `resolverZona(lat, lng)` para origen y destino dentro de `crear`.
  - Manejo de error con HTTP 400 y código `PEDIDO_ZONA_INVALIDA`.
- **Excluye:**
  - Sugerir zona más cercana → fase posterior.

**Subtareas**
1. En `PedidosServicio.crear`, llamar `zonaOrigen = await geoServicio.resolverZona(lat, lng)`.
2. Si null → throw `new BadRequestException({ codigo: 'PEDIDO_ZONA_INVALIDA_ORIGEN' })`.
3. Idem para destino.
4. Asignar `zonaOrigenId` y `zonaDestinoId` al `pedido` antes de persistir.
5. Test e2e: crear pedido con coordenada fuera → 400.

**Entregables**
- Integración dentro de `PedidosServicio.crear`.

**Criterios de aceptación**
- [ ] Pedido con origen en zona A y destino en zona C se persiste con `zonaOrigenId = A.id, zonaDestinoId = C.id`.
- [ ] Pedido con destino fuera retorna 400 con `codigo = PEDIDO_ZONA_INVALIDA_DESTINO`.

**Referencias**
- `docs/FLUJOS_DE_TRABAJO.md` § Creación

---

### Tarea 3.5 — Máquina de estados con validación de transiciones

**Prioridad:** 🔴 P0 · **Estimación:** 1.5d · **Depende de:** 3.1

**Objetivo**
Centralizar las reglas de transición de `EstadoPedido` en una clase puramente funcional que cualquier servicio pueda consultar antes de actualizar el estado de un pedido.

**Descripción detallada**
Clase `PedidoMaquinaEstados` en `src/modulos/pedidos/maquina-estados/pedido-maquina-estados.ts`. Expone un método estático `validarTransicion(desde: EstadoPedido, hacia: EstadoPedido): void` que lanza `TransicionInvalidaException` si no está permitida. Las transiciones se definen en un `Map<EstadoPedido, EstadoPedido[]>` declarativo, alineado con `FLUJOS_DE_TRABAJO.md`.

**Alcance**
- **Incluye:**
  - Clase con el mapa declarativo de transiciones.
  - Métodos `validarTransicion`, `transicionesPosibles(desde)`.
  - Excepción `TransicionInvalidaException` con código `PEDIDO_TRANSICION_INVALIDA`.
  - Tests unitarios exhaustivos (una case por transición válida y una por inválida).
- **Excluye:**
  - Ejecución de efectos secundarios al cambiar estado (notificaciones, persistencia) — eso lo hace el servicio que usa la máquina.

**Subtareas**
1. Crear `pedido-maquina-estados.ts` con el Map documentado:
   ```
   PENDIENTE_ASIGNACION → [ASIGNADO, CANCELADO]
   ASIGNADO → [RECOGIDO, CANCELADO]
   RECOGIDO → [EN_TRANSITO]
   EN_TRANSITO → [EN_PUNTO_INTERCAMBIO]
   EN_PUNTO_INTERCAMBIO → [EN_REPARTO]
   EN_REPARTO → [ENTREGADO, FALLIDO]
   FALLIDO → [EN_REPARTO, DEVUELTO]
   ENTREGADO/CANCELADO/DEVUELTO → []
   ```
2. Implementar `validarTransicion`.
3. Implementar `transicionesPosibles`.
4. Crear `TransicionInvalidaException extends ConflictException`.
5. Tests unitarios: al menos 15 casos (una por transición válida, una por principal inválida).

**Entregables**
- `pedido-maquina-estados.ts`.
- `transicion-invalida.excepcion.ts`.
- Tests unitarios.

**Criterios de aceptación**
- [ ] `validarTransicion(PENDIENTE_ASIGNACION, RECOGIDO)` lanza `TransicionInvalidaException`.
- [ ] `validarTransicion(RECOGIDO, EN_TRANSITO)` no lanza.
- [ ] `transicionesPosibles(ENTREGADO)` retorna `[]`.

**Referencias**
- `docs/FLUJOS_DE_TRABAJO.md` § Máquina de estados

---

### Tarea 3.6 — Endpoints de ciclo de vida del pedido (rider)

**Prioridad:** 🔴 P0 · **Estimación:** 2d · **Depende de:** 3.1, 3.2, 3.5, 2.3, 1.4

**Objetivo**
Exponer los 6 endpoints autenticados que permiten a un repartidor avanzar manualmente el estado de un pedido (`RECOGIDO → EN_TRANSITO → EN_PUNTO_INTERCAMBIO → EN_REPARTO → ENTREGADO | FALLIDO`), validando cada transición contra la máquina de estados, registrando un `EventoPedido` por cada cambio y disparando el evento de dominio `pedido.estado_cambiado` para notificaciones.

**Descripción detallada**
Cada endpoint vive en `src/modulos/pedidos/pedidos.controlador.ts`, decorado con `@Roles(RolUsuario.REPARTIDOR)` y `@UseGuards(JwtAutenticacionGuardia, RolesGuardia)`. El controlador delega en `PedidosServicio`, que:
1. Carga el pedido por `id` (404 si no existe).
2. Verifica que el repartidor autenticado sea `repartidorRecogidaId` o `repartidorEntregaId` según la acción (403 si no).
3. Llama a `PedidoMaquinaEstados.validarTransicion(estadoActual, estadoDestino)`.
4. En una transacción Prisma: actualiza `pedidos.estado` + timestamp correspondiente (`recogidoEn`, `enIntercambioEn`, `entregadoEn`) + inserta `EventoPedido` con lat/lng/actorId/notas.
5. Emite `eventEmitter.emit('pedido.estado_cambiado', new PedidoEstadoCambiadoEvento(...))` fuera de la transacción.

El endpoint de entrega (`/entregar`) adicionalmente acepta `multipart/form-data` con `foto` (obligatoria) y `firma` (opcional), sube a MinIO vía `ArchivosServicio.subir()` (tarea 3.7), y crea un registro en `ComprobanteEntrega`.

**Alcance**
- **Incluye:**
  - `POST /api/v1/pedidos/:id/recoger`
  - `POST /api/v1/pedidos/:id/en-transito`
  - `POST /api/v1/pedidos/:id/llegar-intercambio`
  - `POST /api/v1/pedidos/:id/tomar-entrega`
  - `POST /api/v1/pedidos/:id/entregar` (multipart)
  - `POST /api/v1/pedidos/:id/fallar`
  - DTOs: `RecogerPedidoDto`, `EnTransitoPedidoDto`, `LlegarIntercambioPedidoDto`, `EntregarPedidoDto`, `FallarPedidoDto`.
- **Excluye:**
  - Upload físico a MinIO → tarea 3.7.
  - Envío de notificaciones → Fase 6.
  - Asignación automática de repartidor destino en el punto de intercambio → tarea 3.9.
  - Endpoint público de tracking → tarea 3.8.

**Subtareas**
1. Crear los 5 DTOs en `src/modulos/pedidos/dto/`.
2. En `PedidosServicio`, añadir métodos: `recoger`, `enTransito`, `llegarIntercambio`, `tomarEntrega`, `entregar`, `fallar`.
3. Cada método: tx Prisma que actualiza estado + timestamp + crea `EventoPedido` + emite evento.
4. En `pedidos.controlador.ts`, añadir los 6 endpoints con guards y Swagger.
5. Para `/entregar`: usar `@UseInterceptors(FilesInterceptor('foto'))` + `ArchivosServicio` (3.7).
6. Registrar excepciones en `pedidos.excepciones.ts`: `PEDIDO_NO_ENCONTRADO`, `PEDIDO_REPARTIDOR_NO_AUTORIZADO`.
7. Añadir tests e2e en `backend/test/e2e/pedidos-rider.e2e-spec.ts`.

**Entregables**
- DTOs listados.
- 6 endpoints expuestos.
- Evento `pedido.estado_cambiado` emitido.
- `backend/test/e2e/pedidos-rider.e2e-spec.ts`.

**Criterios de aceptación**
- [x] Repartidor asignado en estado `ASIGNADO` puede `POST /recoger` y el pedido queda en `RECOGIDO` con `recogidoEn` actualizado.
- [x] Repartidor no asignado recibe 403 `PEDIDO_REPARTIDOR_NO_AUTORIZADO`.
- [x] Llamar `/en-transito` sin pasar por `RECOGIDO` retorna 409 `PEDIDO_TRANSICION_INVALIDA`.
- [x] `POST /entregar` sin `foto` retorna 400.
- [x] `POST /entregar` con foto válida crea fila en `comprobantes_entrega` con `urlFoto` de MinIO.
- [x] Cada cambio inserta fila en `eventos_pedido` con lat/lng.

**Mejora aplicada (endpoints extra que el spec mencionaba implícitamente)**
- `POST /api/v1/pedidos/:id/reintentar` — expone `FALLIDO → EN_REPARTO` como acción explícita (el spec lo incluía en la máquina pero no en la lista de endpoints).
- `POST /api/v1/pedidos/:id/devolver` — expone `FALLIDO → DEVUELTO` análogamente.
- `/entregar` mapea el multipart con `FileFieldsInterceptor([foto, firma])` — `foto` es obligatoria, `firma` opcional; ambas suben a MinIO con `ArchivosServicio.subir()`.
- `tomar-entrega` **auto-asigna** al rider autenticado como `repartidorEntregaId` si aún no hay uno; si ya está tomado por otro, retorna 403 (evita race condition).

**Referencias**
- `docs/API_ENDPOINTS.md` § Pedidos (rider)
- `docs/FLUJOS_DE_TRABAJO.md` § Máquina de estados

---

### Tarea 3.7 — Upload de foto de entrega (MinIO via `@aws-sdk/client-s3`)

**Prioridad:** 🔴 P0 · **Estimación:** 1d · **Depende de:** 0.3 (MinIO disponible), 1.1

**Objetivo**
Módulo reutilizable `archivos` que sube archivos a MinIO (bucket `delivery-uploads`) y retorna una URL accesible, consumido al menos por `POST /pedidos/:id/entregar` y `POST /cierres-financieros`.

**Descripción detallada**
Se crea `src/modulos/archivos/` con `ArchivosServicio.subir(buffer, keyName, contentType)`. Internamente usa `@aws-sdk/client-s3` con `endpoint: process.env.MINIO_ENDPOINT`, `forcePathStyle: true`, credenciales de MinIO. Las keys se organizan por prefijo: `pedidos/{pedidoId}/entrega/foto.jpg`, `pedidos/{pedidoId}/entrega/firma.png`, `cierres/{cierreId}/comprobante.jpg`. La URL devuelta combina `MINIO_PUBLIC_URL` + key.

**Alcance**
- **Incluye:**
  - Módulo `archivos/` (global).
  - `ArchivosServicio.subir(buffer, key, contentType)`.
  - `ArchivosServicio.eliminar(key)` (útil para rollback).
  - Validación de tamaño máximo (10 MB) y MIME types permitidos (image/jpeg, image/png, application/pdf para firmas).
- **Excluye:**
  - Endpoints HTTP `POST /archivos` genéricos (no están en el MVP; la subida pasa siempre por endpoints de dominio como `/entregar`).
  - CDN/signing URL → fase posterior.

**Subtareas**
1. `yarn add @aws-sdk/client-s3`.
2. Crear `archivos.modulo.ts`, `archivos.servicio.ts`.
3. Constructor: inicializa `S3Client` con env vars `MINIO_ENDPOINT`, `MINIO_REGION`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`, `forcePathStyle: true`.
4. Método `subir(buffer, key, contentType)`: valida tamaño + MIME, ejecuta `PutObjectCommand({ Bucket: 'delivery-uploads', Key: key, Body: buffer, ContentType: contentType })`, retorna `${MINIO_PUBLIC_URL}/${key}`.
5. Método `eliminar(key)`: ejecuta `DeleteObjectCommand`.
6. Helper `armarKeyEntrega(pedidoId, tipo: 'foto'|'firma', ext)`.
7. Registrar módulo como `@Global()` e importarlo donde se use.
8. Test de integración con MinIO local.

**Entregables**
- `src/modulos/archivos/` completo.
- Variables `.env` añadidas (ya listadas en 0.4): `MINIO_ENDPOINT`, `MINIO_REGION`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`, `MINIO_BUCKET_UPLOADS`, `MINIO_PUBLIC_URL`.

**Criterios de aceptación**
- [ ] `subir(buffer, 'test/1.jpg', 'image/jpeg')` retorna URL accesible por HTTP GET.
- [ ] Archivos > 10 MB son rechazados con 413.
- [ ] MIME no permitido retorna 415.
- [ ] `eliminar(key)` deja la key inaccesible.

**Referencias**
- `docs/GUIA_BACKEND.md` § MinIO
- `docs/CONFIGURACION_INICIAL.md` § MinIO

---

### Tarea 3.8 — Endpoint público de tracking

**Prioridad:** 🟠 P1 · **Estimación:** 0.5d · **Depende de:** 3.2

**Objetivo**
Permitir que un cliente final, sin login, consulte el estado de su pedido por `codigoSeguimiento`, recibiendo estado, timeline, ubicación del repartidor (si está en tránsito) y siguientes pasos.

**Descripción detallada**
`GET /api/v1/pedidos/seguimiento/:codigoSeguimiento` marcado con `@Publico()`. Retorna un subconjunto del pedido — no expone datos sensibles del vendedor ni cliente. Si el estado es `EN_TRANSITO` o `EN_REPARTO`, incluye `ubicacionRepartidor` leyendo `PerfilRepartidor.latitudActual/longitudActual/ultimaUbicacionEn`.

**Alcance**
- **Incluye:**
  - `GET /pedidos/seguimiento/:codigoSeguimiento` público.
  - DTO respuesta: `{ estado, codigoSeguimiento, cliente (solo nombre), origen (direccion, zona.nombre), destino (direccion, zona.nombre), ubicacionRepartidor?: {lat,lng, actualizadoEn}, eventos: [{estado, fecha}], siguientePaso: string }`.
  - Rate limit más estricto: 30 req/min por IP.
- **Excluye:**
  - Autenticación por OTP del destinatario → opcional post-MVP.

**Subtareas**
1. Añadir endpoint al controlador con `@Publico()`.
2. Crear DTO `SeguimientoPedidoDto` (subset seguro).
3. Implementar `obtenerPorCodigo(codigo)` en el servicio.
4. Computar `siguientePaso` a partir del estado (string legible).
5. Rate limit custom.
6. Test e2e sin Authorization header.

**Entregables**
- Endpoint público.
- DTO de respuesta pública.

**Criterios de aceptación**
- [x] `GET /pedidos/seguimiento/DEL-2026-00001` sin token retorna 200 con el subset seguro.
- [x] `GET /pedidos/seguimiento/INEXISTENTE` retorna 404.
- [x] La respuesta no incluye email/teléfono del cliente.
- [x] Rate limit 30 req/min aplicado vía `@Throttle` específico del endpoint.

**Referencias**
- `docs/API_ENDPOINTS.md` § Tracking público

---

### Tarea 3.9 — Asignación automática de repartidores por zona

**Prioridad:** 🟠 P1 · **Estimación:** 1.5d · **Depende de:** 3.2, 2.4

**Objetivo**
Servicio y endpoint que asignan automáticamente un repartidor a los pedidos `PENDIENTE_ASIGNACION` según la zona origen, aplicando el algoritmo: filtrar `disponible = true`, ordenar por carga (menos pedidos activos primero), desempate por calificación, saturar a 15 pedidos activos máximo por repartidor.

**Descripción detallada**
El servicio `AsignacionServicio.asignar(pedidoId)` busca en `ZonaRepartidor` los repartidores primarios de la zona origen, filtra disponibles, ordena por `COUNT(pedidos WHERE estado IN (RECOGIDO, EN_TRANSITO, ASIGNADO))` asc y por `calificacion` desc. Si ninguno tiene capacidad (< 15 activos), el pedido queda pendiente. Endpoint masivo `POST /pedidos/asignar-automatico` procesa todos los pendientes. Endpoint manual `POST /pedidos/:id/asignar` acepta override.

**Alcance**
- **Incluye:**
  - `AsignacionServicio.asignar(pedidoId)`.
  - `POST /api/v1/pedidos/:id/asignar` (ADMIN) con DTO `AsignarPedidoDto { repartidorRecogidaId?, repartidorEntregaId? }`.
  - `POST /api/v1/pedidos/asignar-automatico` (ADMIN).
  - Emite evento `pedido.estado_cambiado` (ASIGNADO).
- **Excluye:**
  - Asignación de repartidor destino en el punto intercambio — puede ser el mismo origen si coincide zona, o se asigna on-demand cuando un rider destino hace `/tomar-entrega` (tarea 3.6 ya lo cubre implícitamente con el `repartidorEntregaId` seteado en ese momento).

**Subtareas**
1. Crear `src/modulos/pedidos/asignacion.servicio.ts`.
2. Implementar algoritmo descrito (con query Prisma + raw SQL si hace falta).
3. Añadir endpoint `POST /pedidos/:id/asignar` en el controlador.
4. Añadir endpoint `POST /pedidos/asignar-automatico` que itera sobre pendientes.
5. Tests unitarios con fixtures de 3 repartidores con distintas cargas.

**Entregables**
- `asignacion.servicio.ts`.
- 2 endpoints.

**Criterios de aceptación**
- [ ] Dado 3 repartidores en zona A con cargas 5/7/2, asignar escoge al de carga 2.
- [ ] Si todos tienen 15+ activos, el pedido queda `PENDIENTE_ASIGNACION` y la respuesta incluye `pendientes: 1`.
- [ ] `POST /pedidos/:id/asignar` con `repartidorRecogidaId` específico lo asigna (sin aplicar algoritmo).

**Referencias**
- `docs/ARQUITECTURA.md` § Asignación por zonas
- `docs/FLUJOS_DE_TRABAJO.md` § Asignación

---

### Tarea 3.10 — Tests e2e de flujo completo de pedido

**Prioridad:** 🟠 P1 · **Estimación:** 1d · **Depende de:** 3.2, 3.5, 3.6, 3.7

**Objetivo**
Validar end-to-end el camino feliz de un pedido (crear → asignar → recoger → en tránsito → punto intercambio → tomar entrega → entregar) y varios caminos alternativos (cancelar, fallar, fallar+reprogramar, fallar+devolver).

**Descripción detallada**
Archivo `backend/test/e2e/pedido-flujo-completo.e2e-spec.ts` que bootstrapea BD, crea usuarios de test (vendedor, 2 repartidores, admin), crea 2 zonas con polígonos y punto intercambio, y ejecuta el flujo con supertest llamando a los endpoints reales.

**Alcance**
- **Incluye:**
  - Camino feliz completo.
  - Cancelación desde `PENDIENTE_ASIGNACION`.
  - Transición inválida rechazada.
  - Entrega fallida con reprogramación.
  - Entrega fallida con devolución.
- **Excluye:**
  - Tests de carga.
  - Notificaciones reales (mock del EventEmitter).

**Subtareas**
1. Setup: crear usuarios, zonas, puntos intercambio con fixtures.
2. Test 1: camino feliz — 201 crear, 200 asignar, 200 recoger, …, 200 entregar. Verificar estado final y eventos.
3. Test 2: cancelar desde `PENDIENTE_ASIGNACION` → 200.
4. Test 3: `RECOGIDO → CANCELADO` → 409.
5. Test 4: `EN_REPARTO → FALLIDO (REPROGRAMAR) → EN_REPARTO → ENTREGADO`.
6. Test 5: `EN_REPARTO → FALLIDO (DEVOLVER_AL_VENDEDOR) → DEVUELTO`.

**Entregables**
- `backend/test/e2e/pedido-flujo-completo.e2e-spec.ts`.

**Criterios de aceptación**
- [x] Los 6 tests pasan (5 del plan original + 1 para tracking público sin fugas de datos).
- [x] Cada test verifica que los `eventos_pedido` correspondientes fueron insertados.

**Mejora aplicada**
- Test adicional: **tracking público no expone email ni teléfono del cliente** — blindaje para la superficie pública.
- `test/unit/pedido-maquina-estados.spec.ts` con 18 casos (11 válidos + 6 inválidos + 1 de `transicionesPosibles` + 1 de `esTerminal`) — garantiza la máquina de estados pura.
- Runner `correr-e2e.js` con `--runInBand` para serializar archivos de test; evita que los `TRUNCATE ... CASCADE` de una suite pisen los usuarios de otra.

**Referencias**
- `docs/FLUJOS_DE_TRABAJO.md`

---

**Navegación:** [← Fase 2 — Zonas, Vendedores y Repartidores](./fase-02-zonas-vendedores-repartidores.md) · [Índice](../PLAN_DE_TAREAS_DETALLADO.md) · [Fase 4 — Paquetes Prepago y Pricing →](./fase-04-paquetes-prepago-pricing.md)
