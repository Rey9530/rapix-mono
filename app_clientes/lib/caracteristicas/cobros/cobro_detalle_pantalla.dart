import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../datos/modelos/deposito.dart';
import 'cobros_controlador.dart';

final _formatoMoneda = NumberFormat.currency(symbol: '\$', locale: 'es');
final _formatoFecha = DateFormat("d 'de' MMMM 'de' y 'a las' HH:mm", 'es');
final _formatoFechaCorta = DateFormat('dd/MM/yyyy HH:mm');

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
    if (estado != null) return 'Error $estado al cargar el deposito';
    return 'No se pudo conectar con el servidor';
  }
  return error.toString();
}

class CobroDetallePantalla extends ConsumerWidget {
  const CobroDetallePantalla({super.key, required this.depositoId});

  final String depositoId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final asincrono = ref.watch(depositoDetalleProvider(depositoId));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Detalle del deposito'),
      ),
      body: asincrono.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => _ErrorDetalle(
          mensaje: _mensajeError(e),
          onReintentar: () =>
              ref.invalidate(depositoDetalleProvider(depositoId)),
        ),
        data: (deposito) => RefreshIndicator(
          onRefresh: () async {
            ref.invalidate(depositoDetalleProvider(depositoId));
            await ref.read(depositoDetalleProvider(depositoId).future);
          },
          child: ListView(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
            children: [
              _ResumenDeposito(deposito: deposito),
              if (deposito.cuentaBancaria != null) ...[
                const SizedBox(height: 12),
                _CuentaBancariaCard(cuenta: deposito.cuentaBancaria!),
              ],
              if (deposito.urlComprobante != null &&
                  deposito.urlComprobante!.isNotEmpty) ...[
                const SizedBox(height: 12),
                _ComprobanteCard(url: deposito.urlComprobante!),
              ],
              if (deposito.notas != null && deposito.notas!.isNotEmpty) ...[
                const SizedBox(height: 12),
                _NotasCard(notas: deposito.notas!),
              ],
              const SizedBox(height: 20),
              _TituloSeccion(
                'Paquetes incluidos (${deposito.pedidos.length})',
              ),
              const SizedBox(height: 8),
              ...deposito.pedidos.map(
                (p) => Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: _TarjetaPaquete(paquete: p),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ResumenDeposito extends StatelessWidget {
  const _ResumenDeposito({required this.deposito});

  final DepositoDetalle deposito;

  @override
  Widget build(BuildContext context) {
    final tema = Theme.of(context);
    final esquema = tema.colorScheme;
    final referencia = deposito.referencia;

    return Card(
      color: esquema.primaryContainer,
      margin: EdgeInsets.zero,
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Monto depositado',
              style: tema.textTheme.bodyMedium?.copyWith(
                color: esquema.onPrimaryContainer,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              _formatoMoneda.format(deposito.monto),
              style: tema.textTheme.headlineMedium?.copyWith(
                color: esquema.onPrimaryContainer,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Icon(
                  Icons.event_outlined,
                  size: 16,
                  color: esquema.onPrimaryContainer,
                ),
                const SizedBox(width: 6),
                Expanded(
                  child: Text(
                    _formatoFecha.format(deposito.fechaDeposito.toLocal()),
                    style: tema.textTheme.bodyMedium?.copyWith(
                      color: esquema.onPrimaryContainer,
                    ),
                  ),
                ),
              ],
            ),
            if (referencia != null && referencia.isNotEmpty) ...[
              const SizedBox(height: 6),
              Row(
                children: [
                  Icon(
                    Icons.confirmation_number_outlined,
                    size: 16,
                    color: esquema.onPrimaryContainer,
                  ),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      'Ref. $referencia',
                      style: tema.textTheme.bodyMedium?.copyWith(
                        color: esquema.onPrimaryContainer,
                      ),
                    ),
                  ),
                  IconButton(
                    visualDensity: VisualDensity.compact,
                    iconSize: 18,
                    color: esquema.onPrimaryContainer,
                    icon: const Icon(Icons.copy_outlined),
                    onPressed: () async {
                      await Clipboard.setData(ClipboardData(text: referencia));
                      if (context.mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Referencia copiada'),
                            duration: Duration(seconds: 2),
                          ),
                        );
                      }
                    },
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _CuentaBancariaCard extends StatelessWidget {
  const _CuentaBancariaCard({required this.cuenta});

  final CuentaBancariaResumen cuenta;

  @override
  Widget build(BuildContext context) {
    final tema = Theme.of(context);
    return Card(
      margin: EdgeInsets.zero,
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Icon(Icons.account_balance_outlined),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    cuenta.bancoNombre,
                    style: tema.textTheme.titleSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    '${_etiquetaTipo(cuenta.tipoCuenta)} ${cuenta.numeroCuenta}',
                    style: tema.textTheme.bodyMedium,
                  ),
                  if (cuenta.alias != null && cuenta.alias!.isNotEmpty) ...[
                    const SizedBox(height: 2),
                    Text(
                      cuenta.alias!,
                      style: tema.textTheme.bodySmall?.copyWith(
                        color: tema.colorScheme.onSurfaceVariant,
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _etiquetaTipo(String tipo) {
    switch (tipo) {
      case 'AHORRO':
        return 'Ahorro';
      case 'CORRIENTE':
        return 'Corriente';
      default:
        return tipo;
    }
  }
}

class _ComprobanteCard extends StatelessWidget {
  const _ComprobanteCard({required this.url});

  final String url;

  @override
  Widget build(BuildContext context) {
    final tema = Theme.of(context);
    return Card(
      margin: EdgeInsets.zero,
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: () => _abrirVisor(context, url),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(14, 14, 14, 8),
              child: Row(
                children: [
                  const Icon(Icons.receipt_long_outlined),
                  const SizedBox(width: 8),
                  Text(
                    'Comprobante del deposito',
                    style: tema.textTheme.titleSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const Spacer(),
                  Text(
                    'Toca para ampliar',
                    style: tema.textTheme.bodySmall?.copyWith(
                      color: tema.colorScheme.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            ),
            Image.network(
              url,
              width: double.infinity,
              height: 220,
              fit: BoxFit.cover,
              errorBuilder: (_, _, _) => Container(
                height: 220,
                color: tema.colorScheme.surfaceContainerHighest,
                alignment: Alignment.center,
                child: Icon(
                  Icons.image_not_supported_outlined,
                  size: 48,
                  color: tema.colorScheme.onSurfaceVariant,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _NotasCard extends StatelessWidget {
  const _NotasCard({required this.notas});

  final String notas;

  @override
  Widget build(BuildContext context) {
    final tema = Theme.of(context);
    return Card(
      margin: EdgeInsets.zero,
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Icon(Icons.sticky_note_2_outlined),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Notas',
                    style: tema.textTheme.titleSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(notas, style: tema.textTheme.bodyMedium),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _TituloSeccion extends StatelessWidget {
  const _TituloSeccion(this.texto);

  final String texto;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 4),
      child: Text(
        texto,
        style: Theme.of(context).textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
            ),
      ),
    );
  }
}

class _TarjetaPaquete extends StatelessWidget {
  const _TarjetaPaquete({required this.paquete});

  final PaqueteEnDeposito paquete;

  @override
  Widget build(BuildContext context) {
    final tema = Theme.of(context);
    final apagado = tema.colorScheme.onSurfaceVariant;
    final repartidor = paquete.repartidorEntrega;

    return Card(
      margin: EdgeInsets.zero,
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Text(
                    paquete.codigoSeguimiento,
                    style: tema.textTheme.titleSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                Text(
                  _formatoMoneda.format(paquete.montoContraEntrega),
                  style: tema.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const Divider(height: 18),
            _Fila(
              icono: Icons.person_outline,
              texto: paquete.nombreCliente,
            ),
            if (paquete.telefonoCliente != null &&
                paquete.telefonoCliente!.isNotEmpty)
              _Fila(
                icono: Icons.phone_outlined,
                texto: paquete.telefonoCliente!,
                accion: IconButton(
                  visualDensity: VisualDensity.compact,
                  iconSize: 18,
                  icon: const Icon(Icons.call_outlined),
                  onPressed: () => _llamar(paquete.telefonoCliente!),
                ),
              ),
            if (paquete.direccionDestino.isNotEmpty)
              _Fila(
                icono: Icons.location_on_outlined,
                texto: paquete.direccionDestino,
              ),
            if (paquete.entregadoEn != null)
              _Fila(
                icono: Icons.attach_money,
                texto:
                    'Cobrado el ${_formatoFechaCorta.format(paquete.entregadoEn!.toLocal())}',
              ),
            if (repartidor != null && repartidor.nombreCompleto.isNotEmpty)
              _Fila(
                icono: Icons.delivery_dining_outlined,
                texto: repartidor.nombreCompleto,
                subtexto: repartidor.telefono,
                accion: repartidor.telefono != null &&
                        repartidor.telefono!.isNotEmpty
                    ? IconButton(
                        visualDensity: VisualDensity.compact,
                        iconSize: 18,
                        icon: const Icon(Icons.call_outlined),
                        onPressed: () => _llamar(repartidor.telefono!),
                      )
                    : null,
              ),
            const SizedBox(height: 0),
            Align(
              alignment: Alignment.centerLeft,
              child: TextButton.icon(
                style: TextButton.styleFrom(
                  padding: const EdgeInsets.symmetric(horizontal: 8),
                  visualDensity: VisualDensity.compact,
                  textStyle: tema.textTheme.bodySmall?.copyWith(
                    color: apagado,
                  ),
                ),
                onPressed: () async {
                  await Clipboard.setData(
                    ClipboardData(text: paquete.codigoSeguimiento),
                  );
                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Codigo copiado'),
                        duration: Duration(seconds: 2),
                      ),
                    );
                  }
                },
                icon: const Icon(Icons.copy_outlined, size: 14),
                label: const Text('Copiar codigo'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _llamar(String telefono) async {
    final uri = Uri(scheme: 'tel', path: telefono);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }
}

class _Fila extends StatelessWidget {
  const _Fila({
    required this.icono,
    required this.texto,
    this.subtexto,
    this.accion,
  });

  final IconData icono;
  final String texto;
  final String? subtexto;
  final Widget? accion;

  @override
  Widget build(BuildContext context) {
    final tema = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icono, size: 18, color: tema.colorScheme.onSurfaceVariant),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(texto, style: tema.textTheme.bodyMedium),
                if (subtexto != null && subtexto!.isNotEmpty)
                  Text(
                    subtexto!,
                    style: tema.textTheme.bodySmall?.copyWith(
                      color: tema.colorScheme.onSurfaceVariant,
                    ),
                  ),
              ],
            ),
          ),
          ?accion,
        ],
      ),
    );
  }
}

class _ErrorDetalle extends StatelessWidget {
  const _ErrorDetalle({required this.mensaje, required this.onReintentar});

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

void _abrirVisor(BuildContext context, String url) {
  showDialog<void>(
    context: context,
    builder: (ctx) {
      return Dialog(
        backgroundColor: Colors.black,
        insetPadding: const EdgeInsets.all(16),
        child: Stack(
          children: [
            InteractiveViewer(
              child: Center(
                child: Image.network(
                  url,
                  fit: BoxFit.contain,
                  errorBuilder: (_, _, _) => const Padding(
                    padding: EdgeInsets.all(24),
                    child: Icon(
                      Icons.image_not_supported_outlined,
                      color: Colors.white,
                      size: 48,
                    ),
                  ),
                ),
              ),
            ),
            Positioned(
              top: 8,
              right: 8,
              child: IconButton(
                icon: const Icon(Icons.close, color: Colors.white),
                onPressed: () => Navigator.pop(ctx),
              ),
            ),
          ],
        ),
      );
    },
  );
}
