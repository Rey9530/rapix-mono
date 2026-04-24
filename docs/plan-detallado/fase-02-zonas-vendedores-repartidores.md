# Fase 2 — Zonas, Vendedores y Repartidores

> 📖 [← Volver al índice](../PLAN_DE_TAREAS_DETALLADO.md) · **Fase 2 de 10**

**Duración:** Semana 4 · **Esfuerzo:** 5 p-d · **Entregable global:** Extensión PostGIS habilitada, admin puede crear zonas (polígonos `geometry(Polygon, 4326)`), asignar repartidores y cualquier punto se resuelve a zona vía `ST_Contains`.

---

### Tarea 2.0 — Migración inicial PostGIS + columna `geometry(Polygon, 4326)` + índice GIST

**Prioridad:** 🔴 P0 · **Estimación:** 0.5d · **Depende de:** 1.2

**Objetivo**
Dejar la base de datos preparada para persistir polígonos de zonas como geometrías SRID 4326 con índice espacial GIST, de modo que `ST_Contains` resuelva la zona de un punto en O(log n).

**Descripción detallada**
PostGIS ya se habilitó como extensión en la migración `init` (tarea 1.2). Esta tarea prepara la **migración específica de zonas**: define el campo `poligono` en el modelo `Zona` como `Unsupported("geometry(Polygon, 4326)")`, genera la migración con `prisma migrate dev --create-only`, y edita el SQL resultante para añadir el `CREATE INDEX ... USING GIST`. La tarea separa el trabajo de preparar-la-BD del trabajo de modelar el resto de entidades (tarea 2.1).

**Alcance**
- **Incluye:**
  - Añadir campo `poligono` al modelo `Zona` con tipo `Unsupported("geometry(Polygon, 4326)")`.
  - SQL post-migración con `CREATE INDEX zones_polygon_gist ON zonas USING GIST (poligono);`.
  - Verificación de `PostGIS_Version()`.
- **Excluye:**
  - Modelado de `Zona`, `ZonaRepartidor`, `PuntoIntercambio`, perfiles completos → tarea 2.1.
  - CRUD de zonas → tarea 2.2.

**Subtareas**
1. En `schema.prisma`, dentro del modelo `Zona` (creado en 2.1), declarar `poligono Unsupported("geometry(Polygon, 4326)")`.
2. Ejecutar `yarn prisma migrate dev --create-only --name agregar-postgis-zonas`.
3. Abrir el archivo `migration.sql` generado y añadir al final: `CREATE INDEX zones_polygon_gist ON zonas USING GIST (poligono);`.
4. Aplicar con `yarn prisma migrate deploy`.
5. Verificar con SQL: `SELECT indexname FROM pg_indexes WHERE tablename = 'zonas';` muestra `zones_polygon_gist`.

**Entregables**
- Migración `agregar-postgis-zonas` con SQL editado.
- Columna `zonas.poligono geometry(Polygon, 4326)` con índice GIST.

**Criterios de aceptación**
- [ ] `\d zonas` en psql muestra `poligono` con tipo `geometry(Polygon,4326)`.
- [ ] Existe el índice `zones_polygon_gist` de tipo `gist`.
- [ ] `EXPLAIN` de una consulta `ST_Contains` sobre `zonas` usa el índice GIST.

**Referencias**
- `docs/BASE_DE_DATOS.md` § PostGIS y migraciones manuales
- `docs/ARQUITECTURA.md` § Geolocalización

---

### Tarea 2.1 — Schema Prisma: Zona, ZonaRepartidor, PuntoIntercambio, PerfilVendedor, PerfilRepartidor

**Prioridad:** 🔴 P0 · **Estimación:** 1d · **Depende de:** 2.0

**Objetivo**
Modelar las entidades geográficas y de perfiles no-admin, generando la migración inicial de Fase 2.

**Descripción detallada**
Se añaden al `schema.prisma` los modelos `PerfilVendedor`, `PerfilRepartidor`, `PuntoIntercambio`, `Zona`, `ZonaRepartidor` (tabla intermedia N:M entre repartidor y zona con flag `esPrimaria`). Se respetan los nombres y campos exactos de `BASE_DE_DATOS.md`. La columna `poligono` en `Zona` queda como `Unsupported` (la tarea 2.0 prepara la columna + índice; aquí solo declaramos el modelo completo).

