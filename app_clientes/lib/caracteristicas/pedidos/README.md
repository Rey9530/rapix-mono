# Característica `pedidos` (app del vendedor)

Pantallas y orquestación cliente de Flutter para que un VENDEDOR pueda crear,
listar, ver detalle y seguir el ciclo de vida de sus pedidos. Consume el
módulo backend [`pedidos`](../../../../backend/src/modulos/pedidos/README.md)
del repositorio.

> Stack: Flutter, `flutter_riverpod` (state management), `go_router`
> (navegación), `dio` (HTTP), `image_picker` (foto del paquete), `intl`
> (formato de fechas y moneda en `es`).

---

## Archivos

```
app_clientes/lib/caracteristicas/pedidos/
├── README.md                       ← este archivo
├── crear_pedido_pantalla.dart      ← formulario de creación
├── pedido_detalle_pantalla.dart    ← detalle + timeline
├── pedidos_listado_pantalla.dart   ← listado paginado del vendedor
├── pedidos_listado_controlador.dart← provider de listado
├── mapa_pedido_pantalla.dart       ← mapa estático del pedido
└── mapa_seguimiento_vivo.dart      ← seguimiento en vivo del rider
```

Repositorio y modelos:

```
app_clientes/lib/datos/repositorios/pedidos_repositorio.dart
app_clientes/lib/datos/modelos/pedido.dart
```

---

## Flujo de creación de pedido (mayo 2026)

### Diagrama de secuencia

```
Usuario          CrearPedidoPantalla     Riverpod                Backend
  │                     │                   │                       │
  │  abre pantalla      │                   │                       │
  │ ──────────────────► │                   │                       │
  │                     │ initState()       │                       │
  │                     │ _fechaEntrega =   │                       │
  │                     │   DateTime.now()  │                       │
  │                     │                   │                       │
  │                     │ build()           │                       │
  │                     │ ref.watch(        │                       │
  │                     │  contextoVendedor)│                       │
  │                     │ ─────────────────►│ GET /pedidos/         │
  │                     │                   │     contexto-vendedor │
  │                     │ ref.watch(        │ GET /pedidos/         │
  │                     │  previewCostoEnvio│     preview-costo-    │
  │                     │ ) ───────────────►│         envio         │
  │                     │                   │                       │
  │                     │ ◄────────────── 200 con costoEnvio/fuente │
  │                     │                                           │
  │ rellena formulario  │                                           │
  │ y pulsa             │                                           │
  │ "Crear pedido"      │                                           │
  │ ──────────────────► │                                           │
  │                     │ _enviar()                                 │
  │                     │  ├─ validate() form                       │
  │                     │  ├─ _resolverContextoVendedor()           │
  │                     │  │  (espera el provider si está loading)  │
  │                     │  ├─ leer preview en cache                 │
  │                     │  └─ _mostrarConfirmacion(...) → AlertDialog
  │                     │                                           │
  │ cancela / confirma  │                                           │
  │ ──────────────────► │                                           │
  │                     │ si cancela → return                       │
  │                     │ si confirma:                              │
  │                     │ ─────────────────────► POST /pedidos      │
  │                     │                       (multipart con foto)│
  │                     │ ◄──────────────────── 201 con id          │
  │                     │ context.go('/pedidos/$id')                │
```

### Componentes

#### `crear_pedido_pantalla.dart`

Pantalla `ConsumerStatefulWidget`. Su estado interno (`_CrearPedidoPantallaEstado`)
es la única fuente de verdad para los datos del formulario; el costo de envío
y el contexto del vendedor viven en Riverpod (`FutureProvider.autoDispose`).

**Estado relevante:**
- `_formulario`: `GlobalKey<FormState>` para validar.
- Controllers para nombre, teléfono, dirección destino, URL Maps, descripción,
  monto contra entrega, notas destino.
- `_metodoPago: String` (`'CONTRA_ENTREGA'` por defecto).
- `_foto: XFile?` (opcional, vía `image_picker`).
- **`_fechaEntrega: DateTime`** (no nullable). Inicializada con
  `DateTime.now()` en `initState`. La elección posterior se hace con
  `showDatePicker(firstDate: hoy, lastDate: hoy + 365 días, locale: 'es')`.
- `_latDestino`, `_lngDestino`: opcionales, se llenan al elegir desde el
  buscador de direcciones (`_BuscadorDireccion` interno usa
  `geocodingRepositorioProvider`).
- `_direccionElegidaDelBuscador`: marca para invalidar coordenadas si el
  usuario edita la dirección a mano.

