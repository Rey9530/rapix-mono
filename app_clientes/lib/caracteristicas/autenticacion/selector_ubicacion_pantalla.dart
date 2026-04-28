import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:mapbox_maps_flutter/mapbox_maps_flutter.dart' as mb;

import '../../nucleo/config/entorno.dart';

/// Selector de ubicacion con mapa y pin central fijo.
/// Devuelve via `Navigator.pop` un `mb.Point` con las coordenadas elegidas.
class SelectorUbicacionPantalla extends StatefulWidget {
  const SelectorUbicacionPantalla({
    super.key,
    this.titulo = 'Seleccionar ubicacion',
    this.inicial,
  });

  final String titulo;
  final mb.Point? inicial;

  @override
  State<SelectorUbicacionPantalla> createState() =>
      _SelectorUbicacionPantallaEstado();
}

class _SelectorUbicacionPantallaEstado extends State<SelectorUbicacionPantalla> {
  mb.MapboxMap? _mapa;
  mb.Point? _centroActual;

  @override
  void initState() {
    super.initState();
    _centroActual = widget.inicial ??
        mb.Point(
          coordinates: mb.Position(
            Entorno.longitudInicial,
            Entorno.latitudInicial,
          ),
        );
  }

  void _onMapaCreado(mb.MapboxMap mapa) {
    _mapa = mapa;
  }

  void _onCambioCamara(mb.CameraChangedEventData _) async {
    final estado = await _mapa?.getCameraState();
    if (estado != null && mounted) {
      setState(() => _centroActual = estado.center);
    }
  }

  void _confirmar() {
    if (_centroActual != null) {
      context.pop(_centroActual);
    }
  }

  @override
  Widget build(BuildContext context) {
    final tieneToken = Entorno.tokenMapbox.isNotEmpty;
    return Scaffold(
      appBar: AppBar(title: Text(widget.titulo)),
      body: tieneToken ? _construirMapa() : _construirManual(),
    );
  }

  Widget _construirMapa() {
    final inicial = widget.inicial ??
        mb.Point(
          coordinates: mb.Position(
            Entorno.longitudInicial,
            Entorno.latitudInicial,
          ),
        );
    return Stack(
      alignment: Alignment.center,
      children: [
        mb.MapWidget(
          key: const ValueKey('mapa-selector'),
          cameraOptions: mb.CameraOptions(
            center: inicial,
            zoom: 15,
          ),
          onMapCreated: _onMapaCreado,
          onCameraChangeListener: _onCambioCamara,
        ),
        IgnorePointer(
          child: Padding(
            padding: const EdgeInsets.only(bottom: 32),
            child: Icon(
              Icons.location_pin,
              size: 56,
              color: Theme.of(context).colorScheme.error,
            ),
          ),
        ),
        Positioned(
          left: 16,
          right: 16,
          bottom: 24,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (_centroActual != null)
                Card(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 8,
                    ),
                    child: Text(
                      '(${_centroActual!.coordinates.lat.toStringAsFixed(5)}, '
                      '${_centroActual!.coordinates.lng.toStringAsFixed(5)})',
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
              const SizedBox(height: 8),
              FilledButton.icon(
                onPressed: _confirmar,
                icon: const Icon(Icons.check),
                label: const Text('Confirmar ubicacion'),
              ),
            ],
          ),
        ),
      ],
    );
  }

  /// Fallback cuando no hay token Mapbox: ingresar coordenadas manualmente.
  Widget _construirManual() {
    final latCtrl = TextEditingController(
      text: _centroActual?.coordinates.lat.toString() ?? '',
    );
    final lngCtrl = TextEditingController(
      text: _centroActual?.coordinates.lng.toString() ?? '',
    );
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Card(
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Text(
                'Mapbox no esta configurado. Ingresa las coordenadas manualmente '
                'o establece MAPBOX_TOKEN al compilar.',
              ),
            ),
          ),
          const SizedBox(height: 16),
          TextField(
            controller: latCtrl,
            decoration: const InputDecoration(labelText: 'Latitud'),
            keyboardType: const TextInputType.numberWithOptions(
              signed: true,
              decimal: true,
            ),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: lngCtrl,
            decoration: const InputDecoration(labelText: 'Longitud'),
            keyboardType: const TextInputType.numberWithOptions(
              signed: true,
              decimal: true,
            ),
          ),
          const Spacer(),
          FilledButton(
            onPressed: () {
              final lat = double.tryParse(latCtrl.text);
              final lng = double.tryParse(lngCtrl.text);
              if (lat != null && lng != null) {
                context.pop(mb.Point(coordinates: mb.Position(lng, lat)));
              }
            },
            child: const Text('Confirmar ubicacion'),
          ),
        ],
      ),
    );
  }
}
