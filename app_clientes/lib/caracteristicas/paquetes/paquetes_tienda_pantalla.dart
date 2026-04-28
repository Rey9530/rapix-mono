import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';

import '../../datos/modelos/paquete_recargado.dart';
import '../../datos/repositorios/paquetes_repositorio.dart';
import 'paquetes_controlador.dart';

class PaquetesTiendaPantalla extends ConsumerWidget {
  const PaquetesTiendaPantalla({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final disponibles = ref.watch(paquetesDisponiblesProvider);
    final formato = NumberFormat.currency(symbol: '\$');

    return Scaffold(
      appBar: AppBar(title: const Text('Comprar paquetes')),
      body: disponibles.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Error: $e')),
        data: (lista) {
          if (lista.isEmpty) {
            return const Center(
              child: Padding(
                padding: EdgeInsets.all(24),
                child: Text('No hay paquetes disponibles en este momento.'),
              ),
            );
          }
          return RefreshIndicator(
            onRefresh: () async =>
                ref.refresh(paquetesDisponiblesProvider.future),
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: lista.length,
              itemBuilder: (_, i) => _TarjetaRegla(
                regla: lista[i],
                formato: formato,
              ),
            ),
          );
        },
      ),
    );
  }
}

class _TarjetaRegla extends ConsumerWidget {
  const _TarjetaRegla({required this.regla, required this.formato});

  final ReglaTarifaPaquete regla;
  final NumberFormat formato;

  Future<void> _confirmar(BuildContext context, WidgetRef ref) async {
    final aceptado = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Confirmar compra'),
        content: Text(
          'Comprar "${regla.nombre}" por ${formato.format(regla.precioPaquete)}?\n\n'
          'El admin confirmara el pago para activarlo.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancelar'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Comprar'),
          ),
        ],
      ),
    );
    if (aceptado != true || !context.mounted) return;

    try {
      await ref.read(paquetesRepositorioProvider).comprar(
            reglaTarifaId: regla.id,
            metodoPago: 'TRANSFERENCIA',
          );
      ref.invalidate(misPaquetesProvider);
      ref.invalidate(saldoProvider);
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
            'Compra registrada. Esta pendiente de confirmacion del admin.',
          ),
        ),
      );
    } on DioException catch (e) {
      if (!context.mounted) return;
      final mensaje = e.response?.data is Map<String, dynamic>
          ? ((e.response!.data as Map<String, dynamic>)['mensaje'] ??
                  (e.response!.data as Map<String, dynamic>)['message'])
              ?.toString()
          : null;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(mensaje ?? 'No se pudo procesar la compra')),
      );
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final precioPorEnvio =
        regla.tamanoPaquete > 0 ? regla.precioPaquete / regla.tamanoPaquete : 0;
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  backgroundColor:
                      Theme.of(context).colorScheme.primaryContainer,
                  child: Icon(
                    Icons.inventory_2_outlined,
                    color: Theme.of(context).colorScheme.onPrimaryContainer,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        regla.nombre,
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      Text(
                        '${regla.tamanoPaquete} envios',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ],
                  ),
                ),
                Text(
                  formato.format(regla.precioPaquete),
                  style: Theme.of(context)
                      .textTheme
                      .titleMedium
                      ?.copyWith(fontWeight: FontWeight.bold),
                ),
              ],
            ),
            if (regla.descripcion != null) ...[
              const SizedBox(height: 8),
              Text(regla.descripcion!),
            ],
            const SizedBox(height: 8),
            Text(
              'Costo por envio: ${formato.format(precioPorEnvio)}'
              '${regla.diasValidez != null ? ' · Validez ${regla.diasValidez} dias' : ''}',
              style: Theme.of(context).textTheme.bodySmall,
            ),
            const SizedBox(height: 12),
            Align(
              alignment: Alignment.centerRight,
              child: FilledButton.icon(
                onPressed: () => _confirmar(context, ref),
                icon: const Icon(Icons.shopping_cart_checkout),
                label: const Text('Comprar'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
