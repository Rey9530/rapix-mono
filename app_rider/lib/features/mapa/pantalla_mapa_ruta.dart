import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter_polyline_points/flutter_polyline_points.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:geolocator/geolocator.dart' as geo;
import 'package:mapbox_maps_flutter/mapbox_maps_flutter.dart';
import 'package:permission_handler/permission_handler.dart' as ph;

import '../../core/config/entorno.dart';
import '../../core/proveedores_globales.dart';
import '../../data/modelos/pedido.dart';
import '../../features/recogidas/widgets/algoritmo_ruta.dart';
import '../../widgets/boton_con_carga.dart';
import '../en_curso/proveedor_en_curso.dart';
import '../entregas/proveedor_entregas.dart';
import '../recogidas/proveedor_recogidas.dart';

// ─── Paleta ─────────────────────────────────────────────────────
const int _colorRider = 0xFF1E88E5;
const int _colorOrigen = 0xFFFF9800;
const int _colorDestino = 0xFF1E88E5;
const int _colorRuta = 0xFF1E88E5;
const int _colorVisitada = 0xFF9E9E9E;

/// Padding en píxeles lógicos que `cameraForCoordinatesPadding` aplica al
/// encuadre automático: deja sitio arriba para banners, abajo para el panel
/// de navegación y a los costados para no pegar los marcadores al borde.
final MbxEdgeInsets _paddingEncuadre = MbxEdgeInsets(
  top: 96,
  left: 48,
  bottom: 220,
  right: 48,
);

/// Zoom máximo que permite el encuadre automático: evita que dos marcadores
/// muy cercanos produzcan un zoom extremo.
const double _zoomMaxEncuadre = 15.0;

/// Zoom aplicado durante la navegación activa. Cercano para ver calles.
const double _zoomNavegacion = 16.0;

/// Duración de la animación de cámara al centrar en la siguiente parada.
const int _duracionFlyToParadaMs = 800;

/// Velocidad promedio usada para el ETA del panel (≈ 30 km/h).
const double _velocidadPromedioMps = 8.33;

/// Centro fallback (San Salvador) cuando aún no hay permiso de ubicación.
final Position _centroFallback = Position(-89.2182, 13.6929);

/// Umbral mínimo de movimiento para recentrar la cámara durante navegación.
/// Evita animar la vista en cada tick del stream cuando el movimiento real
/// es despreciable.
const double _umbralCentradoNavegacionMetros = 10.0;

/// Variación mínima de bearing (en grados) antes de rotar la cámara. Filtra
/// el ruido GPS para que el mapa no oscile con cada emisión del stream.
const double _umbralBearingGrados = 3.0;

class PantallaMapaRuta extends ConsumerStatefulWidget {
  const PantallaMapaRuta({super.key});

  @override
  ConsumerState<PantallaMapaRuta> createState() => _PantallaMapaRutaEstado();
}

