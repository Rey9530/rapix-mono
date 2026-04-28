import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../widgets/pedido_tarjeta.dart';
import 'pedidos_listado_controlador.dart';

class PedidosListadoPantalla extends ConsumerWidget {
  const PedidosListadoPantalla({super.key});

  static const _estados = <String>[
    'PENDIENTE_ASIGNACION',
    'ASIGNADO',
    'EN_TRANSITO',
    'EN_REPARTO',
    'ENTREGADO',
    'FALLIDO',
    'CANCELADO',
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final pedidos = ref.watch(pedidosListadoProvider);
    final filtros = ref.watch(filtrosPedidosProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Mis pedidos'),
        actions: [
          PopupMenuButton<String?>(
            tooltip: 'Filtrar por estado',
            icon: const Icon(Icons.filter_list),
            onSelected: (estado) {
              ref.read(filtrosPedidosProvider.notifier).update(
                    (f) => estado == null
                        ? f.copia(limpiarEstado: true)
                        : f.copia(estado: estado),
                  );
            },
            itemBuilder: (_) => [
              const PopupMenuItem<String?>(
                value: null,
                child: Text('Todos'),
              ),
              ..._estados.map(
                (e) => PopupMenuItem<String?>(
                  value: e,
                  child: Text(e.replaceAll('_', ' ')),
                ),
              ),
            ],
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => context.push('/pedidos/nuevo'),
        icon: const Icon(Icons.add),
        label: const Text('Nuevo'),
      ),
      body: Column(
        children: [
          if (filtros.estado != null)
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: 16,
                vertical: 8,
              ),
              child: Align(
                alignment: Alignment.centerLeft,
                child: InputChip(
                  label: Text('Estado: ${filtros.estado!.replaceAll('_', ' ')}'),
                  onDeleted: () => ref
                      .read(filtrosPedidosProvider.notifier)
                      .update((f) => f.copia(limpiarEstado: true)),
                ),
              ),
            ),
          Expanded(
            child: RefreshIndicator(
              onRefresh: () async => ref.refresh(pedidosListadoProvider.future),
              child: pedidos.when(
                data: (lista) {
                  if (lista.isEmpty) {
                    return ListView(
                      children: const [
                        SizedBox(height: 96),
                        Icon(Icons.inbox_outlined,
                            size: 64, color: Colors.grey),
                        SizedBox(height: 12),
                        Center(child: Text('No hay pedidos para mostrar')),
                      ],
                    );
                  }
                  return ListView.builder(
                    padding: const EdgeInsets.only(top: 8, bottom: 96),
                    itemCount: lista.length,
                    itemBuilder: (_, i) => PedidoTarjeta(
                      pedido: lista[i],
                      alTocar: () => context.push('/pedidos/${lista[i].id}'),
                    ),
                  );
                },
                loading: () =>
                    const Center(child: CircularProgressIndicator()),
                error: (e, _) => ListView(
                  padding: const EdgeInsets.all(24),
                  children: [
                    const Icon(Icons.error_outline,
                        size: 48, color: Colors.red),
                    const SizedBox(height: 12),
                    Text('Error: $e', textAlign: TextAlign.center),
                    const SizedBox(height: 12),
                    Center(
                      child: FilledButton.tonal(
                        onPressed: () =>
                            ref.invalidate(pedidosListadoProvider),
                        child: const Text('Reintentar'),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
