import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../almacenamiento/almacenamiento_seguro.dart';

/// Maneja 401 intentando refrescar el token una vez.
class InterceptorError extends Interceptor {
  InterceptorError({
    required this.almacen,
    required this.dio,
    required this.ref,
  });

  final AlmacenamientoSeguro almacen;
  final Dio dio;
  final Ref ref;

  bool _refrescando = false;

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    final estado = err.response?.statusCode;
    final yaReintentado = err.requestOptions.extra['reintentado'] == true;
    final omitirAuth = err.requestOptions.extra['omitirAuth'] == true;

    if (estado == 401 && !yaReintentado && !omitirAuth && !_refrescando) {
      _refrescando = true;
      try {
        final tokenRefresco = await almacen.tokenRefresco();
        if (tokenRefresco == null || tokenRefresco.isEmpty) {
          await almacen.limpiar();
          return handler.next(err);
        }

        final respuesta = await dio.post<Map<String, dynamic>>(
          '/autenticacion/refrescar',
          data: {'tokenRefresco': tokenRefresco},
          options: Options(extra: {'omitirAuth': true}),
        );

        final datos = respuesta.data!;
        await almacen.guardarTokens(
          tokenAcceso: datos['tokenAcceso'] as String,
          tokenRefresco: datos['tokenRefresco'] as String,
        );

        final opciones = err.requestOptions
          ..headers['Authorization'] = 'Bearer ${datos['tokenAcceso']}'
          ..extra['reintentado'] = true;
        final reenvio = await dio.fetch<dynamic>(opciones);
        return handler.resolve(reenvio);
      } catch (_) {
        await almacen.limpiar();
        return handler.next(err);
      } finally {
        _refrescando = false;
      }
    }

    handler.next(err);
  }
}
