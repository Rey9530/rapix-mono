import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:geolocator/geolocator.dart';
import 'package:go_router/go_router.dart';

import '../../core/network/excepciones_api.dart';
import '../../core/proveedores_globales.dart';
import '../../data/modelos/pedido.dart';
import '../recogidas/proveedor_recogidas.dart';
import 'proveedor_entregas.dart';

class PantallaDetalleEntrega extends ConsumerWidget {
  final String pedidoId;

  const PantallaDetalleEntrega({super.key, required this.pedidoId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final asincrono = ref.watch(pedidoPorIdProveedor(pedidoId));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Detalle entrega'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.go('/inicio/entregas'),
        ),
      ),
      body: asincrono.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Error: $e')),
        data: (pedido) => _Cuerpo(pedido: pedido),
      ),
    );
  }
}

class _Cuerpo extends ConsumerWidget {
  final Pedido pedido;
  const _Cuerpo({required this.pedido});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        _Seccion(titulo: 'Código', contenido: pedido.codigoSeguimiento),
        _Seccion(titulo: 'Estado', contenido: pedido.estado.name),
        if (pedido.nombreDestinatario != null)
          _Seccion(titulo: 'Destinatario', contenido: pedido.nombreDestinatario!),
        if (pedido.telefonoDestinatario != null)
          _Seccion(titulo: 'Teléfono', contenido: pedido.telefonoDestinatario!),
        if (pedido.direccionEntrega != null)
          _Seccion(titulo: 'Dirección de entrega', contenido: pedido.direccionEntrega!),
        if (pedido.montoContraEntrega != null)
          _Seccion(
            titulo: 'Monto a cobrar',
            contenido: '\$${pedido.montoContraEntrega}',
          ),
        if (pedido.notas != null && pedido.notas!.isNotEmpty)
          _Seccion(titulo: 'Notas', contenido: pedido.notas!),
        const SizedBox(height: 24),
        if (pedido.estado == EstadoPedido.EN_REPARTO) ...[
          FilledButton.icon(
            onPressed: () =>
                context.go('/inicio/entregas/${pedido.id}/comprobante'),
            icon: const Icon(Icons.check_circle),
            label: const Text('Confirmar entrega'),
          ),
          const SizedBox(height: 12),
          OutlinedButton.icon(
            onPressed: () => _fallar(context, ref),
            style: OutlinedButton.styleFrom(
              foregroundColor: Colors.red,
              minimumSize: const Size.fromHeight(48),
            ),
            icon: const Icon(Icons.cancel_outlined),
            label: const Text('Marcar como fallida'),
          ),
        ] else
          Padding(
            padding: const EdgeInsets.all(16),
            child: Text(
              'Sin acciones disponibles en estado ${pedido.estado.name}',
              textAlign: TextAlign.center,
            ),
          ),
      ],
    );
  }

  Future<void> _fallar(BuildContext context, WidgetRef ref) async {
    final ctrl = TextEditingController();
    final motivo = await showDialog<String?>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Marcar como fallida'),
        content: TextField(
          controller: ctrl,
          decoration: const InputDecoration(
            labelText: 'Motivo',
            hintText: 'Destinatario no disponible…',
          ),
          maxLength: 240,
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, null), child: const Text('Cancelar')),
          FilledButton(
            onPressed: () => Navigator.pop(ctx, ctrl.text.trim()),
            child: const Text('Confirmar'),
          ),
        ],
      ),
    );

    if (motivo == null || motivo.isEmpty) return;
    if (!context.mounted) return;
    final messenger = ScaffoldMessenger.of(context);
    Position? pos;
    try {
      pos = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(accuracy: LocationAccuracy.high),
      );
    } catch (_) {/* sin geo */}

    try {
      await ref.read(pedidosRepositorioProveedor).fallar(
            pedido.id,
            motivo: motivo,
            lat: pos?.latitude,
            lng: pos?.longitude,
          );
      ref.invalidate(entregasPendientesProveedor);
      ref.invalidate(pedidoPorIdProveedor(pedido.id));
      if (!context.mounted) return;
      messenger.showSnackBar(
        const SnackBar(content: Text('Pedido marcado como fallido')),
      );
      context.go('/inicio/entregas');
    } on ExcepcionApi catch (e) {
      messenger.showSnackBar(SnackBar(content: Text(e.mensaje), backgroundColor: Colors.red));
    }
  }
}

class _Seccion extends StatelessWidget {
  final String titulo;
  final String contenido;
  const _Seccion({required this.titulo, required this.contenido});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(titulo,
              style: Theme.of(context)
                  .textTheme
                  .labelMedium
                  ?.copyWith(color: Colors.grey)),
          const SizedBox(height: 4),
          Text(contenido, style: Theme.of(context).textTheme.bodyLarge),
        ],
      ),
    );
  }
}
