# Guía de Desarrollo - App Repartidores (Flutter)

## 🎯 Objetivo

App móvil (Android/iOS) para que los repartidores gestionen el flujo completo: recibir asignaciones, recoger, entregar, capturar comprobantes y realizar el cierre financiero diario.

## 📦 Stack

- **Flutter** 3.22+
- **Dart** 3.4+
- **Riverpod** (gestión de estado)
- **go_router** (navegación)
- **dio** (HTTP)
- **flutter_secure_storage** (tokens)
- **mapbox_maps_flutter** (mapas)
- **geolocator** + **flutter_background_geolocation** (GPS)
- **image_picker** / **camera** (fotos)
- **signature** (firma del cliente)
- **firebase_messaging** (push)
- **flutter_local_notifications**

## 🗂️ Estructura de Carpetas

```
app-repartidor/
├── lib/
│   ├── main.dart
│   ├── app.dart
│   ├── core/
│   │   ├── config/
│   │   │   └── entorno.dart
│   │   ├── network/
│   │   │   ├── dio_cliente.dart
│   │   │   ├── interceptor_autenticacion.dart
│   │   │   └── interceptor_error.dart
│   │   ├── storage/
│   │   │   └── almacenamiento_seguro.dart
│   │   ├── theme/
│   │   │   └── tema_app.dart
│   │   └── router/
│   │       └── enrutador_app.dart
│   ├── data/
│   │   ├── models/
│   │   │   ├── usuario.dart
│   │   │   ├── pedido.dart
│   │   │   ├── zona.dart
│   │   │   └── cierre.dart
│   │   └── repositories/
│   │       ├── autenticacion_repositorio.dart
│   │       ├── pedidos_repositorio.dart
│   │       └── cierres_repositorio.dart
│   ├── features/
│   │   ├── autenticacion/
│   │   │   ├── pantalla_inicio_sesion.dart
│   │   │   └── controlador_autenticacion.dart
│   │   ├── inicio/
│   │   │   └── pantalla_inicio.dart
│   │   ├── recogidas/
│   │   │   ├── pantalla_lista_recogidas.dart
│   │   │   └── pantalla_detalle_recogida.dart
│   │   ├── entregas/
│   │   │   ├── pantalla_lista_entregas.dart
│   │   │   ├── pantalla_detalle_entrega.dart
│   │   │   └── pantalla_comprobante_entrega.dart
│   │   ├── mapa/
│   │   │   └── pantalla_mapa_ruta.dart
│   │   ├── cierre/
│   │   │   └── pantalla_cierre_diario.dart
│   │   └── perfil/
│   ├── services/
│   │   ├── servicio_ubicacion.dart
│   │   ├── servicio_push.dart
│   │   └── servicio_camara.dart
│   └── widgets/
│       ├── chip_estado.dart
│       ├── tarjeta_pedido.dart
│       └── widget_mapa.dart
├── android/
├── ios/
├── assets/
├── pubspec.yaml
└── analysis_options.yaml
```

## 🧰 Instalación

```bash
flutter create app-repartidor --org com.delivery
cd app-repartidor

# pubspec.yaml dependencies
flutter pub add flutter_riverpod go_router dio flutter_secure_storage \
  mapbox_maps_flutter geolocator flutter_background_geolocation \
  image_picker camera signature \
  firebase_core firebase_messaging flutter_local_notifications \
  intl permission_handler connectivity_plus \
  freezed_annotation json_annotation

flutter pub add -d build_runner freezed json_serializable
```

### `pubspec.yaml` (fragmento)

```yaml
name: app_repartidor
description: App de repartidores para el sistema de entregas
publish_to: none
version: 1.0.0+1

environment:
  sdk: ">=3.4.0 <4.0.0"
  flutter: ">=3.22.0"

flutter:
  uses-material-design: true
  assets:
    - assets/images/
```

## ⚙️ Configuración de Entorno

`lib/core/config/entorno.dart`:

```dart
class Entorno {
  static const urlApi = String.fromEnvironment(
    'API_URL',
    defaultValue: 'http://10.0.2.2:3000/api/v1',
  );
  static const tokenMapbox = String.fromEnvironment('MAPBOX_TOKEN');
}
```

