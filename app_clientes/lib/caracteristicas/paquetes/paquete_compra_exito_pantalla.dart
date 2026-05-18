import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';

import '../../datos/modelos/paquete_recargado.dart';

class PaqueteCompraExitoPantalla extends StatelessWidget {
  const PaqueteCompraExitoPantalla({super.key, required this.paquete});

  final PaqueteRecargado paquete;

  @override
  Widget build(BuildContext context) {
    final t = Theme.of(context);
    final formato = NumberFormat.currency(symbol: '\$');
    return Scaffold(
      appBar: AppBar(
        title: const Text('Compra registrada'),
        automaticallyImplyLeading: false,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 16),
              Icon(
                Icons.check_circle,
                size: 96,
                color: Colors.green.shade600,
              ),
              const SizedBox(height: 16),
              Text(
                '¡Compra registrada!',
                style: t.textTheme.headlineSmall,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              Text(
                'Tu compra esta pendiente de confirmacion. El administrador validara '
                'el comprobante y activara tu paquete pronto. Te notificaremos cuando '
                'este listo.',
                style: t.textTheme.bodyMedium,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              paquete.nombre,
                              style: t.textTheme.titleMedium,
                            ),
                          ),
                          _ChipEstado(estado: paquete.estado),
                        ],
                      ),
                      const SizedBox(height: 12),
                      _Fila(
                        etiqueta: 'Envios incluidos',
                        valor: '${paquete.enviosTotales}',
                      ),
                      _Fila(
                        etiqueta: 'Monto',
                        valor: formato.format(paquete.precio),
                      ),
                    ],
                  ),
                ),
              ),
              const Spacer(),
              FilledButton.icon(
                onPressed: () => context.go('/paquetes'),
                icon: const Icon(Icons.inventory_2_outlined),
                label: const Text('Ver mis paquetes'),
              ),
              const SizedBox(height: 8),
              TextButton(
                onPressed: () => context.go('/inicio'),
                child: const Text('Volver al inicio'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _Fila extends StatelessWidget {
  const _Fila({required this.etiqueta, required this.valor});

  final String etiqueta;
  final String valor;

  @override
  Widget build(BuildContext context) {
    final t = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Expanded(
            child: Text(etiqueta, style: t.textTheme.bodySmall),
          ),
          Text(
            valor,
            style: t.textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }
}

class _ChipEstado extends StatelessWidget {
  const _ChipEstado({required this.estado});

  final String estado;

  @override
  Widget build(BuildContext context) {
    final t = Theme.of(context);
    final colorFondo = estado == 'ACTIVO'
        ? Colors.green.shade100
        : estado == 'PENDIENTE_PAGO'
            ? Colors.orange.shade100
            : t.colorScheme.surfaceContainerHighest;
    final colorTexto = estado == 'ACTIVO'
        ? Colors.green.shade900
        : estado == 'PENDIENTE_PAGO'
            ? Colors.orange.shade900
            : t.colorScheme.onSurface;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: colorFondo,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        estado.replaceAll('_', ' '),
        style: t.textTheme.labelSmall?.copyWith(
          color: colorTexto,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}
