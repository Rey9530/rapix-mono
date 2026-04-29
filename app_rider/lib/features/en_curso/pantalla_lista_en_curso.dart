import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../widgets/tarjeta_pedido.dart';
import 'proveedor_en_curso.dart';

class PantallaListaEnCurso extends ConsumerWidget {
  const PantallaListaEnCurso({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final asincrono = ref.watch(pedidosEnCursoProveedor);

    return RefreshIndicator(
      onRefresh: () async => ref.invalidate(pedidosEnCursoProveedor),
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
                      onPressed: () => ref.invalidate(pedidosEnCursoProveedor),
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
                        Icon(Icons.local_shipping_outlined,
                            size: 56, color: Colors.grey),
                        SizedBox(height: 16),
                        Text(
                          'No tienes pedidos en curso.\nMárcalos como recogidos para verlos aquí.',
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            );
          }
          return ListView.builder(
            padding: const EdgeInsets.symmetric(vertical: 8),
            itemCount: lista.length,
            itemBuilder: (context, index) => TarjetaPedido(
              pedido: lista[index],
              onTap: () => context.go('/inicio/en-curso/${lista[index].id}'),
            ),
          );
        },
      ),
    );
  }
}
