import 'package:dio/dio.dart';

import '../almacenamiento/almacenamiento_seguro.dart';

/// Anade el header `Authorization: Bearer <token>` cuando hay sesion.
class InterceptorAutenticacion extends Interceptor {
  InterceptorAutenticacion(this._almacen);

  final AlmacenamientoSeguro _almacen;

  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final omitirAuth = options.extra['omitirAuth'] == true;
    if (!omitirAuth) {
      final token = await _almacen.tokenAcceso();
      if (token != null && token.isNotEmpty) {
        options.headers['Authorization'] = 'Bearer $token';
      }
    }
    handler.next(options);
  }
}
