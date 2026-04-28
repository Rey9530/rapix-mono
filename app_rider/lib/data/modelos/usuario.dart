import 'package:freezed_annotation/freezed_annotation.dart';

part 'usuario.freezed.dart';
part 'usuario.g.dart';

@freezed
class Usuario with _$Usuario {
  const factory Usuario({
    required String id,
    required String email,
    required String telefono,
    required String nombreCompleto,
    required String rol,
    required String estado,
    String? urlAvatar,
    DateTime? ultimoIngresoEn,
    DateTime? creadoEn,
    DateTime? actualizadoEn,
  }) = _Usuario;

  factory Usuario.fromJson(Map<String, dynamic> json) => _$UsuarioFromJson(json);
}