**Alcance**
- **Incluye:**
  - Modelo `PerfilVendedor` con `nombreNegocio, rfc, direccion, latitud, longitud, urlLogo, saldoRecargado (Int), limiteCredito (Decimal(10,2))`.
  - Modelo `PerfilRepartidor` con `tipoVehiculo, placa, documentoIdentidad, telefonoEmergencia, disponible, latitudActual, longitudActual, ultimaUbicacionEn, calificacion (Float), totalEntregas (Int)`.
  - Modelo `PuntoIntercambio` con `nombre, direccion, latitud, longitud, activo`.
  - Modelo `Zona` con `codigo (unique), nombre, descripcion, poligono, latitudCentro, longitudCentro, puntoIntercambioId (FK), activa` + `@@index([activa])`.
  - Modelo `ZonaRepartidor` (N:M) con clave compuesta `@@id([repartidorId, zonaId])` y campo `esPrimaria`.
- **Excluye:**
  - Pedidos, eventos, comprobantes → Fase 3.

**Subtareas**
1. Añadir los 5 modelos al `schema.prisma` siguiendo las definiciones de `BASE_DE_DATOS.md`.
2. Declarar las relaciones inversas en `Usuario` (`perfilVendedor?`, `perfilRepartidor?`).
3. Generar migración: `yarn prisma migrate dev --create-only --name fase-2-zonas-perfiles`.
4. Añadir al SQL el índice GIST de la tarea 2.0 (si no se integró antes).
5. Aplicar: `yarn prisma migrate deploy`.
6. Regenerar cliente: `yarn prisma generate`.

**Entregables**
- `schema.prisma` actualizado.
- Migración `fase-2-zonas-perfiles/migration.sql`.
- Cliente Prisma regenerado.

**Criterios de aceptación**
- [ ] Las tablas `perfiles_vendedor`, `perfiles_repartidor`, `puntos_intercambio`, `zonas`, `zonas_repartidor` existen.
- [ ] `PerfilVendedor.saldoRecargado` tiene default 0.
- [ ] `Zona.codigo` tiene constraint unique.
- [ ] Relaciones `Usuario → PerfilVendedor/PerfilRepartidor` son 1-a-1 opcional.

**Referencias**
- `docs/BASE_DE_DATOS.md` § Zonas, Perfiles, Puntos intercambio

---

### Tarea 2.2 — Módulo `zonas`: CRUD + asignar repartidores + conversión GeoJSON ↔ PostGIS

**Prioridad:** 🔴 P0 · **Estimación:** 1.5d · **Depende de:** 2.1, 1.6

**Objetivo**
Permitir al admin crear/editar/listar zonas como polígonos GeoJSON desde el frontend, persistiéndolos como `geometry(Polygon, 4326)` en BD, y asignar uno o varios repartidores a cada zona.

**Descripción detallada**
El módulo vive en `src/modulos/zonas/`. Dado que Prisma no soporta nativamente `geometry` (es `Unsupported`), todas las operaciones con la columna `poligono` se hacen con `$queryRawUnsafe` y `ST_GeomFromGeoJSON` (entrada) / `ST_AsGeoJSON` (salida). El servicio expone polígonos al cliente como arrays `[{lat,lng}, ...]` y los convierte a GeoJSON `Polygon` antes de pasarlos a SQL.

**Alcance**
- **Incluye:**
  - `GET /api/v1/zonas` (todas las activas, con polígonos).
  - `POST /api/v1/zonas` (ADMIN): crea zona con `codigo, nombre, descripcion?, poligono (PuntoGeo[] min 3), puntoIntercambioId?`.
  - `GET /api/v1/zonas/:id`.
  - `PATCH /api/v1/zonas/:id` (ADMIN): actualizar campos incluyendo polígono.
  - `DELETE /api/v1/zonas/:id` (ADMIN): soft delete (`activa = false`).
  - `POST /api/v1/zonas/:id/repartidores` (ADMIN): asignar repartidores, marcar uno como primario.
  - DTOs: `PuntoGeoDto`, `CrearZonaDto`, `ActualizarZonaDto`, `AsignarRepartidoresAZonaDto`.
