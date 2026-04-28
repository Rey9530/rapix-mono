import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';

import '../../widgets/estado_chip.dart';
import '../../widgets/linea_tiempo_estado.dart';
import 'mapa_seguimiento_vivo.dart';
import 'pedidos_listado_controlador.dart';

class PedidoDetallePantalla extends ConsumerWidget {
  const PedidoDetallePantalla({super.key, required this.pedidoId});

  final String pedidoId;

  static const _estadosConTracking = {
    'ASIGNADO',
    'RECOGIDO',
    'EN_TRANSITO',
    'EN_PUNTO_INTERCAMBIO',
    'EN_REPARTO',
  };

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final pedido = ref.watch(pedidoDetalleProvider(pedidoId));
    final formato = NumberFormat.currency(symbol: '\$');

    return Scaffold(
      appBar: AppBar(
        title: const Text('Detalle del pedido'),
        actions: [
          IconButton(
            tooltip: 'Refrescar',
            icon: const Icon(Icons.refresh),
            onPressed: () =>
                ref.invalidate(pedidoDetalleProvider(pedidoId)),
          ),
        ],
      ),
      body: pedido.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.error_outline, size: 48, color: Colors.red),
                const SizedBox(height: 12),
                Text('$e', textAlign: TextAlign.center),
              ],
            ),
          ),
        ),
        data: (p) => RefreshIndicator(
          onRefresh: () async =>
              ref.refresh(pedidoDetalleProvider(pedidoId).future),
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(
                      p.codigoSeguimiento,
                      style: Theme.of(context).textTheme.headlineSmall,
                    ),
                  ),
                  EstadoChip(estado: p.estado),
                ],
              ),
              const SizedBox(height: 16),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Cliente',
                        style: Theme.of(context).textTheme.titleSmall,
                      ),
                      const SizedBox(height: 4),
                      Text(p.nombreCliente),
                      Text(p.telefonoCliente),
                      const Divider(height: 24),
                      Text(
                        'Destino',
                        style: Theme.of(context).textTheme.titleSmall,
                      ),
                      const SizedBox(height: 4),
                      Text(p.direccionDestino),
                      const Divider(height: 24),
                      Text(
                        'Pago',
                        style: Theme.of(context).textTheme.titleSmall,
                      ),
                      const SizedBox(height: 4),
                      Text('Metodo: ${p.metodoPago.replaceAll('_', ' ')}'),
                      if (p.montoContraEntrega != null)
                        Text(
                          'Cobro contra entrega: ${formato.format(p.montoContraEntrega)}',
                        ),
                      if (p.tarifaTotal != null)
                        Text(
                          'Tarifa: ${formato.format(p.tarifaTotal)}',
                        ),
                    ],
                  ),
                ),
              ),
              if (_estadosConTracking.contains(p.estado)) ...[
                const SizedBox(height: 16),
                Text(
                  'Seguimiento en vivo',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                const SizedBox(height: 8),
                MapaSeguimientoVivo(pedidoId: p.id, pedido: p),
                if (p.repartidorEntrega != null) ...[
                  const SizedBox(height: 8),
                  Card(
                    child: ListTile(
                      leading: const CircleAvatar(
                        child: Icon(Icons.delivery_dining),
                      ),
                      title: Text(p.repartidorEntrega!.nombreCompleto),
                      subtitle: p.repartidorEntrega!.telefono != null
                          ? Text(p.repartidorEntrega!.telefono!)
                          : null,
                    ),
                  ),
                ],
              ],
              if (p.estado == 'ENTREGADO' && p.comprobantes.isNotEmpty) ...[
                const SizedBox(height: 16),
                Text(
                  'Comprobante de entrega',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                const SizedBox(height: 8),
                ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: Image.network(
                    p.comprobantes.first.url,
                    fit: BoxFit.cover,
                    height: 220,
                    errorBuilder: (_, _, _) => Container(
                      height: 220,
                      color: Colors.black12,
                      child: const Center(
                        child: Icon(Icons.image_not_supported_outlined),
                      ),
                    ),
                  ),
                ),
              ],
              const SizedBox(height: 16),
              Text(
                'Linea de tiempo',
                style: Theme.of(context).textTheme.titleMedium,
              ),
              const SizedBox(height: 8),
              LineaTiempoEstado(eventos: p.eventos),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}
