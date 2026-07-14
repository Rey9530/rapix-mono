import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../widgets/boton_con_carga.dart';
import '../../../widgets/tarjeta_pedido.dart';
import '../proveedor_entregas.dart';

/// Tab "Listado" de la pantalla de entregas. Muestra la lista plana de
/// `TarjetaPedido` para los pedidos pendientes de entrega del rider.
///
/// La lista se refresca con pull-to-refresh y, al pulsar una tarjeta,
/// navega al detalle del pedido en `/inicio/entregas/:id`.
class VistaListaEntregas extends ConsumerWidget {
  const VistaListaEntregas({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final asincrono = ref.watch(entregasPendientesProveedor);

    return RefreshIndicator(
      onRefresh: () async {
        try {
          final future = ref.refresh(entregasPendientesProveedor.future);
          await future;
        } catch (_) {
          // Si el refresh falla, el bloque `error:` del `.when` muestra feedback.
        }
      },
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
                    BotonConCarga(
                      variante: VarianteBoton.tonal,
                      onPressed: () async {
                        ref.invalidate(entregasPendientesProveedor);
                      },
                      etiqueta: const Text('Reintentar'),
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
                          'No hay entregas pendientes',
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
              onTap: () => context.go('/inicio/entregas/${lista[index].id}'),
            ),
          );
        },
      ),
    );
  }
}