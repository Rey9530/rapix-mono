import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../datos/modelos/pedido.dart';
import 'estado_chip.dart';

class PedidoTarjeta extends StatelessWidget {
  const PedidoTarjeta({
    super.key,
    required this.pedido,
    required this.alTocar,
  });

  final Pedido pedido;
  final VoidCallback alTocar;

  @override
  Widget build(BuildContext context) {
    final formato = DateFormat('dd/MM/yyyy HH:mm');
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 12,
        ),
        title: Row(
          children: [
            Expanded(
              child: Text(
                pedido.codigoSeguimiento.isEmpty
                    ? '#${pedido.id.substring(0, 6)}'
                    : pedido.codigoSeguimiento,
                style: Theme.of(context).textTheme.titleMedium,
                overflow: TextOverflow.ellipsis,
              ),
            ),
            EstadoChip(estado: pedido.estado),
          ],
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 6),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                pedido.nombreCliente,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 2),
              Text(
                pedido.direccionDestino,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: Theme.of(context).textTheme.bodySmall,
              ),
              const SizedBox(height: 4),
              Text(
                formato.format(pedido.creadoEn),
                style: Theme.of(context).textTheme.labelSmall,
              ),
            ],
          ),
        ),
        trailing: const Icon(Icons.chevron_right),
        onTap: alTocar,
      ),
    );
  }
}