- **Excluye:**
  - Resolución de zona por coordenada → tarea 2.3.
  - CRUD de `PuntoIntercambio` (puede resolverse con endpoints simples dentro de este módulo o dedicado; si P0 lo exige, añadir aquí).

**Subtareas**
1. Crear módulo, controlador, servicio y DTOs.
2. `PuntoGeoDto`: `lat (@IsLatitude)`, `lng (@IsLongitude)`. `CrearZonaDto.poligono`: `@ArrayMinSize(3)`.
3. En `zonas.servicio.ts`, helper `convertirAPoligonoGeoJson(puntos: PuntoGeoDto[]): object` que cierra el anillo (primer punto = último si no lo está) y arma `{ type: 'Polygon', coordinates: [[[lng,lat]...]] }`.
4. `crear(dto)`: usa `$executeRawUnsafe` con `INSERT INTO zonas (..., poligono, ...) VALUES (..., ST_GeomFromGeoJSON($X), ...) RETURNING id`.
5. `listar()`: usa `$queryRawUnsafe` con `SELECT ..., ST_AsGeoJSON(poligono) AS poligono_geojson FROM zonas WHERE activa = true`.
6. `actualizar`: misma técnica, actualiza solo campos presentes.
7. `asignarRepartidores`: transacción — borra `ZonaRepartidor` previas de esos repartidores en la zona, inserta nuevas, marca `esPrimaria` al especificado.
8. Tests de integración con BD real (mock no sirve para PostGIS).

**Entregables**
- Módulo `zonas/` completo.
- 6 endpoints.
- DTOs listados.
- Helper `convertirAPoligonoGeoJson`.

**Criterios de aceptación**
- [ ] `POST /zonas` con polígono de 4 puntos devuelve la zona con polígono normalizado.
- [ ] `GET /zonas` retorna el polígono como `[{lat,lng}, ...]` (no GeoJSON crudo).
- [ ] Asignar un repartidor a una zona crea fila en `zonas_repartidor`.
- [ ] Marcar otro repartidor como primario desmarca al anterior.
- [ ] Crear zona con código existente retorna 409.

**Referencias**
- `docs/API_ENDPOINTS.md` § `/zonas`
- `docs/BASE_DE_DATOS.md` § Zonas
- `docs/INTEGRACION_MAPBOX.md` § Polígonos

---

### Tarea 2.3 — `GeoServicio.resolverZona(lat, lng)` con `ST_Contains`

**Prioridad:** 🔴 P0 · **Estimación:** 1d · **Depende de:** 2.2

**Objetivo**
Exponer un servicio reutilizable (`GeoServicio`) y un endpoint `GET /zonas/resolver?lat=&lng=` que dado un punto retorna la zona activa que lo contiene, usando el índice GIST para ser O(log n).

**Descripción detallada**
Este servicio es crítico porque lo consume toda la Fase 3 al crear pedidos (para determinar zona origen/destino). Se implementa en `src/modulos/zonas/geo.servicio.ts` con un método `async resolverZona(lat: number, lng: number): Promise<Zona | null>`. La consulta usa `$queryRaw` con `ST_SetSRID(ST_MakePoint(lng, lat), 4326)` y `ST_Contains`. Resultado cacheado en Redis con key `zona:lat:lng` y TTL 5 min (opcional, optimización).

**Alcance**
- **Incluye:**
  - `GeoServicio.resolverZona(lat, lng)`.
  - `GET /api/v1/zonas/resolver?lat=&lng=`.
  - Excepción custom `PuntoFueraDeZona` si el punto no pertenece a ninguna zona.
  - Caché opcional en Redis.
- **Excluye:**
  - Reverse geocoding general → tarea de Mapbox (no incluida en MVP salvo indicación).

**Subtareas**
1. Crear `src/modulos/zonas/geo.servicio.ts`.
2. Implementar `resolverZona`: `SELECT id, codigo, nombre FROM zonas WHERE activa = true AND ST_Contains(poligono, ST_SetSRID(ST_MakePoint($1, $2), 4326)) LIMIT 1`.
3. Exponerlo en `ZonasModulo` con `exports: [GeoServicio]` para que otros módulos lo usen.
4. Añadir endpoint `GET /zonas/resolver` en `zonas.controlador.ts` con `@Query('lat')`, `@Query('lng')` validados.
5. Si el retorno es `null`, devolver 404 con código `PUNTO_FUERA_DE_ZONA`.
6. Test de integración con 3 zonas superpuestas ligeramente, verificar que retorna la correcta (tomar la primera para el MVP).

