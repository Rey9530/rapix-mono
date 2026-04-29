import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:mapbox_maps_flutter/mapbox_maps_flutter.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../core/config/entorno.dart';
import '../../data/modelos/pedido.dart';
import '../recogidas/proveedor_recogidas.dart';

/// Pantalla full-screen con un mapa centrado en el origen o el destino del
/// pedido, más botones para abrir la ruta en Google Maps o Waze.
class PantallaMapaPunto extends ConsumerStatefulWidget {
  final String pedidoId;
  final String tipo; // 'origen' | 'destino'

  const PantallaMapaPunto({
    super.key,
    required this.pedidoId,
    required this.tipo,
  });

  @override
  ConsumerState<PantallaMapaPunto> createState() => _PantallaMapaPuntoEstado();
}

class _PantallaMapaPuntoEstado extends ConsumerState<PantallaMapaPunto> {
  CircleAnnotationManager? _gestorCirculos;

  bool get _esOrigen => widget.tipo == 'origen';
  bool get _tokenConfigurado => Entorno.tokenMapbox.isNotEmpty;

  // Naranja para recogida, azul para entrega — coincide con el resto de la app.
  int get _colorMarcador => _esOrigen ? 0xFFFF9800 : 0xFF1E88E5;

  @override
  Widget build(BuildContext context) {
    final asincrono = ref.watch(pedidoPorIdProveedor(widget.pedidoId));

    return Scaffold(
      appBar: AppBar(
        title: Text(_esOrigen ? 'Recoger en' : 'Entregar en'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
      ),
      body: asincrono.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Error: $e')),
        data: (pedido) {
          final lat = _esOrigen ? pedido.latitudOrigen : pedido.latitudDestino;
          final lng = _esOrigen ? pedido.longitudOrigen : pedido.longitudDestino;
          final direccion =
              _esOrigen ? pedido.direccionOrigen : pedido.direccionDestino;

          if (lat == null || lng == null) {
            return const Center(
              child: Padding(
                padding: EdgeInsets.all(24),
                child: Text(
                  'El pedido no tiene coordenadas registradas para este punto.',
                  textAlign: TextAlign.center,
                ),
              ),
            );
          }

          if (!_tokenConfigurado) {
            return _SinToken(
              pedido: pedido,
              lat: lat,
              lng: lng,
              direccion: direccion,
              esOrigen: _esOrigen,
            );
          }

          return Stack(
            children: [
              MapWidget(
                key: ValueKey('mapa-punto-${widget.pedidoId}-${widget.tipo}'),
                cameraOptions: CameraOptions(
                  center: Point(coordinates: Position(lng, lat)),
                  zoom: 16,
                ),
                onMapCreated: (mapa) async {
                  _gestorCirculos =
                      await mapa.annotations.createCircleAnnotationManager();
                  await _gestorCirculos!.create(
                    CircleAnnotationOptions(
                      geometry: Point(coordinates: Position(lng, lat)),
                      circleColor: _colorMarcador,
                      circleRadius: 12,
                      circleStrokeColor: 0xFFFFFFFF,
                      circleStrokeWidth: 3,
                    ),
                  );
                },
              ),
              Positioned(
                left: 12,
                right: 12,
                bottom: 12,
                child: _PanelInferior(
                  direccion: direccion,
                  lat: lat,
                  lng: lng,
                  esOrigen: _esOrigen,
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}

class _PanelInferior extends StatelessWidget {
  final String? direccion;
  final double lat;
  final double lng;
  final bool esOrigen;

  const _PanelInferior({
    required this.direccion,
    required this.lat,
    required this.lng,
    required this.esOrigen,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  esOrigen ? Icons.my_location : Icons.location_on_outlined,
                  color: esOrigen ? Colors.orange : Colors.blue,
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    direccion ?? 'Sin dirección',
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: FilledButton.icon(
                    onPressed: () => _abrirGoogleMaps(context, lat, lng),
                    icon: const Icon(Icons.navigation),
                    label: const Text('Google Maps'),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () => _abrirWaze(context, lat, lng),
                    icon: const Icon(Icons.directions_car),
                    label: const Text('Waze'),
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

class _SinToken extends StatelessWidget {
  final Pedido pedido;
  final double lat;
  final double lng;
  final String? direccion;
  final bool esOrigen;

  const _SinToken({
    required this.pedido,
    required this.lat,
    required this.lng,
    required this.direccion,
    required this.esOrigen,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'MAPBOX_TOKEN no configurado.\n'
            'Inicia Flutter con --dart-define=MAPBOX_TOKEN=pk.xxx',
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 24),
          if (direccion != null) Text(direccion!),
          const SizedBox(height: 8),
          Text('Coordenadas: $lat, $lng'),
          const SizedBox(height: 24),
          FilledButton.icon(
            onPressed: () => _abrirGoogleMaps(context, lat, lng),
            icon: const Icon(Icons.navigation),
            label: const Text('Abrir en Google Maps'),
          ),
          const SizedBox(height: 8),
          OutlinedButton.icon(
            onPressed: () => _abrirWaze(context, lat, lng),
            icon: const Icon(Icons.directions_car),
            label: const Text('Abrir en Waze'),
          ),
        ],
      ),
    );
  }
}

Future<void> _abrirGoogleMaps(BuildContext context, double lat, double lng) {
  final uri = Uri.parse(
    'https://www.google.com/maps/dir/?api=1&destination=$lat,$lng&travelmode=driving',
  );
  return _abrirExterno(context, uri);
}

Future<void> _abrirWaze(BuildContext context, double lat, double lng) {
  final uri = Uri.parse('https://waze.com/ul?ll=$lat,$lng&navigate=yes');
  return _abrirExterno(context, uri);
}

Future<void> _abrirExterno(BuildContext context, Uri uri) async {
  final messenger = ScaffoldMessenger.of(context);
  try {
    final lanzado = await launchUrl(uri, mode: LaunchMode.externalApplication);
    if (!lanzado && context.mounted) {
      messenger.showSnackBar(
        SnackBar(content: Text('No se pudo abrir $uri')),
      );
    }
  } catch (_) {
    if (!context.mounted) return;
    messenger.showSnackBar(
      SnackBar(content: Text('No se pudo abrir $uri')),
    );
  }
}
