import 'package:flutter/material.dart';

import '../data/modelos/pedido.dart';

class TarjetaPedido extends StatelessWidget {
  final Pedido pedido;
  final VoidCallback? onTap;

  const TarjetaPedido({super.key, required this.pedido, this.onTap});

  @override
  Widget build(BuildContext context) {
    final esRecogida = pedido.estado == EstadoPedido.ASIGNADO;
    final direccion = esRecogida
        ? (pedido.direccionRecogida ?? 'Sin dirección de recogida')
        : (pedido.direccionEntrega ?? 'Sin dirección de entrega');

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      child: ListTile(
        onTap: onTap,
        leading: CircleAvatar(
          backgroundColor: _colorEstado(pedido.estado, context),
          child: Icon(
            esRecogida ? Icons.archive : Icons.local_shipping,
            color: Colors.white,
          ),
        ),
        title: Text(
          pedido.codigoSeguimiento,
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            Text(direccion, maxLines: 2, overflow: TextOverflow.ellipsis),
            const SizedBox(height: 4),
            Text(
              _etiquetaEstado(pedido.estado),
              style: TextStyle(
                color: _colorEstado(pedido.estado, context),
                fontSize: 12,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
        trailing: pedido.montoContraEntrega != null
            ? Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  const Text('Cobrar', style: TextStyle(fontSize: 11)),
                  Text(
                    '\$${pedido.montoContraEntrega}',
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                  ),
                ],
              )
            : const Icon(Icons.chevron_right),
      ),
    );
  }

  String _etiquetaEstado(EstadoPedido estado) {
    switch (estado) {
      case EstadoPedido.ASIGNADO:
        return 'ASIGNADO · pendiente recoger';
      case EstadoPedido.RECOGIDO:
        return 'RECOGIDO';
      case EstadoPedido.EN_TRANSITO:
        return 'EN TRÁNSITO';
      case EstadoPedido.EN_PUNTO_INTERCAMBIO:
        return 'EN PUNTO INTERCAMBIO';
      case EstadoPedido.EN_REPARTO:
        return 'EN REPARTO';
      case EstadoPedido.ENTREGADO:
        return 'ENTREGADO';
      case EstadoPedido.FALLIDO:
        return 'FALLIDO';
      case EstadoPedido.DEVUELTO:
        return 'DEVUELTO';
      case EstadoPedido.CANCELADO:
        return 'CANCELADO';
      case EstadoPedido.PENDIENTE_ASIGNACION:
        return 'PENDIENTE';
    }
  }

  Color _colorEstado(EstadoPedido estado, BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    switch (estado) {
      case EstadoPedido.ASIGNADO:
        return Colors.orange;
      case EstadoPedido.RECOGIDO:
      case EstadoPedido.EN_TRANSITO:
      case EstadoPedido.EN_PUNTO_INTERCAMBIO:
        return Colors.blue;
      case EstadoPedido.EN_REPARTO:
        return scheme.primary;
      case EstadoPedido.ENTREGADO:
        return Colors.green;
      case EstadoPedido.FALLIDO:
      case EstadoPedido.DEVUELTO:
      case EstadoPedido.CANCELADO:
        return Colors.red;
      case EstadoPedido.PENDIENTE_ASIGNACION:
        return Colors.grey;
    }
  }
}
