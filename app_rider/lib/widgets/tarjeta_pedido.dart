import 'package:flutter/material.dart';

import '../data/modelos/pedido.dart';
import 'utiles_estado_pedido.dart';

class TarjetaPedido extends StatelessWidget {
  final Pedido pedido;
  final VoidCallback? onTap;

  const TarjetaPedido({super.key, required this.pedido, this.onTap});

  @override
  Widget build(BuildContext context) {
    final color = colorEstadoPedido(pedido.estado);
    final direccion = _direccionPrincipal();
    final icono = _icono();

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      child: ListTile(
        onTap: onTap,
        leading: CircleAvatar(
          backgroundColor: color,
          child: Icon(icono, color: Colors.white),
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
              etiquetaEstadoPedido(pedido.estado),
              style: TextStyle(
                color: color,
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

  String _direccionPrincipal() {
    switch (pedido.estado) {
      case EstadoPedido.ASIGNADO:
        return pedido.direccionOrigen ?? 'Sin dirección de recogida';
      case EstadoPedido.RECOGIDO:
      case EstadoPedido.EN_TRANSITO:
      case EstadoPedido.EN_PUNTO_INTERCAMBIO:
      case EstadoPedido.EN_REPARTO:
        return pedido.direccionDestino ?? 'Sin dirección de entrega';
      default:
        return pedido.direccionDestino ??
            pedido.direccionOrigen ??
            'Sin dirección';
    }
  }

  IconData _icono() {
    switch (pedido.estado) {
      case EstadoPedido.ASIGNADO:
        return Icons.archive;
      case EstadoPedido.RECOGIDO:
      case EstadoPedido.EN_TRANSITO:
      case EstadoPedido.EN_PUNTO_INTERCAMBIO:
        return Icons.directions_bike;
      case EstadoPedido.EN_REPARTO:
        return Icons.local_shipping;
      default:
        return Icons.assignment;
    }
  }
}
