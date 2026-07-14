import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:geolocator/geolocator.dart' as geo;
import 'package:mapbox_maps_flutter/mapbox_maps_flutter.dart' as mb;
import 'package:permission_handler/permission_handler.dart' as ph;

import '../../../core/config/entorno.dart';
import '../../../core/network/excepciones_api.dart';
import '../../../core/proveedores_globales.dart';
import '../../../data/modelos/pedido.dart';
import '../../../widgets/boton_con_carga.dart';
import '../proveedor_recogidas.dart';
import 'algoritmo_ruta.dart';

/// Tab "Ruta" de la pantalla de recogidas. Muestra el mapa con mi ubicación,
/// los marcadores numerados de las tiendas pendientes ordenadas por vecino
/// más cercano y los tramos de la ruta entre cada uno.
///
/// Al pulsar "Iniciar ruta" se suscribe al stream de GPS y avanza
/// automáticamente a la siguiente parada cuando el rider entra en el radio
/// de geofencing de la tienda actual.
class VistaMapaRecogidas extends ConsumerStatefulWidget {
  const VistaMapaRecogidas({super.key});

  @override
  ConsumerState<VistaMapaRecogidas> createState() =>
      _VistaMapaRecogidasEstado();
}

class _VistaMapaRecogidasEstado extends ConsumerState<VistaMapaRecogidas>
    with WidgetsBindingObserver {
  // ─── Managers de Mapbox ────────────────────────────────────────────
  mb.MapboxMap? _mapa;
  mb.CircleAnnotationManager? _gestorCirculos;
  mb.PointAnnotationManager? _gestorEtiquetas;
  mb.PolylineAnnotationManager? _gestorPolilineas;

  // ─── Estado de navegación ─────────────────────────────────────────
  StreamSubscription<geo.Position>? _subUbicacion;
  Timer? _timerWatchdog;

  /// Lista de paradas agrupadas por tienda, en orden de visita.
  List<List<Pedido>> _paradasPorTienda = const [];

  int _indiceActual = 0;
  bool _rutaIniciada = false;
  bool _iniciando = false;
  bool _procesandoRecogida = false;
  bool _rutaCompletada = false;

  geo.Position? _posicionRider;
  geo.Position? _ultimaPosicionCentrada;
  DateTime? _ultimaEmisionEn;

  bool _permisoDenegado = false;
  bool _gpsApagado = false;

  bool get _tokenConfigurado => Entorno.tokenMapbox.isNotEmpty;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _subUbicacion?.cancel();
    _timerWatchdog?.cancel();
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState estado) {
    // Si la app vuelve a primer plano y la ruta estaba activa, reintenta
    // pintar para que el marcador del rider se actualice con la posición
    // más reciente (el stream puede haberse pausado en background).
    if (estado == AppLifecycleState.resumed && _rutaIniciada) {
      _dibujarRutaSiHayDatos();
    }
  }

  // ─── Render ───────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    if (!_tokenConfigurado) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(24),
          child: Text(
            'MAPBOX_TOKEN no configurado.\n'
            'Inicia Flutter con --dart-define=MAPBOX_TOKEN=pk.xxx',
            textAlign: TextAlign.center,
          ),
        ),
      );
    }

    // Refresca el mapa cada vez que cambie la lista de recogidas pendientes
    // (p. ej. cuando se completa una tienda y el provider se invalida).
    ref.listen(recogidasPendientesProveedor, (_, _) {
      _dibujarRutaSiHayDatos();
    });

    final recogidas = ref.watch(recogidasPendientesProveedor);

    return Stack(
      children: [
        mb.MapWidget(
          key: const ValueKey('mapa-recogidas-ruta'),
          cameraOptions: mb.CameraOptions(
            center: mb.Point(coordinates: mb.Position(-89.2182, 13.6929)),
            zoom: 12,
          ),
          onMapCreated: _alCrearMapa,
        ),
        // Banner superior para estado de GPS / permisos.
        if (_permisoDenegado || _gpsApagado || _mostrarWatchdog())
          Positioned(
            top: 12,
            left: 12,
            right: 12,
            child: _BannerEstado(
              permisoDenegado: _permisoDenegado,
              gpsApagado: _gpsApagado,
              watchdog: _mostrarWatchdog(),
            ),
          ),
        // Botón flotante de recarga manual.
        Positioned(
          top: 12,
          right: 12,
          child: BotonConCarga(
            variante: VarianteBoton.flotante,
            heroTag: 'recargar-recogidas',
            tooltip: 'Recargar',
            onPressed: () async {
              ref.invalidate(recogidasPendientesProveedor);
              await _dibujarRutaSiHayDatos();
            },
            icono: const Icon(Icons.refresh),
          ),
        ),
        // Estado vacío.
        if (recogidas.maybeWhen(
              data: (lista) => lista.isEmpty,
              orElse: () => false,
            ))
          const Positioned.fill(child: _OverlayVacio()),
        // Panel inferior de acción.
        Positioned(
          left: 0,
          right: 0,
          bottom: 0,
          child: SafeArea(
            top: false,
            child: _PanelInferior(
              rutaIniciada: _rutaIniciada,
              rutaCompletada: _rutaCompletada,
              procesando: _procesandoRecogida,
              iniciando: _iniciando,
              indiceActual: _indiceActual,
              totalParadas: _paradasPorTienda.length,
              paradaActual: _paradaActual,
              onIniciar: _iniciarRuta,
              onDetener: _detenerRuta,
              onSaltar: _saltarParadaActual,
            ),
          ),
        ),
      ],
    );
  }

  List<Pedido>? get _paradaActual {
    if (_indiceActual < 0 || _indiceActual >= _paradasPorTienda.length) {
      return null;
    }
    return _paradasPorTienda[_indiceActual];
  }

  bool _mostrarWatchdog() {
    if (!_rutaIniciada) return false;
    if (_procesandoRecogida) return false;
    final ultima = _ultimaEmisionEn;
    if (ultima == null) return false;
    return DateTime.now().difference(ultima) >
        const Duration(seconds: 20);
  }

  // ─── Creación del mapa ────────────────────────────────────────────

  Future<void> _alCrearMapa(mb.MapboxMap mapa) async {
    _mapa = mapa;
    _gestorCirculos = await mapa.annotations.createCircleAnnotationManager();
    _gestorEtiquetas = await mapa.annotations.createPointAnnotationManager();
    _gestorPolilineas =
        await mapa.annotations.createPolylineAnnotationManager();
    await _dibujarRutaSiHayDatos();
  }

  Future<void> _dibujarRutaSiHayDatos() async {
    if (_mapa == null ||
        _gestorCirculos == null ||
        _gestorEtiquetas == null ||
        _gestorPolilineas == null) {
      return;
    }

    final lista = await ref.read(recogidasPendientesProveedor.future);

    // Calcular paradas agrupadas por tienda, ordenadas por vecino más cercano
    // desde la posición actual del rider (si la tenemos).
    final rutaPlana = calcularRutaVecinoMasCercano(
      latitudOrigen: _posicionRider?.latitude,
      longitudOrigen: _posicionRider?.longitude,
      paradas: lista,
    );
    final nuevasParadas = agruparPorTienda(rutaPlana);

    setState(() {
      _paradasPorTienda = nuevasParadas;
      if (_indiceActual >= nuevasParadas.length) {
        _indiceActual = 0;
      }
      if (nuevasParadas.isEmpty) {
        _rutaCompletada = false;
      }
    });

    await _gestorCirculos!.deleteAll();
    await _gestorEtiquetas!.deleteAll();
    await _gestorPolilineas!.deleteAll();

    // Marcador del rider.
    final pos = _posicionRider;
    if (pos != null) {
      await _gestorCirculos!.create(
        mb.CircleAnnotationOptions(
          geometry: mb.Point(
            coordinates: mb.Position(pos.longitude, pos.latitude),
          ),
          circleColor: 0xFF1E88E5,
          circleRadius: 10,
          circleStrokeColor: 0xFFFFFFFF,
          circleStrokeWidth: 3,
        ),
      );
    }

    // Marcadores numerados de las tiendas.
    for (var i = 0; i < nuevasParadas.length; i++) {
      final parada = nuevasParadas[i].first;
      final numero = i + 1;
      final lat = parada.latitudOrigen!;
      final lng = parada.longitudOrigen!;
      final geometria = mb.Point(coordinates: mb.Position(lng, lat));
      final esActual = i == _indiceActual && _rutaIniciada;

      await _gestorCirculos!.create(
        mb.CircleAnnotationOptions(
          geometry: geometria,
          circleColor: esActual ? 0xFF1E88E5 : 0xFFFFFFFF,
          circleRadius: esActual ? 16 : 14,
          circleStrokeColor: 0xFF1E88E5,
          circleStrokeWidth: 3,
        ),
      );
      await _gestorEtiquetas!.create(
        mb.PointAnnotationOptions(
          geometry: geometria,
          textField: '$numero',
          textColor: esActual ? 0xFFFFFFFF : 0xFF1E88E5,
          textSize: 14.0,
          textHaloColor: 0xFF1E88E5,
          textHaloWidth: esActual ? 0.5 : 1.0,
        ),
      );
    }

    // Polylines: rider → parada0, parada0 → parada1, …
    final coordenadas = <mb.Position>[
      if (pos != null) mb.Position(pos.longitude, pos.latitude),
      ...nuevasParadas.map(
        (g) => mb.Position(g.first.longitudOrigen!, g.first.latitudOrigen!),
      ),
    ];
    if (coordenadas.length >= 2) {
      await _gestorPolilineas!.create(
        mb.PolylineAnnotationOptions(
          geometry: mb.LineString(coordinates: coordenadas),
          lineColor: 0xFF1E88E5,
          lineWidth: 4.0,
          lineOpacity: 0.85,
        ),
      );
    }

    // Centrar la cámara una vez al cargar, sobre la primera parada (o el
    // rider si aún no hay paradas). Después, la cámara la mueve el stream.
    if (_ultimaPosicionCentrada == null) {
      final objetivo = nuevasParadas.isNotEmpty
          ? mb.Point(
              coordinates: mb.Position(
                nuevasParadas.first.first.longitudOrigen!,
                nuevasParadas.first.first.latitudOrigen!,
              ),
            )
          : (pos != null
              ? mb.Point(
                  coordinates: mb.Position(pos.longitude, pos.latitude),
                )
              : null);
      if (objetivo != null) {
        await _mapa!.flyTo(
          mb.CameraOptions(center: objetivo, zoom: 13),
          mb.MapAnimationOptions(duration: 600),
        );
      }
    }
  }

  // ─── Iniciar / detener ruta ──────────────────────────────────────

  Future<void> _iniciarRuta() async {
    if (_iniciando || _rutaIniciada) return; // anti-doble-tap
    setState(() => _iniciando = true);
    final messenger = ScaffoldMessenger.of(context);
    try {
      final habilitado = await geo.Geolocator.isLocationServiceEnabled();
      if (!habilitado) {
        setState(() => _gpsApagado = true);
        messenger.showSnackBar(const SnackBar(
          content: Text('Activa el GPS para iniciar la ruta'),
          backgroundColor: Colors.red,
        ));
        return;
      }

      var permiso = await geo.Geolocator.checkPermission();
      if (permiso == geo.LocationPermission.denied) {
        permiso = await geo.Geolocator.requestPermission();
      }
      if (permiso == geo.LocationPermission.denied ||
          permiso == geo.LocationPermission.deniedForever) {
        setState(() => _permisoDenegado = true);
        messenger.showSnackBar(SnackBar(
          content: const Text(
            'Sin permiso de ubicación. Actívalo en ajustes del sistema.',
          ),
          action: SnackBarAction(
            label: 'Ajustes',
            onPressed: () => ph.openAppSettings(),
          ),
          backgroundColor: Colors.red,
        ));
        return;
      }

      // Posición inicial.
      geo.Position? posInicial;
      try {
        posInicial = await geo.Geolocator.getCurrentPosition(
          locationSettings: const geo.LocationSettings(
            accuracy: geo.LocationAccuracy.high,
          ),
        );
      } catch (_) {
        // seguimos sin posición inicial; el stream la traerá
      }
      if (posInicial != null) {
        _posicionRider = posInicial;
        _ultimaPosicionCentrada = posInicial;
      }

      setState(() {
        _rutaIniciada = true;
        _rutaCompletada = false;
        _permisoDenegado = false;
        _gpsApagado = false;
        _indiceActual = 0;
      });

      // Redibuja con la posición inicial (puede cambiar el orden de las paradas).
      await _dibujarRutaSiHayDatos();

      // Si ya estaba dentro del radio de la primera tienda al iniciar, dispara
      // inmediatamente; si no, el stream lo hará al acercarse.
      if (posInicial != null) _verificarGeofencing(posInicial);

      // Suscribirse al stream de posición.
      _subUbicacion?.cancel();
      _subUbicacion = geo.Geolocator.getPositionStream(
        locationSettings: const geo.LocationSettings(
          accuracy: geo.LocationAccuracy.high,
          distanceFilter: 5,
        ),
      ).listen(_onNuevaPosicion, onError: (_) {/* silencioso */});

      // Watchdog: detecta pérdida del stream (no emite en 20 s).
      _timerWatchdog?.cancel();
      _timerWatchdog = Timer.periodic(const Duration(seconds: 10), (_) {
        if (mounted) setState(() {});
      });

      messenger.showSnackBar(const SnackBar(
        content: Text('Ruta iniciada. Acerca a la primera tienda.'),
        backgroundColor: Colors.green,
      ));
    } finally {
      if (mounted) setState(() => _iniciando = false);
    }
  }

  Future<void> _detenerRuta() async {
    await _subUbicacion?.cancel();
    _subUbicacion = null;
    _timerWatchdog?.cancel();
    _timerWatchdog = null;
    setState(() {
      _rutaIniciada = false;
      _rutaCompletada = false;
      _indiceActual = 0;
      _ultimaPosicionCentrada = null;
    });
    await _dibujarRutaSiHayDatos();
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
      content: Text('Ruta detenida'),
    ));
  }

  Future<void> _saltarParadaActual() async {
    if (!_rutaIniciada) return;
    await _avanzarSiguienteParada(forzado: true);
  }

  // ─── Stream de posición ───────────────────────────────────────────

  Future<void> _onNuevaPosicion(geo.Position pos) async {
    if (!mounted || !_rutaIniciada) return;
    _posicionRider = pos;
    _ultimaEmisionEn = DateTime.now();

    // Actualiza marcador del rider y reordena ruta si la posición cambió
    // significativamente (cambia el vecino más cercano inicial).
    final ultima = _ultimaPosicionCentrada;
    final distancia = ultima == null
        ? double.infinity
        : distanciaMetrosHaversine(
            ultima.latitude,
            ultima.longitude,
            pos.latitude,
            pos.longitude,
          );

    await _dibujarRutaSiHayDatos();

    if (distancia >= kUmbralDistanciaMinimaMetros) {
      _ultimaPosicionCentrada = pos;
      final mapa = _mapa;
      if (mapa != null) {
        await mapa.flyTo(
          mb.CameraOptions(
            center: mb.Point(
              coordinates: mb.Position(pos.longitude, pos.latitude),
            ),
            zoom: 14,
          ),
          mb.MapAnimationOptions(duration: 500),
        );
      }
    }

    _verificarGeofencing(pos);
  }

  // ─── Geofencing ──────────────────────────────────────────────────

  Future<void> _verificarGeofencing(geo.Position pos) async {
    if (!_rutaIniciada || _procesandoRecogida) return;
    final parada = _paradaActual;
    if (parada == null || parada.isEmpty) return;

    final primerPedido = parada.first;
    final latTienda = primerPedido.latitudOrigen;
    final lngTienda = primerPedido.longitudOrigen;
    if (latTienda == null || lngTienda == null) return;

    final distancia = distanciaMetrosHaversine(
      pos.latitude,
      pos.longitude,
      latTienda,
      lngTienda,
    );
    if (distancia <= kRadioGeofenceMetros) {
      await _recogerTiendaActual(pos);
    }
  }

  Future<void> _recogerTiendaActual(geo.Position pos) async {
    if (_procesandoRecogida) return;
    final parada = _paradaActual;
    if (parada == null || parada.isEmpty) return;

    setState(() => _procesandoRecogida = true);
    final messenger = ScaffoldMessenger.of(context);
    final repo = ref.read(pedidosRepositorioProveedor);
    final nombreTienda = parada.first.nombreVendedor ?? 'la tienda';

    final ids = parada.map((p) => p.id).toList(growable: false);
    try {
      final resultado = await repo.transicionesBulk(
        ids,
        (id) => repo.recoger(id, lat: pos.latitude, lng: pos.longitude),
      );
      if (resultado.todoOk) {
        ref.invalidate(recogidasPendientesProveedor);
        if (!mounted) return;
        messenger.showSnackBar(SnackBar(
          content: Text('Recogida completada en $nombreTienda'),
          backgroundColor: Colors.green,
        ));
        await _avanzarSiguienteParada(forzado: true);
      } else {
        final primerFallo = resultado.fallidos.first;
        final msg = primerFallo.error is ExcepcionApi
            ? (primerFallo.error as ExcepcionApi).mensaje
            : 'No se pudieron recoger todos los pedidos';
        if (!mounted) return;
        messenger.showSnackBar(SnackBar(
          content: Text(msg),
          backgroundColor: Colors.red,
        ));
      }
    } catch (e) {
      if (!mounted) return;
      messenger.showSnackBar(SnackBar(
        content: Text(e is ExcepcionApi ? e.mensaje : 'Error: $e'),
        backgroundColor: Colors.red,
      ));
    } finally {
      if (mounted) setState(() => _procesandoRecogida = false);
    }
  }

  Future<void> _avanzarSiguienteParada({required bool forzado}) async {
    final siguiente = _indiceActual + 1;
    if (siguiente >= _paradasPorTienda.length) {
      setState(() {
        _rutaCompletada = true;
      });
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
        content: Text('Ruta completada'),
        backgroundColor: Colors.green,
      ));
      await _detenerRuta();
      return;
    }
    setState(() {
      _indiceActual = siguiente;
    });
    await _dibujarRutaSiHayDatos();
    final parada = _paradaActual;
    final mapa = _mapa;
    if (parada != null && mapa != null && parada.first.latitudOrigen != null) {
      await mapa.flyTo(
        mb.CameraOptions(
          center: mb.Point(
            coordinates: mb.Position(
              parada.first.longitudOrigen!,
              parada.first.latitudOrigen!,
            ),
          ),
          zoom: 14,
        ),
        mb.MapAnimationOptions(duration: 800),
      );
    }
  }
}

