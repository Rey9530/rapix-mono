import 'dart:io';

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';

import '../../datos/repositorios/pedidos_repositorio.dart';
import '../autenticacion/autenticacion_controlador.dart';
import 'pedidos_listado_controlador.dart';

final _regexUrlMapsCorta =
    RegExp(r'^https://maps\.app\.goo\.gl/[A-Za-z0-9_-]+/?$');

class CrearPedidoPantalla extends ConsumerStatefulWidget {
  const CrearPedidoPantalla({super.key});

  @override
  ConsumerState<CrearPedidoPantalla> createState() =>
      _CrearPedidoPantallaEstado();
}

class _CrearPedidoPantallaEstado extends ConsumerState<CrearPedidoPantalla> {
  final _formulario = GlobalKey<FormState>();
  final _nombreCliente = TextEditingController();
  final _telefonoCliente = TextEditingController();
  final _direccionDestino = TextEditingController();
  final _urlMapsDestino = TextEditingController();
  final _descripcion = TextEditingController();
  final _montoContraEntrega = TextEditingController();
  final _notasDestino = TextEditingController();

  String _metodoPago = 'CONTRA_ENTREGA';
  XFile? _foto;
  bool _enviando = false;
  final _selectorImagen = ImagePicker();

  @override
  void dispose() {
    _nombreCliente.dispose();
    _telefonoCliente.dispose();
    _direccionDestino.dispose();
    _urlMapsDestino.dispose();
    _descripcion.dispose();
    _montoContraEntrega.dispose();
    _notasDestino.dispose();
    super.dispose();
  }

