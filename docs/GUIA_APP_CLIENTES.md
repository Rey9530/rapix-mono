# Guía de Desarrollo - App Clientes/Vendedores (Flutter)

## 🎯 Objetivo

App móvil para **vendedores** (principal) y **clientes finales** (opcional — pueden usar el link de seguimiento público). Los vendedores crean pedidos, consultan estado, compran paquetes recargados y gestionan su saldo. **Identificadores en español, sin tildes** (ver glosario maestro en `README.md`).

## 📦 Stack

Mismo stack que la app de Repartidores con algunas diferencias:

- **Flutter** 3.22+, **Dart** 3.4+
- **Riverpod**, **go_router**, **dio**, **flutter_secure_storage**
- **mapbox_maps_flutter** (selector de ubicación + seguimiento)
- **image_picker** (logo/foto de perfil)
- **firebase_messaging**
- **flutter_stripe** o SDK local de pagos (si aplica)

## 🗂️ Estructura de Carpetas

```
app-cliente/
├── lib/
│   ├── main.dart
│   ├── app.dart
│   ├── nucleo/
│   │   ├── config/env.dart
│   │   ├── red/
│   │   ├── almacenamiento/
│   │   ├── tema/
│   │   └── enrutador/
│   ├── datos/
│   │   ├── modelos/
│   │   │   ├── usuario.dart
│   │   │   ├── pedido.dart
│   │   │   ├── paquete_recargado.dart
│   │   │   └── regla_tarifa.dart
│   │   └── repositorios/
│   │       ├── autenticacion_repositorio.dart
│   │       ├── pedidos_repositorio.dart
│   │       └── paquetes_repositorio.dart
│   ├── caracteristicas/
│   │   ├── autenticacion/
│   │   │   ├── iniciar_sesion_pantalla.dart
│   │   │   ├── registrar_pantalla.dart
│   │   │   └── autenticacion_controlador.dart
│   │   ├── inicio/
│   │   │   └── inicio_pantalla.dart
│   │   ├── pedidos/
│   │   │   ├── pedidos_listado_pantalla.dart
│   │   │   ├── pedido_detalle_pantalla.dart
│   │   │   ├── crear_pedido_pantalla.dart
│   │   │   └── selector_ubicacion_pantalla.dart
│   │   ├── paquetes/
│   │   │   ├── paquetes_tienda_pantalla.dart
│   │   │   ├── mis_paquetes_pantalla.dart
│   │   │   └── saldo_widget.dart
│   │   ├── seguimiento/
│   │   │   └── seguimiento_pantalla.dart      # también accesible público
│   │   └── perfil/
│   ├── servicios/
│   │   ├── push_servicio.dart
│   │   └── ubicacion_servicio.dart
│   └── widgets/
│       ├── pedido_tarjeta.dart
│       ├── linea_tiempo_estado.dart
│       └── mapa_selector.dart
├── android/
├── ios/
├── pubspec.yaml
└── analysis_options.yaml
```

## 🧰 Instalación

```bash
flutter create app-cliente --org com.delivery
cd app-cliente

flutter pub add flutter_riverpod go_router dio flutter_secure_storage \
  mapbox_maps_flutter geolocator image_picker \
  firebase_core firebase_messaging flutter_local_notifications \
  intl permission_handler connectivity_plus url_launcher \
  freezed_annotation json_annotation

flutter pub add -d build_runner freezed json_serializable
```

## 🔐 Autenticación y Registro

### Pantalla de Registro (Vendedor)

```dart
class RegistrarPantalla extends ConsumerStatefulWidget {
  @override
  ConsumerState<RegistrarPantalla> createState() => _RegistrarPantallaEstado();
}

class _RegistrarPantallaEstado extends ConsumerState<RegistrarPantalla> {
  final _formulario = GlobalKey<FormState>();
  final emailCtrl = TextEditingController();
  final telefonoCtrl = TextEditingController();
  final contrasenaCtrl = TextEditingController();
  final nombreCompletoCtrl = TextEditingController();
  final negocioCtrl = TextEditingController();
  final direccionCtrl = TextEditingController();
  LatLng? ubicacionTienda;

  Future<void> _elegirUbicacionTienda() async {
    final elegida = await context.push<LatLng>('/seleccionar-ubicacion');
    if (elegida != null) setState(() => ubicacionTienda = elegida);
  }

  Future<void> _enviar() async {
    if (!_formulario.currentState!.validate() || ubicacionTienda == null) return;
    await ref.read(autenticacionControladorProvider.notifier).registrar(
      email: emailCtrl.text,
      telefono: telefonoCtrl.text,
      contrasena: contrasenaCtrl.text,
      nombreCompleto: nombreCompletoCtrl.text,
      rol: 'VENDEDOR',
      nombreNegocio: negocioCtrl.text,
      direccion: direccionCtrl.text,
      latitud: ubicacionTienda!.lat,
      longitud: ubicacionTienda!.lng,
    );
  }

  @override
  Widget build(BuildContext context) { /* Form UI */ }
}
```