// ─── Subwidgets ────────────────────────────────────────────────────

class _BannerEstado extends StatelessWidget {
  final bool permisoDenegado;
  final bool gpsApagado;
  final bool watchdog;

  const _BannerEstado({
    required this.permisoDenegado,
    required this.gpsApagado,
    required this.watchdog,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    String mensaje;
    Color color;
    if (permisoDenegado) {
      mensaje = 'Permiso de ubicación denegado. Actívalo en ajustes.';
      color = Colors.red.shade700;
    } else if (gpsApagado) {
      mensaje = 'GPS apagado. Enciéndelo para iniciar la ruta.';
      color = Colors.orange.shade800;
    } else if (watchdog) {
      mensaje = 'GPS sin señal, reintentando…';
      color = Colors.orange.shade800;
    } else {
      return const SizedBox.shrink();
    }
    return Card(
      color: color,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        child: Row(
          children: [
            const Icon(Icons.warning_amber, color: Colors.white, size: 20),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                mensaje,
                style: theme.textTheme.bodyMedium
                    ?.copyWith(color: Colors.white),
              ),
            ),
            if (permisoDenegado)
              BotonConCarga(
                variante: VarianteBoton.text,
                estilo: TextButton.styleFrom(foregroundColor: Colors.white),
                onPressed: () => ph.openAppSettings(),
                etiqueta: const Text('Ajustes'),
              ),
          ],
        ),
      ),
    );
  }
}

