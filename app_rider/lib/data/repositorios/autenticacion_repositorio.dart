import 'dart:convert';

import 'package:dio/dio.dart';
import '../../core/network/excepciones_api.dart';
import '../../core/storage/almacenamiento_seguro.dart';
import '../modelos/respuesta_autenticacion.dart';
import '../modelos/usuario.dart';

class AutenticacionRepositorio {
  final Dio _dio;
  final AlmacenamientoSeguro _almacenamiento;

  AutenticacionRepositorio({
    required Dio dio,
    required AlmacenamientoSeguro almacenamiento,
  })  : _dio = dio,
        _almacenamiento = almacenamiento;

  Future<RespuestaAutenticacion> iniciarSesion({
    required String email,
    required String contrasena,
  }) async {
    try {
      final respuesta = await _dio.post<Map<String, dynamic>>(
        '/autenticacion/iniciar-sesion',
        data: {'email': email, 'contrasena': contrasena},
        options: Options(extra: {'omitirAuth': true}),
      );
      final datos = RespuestaAutenticacion.fromJson(respuesta.data!);
      await _almacenamiento.guardarTokens(
        tokenAcceso: datos.tokenAcceso,
        tokenRefresco: datos.tokenRefresco,
      );
      await _almacenamiento.guardarUsuario(jsonEncode(datos.usuario.toJson()));
      return datos;
    } on DioException catch (e) {
      throw _mapearError(e, 'No se pudo iniciar sesión');
    }
  }

  Future<void> cerrarSesion() async {
    final tokenRefresco = await _almacenamiento.tokenRefresco();
    try {
      if (tokenRefresco != null) {
        await _dio.post<void>(
          '/autenticacion/cerrar-sesion',
          data: {'tokenRefresco': tokenRefresco},
        );
      }
    } on DioException {
      // Silencioso: igual limpiamos tokens locales.
    } finally {
      await _almacenamiento.limpiar();
    }
  }

  Future<Usuario?> obtenerPerfil() async {
    final token = await _almacenamiento.tokenAcceso();
    if (token == null || token.isEmpty) return null;
    try {
      final respuesta = await _dio.get<Map<String, dynamic>>('/repartidores/yo');
      final datos = respuesta.data!;
      // Backend devuelve PerfilRepartidor con `usuario` adentro en /yo (admin) pero no aquí;
      // Por tanto, primero intento decodificar como Usuario directo, si falla fallback al campo `usuario`.
      Usuario? usuario;
      if (datos.containsKey('email') && datos.containsKey('rol')) {
        usuario = Usuario.fromJson(datos);
      } else if (datos['usuario'] is Map<String, dynamic>) {
        usuario = Usuario.fromJson(datos['usuario'] as Map<String, dynamic>);
      }
      if (usuario != null) {
        await _almacenamiento.guardarUsuario(jsonEncode(usuario.toJson()));
      }
      return usuario;
    } on DioException catch (e) {
      if (e.response?.statusCode == 401) return null;
      throw _mapearError(e, 'No se pudo obtener perfil');
    }
  }

  Future<Usuario?> usuarioCacheado() async {
    final raw = await _almacenamiento.usuario();
    if (raw == null || raw.isEmpty) return null;
    try {
      return Usuario.fromJson(jsonDecode(raw) as Map<String, dynamic>);
    } catch (_) {
      return null;
    }
  }

  ExcepcionApi _mapearError(DioException e, String mensajePorDefecto) {
    final statusCode = e.response?.statusCode;
    final data = e.response?.data;
    String mensaje = mensajePorDefecto;
    String? codigoNegocio;
    if (data is Map<String, dynamic>) {
      final msj = data['message'];
      if (msj is String) {
        mensaje = msj;
      } else if (msj is List && msj.isNotEmpty) {
        mensaje = msj.first.toString();
      }
      if (data['codigo'] is String) {
        codigoNegocio = data['codigo'] as String;
      }
    }
    if (statusCode == 401) {
      return ExcepcionAutenticacion(mensaje);
    }
    if (e.type == DioExceptionType.connectionError ||
        e.type == DioExceptionType.connectionTimeout ||
        e.type == DioExceptionType.receiveTimeout) {
      return ExcepcionRed(mensaje);
    }
    return ExcepcionApi(mensaje, codigoHttp: statusCode, codigoNegocio: codigoNegocio);
  }
}
