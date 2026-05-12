// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'cierre_financiero.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$ResumenCierreHoyImpl _$$ResumenCierreHoyImplFromJson(
  Map<String, dynamic> json,
) => _$ResumenCierreHoyImpl(
  fecha: json['fecha'] as String,
  montoEsperado: json['montoEsperado'] as String,
  cantidadMovimientos: (json['cantidadMovimientos'] as num).toInt(),
  movimientos: (json['movimientos'] as List<dynamic>)
      .map((e) => MovimientoCaja.fromJson(e as Map<String, dynamic>))
      .toList(),
);

Map<String, dynamic> _$$ResumenCierreHoyImplToJson(
  _$ResumenCierreHoyImpl instance,
) => <String, dynamic>{
  'fecha': instance.fecha,
  'montoEsperado': instance.montoEsperado,
  'cantidadMovimientos': instance.cantidadMovimientos,
  'movimientos': instance.movimientos,
};

_$CierreFinancieroImpl _$$CierreFinancieroImplFromJson(
  Map<String, dynamic> json,
) => _$CierreFinancieroImpl(
  id: json['id'] as String,
  repartidorId: json['repartidorId'] as String,
  fechaCierre: json['fechaCierre'] as String,
  montoEsperado: json['montoEsperado'] as String,
  montoReportado: json['montoReportado'] as String,
  diferencia: json['diferencia'] as String,
  estado: json['estado'] as String,
  comprobanteFotoUrl: json['comprobanteFotoUrl'] as String?,
  notas: json['notas'] as String?,
  creadoEn: json['creadoEn'] == null
      ? null
      : DateTime.parse(json['creadoEn'] as String),
  actualizadoEn: json['actualizadoEn'] == null
      ? null
      : DateTime.parse(json['actualizadoEn'] as String),
);

Map<String, dynamic> _$$CierreFinancieroImplToJson(
  _$CierreFinancieroImpl instance,
) => <String, dynamic>{
  'id': instance.id,
  'repartidorId': instance.repartidorId,
  'fechaCierre': instance.fechaCierre,
  'montoEsperado': instance.montoEsperado,
  'montoReportado': instance.montoReportado,
  'diferencia': instance.diferencia,
  'estado': instance.estado,
  'comprobanteFotoUrl': instance.comprobanteFotoUrl,
  'notas': instance.notas,
  'creadoEn': instance.creadoEn?.toIso8601String(),
  'actualizadoEn': instance.actualizadoEn?.toIso8601String(),
};
