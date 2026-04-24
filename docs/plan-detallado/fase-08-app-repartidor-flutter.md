# Fase 8 — App Repartidor (Flutter)

> 📖 [← Volver al índice](../PLAN_DE_TAREAS_DETALLADO.md) · **Fase 8 de 10**

**Duración:** Semana 12 · **Esfuerzo:** 10 p-d · **Entregable global:** Repartidor opera 100% desde la app móvil: ver pedidos, recogerlos, entregarlos con foto/firma, hacer cierre diario.

---

### Tarea 8.1 — Scaffold Flutter + Riverpod + go_router

**Prioridad:** 🔴 P0 · **Estimación:** 0.5d · **Depende de:** 0.1, 0.4, 0.5

**Objetivo**
Crear proyecto Flutter `app-repartidor/` con dependencias base configuradas y estructura de carpetas lista.

**Alcance**
- **Incluye:**
  - `flutter create app-repartidor`.
  - Dependencias en `pubspec.yaml`: `flutter_riverpod, go_router, dio, flutter_secure_storage, intl, freezed_annotation, json_annotation, permission_handler, connectivity_plus`.
  - Dev deps: `build_runner, freezed, json_serializable`.
  - Estructura `lib/{main.dart, app.dart, core, data, features, services, widgets}`.
  - `analysis_options.yaml`.
  - `core/config/entorno.dart`, `core/router/enrutador_app.dart`, `core/theme/tema_app.dart`.
- **Excluye:**
  - Features → tareas siguientes.

**Subtareas**
1. `flutter create app-repartidor --platforms=android,ios`.
2. Añadir dependencias.
3. Crear estructura de carpetas.
4. `core/config/entorno.dart` con `String.fromEnvironment('API_URL', defaultValue: 'http://10.0.2.2:3000/api/v1')`.
5. `enrutador_app.dart` con `GoRouter` vacío.
6. `ProviderScope` en `main.dart`.

**Entregables**
- Proyecto Flutter con scaffold.

**Criterios de aceptación**
- [ ] `flutter run` levanta en emulador Android con pantalla placeholder.
- [ ] `dart analyze` 0 issues.

**Referencias**
- `docs/GUIA_APP_RIDERS.md` § Stack y estructura

---

### Tarea 8.2 — Login + almacenamiento seguro de tokens

**Prioridad:** 🔴 P0 · **Estimación:** 1d · **Depende de:** 8.1, 1.3

**Objetivo**
Pantalla login, `DioCliente` con interceptores de auth y error, almacenamiento seguro de tokens.

**Alcance**
- **Incluye:**
  - `core/network/dio_cliente.dart` con `Dio` configurado + interceptores.
  - `core/network/interceptor_autenticacion.dart` que lee token de `flutter_secure_storage` y añade `Authorization: Bearer`.
  - `core/network/interceptor_error.dart` que refresca 401.
  - `core/storage/almacenamiento_seguro.dart`.
  - `features/autenticacion/pantalla_inicio_sesion.dart` con form.
  - `features/autenticacion/controlador_autenticacion.dart` (Riverpod).
  - Repositorio `data/repositories/autenticacion_repositorio.dart`.
- **Excluye:**
  - Registro → no aplica a rider.

**Subtareas**
1. Instalar deps (ya en 8.1).
2. Implementar `DioCliente.crear()`.
3. Implementar interceptores y almacenamiento.
4. Pantalla login con validaciones.
5. Controlador Riverpod que maneja estados: `AsyncValue<Usuario?>`.
6. Ruta `/login` + guard en `enrutador_app.dart` (redirige si no autenticado).
7. Tests unitarios del repositorio.

**Entregables**
- Archivos listados.

**Criterios de aceptación**
- [ ] Login exitoso guarda tokens en SecureStorage y navega a `/inicio`.
- [ ] Cerrar app y reabrir mantiene sesión (token válido).
- [ ] 401 en request dispara refresh y reintenta una vez.

**Referencias**
- `docs/GUIA_APP_RIDERS.md` § Autenticación

---

### Tarea 8.3 — Lista de pedidos asignados (recolección/entrega)

**Prioridad:** 🔴 P0 · **Estimación:** 1.5d · **Depende de:** 8.2, 2.4, 3.6

**Objetivo**
Pantallas que listan los pedidos pendientes de recoger y los pendientes de entregar, con estados actualizándose al consumir endpoints `/repartidores/yo/recogidas-pendientes` y `/entregas-pendientes`.

**Alcance**
- **Incluye:**
  - `features/recogidas/pantalla_lista_recogidas.dart`.
  - `features/entregas/pantalla_lista_entregas.dart`.
  - `features/inicio/pantalla_inicio.dart` con `BottomNavigationBar`.
  - `widgets/tarjeta_pedido.dart`.
  - Providers Riverpod para cada lista (pull-to-refresh).
- **Excluye:**
  - Detalle con acciones → tarea 8.5.

