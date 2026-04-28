import 'package:dio/dio.dart';
import '../storage/almacenamiento_seguro.dart';

class InterceptorError extends Interceptor {
  final AlmacenamientoSeguro almacenamiento;
  final Dio dio;
  final Future<void> Function() alSesionExpirada;

  bool _refrescando = false;

  InterceptorError({
    required this.almacenamiento,
    required this.dio,
    required this.alSesionExpirada,
  });

  @override
  Future<void> onError(DioException err, ErrorInterceptorHandler handler) async {
    final esLogin = err.requestOptions.path.contains('/autenticacion/iniciar-sesion');
    final esRefresh = err.requestOptions.path.contains('/autenticacion/refrescar');
    final reintentado = err.requestOptions.extra['_reintentadoTrasRefresh'] == true;

    if (err.response?.statusCode == 401 && !esLogin && !esRefresh && !reintentado) {
      try {
        final nuevo = await _refrescarTokens();
        if (nuevo) {
          final tokenAcceso = await almacenamiento.tokenAcceso();
          final opciones = err.requestOptions
            ..headers['Authorization'] = 'Bearer $tokenAcceso'
            ..extra['_reintentadoTrasRefresh'] = true;
          final respuesta = await dio.fetch<dynamic>(opciones);
          return handler.resolve(respuesta);
        }
      } catch (_) {
        // cae al alSesionExpirada
      }
      await almacenamiento.limpiar();
      await alSesionExpirada();
    }

    handler.next(err);
  }

  Future<bool> _refrescarTokens() async {
    if (_refrescando) return false;
    _refrescando = true;
    try {
      final tokenRefresco = await almacenamiento.tokenRefresco();
      if (tokenRefresco == null || tokenRefresco.isEmpty) return false;

      final respuesta = await dio.post<Map<String, dynamic>>(
        '/autenticacion/refrescar',
        data: {'tokenRefresco': tokenRefresco},
        options: Options(extra: {'omitirAuth': true}),
      );
      final datos = respuesta.data;
      if (datos == null) return false;
      await almacenamiento.guardarTokens(
        tokenAcceso: datos['tokenAcceso'] as String,
        tokenRefresco: datos['tokenRefresco'] as String,
      );
      return true;
    } finally {
      _refrescando = false;
    }
  }
}
