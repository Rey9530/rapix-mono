import 'dart:math' as math;

import 'package:flutter/material.dart';
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
  CircleAnnotationManager? _gestorCirculos;
  PointAnnotationManager? _gestorEtiquetas;

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
            _gestorCirculos =
                await mapa.annotations.createCircleAnnotationManager();
            _gestorEtiquetas =
                await mapa.annotations.createPointAnnotationManager();
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
    if (_mapa == null || _gestorCirculos == null || _gestorEtiquetas == null) {
      return;
    }

    final recogidas = await ref.read(recogidasPendientesProveedor.future);
    final entregas = await ref.read(entregasPendientesProveedor.future);

    double? riderLat;
    double? riderLng;
    try {
      final p = await geo.Geolocator.getCurrentPosition(
        locationSettings: const geo.LocationSettings(
          accuracy: geo.LocationAccuracy.high,
        ),
      );
      riderLat = p.latitude;
      riderLng = p.longitude;
    } catch (_) {/* sin geo */}

    final paradas = <_ParadaMapa>[];
    for (final p in recogidas) {
      if (p.latitudOrigen != null && p.longitudOrigen != null) {
        paradas.add(_ParadaMapa(p.latitudOrigen!, p.longitudOrigen!));
      }
    }
    for (final p in entregas) {
      if (p.latitudDestino != null && p.longitudDestino != null) {
        paradas.add(_ParadaMapa(p.latitudDestino!, p.longitudDestino!));
      }
    }

    await _gestorCirculos!.deleteAll();
    await _gestorEtiquetas!.deleteAll();

    if (riderLat != null && riderLng != null) {
      await _gestorCirculos!.create(
        CircleAnnotationOptions(
          geometry: Point(coordinates: Position(riderLng, riderLat)),
          circleColor: 0xFF1E88E5,
          circleRadius: 10,
          circleStrokeColor: 0xFFFFFFFF,
          circleStrokeWidth: 3,
        ),
      );
    }

    if (paradas.isNotEmpty) {
      final ordenadas = await _ordenarParadas(riderLat, riderLng, paradas);

      for (var i = 0; i < ordenadas.length; i++) {
        final parada = ordenadas[i];
        final numero = i + 1;
        final geometria = Point(coordinates: Position(parada.lng, parada.lat));

        await _gestorCirculos!.create(
          CircleAnnotationOptions(
            geometry: geometria,
            circleColor: 0xFFFFFFFF,
            circleRadius: 14,
            circleStrokeColor: 0xFF1E88E5,
            circleStrokeWidth: 3,
          ),
        );
        await _gestorEtiquetas!.create(
          PointAnnotationOptions(
            geometry: geometria,
            textField: '$numero',
            textColor: 0xFF1E88E5,
            textSize: 14.0,
            textHaloColor: 0xFFFFFFFF,
            textHaloWidth: 1.0,
          ),
        );
      }
    }

    if (riderLat != null && riderLng != null) {
      await _mapa!.flyTo(
        CameraOptions(
          center: Point(coordinates: Position(riderLng, riderLat)),
          zoom: 13,
        ),
        MapAnimationOptions(duration: 800),
      );
    }
  }

  /// Devuelve las paradas en orden de visita (índice 0 = primera en visitarse).
  /// Pide a Mapbox la ruta óptima vía `optimizarRuta`; si falla, cae a
  /// distancia haversine desde el rider, y si tampoco hay rider conserva el
  /// orden original.
  Future<List<_ParadaMapa>> _ordenarParadas(
    double? riderLat,
    double? riderLng,
    List<_ParadaMapa> paradas,
  ) async {
    if (paradas.length <= 1) return paradas;

    final hayRider = riderLat != null && riderLng != null;

    try {
      final mapasRepo = ref.read(mapasRepositorioProveedor);
      final entrada = <({double latitud, double longitud})>[
        if (hayRider) (latitud: riderLat, longitud: riderLng),
        ...paradas.map((p) => (latitud: p.lat, longitud: p.lng)),
      ];
      final ruta = await mapasRepo.optimizarRuta(entrada);

      // `ordenWaypoints` es una permutación de los índices de entrada.
      // Cuando hay rider, su índice 0 va siempre primero (backend usa
      // `source: 'first'`), así que las paradas en orden son los índices >= 1.
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
        return ordenadas;
      }
    } catch (_) {/* fallback abajo */}

    if (hayRider) {
      final lista = [...paradas];
      lista.sort((a, b) {
        final da = _distanciaMetros(riderLat, riderLng, a.lat, a.lng);
        final db = _distanciaMetros(riderLat, riderLng, b.lat, b.lng);
        return da.compareTo(db);
      });
      return lista;
    }
    return paradas;
  }
}

class _ParadaMapa {
  final double lat;
  final double lng;
  _ParadaMapa(this.lat, this.lng);
}

double _distanciaMetros(double lat1, double lng1, double lat2, double lng2) {
  const radioTierraMetros = 6371000.0;
  final dLat = _gradosARadianes(lat2 - lat1);
  final dLng = _gradosARadianes(lng2 - lng1);
  final a = math.sin(dLat / 2) * math.sin(dLat / 2) +
      math.cos(_gradosARadianes(lat1)) *
          math.cos(_gradosARadianes(lat2)) *
          math.sin(dLng / 2) *
          math.sin(dLng / 2);
  final c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a));
  return radioTierraMetros * c;
}

double _gradosARadianes(double grados) => grados * math.pi / 180;