  Future<void> _elegirFoto() async {
    final origen = await showModalBottomSheet<ImageSource>(
      context: context,
      builder: (ctx) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.photo_camera_outlined),
              title: const Text('Tomar foto'),
              onTap: () => Navigator.pop(ctx, ImageSource.camera),
            ),
            ListTile(
              leading: const Icon(Icons.photo_library_outlined),
              title: const Text('Elegir de galería'),
              onTap: () => Navigator.pop(ctx, ImageSource.gallery),
            ),
          ],
        ),
      ),
    );
    if (origen == null) return;
    try {
      final imagen = await _selectorImagen.pickImage(
        source: origen,
        maxWidth: 1600,
        imageQuality: 80,
      );
      if (imagen != null) {
        setState(() => _foto = imagen);
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('No se pudo abrir el selector: $e')),
      );
    }
  }

  Future<void> _enviar() async {
    if (!_formulario.currentState!.validate()) return;
    final auth = ref.read(autenticacionControladorProvider);
    final perfil = auth.usuario?.perfilVendedor;
    if (perfil?.latitud == null || perfil?.longitud == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Tu cuenta no tiene ubicacion de tienda. '
              'Actualiza tu perfil.'),
        ),
      );
      return;
    }

    setState(() => _enviando = true);
    try {
      final repo = ref.read(pedidosRepositorioProvider);
      final pedido = await repo.crear(
        CrearPedidoEntrada(
          nombreCliente: _nombreCliente.text.trim(),
          telefonoCliente: _telefonoCliente.text.trim(),
          direccionOrigen: perfil!.direccion ?? 'Tienda',
          latitudOrigen: perfil.latitud!,
          longitudOrigen: perfil.longitud!,
          direccionDestino: _direccionDestino.text.trim(),
          urlMapasDestino: _urlMapsDestino.text.trim(),
          metodoPago: _metodoPago,
          descripcionPaquete: _descripcion.text.trim().isEmpty
              ? null
              : _descripcion.text.trim(),
          montoContraEntrega: _metodoPago == 'CONTRA_ENTREGA'
              ? double.tryParse(_montoContraEntrega.text)
              : null,
          notasDestino: _notasDestino.text.trim().isEmpty
              ? null
              : _notasDestino.text.trim(),
          foto: _foto,
        ),
      );
      if (!mounted) return;
      ref.invalidate(pedidosListadoProvider);
      context.go('/pedidos/${pedido.id}');
    } on DioException catch (e) {
      if (!mounted) return;
      final mensaje = _mensajeError(e);
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text(mensaje)));
    } finally {
      if (mounted) setState(() => _enviando = false);
    }
  }

  String _mensajeError(DioException e) {
    final datos = e.response?.data;
    if (datos is Map<String, dynamic>) {
      final codigo = datos['codigo'] as String?;
      final mensaje = datos['mensaje'] ?? datos['message'];
      if (codigo == 'PEDIDO_ZONA_INVALIDA' ||
          codigo == 'PEDIDO_ZONA_INVALIDA_DESTINO') {
        return 'La direccion de destino esta fuera de la zona de cobertura';
      }
      if (codigo == 'PEDIDO_URL_MAPAS_INVALIDA') {
        return 'No se pudo leer la ubicacion desde la URL de Google Maps. '
            'Verifica el enlace.';
      }
      if (mensaje is String && mensaje.isNotEmpty) return mensaje;
      if (mensaje is List && mensaje.isNotEmpty) return mensaje.first.toString();
    }
    return 'No se pudo crear el pedido. Intenta de nuevo.';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Nuevo pedido')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Form(
            key: _formulario,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text(
                  'Datos del cliente',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                const SizedBox(height: 8),
                TextFormField(
                  controller: _nombreCliente,
                  decoration: const InputDecoration(
                    labelText: 'Nombre completo',
                    prefixIcon: Icon(Icons.person_outline),
                  ),
                  textCapitalization: TextCapitalization.words,
                  validator: (v) =>
                      (v == null || v.trim().isEmpty) ? 'Requerido' : null,
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _telefonoCliente,
                  decoration: const InputDecoration(
                    labelText: 'Telefono',
                    prefixIcon: Icon(Icons.phone_outlined),
                    hintText: '+50370001234',
                  ),
                  keyboardType: TextInputType.phone,
                  validator: (v) {
                    final t = v?.trim() ?? '';
                    if (!RegExp(r'^\+?[0-9]{8,15}$').hasMatch(t)) {
                      return '8-15 digitos, opcional con +';
                    }
                    return null;
                  },
                ),
                const Divider(height: 32),
                Text(
                  'Destino',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                const SizedBox(height: 8),
                TextFormField(
                  controller: _direccionDestino,
                  decoration: const InputDecoration(
                    labelText: 'Direccion',
                    prefixIcon: Icon(Icons.place_outlined),
                  ),
                  validator: (v) =>
                      (v == null || v.trim().isEmpty) ? 'Requerido' : null,
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _urlMapsDestino,
                  decoration: const InputDecoration(
                    labelText: 'URL de Google Maps del destino',
                    prefixIcon: Icon(Icons.map_outlined),
                    hintText: 'https://maps.app.goo.gl/...',
                    helperText: 'En Google Maps: Compartir → Copiar enlace',
                  ),
                  keyboardType: TextInputType.url,
                  validator: (v) {
                    final t = v?.trim() ?? '';
                    if (t.isEmpty) {
                      return 'Pega la URL de Google Maps del destino';
                    }
                    if (!_regexUrlMapsCorta.hasMatch(t)) {
                      return 'URL invalida. Comparte el sitio desde Google Maps '
                          'y pega el enlace corto';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _notasDestino,
                  decoration: const InputDecoration(
                    labelText: 'Notas para el repartidor (opcional)',
                    prefixIcon: Icon(Icons.note_alt_outlined),
                  ),
                  maxLines: 2,
                ),
                const Divider(height: 32),
                Text(
                  'Paquete',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                const SizedBox(height: 8),
                TextFormField(
                  controller: _descripcion,
                  decoration: const InputDecoration(
                    labelText: 'Descripcion (opcional)',
                    prefixIcon: Icon(Icons.inventory_2_outlined),
                  ),
                ),
                const SizedBox(height: 12),
                _SelectorFoto(
                  foto: _foto,
                  alElegir: _elegirFoto,
                  alQuitar: () => setState(() => _foto = null),
                ),
                const SizedBox(height: 16),
                SegmentedButton<String>(
                  segments: const [
                    ButtonSegment(
                      value: 'CONTRA_ENTREGA',
                      label: Text('Contra entrega'),
                      icon: Icon(Icons.payments_outlined),
                    ),
                    ButtonSegment(
                      value: 'PREPAGADO',
                      label: Text('Prepagado'),
                      icon: Icon(Icons.credit_card),
                    ),
                  ],
                  selected: {_metodoPago},
                  onSelectionChanged: (s) =>
                      setState(() => _metodoPago = s.first),
                ),
                if (_metodoPago == 'CONTRA_ENTREGA') ...[
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _montoContraEntrega,
                    decoration: const InputDecoration(
                      labelText: 'Monto a cobrar',
                      prefixIcon: Icon(Icons.attach_money),
                    ),
                    keyboardType: const TextInputType.numberWithOptions(
                      decimal: true,
                    ),
                    validator: (v) {
                      if (_metodoPago != 'CONTRA_ENTREGA') return null;
                      final monto = double.tryParse(v ?? '');
                      if (monto == null || monto <= 0) return 'Monto invalido';
                      return null;
                    },
                  ),
                ],
                const SizedBox(height: 24),
                FilledButton(
                  onPressed: _enviando ? null : _enviar,
                  child: _enviando
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Text('Crear pedido'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _SelectorFoto extends StatelessWidget {
  const _SelectorFoto({
    required this.foto,
    required this.alElegir,
    required this.alQuitar,
  });

  final XFile? foto;
  final VoidCallback alElegir;
  final VoidCallback alQuitar;

  @override
  Widget build(BuildContext context) {
    if (foto == null) {
      return Card(
        child: ListTile(
          leading: const Icon(Icons.camera_alt_outlined),
          title: const Text('Foto del paquete (opcional)'),
          subtitle: const Text('Tomar foto o elegir de galería'),
          trailing: const Icon(Icons.chevron_right),
          onTap: alElegir,
        ),
      );
    }
    return Card(
      clipBehavior: Clip.antiAlias,
      child: Column(
        children: [
          AspectRatio(
            aspectRatio: 4 / 3,
            child: Image.file(File(foto!.path), fit: BoxFit.cover),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            child: OverflowBar(
              alignment: MainAxisAlignment.end,
              spacing: 4,
              children: [
                TextButton.icon(
                  onPressed: alQuitar,
                  icon: const Icon(Icons.delete_outline),
                  label: const Text('Quitar'),
                ),
                TextButton.icon(
                  onPressed: alElegir,
                  icon: const Icon(Icons.refresh),
                  label: const Text('Cambiar'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