**Entregables**
- `src/modulos/zonas/geo.servicio.ts`.
- Endpoint `GET /zonas/resolver`.
- `ZonasModulo` exporta `GeoServicio`.

**Criterios de aceptación**
- [ ] Un punto dentro de una zona retorna `{ id, codigo, nombre }`.
- [ ] Un punto fuera de todas las zonas retorna 404.
- [ ] Latencia < 50ms para 100 zonas en BD.
- [ ] `EXPLAIN ANALYZE` de la consulta usa el índice `zones_polygon_gist`.

**Referencias**
- `docs/ARQUITECTURA.md` § Geolocalización y PostGIS
- `docs/INTEGRACION_MAPBOX.md`

---

### Tarea 2.4 — Módulo `repartidores`: consultas, ubicación, disponibilidad

**Prioridad:** 🔴 P0 · **Estimación:** 1d · **Depende de:** 2.1, 1.6

**Objetivo**
Completar la creación y gestión de repartidores: endpoint de creación desde admin (con zonas), consultas del propio rider y listado admin con métricas.

**Descripción detallada**
Este módulo es el contraparte de `usuarios` pero enfocado al rol `REPARTIDOR`. Vive en `src/modulos/repartidores/`. El endpoint `POST /usuarios` (tarea 1.6) delega a este servicio para crear el `PerfilRepartidor` + relaciones `ZonaRepartidor`. También expone lectura de estado propio (`/repartidores/yo/*`) y lectura admin (`/repartidores`, `/repartidores/:id/*`).

**Alcance**
- **Incluye:**
  - `GET /api/v1/repartidores` (ADMIN) — lista con zonas y desempeño resumido.
  - `GET /api/v1/repartidores/:id/desempeno` (ADMIN).
  - `GET /api/v1/repartidores/:id/ubicacion` (ADMIN).
  - `PATCH /api/v1/repartidores/yo/disponibilidad` (REPARTIDOR).
  - Servicio `RepartidoresServicio.crearPerfil(...)` consumido por `UsuariosServicio.crear`.
  - Listados `GET /repartidores/yo/pedidos`, `/yo/recogidas-pendientes`, `/yo/entregas-pendientes` → se dejan declarados pero vacíos (implementación real en Fase 3 cuando existan pedidos).
- **Excluye:**
  - Actualización de ubicación → tarea 2.5.
  - Cierre financiero → Fase 5.

**Subtareas**
1. Crear módulo, controlador, servicio y DTOs.
2. Implementar `crearPerfil(usuarioId, dto)` que valida zonas existentes y crea `PerfilRepartidor` + `ZonaRepartidor[]` en transacción.
3. Integrar con `UsuariosServicio.crear`: cuando `rol = REPARTIDOR`, llamar a `RepartidoresServicio.crearPerfil`.
4. Implementar `listar(filtros)` con join a zonas y conteo de entregas.
5. Implementar `desempeno(id)`: `totalEntregas`, tasa de éxito (ENTREGADOS / total no cancelados), calificación promedio.
6. Implementar `cambiarDisponibilidad(yo, disponible)`.
7. Swagger tags y tests unitarios.

**Entregables**
- Módulo `repartidores/` completo.
- Endpoints listados.

**Criterios de aceptación**
- [ ] `POST /usuarios` con `rol=REPARTIDOR` crea `Usuario + PerfilRepartidor + ZonaRepartidor[]` en una transacción.
- [ ] Si una de las `zonaIds` no existe, la transacción aborta y nada se persiste.
- [ ] `PATCH /repartidores/yo/disponibilidad` con `{disponible:false}` actualiza el campo.
- [ ] `GET /repartidores/:id/desempeno` retorna estructura documentada.

**Referencias**
- `docs/API_ENDPOINTS.md` § `/repartidores`
- `docs/BASE_DE_DATOS.md` § PerfilRepartidor

---

### Tarea 2.5 — Endpoint actualización de ubicación del repartidor

**Prioridad:** 🔴 P0 · **Estimación:** 0.5d · **Depende de:** 2.4

**Objetivo**
Permitir que la app del repartidor envíe cada N segundos su ubicación actual y que el admin pueda consultarla en vivo.

