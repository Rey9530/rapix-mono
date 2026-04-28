import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import 'paquetes_controlador.dart';

class SaldoWidget extends ConsumerWidget {
  const SaldoWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final saldo = ref.watch(saldoProvider);

    return saldo.when(
      data: (s) {
        final color = s.saldoRecargado > 10
            ? Colors.green
            : (s.saldoRecargado > 0 ? Colors.orange : Colors.red);
        return Card(
          color: color.withValues(alpha: 0.08),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: BorderSide(color: color.withValues(alpha: 0.4)),
          ),
          child: ListTile(
            leading: CircleAvatar(
              backgroundColor: color.withValues(alpha: 0.18),
              child: Icon(Icons.account_balance_wallet, color: color),
            ),
            title: Text(
              '${s.saldoRecargado} envios disponibles',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            subtitle: Text('${s.paquetesActivos} paquete(s) activos'),
            trailing: TextButton(
              onPressed: () => context.push('/paquetes/tienda'),
              child: const Text('Recargar'),
            ),
          ),
        );
      },
      loading: () => const Card(
        child: ListTile(
          leading: CircularProgressIndicator(strokeWidth: 2),
          title: Text('Cargando saldo...'),
        ),
      ),
      error: (_, _) => Card(
        child: ListTile(
          leading: const Icon(Icons.error_outline, color: Colors.red),
          title: const Text('No se pudo cargar el saldo'),
          trailing: TextButton(
            onPressed: () => ref.invalidate(saldoProvider),
            child: const Text('Reintentar'),
          ),
        ),
      ),
    );
  }
}
