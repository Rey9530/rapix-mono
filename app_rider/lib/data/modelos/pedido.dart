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
    String? nombreCliente,
    String? telefonoCliente,
    String? emailCliente,
    String? direccionOrigen,
    double? latitudOrigen,
    double? longitudOrigen,
    String? notasOrigen,
    String? direccionDestino,
    double? latitudDestino,
    double? longitudDestino,
    String? notasDestino,
    String? descripcionPaquete,
    String? pesoPaqueteKg,
    String? valorDeclarado,
    String? urlFotoPaquete,
    String? metodoPago,
    String? modoFacturacion,
    String? costoEnvio,
    String? montoContraEntrega,
    DateTime? recogidoEn,
    DateTime? enIntercambioEn,
    DateTime? entregadoEn,
    DateTime? creadoEn,
    DateTime? actualizadoEn,
  }) = _Pedido;

  factory Pedido.fromJson(Map<String, dynamic> json) => _$PedidoFromJson(json);
}
