# Documentación de pantallas — `app_clientes` (Rapix)

> **Audiencia**: este documento es insumo para un modelo de diseño UI/UX (Claude Design). Está estructurado para ser fácilmente transformable en wireframes, flujos y mejoras visuales.
>
> **Convenciones**:
> - Los strings de UI se reportan **tal cual aparecen en el código** (sin tildes en muchos casos, según convención del proyecto).
> - Las observaciones inferidas se marcan explícitamente como **(supuesto)**.
> - Las rutas de archivo son relativas a `app_clientes/`.

---

## Índice

| # | Pantalla | Ruta | Acceso |
|---|----------|------|--------|
| 1 | [Iniciar sesión](#1-iniciar-sesión) | `/iniciar-sesion` | Pública |
| 2 | [Registrar (crear cuenta de vendedor)](#2-registrar-crear-cuenta-de-vendedor) | `/registrar` | Pública |
| 3 | [Selector de ubicación](#3-selector-de-ubicación) | `/seleccionar-ubicacion` | Pública (modal) |
| 4 | [Inicio (dashboard)](#4-inicio-dashboard) | `/inicio` | Autenticada |
| 5 | [Listado de pedidos](#5-listado-de-pedidos) | `/pedidos` | Autenticada |
| 6 | [Crear pedido](#6-crear-pedido) | `/pedidos/nuevo` | Autenticada |
| 7 | [Detalle de pedido](#7-detalle-de-pedido) | `/pedidos/:id` | Autenticada |
| 8 | [Mis paquetes](#8-mis-paquetes) | `/paquetes` | Autenticada |
| 9 | [Tienda de paquetes](#9-tienda-de-paquetes) | `/paquetes/tienda` | Autenticada |
| 10 | [Mi perfil](#10-mi-perfil) | `/perfil` | Autenticada |
| 11 | [Editar negocio](#11-editar-negocio) | `/perfil/editar-negocio` | Autenticada |
| 12 | [Seguimiento público](#12-seguimiento-público) | `/seguimiento/:codigo` | Pública (deep link) |

**Componentes globales** descritos al final:
- [Esqueleto de navegación](#esqueleto-de-navegación-tab-bar) — barra inferior persistente
- [SaldoWidget](#saldowidget) — tarjeta de saldo de envíos
- [EstadoChip](#estadochip) — badge coloreado de estado de pedido
- [PedidoTarjeta](#pedidotarjeta), [LineaTiempoEstado](#lineatiempoestado), [MapaSeguimientoVivo](#mapaseguimientovivo)

---

## Convenciones generales del proyecto

### Stack y patrones detectados

- **Framework**: Flutter + Dart, Material Design 3.
- **Estado**: Riverpod (`ConsumerWidget`, `ConsumerStatefulWidget`, `Provider`, `FutureProvider`, `StateProvider`).
- **Navegación**: `go_router` con `StatefulShellRoute.indexedStack` (ramas independientes por tab).
- **Mapas**: `mapbox_maps_flutter` (token vía `Entorno.tokenMapbox`); fallback manual cuando no hay token.
- **HTTP**: `Dio` con interceptores de autenticación y error.
- **Imágenes**: `image_picker` (cámara/galería); subida multipart.

### Esquema de rutas y guard de autenticación

Definido en `lib/nucleo/enrutador/enrutador_app.dart`:

- Rutas **públicas**: `/iniciar-sesion`, `/registrar`, `/seleccionar-ubicacion`, `/seguimiento/:codigo`.
- Si el usuario **no está autenticado** y entra a una ruta no pública → redirige a `/iniciar-sesion`.
- Si el usuario **está autenticado** y entra a `/iniciar-sesion` o `/registrar` → redirige a `/inicio`.
- `initialLocation`: `/inicio`.
- 4 ramas con `StatefulShellBranch` (envueltas en `EsqueletoNavegacion`): `/inicio`, `/pedidos`, `/paquetes`, `/perfil`.

### Patrones globales de UX

- **Pull-to-refresh**: en listados (`/pedidos`, `/paquetes`) y detalle (`/pedidos/:id`, `/seguimiento/:codigo`).
- **Feedback de errores**: `SnackBar` con mensaje extraído de `DioException` (campo `mensaje` o `message` del JSON de respuesta) o fallback genérico.
- **Loaders**: `CircularProgressIndicator` centrado al cargar; spinner pequeño (20×20, strokeWidth 2) dentro de botones durante envíos.
- **Validación de formularios**: `Form` con `GlobalKey<FormState>` y `validator` por campo; bloqueo de doble envío con bandera `_enviando` o `estado.cargando`.
- **Idioma**: español sin tildes en identificadores y muchos strings de UI.

---

# Pantallas

## 1. Iniciar sesión

- **Clase Dart**: `IniciarSesionPantalla` (`ConsumerStatefulWidget`)
- **Ruta**: `/iniciar-sesion`
- **Archivo**: `lib/caracteristicas/autenticacion/iniciar_sesion_pantalla.dart`
- **Acceso**: pública

### Propósito
Pantalla de entrada principal a la aplicación. Permite que vendedores existentes inicien sesión con email y contraseña, o accedan al flujo de registro.

### Layout

- Encabezado con icono `Icons.local_shipping_outlined` (64 px, color primario).
- Título: **"Bienvenido"** (`headlineSmall`).
- Subtítulo: **"Inicia sesion para gestionar tus pedidos"**.
- Formulario centrado (ancho máximo 420 px), padding 24, scroll para pantallas pequeñas.

### Campos de entrada

| Campo | Tipo | Label / Hint | Validaciones | Requerido |
|-------|------|--------------|--------------|-----------|
| Email | `email` (`TextInputType.emailAddress`) | Label: **"Correo electronico"** · prefixIcon: email_outlined · autofill: email | Vacío → **"Ingresa tu correo"** · Sin `@` → **"Correo invalido"** · trim antes de enviar | Sí |
| Contraseña | `password` (`obscureText` con toggle) | Label: **"Contrasena"** · prefixIcon: lock_outline · suffixIcon dinámico (visibility / visibility_off) | Vacía → **"Ingresa tu contrasena"** | Sí |

### Acciones disponibles

| Acción | Texto visible | Comportamiento | Navegación |
|--------|---------------|----------------|------------|
| Toggle ver contraseña | Icono eye | Alterna `obscureText` (state local `_verContrasena`) | — |
| Botón principal | **"Iniciar sesion"** (`FilledButton`) | Valida form → llama `autenticacionControlador.iniciarSesion(email.trim(), contrasena)`. Mientras carga, reemplaza texto por spinner | `go('/inicio')` si éxito |
| Botón secundario | **"Crear cuenta de vendedor"** (`TextButton`) | Navega al registro | `push('/registrar')` |

### Navegación

- **Se llega desde**: ruta inicial cuando el usuario no está autenticado; tras `cerrarSesion()` desde `/perfil`.
- **Navega hacia**: `/inicio` (login OK), `/registrar` (crear cuenta).

### Estados posibles

- **Inicial**: campos vacíos, botón habilitado.
- **Cargando** (`estado.cargando == true`): botón principal deshabilitado y muestra spinner.
- **Error de validación cliente**: mensaje rojo bajo el campo correspondiente.
- **Error servidor** (`estado.error != null`): `SnackBar` con mensaje. Mapeo desde `autenticacion_controlador.dart`:
  - 401 → **"Credenciales invalidas"**
  - Genérico → **"No fue posible completar la operacion. Intenta de nuevo."**
- **Éxito**: navegación a `/inicio` (sin mensaje).

### Notas UX/UI

- **Toggle de contraseña**: bien resuelto, evita reescribir.
- **Autofocus**: no explícito en código *(supuesto)*: el OS pone foco en el primer campo.
- **Gap funcional (supuesto)**: no existe enlace **"¿Olvidaste tu contraseña?"**. Es una omisión típica que conviene cubrir.
- **Validación débil de email (supuesto)**: solo se exige que contenga `@`; podría reforzarse con regex estándar.
- `SafeArea` y `ConstrainedBox(maxWidth: 420)` para tablets/landscape.

---

## 2. Registrar (crear cuenta de vendedor)

- **Clase Dart**: `RegistrarPantalla` (`ConsumerStatefulWidget`)
- **Ruta**: `/registrar`
- **Archivo**: `lib/caracteristicas/autenticacion/registrar_pantalla.dart`
- **Acceso**: pública

### Propósito
Formulario de alta de nuevo vendedor. Captura datos personales, credenciales, datos del negocio y ubicación geográfica del local (vía mapa). Aplica validaciones robustas, sobre todo de contraseña.

### Layout

- `AppBar` con título **"Crear cuenta de vendedor"**.
- `SingleChildScrollView` con padding 24.
- Dos secciones separadas por `Divider(height: 32)`:
  1. Datos personales (nombre, email, teléfono, contraseña).
  2. **Datos de la tienda** (titulo `titleMedium`): nombre, dirección, ubicación.

### Campos de entrada

| Campo | Tipo | Label / Hint | Validaciones | Requerido |
|-------|------|--------------|--------------|-----------|
| Nombre completo | text (`TextCapitalization.words`) | Label: **"Nombre completo"** · icon: person_outline | `length < 2` → **"Requerido"** | Sí |
| Correo electrónico | email | Label: **"Correo electronico"** · icon: email_outlined | Sin `@` → **"Correo invalido"** | Sí |
| Teléfono | phone | Label: **"Telefono"** · hint: **"+50370001234"** · icon: phone_outlined | Regex `^\+?[0-9]{8,15}$` → **"8-15 digitos, opcional con +"** | Sí |
| Contraseña | password (`obscureText`) | Label: **"Contrasena"** · icon: lock_outline · helper: **"8+ chars, mayuscula, numero y simbolo"** | `length < 8` → **"Minimo 8 caracteres"** · sin `[A-Z]` → **"Debe incluir una mayuscula"** · sin `[0-9]` → **"Debe incluir un numero"** · sin `[^A-Za-z0-9]` → **"Debe incluir un simbolo"** | Sí |
| Nombre del negocio | text (`TextCapitalization.words`) | Label: **"Nombre del negocio"** · icon: storefront_outlined | Trim vacío → **"Requerido"** | Sí |
| Dirección | text | Label: **"Direccion"** · icon: place_outlined | Trim vacío → **"Requerido"** | Sí |
| Ubicación de la tienda | location (Card+ListTile) | Title sin selección: **"Seleccionar ubicacion en mapa"** · con selección: **"Ubicacion seleccionada"** + subtítulo `"(lat.toFixed(5), lng.toFixed(5))"` · trailing: chevron_right | Si `null` al enviar → SnackBar **"Selecciona la ubicacion de la tienda"** | Sí |

### Acciones disponibles

| Acción | Texto visible | Comportamiento | Navegación |
|--------|---------------|----------------|------------|
| Tap en card de ubicación | (Card "Seleccionar ubicacion en mapa") | Abre `SelectorUbicacionPantalla` con `extra: {titulo: "Ubicacion de la tienda --", inicial: <Point?>}` y espera retorno | `push<mb.Point>('/seleccionar-ubicacion', ...)` → vuelve con `Point` |
| Botón principal | **"Crear cuenta"** (`FilledButton`) | Valida form + presencia de ubicación → llama `autenticacionControlador.registrar(...)` con lat/lng del Point. Spinner durante envío | `go('/inicio')` si éxito |
| Volver (AppBar) | flecha atrás | Pop a `/iniciar-sesion` | — |

### Navegación

- **Se llega desde**: botón **"Crear cuenta de vendedor"** en `/iniciar-sesion`.
- **Navega hacia**: `/seleccionar-ubicacion` (modal con retorno), `/inicio` (registro OK).

### Estados posibles

- **Inicial**: campos vacíos, ubicación no seleccionada, botón habilitado.
- **Cargando**: botón muestra spinner; campos siguen visibles.
- **Error de validación de ubicación**: SnackBar **"Selecciona la ubicacion de la tienda"** antes de tocar backend.
- **Error servidor**: SnackBar con mensaje del controlador (401, 409, `PEDIDO_ZONA_INVALIDA`, genérico).
- **Éxito**: navegación a `/inicio`.

### Notas UX/UI

- **Helper text de contraseña**: estático **"8+ chars, mayuscula, numero y simbolo"**. *(supuesto)*: añadir un **medidor visual de fortaleza** (rojo→verde) y/o checks animados que se marquen en cuanto cada requisito se cumple bajaría la fricción.
- **Sin confirmación de contraseña** *(supuesto)*: típico para evitar typos en alta. Considerar agregar.
- **Coordenadas mostradas con 5 decimales** una vez seleccionada la ubicación.
- **Título extra del selector**: `"Ubicacion de la tienda --"` (con `" --"` al final, probablemente artefacto). *(supuesto)*: limpiar a `"Ubicacion de la tienda"`.

---

## 3. Selector de ubicación

- **Clase Dart**: `SelectorUbicacionPantalla` (`StatefulWidget`)
- **Ruta**: `/seleccionar-ubicacion`
- **Archivo**: `lib/caracteristicas/autenticacion/selector_ubicacion_pantalla.dart`
- **Acceso**: pública (modal reutilizable que retorna `mb.Point`)

### Propósito
Modal interactivo para elegir una ubicación geográfica con un mapa Mapbox (pin fijo en el centro mientras el usuario mueve el mapa). Si Mapbox no está configurado, ofrece **fallback manual** para introducir lat/lng.

### Parámetros

- `titulo` (String, default **"Seleccionar ubicacion"**): título del `AppBar`.
- `inicial` (`mb.Point?`): centro inicial; si es `null`, usa `Entorno.latitudInicial` / `Entorno.longitudInicial`.

### Layout — modo Mapbox (token disponible)

- `AppBar` con `widget.titulo`.
- `Stack`:
  1. `MapWidget` ocupando toda la pantalla (zoom inicial 15).
  2. **Pin central fijo**: `Icons.location_pin` (rojo, 56 px) envuelto en `IgnorePointer`, padding inferior 32. El pin no se mueve; el usuario mueve el mapa para alinear la ubicación deseada bajo el pin.
  3. **Bottom card flotante**: muestra `(lat.toFixed(5), lng.toFixed(5))` y botón principal.

### Layout — modo fallback (sin token)

- Card de advertencia con texto: **"Mapbox no esta configurado. Ingresa las coordenadas manualmente o establece MAPBOX_TOKEN al compilar."**
- Dos `TextField` numéricos (decimal con signo): **"Latitud"** y **"Longitud"**.
- Botón **"Confirmar ubicacion"**.

### Campos de entrada

| Campo | Tipo | Label | Validaciones | Requerido |
|-------|------|-------|--------------|-----------|
| Mapa (centro) | mapa interactivo | — | El centro siempre tiene un valor; no hay validador formal | Sí (modo mapa) |
| Latitud (fallback) | número (signed, decimal) | **"Latitud"** | `double.tryParse`; si `null`, no hace nada | Sí (fallback) |
| Longitud (fallback) | número (signed, decimal) | **"Longitud"** | `double.tryParse`; si `null`, no hace nada | Sí (fallback) |

### Acciones disponibles

| Acción | Texto visible | Comportamiento | Navegación |
|--------|---------------|----------------|------------|
| Mover mapa | (gesto) | `onCameraChangeListener` actualiza `_centroActual` cada movimiento | — |
| Botón confirmar (mapa) | **"Confirmar ubicacion"** (`FilledButton.icon`, icono check) | `context.pop(_centroActual)` | Cierra modal y devuelve `mb.Point` |
| Botón confirmar (fallback) | **"Confirmar ubicacion"** | Parsea lat/lng y devuelve `mb.Point(coordinates: Position(lng, lat))` | Cierra modal |

### Navegación

- **Se llega desde**: `/registrar` (push para seleccionar ubicación de la tienda) y `/perfil/editar-negocio` (push con `extra: {titulo: 'Ubicación del negocio', inicial: Point(...)}`).
- **Sale**: vuelve a la pantalla previa con `context.pop(<mb.Point>)`.

### Estados posibles

- **Mapbox configurado** (`Entorno.tokenMapbox.isNotEmpty`): vista de mapa.
- **Mapbox no configurado**: vista fallback manual.
- **Sin selección inicial** (`inicial == null`): centra en valores por defecto del entorno.

### Notas UX/UI

- **Patrón de pin fijo + mapa móvil**: convencional y funciona bien.
- **Fallback con controllers locales** *(supuesto)*: los `TextEditingController` se crean en `build` y no se disponen — riesgo menor de leak; en producción típica nunca aplica.
- **Sin búsqueda por dirección** *(supuesto)*: agregar un buscador (geocoding) reduciría enormemente el tiempo de selección, especialmente en zonas urbanas grandes.
- **Sin GPS / "usar mi ubicación actual"** *(supuesto)*: gap funcional importante para el alta de un comercio.

---

## 4. Inicio (dashboard)

- **Clase Dart**: `InicioPantalla` (`ConsumerWidget`)
- **Ruta**: `/inicio` (rama 1 del shell de navegación)
- **Archivo**: `lib/caracteristicas/inicio/inicio_pantalla.dart`
- **Acceso**: autenticada

### Propósito
Pantalla principal post-login. Muestra el saldo de envíos del vendedor (vía `SaldoWidget`) y dos accesos rápidos a las funciones más usadas: crear pedido y comprar paquetes.

### Layout

- `AppBar` con título dinámico:
  - 1ª opción: `usuario.perfilVendedor?.nombreNegocio`.
  - 2ª opción: `usuario.nombreCompleto`.
  - Fallback: **"Inicio"**.
- `SafeArea` + `ListView` (padding 16):
  1. `SaldoWidget()` — ver [SaldoWidget](#saldowidget).
  2. `SizedBox(height: 16)`.
  3. Título **"Acciones rapidas"** (`titleMedium`).
  4. Tile **"Nuevo pedido"** + tile **"Comprar paquetes"**.

### Campos de entrada
*Pantalla solo de lectura.*

### Acciones disponibles

| Acción | Texto visible | Subtítulo | Comportamiento | Navegación |
|--------|---------------|-----------|----------------|------------|
| Tile 1 | **"Nuevo pedido"** (icon: add_box_outlined) | **"Crea un envio para tus clientes"** | Navega a creación de pedido | `push('/pedidos/nuevo')` |
| Tile 2 | **"Comprar paquetes"** (icon: shopping_bag_outlined) | **"Recarga envios prepagados"** | Navega a la tienda de paquetes | `push('/paquetes/tienda')` |
| `SaldoWidget` (ver allá) | "Recargar" si saldo > 0 | — | Acceso secundario a tienda | `push('/paquetes/tienda')` |

### Navegación

- **Se llega desde**: tab inicial; redirección post-login y post-registro.
- **Navega hacia**: `/pedidos/nuevo`, `/paquetes/tienda` (también vía SaldoWidget).

### Estados posibles

- **Usuario con perfil vendedor**: AppBar muestra nombre del negocio.
- **Usuario sin perfilVendedor**: AppBar muestra nombre completo *(no debería ocurrir en producción dado que solo vendedores usan la app)*.
- **Cargando saldo**: el `SaldoWidget` interno tiene su propio estado.

### Notas UX/UI

- **Densidad muy baja (supuesto)**: solo dos tiles. El usuario debe ir al tab "Pedidos" para ver el listado. *(supuesto)*: añadir un resumen como "Pedidos activos: N", "Entregados hoy: M" volvería el dashboard útil de un vistazo.
- **Sin notificaciones / mensajes (supuesto)**: oportunidad de surface alerts (paquetes expirando, pago pendiente).
- **Iconografía outlined consistente**.

---

## 5. Listado de pedidos

- **Clase Dart**: `PedidosListadoPantalla` (`ConsumerWidget`)
- **Ruta**: `/pedidos`
- **Archivo**: `lib/caracteristicas/pedidos/pedidos_listado_pantalla.dart`
- **Acceso**: autenticada

### Propósito
Listado de todos los pedidos creados por el vendedor con filtro por estado, acceso al detalle de cada pedido y FAB para crear uno nuevo. Soporta pull-to-refresh.

### Layout

- `AppBar` con título **"Mis pedidos"** y acción de filtro (`PopupMenuButton` con icono `filter_list`, tooltip **"Filtrar por estado"**).
- Si hay filtro activo: `InputChip` removible: **"Estado: {ESTADO}"** (con X para limpiar).
- `RefreshIndicator` + `ListView.builder` con `PedidoTarjeta` por ítem.
- FAB extendido **"Nuevo"** (icono `+`) en bottom-right.

### Campos de entrada

| Campo | Tipo | Opciones | Validaciones | Requerido |
|-------|------|----------|--------------|-----------|
| Filtro por estado | select (PopupMenu) | `null` (Todos), `PENDIENTE_ASIGNACION`, `ASIGNADO`, `EN_TRANSITO`, `EN_REPARTO`, `ENTREGADO`, `FALLIDO`, `CANCELADO` | — | No |

### Acciones disponibles

| Acción | Texto visible | Comportamiento | Navegación |
|--------|---------------|----------------|------------|
| Filtrar | (icon filter_list) | Abre menú de estados; selección actualiza `filtrosPedidosProvider` | — |
| Limpiar filtro | X en el InputChip | Resetea filtro | — |
| Tap en tarjeta | (PedidoTarjeta) | Abre detalle | `push('/pedidos/{id}')` |
| FAB | **"Nuevo"** | Navega a creación | `push('/pedidos/nuevo')` |
| Pull-to-refresh | (gesto) | Recarga `pedidosListadoProvider` | — |
| Reintentar (estado error) | **"Reintentar"** (`FilledButton.tonal`) | Reintenta carga | — |

### Navegación

- **Se llega desde**: tab "Pedidos" del esqueleto.
- **Navega hacia**: `/pedidos/nuevo`, `/pedidos/:id`.

### Estados posibles

- **Loading**: `CircularProgressIndicator` centrado.
- **Datos (lista no vacía)**: `ListView` de tarjetas (código de seguimiento, cliente, dirección destino con ellipsis, fecha `dd/MM/yyyy HH:mm`, `EstadoChip`, chevron).
- **Datos (lista vacía)**: icono `Icons.inbox_outlined` (64 px, gris) + texto **"No hay pedidos para mostrar"**.
- **Error**: icono `Icons.error_outline` (48 px, rojo) + **"Error: {mensaje}"** + botón **"Reintentar"**.

### Notas UX/UI

- **Padding inferior 96 px** en la lista para que el FAB no oculte la última tarjeta.
- **Sin paginación visible (supuesto)**: si el catálogo crece, conviene paginación o scroll infinito.
- **Sin búsqueda (supuesto)**: agregar barra de búsqueda por código/cliente acelera triage.
- **Filtros múltiples (supuesto)**: solo se filtra por estado; agregar filtros por fecha y tipo de pago sería útil.
- **Color por estado** consistente con `EstadoChip` (ver al final).

---

## 6. Crear pedido

- **Clase Dart**: `CrearPedidoPantalla` (`ConsumerStatefulWidget`)
- **Ruta**: `/pedidos/nuevo`
- **Archivo**: `lib/caracteristicas/pedidos/crear_pedido_pantalla.dart`
- **Acceso**: autenticada

### Propósito
Formulario para registrar un nuevo pedido: datos del cliente, destino con URL de Google Maps (validada), descripción opcional con foto, método de pago (contra entrega o prepagado) y, si aplica, monto a cobrar. La ubicación de origen se toma del perfil vendedor.

### Layout

- `AppBar` con título **"Nuevo pedido"**.
- `Form` con `GlobalKey`, secciones separadas por `Divider(height: 32)`:
  1. **"Datos del cliente"**.
  2. **"Destino"**.
  3. **"Paquete"**.

### Campos de entrada

#### Datos del cliente

| Campo | Tipo | Label / Hint | Validaciones | Requerido |
|-------|------|--------------|--------------|-----------|
| Nombre cliente | text (`TextCapitalization.words`) | Label: **"Nombre completo"** · icon: person | Trim vacío → **"Requerido"** | Sí |
| Teléfono cliente | phone | Label: **"Telefono"** · hint: **"+50370001234"** · icon: phone | Regex `^\+?[0-9]{8,15}$` → **"8-15 digitos, opcional con +"** | Sí |

#### Destino

| Campo | Tipo | Label / Hint | Validaciones | Requerido |
|-------|------|--------------|--------------|-----------|
| Dirección | text | Label: **"Direccion"** · icon: place | Trim vacío → **"Requerido"** | Sí |
| URL de Google Maps | url | Label: **"URL de Google Maps del destino"** · hint: **"https://maps.app.goo.gl/..."** · helper: **"En Google Maps: Compartir → Copiar enlace"** · icon: map | Vacío → **"Pega la URL de Google Maps del destino"**; regex `https://maps\.app\.goo\.gl/[A-Za-z0-9_-]+/?$` → **"URL invalida. Comparte el sitio desde Google Maps y pega el enlace corto"** | Sí |
| Notas | text | Label: **"Notas para el repartidor (opcional)"** · icon: note | — | No |

#### Paquete

| Campo | Tipo | Label / Hint | Validaciones | Requerido |
|-------|------|--------------|--------------|-----------|
| Descripción | text | Label: **"Descripcion (opcional)"** · icon: inventory | — | No |
| Foto | image (cámara o galería, max 1600 px, calidad 80) | Card título: **"Foto del paquete (opcional)"** · subtítulo: **"Tomar foto o elegir de galería"** | — | No |
| Método de pago | segmented (string) | Botones: **"Contra entrega"** (icon: payments) y **"Prepagado"** (icon: credit_card) | — | Sí (default `CONTRA_ENTREGA`) |
| Monto a cobrar | numeric (decimal) | Label: **"Monto a cobrar"** | Solo si método = `CONTRA_ENTREGA`: `double.tryParse` y `> 0` → si no, **"Monto invalido"** | Condicional |

### Acciones disponibles

| Acción | Texto visible | Comportamiento | Navegación |
|--------|---------------|----------------|------------|
| Card foto (sin foto) | (Card "Foto del paquete (opcional)") | Abre `ModalBottomSheet` con opciones | — |
| Modal: Tomar foto | **"Tomar foto"** (icon: camera) | `ImagePicker(camera, maxWidth 1600, q 80)` | — |
| Modal: Galería | **"Elegir de galería"** (icon: photo_library) | `ImagePicker(gallery, ...)` | — |
| Quitar foto | **"Quitar"** | `setState(_foto = null)` | — |
| Cambiar foto | **"Cambiar"** | Reabre el modal | — |
| Cambiar método de pago | (SegmentedButton) | Si `CONTRA_ENTREGA`, aparece campo "Monto a cobrar" | — |
| Botón principal | **"Crear pedido"** (`FilledButton`) | Valida form → valida que `perfilVendedor.latitud/longitud != null` (si no: SnackBar **"Tu cuenta no tiene ubicacion de tienda. Actualiza tu perfil."**) → `POST /pedidos` con multipart | `go('/pedidos/{id}')` si éxito; invalida `pedidosListadoProvider` |

### Navegación

- **Se llega desde**: FAB en `/pedidos`, tile en `/inicio`.
- **Navega hacia**: `/pedidos/:id` (después de crear).

### Estados posibles

- **Inicial**: campos vacíos, método `CONTRA_ENTREGA` por defecto, foto opcional.
- **Enviando** (`_enviando == true`): botón con spinner pequeño, deshabilitado.
- **Éxito**: navega a detalle; refresca listado.
- **Error API** (mapeo en `_mensajeError`):
  - `PEDIDO_ZONA_INVALIDA` o `PEDIDO_ZONA_INVALIDA_DESTINO` → **"La direccion de destino esta fuera de la zona de cobertura"**.
  - `PEDIDO_URL_MAPAS_INVALIDA` → **"No se pudo leer la ubicacion desde la URL de Google Maps. Verifica el enlace."**.
  - Otros → **"No se pudo crear el pedido. Intenta de nuevo."**.
- **Error tienda sin ubicación**: SnackBar **"Tu cuenta no tiene ubicacion de tienda. Actualiza tu perfil."** (no llega a backend).
- **Error image picker**: SnackBar **"No se pudo abrir el selector: {error}"**.

### Notas UX/UI

- **Fricción muy alta del campo URL de Google Maps (supuesto)**: el flujo obliga al usuario a salir de la app, abrir Google Maps, compartir y copiar. El helper text guía pero no resuelve. *(supuesto)*: ofrecer alternativas — selector embebido en mapa, geocoding por dirección, o "tocar y mantener" en mapa para fijar punto.
- **Sin pre-validación de la URL** *(supuesto)*: el regex es estricto (solo `maps.app.goo.gl/...`). Si el usuario pega un link de `google.com/maps/...`, se rechaza sin pista clara. Aceptar más formatos o mostrar ejemplo concreto.
- **Foto sin recortar (supuesto)**: agregar crop tras tomar foto da uniformidad visual.
- **Botón "Crear pedido" siempre habilitado**: solo se bloquea durante envío. *(supuesto)*: deshabilitarlo hasta que campos requeridos estén llenos da feedback más claro.
- **`_SelectorFoto` interno** se repite con el de [Editar negocio](#11-editar-negocio): oportunidad de DRY.

---

## 7. Detalle de pedido

- **Clase Dart**: `PedidoDetallePantalla` (`ConsumerWidget`)
- **Ruta**: `/pedidos/:id` (parámetro `pedidoId: String`)
- **Archivo**: `lib/caracteristicas/pedidos/pedido_detalle_pantalla.dart`
- **Acceso**: autenticada

### Propósito
Vista completa de un pedido. Muestra datos de cliente, destino, pago, **mapa de seguimiento en vivo** (si el estado lo permite), datos del repartidor, **comprobante de entrega** (si aplica) y **timeline** de eventos. Polling cada 10 s en estados activos.

### Layout

- `AppBar`: título **"Detalle del pedido"** + acción **"Refrescar"** (icon refresh).
- `RefreshIndicator` + `ListView` (padding 16).
- Bloques en orden:
  1. **Encabezado**: código de seguimiento (`headlineSmall`) + `EstadoChip`.
  2. **Cliente** (Card): nombre, teléfono.
  3. **Destino** (Card): dirección.
  4. **Pago** (Card): "Metodo: ...", "Cobro contra entrega: $..." (si aplica), "Tarifa: $..." (si disponible).
  5. **Seguimiento en vivo** (condicional, ver abajo).
  6. **Comprobante de entrega** (condicional).
  7. **Linea de tiempo**.

### Secciones condicionales

#### Seguimiento en vivo
**Condición**: `estado ∈ {ASIGNADO, RECOGIDO, EN_TRANSITO, EN_PUNTO_INTERCAMBIO, EN_REPARTO}`.

- `MapaSeguimientoVivo` (220 px de alto, esquinas redondeadas 16): polling cada 10 s, marcadores **"Destino"** y **"Repartidor"** (si tiene posición). Centra en repartidor si existe; si no, en destino.
- Fallback sin token: Card **"Mapa no disponible (configura MAPBOX_TOKEN para verlo)."**
- Tarjeta **Repartidor** (si `pedido.repartidorEntrega != null`): avatar `delivery_dining`, nombre, teléfono.

#### Comprobante de entrega
**Condición**: `estado == 'ENTREGADO'` y hay comprobantes.

- `Image.network` (220 px) con esquinas redondeadas 12.
- Fallback de carga: contenedor gris con `Icons.image_not_supported_outlined`.

#### Línea de tiempo
- Lista vertical de eventos (orden ascendente por `creadoEn`).
- Cada hito: círculo + línea conectora + texto `(estadoNuevo ?? tipo).replaceAll('_', ' ')` + fecha `dd/MM/yyyy HH:mm` + notas (si las hay).
- Si vacía: **"Aun no hay eventos registrados."**.

### Campos de entrada
*Solo lectura.*

### Acciones disponibles

| Acción | Texto visible | Comportamiento | Navegación |
|--------|---------------|----------------|------------|
| Refrescar (AppBar) | (icon refresh, tooltip **"Refrescar"**) | Invalida `pedidoDetalleProvider(pedidoId)` | — |
| Pull-to-refresh | (gesto) | Igual al anterior | — |

### Navegación

- **Se llega desde**: tap en una tarjeta de `/pedidos`; tras crear pedido en `/pedidos/nuevo`.
- **Navega hacia**: solo `pop` (back).

### Estados posibles

- **Loading**: spinner centrado.
- **Error**: icono error rojo + mensaje centrado.
- **Datos (estado activo)**: muestra mapa en vivo + repartidor.
- **Datos (entregado)**: muestra comprobantes.
- **Datos (otros)**: solo encabezado, datos y timeline.

### Notas UX/UI

- **Polling cada 10 s** dispara invalidate del provider; *(supuesto)*: explorar push notifications/WebSocket para evitar polling y ahorrar batería.
- **Layout extenso (supuesto)**: en pedidos con muchos eventos puede haber scroll largo; considerar colapsar la timeline.
- **No hay acciones del cliente sobre el pedido (supuesto)**: por ejemplo cancelar o reportar incidente — gap funcional posible.
- **Formato moneda**: `NumberFormat.currency(symbol: '$')`.

---

## 8. Mis paquetes

- **Clase Dart**: `MisPaquetesPantalla`
- **Ruta**: `/paquetes`
- **Archivo**: `lib/caracteristicas/paquetes/mis_paquetes_pantalla.dart`
- **Acceso**: autenticada

### Propósito
Lista de paquetes prepagados que el vendedor ha comprado, con saldo agregado en la parte superior y CTA para comprar más. Permite ver estado de cada paquete (activo, pendiente de pago, agotado, expirado), envíos restantes, fecha de compra y de expiración.

### Layout

- `AppBar`: **"Mis paquetes"**.
- `RefreshIndicator` + `ListView`:
  1. **`SaldoWidget`** en la parte superior.
  2. Una `Card` por paquete.
- FAB extendido **"Comprar"** (icono `+`).

### Campos de entrada
*Solo lectura.*

### Acciones disponibles

| Acción | Texto visible | Comportamiento | Navegación |
|--------|---------------|----------------|------------|
| FAB | **"Comprar"** | Abre tienda | `push('/paquetes/tienda')` |
| Pull-to-refresh | (gesto) | Invalida `saldoProvider` y `misPaquetesProvider` | — |
| Reintentar (estado error) | **"Reintentar"** | Invalida `misPaquetesProvider` | — |
| Tile interno SaldoWidget | **"Recargar"** | Atajo a tienda | `push('/paquetes/tienda')` |

### Estructura de tarjeta de paquete

- Título: `paquete.nombre`.
- Badge de estado (color según mapa):
  - `ACTIVO` → verde, `PENDIENTE_PAGO` → naranja, `AGOTADO` → gris, `EXPIRADO` → rojo, otros → azul-grisáceo. Texto: estado con `_` → espacios.
- **"{enviosRestantes} de {enviosTotales} envios disponibles"**.
- Barra de progreso lineal (clamp 0-1).
- Fila inferior con: **"Pagado: $...""**, **"Comprado: dd/MM/yyyy"**, **"Expira: dd/MM/yyyy"** (solo si `expiraEn != null`).

### Navegación

- **Se llega desde**: tab "Paquetes".
- **Navega hacia**: `/paquetes/tienda`.

### Estados posibles

- **Loading**: spinner.
- **Error**: icono error + mensaje + **"Reintentar"**. Mensajes mapeados:
  - DioException con respuesta JSON → "{mensaje} ({codigo})", ej. "Servidor no disponible (E001)".
  - Con `statusCode` → **"Error {N} al cargar tus paquetes"**.
  - Sin conexión → **"No se pudo conectar con el servidor"**.
- **Vacío**: **"Aun no tienes paquetes comprados."**
- **Éxito**: lista de Cards.

### Notas UX/UI

- **Doble CTA hacia tienda**: FAB y "Recargar" del SaldoWidget. Refuerzo correcto.
- **Sin filtro/orden** *(supuesto)*: si el usuario acumula muchos paquetes (activos + expirados + agotados), conviene filtrar.
- **Sin diferenciación visual entre "activo" y "agotado" más allá del badge** *(supuesto)*: oportunidad de degradar visualmente las tarjetas inactivas (opacidad).

---

## 9. Tienda de paquetes

- **Clase Dart**: `PaquetesTiendaPantalla`
- **Ruta**: `/paquetes/tienda`
- **Archivo**: `lib/caracteristicas/paquetes/paquetes_tienda_pantalla.dart`
- **Acceso**: autenticada

### Propósito
Catálogo de **reglas de tarifa** que el admin definió como paquetes comprables. Cada tarjeta muestra cantidad de envíos, precio total, costo unitario y validez. La compra se confirma con un diálogo y queda **pendiente de confirmación del admin**.

### Layout

- `AppBar`: **"Comprar paquetes"**.
- `RefreshIndicator` + `ListView.builder` con tarjetas.
- Cada tarjeta:
  - Avatar circular con `Icons.inventory_2_outlined`.
  - Nombre (`titleMedium` bold) + descripción opcional.
  - **"{tamanoPaquete} envios"**.
  - Precio total alineado a la derecha (`titleMedium` bold).
  - **"Costo por envio: $..."** + (opcional) **" · Validez {dias} dias"**.
  - Botón **"Comprar"** (`FilledButton.icon`, icon: shopping_cart_checkout).

### Campos de entrada
*Solo lectura, salvo el diálogo de confirmación.*

### Acciones disponibles

| Acción | Texto visible | Comportamiento | Navegación |
|--------|---------------|----------------|------------|
| Botón "Comprar" en tarjeta | **"Comprar"** | Abre `AlertDialog` | — |
| Diálogo: Cancelar | **"Cancelar"** | Cierra diálogo | — |
| Diálogo: Confirmar | **"Comprar"** | `POST /paquetes-recargados/comprar`. Si éxito: invalida `misPaquetesProvider` y `saldoProvider` + SnackBar. Si error: SnackBar | — |
| Pull-to-refresh | (gesto) | Refresh de `paquetesDisponiblesProvider` | — |

### Diálogo de confirmación

- Título: **"Confirmar compra"**.
- Cuerpo: **'Comprar "{regla.nombre}" por ${precio}?\n\nEl admin confirmara el pago para activarlo.'**
- Botones: **"Cancelar"** | **"Comprar"**.

### Navegación

- **Se llega desde**: FAB en `/paquetes`, tile en `/inicio`, "Recargar" del `SaldoWidget`.
- **Navega hacia**: solo back; no abre detalle.

### Estados posibles

- **Loading**: spinner.
- **Error**: **"Error: {e}"** centrado.
- **Vacío**: **"No hay paquetes disponibles en este momento."**
- **Compra exitosa**: SnackBar **"Compra registrada. Esta pendiente de confirmacion del admin."**.
- **Compra con error**: SnackBar (mensaje extraído o **"No se pudo procesar la compra"**).

### Notas UX/UI

- **Estado intermedio confuso (supuesto)**: tras "Comprar" exitoso, no se navega a una pantalla de detalle ni se muestra el paquete recién creado en estado `PENDIENTE_PAGO` con instrucciones de pago. El usuario solo ve un SnackBar y no sabe qué hacer después. *(supuesto)*: agregar pantalla intermedia con instrucciones (ej: "envía $X a este número de cuenta y espera la confirmación").
- **Sin precio destacado / mejor oferta** *(supuesto)*: en catálogos de paquetes suele resaltarse el "más vendido" o "mejor relación".
- **Costo unitario calculado**: `precioPaquete / tamanoPaquete` (si > 0).

---

## 10. Mi perfil

- **Clase Dart**: `PerfilPantalla`
- **Ruta**: `/perfil`
- **Archivo**: `lib/caracteristicas/perfil/perfil_pantalla.dart`
- **Acceso**: autenticada

### Propósito
Vista de los datos del usuario (email, teléfono, nombre, rol) y, si tiene perfil de vendedor, los datos del negocio (nombre, RFC, dirección, coordenadas, logo). Permite editar el negocio y cerrar sesión.

### Layout

- `AppBar`: **"Mi perfil"**.
- Encabezado:
  - Avatar circular (radius 44) con la inicial del `nombreCompleto` (o `?`).
  - Nombre completo (`titleLarge`, centrado).
  - Rol (`bodyMedium`, color `onSurfaceVariant`, centrado).
- Card "Contacto":
  - ListTile **"Email"** (icon: email_outlined) + subtítulo `usuario.email`.
  - Divider.
  - ListTile **"Teléfono"** (icon: phone_outlined) + subtítulo `usuario.telefono`.
- Sección **"Negocio"** (solo si `perfilVendedor != null`):
  - Encabezado **"Negocio"** + botón **"Editar"** (icon: edit, size 18).
  - Card con avatar de logo (radius 32) — usa `urlLogo` si existe, si no la inicial del nombre del negocio o `?`.
  - Nombre del negocio (`titleMedium`).
  - **"RFC: ..."** (si existe).
  - Divider + ListTile **"Dirección"** (icon: location_on_outlined).
  - Divider + ListTile **"Coordenadas"** (icon: map_outlined) → `"{lat:.5}, {lng:.5}"`.
- Botón inferior **"Cerrar sesión"** (`FilledButton.tonalIcon`, icon: logout).

### Campos de entrada
*Solo lectura.*

### Acciones disponibles

| Acción | Texto visible | Comportamiento | Navegación |
|--------|---------------|----------------|------------|
| Botón "Editar" | **"Editar"** | Abre formulario de negocio | `push('/perfil/editar-negocio')` |
| Botón "Cerrar sesión" | **"Cerrar sesión"** | Llama logout y navega al login | `go('/iniciar-sesion')` |

### Navegación

- **Se llega desde**: tab "Perfil".
- **Navega hacia**: `/perfil/editar-negocio`, `/iniciar-sesion`.

### Estados posibles

- **Loading**: spinner centrado mientras se carga el usuario.
- **Vendedor con perfil completo**: muestra todo el bloque de negocio.
- **Sin perfil de vendedor**: oculta el bloque (caso teórico para esta app).

### Notas UX/UI

- **"Cerrar sesión" sin confirmación (supuesto)**: típicamente conviene confirmar para evitar logouts accidentales (especialmente porque la sesión incluye el saldo de paquetes pre-pagados).
- **Estilo no destructivo** del botón cerrar sesión (`tonalIcon`): *(supuesto)*: aunque no es destructivo en sentido estricto, suele estilizarse en gris/rojo para diferenciarlo.
- **Sin opción de editar email/teléfono/contraseña (supuesto)**: solo se edita el negocio; gap funcional.
- **No hay configuración de notificaciones / privacidad (supuesto)**.

---

## 11. Editar negocio

- **Clase Dart**: `EditarNegocioPantalla`
- **Ruta**: `/perfil/editar-negocio`
- **Archivo**: `lib/caracteristicas/perfil/editar_negocio_pantalla.dart`
- **Acceso**: autenticada

### Propósito
Formulario para actualizar los datos del perfil de vendedor: nombre del negocio, RFC, dirección, ubicación en mapa y logo. Soporta upload de imagen desde cámara o galería. Campos pre-poblados con los valores actuales.

### Layout

- `AppBar`: **"Editar negocio"**.
- `Form` con `GlobalKey`, scroll vertical:
  1. **Preview de logo** centrado (avatar 96 px) + botón debajo.
  2. Campos del formulario.
  3. **Card "Ubicación en mapa"**.
  4. Botón **"Guardar cambios"**.

### Pre-población al abrir

- `_nombreNegocio.text = perfilVendedor?.nombreNegocio ?? ''`
- `_rfc.text = perfilVendedor?.rfc ?? ''`
- `_direccion.text = perfilVendedor?.direccion ?? ''`
- `_latitud = perfilVendedor?.latitud`
- `_longitud = perfilVendedor?.longitud`
- Logo preview: si `_logoNuevo` → FileImage; si `urlLogo` existe → NetworkImage; si no → inicial.

### Campos de entrada

| Campo | Tipo | Label / Hint | Validaciones | Requerido |
|-------|------|--------------|--------------|-----------|
| Nombre del negocio | text | Label: **"Nombre del negocio"** · icon: storefront | Trim < 2 → **"Ingresa al menos 2 caracteres"**; > 120 → **"Máximo 120 caracteres"** | Sí |
| RFC | text | Label: **"RFC (opcional)"** · icon: badge | Si > 20 → **"Máximo 20 caracteres"** | No |
| Dirección | text (`maxLines: 2`) | Label: **"Dirección"** · icon: location_on | Trim < 3 → **"Ingresa una dirección"**; > 240 → **"Máximo 240 caracteres"** | Sí |
| Logo | image (camera / galería, maxWidth 1024, q 85) | Botón: **"Agregar logo"** o **"Cambiar logo"** | — | No |
| Ubicación | location (Card) | Title: **"Ubicación en mapa"** · subtítulo `"{lat:.5}, {lng:.5}"` o **"Sin coordenadas"** · trailing: chevron | Si lat o lng `null` al guardar → SnackBar **"Selecciona la ubicación del negocio en el mapa."** | Sí |

### Acciones disponibles

| Acción | Texto visible | Comportamiento | Navegación |
|--------|---------------|----------------|------------|
| Logo: tap | **"Agregar logo"** o **"Cambiar logo"** | Abre `ModalBottomSheet` | — |
| Modal: Tomar foto | **"Tomar foto"** | `ImagePicker(camera, 1024, q 85)` | — |
| Modal: Galería | **"Elegir de galería"** | `ImagePicker(gallery, ...)` | — |
| Card "Ubicación" | **"Ubicación en mapa"** | Push con `extra: {titulo: 'Ubicación del negocio', inicial: Point(...)}` | `push<mb.Point>('/seleccionar-ubicacion')` → vuelve con Point |
| Botón principal | **"Guardar cambios"** o **"Guardando…"** (icon: save) | Valida → comprueba coordenadas → `PATCH /usuarios/yo/perfil-vendedor` (multipart con logo si nuevo) → actualiza usuario en estado | `pop()` a `/perfil` si éxito |

### Navegación

- **Se llega desde**: botón **"Editar"** en `/perfil`.
- **Navega hacia**: `/seleccionar-ubicacion` (push con retorno) y `pop` a `/perfil`.

### Estados posibles

- **Inicial pre-poblada**: campos con valores actuales.
- **Cargando logo**: preview muestra archivo local seleccionado.
- **Sin coordenadas todavía**: subtítulo **"Sin coordenadas"**.
- **Enviando** (`_enviando == true`): botón muestra spinner, todos los inputs/cards deshabilitados.
- **Error de coordenadas**: SnackBar **"Selecciona la ubicación del negocio en el mapa."**.
- **Error de imagen**: SnackBar **"No se pudo abrir el selector: {error}"**.
- **Error API**: SnackBar con mensaje extraído o **"No se pudo guardar el negocio. Intenta de nuevo."**.
- **Éxito**: SnackBar **"Negocio actualizado."** + `pop()`.

### Notas UX/UI

- **Buena accesibilidad** del estado deshabilitado durante envío (todo se bloquea).
- **Validaciones de longitud explícitas** vs los formularios de registro/pedido (que son más laxos): inconsistencia leve *(supuesto)*: alinear estándares.
- **Sin opción de eliminar logo (supuesto)**: solo se puede reemplazar.
- **Repetición de selector de foto** con `_SelectorFoto` de [Crear pedido](#6-crear-pedido) — *(supuesto)*: extraer a widget compartido.

---

## 12. Seguimiento público

- **Clase Dart**: `SeguimientoPantalla`
- **Ruta**: `/seguimiento/:codigo`
- **Archivo**: `lib/caracteristicas/seguimiento/seguimiento_pantalla.dart`
- **Acceso**: **pública** (deep link sin autenticación)

### Propósito
Pantalla pública para que el receptor del pedido (cliente final) consulte el estado del envío usando el código de seguimiento. Pensada para ser abierta desde un link compartido por SMS/WhatsApp/email.

### Parámetros

- `codigo` (String) — pasa por path param y se inyecta al constructor.

### Layout

- `AppBar`: **"Seguimiento {codigo}"**.
- `RefreshIndicator` + `ListView` (padding 16):
  - Código de seguimiento (`headlineSmall`, centrado).
  - `EstadoChip` con estado actual (centrado).
  - `LineaTiempoEstado` con eventos.

### Campos de entrada
*Solo lectura.*

### Acciones disponibles

| Acción | Texto visible | Comportamiento | Navegación |
|--------|---------------|----------------|------------|
| Pull-to-refresh | (gesto) | Refresh de `seguimientoPublicoProvider(codigo)` | — |

### Navegación

- **Se llega desde**: deep link externo (`/seguimiento/{codigo}`).
- **Sale**: `pop`.

### Estados posibles

- **Loading**: spinner.
- **Error**: **"No se encontro el pedido: {error}"** centrado (con padding 24).
- **Éxito**: muestra código + estado + timeline.

### Notas UX/UI

- **Inconsistencia con el detalle autenticado (supuesto)**: la versión pública **no incluye mapa de seguimiento en vivo**, ni datos del repartidor, ni comprobante. El cliente final que recibe el envío típicamente quiere ver "¿dónde está mi paquete ahora?" — agregar el mapa público (sin info sensible del repartidor) sería un enorme quick win.
- **Sin branding visible (supuesto)**: una pantalla pública es la principal exposición de marca a destinatarios; aprovecharla para incluir logo/colores corporativos.
- **Sin compartir** *(supuesto)*: agregar botón "Compartir estado" para que el destinatario reenvíe.
- **Sin acción si error**: solo se puede pull-to-refresh; podría ofrecer botón explícito **"Reintentar"** y/o input para reintroducir el código.

---

# Componentes globales

## Esqueleto de navegación (tab bar)

- **Archivo**: `lib/widgets/esqueleto_navegacion.dart`
- **Implementado vía**: `StatefulShellRoute.indexedStack` (cada tab tiene su propio stack independiente).

| Posición | Label | Icono no seleccionado | Icono seleccionado | Ruta inicial |
|----------|-------|------------------------|--------------------|--------------|
| 0 | Inicio | home_outlined | home | `/inicio` |
| 1 | Pedidos | list_alt_outlined | list_alt | `/pedidos` |
| 2 | Paquetes | inventory_2_outlined | inventory_2 | `/paquetes` |
| 3 | Perfil | person_outline | person | `/perfil` |

- Visible en todas las rutas autenticadas (no en `/iniciar-sesion`, `/registrar`, `/seleccionar-ubicacion`, `/seguimiento/:codigo`).
- Comportamiento de tab tapped: si ya estaba en ese tab → vuelve al inicio del stack; si era otro → mantiene su estado interno.

### Notas UX/UI

- **4 tabs es el límite cómodo**: bien dimensionado.
- *(supuesto)*: agregar **badge de notificaciones** sobre "Pedidos" cuando haya cambios de estado relevantes (`EN_TRANSITO` → `ENTREGADO`).

---

## SaldoWidget

- **Archivo**: `lib/caracteristicas/paquetes/saldo_widget.dart`
- **Usado en**: `/inicio`, `/paquetes`.

### Estados

- **Cargando**: Card + ListTile leading con spinner pequeño + título **"Cargando saldo..."**.
- **Error**: Card + ListTile leading icon error rojo + título **"No se pudo cargar el saldo"** + trailing `TextButton` **"Reintentar"**.
- **Éxito**:
  - Color dinámico según `saldoRecargado`:
    - `> 10` → **verde** (saludable).
    - `> 0` → **naranja** (bajo).
    - `== 0` → **rojo** (sin saldo).
  - Card con `backgroundColor color.withValues(alpha: 0.08)`, borde `alpha: 0.4`, radius 16.
  - Avatar circular con `Icons.account_balance_wallet`.
  - Título: **"{saldoRecargado} envios disponibles"** (bold).
  - Subtítulo: **"{paquetesActivos} paquete(s) activos"**.
  - Trailing: **"Recargar"** → `push('/paquetes/tienda')`.

### Notas UX/UI

- **Color por umbral funciona bien**.
- *(supuesto)*: cuando saldo == 0 (rojo), el mensaje podría ser más imperativo, ej: **"Sin envíos. Recarga ahora"**, y el botón debería ser `FilledButton` en lugar de `TextButton` para reforzar urgencia.

---

## EstadoChip

- **Archivo**: `lib/widgets/estado_chip.dart`
- Renderiza un chip con border-radius 999, fondo color × 0.12, borde color × 0.4, texto bold tamaño 12.

| Estado interno | Etiqueta | Color |
|---------------|----------|-------|
| `PENDIENTE_ASIGNACION` | "Pendiente" | Naranja |
| `ASIGNADO` | "Asignado" | Azul |
| `RECOGIDO` | "Recogido" | Púrpura |
| `EN_TRANSITO` | "En transito" | Púrpura oscuro |
| `EN_PUNTO_INTERCAMBIO` | "En punto de intercambio" | Índigo |
| `EN_REPARTO` | "En reparto" | Azul oscuro |
| `ENTREGADO` | "Entregado" | Verde |
| `FALLIDO` | "Fallido" | Rojo |
| `DEVUELTO` | "Devuelto" | Marrón |
| `CANCELADO` | "Cancelado" | Gris |
| (otros) | `_` → espacio, capitalize | Gris |

---

## PedidoTarjeta

- **Archivo**: `lib/widgets/pedido_tarjeta.dart`
- Estructura: `Card` con margen `(h:16, v:6)` + `ListTile`:
  - **Title**: código de seguimiento (o `#{primeros6chars}` si vacío) + `EstadoChip`.
  - **Subtitle**: nombre del cliente, dirección destino (1 línea, ellipsis), fecha `dd/MM/yyyy HH:mm`.
  - **Trailing**: chevron_right.

---

## LineaTiempoEstado

- **Archivo**: `lib/widgets/linea_tiempo_estado.dart`
- Si `eventos` vacío: **"Aun no hay eventos registrados."**.
- Si hay eventos: lista vertical de `_Hito`s con línea conectora gris (alpha 0.4), círculo (14×14) y bloque de texto a la derecha:
  - Texto principal: `(estadoNuevo ?? tipo).replaceAll('_', ' ')`.
  - Fecha: `dd/MM/yyyy HH:mm`.
  - Notas (si existen): bajo la fecha.

---

## MapaSeguimientoVivo

- **Archivo**: `lib/caracteristicas/pedidos/mapa_seguimiento_vivo.dart`
- Usado en `/pedidos/:id` para estados activos.
- `Timer.periodic(10s)` que invalida `pedidoDetalleProvider(pedidoId)`.
- Crea `PointAnnotationManager` con marcadores **"Destino"** y, si aplica, **"Repartidor"**.
- Cámara animada (zoom 14, 800 ms) hacia repartidor (si existe) o destino.
- Fallback sin token: Card **"Mapa no disponible (configura MAPBOX_TOKEN para verlo)."**.

---

# Flujos integrados

## A. Autenticación

```
[deep link / cold start sin sesión]
   ↓
/iniciar-sesion ──"Crear cuenta de vendedor"──→ /registrar
       │                                            │
       │                                            │ tap card ubicación
       │                                            ↓
       │                                  /seleccionar-ubicacion
       │                                            │ confirmar (Point)
       │                                            ↓
       │                                  /registrar (con ubicación)
       │                                            │ "Crear cuenta"
       │ "Iniciar sesion"                           │
       └──────────────→ /inicio ←──────────────────┘
```

## B. Creación de pedido

```
/pedidos  ──FAB "Nuevo"──→  /pedidos/nuevo
                                  │ "Crear pedido"
                                  │ (multipart: datos cliente + URL Maps + foto + monto)
                                  ↓
                         POST /pedidos
                                  │
                                  ├── Error PEDIDO_ZONA_INVALIDA → SnackBar
                                  ├── Error PEDIDO_URL_MAPAS_INVALIDA → SnackBar
                                  └── Éxito → /pedidos/{id}
                                                    │
                                                    │ (estado activo) MapaSeguimientoVivo
                                                    │ polling 10s
                                                    │
                                                    ├── ENTREGADO → muestra comprobante
                                                    └── pull-to-refresh / botón refrescar
```

## C. Compra de paquetes

```
/paquetes  ──FAB "Comprar"──→  /paquetes/tienda
                                       │ tap "Comprar" en regla
                                       ↓
                               AlertDialog "Confirmar compra"
                                       │ "Comprar"
                                       ↓
                          POST /paquetes-recargados/comprar
                                       │
                                       ├── Error → SnackBar
                                       └── Éxito → SnackBar "Compra registrada. Esta pendiente
                                                  de confirmacion del admin."
                                                  + invalida saldoProvider y misPaquetesProvider
```

## D. Edición de negocio

```
/perfil ──"Editar"──→ /perfil/editar-negocio
                              │ tap "Ubicación en mapa"
                              ↓
                      /seleccionar-ubicacion
                              │ "Confirmar ubicacion"
                              ↓
                      /perfil/editar-negocio (con coords)
                              │ "Guardar cambios"
                              ↓
                      PATCH /usuarios/yo/perfil-vendedor (multipart)
                              │
                              ├── Error → SnackBar
                              └── Éxito → SnackBar "Negocio actualizado." + pop a /perfil
```

## E. Seguimiento público (vista del destinatario)

```
[link externo: /seguimiento/{codigo}]
   ↓
SeguimientoPantalla (sin login)
   ├── código + EstadoChip
   ├── LineaTiempoEstado (eventos)
   └── pull-to-refresh
```

---

# Apéndice — Catálogo de estados de pedido

| Estado | Etiqueta `EstadoChip` | Color | Mostrado en |
|--------|-----------------------|-------|-------------|
| `PENDIENTE_ASIGNACION` | Pendiente | Naranja (#FFA000) | listado, detalle, seguimiento |
| `ASIGNADO` | Asignado | Azul (#1976D2) | + activa mapa vivo |
| `RECOGIDO` | Recogido | Púrpura (#7B1FA2) | + mapa vivo |
| `EN_TRANSITO` | En transito | Púrpura oscuro (#512DA8) | + mapa vivo |
| `EN_PUNTO_INTERCAMBIO` | En punto de intercambio | Índigo (#303F9F) | + mapa vivo |
| `EN_REPARTO` | En reparto | Azul oscuro (#1565C0) | + mapa vivo |
| `ENTREGADO` | Entregado | Verde (#388E3C) | + activa sección comprobante |
| `FALLIDO` | Fallido | Rojo (#D32F2F) | — |
| `DEVUELTO` | Devuelto | Marrón | — |
| `CANCELADO` | Cancelado | Gris (#616161) | — |

---

# Apéndice — Resumen de oportunidades de mejora UX (todas marcadas como **supuesto**)

Este es un compendio de las observaciones UX dispersas en el documento, agrupadas para que Claude Design las revise como hipótesis a confirmar:

### Autenticación
- Falta de **"¿Olvidaste tu contraseña?"** en `/iniciar-sesion`.
- Validación de email solo exige `@`; reforzar con regex.
- Sin **medidor visual de fortaleza de contraseña** ni **confirmar contraseña** en registro.
- Título del selector con artefacto `"Ubicacion de la tienda --"`.

### Selector de ubicación
- Sin **buscador por dirección** (geocoding).
- Sin **"Usar mi ubicación actual"** (GPS).
- Riesgo de leak menor en controllers del fallback manual.

### Inicio
- Dashboard con baja densidad informativa: agregar resúmenes (pedidos activos, entregados hoy).
- Sin notificaciones / alertas en el home.

### Listado de pedidos
- Sin paginación visible (riesgo a escala).
- Sin búsqueda por código/cliente.
- Filtros limitados a estado (no por fecha ni método de pago).

### Crear pedido
- **Fricción alta** del campo URL de Google Maps: obliga a salir de la app.
- Regex muy estricto: solo acepta `maps.app.goo.gl/...`.
- Sin recorte de foto.
- Botón siempre habilitado: deshabilitar hasta que requeridos estén completos.
- `_SelectorFoto` duplicado con el de Editar negocio.

### Detalle de pedido
- Polling cada 10 s podría reemplazarse con push/WebSocket.
- Timeline larga sin colapso.
- Sin acciones del cliente (cancelar, reportar incidente).

### Mis paquetes / Tienda de paquetes
- Sin filtro/orden de paquetes.
- Sin diferenciación visual de paquetes inactivos.
- Estado intermedio post-compra confuso (no se explica cómo pagar).
- Sin destacado "más vendido" en catálogo.

### Mi perfil / Editar negocio
- Sin confirmación al cerrar sesión.
- Estilo del botón "Cerrar sesión" (`tonalIcon`) podría ser más distintivo.
- Sin opciones para editar email/teléfono/contraseña.
- Sin sección de notificaciones/privacidad.
- Sin opción de eliminar logo (solo reemplazar).
- Inconsistencia en límites de validación entre formularios.

### Seguimiento público
- **Sin mapa de seguimiento vivo** (gran oportunidad).
- Sin branding corporativo destacado.
- Sin botón compartir.
- Sin reintentar explícito ni input para reintroducir código.

### Esqueleto de navegación
- Sin badge de notificaciones (especialmente útil sobre "Pedidos").
