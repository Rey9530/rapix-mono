import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';

import '../../datos/modelos/deposito.dart';
import 'cobros_controlador.dart';

String _mensajeError(Object error) {
  if (error is DioException) {
    final datos = error.response?.data;
    if (datos is Map) {
      final mensaje = datos['mensaje'] ?? datos['message'];
      final codigo = datos['codigo'] ?? datos['code'];
      if (mensaje is String && mensaje.isNotEmpty) {
        return codigo is String ? '$mensaje ($codigo)' : mensaje;
      }
      if (codigo is String) return codigo;
    }
    final estado = error.response?.statusCode;
    if (estado != null) return 'Error $estado al cargar tus cobros';
    return 'No se pudo conectar con el servidor';
  }
  return error.toString();
}

final _formatoMoneda = NumberFormat.currency(symbol: '\$', locale: 'es');
final _formatoFechaCorta = DateFormat('dd/MM/yyyy');
final _formatoFechaGrupo = DateFormat("d 'de' MMMM 'de' y", 'es');

class CobrosPantalla extends StatelessWidget {
  const CobrosPantalla({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Mis cobros'),
          bottom: const TabBar(
            tabs: [
              Tab(text: 'Pendiente'),
              Tab(text: 'Historial'),
            ],
          ),
        ),
        body: const TabBarView(
          children: [
            _PestanaPendiente(),
            _PestanaHistorial(),
          ],
        ),
      ),
    );
  }
}

class _PestanaPendiente extends ConsumerWidget {
  const _PestanaPendiente();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final saldo = ref.watch(saldoPendienteProvider);
    return RefreshIndicator(
      onRefresh: () async {
        ref.invalidate(saldoPendienteProvider);
        await ref.read(saldoPendienteProvider.future);
      },
      child: saldo.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => _ErrorListado(
          mensaje: _mensajeError(e),
          onReintentar: () => ref.invalidate(saldoPendienteProvider),
        ),
        data: (datos) {
          if (datos.paquetes.isEmpty) {
            return ListView(
              children: [
                _ResumenSaldo(saldo: datos),
                const SizedBox(height: 32),
                const Center(
                  child: Padding(
                    padding: EdgeInsets.symmetric(horizontal: 32),
                    child: Text(
                      'No tienes paquetes contra entrega pendientes de deposito.',
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
              ],
            );
          }
          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: datos.paquetes.length + 1,
            separatorBuilder: (_, _) => const SizedBox(height: 8),
            itemBuilder: (context, indice) {
              if (indice == 0) return _ResumenSaldo(saldo: datos);
              final p = datos.paquetes[indice - 1];
              return _TarjetaPaquetePendiente(paquete: p);
            },
          );
        },
      ),
    );
  }
}

class _ResumenSaldo extends StatelessWidget {
  const _ResumenSaldo({required this.saldo});

  final SaldoPendiente saldo;

  @override
  Widget build(BuildContext context) {
    final esquemaColor = Theme.of(context).colorScheme;
    return Card(
      color: esquemaColor.primaryContainer,
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Saldo pendiente de deposito',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: esquemaColor.onPrimaryContainer,
                  ),
            ),
            const SizedBox(height: 4),
            Text(
              _formatoMoneda.format(saldo.totalPendiente),
              style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                    color: esquemaColor.onPrimaryContainer,
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 4),
            Text(
              '${saldo.cantidad} paquete${saldo.cantidad == 1 ? '' : 's'} por liquidar',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: esquemaColor.onPrimaryContainer,
                  ),
            ),
          ],
        ),
      ),
    );
  }
}

class _TarjetaPaquetePendiente extends StatelessWidget {
  const _TarjetaPaquetePendiente({required this.paquete});

