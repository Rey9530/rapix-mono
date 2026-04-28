// ignore_for_file: constant_identifier_names
// Razón: el glosario del proyecto (CLAUDE.md) exige SCREAMING_SNAKE_CASE para
// valores de enum, alineado con el `EstadoPedido` del backend Prisma.
import 'package:freezed_annotation/freezed_annotation.dart';

part 'pedido.freezed.dart';
part 'pedido.g.dart';

/// Estados posibles del pedido (alineado con `EstadoPedido` del backend).
enum EstadoPedido {
  PENDIENTE_ASIGNACION,
  ASIGNADO,
  RECOGIDO,
  EN_TRANSITO,
  EN_PUNTO_INTERCAMBIO,
  EN_REPARTO,
  ENTREGADO,
  CANCELADO,
  FALLIDO,
  DEVUELTO,
}

@freezed
class Pedido with _$Pedido {
  const factory Pedido({
    required String id,
    required String codigoSeguimiento,
    required EstadoPedido estado,
    String? metodoPago,
    String? direccionRecogida,
    String? direccionEntrega,
    String? nombreDestinatario,
    String? telefonoDestinatario,
    double? latitudRecogida,
    double? longitudRecogida,
    double? latitudEntrega,
    double? longitudEntrega,
    String? montoContraEntrega,
    String? notas,
    DateTime? creadoEn,
    DateTime? actualizadoEn,
  }) = _Pedido;

  factory Pedido.fromJson(Map<String, dynamic> json) => _$PedidoFromJson(json);
}