## 🗺️ Selector de Ubicación en Mapa

```dart
class SelectorUbicacionPantalla extends StatefulWidget {
  @override
  State<SelectorUbicacionPantalla> createState() => _SelectorUbicacionPantallaEstado();
}

class _SelectorUbicacionPantallaEstado extends State<SelectorUbicacionPantalla> {
  Position? _centro;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Seleccionar ubicación')),
      body: Stack(
        alignment: Alignment.center,
        children: [
          MapWidget(
            cameraOptions: CameraOptions(
              center: Point(coordinates: Position(-90.51, 14.63)),
              zoom: 15,
            ),
            onCameraChangeListener: (e) {
              // actualizar _centro según posición central del mapa
            },
          ),
          const Icon(Icons.location_pin, size: 48, color: Colors.red),
          Positioned(
            bottom: 24, left: 24, right: 24,
            child: FilledButton(
              onPressed: () {
                if (_centro != null) {
                  Navigator.pop(context, LatLng(_centro!.lat.toDouble(), _centro!.lng.toDouble()));
                }
              },
              child: const Text('Confirmar ubicación'),
            ),
          ),
        ],
      ),
    );
  }
}
```

## ➕ Crear Pedido

```dart
class CrearPedidoPantalla extends ConsumerStatefulWidget {
  @override
  ConsumerState<CrearPedidoPantalla> createState() => _CrearPedidoPantallaEstado();
}

class _CrearPedidoPantallaEstado extends ConsumerState<CrearPedidoPantalla> {
  final formulario = GlobalKey<FormState>();
  final nombreCliente = TextEditingController();
  final telefonoCliente = TextEditingController();
  final direccionDestino = TextEditingController();
  final descripcionPaquete = TextEditingController();
  final montoContraEntregaCtrl = TextEditingController();
  LatLng? ubicacionDestino;
  String metodoPago = 'CONTRA_ENTREGA';

  Future<void> _enviar() async {
    if (!formulario.currentState!.validate() || ubicacionDestino == null) return;
    final repo = ref.read(pedidosRepositorioProvider);
    final pedido = await repo.crear(CrearPedidoEntrada(
      nombreCliente: nombreCliente.text,
      telefonoCliente: telefonoCliente.text,
      direccionDestino: direccionDestino.text,
      latitudDestino: ubicacionDestino!.lat,
      longitudDestino: ubicacionDestino!.lng,
      descripcionPaquete: descripcionPaquete.text,
      metodoPago: metodoPago,
      montoContraEntrega: metodoPago == 'CONTRA_ENTREGA'
          ? double.tryParse(montoContraEntregaCtrl.text) : null,
    ));
    if (mounted) context.go('/pedidos/${pedido.id}');
  }

  @override
  Widget build(BuildContext context) { /* Form UI */ }
}
```

## 📋 Listado y Detalle de Pedidos

### Pantalla lista

```dart
class PedidosListadoPantalla extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final pedidos = ref.watch(misPedidosProvider);
    return Scaffold(
      appBar: AppBar(title: const Text('Mis Pedidos')),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => context.push('/pedidos/nuevo'),
        icon: const Icon(Icons.add),
        label: const Text('Nuevo pedido'),
      ),
      body: pedidos.when(
        data: (lista) => ListView.separated(
          itemCount: lista.length,
          separatorBuilder: (_, __) => const Divider(height: 1),
          itemBuilder: (_, i) => PedidoTarjeta(
            pedido: lista[i],
            onTap: () => context.push('/pedidos/${lista[i].id}'),
          ),
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('$e')),
      ),
    );
  }
}
```

