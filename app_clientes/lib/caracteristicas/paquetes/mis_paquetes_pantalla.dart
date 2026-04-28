import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';

import '../../datos/modelos/paquete_recargado.dart';
import 'paquetes_controlador.dart';
import 'saldo_widget.dart';

class MisPaquetesPantalla extends ConsumerWidget {
  const MisPaquetesPantalla({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final paquetes = ref.watch(misPaquetesProvider);
    return Scaffold(
      appBar: AppBar(title: const Text('Mis paquetes')),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => context.push('/paquetes/tienda'),
        icon: const Icon(Icons.add),
        label: const Text('Comprar'),
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(saldoProvider);
          ref.invalidate(misPaquetesProvider);
          await ref.read(misPaquetesProvider.future);
        },
        child: paquetes.when(
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (e, _) => ListView(
            padding: const EdgeInsets.all(24),
            children: [Text('Error: $e')],
          ),
          data: (lista) => ListView(
            padding: const EdgeInsets.all(16),
            children: [
              const SaldoWidget(),
              const SizedBox(height: 16),
              if (lista.isEmpty)
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 32),
                  child: Center(
                    child: Text('Aun no tienes paquetes comprados.'),
                  ),
                )
              else
                ...lista.map(_PaqueteTarjeta.new),
            ],
          ),
        ),
      ),
    );
  }
}

class _PaqueteTarjeta extends StatelessWidget {
  const _PaqueteTarjeta(this.paquete);

  final PaqueteRecargado paquete;

  @override
  Widget build(BuildContext context) {
    final formatoFecha = DateFormat('dd/MM/yyyy');
    final formatoMoneda = NumberFormat.currency(symbol: '\$');
    final progreso = paquete.enviosTotales > 0
        ? paquete.enviosUsados / paquete.enviosTotales
        : 0.0;
    final colorEstado = switch (paquete.estado) {
      'ACTIVO' => Colors.green,
      'PENDIENTE_PAGO' => Colors.orange,
      'AGOTADO' => Colors.grey,
      'EXPIRADO' => Colors.red,
      _ => Colors.blueGrey,
    };

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    paquete.reglaTarifa?.nombre ?? 'Paquete',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                ),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: colorEstado.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(999),
                  ),
                  child: Text(
                    paquete.estado.replaceAll('_', ' '),
                    style: TextStyle(
                      color: colorEstado,
                      fontWeight: FontWeight.w600,
                      fontSize: 12,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              '${paquete.enviosRestantes} de ${paquete.enviosTotales} envios disponibles',
            ),
            const SizedBox(height: 6),
            ClipRRect(
              borderRadius: BorderRadius.circular(999),
              child: LinearProgressIndicator(
                value: progreso.clamp(0, 1),
                minHeight: 6,
              ),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 12,
              runSpacing: 4,
              children: [
                Text('Pagado: ${formatoMoneda.format(paquete.precioPagado)}'),
                Text('Comprado: ${formatoFecha.format(paquete.compradoEn)}'),
                if (paquete.expiraEn != null)
                  Text('Expira: ${formatoFecha.format(paquete.expiraEn!)}'),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
