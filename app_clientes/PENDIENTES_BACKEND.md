# Pendientes de backend — app_clientes

Lista de elementos del rediseño Rapix Refinada que ya están visibles en la UI
pero **no tienen implementación en el backend NestJS**. Mientras no existan,
los botones/links muestran un `SnackBar` "Próximamente".

> Última actualización: 2026-05-01 (rediseño login Refinada).

## Autenticación

- [ ] **Login con Google (OAuth)**
  - **UI**: botón "Google" en `lib/caracteristicas/autenticacion/iniciar_sesion_pantalla.dart`
  - **Pendiente backend**:
    - Endpoint que reciba el `idToken` de Google y lo verifique contra Google Identity.
    - Vinculación a `Usuario` existente por email o creación de nueva cuenta.
    - Devolver el mismo formato de respuesta que el login con email/contraseña.
  - **Pendiente cliente Flutter** (cuando exista backend):
    - Agregar dependencia `google_sign_in`.
    - Registrar OAuth client IDs en `android/app/build.gradle` y `ios/Runner/Info.plist`.
    - Conectar al `autenticacionControladorProvider` con un método `iniciarSesionGoogle()`.

- [ ] **Login con Apple (OAuth)**
  - **UI**: botón "Apple" en `lib/caracteristicas/autenticacion/iniciar_sesion_pantalla.dart`
  - **Pendiente backend**:
    - Endpoint que reciba el `identityToken` y `authorizationCode` de Apple.
    - Verificación contra Apple ID Service y mapeo a `Usuario`.
  - **Pendiente cliente Flutter**:
    - Agregar dependencia `sign_in_with_apple`.
    - Registrar capability "Sign In with Apple" en Apple Developer Portal y Xcode.
    - Solo es obligatorio en iOS si la app ofrece otros métodos de OAuth (regla de App Store).

- [ ] **Recuperación de contraseña**
  - **UI**: link "¿Olvidaste tu contraseña?" en `lib/caracteristicas/autenticacion/iniciar_sesion_pantalla.dart`
  - **Pendiente backend**:
    - Endpoint `POST /autenticacion/solicitar-recuperacion` (recibe email, genera token de un solo uso, envía email vía SMTP).
    - Endpoint `POST /autenticacion/restablecer-contrasena` (recibe token + nueva contraseña).
    - Tabla/columna para tokens de recuperación con expiración.
  - **Pendiente cliente Flutter**:
    - Pantalla de solicitud (input de email) en `/recuperar-contrasena`.
    - Pantalla de reset con token desde deep link.
    - Agregar rutas al `enrutador_app.dart`.

## Crear pedido (destino)

- [ ] **Búsqueda de direcciones (geocoding)**
  - **UI**: barra de búsqueda flotante sobre el mapa preview en `lib/caracteristicas/pedidos/crear_pedido_pantalla.dart` (`_MapaPreview`).
  - **Pendiente backend**: endpoint que envuelva Mapbox Geocoding (o Google Places) para evitar exponer el token al cliente. Recibe query, devuelve sugerencias con `direccion`, `lat`, `lng`.
  - **Cambio adicional**: una vez exista, el flujo de URL de Google Maps puede dejar de ser obligatorio (el destino se guarda directamente con `lat`/`lng`).

- [ ] **Selección por GPS ("Mi ubicación")**
  - **UI**: chip "Mi ubicación" en la sección Destino.
  - **Pendiente backend**: aceptar `lat`/`lng` del destino sin URL de Google Maps obligatoria. Hoy `urlMapasDestino` es requerida y validada con regex `^https://maps\.app\.goo\.gl/...$`.
  - **Pendiente cliente Flutter**: integrar `geolocator` (ya en `pubspec.yaml`) para leer la posición y enviarla al endpoint de creación.

- [ ] **Mapa interactivo para arrastrar pin**
  - **UI**: el `_MapaPreview` actual es decorativo (gradiente + calles pintadas + pin estático).
  - **Pendiente cliente Flutter**: reemplazar por un widget Mapbox real con pin draggable centrado, callback al detener el arrastre que actualice el destino.
  - **Pendiente backend**: mismo cambio de aceptar `lat`/`lng` del item anterior.

## Inicio (dashboard)

- [ ] **Notificaciones**
  - **UI**: ícono de campana en la AppBar de `lib/caracteristicas/inicio/inicio_pantalla.dart`. El diseño Refinada muestra un badge con conteo (ej. "2") que aún no se renderiza por falta de fuente de datos.
  - **Pendiente backend**: tabla/endpoint `/notificaciones` (listar, marcar leída, conteo de no leídas). Push via FCM ya está integrado pero sin pantalla in-app que liste el historial.
  - **Pendiente cliente Flutter**: pantalla `/notificaciones`, provider de conteo de no leídas, badge sobre el ícono.

- [ ] **Endpoint dedicado de métricas del dashboard**
  - **UI**: tarjetas de "En tránsito", "Entregados hoy", "Pendientes", "Esta semana" en el dashboard.
  - **Estado actual**: las métricas se calculan en el cliente recorriendo el listado completo de pedidos del vendedor (`pedidosRepositorioProvider.listarMios()` sin filtros), lo cual no escala con muchos pedidos históricos.
  - **Pendiente backend**: endpoint `GET /pedidos/metricas/dashboard` que devuelva los conteos pre-calculados (`enTransito`, `entregadosHoy`, `pendientes`, `estaSemana`) usando agregaciones SQL. Idealmente que use el `creadoEn` real para "esta semana" y la fecha de cambio a `ENTREGADO` (de la tabla de eventos) para "entregados hoy" — hoy el cliente aproxima "entregados hoy" con `creadoEn`, lo que subestima los pedidos que se crearon ayer y se entregaron hoy.