class _PantallaMapaRutaEstado extends ConsumerState<PantallaMapaRuta>
    with WidgetsBindingObserver {
  // ─── Managers de Mapbox ─────────────────────────────────────────
  MapboxMap? _mapa;
  CircleAnnotationManager? _gestorCirculos;
  PointAnnotationManager? _gestorEtiquetas;
  PolylineAnnotationManager? _gestorPolilineas;
  Point? _centroInicial;

  // ─── Posición del rider ─────────────────────────────────────────
  geo.Position? _posicionRider;
  StreamSubscription<geo.Position>? _subUbicacion;

  // ─── Control de cámara y permisos ───────────────────────────────
  bool _primerEncuadre = true;
  bool _permisoDenegado = false;
  bool _gpsApagado = false;

  // ─── Modo navegación (tipo Waze) ────────────────────────────────
  bool _rutaIniciada = false;
  bool _rutaPausada = false;
  bool _rutaCompletada = false;
  int _indiceParadaActual = 0;
  final Set<int> _visitadas = <int>{};
  double _bearingActual = 0.0;
  geo.Position? _posicionPrevia;
  geo.Position? _ultimaPosicionCentrada;

  // ─── Caché de optimización ──────────────────────────────────────
  // Permite redibujar marcadores en cada emisión de GPS sin volver a llamar
  // a `optimizarRuta` en el backend.
  List<_ParadaMapa> _paradasActuales = const [];
  String? _geometriaPolylineCache;

  bool get _tokenConfigurado => Entorno.tokenMapbox.isNotEmpty;

  // ─── Helpers de parada activa ───────────────────────────────────
  _ParadaMapa? get _proximaParada {
    if (_indiceParadaActual < 0 || _indiceParadaActual >= _paradasActuales.length) {
      return null;
    }
    return _paradasActuales[_indiceParadaActual];
  }

  // ─── Lifecycle ─────────────────────────────────────────────────

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _cargarCentroInicial();
    _iniciarSeguimientoUbicacion();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _subUbicacion?.cancel();
    _subUbicacion = null;
    _mapa = null;
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState estado) {
    if (estado == AppLifecycleState.resumed) {
      _dibujarRutaSiHayDatos();
    }
  }

  // ─── Build ──────────────────────────────────────────────────────

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

    ref.listen(recogidasPendientesProveedor, (_, _) => _dibujarRutaSiHayDatos());
    ref.listen(pedidosEnCursoProveedor, (_, _) => _dibujarRutaSiHayDatos());
    ref.listen(entregasPendientesProveedor, (_, _) => _dibujarRutaSiHayDatos());

    final recogidas = ref.watch(recogidasPendientesProveedor);
    final enCurso = ref.watch(pedidosEnCursoProveedor);
    final entregas = ref.watch(entregasPendientesProveedor);

    final cargando =
        recogidas.isLoading || enCurso.isLoading || entregas.isLoading;

    final mostrarBannerProxima =
        _rutaIniciada && !_rutaPausada && !_rutaCompletada && _proximaParada != null;
    final mostrarPanelInferior =
        _rutaIniciada || _rutaCompletada || _paradasActuales.isNotEmpty;
    final mostrarControlesZoom = !_rutaIniciada || _rutaPausada;

    return Stack(
      children: [
        MapWidget(
          key: const ValueKey('mapa-ruta'),
          cameraOptions: CameraOptions(
            center: _centroInicial ?? Point(coordinates: _centroFallback),
            zoom: 12,
          ),
          onMapCreated: (mapa) async {
            _mapa = mapa;
            _gestorCirculos =
                await mapa.annotations.createCircleAnnotationManager();
            _gestorEtiquetas =
                await mapa.annotations.createPointAnnotationManager();
            _gestorPolilineas =
                await mapa.annotations.createPolylineAnnotationManager();
            await _dibujarRutaSiHayDatos();
          },
        ),
        if (_permisoDenegado || _gpsApagado)
          Positioned(
            top: 12,
            left: 12,
            right: 12,
            child: _BannerEstado(
              permisoDenegado: _permisoDenegado,
              gpsApagado: _gpsApagado,
            ),
          ),
        if (mostrarBannerProxima)
          Positioned(
            top: _permisoDenegado || _gpsApagado ? 64 : 12,
            left: 12,
            right: 12,
            child: _BannerProximaParada(
              parada: _proximaParada!,
              distanciaMetros: _distanciaAProximaParada(),
            ),
          ),
        Positioned(
          top: 16,
          right: 16,
          child: BotonConCarga(
            variante: VarianteBoton.flotante,
            heroTag: 'recargar',
            tooltip: 'Recargar',
            onPressed: () async {
              ref.invalidate(recogidasPendientesProveedor);
              ref.invalidate(pedidosEnCursoProveedor);
              ref.invalidate(entregasPendientesProveedor);
              setState(() {
                _primerEncuadre = !_rutaIniciada;
              });
              await _dibujarRutaSiHayDatos();
            },
            icono: const Icon(Icons.refresh),
          ),
        ),
        if (mostrarControlesZoom)
          Positioned(
            bottom: 16,
            right: 16,
            child: Column(
              children: [
                BotonConCarga(
                  variante: VarianteBoton.flotante,
                  heroTag: 'zoom-in',
                  tooltip: 'Acercar',
                  onPressed: () => _ajustarZoom(1),
                  icono: const Icon(Icons.add),
                ),
                const SizedBox(height: 8),
                BotonConCarga(
                  variante: VarianteBoton.flotante,
                  heroTag: 'zoom-out',
                  tooltip: 'Alejar',
                  onPressed: () => _ajustarZoom(-1),
                  icono: const Icon(Icons.remove),
                ),
              ],
            ),
          ),
        if (cargando)
          const Positioned(
            top: 16,
            left: 16,
            child: Card(
              child: Padding(
                padding: EdgeInsets.all(8),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    SizedBox(
                      width: 16,
                      height: 16,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    ),
                    SizedBox(width: 8),
                    Text('Cargando ruta…'),
                  ],
                ),
              ),
            ),
          ),
        if (mostrarPanelInferior)
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            child: SafeArea(
              top: false,
              child: _PanelInferior(
                rutaIniciada: _rutaIniciada,
                rutaPausada: _rutaPausada,
                rutaCompletada: _rutaCompletada,
                indiceActual: _indiceParadaActual,
                totalParadas: _paradasActuales.length,
                paradaActual: _proximaParada,
                distanciaRestanteMetros: _distanciaRestante(),
                onIniciar: _iniciarRuta,
                onPausarReanudar: _alternarPausa,
                onSaltar: _saltarParadaActual,
                onFinalizar: _finalizarRuta,
              ),
            ),
          ),
      ],
    );
  }

  // ─── Posición del rider ─────────────────────────────────────────

  Future<void> _cargarCentroInicial() async {
    final pos = await _obtenerPosicionUnica();
    if (!mounted || pos == null) return;
    final punto = Point(coordinates: Position(pos.longitude, pos.latitude));
    setState(() => _centroInicial = punto);
    final mapa = _mapa;
    if (mapa != null) {
      await mapa.flyTo(
        CameraOptions(center: punto, zoom: 13),
        MapAnimationOptions(duration: 600),
      );
    }
  }

  Future<void> _iniciarSeguimientoUbicacion() async {
    if (!await _solicitarPermisoUbicacion()) return;
    _subUbicacion?.cancel();
    _subUbicacion = geo.Geolocator.getPositionStream(
      locationSettings: const geo.LocationSettings(
        accuracy: geo.LocationAccuracy.high,
        distanceFilter: 5,
      ),
    ).listen(_onNuevaPosicion, onError: (_) {/* silencioso */});
  }

  Future<bool> _solicitarPermisoUbicacion() async {
    if (!await geo.Geolocator.isLocationServiceEnabled()) {
      setState(() => _gpsApagado = true);
      return false;
    }
    var permiso = await geo.Geolocator.checkPermission();
    if (permiso == geo.LocationPermission.denied) {
      permiso = await geo.Geolocator.requestPermission();
    }
    if (permiso == geo.LocationPermission.denied ||
        permiso == geo.LocationPermission.deniedForever) {
      setState(() => _permisoDenegado = true);
      return false;
    }
    setState(() {
      _permisoDenegado = false;
      _gpsApagado = false;
    });
    return true;
  }

  void _onNuevaPosicion(geo.Position pos) {
    if (!mounted) return;
    _posicionPrevia = _posicionRider;
    _posicionRider = pos;
    final navegando = _rutaIniciada && !_rutaPausada;
    if (navegando) {
      _aplicarCamaraSeguimiento(pos);
      _verificarAvanceGeofencing(pos);
    }
    setState(() {});
    // Redibuja sin re-optimizar (usa caché) durante navegación; optimiza
    // solo cuando el estado del dato cambia (ref.listen/refresh/start).
    _dibujarRutaSiHayDatos(reoptimizar: !navegando);
  }

  Future<geo.Position?> _obtenerPosicionUnica() async {
    try {
      return await geo.Geolocator.getCurrentPosition(
        locationSettings: const geo.LocationSettings(
          accuracy: geo.LocationAccuracy.high,
        ),
      );
    } catch (_) {
      return null;
    }
  }

  // ─── Cámara ─────────────────────────────────────────────────────

  Future<void> _ajustarZoom(double delta) async {
    final mapa = _mapa;
    if (mapa == null) return;
    final estado = await mapa.getCameraState();
    final nuevoZoom = (estado.zoom + delta).clamp(0.0, 22.0);
    await mapa.flyTo(
      CameraOptions(center: estado.center, zoom: nuevoZoom),
      MapAnimationOptions(duration: 300),
    );
  }

  /// Encuadre automático de la cámara para que entren rider + todas las
  /// paradas. Solo se aplica una vez al cargar o cuando se refresca, y nunca
  /// durante navegación activa.
  Future<void> _aplicarEncuadreSiProcede(List<_ParadaMapa> paradas) async {
    if (!_primerEncuadre || _rutaIniciada || _rutaCompletada) return;
    final mapa = _mapa;
    if (mapa == null) return;
    final rider = _posicionRider;
    final hayRider = rider != null;
    final hayParadas = paradas.isNotEmpty;
    if (!hayRider && !hayParadas) return;

    final puntos = <Point>[
      if (hayRider)
        Point(coordinates: Position(rider.longitude, rider.latitude)),
      ...paradas.map((p) => Point(coordinates: Position(p.lng, p.lat))),
    ];

    final camera = await mapa.cameraForCoordinatesPadding(
      puntos,
      CameraOptions(),
      _paddingEncuadre,
      _zoomMaxEncuadre,
      null,
    );
    await mapa.flyTo(camera, MapAnimationOptions(duration: 600));
    _primerEncuadre = false;
  }

  /// Recentra la cámara sobre el rider durante navegación activa, aplicando
  /// bearing según la dirección de viaje. Solo se ejecuta si el rider se
  /// movió más allá de `_umbralCentradoNavegacionMetros` desde la última
  /// posición centrada, para evitar jitter.
  Future<void> _aplicarCamaraSeguimiento(geo.Position pos) async {
    final mapa = _mapa;
    if (mapa == null) return;

    final ultima = _ultimaPosicionCentrada;
    if (ultima != null) {
      final distancia = distanciaMetrosHaversine(
        ultima.latitude, ultima.longitude, pos.latitude, pos.longitude,
      );
      if (distancia < _umbralCentradoNavegacionMetros) return;
    }

    // Calcular bearing entre posición previa y actual (dirección de viaje).
    final previa = _posicionPrevia;
    if (previa != null) {
      final b = _calcularBearing(previa, pos);
      if (b != null) _bearingActual = b;
    }

    _ultimaPosicionCentrada = pos;
    await mapa.flyTo(
      CameraOptions(
        center: Point(coordinates: Position(pos.longitude, pos.latitude)),
        zoom: _zoomNavegacion,
        bearing: _bearingActual,
      ),
      MapAnimationOptions(duration: _duracionFlyToParadaMs ~/ 2),
    );
  }

  /// Bearing (0-360, 0=norte) entre dos coordenadas usando la fórmula del
  /// círculo máximo. Devuelve `null` si el cambio es menor al umbral
  /// configurado (ruido GPS) para evitar rotar la cámara innecesariamente.
  double? _calcularBearing(geo.Position desde, geo.Position hasta) {
    final dLng = _aRadianes(hasta.longitude - desde.longitude);
    final lat1 = _aRadianes(desde.latitude);
    final lat2 = _aRadianes(hasta.latitude);
    final y = math.sin(dLng) * math.cos(lat2);
    final x = math.cos(lat1) * math.sin(lat2) -
        math.sin(lat1) * math.cos(lat2) * math.cos(dLng);
    final brng = math.atan2(y, x);
    final grados = (brng * 180 / math.pi + 360) % 360;

    // Diferencia angular mínima considerando el wrap-around de 360°.
    var diff = (grados - _bearingActual).abs();
    if (diff > 180) diff = 360 - diff;
    if (diff < _umbralBearingGrados) return null;
    return grados;
  }

  // ─── Modo navegación ────────────────────────────────────────────

  Future<void> _iniciarRuta() async {
    if (_rutaIniciada) return;
    // Reanudar desde pausa: la ruta ya está activa, solo destrabamos la pausa.
    if (_rutaPausada) {
      setState(() => _rutaPausada = false);
      _ultimaPosicionCentrada = null; // fuerza recentrado al primer fix
      final pos = _posicionRider;
      if (pos != null) {
        _posicionPrevia = pos;
        await _aplicarCamaraSeguimiento(pos);
        _verificarAvanceGeofencing(pos);
      }
      return;
    }

    if (_rutaIniciada) return;
    if (_rutaCompletada) return;
    if (_paradasActuales.isEmpty) return; // no hay nada que navegar

    if (!await _solicitarPermisoUbicacion()) return;
    final pos = _posicionRider ?? await _obtenerPosicionUnica();
    if (pos != null) {
      _posicionRider = pos;
    }

    setState(() {
      _rutaIniciada = true;
      _rutaPausada = false;
      _rutaCompletada = false;
      _indiceParadaActual = 0;
      _visitadas.clear();
      _posicionPrevia = null;
      _ultimaPosicionCentrada = null;
      _bearingActual = 0.0;
      _primerEncuadre = false; // desactiva encuadre auto durante navegación
    });

    await _dibujarRutaSiHayDatos();
    if (pos != null) {
      _posicionPrevia = pos; // para que el primer bearing use este como "anterior"
      _aplicarCamaraSeguimiento(pos);
      _verificarAvanceGeofencing(pos);
    }
  }

  /// Pausa o reanuda la navegación sin perder el progreso actual
  /// (parada activa, índice, visitadas, bearing).
  Future<void> _alternarPausa() async {
    if (_rutaCompletada) return;
    if (!_rutaIniciada) return;

    if (_rutaPausada) {
      setState(() => _rutaPausada = false);
      _ultimaPosicionCentrada = null; // fuerzo recentrado al primer fix
      final pos = _posicionRider;
      if (pos != null) {
        _posicionPrevia = pos;
        await _aplicarCamaraSeguimiento(pos);
        _verificarAvanceGeofencing(pos);
      }
      return;
    }

    setState(() => _rutaPausada = true);
  }

  /// Sale completamente del modo navegación: resetea progreso y re-habilita
  /// el encuadre automático en la próxima carga.
  Future<void> _finalizarRuta() async {
    if (!_rutaIniciada && !_rutaPausada && !_rutaCompletada) return;
    setState(() {
      _rutaIniciada = false;
      _rutaPausada = false;
      _rutaCompletada = false;
      _indiceParadaActual = 0;
      _visitadas.clear();
      _posicionPrevia = null;
      _ultimaPosicionCentrada = null;
      _bearingActual = 0.0;
      _primerEncuadre = true; // re-habilita encuadre al volver a modo vista
    });
    await _dibujarRutaSiHayDatos();
  }

  void _saltarParadaActual() {
    if (!_rutaIniciada || _rutaPausada || _rutaCompletada) return;
    _avanzarSiguienteParada();
  }

  void _verificarAvanceGeofencing(geo.Position pos) {
    if (!_rutaIniciada || _rutaPausada || _rutaCompletada) return;
    final parada = _proximaParada;
    if (parada == null) return;
    final distancia = distanciaMetrosHaversine(
      pos.latitude, pos.longitude, parada.lat, parada.lng,
    );
    if (distancia <= kRadioGeofenceMetros) {
      _avanzarSiguienteParada();
    }
  }

  Future<void> _avanzarSiguienteParada() async {
    if (!_rutaIniciada) return;

    setState(() {
      _visitadas.add(_indiceParadaActual);
      _indiceParadaActual = _indiceParadaActual + 1;
    });

    final total = _paradasActuales.length;
    if (_indiceParadaActual >= total) {
      // Ruta completada.
      setState(() {
        _rutaCompletada = true;
        _rutaIniciada = false;
        _rutaPausada = false;
        _primerEncuadre = true; // permite reencuadre al detener
      });
      await _dibujarRutaSiHayDatos();
      return;
    }

    // Vuelve a centrar en la siguiente parada objetivo con el bearing
    // calculado desde la posición actual.
    final siguienteParada = _paradasActuales[_indiceParadaActual];
    final mapa = _mapa;
    final pos = _posicionRider;
    if (mapa != null && pos != null) {
      final b = _calcularBearing(
        pos,
        geo.Position(
          longitude: siguienteParada.lng,
          latitude: siguienteParada.lat,
          timestamp: pos.timestamp,
          accuracy: pos.accuracy,
          altitude: pos.altitude,
          altitudeAccuracy: pos.altitudeAccuracy,
          heading: pos.heading,
          headingAccuracy: pos.headingAccuracy,
          speed: pos.speed,
          speedAccuracy: pos.speedAccuracy,
        ),
      );
      if (b != null) _bearingActual = b;
      _ultimaPosicionCentrada = null; // fuerza recentrado en próxima emisión
      await mapa.flyTo(
        CameraOptions(
          center: Point(
            coordinates: Position(siguienteParada.lng, siguienteParada.lat),
          ),
          zoom: _zoomNavegacion,
          bearing: _bearingActual,
        ),
        MapAnimationOptions(duration: _duracionFlyToParadaMs),
      );
    }

    await _dibujarRutaSiHayDatos(reoptimizar: false);
  }

  // ─── Cálculos para panel/banner ─────────────────────────────────

  double _distanciaAProximaParada() {
    final rider = _posicionRider;
    final p = _proximaParada;
    if (rider == null || p == null) return 0;
    return distanciaMetrosHaversine(
      rider.latitude, rider.longitude, p.lat, p.lng,
    );
  }

  /// Suma la distancia desde el rider a la próxima parada y entre las
  /// paradas restantes (suma haversine por waypoint).
  double _distanciaRestante() {
    final rider = _posicionRider;
    if (rider == null) return 0;
    if (_indiceParadaActual >= _paradasActuales.length) return 0;
    final restantes = _paradasActuales.skip(_indiceParadaActual).toList();
    if (restantes.isEmpty) return 0;
    double total = distanciaMetrosHaversine(
      rider.latitude, rider.longitude, restantes.first.lat, restantes.first.lng,
    );
    for (var i = 1; i < restantes.length; i++) {
      total += distanciaMetrosHaversine(
        restantes[i - 1].lat, restantes[i - 1].lng,
        restantes[i].lat, restantes[i].lng,
      );
    }
    return total;
  }

  // ─── Render del mapa ────────────────────────────────────────────

  Future<void> _dibujarRutaSiHayDatos({bool reoptimizar = true}) async {
    if (_mapa == null ||
        _gestorCirculos == null ||
        _gestorEtiquetas == null ||
        _gestorPolilineas == null) {
      return;
    }

    // 1. Datos
    final recogidas = await ref.read(recogidasPendientesProveedor.future);
    final enCurso = await ref.read(pedidosEnCursoProveedor.future);
    final entregas = await ref.read(entregasPendientesProveedor.future);

    // 2. Rider
    geo.Position? rider = _posicionRider;
    rider ??= await _obtenerPosicionUnica();

    // 3. Paradas base
    final paradasBase = _construirParadas(recogidas, enCurso, entregas);

    // 4. Optimización (cacheada durante navegación).
    List<_ParadaMapa> orden;
    String? geometriaPolyline;
    if (!reoptimizar && _paradasActuales.isNotEmpty) {
      orden = _paradasActuales;
      geometriaPolyline = _geometriaPolylineCache;
    } else {
      final resultado = await _ordenarParadas(
        rider?.latitude,
        rider?.longitude,
        paradasBase,
      );
      orden = resultado.orden;
      geometriaPolyline = resultado.geometriaPolyline;
      _paradasActuales = orden;
      _geometriaPolylineCache = geometriaPolyline;
    }

    // 5. Render
    await _limpiarAnotaciones();
    if (rider != null) await _dibujarMarcadorRider(rider);
    await _dibujarMarcadoresParadas(orden);
    await _dibujarPolyline(
      rider: rider,
      ordenadas: orden,
      geometriaPolyline: geometriaPolyline,
    );

    // 6. Cámara (solo al cargar / refresh, nunca durante navegación).
    await _aplicarEncuadreSiProcede(orden);
  }

  Future<void> _limpiarAnotaciones() async {
    await _gestorCirculos!.deleteAll();
    await _gestorEtiquetas!.deleteAll();
    await _gestorPolilineas!.deleteAll();
  }

  Future<void> _dibujarMarcadorRider(geo.Position rider) async {
    await _gestorCirculos!.create(
      CircleAnnotationOptions(
        geometry: Point(coordinates: Position(rider.longitude, rider.latitude)),
        circleColor: _colorRider,
        circleRadius: 10,
        circleStrokeColor: 0xFFFFFFFF,
        circleStrokeWidth: 3,
      ),
    );
  }

  Future<void> _dibujarMarcadoresParadas(List<_ParadaMapa> ordenadas) async {
    for (var i = 0; i < ordenadas.length; i++) {
      final p = ordenadas[i];
      final geometria = Point(coordinates: Position(p.lng, p.lat));
      // Solo destaca la "próxima" cuando la navegación está activa (no pausada)
      // y la ruta no se ha completado. En pausa se ve el progreso sin resaltar.
      final esActual =
          _rutaIniciada && !_rutaPausada && !_rutaCompletada && i == _indiceParadaActual;
      final visitada = _visitadas.contains(i);
      final colorTipo = p.tipo == _TipoParada.origen ? _colorOrigen : _colorDestino;
      final colorBorde = visitada ? _colorVisitada : colorTipo;
      final colorRelleno = esActual ? colorTipo : 0xFFFFFFFF;

      await _gestorCirculos!.create(
        CircleAnnotationOptions(
          geometry: geometria,
          circleColor: colorRelleno,
          circleRadius: esActual ? 16 : (visitada ? 12 : 14),
          circleStrokeColor: colorBorde,
          circleStrokeWidth: esActual ? 4 : 3,
        ),
      );
      await _gestorEtiquetas!.create(
        PointAnnotationOptions(
          geometry: geometria,
          textField: '${i + 1}',
          textColor: esActual ? 0xFFFFFFFF : colorBorde,
          textSize: 14.0,
          textHaloColor: esActual ? colorTipo : 0xFFFFFFFF,
          textHaloWidth: esActual ? 0.5 : 1.0,
        ),
      );
    }
  }

  Future<void> _dibujarPolyline({
    required geo.Position? rider,
    required List<_ParadaMapa> ordenadas,
    String? geometriaPolyline,
  }) async {
    List<Position> coords = const [];

    if (geometriaPolyline != null && geometriaPolyline.isNotEmpty) {
      try {
        final decoded = PolylinePoints().decodePolyline(geometriaPolyline);
        coords = decoded
            .map((pt) => Position(pt.longitude, pt.latitude))
            .toList(growable: false);
      } catch (_) {
        coords = const [];
      }
    }

    if (coords.length < 2) {
      if (rider == null || ordenadas.isEmpty) return;
      coords = <Position>[
        Position(rider.longitude, rider.latitude),
        ...ordenadas.map((p) => Position(p.lng, p.lat)),
      ];
    }

    await _gestorPolilineas!.create(
      PolylineAnnotationOptions(
        geometry: LineString(coordinates: coords),
        lineColor: _colorRuta,
        lineWidth: 4.0,
        lineOpacity: 0.85,
      ),
    );
  }

  // ─── Construcción y ordenamiento ────────────────────────────────

  List<_ParadaMapa> _construirParadas(
    List<Pedido> recogidas,
    List<Pedido> enCurso,
    List<Pedido> entregas,
  ) {
    final paradas = <_ParadaMapa>[];
    for (final p in recogidas) {
      if (p.tieneCoordenadasOrigen) {
        paradas.add(_ParadaMapa(
          lat: p.latitudOrigen!,
          lng: p.longitudOrigen!,
          tipo: _TipoParada.origen,
          pedidoId: p.id,
          nombreMostrar: p.nombreVendedor,
        ));
      }
    }
    for (final p in enCurso) {
      if (p.tieneCoordenadasDestino) {
        paradas.add(_ParadaMapa(
          lat: p.latitudDestino!,
          lng: p.longitudDestino!,
          tipo: _TipoParada.destino,
          pedidoId: p.id,
          nombreMostrar: p.nombreCliente,
        ));
      }
    }
    for (final p in entregas) {
      if (p.tieneCoordenadasDestino) {
        paradas.add(_ParadaMapa(
          lat: p.latitudDestino!,
          lng: p.longitudDestino!,
          tipo: _TipoParada.destino,
          pedidoId: p.id,
          nombreMostrar: p.nombreCliente,
        ));
      }
    }
    return paradas;
  }

  Future<({List<_ParadaMapa> orden, String? geometriaPolyline})> _ordenarParadas(
    double? riderLat,
    double? riderLng,
    List<_ParadaMapa> paradas,
  ) async {
    if (paradas.isEmpty) {
      return (orden: const <_ParadaMapa>[], geometriaPolyline: null);
    }
    if (paradas.length == 1) {
      return (orden: paradas, geometriaPolyline: null);
    }

    final hayRider = riderLat != null && riderLng != null;

    try {
      final mapasRepo = ref.read(mapasRepositorioProveedor);
      final entrada = <({double latitud, double longitud})>[
        if (hayRider) (latitud: riderLat, longitud: riderLng),
        ...paradas.map((p) => (latitud: p.lat, longitud: p.lng)),
      ];
      final ruta = await mapasRepo.optimizarRuta(entrada);

      final desplazamiento = hayRider ? 1 : 0;
      final ordenadas = <_ParadaMapa>[];
      for (final inputIdx in ruta.ordenWaypoints) {
        if (inputIdx < desplazamiento) continue;
        final paradaIdx = inputIdx - desplazamiento;
        if (paradaIdx >= 0 && paradaIdx < paradas.length) {
          ordenadas.add(paradas[paradaIdx]);
        }
      }
      if (ordenadas.length == paradas.length) {
        return (
          orden: ordenadas,
          geometriaPolyline: ruta.geometriaPolyline,
        );
      }
    } catch (_) {/* fallback abajo */}

    if (hayRider) {
      final lista = [...paradas];
      lista.sort((a, b) {
        final da = _distanciaMetros(riderLat, riderLng, a.lat, a.lng);
        final db = _distanciaMetros(riderLat, riderLng, b.lat, b.lng);
        return da.compareTo(db);
      });
      return (orden: lista, geometriaPolyline: null);
    }
    return (orden: paradas, geometriaPolyline: null);
  }
}

