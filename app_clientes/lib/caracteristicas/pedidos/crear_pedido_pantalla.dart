import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:mapbox_maps_flutter/mapbox_maps_flutter.dart' as mb;

import '../../datos/repositorios/pedidos_repositorio.dart';
import '../autenticacion/autenticacion_controlador.dart';
import 'pedidos_listado_controlador.dart';

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
  final _descripcion = TextEditingController();
  final _montoContraEntrega = TextEditingController();
  final _notasDestino = TextEditingController();

  String _metodoPago = 'CONTRA_ENTREGA';
  mb.Point? _ubicacionDestino;
  bool _enviando = false;

  @override
  void dispose() {
    _nombreCliente.dispose();
    _telefonoCliente.dispose();
    _direccionDestino.dispose();
    _descripcion.dispose();
    _montoContraEntrega.dispose();
    _notasDestino.dispose();
    super.dispose();
  }

  Future<void> _elegirDestino() async {
    final auth = ref.read(autenticacionControladorProvider);
    final perfil = auth.usuario?.perfilVendedor;
    final inicial = perfil?.latitud != null && perfil?.longitud != null
        ? mb.Point(
            coordinates: mb.Position(perfil!.longitud!, perfil.latitud!),
          )
        : _ubicacionDestino;
    final resultado = await context.push<mb.Point>(
      '/seleccionar-ubicacion',
      extra: {
        'titulo': 'Destino del paquete',
        'inicial': inicial,
      },
    );
    if (resultado != null) {
      setState(() => _ubicacionDestino = resultado);
    }
  }

  Future<void> _enviar() async {
    if (!_formulario.currentState!.validate()) return;
    if (_ubicacionDestino == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Selecciona la ubicacion del destino en el mapa'),
        ),
      );
      return;
    }
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
          latitudDestino:
              _ubicacionDestino!.coordinates.lat.toDouble(),
          longitudDestino:
              _ubicacionDestino!.coordinates.lng.toDouble(),
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
      if (codigo == 'PEDIDO_ZONA_INVALIDA') {
        return 'La direccion de destino esta fuera de la zona de cobertura';
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
                Card(
                  child: ListTile(
                    leading: const Icon(Icons.map_outlined),
                    title: Text(
                      _ubicacionDestino == null
                          ? 'Marcar destino en el mapa'
                          : 'Destino seleccionado',
                    ),
                    subtitle: _ubicacionDestino != null
                        ? Text(
                            '(${_ubicacionDestino!.coordinates.lat.toStringAsFixed(5)}, '
                            '${_ubicacionDestino!.coordinates.lng.toStringAsFixed(5)})',
                          )
                        : null,
                    trailing: const Icon(Icons.chevron_right),
                    onTap: _elegirDestino,
                  ),
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
