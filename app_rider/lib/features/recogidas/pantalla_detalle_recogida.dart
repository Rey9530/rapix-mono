import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:geolocator/geolocator.dart';
import 'package:go_router/go_router.dart';

import '../../core/network/excepciones_api.dart';
import '../../core/proveedores_globales.dart';
import '../../data/modelos/pedido.dart';
import '../../widgets/secciones_detalle_pedido.dart';
import '../en_curso/proveedor_en_curso.dart';
import '../entregas/proveedor_entregas.dart';
import 'proveedor_recogidas.dart';

class PantallaDetalleRecogida extends ConsumerWidget {
  final String pedidoId;

  const PantallaDetalleRecogida({super.key, required this.pedidoId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final asincrono = ref.watch(pedidoPorIdProveedor(pedidoId));
    final ubicacion = GoRouterState.of(context).matchedLocation;
    final esEnCurso = ubicacion.startsWith('/inicio/en-curso');
    final rutaLista = esEnCurso ? '/inicio/en-curso' : '/inicio/recogidas';
    final titulo = esEnCurso ? 'Pedido en curso' : 'Detalle recogida';

    return Scaffold(
      appBar: AppBar(
        title: Text(titulo),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.go(rutaLista),
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
        CabeceraPedido(pedido: pedido, icono: Icons.archive),
        const SizedBox(height: 12),
        if (pedido.nombreCliente != null) TarjetaCliente(pedido: pedido),
        TarjetaUbicacion(
          titulo: 'Recogida',
          icono: Icons.my_location,
          color: Colors.orange,
          direccion: pedido.direccionOrigen,
          notas: pedido.notasOrigen,
          latitud: pedido.latitudOrigen,
          longitud: pedido.longitudOrigen,
          etiquetaBoton: 'Recoger en',
          botonPrincipal: true,
          onAbrirMapa: () => context.push(
            '/inicio/recogidas/${pedido.id}/mapa?tipo=origen',
          ),
        ),
        TarjetaUbicacion(
          titulo: 'Entrega',
          icono: Icons.location_on_outlined,
          color: Colors.blue,
          direccion: pedido.direccionDestino,
          notas: pedido.notasDestino,
          latitud: pedido.latitudDestino,
          longitud: pedido.longitudDestino,
          etiquetaBoton: 'Ver destino en mapa',
          botonPrincipal: false,
          onAbrirMapa: () => context.push(
            '/inicio/recogidas/${pedido.id}/mapa?tipo=destino',
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
    switch (pedido.estado) {
      case EstadoPedido.ASIGNADO:
        return [
          FilledButton.icon(
            onPressed: () => _confirmar(
              context,
              ref,
              titulo: '¿Recoger paquete?',
              accion: 'recoger',
            ),
            style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(48)),
            icon: const Icon(Icons.archive),
            label: const Text('Recoger paquete'),
          ),
        ];
      case EstadoPedido.RECOGIDO:
        return [
          FilledButton.icon(
            onPressed: () => _confirmar(
              context,
              ref,
              titulo: '¿Marcar en tránsito?',
              accion: 'enTransito',
            ),
            style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(48)),
            icon: const Icon(Icons.local_shipping),
            label: const Text('Iniciar tránsito'),
          ),
        ];
      case EstadoPedido.EN_TRANSITO:
        return [
          FilledButton.icon(
            onPressed: () => _confirmar(
              context,
              ref,
              titulo: '¿Llegaste al punto de intercambio?',
              accion: 'llegarIntercambio',
            ),
            style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(48)),
            icon: const Icon(Icons.flag),
            label: const Text('Llegué al punto'),
          ),
        ];
      case EstadoPedido.EN_PUNTO_INTERCAMBIO:
        return [
          FilledButton.icon(
            onPressed: () => _confirmar(
              context,
              ref,
              titulo: '¿Tomar este pedido para entregar?',
              accion: 'tomarEntrega',
            ),
            style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(48)),
            icon: const Icon(Icons.assignment_turned_in),
            label: const Text('Tomar para entregar'),
          ),
        ];
      default:
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
  }

  Future<void> _confirmar(
    BuildContext context,
    WidgetRef ref, {
    required String titulo,
    required String accion,
  }) async {
    final confirmado = await showModalBottomSheet<bool>(
      context: context,
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(titulo, style: Theme.of(ctx).textTheme.titleMedium),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => Navigator.pop(ctx, false),
                    child: const Text('Cancelar'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: FilledButton(
                    onPressed: () => Navigator.pop(ctx, true),
                    child: const Text('Confirmar'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );

    if (confirmado != true) return;
    if (!context.mounted) return;
    await _ejecutar(context, ref, accion);
  }

  Future<void> _ejecutar(BuildContext context, WidgetRef ref, String accion) async {
    final messenger = ScaffoldMessenger.of(context);
    final repo = ref.read(pedidosRepositorioProveedor);
    Position? pos;
    try {
      pos = await _ubicacionActual();
    } catch (_) {
      // continúa sin geo
    }

    try {
      switch (accion) {
        case 'recoger':
          await repo.recoger(pedido.id, lat: pos?.latitude, lng: pos?.longitude);
          break;
        case 'enTransito':
          await repo.enTransito(pedido.id, lat: pos?.latitude, lng: pos?.longitude);
          break;
        case 'llegarIntercambio':
          await repo.llegarIntercambio(pedido.id, lat: pos?.latitude, lng: pos?.longitude);
          break;
        case 'tomarEntrega':
          await repo.tomarEntrega(pedido.id, lat: pos?.latitude, lng: pos?.longitude);
          break;
      }
      ref.invalidate(recogidasPendientesProveedor);
      ref.invalidate(pedidosEnCursoProveedor);
      ref.invalidate(entregasPendientesProveedor);
      ref.invalidate(pedidoPorIdProveedor(pedido.id));
      if (!context.mounted) return;
      messenger.showSnackBar(
        const SnackBar(content: Text('Estado actualizado'), backgroundColor: Colors.green),
      );
      if (accion == 'tomarEntrega') {
        context.go('/inicio/entregas/${pedido.id}');
      } else if (accion == 'recoger') {
        context.go('/inicio/en-curso/${pedido.id}');
      }
      // Para enTransito y llegarIntercambio: el detalle se refresca solo
      // (pedidoPorIdProveedor invalidado) y el rider continúa el flujo.
    } on ExcepcionApi catch (e) {
      messenger.showSnackBar(
        SnackBar(content: Text(e.mensaje), backgroundColor: Colors.red),
      );
    }
  }

  Future<Position?> _ubicacionActual() async {
    final habilitado = await Geolocator.isLocationServiceEnabled();
    if (!habilitado) return null;
    var permiso = await Geolocator.checkPermission();
    if (permiso == LocationPermission.denied) {
      permiso = await Geolocator.requestPermission();
      if (permiso == LocationPermission.denied) return null;
    }
    if (permiso == LocationPermission.deniedForever) return null;
    return Geolocator.getCurrentPosition(
      locationSettings: const LocationSettings(accuracy: LocationAccuracy.high),
    );
  }
}