## Listado de pedidos

- [ ] **Filtro compuesto "Activos"**
  - **UI**: el diseño Refinada original incluía una pill "Activos" que agrupa varios estados (`PENDIENTE_ASIGNACION`, `ASIGNADO`, `RECOGIDO`, `EN_TRANSITO`, `EN_REPARTO`).
  - **Estado actual**: las pills mapean 1:1 a estados individuales del enum (Pendientes, Asignados, En tránsito, En reparto, Entregados, Fallidos) porque el endpoint solo acepta un `estado` por consulta.
  - **Pendiente backend**: aceptar `estado` como array (`?estado[]=PENDIENTE_ASIGNACION&estado[]=ASIGNADO…`) o un parámetro `vista=activos` que el servidor traduzca a la unión de estados.

- [ ] **Conteos por estado para badges en pills**
  - **UI**: el diseño muestra el número de pedidos en cada pill (ej. "Todos 47", "Activos 8"). Hoy las pills no muestran conteos.
  - **Pendiente backend**: endpoint `GET /pedidos/conteo-estados` que devuelva `{ total, por_estado: { PENDIENTE_ASIGNACION: n, ... } }` para los pedidos del vendedor autenticado.

- [ ] **Búsqueda full-text en backend**
  - **UI**: barra de búsqueda en `pedidos_listado_pantalla.dart`, hoy filtra **client-side** sobre la lista ya descargada (código, cliente, dirección).
  - **Limitación**: solo encuentra coincidencias en pedidos ya cargados; con paginación o muchos pedidos se pierden resultados.
  - **Pendiente backend**: parámetro `?q=` que haga `ILIKE` o full-text search sobre `codigoSeguimiento`, `nombreCliente`, `direccionDestino`. Mismo endpoint `listarMios`.

- [ ] **ETA real para pedidos en ruta**
  - **UI**: en cada tarjeta, los estados `EN_REPARTO` y `EN_TRANSITO` muestran texto fijo ("ETA cercana" / "En camino") en verde porque no hay ETA real.
  - **Pendiente backend**: campo `etaMinutos` o `etaTimestamp` calculado server-side a partir de la posición del repartidor y la ruta — ya hay coordenadas del repartidor en `RepartidorAsignado.ubicacionActual`, falta el cálculo.

## Detalle de pedido

- [ ] **Compartir tracking público**
  - **UI**: ícono de compartir en el AppBar de `lib/caracteristicas/pedidos/pedido_detalle_pantalla.dart`.
  - **Pendiente cliente Flutter**: agregar dependencia `share_plus` y compartir la URL pública del seguimiento (`/seguimiento/<codigoSeguimiento>` apuntando al dominio del frontend cliente).
  - **Pendiente backend**: definir y publicar la URL pública estable del seguimiento (probablemente la pantalla `seguimiento` del proyecto admin/web). Ver también la pantalla `lib/caracteristicas/seguimiento/`.

- [ ] **Llamar al repartidor**
  - **UI**: botón teléfono en la tarjeta del repartidor.
  - **Backend**: OK (`RepartidorAsignado.telefono` ya viene en la respuesta).
  - **Pendiente cliente Flutter**: agregar `url_launcher`, lanzar `tel:<telefono>` y declarar permisos en `AndroidManifest.xml` (`<queries>` con `intent action="android.intent.action.DIAL"`) e `Info.plist`.

- [ ] **Mensaje al repartidor (WhatsApp / SMS)**
  - **UI**: botón mensaje en la tarjeta del repartidor.
  - **Backend**: OK.
  - **Pendiente cliente Flutter**: con `url_launcher`, abrir `https://wa.me/<telefono>` o `sms:<telefono>` con fallback. Documentar la decisión de UX (¿siempre WhatsApp? ¿menú con opciones?).

- [ ] **Rating del repartidor**
  - **UI**: el diseño Refinada muestra "4.9 ★ · Moto azul · P-2847" debajo del nombre.
  - **Estado actual**: la tarjeta solo muestra `nombreCompleto` + `telefono`.
  - **Pendiente backend**: agregar `rating` (promedio de calificaciones) al payload de `RepartidorAsignado`. Requiere una tabla de calificaciones de pedidos por parte del cliente vendedor.

- [ ] **Vehículo del repartidor (placa, tipo)**
  - **UI**: el diseño muestra "Moto P-2847".
  - **Estado actual**: el modelo `RepartidorAsignado` no tiene `vehiculo`.
  - **Pendiente backend**: incluir `vehiculo: { tipo, placa, descripcion }` en el payload del repartidor asignado (los datos ya existen en el perfil del usuario REPARTIDOR; falta exponerlos al cliente vendedor).

## Notas

- El login con email + contraseña ya funciona contra el backend actual y se mantiene
  como flujo principal.
- En "Crear pedido" se mantiene el campo `URL DE GOOGLE MAPS` y el chip "Pegar link"
  funcional (lee del portapapeles) hasta que existan los endpoints de geocoding/GPS.
- Cuando se implemente cualquier item, eliminarlo de esta lista y borrar el
  `SnackBar` "Próximamente" correspondiente.
