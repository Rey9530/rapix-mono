import 'package:freezed_annotation/freezed_annotation.dart';

part 'movimiento_caja.freezed.dart';
part 'movimiento_caja.g.dart';

@freezed
class MovimientoCaja with _$MovimientoCaja {
  const factory MovimientoCaja({
    required String id,
    required String tipo,
    required String monto,
    String? descripcion,
    String? pedidoId,
    String? cierreId,
    String? codigoSeguimiento,
    String? nombreCliente,
    required DateTime creadoEn,
  }) = _MovimientoCaja;

  factory MovimientoCaja.fromJson(Map<String, dynamic> json) =>
      _$MovimientoCajaFromJson(json);

  /// Normaliza el JSON recibido por el endpoint `/billetera/yo/pendientes`
  /// (entidad Prisma con `pedido` anidado) al shape aplanado que usa
  /// el modelo Freezed.
  factory MovimientoCaja.desdeJsonAnidado(Map<String, dynamic> json) {
    final pedido = json['pedido'] as Map<String, dynamic>?;
    return MovimientoCaja.fromJson({
      ...json,
      'codigoSeguimiento': pedido?['codigoSeguimiento'],
      'nombreCliente': pedido?['nombreCliente'],
    }..remove('pedido'));
  }
}

@freezed
class SaldoPendiente with _$SaldoPendiente {
  const factory SaldoPendiente({
    required String total,
    required int cantidad,
  }) = _SaldoPendiente;

  factory SaldoPendiente.fromJson(Map<String, dynamic> json) =>
      _$SaldoPendienteFromJson(json);
}
