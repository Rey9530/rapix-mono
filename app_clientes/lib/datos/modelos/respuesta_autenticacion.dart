import 'usuario.dart';

class RespuestaAutenticacion {
  RespuestaAutenticacion({
    required this.usuario,
    required this.tokenAcceso,
    required this.tokenRefresco,
  });

  final Usuario usuario;
  final String tokenAcceso;
  final String tokenRefresco;

  factory RespuestaAutenticacion.desdeJson(Map<String, dynamic> json) {
    return RespuestaAutenticacion(
      usuario: Usuario.desdeJson(json['usuario'] as Map<String, dynamic>),
      tokenAcceso: json['tokenAcceso'] as String,
      tokenRefresco: json['tokenRefresco'] as String,
    );
  }
}