**Subtareas**
1. Crear `PedidosRepositorio` con métodos `recogidasPendientes`, `entregasPendientes`, `pedidoPorId`.
2. Crear providers.
3. Pantallas con `ListView.builder`.
4. Estados loading/empty/error con `AsyncValue.when`.

**Entregables**
- Pantallas y widgets.

**Criterios de aceptación**
- [ ] Tras login, la lista muestra pedidos `ASIGNADO` del rider.
- [ ] Pull-to-refresh actualiza.

**Referencias**
- `docs/GUIA_APP_RIDERS.md` § Pantallas

---

### Tarea 8.4 — Mapa con Mapbox + ruta óptima

**Prioridad:** 🔴 P0 · **Estimación:** 1.5d · **Depende de:** 8.3, 2.5

**Objetivo**
Pantalla mapa que muestra los waypoints del rider (origen, destino, punto intercambio) con ruta optimizada obtenida de `/mapas/optimizar-ruta`.

**Alcance**
- **Incluye:**
  - `features/mapa/pantalla_mapa_ruta.dart` con `mapbox_maps_flutter`.
  - `services/servicio_ubicacion.dart` para obtener posición actual.
  - Consumir endpoint `/mapas/optimizar-ruta` (backend crea Mapbox proxy en Fase 3 si no está todavía; si falta, añadir una tarea backend o hacer fallback a Directions API directo temporalmente).
  - Render de la ruta como polyline decodificada.
- **Excluye:**
  - Navegación turn-by-turn → post-MVP.

**Subtareas**
1. Añadir `mapbox_maps_flutter` a `pubspec.yaml`.
2. Configurar `MapboxOptions.setAccessToken(Entorno.tokenMapbox)` en `main.dart`.
3. Crear widget mapa con `MapWidget`.
4. Implementar `MapasRepositorio.optimizarRuta`.
5. Decodificar polyline y dibujar como `PolylineAnnotationManager`.
6. Añadir `PointAnnotationManager` para los waypoints.

**Entregables**
- Pantalla mapa.
- `MapasRepositorio`.

**Criterios de aceptación**
- [ ] Con 3 pedidos asignados, la ruta se dibuja con 3 waypoints ordenados.

**Referencias**
- `docs/GUIA_APP_RIDERS.md` § Mapa
- `docs/INTEGRACION_MAPBOX.md`

---

### Tarea 8.5 — Acciones: recoger, llegar al punto, entregar

**Prioridad:** 🔴 P0 · **Estimación:** 1d · **Depende de:** 8.3, 3.6

**Objetivo**
Pantallas de detalle con botones que invocan los endpoints rider (`/recoger`, `/en-transito`, `/llegar-intercambio`, `/tomar-entrega`, `/fallar`).

**Alcance**
- **Incluye:**
  - `features/recogidas/pantalla_detalle_recogida.dart`.
  - `features/entregas/pantalla_detalle_entrega.dart`.
  - Acciones con confirmación modal.
  - Captura de ubicación al momento de la acción.
- **Excluye:**
  - Pantalla comprobante de entrega → tarea 8.6.

**Subtareas**
1. Pantallas de detalle.
2. Métodos en `PedidosRepositorio`: `recoger`, `enTransito`, `llegarIntercambio`, `tomarEntrega`, `fallar`.
3. Bottom sheets de confirmación.
4. Refresh de lista tras éxito.

**Entregables**
- Pantallas y métodos.

**Criterios de aceptación**
- [ ] Clic en "Recoger" dispara POST y actualiza estado en BD.
- [ ] Error de transición inválida muestra snackbar rojo.

**Referencias**
- `docs/GUIA_APP_RIDERS.md` § Detalle pedido

---

### Tarea 8.6 — Captura de foto + firma

**Prioridad:** 🔴 P0 · **Estimación:** 1d · **Depende de:** 8.5, 3.7

**Objetivo**
Pantalla `pantalla_comprobante_entrega.dart` que captura foto con cámara, firma con pad, ubicación y nombre de quien recibe, y envía multipart a `/pedidos/:id/entregar`.

**Alcance**
- **Incluye:**
  - `image_picker` (cámara, maxWidth 1600, quality 80).
  - `signature` package para firma en canvas.
  - `geolocator` para ubicación.
  - Form con validaciones.
  - Envío multipart con Dio.
- **Excluye:**
  - OCR → post-MVP.

**Subtareas**
1. Añadir `image_picker`, `signature`, `geolocator` al pubspec.
2. Permisos Android (`CAMERA`, `ACCESS_FINE_LOCATION`) y iOS (Info.plist).
3. Pantalla con 4 secciones: foto (requerida), firma (opcional), nombre recibido, notas.
4. Submit: construir `FormData` multipart.
5. Navegar a lista tras éxito.

**Entregables**
- Pantalla comprobante.

**Criterios de aceptación**
- [ ] Sin foto, botón "Confirmar entrega" deshabilitado.
- [ ] Envío exitoso marca pedido ENTREGADO en backend.

**Referencias**
- `docs/GUIA_APP_RIDERS.md` § Comprobante

---

### Tarea 8.7 — Pantalla de cierre diario

