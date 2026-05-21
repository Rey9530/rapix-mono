import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../nucleo/red/dio_cliente.dart';
import '../modelos/respuesta_autenticacion.dart';
import '../modelos/usuario.dart';

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

  /// POST /autenticacion/google. Envia el idToken obtenido del SDK de
  /// Google. El backend valida la firma, busca/crea el usuario y emite el
  /// par de tokens habitual. Si el usuario es nuevo, `usuario.registroCompleto`
  /// vendra en false: el router debe llevarlo a /completar-registro.
  Future<RespuestaAutenticacion> iniciarSesionConGoogle(String idToken) async {
    final respuesta = await _dio.post<Map<String, dynamic>>(
      '/autenticacion/google',
      data: {'idToken': idToken},
      options: Options(extra: {'omitirAuth': true}),
    );
    return RespuestaAutenticacion.desdeJson(respuesta.data!);
  }

  /// PATCH /autenticacion/completar-registro. Requiere JWT. Setea telefono
  /// + datos de PerfilVendedor y marca registroCompleto=true.
  Future<Usuario> completarRegistro({
    required String telefono,
    required String nombreNegocio,
    required String direccion,
    required double latitud,
    required double longitud,
  }) async {
    final respuesta = await _dio.patch<Map<String, dynamic>>(
      '/autenticacion/completar-registro',
      data: {
        'telefono': telefono,
        'nombreNegocio': nombreNegocio,
        'direccion': direccion,
        'latitud': latitud,
        'longitud': longitud,
      },
    );
    return Usuario.desdeJson(respuesta.data!);
  }

  Future<RespuestaAutenticacion> refrescar(String tokenRefresco) async {
    final respuesta = await _dio.post<Map<String, dynamic>>(
      '/autenticacion/refrescar',
      data: {'tokenRefresco': tokenRefresco},
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

  Future<void> reenviarVerificacion() async {
    await _dio.post<void>('/autenticacion/reenviar-verificacion');
  }

  Future<void> solicitarRecuperacionContrasena({
    required String email,
  }) async {
    await _dio.post<void>(
      '/autenticacion/solicitar-recuperacion-contrasena',
      data: {'email': email},
      options: Options(extra: {'omitirAuth': true}),
    );
  }

  Future<void> confirmarRecuperacionContrasena({
    required String email,
    required String codigo,
    required String nuevaContrasena,
  }) async {
    await _dio.post<void>(
      '/autenticacion/confirmar-recuperacion-contrasena',
      data: {
        'email': email,
        'codigo': codigo,
        'nuevaContrasena': nuevaContrasena,
      },
      options: Options(extra: {'omitirAuth': true}),
    );
  }
}

final autenticacionRepositorioProvider =
    Provider<AutenticacionRepositorio>((ref) {
  return AutenticacionRepositorio(ref.watch(dioClienteProvider));
});
