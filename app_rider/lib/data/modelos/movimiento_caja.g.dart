// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'movimiento_caja.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$MovimientoCajaImpl _$$MovimientoCajaImplFromJson(Map<String, dynamic> json) =>
    _$MovimientoCajaImpl(
      id: json['id'] as String,
      tipo: json['tipo'] as String,
      monto: json['monto'] as String,
      descripcion: json['descripcion'] as String?,
      pedidoId: json['pedidoId'] as String?,
      cierreId: json['cierreId'] as String?,
      codigoSeguimiento: json['codigoSeguimiento'] as String?,
      nombreCliente: json['nombreCliente'] as String?,
      creadoEn: DateTime.parse(json['creadoEn'] as String),
    );

Map<String, dynamic> _$$MovimientoCajaImplToJson(
  _$MovimientoCajaImpl instance,
) => <String, dynamic>{
  'id': instance.id,
  'tipo': instance.tipo,
  'monto': instance.monto,
  'descripcion': instance.descripcion,
  'pedidoId': instance.pedidoId,
  'cierreId': instance.cierreId,
  'codigoSeguimiento': instance.codigoSeguimiento,
  'nombreCliente': instance.nombreCliente,
  'creadoEn': instance.creadoEn.toIso8601String(),
};

_$SaldoPendienteImpl _$$SaldoPendienteImplFromJson(Map<String, dynamic> json) =>
    _$SaldoPendienteImpl(
      total: json['total'] as String,
      cantidad: (json['cantidad'] as num).toInt(),
    );

Map<String, dynamic> _$$SaldoPendienteImplToJson(
  _$SaldoPendienteImpl instance,
) => <String, dynamic>{'total': instance.total, 'cantidad': instance.cantidad};
