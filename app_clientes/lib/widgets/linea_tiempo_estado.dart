import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../datos/modelos/pedido.dart';

class LineaTiempoEstado extends StatelessWidget {
  const LineaTiempoEstado({super.key, required this.eventos});

  final List<EventoPedido> eventos;

  @override
  Widget build(BuildContext context) {
    if (eventos.isEmpty) {
      return const Padding(
        padding: EdgeInsets.symmetric(vertical: 16),
        child: Text('Aun no hay eventos registrados.'),
      );
    }
    final formato = DateFormat('dd/MM/yyyy HH:mm');
    final ordenados = [...eventos]
      ..sort((a, b) => a.creadoEn.compareTo(b.creadoEn));

    return Column(
      children: [
        for (var i = 0; i < ordenados.length; i++)
          _Hito(
            evento: ordenados[i],
            esPrimero: i == 0,
            esUltimo: i == ordenados.length - 1,
            formato: formato,
          ),
      ],
    );
  }
}

class _Hito extends StatelessWidget {
  const _Hito({
    required this.evento,
    required this.esPrimero,
    required this.esUltimo,
    required this.formato,
  });

  final EventoPedido evento;
  final bool esPrimero;
  final bool esUltimo;
  final DateFormat formato;

  @override
  Widget build(BuildContext context) {
    final colorPrimario = Theme.of(context).colorScheme.primary;
    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          SizedBox(
            width: 32,
            child: Column(
              children: [
                Container(
                  width: 2,
                  height: 12,
                  color:
                      esPrimero ? Colors.transparent : colorPrimario.withValues(alpha: 0.4),
                ),
                Container(
                  width: 14,
                  height: 14,
                  decoration: BoxDecoration(
                    color: colorPrimario,
                    shape: BoxShape.circle,
                  ),
                ),
                Expanded(
                  child: Container(
                    width: 2,
                    color: esUltimo
                        ? Colors.transparent
                        : colorPrimario.withValues(alpha: 0.4),
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(
                bottom: 16,
                top: 4,
                left: 8,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    (evento.estadoNuevo ?? evento.tipo).replaceAll('_', ' '),
                    style: Theme.of(context).textTheme.titleSmall,
                  ),
                  const SizedBox(height: 2),
                  Text(
                    formato.format(evento.creadoEn),
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                  if (evento.notas != null && evento.notas!.isNotEmpty) ...[
                    const SizedBox(height: 4),
                    Text(evento.notas!),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