### Pantalla detalle con línea de tiempo

```dart
class PedidoDetallePantalla extends ConsumerWidget {
  final String pedidoId;
  const PedidoDetallePantalla({required this.pedidoId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final pedido = ref.watch(pedidoDetalleProvider(pedidoId));
    return Scaffold(
      appBar: AppBar(title: const Text('Detalle del Pedido')),
      body: pedido.when(
        data: (p) => ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Text(p.codigoSeguimiento, style: Theme.of(context).textTheme.headlineSmall),
            EstadoChip(estado: p.estado),
            const SizedBox(height: 16),
            LineaTiempoEstado(eventos: p.eventos),
            const SizedBox(height: 16),
            // Mapa con ubicación del repartidor si está en tránsito
            if (p.repartidorEntrega?.ubicacionActual != null)
              SizedBox(height: 220, child: MapaSeguimientoVivo(pedido: p)),
          ],
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Text('$e'),
      ),
    );
  }
}
```

## 💳 Paquetes Recargados

### Pantalla de tienda

```dart
class PaquetesTiendaPantalla extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final reglas = ref.watch(reglasTarifaProvider);
    return Scaffold(
      appBar: AppBar(title: const Text('Comprar Paquetes')),
      body: reglas.when(
        data: (lista) => ListView.builder(
          itemCount: lista.length,
          itemBuilder: (_, i) {
            final r = lista[i];
            return Card(
              margin: const EdgeInsets.all(12),
              child: ListTile(
                title: Text(r.nombre),
                subtitle: Text('${r.tamanoPaquete} envíos por \$${r.precioPaquete}'),
                trailing: FilledButton(
                  onPressed: () => ref.read(paquetesRepositorioProvider).comprar(r.id),
                  child: const Text('Comprar'),
                ),
              ),
            );
          },
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Text('$e'),
      ),
    );
  }
}
```

### Widget de saldo (visible en inicio)

```dart
class SaldoWidget extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final saldo = ref.watch(saldoProvider);
    return saldo.when(
      data: (s) => Card(
        color: s.saldoRecargado > 10 ? Colors.green.shade50 : Colors.orange.shade50,
        child: ListTile(
          leading: const Icon(Icons.account_balance_wallet),
          title: Text('${s.saldoRecargado} envíos disponibles'),
          subtitle: Text('${s.paquetesActivos} paquete(s) activos'),
          trailing: TextButton(
            onPressed: () => context.push('/paquetes/tienda'),
            child: const Text('Recargar'),
          ),
        ),
      ),
      loading: () => const SizedBox(),
      error: (_, __) => const SizedBox(),
    );
  }
}
```

## 🔔 Notificaciones Push

Mismo esquema que la app de repartidores. Al recibir un cambio de estado, invalidar el caché:

```dart
FirebaseMessaging.onMessage.listen((msg) {
  final pedidoId = msg.data['pedidoId'];
  if (pedidoId != null) {
    ref.invalidate(pedidoDetalleProvider(pedidoId));
  }
});
```

## 🌐 Seguimiento Público (sin auth)

Si el vendedor comparte el código `DEL-2025-00342`, el cliente final abre:
- Web público: `https://track.delivery.com/DEL-2025-00342`
- O deep link en la app: `delivery://seguimiento/DEL-2025-00342`

```dart
// Ruta pública dentro de la app
GoRoute(
  path: '/seguimiento/:codigo',
  builder: (ctx, state) => SeguimientoPantalla(codigo: state.pathParameters['codigo']!),
),
```

## ✅ Checklist App Cliente/Vendedor

- [ ] Registro con validación y selector de ubicación.
- [ ] Inicio de sesión persistente.
- [ ] Crear pedido con mapa para destino.
- [ ] Listado con filtros y pull-to-refresh.
- [ ] Detalle con línea de tiempo y seguimiento en vivo.
- [ ] Comprar paquetes recargados.
- [ ] Widget de saldo recargado en inicio.
- [ ] Notificaciones push.
- [ ] Seguimiento público por código.
- [ ] Historial y reportes básicos.

## 🧪 Testing

```bash
flutter test
flutter test integration_test/
```

---

> Ver [`API_ENDPOINTS.md`](./API_ENDPOINTS.md) para las llamadas específicas.
