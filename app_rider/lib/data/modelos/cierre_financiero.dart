import 'package:freezed_annotation/freezed_annotation.dart';

import 'movimiento_caja.dart';

part 'cierre_financiero.freezed.dart';
part 'cierre_financiero.g.dart';

@freezed
class ResumenCierreHoy with _$ResumenCierreHoy {
  const factory ResumenCierreHoy({
    required String fecha,
    required String montoEsperado,
    required int cantidadMovimientos,
    required List<MovimientoCaja> movimientos,
  }) = _ResumenCierreHoy;

  factory ResumenCierreHoy.fromJson(Map<String, dynamic> json) =>
      _$ResumenCierreHoyFromJson(json);
}

@freezed
class CierreFinanciero with _$CierreFinanciero {
  const factory CierreFinanciero({
    required String id,
    required String repartidorId,
    required String fechaCierre,
    required String montoEsperado,
    required String montoReportado,
    required String diferencia,
    required String estado,
    String? comprobanteFotoUrl,
    String? notas,
    DateTime? creadoEn,
    DateTime? actualizadoEn,
  }) = _CierreFinanciero;

  factory CierreFinanciero.fromJson(Map<String, dynamic> json) =>
      _$CierreFinancieroFromJson(json);
}