Ejecutar con:
```bash
flutter run --dart-define=API_URL=https://api.delivery.com/v1 \
            --dart-define=MAPBOX_TOKEN=pk.xxxx
```

## 🔐 Cliente HTTP con Autenticación

```dart
class DioCliente {
  static Dio crear() {
    final dio = Dio(BaseOptions(
      baseUrl: Entorno.urlApi,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 30),
    ));

    dio.interceptors.addAll([
      InterceptorAutenticacion(),
      InterceptorError(),
      LogInterceptor(requestBody: true, responseBody: true),
    ]);

    return dio;
  }
}

class InterceptorAutenticacion extends Interceptor {
  final _almacenamiento = const FlutterSecureStorage();

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
    final token = await _almacenamiento.read(key: 'tokenAcceso');
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    return handler.next(options);
  }
}
```

## 🗺️ Mapa con Mapbox

```dart
import 'package:mapbox_maps_flutter/mapbox_maps_flutter.dart';

class PantallaMapaRuta extends StatefulWidget {
  final List<LatLng> puntosRuta;
  const PantallaMapaRuta({super.key, required this.puntosRuta});

  @override
  State<PantallaMapaRuta> createState() => _PantallaMapaRutaState();
}

class _PantallaMapaRutaState extends State<PantallaMapaRuta> {
  MapboxMap? _mapa;

  @override
  void initState() {
    super.initState();
    MapboxOptions.setAccessToken(Entorno.tokenMapbox);
  }

  void _alCrearMapa(MapboxMap mapa) async {
    _mapa = mapa;
    final gestor = await mapa.annotations.createPointAnnotationManager();
    for (final p in widget.puntosRuta) {
      await gestor.create(PointAnnotationOptions(
        geometry: Point(coordinates: Position(p.lng, p.lat)),
      ));
    }
  }

  @override
  Widget build(BuildContext context) {
    return MapWidget(
      onMapCreated: _alCrearMapa,
      cameraOptions: CameraOptions(
        center: Point(coordinates: Position(-90.51, 14.63)),
        zoom: 12,
      ),
    );
  }
}
```

## 📍 Servicio de Ubicación

```dart
class ServicioUbicacion {
  final Ref ref;
  ServicioUbicacion(this.ref);

  Stream<Position> transmitirPosicion() {
    return Geolocator.getPositionStream(
      locationSettings: const LocationSettings(
        accuracy: LocationAccuracy.high,
        distanceFilter: 20, // metros
      ),
    );
  }

  Future<void> reportarAlBackend(Position pos) async {
    final dio = ref.read(dioProveedor);
    await dio.post('/repartidores/yo/ubicacion', data: {
      'latitud': pos.latitude,
      'longitud': pos.longitude,
    });
  }

  void iniciarRastreoEnSegundoPlano() {
    // Configurar flutter_background_geolocation
    // con reporte cada 30 seg.
  }
}
```

## 📱 Pantalla Principal del Repartidor

```dart
class PantallaInicio extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final pendientes = ref.watch(pedidosPendientesProveedor);
    return Scaffold(
      appBar: AppBar(title: const Text('Mis Pedidos')),
      bottomNavigationBar: NavigationBar(
        destinations: const [
          NavigationDestination(icon: Icon(Icons.inventory_2), label: 'Recoger'),
          NavigationDestination(icon: Icon(Icons.local_shipping), label: 'Entregar'),
          NavigationDestination(icon: Icon(Icons.map), label: 'Mapa'),
          NavigationDestination(icon: Icon(Icons.receipt_long), label: 'Cierre'),
        ],
        onDestinationSelected: (i) { /* navegar */ },
        selectedIndex: 0,
      ),
      body: pendientes.when(
        data: (pedidos) => ListView.builder(
          itemCount: pedidos.length,
          itemBuilder: (_, i) => TarjetaPedido(pedido: pedidos[i]),
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Error: $e')),
      ),
    );
  }
}
```

## 📸 Captura de Comprobante

