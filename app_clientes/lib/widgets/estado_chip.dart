import 'package:flutter/material.dart';

class EstadoChip extends StatelessWidget {
  const EstadoChip({super.key, required this.estado});

  final String estado;

  static const Map<String, ({Color color, String etiqueta})> _mapa = {
    'PENDIENTE_ASIGNACION': (
      color: Color(0xFFFFA000),
      etiqueta: 'Pendiente'
    ),
    'ASIGNADO': (color: Color(0xFF1976D2), etiqueta: 'Asignado'),
    'RECOGIDO': (color: Color(0xFF7B1FA2), etiqueta: 'Recogido'),
    'EN_TRANSITO': (color: Color(0xFF512DA8), etiqueta: 'En transito'),
    'EN_PUNTO_INTERCAMBIO': (
      color: Color(0xFF303F9F),
      etiqueta: 'En punto de intercambio'
    ),
    'EN_REPARTO': (color: Color(0xFF1565C0), etiqueta: 'En reparto'),
    'ENTREGADO': (color: Color(0xFF388E3C), etiqueta: 'Entregado'),
    'FALLIDO': (color: Color(0xFFD32F2F), etiqueta: 'Fallido'),
    'DEVUELTO': (color: Color(0xFF6D4C41), etiqueta: 'Devuelto'),
    'CANCELADO': (color: Color(0xFF616161), etiqueta: 'Cancelado'),
  };

  @override
  Widget build(BuildContext context) {
    final info = _mapa[estado] ??
        (color: Colors.grey, etiqueta: estado.replaceAll('_', ' '));
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: info.color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: info.color.withValues(alpha: 0.4)),
      ),
      child: Text(
        info.etiqueta,
        style: TextStyle(
          color: info.color,
          fontWeight: FontWeight.w600,
          fontSize: 12,
        ),
      ),
    );
  }
}
