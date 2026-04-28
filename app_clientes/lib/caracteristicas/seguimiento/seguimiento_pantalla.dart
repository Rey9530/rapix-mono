import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../datos/modelos/pedido.dart';
import '../../datos/repositorios/pedidos_repositorio.dart';
import '../../widgets/estado_chip.dart';
import '../../widgets/linea_tiempo_estado.dart';

final seguimientoPublicoProvider =
    FutureProvider.family.autoDispose<Pedido, String>((ref, codigo) async {
  final repo = ref.watch(pedidosRepositorioProvider);
  return repo.obtenerPorCodigoPublico(codigo);
});

/// Vista publica accesible sin autenticacion (deep link).
class SeguimientoPantalla extends ConsumerWidget {
  const SeguimientoPantalla({super.key, required this.codigo});

  final String codigo;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final pedido = ref.watch(seguimientoPublicoProvider(codigo));
    return Scaffold(
      appBar: AppBar(title: Text('Seguimiento $codigo')),
      body: pedido.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Text('No se encontro el pedido: $e'),
          ),
        ),
        data: (p) => RefreshIndicator(
          onRefresh: () async =>
              ref.refresh(seguimientoPublicoProvider(codigo).future),
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              Center(
                child: Text(
                  p.codigoSeguimiento,
                  style: Theme.of(context).textTheme.headlineSmall,
                ),
              ),
              const SizedBox(height: 12),
              Center(child: EstadoChip(estado: p.estado)),
              const SizedBox(height: 24),
              LineaTiempoEstado(eventos: p.eventos),
            ],
          ),
        ),
      ),
    );
  }
}
