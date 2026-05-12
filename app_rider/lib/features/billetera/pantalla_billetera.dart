import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';

import '../../data/modelos/movimiento_caja.dart';
import 'proveedor_billetera.dart';

class PantallaBilletera extends ConsumerWidget {
  const PantallaBilletera({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final saldo = ref.watch(saldoPendienteProveedor);
    final movimientos = ref.watch(movimientosPendientesProveedor);

    return RefreshIndicator(
      onRefresh: () async {
        ref.invalidate(saldoPendienteProveedor);
        ref.invalidate(movimientosPendientesProveedor);
        await Future.wait([
          ref.read(saldoPendienteProveedor.future),
          ref.read(movimientosPendientesProveedor.future),
        ]);
      },
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          saldo.when(
            loading: () => const _TarjetaSaldoCargando(),
            error: (e, _) => _TarjetaSaldoError(error: '$e'),
            data: (s) => _TarjetaSaldo(saldo: s),
          ),
          const SizedBox(height: 16),
          Text(
            'Movimientos pendientes',
            style: Theme.of(context).textTheme.titleMedium,
          ),
          const SizedBox(height: 8),
          movimientos.when(
            loading: () => const Padding(
              padding: EdgeInsets.all(24),
              child: Center(child: CircularProgressIndicator()),
            ),
            error: (e, _) => Padding(
              padding: const EdgeInsets.all(16),
              child: Text('Error: $e'),
            ),
            data: (lista) {
              if (lista.isEmpty) {
                return const Padding(
                  padding: EdgeInsets.all(24),
                  child: Center(
                    child: Text('Sin movimientos pendientes hoy.'),
                  ),
                );
              }
              return Column(
                children: [
                  for (final m in lista) _FilaMovimiento(movimiento: m),
                ],
              );
            },
          ),
          const SizedBox(height: 16),
          FilledButton.icon(
            onPressed: () => context.go('/inicio/cierre'),
            icon: const Icon(Icons.point_of_sale_outlined),
            label: const Text('Cerrar el día'),
            style:
                FilledButton.styleFrom(minimumSize: const Size.fromHeight(48)),
          ),
        ],
      ),
    );
  }
}

class _TarjetaSaldo extends StatelessWidget {
  final SaldoPendiente saldo;
  const _TarjetaSaldo({required this.saldo});

  @override
  Widget build(BuildContext context) {
    final formato = NumberFormat.currency(symbol: r'$', decimalDigits: 2);
    final monto = double.tryParse(saldo.total) ?? 0;
    return Card(
      color: Colors.green.shade50,
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'SALDO A ENTREGAR',
              style: Theme.of(context).textTheme.labelMedium?.copyWith(
                    color: Colors.green.shade900,
                    letterSpacing: 0.5,
                  ),
            ),
            const SizedBox(height: 8),
            Text(
              formato.format(monto),
              style: Theme.of(context).textTheme.displaySmall?.copyWith(
                    color: Colors.green.shade900,
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 4),
            Text(
              '${saldo.cantidad} movimiento${saldo.cantidad == 1 ? '' : 's'} pendiente${saldo.cantidad == 1 ? '' : 's'}',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Colors.green.shade900,
                  ),
            ),
          ],
        ),
      ),
    );
  }
}

class _TarjetaSaldoCargando extends StatelessWidget {
  const _TarjetaSaldoCargando();

  @override
  Widget build(BuildContext context) {
    return const Card(
      child: SizedBox(
        height: 120,
        child: Center(child: CircularProgressIndicator()),
      ),
    );
  }
}

class _TarjetaSaldoError extends StatelessWidget {
  final String error;
  const _TarjetaSaldoError({required this.error});

  @override
  Widget build(BuildContext context) {
    return Card(
      color: Colors.red.shade50,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Text('Error: $error'),
      ),
    );
  }
}

class _FilaMovimiento extends StatelessWidget {
  final MovimientoCaja movimiento;
  const _FilaMovimiento({required this.movimiento});

  @override
  Widget build(BuildContext context) {
    final formato = NumberFormat.currency(symbol: r'$', decimalDigits: 2);
    final monto = double.tryParse(movimiento.monto) ?? 0;
    final esRecogida = movimiento.tipo == 'COBRO_RECOGIDA';
    final icono = esRecogida ? Icons.local_shipping : Icons.payments_outlined;
    final color = esRecogida ? Colors.orange : Colors.green;
    final etiqueta = esRecogida ? 'Cobro al vendedor' : 'Cobro al cliente';
    final hora = DateFormat('HH:mm').format(movimiento.creadoEn.toLocal());

    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: color.shade100,
          child: Icon(icono, color: color.shade800),
        ),
        title: Text(etiqueta),
        subtitle: Text(
          '${movimiento.codigoSeguimiento ?? 'sin código'} · $hora',
        ),
        trailing: Text(
          formato.format(monto),
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                color: color.shade800,
                fontWeight: FontWeight.bold,
              ),
        ),
      ),
    );
  }
}