class _OverlayVacio extends StatelessWidget {
  const _OverlayVacio();

  @override
  Widget build(BuildContext context) {
    return IgnorePointer(
      child: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.inbox_outlined,
                  size: 56, color: Colors.grey.shade600),
              const SizedBox(height: 12),
              const Text(
                'No hay recogidas pendientes',
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _PanelInferior extends StatelessWidget {
  final bool rutaIniciada;
  final bool rutaCompletada;
  final bool procesando;
  final bool iniciando;
  final int indiceActual;
  final int totalParadas;
  final List<Pedido>? paradaActual;
  final Future<void> Function() onIniciar;
  final Future<void> Function() onDetener;
  final Future<void> Function() onSaltar;

  const _PanelInferior({
    required this.rutaIniciada,
    required this.rutaCompletada,
    required this.procesando,
    required this.iniciando,
    required this.indiceActual,
    required this.totalParadas,
    required this.paradaActual,
    required this.onIniciar,
    required this.onDetener,
    required this.onSaltar,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final tieneParadas = totalParadas > 0;

    return Material(
      elevation: 6,
      color: theme.colorScheme.surface,
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
        child: !rutaIniciada
            ? SizedBox(
                width: double.infinity,
                child: FilledButton.icon(
                  onPressed: (tieneParadas && !iniciando) ? onIniciar : null,
                  icon: iniciando
                      ? const SizedBox(
                          width: 18,
                          height: 18,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.white,
                          ),
                        )
                      : const Icon(Icons.play_arrow),
                  label: Text(iniciando ? 'Iniciando…' : 'Iniciar ruta'),
                  style: FilledButton.styleFrom(
                    minimumSize: const Size.fromHeight(48),
                  ),
                ),
              )
            : rutaCompletada
                ? SizedBox(
                    width: double.infinity,
                    child: BotonConCarga(
                      variante: VarianteBoton.tonal,
                      onPressed: onDetener,
                      icono: const Icon(Icons.stop_circle_outlined),
                      etiqueta: const Text('Ruta completada — Detener'),
                      estilo: FilledButton.styleFrom(
                        minimumSize: const Size.fromHeight(48),
                      ),
                    ),
                  )
                : Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              'Tienda ${indiceActual + 1} de $totalParadas',
                              style: theme.textTheme.titleSmall
                                  ?.copyWith(fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              paradaActual?.first.nombreVendedor ??
                                  'Sin vendedor',
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            Text(
                              procesando
                                  ? 'Recogiendo…'
                                  : 'Acerca a la tienda (≤ ${kRadioGeofenceMetros.toInt()} m)',
                              style: theme.textTheme.bodySmall?.copyWith(
                                color: theme.colorScheme.onSurfaceVariant,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 12),
                      OutlinedButton.icon(
                        onPressed: procesando ? null : onSaltar,
                        icon: const Icon(Icons.skip_next),
                        label: const Text('Saltar'),
                      ),
                    ],
                  ),
      ),
    );
  }
}