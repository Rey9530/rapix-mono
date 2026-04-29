import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:geolocator/geolocator.dart';
import 'package:go_router/go_router.dart';

import '../../core/network/excepciones_api.dart';
import '../../core/proveedores_globales.dart';
import '../../data/modelos/pedido.dart';
import '../../widgets/secciones_detalle_pedido.dart';
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
        if (pedido.urlFotoPaquete != null) ...[
          FotoPaquete(url: pedido.urlFotoPaquete!),
          const SizedBox(height: 12),
        ],
        CabeceraPedido(pedido: pedido, icono: Icons.local_shipping),
        const SizedBox(height: 12),
        if (pedido.nombreCliente != null) TarjetaCliente(pedido: pedido),
        TarjetaUbicacion(
          titulo: 'Entrega',
          icono: Icons.location_on_outlined,
          color: Colors.blue,
          direccion: pedido.direccionDestino,
          notas: pedido.notasDestino,
          latitud: pedido.latitudDestino,
          longitud: pedido.longitudDestino,
          etiquetaBoton: 'Entregar en',
          botonPrincipal: true,
          onAbrirMapa: () => context.push(
            '/inicio/entregas/${pedido.id}/mapa?tipo=destino',
          ),
        ),
        TarjetaUbicacion(
          titulo: 'Origen',
          icono: Icons.my_location,
          color: Colors.orange,
          direccion: pedido.direccionOrigen,
          notas: pedido.notasOrigen,
          latitud: pedido.latitudOrigen,
          longitud: pedido.longitudOrigen,
          etiquetaBoton: 'Ver origen en mapa',
          botonPrincipal: false,
          onAbrirMapa: () => context.push(
            '/inicio/entregas/${pedido.id}/mapa?tipo=origen',
          ),
        ),
        if (TarjetaPaquete.aplicaPara(pedido)) TarjetaPaquete(pedido: pedido),
        TarjetaCobro(pedido: pedido),
        if (TarjetaLineaTiempo.aplicaPara(pedido))
          TarjetaLineaTiempo(pedido: pedido),
        const SizedBox(height: 16),
        ..._botonesAccion(context, ref),
      ],
    );
  }

  List<Widget> _botonesAccion(BuildContext context, WidgetRef ref) {
    if (pedido.estado == EstadoPedido.EN_REPARTO) {
      return [
        FilledButton.icon(
          onPressed: () =>
              context.go('/inicio/entregas/${pedido.id}/comprobante'),
          style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(48)),
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
      ];
    }
    return [
      Padding(
        padding: const EdgeInsets.all(16),
        child: Text(
          'Sin acciones disponibles en estado ${pedido.estado.name}',
          textAlign: TextAlign.center,
        ),
      ),
    ];
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
