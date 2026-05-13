import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../data/modelos/pedido.dart';
import '../../widgets/tarjeta_pedido.dart';
import 'proveedor_recogidas.dart';

class PantallaListaRecogidas extends ConsumerWidget {
  const PantallaListaRecogidas({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final asincrono = ref.watch(recogidasPendientesProveedor);

    return RefreshIndicator(
      onRefresh: () async => ref.invalidate(recogidasPendientesProveedor),
      child: asincrono.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => ListView(
          children: [
            const SizedBox(height: 200),
            Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  children: [
                    Icon(Icons.error_outline,
                        size: 56, color: Theme.of(context).colorScheme.error),
                    const SizedBox(height: 16),
                    Text('Error: $e', textAlign: TextAlign.center),
                    const SizedBox(height: 12),
                    FilledButton.tonal(
                      onPressed: () => ref.invalidate(recogidasPendientesProveedor),
                      child: const Text('Reintentar'),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
        data: (lista) {
          if (lista.isEmpty) {
            return ListView(
              children: const [
                SizedBox(height: 200),
                Center(
                  child: Padding(
                    padding: EdgeInsets.all(24),
                    child: Column(
                      children: [
                        Icon(Icons.inbox_outlined, size: 56, color: Colors.grey),
                        SizedBox(height: 16),
                        Text(
                          'No hay pedidos asignados para recoger',
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            );
          }
          final grupos = _agruparPorVendedor(lista);
          return ListView.builder(
            padding: const EdgeInsets.symmetric(vertical: 8),
            itemCount: grupos.length,
            itemBuilder: (context, index) {
              final grupo = grupos[index];
              return _GrupoVendedor(
                nombre: grupo.nombre,
                pedidos: grupo.pedidos,
                onTapPedido: (id) => context.go('/inicio/recogidas/$id'),
              );
            },
          );
        },
      ),
    );
  }

  List<_GrupoRecogidas> _agruparPorVendedor(List<Pedido> lista) {
    final grupos = <_GrupoRecogidas>[];
    final indicePorVendedor = <String, int>{};
    for (final pedido in lista) {
      final clave = pedido.vendedorId ?? '__sin_vendedor__';
      final indice = indicePorVendedor[clave];
      if (indice == null) {
        indicePorVendedor[clave] = grupos.length;
        grupos.add(_GrupoRecogidas(
          nombre: pedido.nombreVendedor ?? 'Sin vendedor',
          pedidos: [pedido],
        ));
      } else {
        grupos[indice].pedidos.add(pedido);
      }
    }
    return grupos;
  }
}

class _GrupoRecogidas {
  final String nombre;
  final List<Pedido> pedidos;

  _GrupoRecogidas({required this.nombre, required this.pedidos});
}

class _GrupoVendedor extends StatelessWidget {
  final String nombre;
  final List<Pedido> pedidos;
  final void Function(String id) onTapPedido;

  const _GrupoVendedor({
    required this.nombre,
    required this.pedidos,
    required this.onTapPedido,
  });

  @override
  Widget build(BuildContext context) {
    return Theme(
      data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
      child: ExpansionTile(
        initiallyExpanded: true,
        tilePadding: const EdgeInsets.symmetric(horizontal: 16),
        childrenPadding: EdgeInsets.zero,
        title: Text(
          '$nombre (${pedidos.length})',
          style: Theme.of(context).textTheme.titleSmall?.copyWith(
                fontWeight: FontWeight.bold,
              ),
        ),
        children: pedidos
            .map((p) => TarjetaPedido(
                  pedido: p,
                  onTap: () => onTapPedido(p.id),
                ))
            .toList(),
      ),
    );
  }
}