  final PaquetePendienteDeposito paquete;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.zero,
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    paquete.codigoSeguimiento,
                    style: Theme.of(context).textTheme.titleSmall,
                  ),
                ),
                Text(
                  _formatoMoneda.format(paquete.montoContraEntrega),
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
              ],
            ),
            const SizedBox(height: 4),
            Text(
              paquete.nombreCliente,
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            if (paquete.direccionDestino.isNotEmpty) ...[
              const SizedBox(height: 2),
              Text(
                paquete.direccionDestino,
                style: Theme.of(context).textTheme.bodySmall,
              ),
            ],
            if (paquete.entregadoEn != null) ...[
              const SizedBox(height: 6),
              Text(
                'Entregado: ${_formatoFechaCorta.format(paquete.entregadoEn!.toLocal())}',
                style: Theme.of(context).textTheme.bodySmall,
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _PestanaHistorial extends ConsumerWidget {
  const _PestanaHistorial();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final historial = ref.watch(historialDepositosProvider);
    return RefreshIndicator(
      onRefresh: () async {
        ref.invalidate(historialDepositosProvider);
        await ref.read(historialDepositosProvider.future);
      },
      child: historial.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => _ErrorListado(
          mensaje: _mensajeError(e),
          onReintentar: () => ref.invalidate(historialDepositosProvider),
        ),
        data: (pagina) {
          if (pagina.datos.isEmpty) {
            return ListView(
              children: const [
                SizedBox(height: 80),
                Center(
                  child: Padding(
                    padding: EdgeInsets.symmetric(horizontal: 32),
                    child: Text(
                      'Aun no tienes depositos registrados.',
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
              ],
            );
          }
          return _ListaAgrupadaPorDeposito(paquetes: pagina.datos);
        },
      ),
    );
  }
}

class _ListaAgrupadaPorDeposito extends StatelessWidget {
  const _ListaAgrupadaPorDeposito({required this.paquetes});

  final List<PaqueteDepositado> paquetes;

  @override
  Widget build(BuildContext context) {
    final grupos = <String, List<PaqueteDepositado>>{};
    for (final p in paquetes) {
      grupos.putIfAbsent(p.deposito.id, () => []).add(p);
    }

    final ordenados = grupos.values.toList()
      ..sort((a, b) =>
          b.first.deposito.fechaDeposito.compareTo(a.first.deposito.fechaDeposito));

    final widgets = <Widget>[];
    for (final grupo in ordenados) {
      final deposito = grupo.first.deposito;
      final subtotal = grupo.fold<double>(
        0,
        (acc, p) => acc + p.montoContraEntrega,
      );
      widgets.add(_EncabezadoGrupo(
        fecha: deposito.fechaDeposito,
        referencia: deposito.referencia,
        subtotal: subtotal,
      ));
      for (final p in grupo) {
        widgets.add(_TarjetaPaqueteDepositado(paquete: p));
      }
      widgets.add(const SizedBox(height: 12));
    }

    return ListView(
      padding: const EdgeInsets.all(16),
      children: widgets,
    );
  }
}

class _EncabezadoGrupo extends StatelessWidget {
  const _EncabezadoGrupo({
    required this.fecha,
    required this.subtotal,
    this.referencia,
  });

  final DateTime fecha;
  final double subtotal;
  final String? referencia;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  _formatoFechaGrupo.format(fecha.toLocal()),
                  style: Theme.of(context).textTheme.titleSmall?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
                if (referencia != null && referencia!.isNotEmpty)
                  Text(
                    'Ref. $referencia',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
              ],
            ),
          ),
          Text(
            _formatoMoneda.format(subtotal),
            style: Theme.of(context).textTheme.titleSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
          ),
        ],
      ),
    );
  }
}

class _TarjetaPaqueteDepositado extends StatelessWidget {
  const _TarjetaPaqueteDepositado({required this.paquete});

  final PaqueteDepositado paquete;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 6),
      child: ListTile(
        title: Text(paquete.codigoSeguimiento),
        subtitle: Text(paquete.nombreCliente),
        trailing: Text(
          _formatoMoneda.format(paquete.montoContraEntrega),
          style: Theme.of(context).textTheme.titleSmall?.copyWith(
                fontWeight: FontWeight.bold,
              ),
        ),
      ),
    );
  }
}

class _ErrorListado extends StatelessWidget {
  const _ErrorListado({required this.mensaje, required this.onReintentar});

  final String mensaje;
  final VoidCallback onReintentar;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(24),
      children: [
        const SizedBox(height: 40),
        const Icon(Icons.error_outline, color: Colors.red, size: 48),
        const SizedBox(height: 12),
        Text(
          mensaje,
          textAlign: TextAlign.center,
          style: const TextStyle(color: Colors.red),
        ),
        const SizedBox(height: 12),
        Center(
          child: TextButton(
            onPressed: onReintentar,
            child: const Text('Reintentar'),
          ),
        ),
      ],
    );
  }
}
