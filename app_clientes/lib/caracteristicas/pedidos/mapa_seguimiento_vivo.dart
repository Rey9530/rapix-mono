import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mapbox_maps_flutter/mapbox_maps_flutter.dart' as mb;

import '../../datos/modelos/pedido.dart';
import '../../nucleo/config/entorno.dart';
import 'pedidos_listado_controlador.dart';

/// Mapa con polling cada 10s para refrescar la posicion del repartidor.
class MapaSeguimientoVivo extends ConsumerStatefulWidget {
  const MapaSeguimientoVivo({
    super.key,
    required this.pedidoId,
    required this.pedido,
  });

  final String pedidoId;
  final Pedido pedido;

  @override
  ConsumerState<MapaSeguimientoVivo> createState() =>
      _MapaSeguimientoVivoEstado();
}

class _MapaSeguimientoVivoEstado extends ConsumerState<MapaSeguimientoVivo> {
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

  @override
  void didUpdateWidget(covariant MapaSeguimientoVivo old) {
    super.didUpdateWidget(old);
    _refrescarMarcadores();
  }

  Future<void> _onMapaCreado(mb.MapboxMap mapa) async {
    _mapa = mapa;
    _puntos = await mapa.annotations.createPointAnnotationManager();
    await _refrescarMarcadores();
  }

  Future<void> _refrescarMarcadores() async {
    if (_puntos == null) return;
    await _puntos!.deleteAll();

    final destino = mb.Point(
      coordinates: mb.Position(
        widget.pedido.longitudDestino,
        widget.pedido.latitudDestino,
      ),
    );
    await _puntos!.create(
      mb.PointAnnotationOptions(
        geometry: destino,
        iconImage: 'marker-15',
        textField: 'Destino',
        textOffset: [0, 1.5],
      ),
    );

    final repartidor = widget.pedido.repartidorEntrega ??
        widget.pedido.repartidorRecogida;
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
    } else {
      await _mapa?.flyTo(
        mb.CameraOptions(center: destino, zoom: 14),
        mb.MapAnimationOptions(duration: 800),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    if (Entorno.tokenMapbox.isEmpty) {
      return const Card(
        child: Padding(
          padding: EdgeInsets.all(16),
          child: Text(
            'Mapa no disponible (configura MAPBOX_TOKEN para verlo).',
          ),
        ),
      );
    }
    return ClipRRect(
      borderRadius: BorderRadius.circular(16),
      child: SizedBox(
        height: 220,
        child: mb.MapWidget(
          key: ValueKey('mapa-pedido-${widget.pedidoId}'),
          cameraOptions: mb.CameraOptions(
            center: mb.Point(
              coordinates: mb.Position(
                widget.pedido.longitudDestino,
                widget.pedido.latitudDestino,
              ),
            ),
            zoom: 13,
          ),
          onMapCreated: _onMapaCreado,
        ),
      ),
    );
  }
}

