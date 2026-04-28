import 'package:freezed_annotation/freezed_annotation.dart';
import 'usuario.dart';

part 'respuesta_autenticacion.freezed.dart';
part 'respuesta_autenticacion.g.dart';

@freezed
class RespuestaAutenticacion with _$RespuestaAutenticacion {
  const factory RespuestaAutenticacion({
    required Usuario usuario,
    required String tokenAcceso,
    required String tokenRefresco,
  }) = _RespuestaAutenticacion;

  factory RespuestaAutenticacion.fromJson(Map<String, dynamic> json) =>
      _$RespuestaAutenticacionFromJson(json);
}
