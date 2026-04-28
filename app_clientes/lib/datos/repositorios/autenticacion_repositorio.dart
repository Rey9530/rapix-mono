import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../nucleo/red/dio_cliente.dart';
import '../modelos/respuesta_autenticacion.dart';

class AutenticacionRepositorio {
  AutenticacionRepositorio(this._dio);

  final Dio _dio;

  Future<RespuestaAutenticacion> iniciarSesion({
    required String email,
    required String contrasena,
  }) async {
    final respuesta = await _dio.post<Map<String, dynamic>>(
      '/autenticacion/iniciar-sesion',
      data: {'email': email, 'contrasena': contrasena},
      options: Options(extra: {'omitirAuth': true}),
    );
    return RespuestaAutenticacion.desdeJson(respuesta.data!);
  }

  Future<RespuestaAutenticacion> registrar({
    required String email,
    required String telefono,
    required String contrasena,
    required String nombreCompleto,
    String rol = 'VENDEDOR',
    String? nombreNegocio,
    String? direccion,
    double? latitud,
    double? longitud,
  }) async {
    final respuesta = await _dio.post<Map<String, dynamic>>(
      '/autenticacion/registrar',
      data: {
        'email': email,
        'telefono': telefono,
        'contrasena': contrasena,
        'nombreCompleto': nombreCompleto,
        'rol': rol,
        'nombreNegocio': ?nombreNegocio,
        'direccion': ?direccion,
        'latitud': ?latitud,
        'longitud': ?longitud,
      },
      options: Options(extra: {'omitirAuth': true}),
    );
    return RespuestaAutenticacion.desdeJson(respuesta.data!);
  }

  Future<void> cerrarSesion(String tokenRefresco) async {
    await _dio.post<void>(
      '/autenticacion/cerrar-sesion',
      data: {'tokenRefresco': tokenRefresco},
    );
  }
}

final autenticacionRepositorioProvider =
    Provider<AutenticacionRepositorio>((ref) {
  return AutenticacionRepositorio(ref.watch(dioClienteProvider));
});