**Descripción detallada**
`POST /api/v1/repartidores/yo/ubicacion` acepta `{ latitud, longitud }`, actualiza `PerfilRepartidor.{latitudActual, longitudActual, ultimaUbicacionEn}`, publica un evento interno `repartidor.ubicacion_actualizada` (para que el WebSocket gateway — si se añade en Fase 7 — lo difunda a admin). La rate limit para este endpoint se relaja a 60 req/min (una cada segundo), distinto del throttler global.

**Alcance**
- **Incluye:**
  - `POST /repartidores/yo/ubicacion` (REPARTIDOR).
  - Evento de dominio `repartidor.ubicacion_actualizada` (EventEmitter2 — el modulo se registra en Fase 6, aquí basta con emitir al stub o emitir directamente).
  - Throttle custom: `@Throttle({ default: { limit: 120, ttl: 60_000 } })`.
- **Excluye:**
  - Gateway WebSocket → tarea 7.x (mapa en vivo).
  - Persistencia histórica de posiciones (trails) → roadmap post-MVP.

**Subtareas**
1. Añadir endpoint al `repartidores.controlador.ts`.
2. Crear `ActualizarUbicacionDto` con validación lat/lng.
3. En el servicio, `UPDATE perfiles_repartidor SET latitudActual = $1, longitudActual = $2, ultimaUbicacionEn = now() WHERE id = ...`.
4. Emitir evento `repartidor.ubicacion_actualizada` con `{ repartidorId, lat, lng, ts }`.
5. Test e2e: POST + GET `/repartidores/:id/ubicacion` retorna los valores.

**Entregables**
- Endpoint `POST /repartidores/yo/ubicacion`.
- Evento de dominio emitido.

**Criterios de aceptación**
- [ ] El endpoint acepta 120 req/min y bloquea el 121.
- [ ] Tras la llamada, `GET /repartidores/:id/ubicacion` (como ADMIN) retorna las coordenadas con timestamp reciente.
- [ ] Rechaza `latitud: 200` con 400.

**Referencias**
- `docs/API_ENDPOINTS.md` § `/repartidores/yo/ubicacion`

---

### Tarea 2.6 — Tests unitarios e integración de `resolverZona`

**Prioridad:** 🟠 P1 · **Estimación:** 0.5d · **Depende de:** 2.3

**Objetivo**
Blindar la resolución de zona con tests que ejerciten casos de borde: punto dentro, fuera, en frontera, zona con hueco (si aplica), zona inactiva.

**Descripción detallada**
Tests de integración en `backend/test/e2e/geo.e2e-spec.ts` que insertan 3 zonas con polígonos conocidos vía `$executeRawUnsafe` directamente (no via HTTP) y luego consultan el endpoint `GET /zonas/resolver` con distintos puntos. Los tests unitarios prueban el helper `convertirAPoligonoGeoJson` con entradas malformadas.

**Alcance**
- **Incluye:**
  - Tests e2e para `ST_Contains` con zonas reales en BD de test.
  - Tests unitarios para helpers de conversión GeoJSON.
- **Excluye:**
  - Tests de rendimiento/carga → Fase 10.

**Subtareas**
1. Setup: en `beforeAll`, insertar 3 zonas fijas.
2. Test "punto dentro de zona A" → retorna A.
3. Test "punto fuera de todas" → 404.
4. Test "punto en intersección de A y B" → retorna una (documentar cuál).
5. Test "punto dentro pero zona inactiva" → 404.
6. Test unitario: polígono con < 3 puntos es rechazado por DTO.

**Entregables**
- `backend/test/e2e/geo.e2e-spec.ts`.
- `backend/test/unit/zonas.servicio.spec.ts`.

**Criterios de aceptación**
- [ ] `yarn test:e2e geo` pasa los 5 tests.
- [ ] Los tests limpian las zonas insertadas en `afterAll`.

**Referencias**
- `docs/BASE_DE_DATOS.md` § PostGIS

---

**Navegación:** [← Fase 1 — Backend base y Autenticación](./fase-01-backend-base-autenticacion.md) · [Índice](../PLAN_DE_TAREAS_DETALLADO.md) · [Fase 3 — Pedidos y Máquina de Estados →](./fase-03-pedidos-maquina-estados.md)