**Sub-widgets internos:**
- `_SeccionNumerada` — agrupa los campos en 3 bloques (CLIENTE / DESTINO / PAQUETE).
- `_CampoFormulario` — campo de texto con etiqueta superior, icono y validador.
- `_BuscadorDireccion` — `ConsumerStatefulWidget` con debounce 400ms que
  consulta `geocodingRepositorioProvider` y devuelve dirección + lat/lng.
- `_FilaFechaEntrega` — fila tappable con la fecha formateada
  (`DateFormat('EEEE d MMM y', 'es')`). **No tiene botón de limpiar**: la
  fecha siempre tiene un valor.
- `_BarraInferiorCrear` (`ConsumerWidget`) — la barra inferior con costo
  dinámico y botón "Crear pedido".
- `_ResumenCostoEnvio` — dentro de la barra, pinta loading/error/data del
  preview. Si `preview.value.debeMostrarse == false` (caso PAQUETE), muestra
  "Cubierto por tu paquete activo · 1 envío del paquete". Si no, muestra el
  monto formateado con `NumberFormat.currency(locale: 'es', symbol: '$')`.

#### Resolución del contexto del vendedor

El método `_resolverContextoVendedor()` evita una race condition al iniciar:
si el provider aún está cargando cuando el usuario pulsa "Crear pedido",
espera la `future` antes de continuar. Si la carga falló, devuelve `null` y
el caller muestra un `SnackBar` con acción **"Reintentar"** que invalida el
provider:

```dart
Future<ContextoVendedor?> _resolverContextoVendedor() async {
  var asincrono = ref.read(contextoVendedorProvider);
  if (asincrono.isLoading) {
    try {
      await ref.read(contextoVendedorProvider.future);
      asincrono = ref.read(contextoVendedorProvider);
    } catch (_) {
      return null;
    }
  }
  return asincrono.value;
}
```

Después se valida `ctx.tieneUbicacion` para asegurar que el vendedor tiene
dirección y coordenadas configuradas. Si no, se muestra un snack pidiéndole
actualizar el perfil — la pantalla **no** revienta porque el backend devuelve
`200 + tieneUbicacion:false` en lugar de un 400.

#### Diálogo de confirmación

`_mostrarConfirmacion()` arma un `AlertDialog` modal con:
- Título "¿Confirmar pedido?"
- Mensaje "¿Estás seguro de que los datos del pedido son correctos?"
- Filas de resumen: Cliente, Dirección, Fecha de entrega, Monto a cobrar al
  cliente (solo si CONTRA_ENTREGA), Costo de envío (solo si
  `preview.debeMostrarse`).
- Acciones: `TextButton("Cancelar")` y `FilledButton("Sí, crear pedido")`.

Estilo alineado con los otros diálogos del proyecto
(`perfil_pantalla.dart:814-840`, `paquetes_tienda_pantalla.dart:57-76`).

#### Nota informativa CONTRA_ENTREGA

En la barra inferior, sobre el bloque del costo y el botón, aparece un banner
ámbar (`TokensRapix.ambar.withValues(alpha: 0.18)` de fondo + borde) cuando:

```
metodoPago == 'CONTRA_ENTREGA' AND preview.value.debeMostrarse == true
```

Texto:
> "Si el cliente pagará el paquete más el envío, el total a pagar debe ser
> la suma de ambos para que el rider cobre lo correcto."

Cuando el método de pago no es CONTRA_ENTREGA o el vendedor tiene paquete
activo (no se cobra al entregar), el banner desaparece.

---

## Repositorio (`pedidos_repositorio.dart`)

Clases publicadas:

| Clase | Uso |
|---|---|
| `CrearPedidoEntrada` | Entrada del POST. `programadoPara: DateTime` **required** (no nullable). `aCamposMultipart()` lo serializa con `.toIso8601String()` siempre. |
| `ActualizarPedidoEntrada` | Body del PATCH `/pedidos/:id`. |
| `FiltrosListadoPedidos` | Query params del GET `/pedidos`. |
| **`PreviewCostoEnvio`** | Respuesta de `previewCostoEnvio()`. Campos `modoFacturacion`, `costoEnvio`, `fuente`. Getter `debeMostrarse => fuente != 'PAQUETE'`. |
| **`ContextoVendedor`** | Respuesta de `obtenerContextoVendedor()`. Campos `tieneUbicacion`, `vendedorId?`, `nombreNegocio?`, `direccion?`, `latitud?`, `longitud?`, `urlLogo?`. |

Métodos del repo:

