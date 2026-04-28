// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'usuario.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$UsuarioImpl _$$UsuarioImplFromJson(Map<String, dynamic> json) =>
    _$UsuarioImpl(
      id: json['id'] as String,
      email: json['email'] as String,
      telefono: json['telefono'] as String,
      nombreCompleto: json['nombreCompleto'] as String,
      rol: json['rol'] as String,
      estado: json['estado'] as String,
      urlAvatar: json['urlAvatar'] as String?,
      ultimoIngresoEn: json['ultimoIngresoEn'] == null
          ? null
          : DateTime.parse(json['ultimoIngresoEn'] as String),
      creadoEn: json['creadoEn'] == null
          ? null
          : DateTime.parse(json['creadoEn'] as String),
      actualizadoEn: json['actualizadoEn'] == null
          ? null
          : DateTime.parse(json['actualizadoEn'] as String),
    );

Map<String, dynamic> _$$UsuarioImplToJson(_$UsuarioImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'email': instance.email,
      'telefono': instance.telefono,
      'nombreCompleto': instance.nombreCompleto,
      'rol': instance.rol,
      'estado': instance.estado,
      'urlAvatar': instance.urlAvatar,
      'ultimoIngresoEn': instance.ultimoIngresoEn?.toIso8601String(),
      'creadoEn': instance.creadoEn?.toIso8601String(),
      'actualizadoEn': instance.actualizadoEn?.toIso8601String(),
    };
