import 'package:flutter/material.dart';

import '../nucleo/tema/tokens_rapix.dart';

/// Chip de estado de pedido. Reutiliza la paleta unificada de
/// [TokensRapix.estados] para mantener una sola fuente de verdad para los
/// colores por estado en toda la app.
class EstadoChip extends StatelessWidget {
  const EstadoChip({super.key, required this.estado});

  final String estado;

  static const Map<String, String> _etiquetas = {
    'PENDIENTE_ASIGNACION': 'Pendiente',
    'ASIGNADO': 'Asignado',
    'RECOGIDO': 'Recogido',
    'EN_TRANSITO': 'En transito',
    'EN_PUNTO_INTERCAMBIO': 'En punto de intercambio',
    'EN_REPARTO': 'En reparto',
    'ENTREGADO': 'Entregado',
    'FALLIDO': 'Fallido',
    'DEVUELTO': 'Devuelto',
    'CANCELADO': 'Cancelado',
  };

  @override
  Widget build(BuildContext context) {
    final colores = TokensRapix.estados[estado];
    final etiqueta = _etiquetas[estado] ?? estado.replaceAll('_', ' ');
    final fondo = colores?.fondo ?? tokens(context).superficieAlt;
    final texto = colores?.texto ?? tokens(context).tintaSilenciada;
    final punto = colores?.punto ?? tokens(context).tintaSuave;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: fondo,
        borderRadius: BorderRadius.circular(TokensRapix.radioPill),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 6,
            height: 6,
            decoration: BoxDecoration(color: punto, shape: BoxShape.circle),
          ),
          const SizedBox(width: 6),
          Text(
            etiqueta,
            style: TextStyle(
              color: texto,
              fontWeight: FontWeight.w600,
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }
}