```dart
class PedidosRepositorio {
  Future<Pedido> crear(CrearPedidoEntrada entrada);
  Future<List<Pedido>> listarMios({FiltrosListadoPedidos? filtros});
  Future<Pedido> actualizar(String id, ActualizarPedidoEntrada entrada);
  Future<Pedido> obtenerPorId(String id);
  Future<Pedido> obtenerPorCodigoPublico(String codigo);   // público

  Future<PreviewCostoEnvio>  previewCostoEnvio();          // nuevo
  Future<ContextoVendedor>   obtenerContextoVendedor();    // nuevo
}
```

Providers Riverpod en el mismo archivo:

```dart
final pedidosRepositorioProvider = Provider<PedidosRepositorio>((ref) {
  return PedidosRepositorio(ref.watch(dioClienteProvider));
});

final previewCostoEnvioProvider =
    FutureProvider.autoDispose<PreviewCostoEnvio>((ref) async {
  return ref.watch(pedidosRepositorioProvider).previewCostoEnvio();
});

final contextoVendedorProvider =
    FutureProvider.autoDispose<ContextoVendedor>((ref) async {
  return ref.watch(pedidosRepositorioProvider).obtenerContextoVendedor();
});
```

Ambos providers son `autoDispose`: se cargan al entrar a la pantalla de
creación y se liberan al salir. Si se necesita refrescar (p. ej. tras un
cambio de paquete o regla), usar `ref.invalidate(...)`.

---

## Reglas de negocio que reflejamos en el cliente

- **Fecha obligatoria**: se pre-llena con hoy y se hace required en el DTO
  cliente. El backend también la exige (`@IsDateString() @IsNotEmpty()`), así
  que aunque alguien envíe el POST manualmente, falla con 400.
- **Costo de envío lo calcula el backend**, nunca el cliente. La UI solo
  refleja lo que devuelve `GET /pedidos/preview-costo-envio` y lo que viene
  embebido en el `Pedido` ya creado (`costoEnvio`).
- **Confirmación previa al POST**: una vez el usuario confirma en el
  `AlertDialog`, el botón "Crear pedido" entra en estado `_enviando = true`
  y queda deshabilitado hasta que la petición termina (éxito o error).
- **Manejo de errores del backend** (`_mensajeError`):
  - `PEDIDO_ZONA_INVALIDA` / `PEDIDO_ZONA_INVALIDA_DESTINO` → "La dirección
    de destino está fuera de la zona de cobertura".
  - `PEDIDO_URL_MAPAS_INVALIDA` → "No se pudo leer la ubicación desde la URL
    de Google Maps. Verifica el enlace."
  - Fallback: muestra `mensaje` del backend o "No se pudo crear el pedido.
    Intenta de nuevo."

---

## Verificación manual

Desde `app_clientes/`:

```bash
flutter pub get
flutter analyze lib/caracteristicas/pedidos lib/datos/repositorios
flutter run -d <emulador o dispositivo>
```

Lista de casos a probar:

| Caso | Setup | Esperado |
|---|---|---|
| Vendedor con paquete activo | crearle un `PaqueteRecargado` desde admin | Barra inferior dice "Cubierto por tu paquete activo · 1 envío del paquete". El banner de CONTRA_ENTREGA **no** aparece aunque el método sea contra-entrega. |
| Vendedor sin paquete con regla vigente | seed default | Barra muestra "Costo de envío a pagar al entregar: $X.XX" con el precio de la última regla creada. |
| Vendedor sin paquete sin regla | desactivar reglas POR_ENVIO desde admin | Barra muestra "$3.00" (fallback). |
| Método PREPAGADO | seleccionar Prepagado en la UI | El banner ámbar desaparece. El monto sigue mostrándose si aplica. |
| Botón "Crear pedido" sin completar | dejar nombre vacío | El formulario muestra los errores en línea y no envía. |
| Cancelar el AlertDialog | pulsar "Cancelar" | No se hace POST, el botón vuelve a estar disponible. |
| Confirmar el AlertDialog | pulsar "Sí, crear pedido" | POST con `programadoPara` = la fecha elegida; al éxito navega a `/pedidos/$id`. |
| Backend caído al abrir la pantalla | apagar el backend | Aparece snack "No pudimos verificar los datos de tu tienda." con acción "Reintentar" que reintenta el `contextoVendedorProvider`. |

---

## Convenciones del repo

Este archivo se llama `README.md` (no `CLAUDE.md`) por la regla del
[`CLAUDE.md` raíz](../../../../CLAUDE.md): solo el archivo de la raíz se
llama `CLAUDE.md`; cualquier doc dentro de una carpeta se llama `README.md`
para que tanto Claude Code como Gemini y otros agentes lo carguen igual.

Identificadores en español sin tildes (`ContextoVendedor`, no
`ContextoVendédor`). Strings de UI **sí** llevan tildes (`"Av. Reforma"`).