**Prioridad:** 🔴 P0 · **Estimación:** 1d · **Depende de:** 8.2, 5.3

**Objetivo**
Pantalla donde el rider ve el resumen del día, ingresa monto reportado, sube foto del comprobante y envía cierre.

**Alcance**
- **Incluye:**
  - `features/cierre/pantalla_cierre_diario.dart`.
  - Consumir `/cierres-financieros/yo/hoy`.
  - Form con `montoReportado` (number), `notas`, `comprobanteFoto` (image_picker).
  - Envío multipart a `POST /cierres-financieros`.
- **Excluye:**
  - Historial de cierres previos → opcional.

**Subtareas**
1. `CierresRepositorio` con `resumenHoy` y `crear`.
2. Pantalla con sección "Esperado" y sección "Reportar".
3. Validaciones.
4. Manejo de 409 (`CIERRE_YA_EXISTE`).

**Entregables**
- Pantalla y repositorio.

**Criterios de aceptación**
- [ ] Enviar el cierre dos veces retorna error visible.

**Referencias**
- `docs/GUIA_APP_RIDERS.md` § Cierre

---

### Tarea 8.8 — Ubicación en background

**Prioridad:** 🟠 P1 · **Estimación:** 1d · **Depende de:** 8.2, 2.5

**Objetivo**
Reportar periódicamente (cada 30s) la ubicación del rider al backend cuando la app está en background.

**Alcance**
- **Incluye:**
  - `flutter_background_geolocation` configurado.
  - Servicio `servicio_ubicacion.dart` con métodos `iniciarRastreo`, `detenerRastreo`.
  - POST a `/repartidores/yo/ubicacion`.
- **Excluye:**
  - Geofencing → post-MVP.

**Subtareas**
1. Añadir package.
2. Solicitar permisos `ACCESS_BACKGROUND_LOCATION` (Android 10+) y iOS `always`.
3. Configurar `BackgroundGeolocation.ready` con `distanceFilter`, `stopOnTerminate: false`.
4. Listener que envía al backend con throttle 30s.

**Entregables**
- Servicio ubicación.

**Criterios de aceptación**
- [ ] Con app en background, backend recibe updates cada ~30s.

**Referencias**
- `docs/GUIA_APP_RIDERS.md` § Ubicación

---

### Tarea 8.9 — Notificaciones push (FCM)

**Prioridad:** 🔴 P0 · **Estimación:** 0.5d · **Depende de:** 8.2, 6.3, 6.7

**Objetivo**
Registrar el token FCM al loguearse, manejar notificaciones en foreground/background, navegar al pedido al tocar la notificación.

**Alcance**
- **Incluye:**
  - `firebase_core`, `firebase_messaging`, `flutter_local_notifications`.
  - `servicios/servicio_push.dart` con `iniciar()`.
  - POST `/tokens-dispositivo` al obtener token y al refrescar.
  - Canal de notif local para foreground.
- **Excluye:**
  - Deep links complejos → post-MVP.

**Subtareas**
1. `flutter pub add firebase_core firebase_messaging flutter_local_notifications`.
2. Configurar `google-services.json` (Android) y `GoogleService-Info.plist` (iOS).
3. Solicitar permisos en `iniciar()`.
4. Listeners `onMessage`, `onMessageOpenedApp`.
5. Registrar token al login.

**Entregables**
- Servicio push.

**Criterios de aceptación**
- [ ] Un push enviado desde backend abre la pantalla del pedido al tocarlo.

**Referencias**
- `docs/GUIA_APP_RIDERS.md` § Push

---

### Tarea 8.10 — Modo offline básico (cola de cambios)

**Prioridad:** 🟡 P2 · **Estimación:** 1.5d · **Depende de:** 8.5

**Objetivo**
Persistir localmente las acciones del rider cuando no hay red y reintentarlas al reconectar.

**Alcance**
- **Incluye:**
  - Cola en `Hive` o `sqflite` con entradas `{accion, pedidoId, payload, ts}`.
  - `connectivity_plus` para detectar reconexión.
  - Reintento con backoff.
- **Excluye:**
  - Resolución de conflictos complejos → out of scope (las acciones del rider son idempotentes o el backend rechaza con código claro).

**Subtareas**
1. Añadir `hive`, `hive_flutter` al pubspec.
2. Abrir box al inicio.
3. Wrapper sobre `PedidosRepositorio` que encola si falla por red.
4. Listener de conectividad que procesa la cola.

**Entregables**
- Cola local + wrapper.

**Criterios de aceptación**
- [ ] Sin red, acción "recoger" queda en cola; al reconectar, se envía automáticamente.

**Referencias**
- `docs/GUIA_APP_RIDERS.md` § Offline

---

**Navegación:** [← Fase 7 — Panel Admin (Angular)](./fase-07-panel-admin-angular.md) · [Índice](../PLAN_DE_TAREAS_DETALLADO.md) · [Fase 9 — App Vendedor/Cliente (Flutter) →](./fase-09-app-vendedor-cliente-flutter.md)
