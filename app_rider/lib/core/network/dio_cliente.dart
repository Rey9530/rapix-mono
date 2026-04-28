import 'package:dio/dio.dart';
import '../config/entorno.dart';
import '../storage/almacenamiento_seguro.dart';
import 'interceptor_autenticacion.dart';
import 'interceptor_error.dart';

class DioCliente {
  static Dio crear({
    required AlmacenamientoSeguro almacenamiento,
    required Future<void> Function() alSesionExpirada,
  }) {
    final dio = Dio(
      BaseOptions(
        baseUrl: Entorno.apiUrl,
        connectTimeout: const Duration(seconds: 10),
        receiveTimeout: const Duration(seconds: 20),
        sendTimeout: const Duration(seconds: 20),
        headers: <String, String>{
          'Accept': 'application/json',
        },
      ),
    );

    dio.interceptors.add(InterceptorAutenticacion(almacenamiento: almacenamiento));
    dio.interceptors.add(
      InterceptorError(
        almacenamiento: almacenamiento,
        dio: dio,
        alSesionExpirada: alSesionExpirada,
      ),
    );

    return dio;
  }
}
