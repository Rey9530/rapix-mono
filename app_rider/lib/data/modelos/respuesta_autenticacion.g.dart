// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'respuesta_autenticacion.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$RespuestaAutenticacionImpl _$$RespuestaAutenticacionImplFromJson(
  Map<String, dynamic> json,
) => _$RespuestaAutenticacionImpl(
  usuario: Usuario.fromJson(json['usuario'] as Map<String, dynamic>),
  tokenAcceso: json['tokenAcceso'] as String,
  tokenRefresco: json['tokenRefresco'] as String,
);

Map<String, dynamic> _$$RespuestaAutenticacionImplToJson(
  _$RespuestaAutenticacionImpl instance,
) => <String, dynamic>{
  'usuario': instance.usuario,
  'tokenAcceso': instance.tokenAcceso,
  'tokenRefresco': instance.tokenRefresco,
};
