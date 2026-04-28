import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../almacenamiento/almacenamiento_seguro.dart';
import '../config/entorno.dart';
import 'interceptor_autenticacion.dart';
import 'interceptor_error.dart';

class DioCliente {
  DioCliente._();

  static Dio crear({
    required AlmacenamientoSeguro almacen,
    required Ref ref,
  }) {
    final dio = Dio(
      BaseOptions(
        baseUrl: Entorno.urlApi,
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 30),
        headers: {'Accept': 'application/json'},
      ),
    );

    dio.interceptors.addAll([
      InterceptorAutenticacion(almacen),
      InterceptorError(almacen: almacen, dio: dio, ref: ref),
    ]);

    return dio;
  }
}

final dioClienteProvider = Provider<Dio>((ref) {
  final almacen = ref.watch(almacenamientoSeguroProvider);
  return DioCliente.crear(almacen: almacen, ref: ref);
});
