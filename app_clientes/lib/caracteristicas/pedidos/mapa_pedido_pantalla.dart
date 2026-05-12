import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mapbox_maps_flutter/mapbox_maps_flutter.dart' as mb;
import 'package:url_launcher/url_launcher.dart';

import '../../datos/modelos/pedido.dart';
import '../../nucleo/config/entorno.dart';
import '../../nucleo/tema/tokens_rapix.dart';
import 'pedidos_listado_controlador.dart';

class MapaPedidoPantalla extends ConsumerStatefulWidget {
  const MapaPedidoPantalla({
    super.key,
    required this.pedidoId,
    this.enfoque,
  });

  final String pedidoId;
  final String? enfoque;

  @override
  ConsumerState<MapaPedidoPantalla> createState() => _MapaPedidoPantallaEstado();
}

class _MapaPedidoPantallaEstado extends ConsumerState<MapaPedidoPantalla> {
  Timer? _temporizador;
  mb.MapboxMap? _mapa;
  mb.PointAnnotationManager? _puntos;

  @override
  void initState() {
    super.initState();
    _temporizador = Timer.periodic(const Duration(seconds: 10), (_) {
      ref.invalidate(pedidoDetalleProvider(widget.pedidoId));
    });
  }

  @override
  void dispose() {
    _temporizador?.cancel();
    super.dispose();
  }

  Future<void> _onMapaCreado(mb.MapboxMap mapa, Pedido pedido) async {
    _mapa = mapa;
    _puntos = await mapa.annotations.createPointAnnotationManager();
    await _refrescarMarcadores(pedido);
  }

  Future<void> _refrescarMarcadores(Pedido pedido) async {
    if (_puntos == null) return;
    await _puntos!.deleteAll();

    final origen = mb.Point(
      coordinates: mb.Position(pedido.longitudOrigen, pedido.latitudOrigen),
    );
    await _puntos!.create(
      mb.PointAnnotationOptions(
        geometry: origen,
        iconImage: 'marker-15',
        textField: 'Origen',
        textOffset: [0, 1.5],
      ),
    );

    final destino = mb.Point(
      coordinates: mb.Position(pedido.longitudDestino, pedido.latitudDestino),
    );
    await _puntos!.create(
      mb.PointAnnotationOptions(
        geometry: destino,
        iconImage: 'marker-15',
        textField: 'Destino',
        textOffset: [0, 1.5],
      ),
    );

    final repartidor =
        pedido.repartidorEntrega ?? pedido.repartidorRecogida;
    if (repartidor?.latitud != null && repartidor?.longitud != null) {
      final puntoRider = mb.Point(
        coordinates: mb.Position(repartidor!.longitud!, repartidor.latitud!),
      );
      await _puntos!.create(
        mb.PointAnnotationOptions(
          geometry: puntoRider,
          iconImage: 'marker-15',
          textField: 'Repartidor',
          textOffset: [0, 1.5],
        ),
      );
      await _mapa?.flyTo(
        mb.CameraOptions(center: puntoRider, zoom: 14),
        mb.MapAnimationOptions(duration: 800),
      );
    }
  }

  mb.CameraOptions _camaraInicial(Pedido pedido) {
    final enfocaOrigen = widget.enfoque == 'origen';
    final lon = enfocaOrigen ? pedido.longitudOrigen : pedido.longitudDestino;
    final lat = enfocaOrigen ? pedido.latitudOrigen : pedido.latitudDestino;
    return mb.CameraOptions(
      center: mb.Point(coordinates: mb.Position(lon, lat)),
      zoom: 13,
    );
  }

  @override
  Widget build(BuildContext context) {
    final pedidoAsync = ref.watch(pedidoDetalleProvider(widget.pedidoId));
    ref.listen(pedidoDetalleProvider(widget.pedidoId), (anterior, actual) {
      actual.whenData(_refrescarMarcadores);
    });

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
        title: Text(
          'Mapa del pedido',
          style: GoogleFonts.inter(
            fontSize: 16,
            fontWeight: FontWeight.w700,
            color: tokens(context).tinta,
          ),
        ),
      ),
      body: pedidoAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Error: $e')),
        data: (pedido) {
          if (Entorno.tokenMapbox.isEmpty) {
            return const Padding(
              padding: EdgeInsets.all(24),
              child: Center(
                child: Text(
                  'Mapa no disponible (configura MAPBOX_TOKEN para verlo).',
                ),
              ),
            );
          }
          return Stack(
            children: [
              mb.MapWidget(
                key: ValueKey('mapa-pantalla-${widget.pedidoId}'),
                cameraOptions: _camaraInicial(pedido),
                onMapCreated: (m) => _onMapaCreado(m, pedido),
              ),
              Positioned(
                right: 16,
                bottom: 16,
                child: FloatingActionButton.extended(
                  onPressed: () => _abrirSelectorApp(context, pedido),
                  icon: const Icon(Icons.navigation),
                  label: const Text('Abrir en…'),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}

Future<void> _abrirSelectorApp(BuildContext context, Pedido pedido) async {
  final tokens_ = tokens(context);
  await showModalBottomSheet<void>(
    context: context,
    backgroundColor: tokens_.superficie,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
    ),
    builder: (ctx) {
      return SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 12, 20, 20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Center(
                child: Container(
                  width: 36,
                  height: 4,
                  decoration: BoxDecoration(
                    color: tokens(ctx).contorno,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Text(
                'Abrir destino en',
                style: GoogleFonts.inter(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: tokens(ctx).tinta,
                ),
              ),
              const SizedBox(height: 12),
              ListTile(
                leading: const Icon(Icons.map_outlined),
                title: const Text('Google Maps'),
                onTap: () async {
                  Navigator.pop(ctx);
                  await _abrirEnExternal(
                    context,
                    'https://www.google.com/maps/dir/?api=1&destination='
                    '${pedido.latitudDestino},${pedido.longitudDestino}',
                  );
                },
              ),
              ListTile(
                leading: const Icon(Icons.directions_car_outlined),
                title: const Text('Waze'),
                onTap: () async {
                  Navigator.pop(ctx);
                  await _abrirEnExternal(
                    context,
                    'https://waze.com/ul?ll='
                    '${pedido.latitudDestino},${pedido.longitudDestino}'
                    '&navigate=yes',
                  );
                },
              ),
            ],
          ),
        ),
      );
    },
  );
}

Future<void> _abrirEnExternal(BuildContext context, String url) async {
  final uri = Uri.parse(url);
  final ok = await launchUrl(uri, mode: LaunchMode.externalApplication);
  if (!ok && context.mounted) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('No se pudo abrir la app de mapas')),
    );
  }
}