// ─── Banner superior: próxima parada ─────────────────────────────

class _BannerProximaParada extends StatelessWidget {
  final _ParadaMapa parada;
  final double distanciaMetros;

  const _BannerProximaParada({
    required this.parada,
    required this.distanciaMetros,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final esOrigen = parada.tipo == _TipoParada.origen;
    final icono = esOrigen ? Icons.storefront : Icons.person_pin_circle;
    final tipoTexto = esOrigen ? 'Recogida' : 'Entrega';
    final distancia = _formatearDistancia(distanciaMetros);
    final nombre = parada.nombreMostrar ?? 'Sin nombre';

    return Card(
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        child: Row(
          children: [
            Icon(icono, color: theme.colorScheme.primary),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    'Próxima $tipoTexto · $distancia',
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
                  ),
                  Text(
                    nombre,
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Banner GPS/permiso ──────────────────────────────────────────

class _BannerEstado extends StatelessWidget {
  final bool permisoDenegado;
  final bool gpsApagado;

  const _BannerEstado({
    required this.permisoDenegado,
    required this.gpsApagado,
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
      mensaje = 'GPS apagado. Enciéndelo para ver tu ruta.';
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

// ─── Panel inferior ──────────────────────────────────────────────

class _PanelInferior extends StatelessWidget {
  final bool rutaIniciada;
  final bool rutaPausada;
  final bool rutaCompletada;
  final int indiceActual;
  final int totalParadas;
  final _ParadaMapa? paradaActual;
  final double distanciaRestanteMetros;
  final Future<void> Function() onIniciar;
  final Future<void> Function() onPausarReanudar;
  final VoidCallback onSaltar;
  final Future<void> Function() onFinalizar;

  const _PanelInferior({
    required this.rutaIniciada,
    required this.rutaPausada,
    required this.rutaCompletada,
    required this.indiceActual,
    required this.totalParadas,
    required this.paradaActual,
    required this.distanciaRestanteMetros,
    required this.onIniciar,
    required this.onPausarReanudar,
    required this.onSaltar,
    required this.onFinalizar,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    if (rutaCompletada) {
      return Material(
        elevation: 6,
        color: theme.colorScheme.surface,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
          child: SizedBox(
            width: double.infinity,
            height: 48,
            child: BotonConCarga(
              variante: VarianteBoton.tonal,
              onPressed: onFinalizar,
              icono: const Icon(Icons.stop_circle_outlined),
              etiqueta: const Text('Ruta completada — Finalizar'),
            ),
          ),
        ),
      );
    }

    if (!rutaIniciada) {
      final habilitada = totalParadas > 0;
      return Material(
        elevation: 6,
        color: theme.colorScheme.surface,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
          child: SizedBox(
            width: double.infinity,
            height: 48,
            child: FilledButton.icon(
              onPressed: habilitada ? onIniciar : null,
              icon: const Icon(Icons.play_arrow),
              label: Text(rutaPausada ? 'Reanudar ruta' : 'Iniciar ruta'),
            ),
          ),
        ),
      );
    }

    final nombre = paradaActual?.nombreMostrar ?? 'Próxima parada';
    final distanciaTxt = _formatearDistancia(distanciaRestanteMetros);
    final etaTxt = _formatearEta(distanciaRestanteMetros);
    final progreso = 'Parada ${indiceActual + 1} de $totalParadas';

    return Material(
      elevation: 6,
      color: theme.colorScheme.surface,
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              children: [
                Icon(
                  rutaPausada ? Icons.pause_circle : Icons.navigation,
                  color: rutaPausada
                      ? theme.colorScheme.outline
                      : theme.colorScheme.primary,
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        rutaPausada
                            ? '$progreso · $distanciaTxt · en pausa'
                            : '$progreso · $distanciaTxt · ~$etaTxt',
                        style: theme.textTheme.titleSmall
                            ?.copyWith(fontWeight: FontWeight.bold),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 2),
                      Text(
                        nombre,
                        style: theme.textTheme.bodyMedium,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: onPausarReanudar,
                    icon: Icon(
                      rutaPausada ? Icons.play_arrow : Icons.pause,
                    ),
                    label: Text(rutaPausada ? 'Reanudar' : 'Pausar'),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: rutaPausada ? onSaltar : null,
                    icon: const Icon(Icons.skip_next),
                    label: const Text('Saltar'),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: FilledButton.tonalIcon(
                    onPressed: onFinalizar,
                    icon: const Icon(Icons.stop_circle_outlined),
                    label: const Text('Finalizar'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Tipos auxiliares ────────────────────────────────────────────

enum _TipoParada { origen, destino }

class _ParadaMapa {
  final double lat;
  final double lng;
  final _TipoParada tipo;
  final String pedidoId;
  final String? nombreMostrar;
  const _ParadaMapa({
    required this.lat,
    required this.lng,
    required this.tipo,
    required this.pedidoId,
    this.nombreMostrar,
  });
}

// ─── Helpers ─────────────────────────────────────────────────────

double _aRadianes(double grados) => grados * math.pi / 180;

String _formatearDistancia(double metros) {
  if (metros < 1000) return '${metros.round()} m';
  return '${(metros / 1000).toStringAsFixed(1)} km';
}

String _formatearEta(double metros) {
  final segundos = (metros / _velocidadPromedioMps).round();
  if (segundos < 60) return '${segundos}s';
  final minutos = segundos ~/ 60;
  if (minutos < 60) return '$minutos min';
  final horas = minutos ~/ 60;
  final minRestantes = minutos % 60;
  return '${horas}h ${minRestantes}min';
}

double _distanciaMetros(double lat1, double lng1, double lat2, double lng2) {
  const radioTierraMetros = 6371000.0;
  final dLat = _aRadianes(lat2 - lat1);
  final dLng = _aRadianes(lat2 - lng1);
  final a = math.sin(dLat / 2) * math.sin(dLat / 2) +
      math.cos(_aRadianes(lat1)) *
          math.cos(_aRadianes(lat2)) *
          math.sin(dLng / 2) *
          math.sin(dLng / 2);
  final c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a));
  return radioTierraMetros * c;
}