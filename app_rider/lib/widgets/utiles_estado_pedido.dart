import 'package:flutter/material.dart';

import '../data/modelos/pedido.dart';

String etiquetaEstadoPedido(EstadoPedido estado) {
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

Color colorEstadoPedido(EstadoPedido estado) {
  switch (estado) {
    case EstadoPedido.ASIGNADO:
      return Colors.orange;
    case EstadoPedido.RECOGIDO:
    case EstadoPedido.EN_TRANSITO:
    case EstadoPedido.EN_PUNTO_INTERCAMBIO:
      return Colors.blue;
    case EstadoPedido.EN_REPARTO:
      return Colors.indigo;
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
