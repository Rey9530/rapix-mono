import 'package:dio/dio.dart';
import '../storage/almacenamiento_seguro.dart';

class InterceptorAutenticacion extends Interceptor {
  final AlmacenamientoSeguro almacenamiento;

  InterceptorAutenticacion({required this.almacenamiento});

  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final omitir = options.extra['omitirAuth'] == true;
    if (!omitir) {
      final token = await almacenamiento.tokenAcceso();
      if (token != null && token.isNotEmpty) {
        options.headers['Authorization'] = 'Bearer $token';
      }
    }
    handler.next(options);
  }
}
