import 'package:flutter/material.dart';
import 'package:flutter_polyline_points/flutter_polyline_points.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:geolocator/geolocator.dart' as geo;
import 'package:mapbox_maps_flutter/mapbox_maps_flutter.dart';

import '../../core/config/entorno.dart';
import '../../core/proveedores_globales.dart';
import '../entregas/proveedor_entregas.dart';
import '../recogidas/proveedor_recogidas.dart';

class PantallaMapaRuta extends ConsumerStatefulWidget {
  const PantallaMapaRuta({super.key});

  @override
  ConsumerState<PantallaMapaRuta> createState() => _PantallaMapaRutaEstado();
}

class _PantallaMapaRutaEstado extends ConsumerState<PantallaMapaRuta> {
  MapboxMap? _mapa;
  PolylineAnnotationManager? _gestorPolylines;
  PointAnnotationManager? _gestorPuntos;

  bool get _tokenConfigurado => Entorno.tokenMapbox.isNotEmpty;

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

    final recogidas = ref.watch(recogidasPendientesProveedor);
    final entregas = ref.watch(entregasPendientesProveedor);

    return Stack(
      children: [
        MapWidget(
          key: const ValueKey('mapa-ruta'),
          cameraOptions: CameraOptions(
            center: Point(coordinates: Position(-89.2182, 13.6929)),
            zoom: 12,
          ),
          onMapCreated: (mapa) async {
            _mapa = mapa;
            _gestorPuntos = await mapa.annotations.createPointAnnotationManager();
            _gestorPolylines =
                await mapa.annotations.createPolylineAnnotationManager();
            await _dibujarRutaSiHayDatos();
          },
        ),
        Positioned(
          top: 16,
          right: 16,
          child: FloatingActionButton(
            heroTag: 'recargar',
            onPressed: () async {
              ref.invalidate(recogidasPendientesProveedor);
              ref.invalidate(entregasPendientesProveedor);
              await _dibujarRutaSiHayDatos();
            },
            child: const Icon(Icons.refresh),
          ),
        ),
        if (recogidas.isLoading || entregas.isLoading)
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
      ],
    );
  }

  Future<void> _dibujarRutaSiHayDatos() async {
    if (_mapa == null || _gestorPolylines == null || _gestorPuntos == null) return;

    final recogidas = await ref.read(recogidasPendientesProveedor.future);
    final entregas = await ref.read(entregasPendientesProveedor.future);

    final puntos = <_PuntoMapa>[];
    Position? posActual;
    try {
      final p = await geo.Geolocator.getCurrentPosition(
        locationSettings: const geo.LocationSettings(
          accuracy: geo.LocationAccuracy.high,
        ),
      );
      posActual = Position(p.longitude, p.latitude);
      puntos.add(_PuntoMapa(p.latitude, p.longitude, 'Tú', 'Posición actual'));
    } catch (_) {/* sin geo */}

    for (final p in recogidas) {
      if (p.latitudRecogida != null && p.longitudRecogida != null) {
        puntos.add(_PuntoMapa(
          p.latitudRecogida!,
          p.longitudRecogida!,
          'R',
          p.codigoSeguimiento,
        ));
      }
    }
    for (final p in entregas) {
      if (p.latitudEntrega != null && p.longitudEntrega != null) {
        puntos.add(_PuntoMapa(
          p.latitudEntrega!,
          p.longitudEntrega!,
          'E',
          p.codigoSeguimiento,
        ));
      }
    }

    await _gestorPuntos!.deleteAll();
    await _gestorPolylines!.deleteAll();

    if (puntos.length < 2) return;

    for (final p in puntos) {
      await _gestorPuntos!.create(
        PointAnnotationOptions(
          geometry: Point(coordinates: Position(p.lng, p.lat)),
          textField: '${p.codigo} ${p.titulo}',
          textOffset: [0, -2],
        ),
      );
    }

    try {
      final mapasRepo = ref.read(mapasRepositorioProveedor);
      final ruta = await mapasRepo.optimizarRuta(
        puntos
            .map((p) => (latitud: p.lat, longitud: p.lng))
            .toList(),
      );

      final decodificados = PolylinePoints()
          .decodePolyline(ruta.geometriaPolyline)
          .map((p) => Position(p.longitude, p.latitude))
          .toList();

      if (decodificados.isNotEmpty) {
        await _gestorPolylines!.create(
          PolylineAnnotationOptions(
            geometry: LineString(coordinates: decodificados),
            lineColor: 0xFF1E88E5,
            lineWidth: 4,
          ),
        );
      }
    } catch (_) {
      // no rompemos el mapa si falla la optimización; los puntos siguen visibles
    }

    if (posActual != null) {
      await _mapa!.flyTo(
        CameraOptions(center: Point(coordinates: posActual), zoom: 13),
        MapAnimationOptions(duration: 800),
      );
    }
  }
}

class _PuntoMapa {
  final double lat;
  final double lng;
  final String codigo;
  final String titulo;
  _PuntoMapa(this.lat, this.lng, this.codigo, this.titulo);
}
