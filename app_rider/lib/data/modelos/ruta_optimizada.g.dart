// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'ruta_optimizada.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$RutaOptimizadaImpl _$$RutaOptimizadaImplFromJson(Map<String, dynamic> json) =>
    _$RutaOptimizadaImpl(
      geometriaPolyline: json['geometriaPolyline'] as String,
      distanciaMetros: (json['distanciaMetros'] as num).toDouble(),
      duracionSegundos: (json['duracionSegundos'] as num).toDouble(),
      ordenWaypoints: (json['ordenWaypoints'] as List<dynamic>)
          .map((e) => (e as num).toInt())
          .toList(),
    );

Map<String, dynamic> _$$RutaOptimizadaImplToJson(
  _$RutaOptimizadaImpl instance,
) => <String, dynamic>{
  'geometriaPolyline': instance.geometriaPolyline,
  'distanciaMetros': instance.distanciaMetros,
  'duracionSegundos': instance.duracionSegundos,
  'ordenWaypoints': instance.ordenWaypoints,
};