```dart
class PantallaComprobanteEntrega extends ConsumerStatefulWidget {
  final String pedidoId;
  const PantallaComprobanteEntrega({super.key, required this.pedidoId});

  @override
  ConsumerState<PantallaComprobanteEntrega> createState() => _Estado();
}

class _Estado extends ConsumerState<PantallaComprobanteEntrega> {
  XFile? foto;
  final controladorFirma = SignatureController(penStrokeWidth: 2);
  final controladorRecibidoPor = TextEditingController();

  Future<void> _tomarFoto() async {
    final selector = ImagePicker();
    foto = await selector.pickImage(source: ImageSource.camera, maxWidth: 1600, imageQuality: 80);
    setState(() {});
  }

  Future<void> _enviar() async {
    if (foto == null) return;
    final pos = await Geolocator.getCurrentPosition();
    final repo = ref.read(pedidosRepositorioProveedor);
    await repo.entregar(
      pedidoId: widget.pedidoId,
      foto: File(foto!.path),
      firma: await controladorFirma.toPngBytes(),
      recibidoPor: controladorRecibidoPor.text,
      latitud: pos.latitude, longitud: pos.longitude,
    );
    if (mounted) context.go('/entregas');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Comprobante de Entrega')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            ElevatedButton.icon(
              onPressed: _tomarFoto,
              icon: const Icon(Icons.camera_alt),
              label: const Text('Tomar foto'),
            ),
            if (foto != null) Image.file(File(foto!.path), height: 200),
            TextField(
              controller: controladorRecibidoPor,
              decoration: const InputDecoration(labelText: 'Recibido por'),
            ),
            const SizedBox(height: 12),
            const Text('Firma del cliente'),
            Signature(controller: controladorFirma, height: 180, backgroundColor: Colors.grey.shade200),
            const Spacer(),
            FilledButton(onPressed: _enviar, child: const Text('Confirmar Entrega')),
          ],
        ),
      ),
    );
  }
}
```

## 💰 Pantalla de Cierre Diario

```dart
class PantallaCierreDiario extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final resumen = ref.watch(resumenCierreHoyProveedor);
    return Scaffold(
      appBar: AppBar(title: const Text('Cierre del Día')),
      body: resumen.when(
        data: (datos) => Padding(
          padding: const EdgeInsets.all(16),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text('Entregas: ${datos.cantidadEntregadas}'),
            Text('Monto esperado: \$${datos.montoEsperado}',
                 style: Theme.of(context).textTheme.headlineSmall),
            // Formulario: monto reportado + foto comprobante + notas
            const FormularioCierre(),
          ]),
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Text('$e'),
      ),
    );
  }
}
```

## 🔔 Notificaciones Push

```dart
class ServicioPush {
  Future<void> iniciar() async {
    await Firebase.initializeApp();
    await FirebaseMessaging.instance.requestPermission();
    final token = await FirebaseMessaging.instance.getToken();
    if (token != null) {
      // registrar token en backend vía /tokens-dispositivo
    }

    FirebaseMessaging.onMessage.listen((msg) {
      // mostrar notificación local
    });

    FirebaseMessaging.onMessageOpenedApp.listen((msg) {
      // navegar al pedido
    });
  }
}
```

## 🔐 Permisos

`android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

`ios/Runner/Info.plist`:

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Necesitamos tu ubicación para asignarte pedidos cercanos.</string>
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>Seguimiento en segundo plano para optimizar rutas.</string>
<key>NSCameraUsageDescription</key>
<string>Tomar foto del comprobante de entrega.</string>
```

## ✅ Checklist App Repartidor

- [ ] Inicio de sesión con almacenamiento seguro de tokens.
- [ ] Lista de pedidos por recoger y por entregar.
- [ ] Mapa con ruta óptima.
- [ ] Acciones: recoger, llegar al punto, tomar para entrega, entregar.
- [ ] Captura de foto + firma + ubicación en la entrega.
- [ ] Manejo de entregas fallidas.
- [ ] Cierre diario con foto del comprobante.
- [ ] Ubicación en segundo plano (con permiso).
- [ ] Notificaciones push funcionando.
- [ ] Manejo de red inestable (reintentos + cola local).

---

> Ver [`INTEGRACION_MAPBOX.md`](./INTEGRACION_MAPBOX.md) y [`NOTIFICACIONES.md`](./NOTIFICACIONES.md).
